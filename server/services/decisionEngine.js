import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { logDocumentVerification } from "../db.js";
import { extractTextFromPDF, extractTextFromImage } from "./textExtraction.js";
import { validateDocumentText } from "./patternValidators.js";
import { classifyDocumentWithAI } from "./aiVisionFallback.js";

const isVercel = process.env.VERCEL || process.env.NOW_BUILDER;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MANUAL_REVIEW_DIR = isVercel
  ? "/tmp/uploads/manual_review"
  : path.join(__dirname, "..", "uploads", "manual_review");

/**
 * Orchestrates the layered document verification check.
 * @param {object} params
 * @param {Buffer} params.fileBuffer Raw document file buffer
 * @param {string} params.fileName Name of the uploaded file
 * @param {string} params.fileMimeType MIME type of the file (application/pdf, image/jpeg, etc.)
 * @param {string} params.expectedType GST | PAN | COMPANY_REG
 * @param {string} [params.imageBase64] base64 encoded first page image
 * @returns {Promise<object>} Verification JSON response
 */
export async function verifyDocument({ fileBuffer, fileName, fileMimeType, expectedType, imageBase64 }) {
  console.log(`[DecisionEngine] Starting verification for: ${fileName} (expected: ${expectedType}, mime: ${fileMimeType})`);
  
  let extractedText = "";
  let finalStatus = "manual_review";
  let detectedType = "UNKNOWN";
  let confidence = 0.0;
  let reason = "";
  let extractedFields = {};
  let logs = [];

  // Step 1: Text extraction from digital PDF
  if (fileMimeType === "application/pdf") {
    console.log("[DecisionEngine] Parsing digital PDF text layer...");
    extractedText = await extractTextFromPDF(fileBuffer);
    logs.push(`PDF text layer extraction: ${extractedText.length} characters found.`);
    
    // Step 2: Layer 2 Pattern Check on digital PDF text
    if (extractedText.trim().length > 20) {
      const pResult = validateDocumentText(extractedText, expectedType);
      console.log(`[DecisionEngine] Layer 2 digital PDF verdict: ${pResult.status} (detected: ${pResult.detectedType}, conf: ${pResult.confidence})`);
      if (pResult.status !== "ambiguous") {
        await logAndSave({
          fileName,
          expectedType,
          detectedType: pResult.detectedType,
          status: pResult.status,
          confidence: pResult.confidence,
          reason: pResult.reason,
          extractedText,
          extractedFields: pResult.extractedFields,
          fileBuffer
        });
        return {
          status: pResult.status,
          detectedType: pResult.detectedType,
          confidence: pResult.confidence,
          reason: pResult.reason,
          extractedFields: pResult.extractedFields
        };
      }
      logs.push("Layer 2 digital check was ambiguous.");
    } else {
      logs.push("PDF text layer was empty or too short. Treating as scanned PDF.");
    }
  } else {
    logs.push("File is an image. Skipping PDF text layer extraction.");
  }

  // Step 3: OCR Fallback on the first page image
  let imageBuffer = null;
  if (imageBase64) {
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    imageBuffer = Buffer.from(cleanBase64, "base64");
  } else if (fileMimeType.startsWith("image/")) {
    imageBuffer = fileBuffer;
  }

  if (imageBuffer) {
    console.log("[DecisionEngine] Running OCR fallback...");
    const ocrText = await extractTextFromImage(imageBuffer);
    logs.push(`OCR extraction: ${ocrText.length} characters found.`);
    extractedText = (extractedText + "\n" + ocrText).trim();

    if (ocrText.trim().length > 10) {
      const ocrResult = validateDocumentText(ocrText, expectedType);
      console.log(`[DecisionEngine] Layer 2 OCR verdict: ${ocrResult.status} (detected: ${ocrResult.detectedType}, conf: ${ocrResult.confidence})`);
      if (ocrResult.status !== "ambiguous") {
        await logAndSave({
          fileName,
          expectedType,
          detectedType: ocrResult.detectedType,
          status: ocrResult.status,
          confidence: ocrResult.confidence,
          reason: ocrResult.reason,
          extractedText,
          extractedFields: ocrResult.extractedFields,
          fileBuffer
        });
        return {
          status: ocrResult.status,
          detectedType: ocrResult.detectedType,
          confidence: ocrResult.confidence,
          reason: ocrResult.reason,
          extractedFields: ocrResult.extractedFields
        };
      }
      logs.push("OCR check was ambiguous.");
    } else {
      logs.push("OCR text was too short.");
    }
  } else {
    logs.push("No first page image or image buffer available for OCR.");
  }

  // Step 4: AI Vision Fallback (Layer 3)
  console.log("[DecisionEngine] Triggering AI vision fallback (Layer 3)...");
  try {
    const aiResult = await classifyDocumentWithAI({
      imageBase64: imageBase64 || (fileMimeType.startsWith("image/") ? fileBuffer.toString("base64") : null),
      text: extractedText,
      expectedType
    });

    console.log("[DecisionEngine] AI Vision response:", aiResult);
    
    const aiConfidence = aiResult.confidence || 0;
    const aiDetected = aiResult.detected_type || "OTHER";
    
    // Map AI types to expected Type
    const typeMap = {
      "GST_CERTIFICATE": "GST",
      "PAN_CARD": "PAN",
      "COMPANY_REGISTRATION": "COMPANY_REG",
      "OTHER": "OTHER",
      "UNREADABLE": "UNREADABLE"
    };

    const mappedDetectedType = typeMap[aiDetected] || aiDetected;

    if (aiConfidence >= 0.8) {
      finalStatus = aiResult.matches_expected_type ? "accepted" : "rejected";
      detectedType = mappedDetectedType;
      confidence = aiConfidence;
      reason = aiResult.reason || "AI classification verdict.";
    } else {
      finalStatus = "manual_review";
      detectedType = mappedDetectedType;
      confidence = aiConfidence;
      reason = aiResult.reason || "AI confidence score is too low for auto-decision.";
    }
  } catch (aiErr) {
    console.error("[DecisionEngine] AI Vision fallback failed:", aiErr);
    finalStatus = "manual_review";
    detectedType = "UNKNOWN";
    confidence = 0.0;
    reason = `AI Vision failed: ${aiErr.message}. Routing to manual review.`;
  }

  // Final Action: Log and save
  await logAndSave({
    fileName,
    expectedType,
    detectedType,
    status: finalStatus,
    confidence,
    reason,
    extractedText,
    extractedFields,
    fileBuffer
  });

  return {
    status: finalStatus,
    detectedType,
    confidence,
    reason,
    extractedFields
  };
}

/**
 * Log decision to database audit table and save file locally if manual review.
 */
async function logAndSave({ fileName, expectedType, detectedType, status, confidence, reason, extractedText, extractedFields, fileBuffer }) {
  console.log(`[DecisionEngine] Final decision: ${status} for ${fileName}. Logging audit record.`);
  
  // 1. Audit log in DB
  try {
    logDocumentVerification({
      file_name: fileName,
      expected_type: expectedType,
      detected_type: detectedType,
      status,
      confidence,
      reason,
      extracted_text: extractedText
    });
  } catch (dbErr) {
    console.error("[DecisionEngine] DB logging error:", dbErr);
  }

  // 2. If manual review, save file to manual review uploads folder
  if (status === "manual_review" && fileBuffer) {
    try {
      fs.mkdirSync(MANUAL_REVIEW_DIR, { recursive: true });
      const uniqueFileName = `${Date.now()}_${fileName}`;
      fs.writeFileSync(path.join(MANUAL_REVIEW_DIR, uniqueFileName), fileBuffer);
      console.log(`[DecisionEngine] Stored document in manual review directory: ${uniqueFileName}`);
    } catch (fsErr) {
      console.error("[DecisionEngine] File save error:", fsErr);
    }
  }
}
