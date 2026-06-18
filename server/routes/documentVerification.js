import express from "express";
import multer from "multer";
import { verifyDocument } from "../services/decisionEngine.js";

const router = express.Router();

// Multer memory storage with 10MB file size limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

router.post("/verify", upload.single("file"), async (req, res) => {
  try {
    const { expectedType, imageBase64 } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file was uploaded." });
    }

    if (!expectedType || !["GST", "PAN", "COMPANY_REG"].includes(expectedType)) {
      return res.status(400).json({ 
        error: "Invalid or missing expectedType. Must be GST, PAN, or COMPANY_REG." 
      });
    }

    const result = await verifyDocument({
      fileBuffer: file.buffer,
      fileName: file.originalname,
      fileMimeType: file.mimetype,
      expectedType,
      imageBase64
    });

    res.json(result);
  } catch (err) {
    console.error("[DocumentVerificationRoute] Error processing verification:", err);
    res.status(500).json({
      error: "Internal server error during document verification.",
      details: err.message
    });
  }
});

export default router;
