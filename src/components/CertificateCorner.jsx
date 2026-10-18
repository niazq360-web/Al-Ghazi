import React from 'react';

export default function CertificateCorner({ position = 'top-left', size = 96 }) {
  let transform = '';
  let stylePosition = {};

  switch (position) {
    case 'top-left':
      stylePosition = { top: 0, left: 0 };
      transform = 'none';
      break;
    case 'top-right':
      stylePosition = { top: 0, right: 0 };
      transform = 'scaleX(-1)';
      break;
    case 'bottom-left':
      stylePosition = { bottom: 0, left: 0 };
      transform = 'scaleY(-1)';
      break;
    case 'bottom-right':
      stylePosition = { bottom: 0, right: 0 };
      transform = 'scale(-1, -1)';
      break;
    default:
      stylePosition = { top: 0, left: 0 };
  }

  return (
    <div
      style={{
        position: 'absolute',
        ...stylePosition,
        width: size,
        height: size,
        pointerEvents: 'none',
        zIndex: 5,
        transform,
        transformOrigin: 'top left'
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="goldFiligree" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff5ad" />
            <stop offset="30%" stopColor="#ffd700" />
            <stop offset="70%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#996515" />
          </linearGradient>
        </defs>

        <path
          d="M 4,4 L 92,4 L 92,10 L 10,10 L 10,92 L 4,92 Z"
          fill="url(#goldFiligree)"
        />
        <path
          d="M 14,14 L 80,14 L 80,18 L 18,18 L 18,80 L 14,80 Z"
          fill="url(#goldFiligree)"
          opacity="0.85"
        />
        <path
          d="M 6,6 Q 40,6 50,25 Q 60,44 42,60 Q 24,76 6,56 C 18,50 24,36 18,22 C 14,12 8,8 6,6 Z"
          fill="url(#goldFiligree)"
          opacity="0.9"
        />
        <path
          d="M 22,22 Q 45,22 56,36 Q 66,50 50,66 C 42,56 42,42 34,34 C 28,28 24,24 22,22 Z"
          fill="#ffd700"
        />
        <circle cx="28" cy="28" r="5" fill="url(#goldFiligree)" />
        <circle cx="28" cy="28" r="2.5" fill="#071329" />
        <path
          d="M 88,4 C 84,10 74,10 70,4 C 74,6 84,6 88,4 Z"
          fill="url(#goldFiligree)"
        />
        <path
          d="M 4,88 C 10,84 10,74 4,70 C 6,74 6,84 4,88 Z"
          fill="url(#goldFiligree)"
        />
      </svg>
    </div>
  );
}
