import React from 'react';

// Custom Vector Icons for all 17 Utilities (Zero Lucide, Zero Emojis)
export function UtilityIcon({ id, className = 'w-4 h-4', style }) {
  const mergedClass = `${className} utility-icon shrink-0`;
  switch (Number(id)) {
    case 1: // Electricity
      return (
        <svg data-utility-icon="1" className={mergedClass} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case 2: // Water Supply
      return (
        <svg data-utility-icon="2" className={mergedClass} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      );
    case 3: // Natural Gas
      return (
        <svg data-utility-icon="3" className={mergedClass} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
      );
    case 4: // Internet / Wi-Fi
      return (
        <svg data-utility-icon="4" className={mergedClass} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.55a11 11 0 0 1 14.08 0" />
          <path d="M1.42 9a16 16 0 0 1 21.16 0" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <circle cx="12" cy="20" r="1" fill="currentColor" />
        </svg>
      );
    case 5: // Sewerage
      return (
        <svg data-utility-icon="5" className={mergedClass} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
          <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
          <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
        </svg>
      );
    case 6: // Car Parking
      return (
        <svg data-utility-icon="6" className={mergedClass} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
        </svg>
      );
    case 7: // Garbage Collection
      return (
        <svg data-utility-icon="7" className={mergedClass} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6M14 11v6" />
        </svg>
      );
    case 8: // Mobile Network
      return (
        <svg data-utility-icon="8" className={mergedClass} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 20h.01M7 20v-4M12 20v-8M17 20V8M22 4v16" />
        </svg>
      );
    case 9: // Solar Panels
      return (
        <svg data-utility-icon="9" className={mergedClass} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      );
    case 10: // CCTV
      return (
        <svg data-utility-icon="10" className={mergedClass} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 8l13-5 5 10-13 5z" />
          <path d="M15 13l5 3v4" />
        </svg>
      );
    case 11: // Public Transport
      return (
        <svg data-utility-icon="11" className={mergedClass} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="3" width="16" height="15" rx="2" />
          <path d="M4 11h16M8 18v3M16 18v3" />
          <circle cx="8.5" cy="14.5" r="1" fill="currentColor" />
          <circle cx="15.5" cy="14.5" r="1" fill="currentColor" />
        </svg>
      );
    case 12: // Road Maintenance
      return (
        <svg data-utility-icon="12" className={mergedClass} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 22L8 2M20 22L16 2M12 6v3M12 13v3M12 20v2" />
        </svg>
      );
    case 13: // Burglary Alarm
      return (
        <svg data-utility-icon="13" className={mergedClass} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      );
    case 14: // Water Filter
      return (
        <svg data-utility-icon="14" className={mergedClass} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
      );
    case 15: // Surge Protection
      return (
        <svg data-utility-icon="15" className={mergedClass} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      );
    case 16: // Trading
      return (
        <svg data-utility-icon="16" className={mergedClass} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      );
    case 17: // Warehouse
      return (
        <svg data-utility-icon="17" className={mergedClass} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21V8l9-5 9 5v13" />
          <path d="M9 21v-8h6v8" />
        </svg>
      );
    default:
      return (
        <svg data-utility-icon="0" className={mergedClass} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}

/**
 * Architectural SVG Background Illustration for Properties Tab Cards
 * Renders distinct skyline / architectural art for:
 * - Residential (Villas, Townhouses, Trees & Terraces)
 * - Commercial (High-Rise Towers, Plaza Arches & Financial Skyline)
 * - Industrial / Port / Airport (Warehouses, Cranes & Gantries)
 */
export const PropertyCategoryBackdrop = React.memo(function PropertyCategoryBackdrop({
  category = 'Residential',
  className = 'w-full h-28'
}) {
  const catLower = (category || '').toLowerCase();
  const isCommercial = catLower.includes('commercial') || catLower.includes('transport');
  const isIndustrial = catLower.includes('industrial') || catLower.includes('port');

  if (isCommercial) {
    return (
      <svg
        viewBox="0 0 320 110"
        className={`${className} select-none pointer-events-none`}
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="commSky" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3B0B15" />
            <stop offset="100%" stopColor="#6E1426" />
          </linearGradient>
        </defs>
        <rect width="320" height="110" fill="url(#commSky)" />

        {/* Subtle Horizon Sun / Glow */}
        <circle cx="265" cy="28" r="24" fill="#F1CA7E" fillOpacity="0.16" />

        {/* Back Skyline Silhouettes */}
        <rect x="18" y="42" width="32" height="68" fill="#4E101D" />
        <rect x="56" y="26" width="38" height="84" fill="#5A1221" />
        <rect x="218" y="34" width="42" height="76" fill="#4E101D" />
        <rect x="266" y="48" width="34" height="62" fill="#5A1221" />

        {/* Foreground Commercial Towers & Plaza */}
        <g>
          {/* Left Glass Office Tower */}
          <rect x="96" y="18" width="46" height="92" rx="2" fill="#8B1E32" stroke="#F1CA7E" strokeWidth="1.2" strokeOpacity="0.7" />
          <polygon points="96,18 119,6 142,18" fill="#F1CA7E" fillOpacity="0.85" />
          {/* Tower Windows Grid */}
          {[26, 38, 50, 62, 74, 86].map((y) => (
            <g key={y} fill="#F8EEE1" fillOpacity="0.75">
              <rect x="103" y={y} width="8" height="6" rx="0.8" />
              <rect x="115" y={y} width="8" height="6" rx="0.8" />
              <rect x="127" y={y} width="8" height="6" rx="0.8" />
            </g>
          ))}

          {/* Right Commercial Trade Center */}
          <rect x="150" y="32" width="58" height="78" rx="2" fill="#701020" stroke="#F1CA7E" strokeWidth="1.2" strokeOpacity="0.65" />
          <rect x="158" y="24" width="42" height="8" fill="#F1CA7E" fillOpacity="0.35" />
          {[42, 54, 66, 78].map((y) => (
            <g key={y} fill="#F1CA7E" fillOpacity="0.65">
              <rect x="158" y={y} width="10" height="6" rx="0.8" />
              <rect x="174" y={y} width="10" height="6" rx="0.8" />
              <rect x="190" y={y} width="10" height="6" rx="0.8" />
            </g>
          ))}
          {/* Ground Arches */}
          <path d="M162 110 V94 a6 6 0 0 1 12 0 V110 Z" fill="#2B0A11" />
          <path d="M184 110 V94 a6 6 0 0 1 12 0 V110 Z" fill="#2B0A11" />
        </g>

        {/* Ground Boulevard Line */}
        <line x1="0" y1="108" x2="320" y2="108" stroke="#F1CA7E" strokeWidth="2" strokeOpacity="0.5" />
      </svg>
    );
  }

  if (isIndustrial) {
    return (
      <svg
        viewBox="0 0 320 110"
        className={`${className} select-none pointer-events-none`}
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="indSky" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#261310" />
            <stop offset="100%" stopColor="#52261E" />
          </linearGradient>
        </defs>
        <rect width="320" height="110" fill="url(#indSky)" />

        {/* Cargo Crane Silhouette */}
        <g stroke="#F1CA7E" strokeOpacity="0.5" strokeWidth="1.8" fill="none">
          <line x1="248" y1="108" x2="262" y2="20" />
          <line x1="276" y1="108" x2="262" y2="20" />
          <line x1="210" y1="26" x2="298" y2="16" />
          <line x1="224" y1="24" x2="224" y2="52" />
          <rect x="216" y="52" width="16" height="10" fill="#F1CA7E" fillOpacity="0.35" />
        </g>

        {/* Sawtooth Factory Roofs & Warehouses */}
        <polygon
          points="24,108 24,58 58,42 58,58 92,42 92,58 126,42 126,108"
          fill="#6E221F"
          stroke="#F1CA7E"
          strokeWidth="1.2"
          strokeOpacity="0.65"
        />
        {/* Smokestacks */}
        <rect x="142" y="28" width="12" height="80" fill="#4A1715" stroke="#F1CA7E" strokeWidth="1" strokeOpacity="0.5" />
        <rect x="162" y="36" width="12" height="72" fill="#4A1715" stroke="#F1CA7E" strokeWidth="1" strokeOpacity="0.5" />
        <rect x="140" y="26" width="16" height="4" fill="#F1CA7E" fillOpacity="0.7" />
        <rect x="160" y="34" width="16" height="4" fill="#F1CA7E" fillOpacity="0.7" />

        {/* Warehouse Hangar */}
        <path
          d="M 134 108 V 68 L 174 52 L 214 68 V 108 Z"
          fill="#8D5B3A"
          fillOpacity="0.75"
          stroke="#F1CA7E"
          strokeWidth="1.2"
          strokeOpacity="0.7"
        />
        <rect x="158" y="80" width="32" height="28" fill="#261310" stroke="#F1CA7E" strokeWidth="1" strokeOpacity="0.5" />

        {/* Factory Windows */}
        {[40, 66, 92].map((x) => (
          <rect key={x} x={x} y="72" width="14" height="12" rx="1" fill="#F1CA7E" fillOpacity="0.65" />
        ))}

        <line x1="0" y1="108" x2="320" y2="108" stroke="#F1CA7E" strokeWidth="2" strokeOpacity="0.5" />
      </svg>
    );
  }

  // Default: Residential Villa, Gated Estate & Courtyards
  return (
    <svg
      viewBox="0 0 320 110"
      className={`${className} select-none pointer-events-none`}
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="resSky" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2B0E16" />
          <stop offset="100%" stopColor="#5E1929" />
        </linearGradient>
      </defs>
      <rect width="320" height="110" fill="url(#resSky)" />

      {/* Warm Moon / Evening Sun Glow */}
      <circle cx="52" cy="28" r="18" fill="#F1CA7E" fillOpacity="0.2" />

      {/* Rolling Hills / Garden Backdrop */}
      <path d="M0 92 Q 90 68 180 88 T 320 82 L 320 110 L 0 110 Z" fill="#3E111B" />

      {/* Left Residential Townhouse */}
      <g>
        <rect x="64" y="54" width="52" height="54" rx="2" fill="#701020" stroke="#F1CA7E" strokeWidth="1.2" strokeOpacity="0.65" />
        <polygon points="58,54 90,34 122,54" fill="#8B1E32" stroke="#F1CA7E" strokeWidth="1.2" strokeOpacity="0.75" />
        <rect x="74" y="64" width="12" height="12" rx="1" fill="#F8EEE1" fillOpacity="0.8" />
        <rect x="94" y="64" width="12" height="12" rx="1" fill="#F8EEE1" fillOpacity="0.8" />
        <rect x="84" y="86" width="12" height="22" rx="1" fill="#F1CA7E" fillOpacity="0.75" />
      </g>

      {/* Center Luxury Karachi Villa */}
      <g>
        <rect x="132" y="42" width="78" height="66" rx="2" fill="#F8EEE1" fillOpacity="0.92" stroke="#5A0D1B" strokeWidth="1.2" />
        <polygon points="126,42 171,20 216,42" fill="#701020" stroke="#F1CA7E" strokeWidth="1.3" />
        {/* Upper Balcony */}
        <rect x="146" y="50" width="20" height="14" rx="1" fill="#5A0D1B" />
        <rect x="176" y="50" width="20" height="14" rx="1" fill="#5A0D1B" />
        <line x1="142" y1="65" x2="200" y2="65" stroke="#701020" strokeWidth="2" />
        {/* Ground Arched Entrance */}
        <path d="M162 108 V82 a9 9 0 0 1 18 0 V108 Z" fill="#701020" />
        <rect x="142" y="78" width="12" height="14" rx="1" fill="#5A0D1B" />
        <rect x="188" y="78" width="12" height="14" rx="1" fill="#5A0D1B" />
      </g>

      {/* Courtyard Trees */}
      <g>
        <line x1="36" y1="108" x2="36" y2="76" stroke="#F1CA7E" strokeWidth="2.2" strokeOpacity="0.6" />
        <circle cx="36" cy="70" r="13" fill="#2E7D52" fillOpacity="0.85" stroke="#F1CA7E" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="242" y1="108" x2="242" y2="72" stroke="#F1CA7E" strokeWidth="2.2" strokeOpacity="0.6" />
        <circle cx="242" cy="66" r="15" fill="#2E7D52" fillOpacity="0.85" stroke="#F1CA7E" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="274" y1="108" x2="274" y2="80" stroke="#F1CA7E" strokeWidth="2" strokeOpacity="0.6" />
        <circle cx="274" cy="75" r="11" fill="#2E7D52" fillOpacity="0.75" stroke="#F1CA7E" strokeWidth="1" strokeOpacity="0.5" />
      </g>

      <line x1="0" y1="108" x2="320" y2="108" stroke="#F1CA7E" strokeWidth="2" strokeOpacity="0.5" />
    </svg>
  );
});

/**
 * Lightweight 3D Isometric Land Plot SVG (Runs on all low-end devices without WebGL/GPU overhead)
 * Matches the user-provided reference design exactly:
 * - Diamond-angled 3D plot foundation with glowing border & 3D base bevel
 * - Clean geometric 3D architectural houses & towers with warm cream facades (#FBF4E6) & side shading (#E4D1B8)
 * - Level 0: Pure isometric vacant land plot with road markings
 * - Level 1: Adds small residential/commercial isometric cottage with roof & windows
 * - Level 2: Adds central 3-story main isometric building with entrance & window arrays
 * - Level 3: Adds landmark tower with roof spire + spherical beacon + golden upgrade orbs on the platform
 * - Compact pill badge in top-left: "LEVEL 3"
 */
export const LandPlotIllustration = React.memo(function LandPlotIllustration({
  category = 'Residential',
  level = 0,
  utilityCount = 0,
  isHighlighted = false
}) {
  const isIndustrial = category.includes('Industrial');
  const isCommercial = category.includes('Commercial');

  // Palette extracted directly from reference image:
  // Card base & plinth
  const groundTop = isHighlighted ? '#4A1220' : '#2D0A14';
  const groundEdge = isHighlighted ? '#FF7A90' : '#8B1428';
  const curbColor = '#ECC37A';
  const bevelFront = '#1A040B';
  const bevelEdge = '#120207';

  // Architectural 3D buildings:
  // Front face (cream/bone-white lit): #FBF5E8
  // Side face (isometric shadow): #E5D5BC
  // Roof front: #ECC37A (warm sand / gold)
  // Roof side/gable: #D4A85B
  // Windows & Doors: #4D0E1C
  // Outlines: crisp dark maroon #22050D
  const wallFront = '#FBF5E8';
  const wallSide = '#E5D5BC';
  const roofColor = level >= 3 ? '#ECC37A' : isIndustrial ? '#8D5B3A' : isCommercial ? '#A32238' : '#ECC37A';
  const roofSide = level >= 3 ? '#D4A85B' : '#6A1624';
  const windowFill = '#4D0E1C';
  const strokeLine = '#22050D';

  return (
    <svg
      viewBox="0 0 280 135"
      className="w-full h-28 sm:h-32 select-none pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="geometricPrecision"
    >
      <defs>
        {/* Low-end device friendly static SVG linear gradient */}
        <linearGradient id="plotBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2E0C16" />
          <stop offset="100%" stopColor="#1B050D" />
        </linearGradient>
      </defs>

      {/* Outer rounded card frame */}
      <rect width="280" height="135" rx="16" fill="url(#plotBg)" />

      {/* LEVEL BADGE (Exact match with reference top-left pill) */}
      <g transform="translate(18, 14)">
        <rect
          x="0"
          y="0"
          width="62"
          height="20"
          rx="6"
          fill="#3B0C18"
          stroke="#ECC37A"
          strokeWidth="1.5"
        />
        <text
          x="31"
          y="14"
          textAnchor="middle"
          fill="#ECC37A"
          fontSize="9.5"
          fontWeight="800"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="0.8"
        >
          {level === 0 ? 'EMPTY' : `LEVEL ${level}`}
        </text>
      </g>

      {/* ============================================================ */}
      {/* 3D ISOMETRIC GROUND PLATFORM (Diamond prism beneath buildings) */}
      {/* Platform diamond: Top=(140, 52), Right=(244, 88), Front=(140, 118), Left=(36, 88) */}
      {/* Extruded downward bevel to depth y + 5 */}
      {/* ============================================================ */}
      <g id="isometric-platform">
        {/* Front-Left 3D Thickness Drop */}
        <polygon
          points="36,88 140,118 140,123 36,93"
          fill={bevelFront}
          stroke={bevelEdge}
          strokeWidth="1"
        />
        {/* Front-Right 3D Thickness Drop */}
        <polygon
          points="244,88 140,118 140,123 244,93"
          fill="#110207"
          stroke={bevelEdge}
          strokeWidth="1"
        />

        {/* Top Isometric Diamond Plot Floor */}
        <polygon
          points="140,52 244,88 140,118 36,88"
          fill={groundTop}
          stroke={groundEdge}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* Dashed Road / Curb Markings along the front perimeter edges */}
        {/* Black underlay for contrast */}
        <polyline
          points="46,89 140,116 234,89"
          fill="none"
          stroke="#100206"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeDasharray="5 4"
        />
        {/* Golden dash markings */}
        <polyline
          points="46,88 140,115 234,88"
          fill="none"
          stroke={curbColor}
          strokeWidth="1.2"
          strokeOpacity="0.8"
          strokeDasharray="5 4"
        />
      </g>

      {/* ============================================================ */}
      {/* 3D BUILDINGS LAYER (Planted flat on the isometric surface)   */}
      {/* Ground lines intersect cleanly inside the diamond plot       */}
      {/* ============================================================ */}

      {/* LEVEL 1+: Small Left Isometric Cottage (Base y=88) */}
      {level >= 1 && (
        <g id="left-cottage">
          {/* Main Front Wall */}
          <rect
            x="68"
            y="64"
            width="28"
            height="24"
            fill={wallFront}
            stroke={strokeLine}
            strokeWidth="1.2"
          />
          {/* Cottage Right Shaded Side */}
          <polygon
            points="96,64 104,61 104,85 96,88"
            fill={wallSide}
            stroke={strokeLine}
            strokeWidth="1.2"
          />

          {/* Cottage Front Triangle Gable */}
          <polygon
            points="66,64 82,53 98,64"
            fill={roofColor}
            stroke={strokeLine}
            strokeWidth="1.2"
          />
          {/* Cottage Roof Shaded Right Slope */}
          <polygon
            points="82,53 92,49 106,61 98,64"
            fill={roofSide}
            stroke={strokeLine}
            strokeWidth="1.2"
          />

          {/* Front Window */}
          <rect
            x="76"
            y="71"
            width="12"
            height="10"
            fill={windowFill}
            stroke={strokeLine}
            strokeWidth="0.8"
          />
        </g>
      )}

      {/* LEVEL 0 -> LEVEL 3: Center Main 3-Story Isometric Building (Base y=88) */}
      {level === 0 ? (
        // Vacant land survey marker
        <g id="empty-survey-marker">
          <circle cx="140" cy="88" r="8" fill="#580E1C" stroke="#ECC37A" strokeWidth="1.5" />
          <circle cx="140" cy="88" r="3" fill="#ECC37A" />
          <line x1="140" y1="74" x2="140" y2="102" stroke="#ECC37A" strokeWidth="1.2" strokeDasharray="2 2" />
          <line x1="126" y1="88" x2="154" y2="88" stroke="#ECC37A" strokeWidth="1.2" strokeDasharray="2 2" />
        </g>
      ) : (
        <g id="center-main-building">
          {/* Main Front Wall (3 stories) */}
          <rect
            x="102"
            y="36"
            width="44"
            height="52"
            fill={wallFront}
            stroke={strokeLine}
            strokeWidth="1.4"
          />
          {/* Main Right Shaded Isometric Wall */}
          <polygon
            points="146,36 166,41 166,85 146,88"
            fill={wallSide}
            stroke={strokeLine}
            strokeWidth="1.4"
          />

          {/* Main Front Roof Slope */}
          <polygon
            points="99,36 126,22 149,36"
            fill={roofColor}
            stroke={strokeLine}
            strokeWidth="1.4"
          />
          {/* Main Right Roof Slope */}
          <polygon
            points="126,22 146,27 169,41 149,36"
            fill={roofSide}
            stroke={strokeLine}
            strokeWidth="1.4"
          />

          {/* Window Array & Entrance on Front Wall */}
          {/* Top Floor Windows */}
          <rect x="110" y="43" width="9" height="8" fill={windowFill} />
          <rect x="127" y="43" width="9" height="8" fill={windowFill} />
          {/* Middle Floor Windows */}
          <rect x="110" y="56" width="9" height="8" fill={windowFill} />
          <rect x="127" y="56" width="9" height="8" fill={windowFill} />
          {/* Ground Floor Entrance */}
          <rect x="117" y="70" width="14" height="18" fill={windowFill} />

          {/* Side Isometric Windows */}
          <polygon
            points="152,49 160,50 160,58 152,56"
            fill={windowFill}
            stroke={strokeLine}
            strokeWidth="0.8"
          />
        </g>
      )}

      {/* LEVEL 3: Right Landmark Tower with Spire & Beacon (Base y=88) */}
      {level >= 3 && (
        <g id="right-landmark-tower">
          {/* Tower Front Wall */}
          <rect
            x="170"
            y="30"
            width="28"
            height="58"
            fill={wallFront}
            stroke={strokeLine}
            strokeWidth="1.4"
          />
          {/* Tower Right Shaded Isometric Side */}
          <polygon
            points="198,30 208,27 208,82 198,88"
            fill={wallSide}
            stroke={strokeLine}
            strokeWidth="1.4"
          />

          {/* Pyramid Roof / Dome Base */}
          <polygon
            points="167,30 184,14 201,30"
            fill={roofColor}
            stroke={strokeLine}
            strokeWidth="1.4"
          />
          <polygon
            points="184,14 194,11 210,27 201,30"
            fill={roofSide}
            stroke={strokeLine}
            strokeWidth="1.4"
          />

          {/* Tower Spire Rod & Spherical Beacon */}
          <line
            x1="184"
            y1="5"
            x2="184"
            y2="14"
            stroke="#ECC37A"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle
            cx="184"
            cy="4"
            r="3.5"
            fill="#ECC37A"
            stroke={strokeLine}
            strokeWidth="1"
          />

          {/* Tower Windows (Upper + Lower) */}
          <rect x="176" y="38" width="7" height="7" fill={windowFill} />
          <rect x="187" y="38" width="7" height="7" fill={windowFill} />
          <rect x="176" y="51" width="7" height="7" fill={windowFill} />
          <rect x="187" y="51" width="7" height="7" fill={windowFill} />
        </g>
      )}

      {/* LEVEL ORBS ON PLATFORM (Exact 3 golden circular markers on the front-left edge) */}
      {/* Placed cleanly along the front-left curb edge between (36, 88) and (140, 118) */}
      <g id="upgrade-orbs">
        {[1, 2, 3].map((step) => {
          const isActive = level >= step;
          // Step 1: (60, 95), Step 2: (74, 99), Step 3: (88, 103)
          const cx = 60 + (step - 1) * 14;
          const cy = 95 + (step - 1) * 4;
          return (
            <g key={step}>
              {/* Orb drop shadow */}
              <ellipse cx={cx} cy={cy + 1.2} rx="4" ry="2" fill="#140207" opacity="0.6" />
              {/* 3D Sphere Orb */}
              <circle
                cx={cx}
                cy={cy}
                r="4.2"
                fill={isActive ? '#ECC37A' : '#4D0E1C'}
                stroke={isActive ? strokeLine : '#8A152E'}
                strokeWidth="1.2"
              />
              {/* Specular highlight */}
              {isActive && (
                <circle cx={cx - 1.2} cy={cy - 1.2} r="1.2" fill="#FFF9ED" opacity="0.9" />
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
});
