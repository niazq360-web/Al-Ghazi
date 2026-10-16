import React, { useRef } from "react";
import { Camera, Upload, Trash2, User } from "lucide-react";

/**
 * ImageUploadField Component
 * Allows uploading and previewing student and teacher profile photos.
 * Converts selected image to base64 Data URL for persistent offline storage.
 */
export default function ImageUploadField({
  value = "",
  onChange,
  label = "Upload Photo",
  placeholderText = "Passport Size Photo (JPG/PNG/WEBP)",
  subText = "Photo will appear on Admission Form, ID Card, and Profile",
  shape = "square" // "square" or "circle"
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (JPG, PNG, or WEBP).");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      alert("Image size exceeds 4MB. Please choose a smaller photo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      onChange(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
      <label className="form-label">{label}</label>

      <div
        className="photo-upload-zone"
        onClick={() => fileInputRef.current?.click()}
        style={{ cursor: "pointer" }}
      >
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        {/* Thumbnail Preview Box */}
        <div
          style={{
            width: shape === "circle" ? "70px" : "72px",
            height: shape === "circle" ? "70px" : "86px",
            borderRadius: shape === "circle" ? "50%" : "8px",
            border: value ? "2px solid #2563eb" : "2px dashed #94a3b8",
            backgroundColor: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            flexShrink: 0,
            boxShadow: value ? "0 2px 6px rgba(0,0,0,0.1)" : "none",
            position: "relative"
          }}
        >
          {value ? (
            <img
              src={value}
              alt="Uploaded Preview"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div style={{ textAlign: "center", color: "#94a3b8" }}>
              <Camera size={26} color="#64748b" />
            </div>
          )}
        </div>

        {/* Action Controls & Instructions */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="btn btn-secondary"
              style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem", gap: "5px" }}
            >
              <Upload size={14} />
              <span>{value ? "Change Photo" : "Choose Photo"}</span>
            </button>

            {value && (
              <button
                type="button"
                onClick={handleRemove}
                className="btn btn-danger"
                style={{ padding: "0.35rem 0.65rem", fontSize: "0.8rem", gap: "4px" }}
                title="Remove photo"
              >
                <Trash2 size={13} />
                <span>Remove</span>
              </button>
            )}
          </div>

          <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.35rem", marginBottom: 0 }}>
            {placeholderText}
          </p>
          <span style={{ fontSize: "0.7rem", color: "#94a3b8", display: "block" }}>
            {subText}
          </span>
        </div>
      </div>
    </div>
  );
}
