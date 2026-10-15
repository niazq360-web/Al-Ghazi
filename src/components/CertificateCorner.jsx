import React from 'react';

/**
 * CertificateCorner Component
 * Renders an ultra-luxurious, intricate Baroque/Islamic Arabesque corner flourish
 * with gold foil metallic styling for the 4 corners of the official certificate.
 */
export default function CertificateCorner({
  position = 'top-left', // 'top-left', 'top-right', 'bottom-left', 'bottom-right'
  size = 90,
  color = '#d4af37'
}) {
  let transform = '';
  let stylePosition = {};

  if (position === 'top-left') {
    stylePosition = { top: 0, left: 0 };
    transform = 'none';
  } else if (position === 'top-right') {
    stylePosition = { top: 0, right: 0 };
    transform = 'scaleX(-1)';
  } else if (position === 'bottom-left') {
    stylePosition = { bottom: 0, left: 0 };
    transform = 'scaleY(-1)';
  } else if (position === 'bottom-right') {
    stylePosition = { bottom: 0, right: 0 };
    transform = 'scale(-1, -1)';
  }

  return (
    <div
      style={{
        position: 'absolute',
        ...stylePosition,
        width: size,
        height: size,
        pointerEvents: 'none',
        zIndex: 5
      }}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        style={{ transform, display: 'block' }}
      >
        <defs>
          <linearGradient id={`cornerGold-${position}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff9d9" />
            <stop offset="30%" stopColor="#eab308" />
            <stop offset="65%" stopColor="#ca8a04" />
            <stop offset="100%" stopColor="#854d0e" />
          </linearGradient>
        </defs>

        {/* Outer Corner Solid Triangle Background Accent */}
        <path
          d="M 0,0 L 75,0 C 45,6 18,25 0,65 Z"
          fill={`url(#cornerGold-${position})`}
          opacity="0.18"
        />

        {/* Outer Heavy Corner Bracket */}
        <path
          d="M 4,4 L 88,4 C 70,8 48,22 36,36 C 22,48 8,70 4,88 Z"
          fill="none"
          stroke={`url(#cornerGold-${position})`}
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Inner Secondary Fine Bracket */}
        <path
          d="M 12,12 L 68,12 C 55,16 38,26 28,38 C 22,48 16,58 12,68 Z"
          fill="none"
          stroke={`url(#cornerGold-${position})`}
          strokeWidth="1.2"
        />

        {/* Ornate Filigree Arabesque Scroll 1 (Horizontal Flange) */}
        <path
          d="M 16,8 Q 38,4 58,18 Q 42,24 24,18"
          fill="none"
          stroke={`url(#cornerGold-${position})`}
          strokeWidth="1.4"
        />

        {/* Ornate Filigree Arabesque Scroll 2 (Vertical Flange) */}
        <path
          d="M 8,16 Q 4,38 18,58 Q 24,42 18,24"
          fill="none"
          stroke={`url(#cornerGold-${position})`}
          strokeWidth="1.4"
        />

        {/* Center Heart/Fleur Curls */}
        <path
          d="M 24,24 Q 40,32 32,46 Q 22,40 24,24 Z"
          fill={`url(#cornerGold-${position})`}
          opacity="0.75"
        />

        {/* Radial Beaded Quarter Arc */}
        <path
          d="M 80,4 A 80,80 0 0,1 4,80"
          fill="none"
          stroke="#9a620b"
          strokeWidth="1"
          strokeDasharray="2.5 3.5"
        />

        {/* Corner Apex Gem / Medallion */}
        <circle cx="16" cy="16" r="4.5" fill={`url(#cornerGold-${position})`} stroke="#603403" strokeWidth="0.8" />
        <circle cx="16" cy="16" r="2" fill="#ffffff" />

        {/* Secondary Decorative Nodes */}
        <circle cx="52" cy="14" r="2.2" fill="#ca8a04" />
        <circle cx="14" cy="52" r="2.2" fill="#ca8a04" />
        <circle cx="34" cy="34" r="2.8" fill={`url(#cornerGold-${position})`} />
      </svg>
    </div>
  );
}
