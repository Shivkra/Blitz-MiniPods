/**
 * Pattern and Keyword Validators for Document Verification
 */

// Regex patterns (global search within text)
export const PAN_REGEX = /[A-Z]{5}[0-9]{4}[A-Z]/g;
export const GSTIN_REGEX = /[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}/g;
export const CIN_REGEX = /[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}/g;

// Keywords (case-insensitive)
export const KEYWORDS = {
  GST: [
    "goods and services tax",
    "gstin",
    "certificate of registration",
    "form gst",
    "government of india"
  ],
  PAN: [
    "income tax department",
    "permanent account number",
    "govt of india",
    "card",
    "father's name"
  ],
  COMPANY_REG: [
    "certificate of incorporation",
    "registrar of companies",
    "ministry of corporate affairs",
    "corporate identity number",
    "mca",
    "cin"
  ]
};

/**
 * Validates a GSTIN using Luhn Mod 36 checksum algorithm.
 * @param {string} gstin 15-character GSTIN
 * @returns {boolean} True if checksum is valid
 */
export function validateGSTINChecksum(gstin) {
  if (!gstin || gstin.length !== 15) return false;
  
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let sum = 0;
  
  for (let i = 0; i < 14; i++) {
    const charValue = chars.indexOf(gstin[i].toUpperCase());
    if (charValue === -1) return false;
    
    // Alternating weight: 1, 2, 1, 2...
    const weight = (i % 2 === 0) ? 1 : 2;
    const product = charValue * weight;
    
    sum += Math.floor(product / 36) + (product % 36);
  }
  
  const remainder = sum % 36;
  const checkCode = (36 - remainder) % 36;
  
  return gstin[14].toUpperCase() === chars[checkCode];
}

/**
 * Scores and classifies extracted document text.
 * @param {string} text Raw text extracted from document
 * @param {string} expectedType GST | PAN | COMPANY_REG
 * @returns {object} Score and validation result
 */
export function validateDocumentText(text, expectedType) {
  if (!text) {
    return {
      status: "ambiguous",
      detectedType: "UNKNOWN",
      confidence: 0,
      reason: "No text was extracted from the document.",
      score: { GST: 0, PAN: 0, COMPANY_REG: 0 },
      extractedFields: {}
    };
  }

  const cleanText = text.toLowerCase();
  const upperText = text.toUpperCase();

  // Find regex matches
  const gstins = [...new Set(upperText.match(GSTIN_REGEX) || [])];
  const rawPans = [...new Set(upperText.match(PAN_REGEX) || [])];
  const cins = [...new Set(upperText.match(CIN_REGEX) || [])];

  // A GSTIN embeds a PAN (chars 3-12). We filter out PAN matches that are subparts of matched GSTINs.
  const pans = rawPans.filter(pan => !gstins.some(gstin => gstin.includes(pan)));

  // Calculate keyword matches
  const keywordCounts = { GST: 0, PAN: 0, COMPANY_REG: 0 };
  for (const [type, keys] of Object.entries(KEYWORDS)) {
    for (const key of keys) {
      let pos = cleanText.indexOf(key);
      while (pos !== -1) {
        keywordCounts[type]++;
        pos = cleanText.indexOf(key, pos + 1);
      }
    }
  }

  // Calculate scores
  const score = { GST: 0, PAN: 0, COMPANY_REG: 0 };

  // Keywords weights
  score.GST += keywordCounts.GST * 2;
  score.PAN += keywordCounts.PAN * 2;
  score.COMPANY_REG += keywordCounts.COMPANY_REG * 2;

  // Regex weights & Checksums
  let validGSTINs = [];
  let invalidGSTINs = [];
  
  gstins.forEach(gstin => {
    if (validateGSTINChecksum(gstin)) {
      score.GST += 12;
      validGSTINs.push(gstin);
    } else {
      score.GST += 4; // Low weight for failed checksum
      invalidGSTINs.push(gstin);
    }
  });

  pans.forEach(() => {
    score.PAN += 8;
  });

  cins.forEach(() => {
    score.COMPANY_REG += 8;
  });

  // Extracted Fields
  const extractedFields = {};
  if (gstins.length > 0) extractedFields.gstin = gstins[0];
  if (pans.length > 0) extractedFields.pan = pans[0];
  if (cins.length > 0) extractedFields.cin = cins[0];

  // Determine detected type based on max score
  let detectedType = "UNKNOWN";
  let maxScore = 0;
  
  if (score.GST > maxScore) {
    detectedType = "GST";
    maxScore = score.GST;
  }
  if (score.PAN > score.GST && score.PAN > score.COMPANY_REG) {
    detectedType = "PAN";
    maxScore = score.PAN;
  }
  if (score.COMPANY_REG > score.GST && score.COMPANY_REG > score.PAN) {
    detectedType = "COMPANY_REG";
    maxScore = score.COMPANY_REG;
  }

  const result = {
    detectedType,
    score,
    extractedFields,
    confidence: 0
  };

  // Helper mappings for messages
  const docTypeNameMap = {
    GST: "GST registration certificate",
    PAN: "PAN card",
    COMPANY_REG: "Company registration certificate (CIN)"
  };

  const expectedName = docTypeNameMap[expectedType];

  // Compute confidence (simplified ratio)
  const totalScoreSum = score.GST + score.PAN + score.COMPANY_REG;
  if (totalScoreSum > 0) {
    result.confidence = parseFloat((maxScore / totalScoreSum).toFixed(2));
  }

  // Check decision logic
  if (detectedType === expectedType && maxScore >= 6) {
    // If GST but checksum fails on all found GSTINs, reject for validation check
    if (expectedType === "GST" && gstins.length > 0 && validGSTINs.length === 0) {
      result.status = "rejected";
      result.reason = `This document contains a GSTIN (${gstins[0]}) but it failed checksum verification. Please upload a valid, correct document.`;
    } else {
      result.status = "accepted";
      result.reason = `Successfully verified as a ${expectedName}.`;
      // Set high confidence for deterministic match
      result.confidence = Math.max(result.confidence, 0.95);
    }
  } else if (detectedType !== "UNKNOWN" && score[detectedType] >= 6 && score[detectedType] > score[expectedType]) {
    // Confident mismatch
    const detectedName = docTypeNameMap[detectedType];
    result.status = "rejected";
    result.reason = `This looks like a ${detectedName}, not a ${expectedName}. Please upload the correct document.`;
  } else {
    // Ambiguous
    result.status = "ambiguous";
    result.reason = `Verification was inconclusive. The content patterns do not strongly identify this document as a ${expectedName}.`;
  }

  return result;
}
