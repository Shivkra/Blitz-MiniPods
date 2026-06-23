import { PDFParse } from "pdf-parse";
import { createWorker } from "tesseract.js";

/**
 * Extracts text layer from a digital PDF buffer.
 * @param {Buffer} pdfBuffer 
 * @returns {Promise<string>} Extracted text
 */
export async function extractTextFromPDF(pdfBuffer) {
  try {
    const parser = new PDFParse({ data: pdfBuffer });
    const result = await parser.getText();
    return result.text || "";
  } catch (err) {
    console.error("[TextExtraction] Error parsing PDF text layer:", err);
    return "";
  }
}

/**
 * Performs OCR on an image buffer to extract text.
 * @param {Buffer} imageBuffer 
 * @returns {Promise<string>} Extracted OCR text
 */
export async function extractTextFromImage(imageBuffer) {
  let worker = null;
  try {
    worker = await createWorker("eng", 1, { cachePath: "/tmp" });
    const { data: { text } } = await worker.recognize(imageBuffer);
    return text || "";
  } catch (err) {
    console.error("[TextExtraction] Tesseract OCR error:", err);
    return "";
  } finally {
    if (worker) {
      try {
        await worker.terminate();
      } catch (termErr) {
        console.error("[TextExtraction] Error terminating Tesseract worker:", termErr);
      }
    }
  }
}
