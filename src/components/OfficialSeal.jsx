import React from 'react';

/**
 * OfficialSeal Component
 * Ultra-high definition SVG recreation of the official "AL GHAZI DIGITAL INSTITUTE"
 * golden metallic medallion seal based on the user's uploaded asset 1792081856717.jpg.
 *
 * Features:
 * - 36 sharp triangular golden sunburst teeth with realistic metallic gradient
 * - Raised outer and inner coin rings with radial bevel tick notches
 * - Arched 3D embossed "AL GHAZI" on top & "DIGITAL INSTITUTE" on bottom
 * - 5-pointed embossed gold stars flanking left and right
 * - Dotted bead security perimeter ring
 * - Midnight navy circular medallion disc
 * - Iconic Islamic architectural triple domes and dual minarets with crescent finials
 * - Integrated copper/rose-gold PCB circuit traces with terminal node dots
 * - Royal arabesque filigree flourishes with center diamond crest
 * - Specular diagonal light glint / metallic sheen
 * - Optional royal red ribbon tails for certificate presentation
 */
export default function OfficialSeal({
  customSealUrl = '',
  size = 150,
  showRibbons = true,
  instituteName = 'AL GHAZI',
  tagline = 'DIGITAL INSTITUTE',
  className = ''
}) {
  // If user provided a custom image file/URL for seal, use it
  if (customSealUrl) {
    return (
      <div
        className={`official-seal-wrapper ${className}`}
        style={{
          width: size,
          height: showRibbons ? size * 1.25 : size,
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
            filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.35))'
          }}
        />
      </div>
    );
  }

  // Generate 36 outer serrated starburst points
  const teethCount = 36;
  const outerR = 98;
  const innerR = 88;
  const cx = 110;
  const cy = 110;
  const points = [];
  for (let i = 0; i < teethCount * 2; i++) {
    const angle = (i * Math.PI) / teethCount - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  const rosettePolygon = points.join(' ');

  // Radial ticks between rings (around 72 small teeth ticks)
  const ticks = [];
  for (let i = 0; i < 72; i++) {
    const angle = (i * 2 * Math.PI) / 72;
    const x1 = cx + 80 * Math.cos(angle);
    const y1 = cy + 80 * Math.sin(angle);
    const x2 = cx + 83.5 * Math.cos(angle);
    const y2 = cy + 83.5 * Math.sin(angle);
    ticks.push({ x1, y1, x2, y2 });
  }

  // Beaded circle dots around inner disc (around 64 dots)
  const beads = [];
  for (let i = 0; i < 56; i++) {
    const angle = (i * 2 * Math.PI) / 56;
    const bx = cx + 55 * Math.cos(angle);
    const by = cy + 55 * Math.sin(angle);
    beads.push({ bx, by });
  }

  return (
    <div
      className={`official-seal-container ${className}`}
      style={{
        width: size,
        height: showRibbons ? size * 1.22 : size,
        position: 'relative',
        display: 'inline-block',
        verticalAlign: 'middle'
      }}
    >
      <svg
        viewBox="0 0 220 268"
        width={size}
        height={showRibbons ? size * 1.22 : size}
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: 'drop-shadow(0 8px 18px rgba(180, 83, 9, 0.38)) drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
          overflow: 'visible'
        }}
      >
        <defs>
          {/* Metallic Gold Primary Gradient */}
          <linearGradient id="goldMetallic3D" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff7d1" />
            <stop offset="15%" stopColor="#f7d070" />
            <stop offset="35%" stopColor="#d99b26" />
            <stop offset="50%" stopColor="#fff1b0" />
            <stop offset="68%" stopColor="#b47918" />
            <stop offset="85%" stopColor="#dfa73b" />
            <stop offset="100%" stopColor="#784402" />
          </linearGradient>

          {/* Radial Gold Lighting */}
          <radialGradient id="goldRadialShine" cx="42%" cy="38%" r="60%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
            <stop offset="25%" stopColor="#ffe99a" stopOpacity="0.5" />
            <stop offset="65%" stopColor="#cca034" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#7a4603" stopOpacity="0.6" />
          </radialGradient>

          {/* Beveled Edge Gradient */}
          <linearGradient id="goldBevelDark" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#543001" />
            <stop offset="40%" stopColor="#9a620b" />
            <stop offset="70%" stopColor="#ffd875" />
            <stop offset="100%" stopColor="#fff8db" />
          </linearGradient>

          {/* Midnight Blue Medallion Center Base */}
          <radialGradient id="navyMedallionCenter" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#132347" />
            <stop offset="55%" stopColor="#0a152e" />
            <stop offset="90%" stopColor="#040916" />
            <stop offset="100%" stopColor="#02040a" />
          </radialGradient>

          {/* Circuit / Dome Rose-Gold Copper Gradient */}
          <linearGradient id="circuitCopper" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fed7aa" />
            <stop offset="25%" stopColor="#fb923c" />
            <stop offset="60%" stopColor="#ea580c" />
            <stop offset="85%" stopColor="#fed7aa" />
            <stop offset="100%" stopColor="#9a3412" />
          </linearGradient>

          {/* Red Ribbon Gradients */}
          <linearGradient id="sealRibbonLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#991b1b" />
            <stop offset="35%" stopColor="#dc2626" />
            <stop offset="70%" stopColor="#b91c1c" />
            <stop offset="100%" stopColor="#680f0f" />
          </linearGradient>

          <linearGradient id="sealRibbonRight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7f1d1d" />
            <stop offset="45%" stopColor="#ef4444" />
            <stop offset="75%" stopColor="#b91c1c" />
            <stop offset="100%" stopColor="#580b0b" />
          </linearGradient>

          {/* Circular Text Paths */}
          {/* Top Arc (AL GHAZI) - Radius 68 */}
          <path
            id="alGhaziTopPath"
            d="M 38,110 A 72,72 0 0,1 182,110"
            fill="none"
          />
          {/* Bottom Arc (DIGITAL INSTITUTE) - Radius 68 */}
          <path
            id="alGhaziBottomPath"
            d="M 182,110 A 72,72 0 0,1 38,110"
            fill="none"
          />

          {/* Specular Glint Clip Path */}
          <clipPath id="sealCircleClip">
            <circle cx="110" cy="110" r="96" />
          </clipPath>
        </defs>

        {/* ================= RIBBON TAILS (BEHIND SEAL) ================= */}
        {showRibbons && (
          <g>
            {/* Left Ribbon Tail */}
            <path
              d="M 74,162 L 36,252 L 64,236 L 90,252 L 96,174 Z"
              fill="rgba(0,0,0,0.28)"
            />
            <path
              d="M 72,156 L 34,246 L 62,230 L 88,246 L 94,168 Z"
              fill="url(#sealRibbonLeft)"
              stroke="url(#goldMetallic3D)"
              strokeWidth="1.8"
            />
            {/* Left Ribbon Highlight Stripe */}
            <path
              d="M 48,238 L 62,230 L 76,238 L 86,172 L 60,162 Z"
              fill="rgba(255,255,255,0.14)"
            />

            {/* Right Ribbon Tail */}
            <path
              d="M 146,162 L 124,174 L 130,252 L 156,236 L 184,252 Z"
              fill="rgba(0,0,0,0.28)"
            />
            <path
              d="M 148,156 L 126,168 L 132,246 L 158,230 L 186,246 Z"
              fill="url(#sealRibbonRight)"
              stroke="url(#goldMetallic3D)"
              strokeWidth="1.8"
            />
            {/* Right Ribbon Highlight Stripe */}
            <path
              d="M 144,238 L 158,230 L 172,238 L 160,172 L 136,162 Z"
              fill="rgba(255,255,255,0.18)"
            />
          </g>
        )}

        {/* ================= 1. SCALLOPED SUNBURST ROSETTE ================= */}
        <polygon
          points={rosettePolygon}
          fill="url(#goldMetallic3D)"
          stroke="#603702"
          strokeWidth="1.2"
        />

        {/* Outer Bevel Shadow Ring */}
        <circle
          cx="110"
          cy="110"
          r="86"
          fill="none"
          stroke="url(#goldBevelDark)"
          strokeWidth="2.5"
        />

        {/* Radial Cog/Tick Notches */}
        <g stroke="#784402" strokeWidth="1" opacity="0.85">
          {ticks.map((t, idx) => (
            <line key={idx} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} />
          ))}
        </g>

        {/* Outer Circular Ring Separator */}
        <circle
          cx="110"
          cy="110"
          r="80"
          fill="none"
          stroke="url(#goldMetallic3D)"
          strokeWidth="2.8"
        />

        {/* ================= 2. LETTERING BAND (AL GHAZI & DIGITAL INSTITUTE) ================= */}
        {/* Lettering Band Background */}
        <circle
          cx="110"
          cy="110"
          r="78.5"
          fill="none"
          stroke="#402002"
          strokeWidth="0.8"
        />

        {/* TOP CURVED TEXT: "AL GHAZI" */}
        <text
          fill="#3d1f02"
          fontSize="9.8"
          fontWeight="900"
          letterSpacing="0.22em"
          fontFamily="'Plus Jakarta Sans', Arial, sans-serif"
          style={{
            filter: 'drop-shadow(0 1px 0 #fff1b0) drop-shadow(0 -0.8px 0 #3a1c02)'
          }}
        >
          <textPath href="#alGhaziTopPath" startOffset="50%" textAnchor="middle">
            {instituteName.toUpperCase()}
          </textPath>
        </text>

        {/* BOTTOM CURVED TEXT: "DIGITAL INSTITUTE" */}
        <text
          fill="#3d1f02"
          fontSize="7.8"
          fontWeight="900"
          letterSpacing="0.18em"
          fontFamily="'Plus Jakarta Sans', Arial, sans-serif"
          style={{
            filter: 'drop-shadow(0 1px 0 #fff1b0) drop-shadow(0 -0.8px 0 #3a1c02)'
          }}
        >
          <textPath href="#alGhaziBottomPath" startOffset="50%" textAnchor="middle">
            {tagline.toUpperCase()}
          </textPath>
        </text>

        {/* LEFT STAR ★ (at 9 o'clock) */}
        <g transform="translate(39, 110)">
          {/* Beveled Star Shadow */}
          <polygon
            points="0,-5 1.5,-1.5 5,-1.5 2.2,0.8 3.3,4.5 0,2.2 -3.3,4.5 -2.2,0.8 -5,-1.5 -1.5,-1.5"
            fill="url(#goldMetallic3D)"
            stroke="#452302"
            strokeWidth="0.7"
          />
        </g>

        {/* RIGHT STAR ★ (at 3 o'clock) */}
        <g transform="translate(181, 110)">
          {/* Beveled Star Shadow */}
          <polygon
            points="0,-5 1.5,-1.5 5,-1.5 2.2,0.8 3.3,4.5 0,2.2 -3.3,4.5 -2.2,0.8 -5,-1.5 -1.5,-1.5"
            fill="url(#goldMetallic3D)"
            stroke="#452302"
            strokeWidth="0.7"
          />
        </g>

        {/* ================= 3. INNER BEADED ROPE RING ================= */}
        <circle
          cx="110"
          cy="110"
          r="58.5"
          fill="none"
          stroke="url(#goldMetallic3D)"
          strokeWidth="2"
        />

        {/* Beaded Spheres */}
        <g fill="url(#goldMetallic3D)" stroke="#5c3403" strokeWidth="0.4">
          {beads.map((b, idx) => (
            <circle key={idx} cx={b.bx} cy={b.by} r="1.3" />
          ))}
        </g>

        {/* Inner Gold Rim */}
        <circle
          cx="110"
          cy="110"
          r="52"
          fill="none"
          stroke="#452302"
          strokeWidth="1.2"
        />

        {/* ================= 4. MIDNIGHT NAVY CENTER DISC ================= */}
        <circle
          cx="110"
          cy="110"
          r="51"
          fill="url(#navyMedallionCenter)"
          stroke="url(#goldMetallic3D)"
          strokeWidth="1.5"
        />

        {/* Subtle Inner Ring on Blue Disc */}
        <circle
          cx="110"
          cy="110"
          r="48.5"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="0.6"
          opacity="0.4"
        />

        {/* ================= 5. CENTER EMBLEM: THREE DOMES + MINARETS + PCB TRACES ================= */}
        <g id="centerIslamicDigitalEmblem">
          {/* Central Mosque Dome Structure */}
          {/* Central Dome Spire & Crescent */}
          <path
            d="M 110,64 L 110,70"
            stroke="url(#circuitCopper)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          {/* Crescent Moon */}
          <path
            d="M 109,64 A 2.2,2.2 0 1,1 111.8,61.8 A 1.8,1.8 0 1,0 109,64 Z"
            fill="url(#goldMetallic3D)"
          />

          {/* Central Grand Onion Dome */}
          <path
            d="M 98,88 C 98,78 103,71 110,70 C 117,71 122,78 122,88 Z"
            fill="url(#circuitCopper)"
            stroke="#ffe494"
            strokeWidth="0.8"
          />
          {/* Central Dome Rib Lines */}
          <path d="M 110,70 L 110,88" stroke="#ffe494" strokeWidth="0.6" opacity="0.8" />
          <path d="M 106,73 Q 104,80 104,88" stroke="#ffe494" strokeWidth="0.5" opacity="0.6" fill="none" />
          <path d="M 114,73 Q 116,80 116,88" stroke="#ffe494" strokeWidth="0.5" opacity="0.6" fill="none" />

          {/* Left Dome */}
          <path
            d="M 85,82 C 85,76 89,72 93,72 C 97,72 100,76 100,82 Z"
            fill="url(#circuitCopper)"
            stroke="#ffe494"
            strokeWidth="0.7"
          />
          <path d="M 93,68 L 93,72" stroke="url(#circuitCopper)" strokeWidth="1.2" />
          <circle cx="93" cy="67.5" r="1.2" fill="url(#goldMetallic3D)" />

          {/* Right Dome */}
          <path
            d="M 120,82 C 120,76 123,72 127,72 C 131,72 135,76 135,82 Z"
            fill="url(#circuitCopper)"
            stroke="#ffe494"
            strokeWidth="0.7"
          />
          <path d="M 127,68 L 127,72" stroke="url(#circuitCopper)" strokeWidth="1.2" />
          <circle cx="127" cy="67.5" r="1.2" fill="url(#goldMetallic3D)" />

          {/* Left Minaret */}
          <g>
            {/* Minaret Body */}
            <rect x="76" y="80" width="6" height="30" fill="url(#circuitCopper)" stroke="#ffe494" strokeWidth="0.6" rx="0.5" />
            {/* Balcony */}
            <rect x="74.5" y="84" width="9" height="2.5" fill="url(#goldMetallic3D)" stroke="#5c3403" strokeWidth="0.5" rx="0.5" />
            {/* Minaret Dome & Spire */}
            <path d="M 76,80 C 76,76 79,74 79,74 C 79,74 82,76 82,80 Z" fill="url(#circuitCopper)" stroke="#ffe494" strokeWidth="0.6" />
            <line x1="79" y1="74" x2="79" y2="71" stroke="#ffe494" strokeWidth="1" />
            <circle cx="79" cy="70.5" r="1" fill="url(#goldMetallic3D)" />
          </g>

          {/* Right Minaret */}
          <g>
            {/* Minaret Body */}
            <rect x="138" y="80" width="6" height="30" fill="url(#circuitCopper)" stroke="#ffe494" strokeWidth="0.6" rx="0.5" />
            {/* Balcony */}
            <rect x="136.5" y="84" width="9" height="2.5" fill="url(#goldMetallic3D)" stroke="#5c3403" strokeWidth="0.5" rx="0.5" />
            {/* Minaret Dome & Spire */}
            <path d="M 138,80 C 138,76 141,74 141,74 C 141,74 144,76 144,80 Z" fill="url(#circuitCopper)" stroke="#ffe494" strokeWidth="0.6" />
            <line x1="141" y1="74" x2="141" y2="71" stroke="#ffe494" strokeWidth="1" />
            <circle cx="141" cy="70.5" r="1" fill="url(#goldMetallic3D)" />
          </g>

          {/* Central Horseshoe/Pointed Islamic Archway */}
          <path
            d="M 98,110 L 98,96 C 98,89 104,85 110,85 C 116,89 122,89 122,96 L 122,110"
            fill="none"
            stroke="url(#circuitCopper)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />

          <path
            d="M 103,110 L 103,98 C 103,94 106,91 110,91 C 114,91 117,94 117,98 L 117,110"
            fill="none"
            stroke="#ffe494"
            strokeWidth="1.2"
          />

          {/* DIGITAL CIRCUIT TRACES (DOWNWARD STREAMING PCB TRACKS WITH SOLDER PADS) */}
          <g stroke="url(#circuitCopper)" strokeWidth="1.6" strokeLinecap="round" fill="none">
            {/* Center Track */}
            <line x1="110" y1="92" x2="110" y2="124" />
            <circle cx="110" cy="125" r="2" fill="url(#goldMetallic3D)" stroke="#5c3403" strokeWidth="0.6" />

            {/* Left Track 1 */}
            <path d="M 104,98 L 104,116 L 98,122 L 90,122" />
            <circle cx="89" cy="122" r="1.8" fill="url(#goldMetallic3D)" stroke="#5c3403" strokeWidth="0.5" />

            {/* Left Track 2 */}
            <path d="M 98,104 L 98,112 L 86,118 L 82,118" />
            <circle cx="80.5" cy="118" r="1.6" fill="url(#goldMetallic3D)" stroke="#5c3403" strokeWidth="0.5" />

            {/* Right Track 1 */}
            <path d="M 116,98 L 116,116 L 122,122 L 130,122" />
            <circle cx="131" cy="122" r="1.8" fill="url(#goldMetallic3D)" stroke="#5c3403" strokeWidth="0.5" />

            {/* Right Track 2 */}
            <path d="M 122,104 L 122,112 L 134,118 L 138,118" />
            <circle cx="139.5" cy="118" r="1.6" fill="url(#goldMetallic3D)" stroke="#5c3403" strokeWidth="0.5" />
          </g>

          {/* ================= 6. ARABESQUE FILIGREE SCROLLS & MEDALLION ================= */}
          <g fill="none" stroke="url(#goldMetallic3D)" strokeWidth="1.2" strokeLinecap="round">
            {/* Lower Filigree Flourishes */}
            <path d="M 110,128 Q 98,138 88,134 Q 82,130 84,126" />
            <path d="M 110,128 Q 122,138 132,134 Q 138,130 136,126" />

            {/* Secondary Wing Filigree */}
            <path d="M 110,134 Q 96,146 82,138 Q 78,132 80,128" strokeWidth="1" />
            <path d="M 110,134 Q 124,146 138,138 Q 142,132 140,128" strokeWidth="1" />

            {/* Symmetrical Arabesque Base Curls */}
            <path d="M 104,142 Q 110,146 116,142" strokeWidth="1.4" />
          </g>

          {/* Center Diamond Medallion */}
          <g transform="translate(110, 137)">
            <polygon points="0,-4 4,0 0,4 -4,0" fill="url(#goldMetallic3D)" stroke="#452302" strokeWidth="0.7" />
            <circle cx="0" cy="0" r="1.2" fill="#fff7d1" />
          </g>
        </g>

        {/* ================= 7. SPECULAR DIAGONAL LIGHT SHEEN ================= */}
        <g clipPath="url(#sealCircleClip)" opacity="0.35">
          <ellipse
            cx="75"
            cy="65"
            rx="50"
            ry="25"
            transform="rotate(-30 75 65)"
            fill="url(#goldRadialShine)"
          />
        </g>
      </svg>
    </div>
  );
}
