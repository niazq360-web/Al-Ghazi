import React from 'react';

/**
 * OfficialSeal Component
 * Renders an ultra-high quality, scalable official golden notary seal with ribbons
 * based on the user's provided official seal design.
 * If customSealUrl is provided, it renders the custom image with golden ribbon accents.
 */
export default function OfficialSeal({
  customSealUrl = '',
  size = 140,
  instituteName = 'AL GHAZI DIGITAL INSTITUTE',
  subtitle = 'OFFICIAL SEAL',
  year = '2026',
  className = ''
}) {
  if (customSealUrl) {
    return (
      <div
        className={`official-seal-wrapper ${className}`}
        style={{
          width: size,
          height: size + 28,
          position: 'relative',
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start'
        }}
      >
        <img
          src={customSealUrl}
          alt="Official Seal"
          style={{
            width: size,
            height: size,
            objectFit: 'contain',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.25))'
          }}
        />
      </div>
    );
  }

  // Generate 36 serrated teeth points for outer starburst rosette
  const teethCount = 36;
  const outerR = 64;
  const innerR = 56;
  const center = 75;

  const points = [];
  for (let i = 0; i < teethCount * 2; i++) {
    const angle = (i * Math.PI) / teethCount;
    const r = i % 2 === 0 ? outerR : innerR;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  const polygonPoints = points.join(' ');

  return (
    <div
      className={`official-seal-container ${className}`}
      style={{
        width: size,
        height: size * 1.25,
        position: 'relative',
        display: 'inline-block',
        verticalAlign: 'middle'
      }}
    >
      <svg
        viewBox="0 0 150 185"
        width={size}
        height={size * 1.25}
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 6px 12px rgba(180, 83, 9, 0.35))', overflow: 'visible' }}
      >
        <defs>
          {/* Metallic Gold Gradients */}
          <linearGradient id="goldMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff6c5" />
            <stop offset="20%" stopColor="#f7cd60" />
            <stop offset="45%" stopColor="#df9e1d" />
            <stop offset="60%" stopColor="#fde078" />
            <stop offset="80%" stopColor="#c5840d" />
            <stop offset="100%" stopColor="#7a4f00" />
          </linearGradient>

          <linearGradient id="goldRadial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fffbe8" />
            <stop offset="40%" stopColor="#f5cf6d" />
            <stop offset="75%" stopColor="#d29117" />
            <stop offset="100%" stopColor="#9a6200" />
          </linearGradient>

          <linearGradient id="goldDarkRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9a6200" />
            <stop offset="50%" stopColor="#ffea9f" />
            <stop offset="100%" stopColor="#684200" />
          </linearGradient>

          {/* Deep Royal Red Ribbon Gradients */}
          <linearGradient id="ribbonLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b91c1c" />
            <stop offset="50%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </linearGradient>

          <linearGradient id="ribbonRight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#991b1b" />
            <stop offset="50%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </linearGradient>

          <linearGradient id="ribbonGoldBorder" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fff3a8" />
            <stop offset="50%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#9a6200" />
          </linearGradient>

          {/* Circular Text Paths */}
          <path
            id="textPathTop"
            d="M 28,75 A 47,47 0 0,1 122,75"
            fill="none"
          />
          <path
            id="textPathBottom"
            d="M 122,75 A 47,47 0 0,1 28,75"
            fill="none"
          />
        </defs>

        {/* ================= RIBBON TAILS (BEHIND SEAL) ================= */}
        {/* Left Ribbon */}
        <g>
          {/* Shadow */}
          <path
            d="M 52,110 L 26,170 L 44,158 L 62,170 L 68,118 Z"
            fill="rgba(0,0,0,0.25)"
          />
          {/* Left Ribbon Body */}
          <path
            d="M 50,105 L 24,166 L 42,154 L 60,166 L 66,114 Z"
            fill="url(#ribbonLeft)"
            stroke="url(#ribbonGoldBorder)"
            strokeWidth="1.2"
          />
          {/* Ribbon Fold Highlight */}
          <path
            d="M 33,160 L 42,154 L 51,160 L 58,116 L 40,110 Z"
            fill="rgba(255,255,255,0.12)"
          />
        </g>

        {/* Right Ribbon */}
        <g>
          {/* Shadow */}
          <path
            d="M 98,110 L 88,118 L 94,170 L 112,158 L 130,170 Z"
            fill="rgba(0,0,0,0.25)"
          />
          {/* Right Ribbon Body */}
          <path
            d="M 100,105 L 84,114 L 90,166 L 108,154 L 126,166 Z"
            fill="url(#ribbonRight)"
            stroke="url(#ribbonGoldBorder)"
            strokeWidth="1.2"
          />
          {/* Ribbon Fold Highlight */}
          <path
            d="M 99,160 L 108,154 L 117,160 L 110,116 L 92,110 Z"
            fill="rgba(255,255,255,0.15)"
          />
        </g>

        {/* ================= SCALLOPED ROSETTE (STARBURST) ================= */}
        <polygon
          points={polygonPoints}
          fill="url(#goldMetallic)"
          stroke="#7a4f00"
          strokeWidth="0.8"
        />

        {/* Outer Shadow Ring */}
        <circle
          cx="75"
          cy="75"
          r="54"
          fill="url(#goldRadial)"
          stroke="url(#goldDarkRing)"
          strokeWidth="1.8"
        />

        {/* Beaded Rope Border */}
        <circle
          cx="75"
          cy="75"
          r="51"
          fill="none"
          stroke="#7a4f00"
          strokeWidth="1"
          strokeDasharray="1.5 2.5"
        />

        {/* Solid Inner Gold Ring */}
        <circle
          cx="75"
          cy="75"
          r="48"
          fill="none"
          stroke="url(#goldDarkRing)"
          strokeWidth="2"
        />

        {/* Center Disc with Radial Gold Background */}
        <circle
          cx="75"
          cy="75"
          r="46"
          fill="url(#goldRadial)"
          stroke="#b78103"
          strokeWidth="0.7"
        />

        {/* Circular Curved Text - Top (Institute Name) */}
        <text
          fill="#451a03"
          fontSize="5.2"
          fontWeight="900"
          letterSpacing="0.09em"
          fontFamily="'Plus Jakarta Sans', Arial, sans-serif"
        >
          <textPath href="#textPathTop" startOffset="50%" textAnchor="middle">
            {instituteName.length > 28 ? instituteName.substring(0, 26) + '...' : instituteName}
          </textPath>
        </text>

        {/* Circular Curved Text - Bottom (Official Seal) */}
        <text
          fill="#451a03"
          fontSize="5.8"
          fontWeight="900"
          letterSpacing="0.14em"
          fontFamily="'Plus Jakarta Sans', Arial, sans-serif"
        >
          <textPath href="#textPathBottom" startOffset="50%" textAnchor="middle">
            ★ {subtitle} ★
          </textPath>
        </text>

        {/* Inner Border Ring */}
        <circle
          cx="75"
          cy="75"
          r="34"
          fill="none"
          stroke="#7a4f00"
          strokeWidth="0.8"
        />
        <circle
          cx="75"
          cy="75"
          r="32.5"
          fill="url(#goldRadial)"
          stroke="#b78103"
          strokeWidth="0.5"
        />

        {/* 5 Center Gold Stars */}
        <g fill="#7a4f00">
          {/* Center Star */}
          <polygon points="75,54 76.5,58 80.5,58 77.2,60.5 78.5,64.5 75,62 71.5,64.5 72.8,60.5 69.5,58 73.5,58" />
          {/* Left 1 */}
          <polygon
            points="66,56 67.2,59.5 70.8,59.5 67.8,61.8 69,65.2 66,63 63,65.2 64.2,61.8 61.2,59.5 64.8,59.5"
            transform="scale(0.85) translate(12, 11)"
          />
          {/* Left 2 */}
          <polygon
            points="58,60 59,63 62,63 59.5,65 60.5,68 58,66 55.5,68 56.5,65 54,63 57,63"
            transform="scale(0.7) translate(25, 27)"
          />
          {/* Right 1 */}
          <polygon
            points="84,56 85.2,59.5 88.8,59.5 85.8,61.8 87,65.2 84,63 81,65.2 82.2,61.8 79.2,59.5 82.8,59.5"
            transform="scale(0.85) translate(15, 11)"
          />
          {/* Right 2 */}
          <polygon
            points="92,60 93,63 96,63 93.5,65 94.5,68 92,66 89.5,68 90.5,65 88,63 91,63"
            transform="scale(0.7) translate(39, 27)"
          />
        </g>

        {/* Center Shield / Crest */}
        <g transform="translate(63, 67)">
          <path
            d="M 12,0 L 22,3 L 22,12 C 22,18 12,22 12,22 C 12,22 2,18 2,12 L 2,3 Z"
            fill="url(#goldMetallic)"
            stroke="#684200"
            strokeWidth="0.8"
          />
          <path
            d="M 12,2 L 20,4.5 L 20,11.5 C 20,16.5 12,20 12,20 C 12,20 4,16.5 4,11.5 L 4,4.5 Z"
            fill="url(#goldRadial)"
          />
          {/* Checkmark / Emblem in Shield */}
          <path
            d="M 8,11 L 11,14 L 16,8"
            fill="none"
            stroke="#5c3800"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Center Badge Ribbon */}
        <g transform="translate(75, 93)">
          <rect
            x="-25"
            y="-4.5"
            width="50"
            height="9"
            rx="1.5"
            fill="#7a4f00"
            stroke="#ffea9f"
            strokeWidth="0.6"
          />
          <text
            x="0"
            y="2"
            fill="#fffbe8"
            fontSize="4.2"
            fontWeight="900"
            letterSpacing="0.08em"
            textAnchor="middle"
            fontFamily="'Plus Jakarta Sans', Arial, sans-serif"
          >
            AUTHENTIC
          </text>
        </g>

        {/* Year */}
        <text
          x="75"
          y="105"
          fill="#5c3800"
          fontSize="4.5"
          fontWeight="800"
          letterSpacing="0.1em"
          textAnchor="middle"
          fontFamily="'Plus Jakarta Sans', Arial, sans-serif"
        >
          {year}
        </text>

        {/* Gloss / Light reflection arc */}
        <path
          d="M 38,55 A 44,44 0 0,1 112,55"
          fill="none"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
