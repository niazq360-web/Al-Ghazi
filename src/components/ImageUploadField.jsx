import React, { useRef } from 'react';
import { Camera, Upload, X, User } from 'lucide-react';

/**
 * ImageUploadField Component
 * Allows students & teachers to upload a profile photo directly from local device.
 * Stores as base64 string for persistent localStorage storage and document printing.
 */
export default function ImageUploadField({
  value,
  onChange,
  label = 'Student Photo',
  placeholderText = 'Click or drop passport-size photo',
  subText = 'Used for Student ID Card, Admission Form & Certificate',
  shape = 'circle'
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const img = new Image();
      img.onload = () => {
        // Resize image to max 400x400 to keep localStorage efficient
        const canvas = document.createElement('canvas');
        const maxDim = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.82);
        onChange(compressedBase64);
      };
      img.src = uploadEvent.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div>
      {label && <label className="form-label">{label}</label>}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      <div
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: '2px dashed #cbd5e1',
          borderRadius: '0.75rem',
          padding: '12px 16px',
          backgroundColor: '#faf9f5',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          transition: 'all 0.15s ease'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#2563eb')}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#cbd5e1')}
      >
        {/* Preview or Placeholder Icon */}
        <div style={{ position: 'relative' }}>
          {value ? (
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: shape === 'circle' ? '50%' : '8px',
                overflow: 'hidden',
                border: '2px solid #2563eb',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
              }}
            >
              <img
                src={value}
                alt="Preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          ) : (
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: shape === 'circle' ? '50%' : '8px',
                backgroundColor: '#edebe3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b'
              }}
            >
              <User size={30} />
            </div>
          )}

          {value && (
            <button
              type="button"
              onClick={handleClear}
              title="Remove photo"
              style={{
                position: 'absolute',
                top: -4,
                right: -4,
                backgroundColor: '#dc2626',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50%',
                width: 20,
                height: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Text Prompt */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2563eb', fontWeight: 700, fontSize: '0.825rem' }}>
            <Camera size={15} />
            <span>{value ? 'Change Uploaded Photo' : placeholderText}</span>
          </div>
          <p style={{ margin: '3px 0 0 0', fontSize: '0.72rem', color: '#64748b' }}>
            {subText}
          </p>
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
        >
          <Upload size={13} />
          <span>Browse</span>
        </button>
      </div>
    </div>
  );
}
