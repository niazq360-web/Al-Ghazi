import React from 'react';

/**
 * OfficialSeal Component
 * Recreates the authentic Institute Medallion / Official Seal from user asset (1792081856717.jpg)
 * Supports custom seal URL or rich vector embossed 24K gold medallion with royal navy core,
 * double serrated starburst edge, laurel wreath, star constellation & institute branding.
 */
export default function OfficialSeal({
  size = 120,
  showRibbons = false,
  customSealUrl = '',
  instituteName = 'AL GHAZI',
  tagline = 'DIGITAL INSTITUTE',
  year = '2026',
  className = ''
}) {
  if (customSealUrl) {
    return (
      <div
        className={`official-seal-wrapper ${className}`}
        style={{
          width: size,
          height: size,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        <img
          src={customSealUrl}
          alt="Official Seal"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.22))'
          }}
        />
      </div>
    );
  }

  const ribbonHeight = size * 0.45;

  return (
    <div
      className={`official-seal-wrapper ${className}`}
      style={{
        width: size,
        height: showRibbons ? size + ribbonHeight * 0.5 : size,
        display: 'inline-block',
        position: 'relative',
        userSelect: 'none'
      }}
    >
      {/* Optional Royal Ribbons hanging from bottom of seal */}
      {showRibbons && (
        <svg
          width={size}
          height={ribbonHeight}
          viewBox="0 0 120 54"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            zIndex: 1,
            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.25))'
          }}
        >
          <defs>
            <linearGradient id="ribbonGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="50%" stopColor="#172554" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="ribbonGradRight" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="50%" stopColor="#1e3a8a" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="ribbonGoldEdge" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#ffd700" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>
          <path
            d="M 38,0 L 22,48 L 35,40 L 48,48 L 46,0 Z"
            fill="url(#ribbonGradLeft)"
            stroke="url(#ribbonGoldEdge)"
            strokeWidth="1.2"
          />
          <path
            d="M 74,0 L 72,48 L 85,40 L 98,48 L 82,0 Z"
            fill="url(#ribbonGradRight)"
            stroke="url(#ribbonGoldEdge)"
            strokeWidth="1.2"
          />
        </svg>
      )}

      {/* Main Embossed Medallion */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        style={{
          position: 'relative',
          zIndex: 2,
          filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.25))'
        }}
      >
        <defs>
          <linearGradient id="goldPlate" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff2a3" />
            <stop offset="25%" stopColor="#ffd700" />
            <stop offset="50%" stopColor="#d4af37" />
            <stop offset="75%" stopColor="#c59b27" />
            <stop offset="100%" stopColor="#8c6d1f" />
          </linearGradient>

          <radialGradient id="royalNavy" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="65%" stopColor="#172554" />
            <stop offset="100%" stopColor="#0a1024" />
          </radialGradient>

          <linearGradient id="goldBevel" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8c6d1f" />
            <stop offset="50%" stopColor="#ffd700" />
            <stop offset="100%" stopColor="#fff2a3" />
          </linearGradient>

          <path
            id="textPathTop"
            d="M 30,100 A 70,70 0 1,1 170,100"
            fill="none"
          />
          <path
            id="textPathBottom"
            d="M 170,100 A 70,70 0 0,1 30,100"
            fill="none"
          />
        </defs>

        {/* 1. Outer Starburst Scallop Teeth */}
        <path
          d={(() => {
            const points = 48;
            const rOuter = 98;
            const rInner = 91;
            let d = '';
            for (let i = 0; i < points * 2; i++) {
              const angle = (i * Math.PI) / points;
              const r = i % 2 === 0 ? rOuter : rInner;
              const x = 100 + r * Math.sin(angle);
              const y = 100 - r * Math.cos(angle);
              d += (i === 0 ? 'M ' : 'L ') + x.toFixed(2) + ',' + y.toFixed(2) + ' ';
            }
            return d + 'Z';
          })()}
          fill="url(#goldPlate)"
          stroke="#996515"
          strokeWidth="1.5"
        />

        {/* 2. Concentric Beveled Gold Rings */}
        <circle cx="100" cy="100" r="88" fill="none" stroke="url(#goldBevel)" strokeWidth="3" />
        <circle cx="100" cy="100" r="83" fill="none" stroke="#785314" strokeWidth="1" />
        <circle cx="100" cy="100" r="80" fill="none" stroke="url(#goldPlate)" strokeWidth="2.5" />

        {/* 3. Center Navy Shield */}
        <circle cx="100" cy="100" r="77" fill="url(#royalNavy)" stroke="#ffd700" strokeWidth="1.8" />

        {/* 4. Dashed Security Perimeter Ring */}
        <circle
          cx="100"
          cy="100"
          r="63"
          fill="none"
          stroke="#ffd700"
          strokeWidth="1.2"
          strokeDasharray="3,3"
          opacity="0.85"
        />

        {/* 5. Circular Text - TOP */}
        <text
          fill="#ffd700"
          fontSize="10"
          fontWeight="900"
          letterSpacing="0.16em"
          fontFamily="system-ui, -apple-system, sans-serif"
          style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.8))' }}
        >
          <textPath href="#textPathTop" startOffset="50%" textAnchor="middle">
            ★ {instituteName} {tagline} ★
          </textPath>
        </text>

        {/* 6. Circular Text - BOTTOM */}
        <text
          fill="#fff3b0"
          fontSize="8.5"
          fontWeight="800"
          letterSpacing="0.14em"
          fontFamily="system-ui, -apple-system, sans-serif"
          style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.8))' }}
        >
          <textPath href="#textPathBottom" startOffset="50%" textAnchor="middle">
            • OFFICIAL SEAL OF EXCELLENCE • {year}
          </textPath>
        </text>

        {/* 7. Center Crest */}
        <g transform="translate(100, 100)">
          <path
            d="M -36,12 C -42,2 -40,-16 -30,-28 C -22,-38 -8,-44 0,-44 C 8,-44 22,-38 30,-28 C 40,-16 42,2 36,12 C 28,24 16,34 0,36 C -16,34 -28,24 -36,12 Z"
            fill="none"
            stroke="url(#goldPlate)"
            strokeWidth="1.5"
            opacity="0.3"
          />

          {[-26, -20, -14, -8, 8, 14, 20, 26].map((deg, idx) => (
            <ellipse
              key={idx}
              cx={deg > 0 ? 32 : -32}
              cy={deg * 0.8}
              rx="4"
              ry="2"
              transform={`rotate(${deg}, ${deg > 0 ? 32 : -32}, ${deg * 0.8})`}
              fill="#ffd700"
              opacity="0.8"
            />
          ))}

          <path
            d="M -18,-12 L -22,4 L 22,4 L 18,-12 L 8,-4 L 0,-18 L -8,-4 Z"
            fill="url(#goldPlate)"
            stroke="#996515"
            strokeWidth="1"
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.6))"
          />
          <circle cx="-18" cy="-13" r="2" fill="#ffffff" />
          <circle cx="0" cy="-19" r="2.5" fill="#ffffff" />
          <circle cx="18" cy="-13" r="2" fill="#ffffff" />

          <text
            x="0"
            y="20"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="14"
            fontWeight="900"
            fontFamily="Georgia, serif"
            letterSpacing="0.08em"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.9))' }}
          >
            AG
          </text>

          {[-16, -8, 0, 8, 16].map((x, i) => (
            <polygon
              key={i}
              points="0,-3 1,-1 3,-1 1.5,0.5 2,2.5 0,1.5 -2,2.5 -1.5,0.5 -3,-1 -1,-1"
              transform={`translate(${x}, 28)`}
              fill="#ffd700"
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
