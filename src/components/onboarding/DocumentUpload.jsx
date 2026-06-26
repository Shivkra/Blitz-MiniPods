import React, { useEffect } from "react";
import "./DocumentUpload.css";
import { useDocumentVerification } from "../../hooks/useDocumentVerification.js";

// Local SVG icons for self-containment
const Icon = {
  File: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  Check: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  AlertTriangle: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  Clock: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Spinner: () => (
    <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.15)" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="var(--accent)" />
    </svg>
  )
};

export default function DocumentUpload({
  doc,
  uploads,
  errors,
  onUploadSuccess,
  onUploadRemove,
  clearError,
  formatFileSize
}) {
  const {
    loading,
    status,
    reason,
    verifyDocument,
    resetVerification
  } = useDocumentVerification();

  const fileData = uploads[doc.id];
  const hasUpload = !!fileData;
  const isVerifiable = ["gst", "pan", "reg"].includes(doc.id);

  // Sync status if file was removed externally
  useEffect(() => {
    if (!hasUpload) {
      resetVerification();
    }
  }, [hasUpload]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check size limit (10MB for our new verify endpoint)
    const limit = 10 * 1024 * 1024;
    if (file.size > limit) {
      alert("File size exceeds 10 MB limit.");
      e.target.value = "";
      return;
    }

    if (isVerifiable) {
      // Map slot ID to expected verification type
      const expectedTypeMap = {
        gst: "GST",
        pan: "PAN",
        reg: "COMPANY_REG"
      };

      const expectedType = expectedTypeMap[doc.id];
      const result = await verifyDocument(file, expectedType);

      if (result.status === "accepted" || result.status === "manual_review") {
        // Read file content for visual states in frontend
        const reader = new FileReader();
        reader.onloadend = () => {
          onUploadSuccess(doc.id, {
            name: file.name,
            type: file.type,
            size: file.size,
            data: reader.result,
            isManualReview: result.status === "manual_review",
            verificationReason: result.reason
          });
        };
        reader.readAsDataURL(file);
      } else {
        // Auto-rejected: Clear input value
        e.target.value = "";
      }
    } else {
      // Standard upload (e.g. Catalog sheets)
      const reader = new FileReader();
      reader.onloadend = () => {
        onUploadSuccess(doc.id, {
          name: file.name,
          type: file.type,
          size: file.size,
          data: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onUploadRemove(doc.id);
    resetVerification();
    const el = document.getElementById(`file-input-${doc.id}`);
    if (el) el.value = "";
  };

  // Determine visual border/color state
  let stateClass = "";
  let errorMsg = errors[`doc_${doc.id}`];

  if (loading) {
    stateClass = "loading";
  } else if (hasUpload) {
    if (fileData.isManualReview) {
      stateClass = "review";
    } else {
      stateClass = "uploaded";
    }
  } else if (status === "rejected") {
    stateClass = "rejected";
    errorMsg = reason || "Document verification failed.";
  } else if (errorMsg) {
    stateClass = "error";
  }

  // Get status color coding
  const getStatusBlock = () => {
    if (loading) {
      return (
        <div className="doc-status-alert loading-alert">
          <Icon.Spinner />
          <span>Verifying document authenticity…</span>
        </div>
      );
    }

    if (status === "rejected") {
      return (
        <div className="doc-status-alert reject-alert">
          <Icon.AlertTriangle />
          <div>
            <strong>Verification Rejected:</strong> {reason}
          </div>
        </div>
      );
    }

    if (hasUpload && fileData.isManualReview) {
      return (
        <div className="doc-status-alert review-alert">
          <Icon.Clock />
          <div>
            <strong>Under Manual Review:</strong> We are verifying this document manually. You can proceed with the onboarding flow in the meantime.
          </div>
        </div>
      );
    }

    if (hasUpload && isVerifiable) {
      return (
        <div className="doc-status-alert accept-alert">
          <Icon.Check />
          <span>Document successfully verified and matched.</span>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={`doc-item-wrapper ${stateClass}`}>
      <label
        htmlFor={hasUpload || loading ? undefined : `file-input-${doc.id}`}
        className="doc-item"
        style={errorMsg ? { borderColor: "rgba(239, 68, 68, 0.4)" } : undefined}
      >
        <input
          type="file"
          id={`file-input-${doc.id}`}
          style={{ display: "none" }}
          accept={doc.id === "cat" ? ".xlsx,.xls" : "application/pdf"}
          disabled={hasUpload || loading}
          onChange={handleFileChange}
        />

        <div className="doc-icon">
          {loading ? (
            <Icon.Spinner />
          ) : hasUpload ? (
            fileData.isManualReview ? <Icon.Clock /> : <Icon.Check />
          ) : (
            <Icon.File />
          )}
        </div>

        <div className="doc-info">
          <h5>{doc.name}</h5>
          <p>
            {hasUpload
              ? `${fileData.name} (${formatFileSize(fileData.size)})`
              : doc.sub}
          </p>
        </div>

        <span className={`doc-badge ${doc.req ? "req" : "opt"}`}>
          {doc.req ? "Required" : "Optional"}
        </span>

        {hasUpload && !loading ? (
          <button
            type="button"
            className="doc-remove-btn"
            onClick={handleRemove}
            aria-label="Remove document"
          >
            ✕
          </button>
        ) : !loading ? (
          <span className="doc-action">Upload</span>
        ) : null}
      </label>

      {getStatusBlock()}
    </div>
  );
}
