import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

export default function AlGhaziQrCode({
  value = 'http://alghazidigital.site.je/',
  websiteUrl = 'http://alghazidigital.site.je/',
  size = 72,
  label = 'Scan to Verify',
  showWebsite = true
}) {
  const [dataUrl, setDataUrl] = useState('');

  useEffect(() => {
    QRCode.toDataURL(
      value,
      {
        width: size * 3,
        margin: 1,
        color: {
          dark: '#071329',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'H'
      },
      (err, url) => {
        if (!err && url) {
          setDataUrl(url);
        }
      }
    );
  }, [value, size]);

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}
    >
      <div
        style={{
          padding: '4px',
          backgroundColor: '#ffffff',
          border: '1.5px solid #d4af37',
          borderRadius: '6px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
          display: 'inline-block'
        }}
      >
        {dataUrl ? (
          <img
            src={dataUrl}
            alt="Verification QR Code"
            style={{ width: size, height: size, display: 'block' }}
          />
        ) : (
          <div
            style={{
              width: size,
              height: size,
              backgroundColor: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.65rem',
              color: '#64748b'
            }}
          >
            QR
          </div>
        )}
      </div>

      {label && (
        <span
          style={{
            fontSize: '0.68rem',
            fontWeight: 800,
            color: '#071329',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginTop: '3px'
          }}
        >
          {label}
        </span>
      )}

      {showWebsite && (
        <a
          href={websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '0.66rem',
            fontWeight: 700,
            color: '#1e3a8a',
            textDecoration: 'none',
            borderBottom: '1px dotted #1e3a8a',
            marginTop: '1px',
            fontFamily: 'monospace'
          }}
        >
          {websiteUrl.replace(/^https?:\/\//, '')}
        </a>
      )}
    </div>
  );
}
