import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

// Configure pdfjs worker to fetch from CDN matching the installed version
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

/**
 * Custom hook to manage document upload verification states and flows.
 */
export function useDocumentVerification() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'accepted' | 'rejected' | 'manual_review' | null
  const [reason, setReason] = useState("");
  const [detectedType, setDetectedType] = useState("");

  const resetVerification = () => {
    setLoading(false);
    setStatus(null);
    setReason("");
    setDetectedType("");
  };

  /**
   * Reads a PDF file, renders the first page onto a canvas,
   * and outputs a base64 encoded JPEG data URL.
   */
  const renderPdfFirstPageBase64 = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const typedarray = new Uint8Array(e.target.result);
          const loadingTask = pdfjsLib.getDocument({ data: typedarray });
          const pdf = await loadingTask.promise;
          
          if (pdf.numPages === 0) {
            resolve(null);
            return;
          }
          
          const page = await pdf.getPage(1);
          // Standard scale for good OCR readability
          const viewport = page.getViewport({ scale: 1.5 });
          
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const context = canvas.getContext("2d");
          
          await page.render({
            canvasContext: context,
            viewport: viewport
          }).promise;
          
          // Export page image as JPEG (smaller payload size than PNG)
          const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
          resolve(dataUrl);
        } catch (err) {
          console.error("[useDocumentVerification] Error rendering PDF first page:", err);
          resolve(null);
        }
      };
      reader.onerror = () => resolve(null);
      reader.readAsArrayBuffer(file);
    });
  };

  /**
   * Uploads and verifies the document.
   * @param {File} file Uploaded HTML5 File object
   * @param {string} expectedType GST | PAN | COMPANY_REG
   */
  const verifyDocument = async (file, expectedType) => {
    setLoading(true);
    setStatus(null);
    setReason("");
    setDetectedType("");

    try {
      let imageBase64 = null;

      // Render first page if file is a PDF
      if (file.type === "application/pdf") {
        console.log("[useDocumentVerification] PDF file detected, rendering first page to raster image...");
        imageBase64 = await renderPdfFirstPageBase64(file);
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("expectedType", expectedType);
      
      if (imageBase64) {
        formData.append("imageBase64", imageBase64);
      }

      const response = await fetch("/api/documents/verify", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const errPayload = await response.json().catch(() => ({}));
        throw new Error(errPayload.error || `Server responded with HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log("[useDocumentVerification] Result received:", data);
      
      setStatus(data.status); // 'accepted' | 'rejected' | 'manual_review'
      setReason(data.reason || "");
      setDetectedType(data.detectedType || "");
      setLoading(false);
      
      return data;
    } catch (err) {
      console.error("[useDocumentVerification] Verification pipeline failed:", err);
      setStatus("rejected");
      setReason(err.message || "Failed to verify document. Please check your network connection.");
      setLoading(false);
      return {
        status: "rejected",
        reason: err.message || "Failed to verify document."
      };
    }
  };

  return {
    loading,
    status,
    reason,
    detectedType,
    verifyDocument,
    resetVerification
  };
}
