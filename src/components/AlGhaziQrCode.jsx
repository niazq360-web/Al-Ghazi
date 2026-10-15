import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

/**
 * AlGhaziQrCode Component
 * Renders the official golden amber QR code with cream background matching the
 * user's uploaded "Al Ghazi Qr code.png" asset.
 * Underneath the QR code, clearly displays the official institute website:
 * http://alghazidigital.site.je/
 */
export default function AlGhaziQrCode({
  value = "http://alghazidigital.site.je/",
  size = 84,
  websiteUrl = "http://alghazidigital.site.je/",
  label = "Official Institute Verification",
  className = ""
}) {
  const [dataUrl, setDataUrl] = useState('');

  useEffect(() => {
    // Generate crisp QR code data URL matching the amber-gold theme
    QRCode.toDataURL(value, {
      width: size * 3,
      margin: 1,
      color: {
        dark: '#cf7500', // Warm golden amber matching the user's uploaded QR code
        light: '#fefcf3' // Warm ivory cream background
      },
      errorCorrectionLevel: 'M'
    })
      .then(setDataUrl)
      .catch((err) => {
        console.error('QR code generation error:', err);
      });
  }, [value, size]);

  return (
    <div
      className={`alghazi-qr-wrapper ${className}`}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}
    >
      {/* Golden Border Frame */}
      <div
        style={{
          padding: '5px',
          backgroundColor: '#fefcf3',
          border: '1.5px solid #d97706',
          borderRadius: '8px',
          boxShadow: '0 3px 10px rgba(217, 119, 6, 0.22)',
          display: 'inline-block'
        }}
      >
        {dataUrl ? (
          <img
            src={dataUrl}
            alt="Al Ghazi QR Code"
            style={{
              width: size,
              height: size,
              display: 'block',
              borderRadius: '4px'
            }}
          />
        ) : (
          <div
            style={{
              width: size,
              height: size,
              backgroundColor: '#fefcf3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#d97706',
              fontSize: '10px'
            }}
          >
            QR Code
          </div>
        )}
      </div>

      {/* Website URL underneath the QR code */}
      {websiteUrl && (
        <div style={{ marginTop: '5px', textAlign: 'center' }}>
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#b45309',
              textDecoration: 'none',
              letterSpacing: '0.02em',
              display: 'block',
              lineHeight: 1.25,
              borderBottom: '1px dotted #b45309'
            }}
          >
            {websiteUrl.replace(/^https?:\/\//, '')}
          </a>
          <span
            style={{
              fontSize: '0.62rem',
              color: '#78350f',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              display: 'block',
              marginTop: '1px'
            }}
          >
            {label}
          </span>
        </div>
      )}
    </div>
  );
}
