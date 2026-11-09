import React from 'react';

// Custom Vector Icons for all 15 Utilities (Zero Lucide, Zero Emojis)
// Spec: Market_Monopoly_Property_Upgrade_System.docx
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
    case 5: // Sewerage System
      return (
        <svg data-utility-icon="5" className={mergedClass} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
          <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
          <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
        </svg>
      );
    case 6: // Car Parking Space
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
    case 10: // CCTV Cameras
      return (
        <svg data-utility-icon="10" className={mergedClass} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 8l13-5 5 10-13 5z" />
          <path d="M15 13l5 3v4" />
        </svg>
      );
    case 11: // Geyser
      return (
        <svg data-utility-icon="11" className={mergedClass} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="6" y="2" width="12" height="20" rx="3" />
          <circle cx="12" cy="14" r="3" />
          <path d="M12 6v2" />
        </svg>
      );
    case 12: // Public Transport Service
      return (
        <svg data-utility-icon="12" className={mergedClass} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="3" width="16" height="15" rx="2" />
          <path d="M4 11h16M8 18v3M16 18v3" />
          <circle cx="8.5" cy="14.5" r="1" fill="currentColor" />
          <circle cx="15.5" cy="14.5" r="1" fill="currentColor" />
        </svg>
      );
    case 13: // Road Maintenance
      return (
        <svg data-utility-icon="13" className={mergedClass} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 22L8 2M20 22L16 2M12 6v3M12 13v3M12 20v2" />
        </svg>
      );
    case 14: // Burglary Alarm
      return (
        <svg data-utility-icon="14" className={mergedClass} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      );
    case 15: // Surge Protection System
      return (
        <svg data-utility-icon="15" className={mergedClass} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
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

export const PropertyCategoryBackdrop = React.memo(function PropertyCategoryBackdrop({
  category = 'Residential',
  className = 'w-full h-28'
}) {
  return (
    <div className={`${className} relative overflow-hidden select-none pointer-events-none`}>
      <LandPlotIllustration category={category} level={3} showBadge={false} />
    </div>
  );
});

/**
 * ============================================================================
 * MATHEMATICAL ISOMETRIC 3D PROJECTION ENGINE (`iso(u, v, z)`)
 * ============================================================================
 * Every single vertex (ground slab, grass lawn, driveway, walls, windows,
 * doors, awnings, sloped roofs, cypress trees, and street lamps) is computed
 * in true 3D space (u, v, z) and projected to 2D via:
 *   X = OriginX + (u - v) * cos(30°)
 *   Y = OriginY + (u + v) * sin(30°) - z
 *
 * Because all coordinates share the exact same 3D space (u ∈ [0, 100], v ∈ [0, 100]),
 * buildings are 100% mathematically parallel and anchored to the land slab!
 * Runs on a lightweight 2D <canvas> with zero WebGL/CSS-3D browser bugs.
 */
const ISO_SCALE = 0.84;
const COS30 = 0.8660254 * ISO_SCALE; // ~0.7275
const SIN30 = 0.5 * ISO_SCALE;       // ~0.42
const Z_SCALE = 0.82;
const ORIGIN_X = 152;
const ORIGIN_Y = 48;

function isoPt(u, v, z = 0) {
  return [
    ORIGIN_X + (u - v) * COS30,
    ORIGIN_Y + (u + v) * SIN30 - z * Z_SCALE
  ];
}

function drawPoly(ctx, pts, fill, stroke = null, lineWidth = 0.8) {
  if (!pts.length) return;
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) {
    ctx.lineTo(pts[i][0], pts[i][1]);
  }
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.lineJoin = 'round';
    ctx.stroke();
  }
}

/**
 * Draws an extruded 3D box from (u1, v1, z1) to (u2, v2, z2)
 * Front-Left face = v === v2 (facing viewer-left, sunlit)
 * Front-Right face = u === u2 (facing viewer-right, shaded)
 * Top face = z === z2
 */
function drawIsoBox(ctx, u1, v1, z1, u2, v2, z2, colors, stroke = null, lw = 0.6) {
  const { left, right, top } = colors;
  // Top face
  if (top) {
    drawPoly(
      ctx,
      [isoPt(u1, v1, z2), isoPt(u2, v1, z2), isoPt(u2, v2, z2), isoPt(u1, v2, z2)],
      top,
      stroke,
      lw
    );
  }
  // Front-left face (v = v2, u from u1 to u2)
  if (left) {
    drawPoly(
      ctx,
      [isoPt(u1, v2, z1), isoPt(u2, v2, z1), isoPt(u2, v2, z2), isoPt(u1, v2, z2)],
      left,
      stroke,
      lw
    );
  }
  // Front-right face (u = u2, v from v1 to v2)
  if (right) {
    drawPoly(
      ctx,
      [isoPt(u2, v1, z1), isoPt(u2, v2, z1), isoPt(u2, v2, z2), isoPt(u2, v1, z2)],
      right,
      stroke,
      lw
    );
  }
}

/**
 * Draws a glass window on the Front-Left wall (constant v) with optional red awning
 */
function drawLeftWallWindow(ctx, u1, u2, v, z1, z2, hasAwning = false, awningColor = '#E04F5F') {
  // Outer white frame
  drawPoly(
    ctx,
    [isoPt(u1, v, z1), isoPt(u2, v, z1), isoPt(u2, v, z2), isoPt(u1, v, z2)],
    '#FFFFFF',
    '#8A9BA8',
    0.6
  );
  // Blue reflective glass pane
  const pad = 1.2;
  drawPoly(
    ctx,
    [
      isoPt(u1 + pad, v, z1 + pad),
      isoPt(u2 - pad, v, z1 + pad),
      isoPt(u2 - pad, v, z2 - pad),
      isoPt(u1 + pad, v, z2 - pad)
    ],
    '#67A3D9'
  );
  // Diagonal glass reflection highlight
  drawPoly(
    ctx,
    [
      isoPt(u1 + pad + 1, v, z1 + pad),
      isoPt(u1 + pad + 4.5, v, z1 + pad),
      isoPt(u1 + pad + 7, v, z2 - pad),
      isoPt(u1 + pad + 3.5, v, z2 - pad)
    ],
    '#9BC8F0'
  );
  // Center vertical mullion bar
  const uMid = (u1 + u2) / 2;
  ctx.beginPath();
  const [mx1, my1] = isoPt(uMid, v, z1 + pad);
  const [mx2, my2] = isoPt(uMid, v, z2 - pad);
  ctx.moveTo(mx1, my1);
  ctx.lineTo(mx2, my2);
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Optional 3D Red Awning jutting out in +v direction
  if (hasAwning) {
    const awD = 3.5;
    const awH = 2.8;
    // Awning sloped top
    drawPoly(
      ctx,
      [
        isoPt(u1 - 0.8, v, z2 + 1.2),
        isoPt(u2 + 0.8, v, z2 + 1.2),
        isoPt(u2 + 0.8, v + awD, z2 - awH + 1.2),
        isoPt(u1 - 0.8, v + awD, z2 - awH + 1.2)
      ],
      awningColor
    );
    // Awning front valence strip
    drawPoly(
      ctx,
      [
        isoPt(u1 - 0.8, v + awD, z2 - awH + 1.2),
        isoPt(u2 + 0.8, v + awD, z2 - awH + 1.2),
        isoPt(u2 + 0.8, v + awD, z2 - awH - 0.4),
        isoPt(u1 - 0.8, v + awD, z2 - awH - 0.4)
      ],
      '#B83242'
    );
    // Awning right side triangle
    drawPoly(
      ctx,
      [
        isoPt(u2 + 0.8, v, z2 + 1.2),
        isoPt(u2 + 0.8, v + awD, z2 - awH + 1.2),
        isoPt(u2 + 0.8, v, z2 - awH + 1.2)
      ],
      '#9E2432'
    );
  }
}

/**
 * Draws a conical cypress tree at (u, v, z=0) matching the reference illustration
 */
function drawCypressTree(ctx, u, v, height = 18, radius = 4.2) {
  const [cx, cy] = isoPt(u, v, 0);
  // Ground shadow ellipse
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(cx + 1, cy + 1, radius * 1.15, radius * 0.65, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(35, 55, 15, 0.45)';
  ctx.fill();

  // Tree trunk
  drawIsoBox(ctx, u - 0.8, v - 0.8, 0, u + 0.8, v + 0.8, 3, {
    left: '#7D5A3C',
    right: '#593E27',
    top: '#7D5A3C'
  });

  // Conical foliage (left lit half + right shaded half)
  const [tx, ty] = isoPt(u, v, height);
  const [bx, by] = isoPt(u, v, 2.5);
  const w = radius * ISO_SCALE * 1.05;

  // Full foliage cone base
  ctx.beginPath();
  ctx.moveTo(tx, ty);
  ctx.quadraticCurveTo(bx - w * 1.2, by - height * 0.25, bx - w, by);
  ctx.quadraticCurveTo(bx, by + w * 0.55, bx + w, by);
  ctx.quadraticCurveTo(bx + w * 1.2, by - height * 0.25, tx, ty);
  ctx.closePath();
  ctx.fillStyle = '#73993D';
  ctx.fill();

  // Shaded right half of cone for 3D volume
  ctx.beginPath();
  ctx.moveTo(tx, ty);
  ctx.lineTo(bx, by + w * 0.28);
  ctx.quadraticCurveTo(bx + w * 0.6, by + w * 0.25, bx + w, by);
  ctx.quadraticCurveTo(bx + w * 1.2, by - height * 0.25, tx, ty);
  ctx.closePath();
  ctx.fillStyle = '#557528';
  ctx.fill();
  ctx.restore();
}

/**
 * Draws an ornate double street lamp post at (u, v) matching reference image
 */
function drawStreetLamp(ctx, u, v, height = 22) {
  const [bx, by] = isoPt(u, v, 0);
  const [tx, ty] = isoPt(u, v, height);

  // Base pedestal
  ctx.beginPath();
  ctx.ellipse(bx, by, 2.5, 1.4, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#7E878C';
  ctx.fill();

  // Vertical pole
  ctx.beginPath();
  ctx.moveTo(bx, by);
  ctx.lineTo(tx, ty);
  ctx.strokeStyle = '#8C969C';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Twin curved arms
  ctx.beginPath();
  ctx.moveTo(tx - 5, ty - 2);
  ctx.quadraticCurveTo(tx - 2.5, ty + 2, tx, ty - 1);
  ctx.quadraticCurveTo(tx + 2.5, ty + 2, tx + 5, ty - 2);
  ctx.strokeStyle = '#9EA8AE';
  ctx.lineWidth = 1.1;
  ctx.stroke();

  // Glowing golden lanterns
  [-5, 5].forEach((dx) => {
    ctx.beginPath();
    ctx.arc(tx + dx, ty - 3.2, 1.8, 0, Math.PI * 2);
    ctx.fillStyle = '#FFD54F';
    ctx.fill();
    ctx.strokeStyle = '#4A5257';
    ctx.lineWidth = 0.7;
    ctx.stroke();
  });
}

/**
 * Renders the complete 3D Isometric Residential Villa Scene (exact match to reference image)
 * Distinct evolutionary stages for Level 0, Level 1, Level 2, and Level 3:
 * - Level 0: Vacant Zoned Land Slab with lawn strips, trees, and survey marker
 * - Level 1: Cozy 1-Story Suburban Cottage (Single wing, red steps, window with red awning, pitched terracotta roof)
 * - Level 2: Expanded 2-Story Family House + Attached Garage Wing + Sweeping Terracotta Roof + 2nd-story Awning Windows
 * - Level 3: Grand Luxury Estate Villa (Adds Attic Roof Dormer Window, Flower Planter Boxes, Twin Street Lamps & Full Cypress Landscaping)
 */
function renderResidentialScene(ctx, level) {
  // 1. Concrete Sidewalk / Driveway Base Slab (u: 4..96, v: 4..96, z: 0..6)
  drawIsoBox(ctx, 4, 4, 0, 96, 96, 6, {
    left: '#E2E4E6',
    right: '#C2C6CA',
    top: '#ECEEEF'
  });

  // 2. Green Grass Lawn Strips along the perimeter & yard
  // Left lawn strip
  drawPoly(
    ctx,
    [isoPt(8, 56, 6.1), isoPt(36, 56, 6.1), isoPt(36, 92, 6.1), isoPt(8, 92, 6.1)],
    '#8AB346'
  );
  // Center divider lawn strip between front walk and garage driveway
  drawPoly(
    ctx,
    [isoPt(44, 62, 6.1), isoPt(56, 62, 6.1), isoPt(56, 86, 6.1), isoPt(44, 86, 6.1)],
    '#8AB346'
  );
  // Front-right & side lawn strip
  drawPoly(
    ctx,
    [isoPt(84, 10, 6.1), isoPt(93, 10, 6.1), isoPt(93, 92, 6.1), isoPt(84, 92, 6.1)],
    '#8AB346'
  );

  if (level === 0) {
    // Vacant Zoned Residential Lot with trees & survey plinth
    drawCypressTree(ctx, 18, 82, 17, 3.8);
    drawCypressTree(ctx, 88, 84, 17, 3.8);
    drawStreetLamp(ctx, 12, 74, 20);
    drawIsoBox(ctx, 38, 38, 6, 62, 62, 9, {
      left: '#C59B6D',
      right: '#A37B4C',
      top: '#D8B48A'
    });
    return;
  }

  // LEVEL 1: Cozy 1-Story Cottage on the Land Plot
  if (level === 1) {
    // Right yard grass patch (where garage will be built at Level 2)
    drawPoly(
      ctx,
      [isoPt(56, 22, 6.1), isoPt(82, 22, 6.1), isoPt(82, 68, 6.1), isoPt(56, 68, 6.1)],
      '#8AB346'
    );

    // 1-Story Cottage Baseboard & Walls (u: 20..56, v: 22..64, z: 6..36)
    drawIsoBox(ctx, 20, 22, 6, 56, 64, 11, {
      left: '#D8C3A5',
      right: '#BFA888',
      top: '#E6D5BC'
    });
    drawIsoBox(ctx, 20, 22, 11, 56, 64, 36, {
      left: '#F5F5F5',
      right: '#D2D2D2',
      top: '#FFFFFF'
    });

    // Gable Triangle Peak on Front-Left Wall
    const peakZ = 50;
    drawPoly(
      ctx,
      [isoPt(20, 64, 36), isoPt(56, 64, 36), isoPt(38, 64, peakZ)],
      '#F5F5F5'
    );

    // Wooden Front Door & Red Steps
    drawPoly(
      ctx,
      [isoPt(39, 64.2, 10), isoPt(49, 64.2, 10), isoPt(49, 64.2, 29), isoPt(39, 64.2, 29)],
      '#8D5B3A'
    );
    drawLeftWallWindow(ctx, 41, 47, 64.4, 18, 26, false);
    drawIsoBox(ctx, 38, 64, 6, 50, 70, 8.2, {
      left: '#D64550',
      right: '#A82E38',
      top: '#E85D68'
    });
    drawIsoBox(ctx, 38, 64, 8.2, 50, 67.5, 10.2, {
      left: '#D64550',
      right: '#A82E38',
      top: '#E85D68'
    });

    // Ground Floor Window with Red Awning
    drawLeftWallWindow(ctx, 24, 35, 64.2, 15, 29, true, '#E04F5F');

    // Symmetrical Cottage Pitched Terracotta Roof
    drawPoly(
      ctx,
      [isoPt(17, 66, 34), isoPt(38, 66, peakZ + 1), isoPt(38, 19, peakZ + 1), isoPt(17, 19, 34)],
      '#9E6B47'
    );
    drawPoly(
      ctx,
      [isoPt(38, 66, peakZ + 1), isoPt(59, 66, 34), isoPt(59, 19, 34), isoPt(38, 19, peakZ + 1)],
      '#C68B59',
      '#9E6B47',
      0.8
    );

    drawCypressTree(ctx, 22, 76, 17, 3.8);
    drawCypressTree(ctx, 70, 50, 18, 4.0);
    drawStreetLamp(ctx, 13, 72, 21);
    return;
  }

  // LEVEL 2 & LEVEL 3: 2-Story Main Villa + Attached Right Garage Wing
  // 3. RIGHT WING / GARAGE SECTION (u: 48..84, v: 18..68, z: 6..38)
  drawIsoBox(ctx, 48, 18, 6, 84, 68, 11, {
    left: '#D8C3A5',
    right: '#BFA888',
    top: '#E6D5BC'
  });
  drawIsoBox(ctx, 48, 18, 11, 84, 68, 38, {
    left: '#EFEFEF',
    right: '#CCCCCC',
    top: '#E0E0E0'
  });
  // Dark Charcoal Garage Door on Front-Left Wall (v = 68.2, u: 52..80, z: 6..25)
  drawPoly(
    ctx,
    [isoPt(52, 68.2, 6), isoPt(80, 68.2, 6), isoPt(80, 68.2, 25), isoPt(52, 68.2, 25)],
    '#FFFFFF'
  );
  drawPoly(
    ctx,
    [isoPt(53, 68.3, 6), isoPt(79, 68.3, 6), isoPt(79, 68.3, 24), isoPt(53, 68.3, 24)],
    '#5A5D60'
  );
  // Garage Upper Picture Window (v = 68.2, u: 56..76, z: 28..41)
  drawLeftWallWindow(ctx, 56, 76, 68.2, 28, 41, false);

  // 4. LEFT MAIN 2-STORY HOUSE WING (u: 14..52, v: 18..64, z: 6..58)
  const mainH = 58;
  drawIsoBox(ctx, 14, 18, 6, 52, 64, 12, {
    left: '#D8C3A5',
    right: '#BFA888',
    top: '#E6D5BC'
  });
  drawIsoBox(ctx, 14, 18, 12, 52, 64, mainH, {
    left: '#F5F5F5',
    right: '#D2D2D2',
    top: '#FFFFFF'
  });

  // Gable Triangle Peak on Front-Left Wall (u: 14..52, v: 64, apex at u=33, z = mainH + 18)
  const roofPeakZ = mainH + 18;
  drawPoly(
    ctx,
    [isoPt(14, 64, mainH), isoPt(52, 64, mainH), isoPt(33, 64, roofPeakZ)],
    '#F5F5F5'
  );

  // Wooden Front Door with Glass Lite (u: 33..43, v: 64.2, z: 10..31)
  drawPoly(
    ctx,
    [isoPt(33, 64.2, 10), isoPt(43, 64.2, 10), isoPt(43, 64.2, 31), isoPt(33, 64.2, 31)],
    '#8D5B3A'
  );
  drawPoly(
    ctx,
    [isoPt(34.2, 64.3, 10.5), isoPt(41.8, 64.3, 10.5), isoPt(41.8, 64.3, 29.8), isoPt(34.2, 64.3, 29.8)],
    '#A8724D'
  );
  drawLeftWallWindow(ctx, 35.2, 40.8, 64.4, 19, 28, false);

  // Red Front Stoop Steps (3 cascading steps in front of door, u: 32..44, v: 64..71)
  drawIsoBox(ctx, 32, 64, 6, 44, 71, 8, {
    left: '#D64550',
    right: '#A82E38',
    top: '#E85D68'
  });
  drawIsoBox(ctx, 32, 64, 8, 44, 68.8, 9.8, {
    left: '#D64550',
    right: '#A82E38',
    top: '#E85D68'
  });
  drawIsoBox(ctx, 32, 64, 9.8, 44, 66.5, 11.2, {
    left: '#D64550',
    right: '#A82E38',
    top: '#E85D68'
  });

  // Ground Floor Window with Red Awning
  drawLeftWallWindow(ctx, 18, 29, 64.2, 16, 31, true, '#E04F5F');

  // Second Floor Windows with Red Awnings
  drawLeftWallWindow(ctx, 18, 29, 64.2, 37, 51, true, '#E04F5F');
  drawLeftWallWindow(ctx, 34, 45, 64.2, 37, 51, true, '#E04F5F');

  // 5. SWEEPING TERRACOTTA / WARM BROWN SLOPED ROOF
  drawPoly(
    ctx,
    [
      isoPt(11, 66, mainH - 2),
      isoPt(33, 66, roofPeakZ + 1),
      isoPt(33, 15, roofPeakZ + 1),
      isoPt(11, 15, mainH - 2)
    ],
    '#9E6B47'
  );
  drawPoly(
    ctx,
    [
      isoPt(11, 66, mainH - 2),
      isoPt(33, 66, roofPeakZ + 1),
      isoPt(33, 64, roofPeakZ - 1),
      isoPt(13, 64, mainH - 3)
    ],
    '#875838'
  );

  // Main Sweeping Right Roof Plane over Garage
  drawPoly(
    ctx,
    [
      isoPt(33, 67, roofPeakZ + 1),
      isoPt(87, 70, 36),
      isoPt(87, 15, 36),
      isoPt(33, 15, roofPeakZ + 1)
    ],
    '#C68B59',
    '#9E6B47',
    0.8
  );

  // LEVEL 3: Roof Dormer Window + Flower Planters + Full Cypress Trees & Twin Street Lamps
  if (level >= 3) {
    const dU1 = 44;
    const dU2 = 55;
    const dV1 = 34;
    const dV2 = 48;
    const dBaseZ = 56;
    const dTopZ = 66;
    drawPoly(
      ctx,
      [isoPt(dU1, dV2, dBaseZ), isoPt(dU2, dV2, dBaseZ - 6), isoPt(dU2, dV2, dTopZ), isoPt(dU1, dV2, dTopZ)],
      '#8C5B3C'
    );
    drawPoly(
      ctx,
      [isoPt(dU2, dV1, dBaseZ - 6), isoPt(dU2, dV2, dBaseZ - 6), isoPt(dU2, dV2, dTopZ), isoPt(dU2, dV1, dTopZ)],
      '#FFFFFF'
    );
    drawPoly(
      ctx,
      [
        isoPt(dU2 + 0.1, dV1 + 2, dBaseZ - 4.5),
        isoPt(dU2 + 0.1, dV2 - 2, dBaseZ - 4.5),
        isoPt(dU2 + 0.1, dV2 - 2, dTopZ - 1.5),
        isoPt(dU2 + 0.1, dV1 + 2, dTopZ - 1.5)
      ],
      '#67A3D9'
    );
    drawPoly(
      ctx,
      [
        isoPt(dU1 - 2, dV2 + 1, dTopZ),
        isoPt(dU2 + 2, dV2 + 1, dTopZ),
        isoPt(dU2 + 2, (dV1 + dV2) / 2, dTopZ + 5),
        isoPt(dU1 - 2, (dV1 + dV2) / 2, dTopZ + 5)
      ],
      '#B57C4E'
    );
    drawPoly(
      ctx,
      [
        isoPt(dU1 - 2, (dV1 + dV2) / 2, dTopZ + 5),
        isoPt(dU2 + 2, (dV1 + dV2) / 2, dTopZ + 5),
        isoPt(dU2 + 2, dV1 - 1, dTopZ),
        isoPt(dU1 - 2, dV1 - 1, dTopZ)
      ],
      '#CF9666'
    );

    // White Flower Planter Boxes along house base
    drawIsoBox(ctx, 18, 65, 6, 26, 68.5, 8.5, {
      left: '#E0E4E8',
      right: '#B8C0C8',
      top: '#76A038'
    });
    drawIsoBox(ctx, 45, 65, 6, 51, 68.5, 8.5, {
      left: '#E0E4E8',
      right: '#B8C0C8',
      top: '#76A038'
    });
  }

  // Conical Cypress Trees & Ornate Street Lamps on the Lawn
  drawCypressTree(ctx, 22, 76, 19, 4.2);
  drawCypressTree(ctx, 48, 76, 18, 4.0);
  drawCypressTree(ctx, 88, 78, 19, 4.2);
  drawStreetLamp(ctx, 13, 72, 23);
  if (level >= 3) {
    drawStreetLamp(ctx, 86, 68, 23);
  }
}

/**
 * Renders the 3D Isometric Commercial High-Rise Financial Plaza Scene
 * Distinct Level 1, 2, 3 architectural progressions:
 * - Level 1: Single-Story Boutique Retail & Banking Showroom with Crimson Awnings
 * - Level 2: Adds Mid-Rise 3-Story Corporate Glass Office Tower + Revolving Canopy Entrance
 * - Level 3: Full Skyscraper Financial Complex with Executive Penthouse Crown, Helipad & Telecom Spire
 */
function renderCommercialScene(ctx, level) {
  // 1. Paved Marble / Granite Executive Plaza Base Slab
  drawIsoBox(ctx, 4, 4, 0, 96, 96, 6, {
    left: '#DED8CE',
    right: '#BFB8AC',
    top: '#EFECE6'
  });

  // Decorative Gold-Trimmed Plaza Courtyard Tile Inlay
  drawPoly(
    ctx,
    [isoPt(12, 12, 6.1), isoPt(88, 12, 6.1), isoPt(88, 88, 6.1), isoPt(12, 88, 6.1)],
    '#E5DFD5',
    '#C8A96E',
    0.8
  );

  // Ornamental Green Planter Strips
  drawPoly(
    ctx,
    [isoPt(10, 68, 6.2), isoPt(34, 68, 6.2), isoPt(34, 90, 6.2), isoPt(10, 90, 6.2)],
    '#7CA642'
  );
  drawPoly(
    ctx,
    [isoPt(72, 68, 6.2), isoPt(90, 68, 6.2), isoPt(90, 90, 6.2), isoPt(72, 90, 6.2)],
    '#7CA642'
  );

  if (level === 0) {
    drawCypressTree(ctx, 18, 80, 16, 3.6);
    drawCypressTree(ctx, 82, 80, 16, 3.6);
    drawIsoBox(ctx, 36, 36, 6, 64, 64, 9, {
      left: '#8B1E32',
      right: '#5E1120',
      top: '#D4A85B'
    });
    return;
  }

  // LEVEL 1: Boutique Commercial Retail & Banking Plaza
  if (level === 1) {
    drawIsoBox(ctx, 22, 24, 6, 78, 64, 34, {
      left: '#F2EFE9',
      right: '#D0C9BE',
      top: '#D8C3A5'
    });
    drawIsoBox(ctx, 21, 23, 34, 79, 65, 38, {
      left: '#8B1E32',
      right: '#5E1120',
      top: '#ECC37A'
    });
    drawLeftWallWindow(ctx, 26, 40, 64.2, 8, 28, true, '#8B1E32');
    drawLeftWallWindow(ctx, 44, 58, 64.2, 8, 28, true, '#8B1E32');
    drawLeftWallWindow(ctx, 62, 74, 64.2, 8, 28, true, '#8B1E32');
    drawCypressTree(ctx, 20, 78, 17, 3.8);
    drawStreetLamp(ctx, 12, 74, 21);
    return;
  }

  // LEVEL 2 & LEVEL 3: Right Luxury Retail Wing + Left Corporate Glass Tower
  // 2. RIGHT LUXURY RETAIL & BANKING SHOWROOM WING (u: 54..86, v: 22..66, z: 6..36)
  drawIsoBox(ctx, 54, 22, 6, 86, 66, 36, {
    left: '#F2EFE9',
    right: '#D0C9BE',
    top: '#D8C3A5'
  });
  drawIsoBox(ctx, 53, 21, 36, 87, 67, 40, {
    left: '#8B1E32',
    right: '#5E1120',
    top: '#ECC37A'
  });
  drawLeftWallWindow(ctx, 58, 70, 66.2, 8, 28, true, '#8B1E32');
  drawLeftWallWindow(ctx, 72, 83, 66.2, 8, 28, true, '#8B1E32');

  // 3. LEFT MAIN CORPORATE GLASS TOWER (u: 16..56, v: 18..62)
  const towerH = level >= 3 ? 76 : 56;
  drawIsoBox(ctx, 16, 18, 6, 56, 62, 16, {
    left: '#D8C3A5',
    right: '#B8A080',
    top: '#E5D4BC'
  });
  drawIsoBox(ctx, 16, 18, 16, 56, 62, towerH, {
    left: '#F7F5F0',
    right: '#D5CFC4',
    top: '#E8E2D8'
  });

  // Curtain-Wall Blue Glass Floor Bands on Front-Left & Front-Right Facades
  const floors = level >= 3 ? 4 : 3;
  for (let f = 0; f < floors; f++) {
    const zBot = 20 + f * 13;
    const zTop = zBot + 9;
    drawLeftWallWindow(ctx, 20, 34, 62.2, zBot, zTop, false);
    drawLeftWallWindow(ctx, 38, 52, 62.2, zBot, zTop, false);

    drawPoly(
      ctx,
      [isoPt(56.2, 23, zBot), isoPt(56.2, 57, zBot), isoPt(56.2, 57, zTop), isoPt(56.2, 23, zTop)],
      '#548EC2',
      '#FFFFFF',
      0.5
    );
  }

  // Grand Revolving Door Canopy Entrance
  drawPoly(
    ctx,
    [isoPt(30, 62.2, 6), isoPt(44, 62.2, 6), isoPt(44, 62.2, 16), isoPt(30, 62.2, 16)],
    '#3B0C18'
  );
  drawIsoBox(ctx, 28, 62, 15, 46, 68, 17.5, {
    left: '#ECC37A',
    right: '#C89B4B',
    top: '#FFE5A8'
  });

  // LEVEL 3: Executive Penthouse Crown + Helipad + Communications Spire
  if (level >= 3) {
    drawIsoBox(ctx, 22, 24, towerH, 50, 56, towerH + 8, {
      left: '#8B1E32',
      right: '#5E1120',
      top: '#3B0C18'
    });
    const [hx, hy] = isoPt(36, 40, towerH + 8.2);
    ctx.beginPath();
    ctx.ellipse(hx, hy, 8, 4.5, 0, 0, Math.PI * 2);
    ctx.strokeStyle = '#ECC37A';
    ctx.lineWidth = 1.3;
    ctx.stroke();

    const [sx1, sy1] = isoPt(28, 30, towerH + 8);
    const [sx2, sy2] = isoPt(28, 30, towerH + 22);
    ctx.beginPath();
    ctx.moveTo(sx1, sy1);
    ctx.lineTo(sx2, sy2);
    ctx.strokeStyle = '#ECC37A';
    ctx.lineWidth = 1.8;
    ctx.stroke();
  }

  drawCypressTree(ctx, 20, 78, 18, 3.8);
  drawCypressTree(ctx, 80, 78, 18, 3.8);
  drawStreetLamp(ctx, 12, 74, 22);
  if (level >= 3) {
    drawStreetLamp(ctx, 64, 76, 22);
  }
}

/**
 * Renders the 3D Isometric Industrial Manufacturing Plant, Silos & Port Yard Scene
 * Distinct Level 1, 2, 3 architectural progressions:
 * - Level 1: Logistics Warehouse & Roll-Up Cargo Dock + Yard Container
 * - Level 2: Adds Main Pitched-Roof Manufacturing Plant + Twin Smokestack Chimneys
 * - Level 3: Full Industrial Port Complex with Double-Stacked Containers & Overhead Yellow Steel Gantry Crane
 */
function renderIndustrialScene(ctx, level) {
  // 1. Heavy-Duty Industrial Concrete & Asphalt Yard Slab
  drawIsoBox(ctx, 4, 4, 0, 96, 96, 6, {
    left: '#C8C4BE',
    right: '#A6A29C',
    top: '#D8D5D0'
  });

  // Hazard Apron Zone Markings
  drawPoly(
    ctx,
    [isoPt(12, 58, 6.1), isoPt(88, 58, 6.1), isoPt(88, 90, 6.1), isoPt(12, 90, 6.1)],
    '#C2BEB8',
    '#D97724',
    0.8
  );

  if (level === 0) {
    drawIsoBox(ctx, 20, 62, 6, 44, 76, 16, {
      left: '#D97724',
      right: '#A85516',
      top: '#E68A35'
    });
    return;
  }

  // LEVEL 1: Single Logistics Warehouse & Cargo Loading Dock
  if (level === 1) {
    drawIsoBox(ctx, 28, 22, 6, 78, 64, 34, {
      left: '#EBE6DF',
      right: '#C9C2B8',
      top: '#B35422'
    });
    drawIsoBox(ctx, 27, 21, 34, 79, 65, 37, {
      left: '#B35422',
      right: '#8C3E14',
      top: '#D97724'
    });
    [34, 56].forEach((uStart) => {
      drawPoly(
        ctx,
        [isoPt(uStart, 64.2, 6), isoPt(uStart + 14, 64.2, 6), isoPt(uStart + 14, 64.2, 23), isoPt(uStart, 64.2, 23)],
        '#4A4E52',
        '#FFFFFF',
        0.6
      );
    });
    drawIsoBox(ctx, 16, 70, 6, 38, 82, 16, {
      left: '#D97724',
      right: '#A85516',
      top: '#E68A35'
    });
    drawStreetLamp(ctx, 12, 68, 21);
    return;
  }

  // LEVEL 2 & LEVEL 3: Full Warehouse Wing + Main Manufacturing Plant + Twin Smokestacks
  // 2. RIGHT LOGISTICS WAREHOUSE & LOADING DOCK WING (u: 52..88, v: 20..66, z: 6..34)
  drawIsoBox(ctx, 52, 20, 6, 88, 66, 34, {
    left: '#EBE6DF',
    right: '#C9C2B8',
    top: '#B35422'
  });
  drawIsoBox(ctx, 51, 19, 34, 89, 67, 37, {
    left: '#B35422',
    right: '#8C3E14',
    top: '#D97724'
  });
  [56, 72].forEach((uStart) => {
    drawPoly(
      ctx,
      [isoPt(uStart, 66.2, 6), isoPt(uStart + 12, 66.2, 6), isoPt(uStart + 12, 66.2, 23), isoPt(uStart, 66.2, 23)],
      '#4A4E52',
      '#FFFFFF',
      0.6
    );
    for (let zRib = 10; zRib <= 20; zRib += 4) {
      const [rx1, ry1] = isoPt(uStart + 0.5, 66.3, zRib);
      const [rx2, ry2] = isoPt(uStart + 11.5, 66.3, zRib);
      ctx.beginPath();
      ctx.moveTo(rx1, ry1);
      ctx.lineTo(rx2, ry2);
      ctx.strokeStyle = '#8C949A';
      ctx.lineWidth = 0.7;
      ctx.stroke();
    }
  });

  // 3. LEFT MAIN MANUFACTURING PLANT WITH PITCHED FACTORY ROOF (u: 14..54, v: 18..62, z: 6..48)
  const plantH = 48;
  drawIsoBox(ctx, 14, 18, 6, 54, 62, 12, {
    left: '#B89F82',
    right: '#967E62',
    top: '#C8B094'
  });
  drawIsoBox(ctx, 14, 18, 12, 54, 62, plantH, {
    left: '#F2EEE9',
    right: '#CFC9C0',
    top: '#E0DAD0'
  });

  const peakZ = plantH + 14;
  drawPoly(
    ctx,
    [isoPt(14, 62, plantH), isoPt(54, 62, plantH), isoPt(34, 62, peakZ)],
    '#F2EEE9'
  );
  drawPoly(
    ctx,
    [isoPt(12, 64, plantH - 1), isoPt(34, 64, peakZ + 1), isoPt(34, 16, peakZ + 1), isoPt(12, 16, plantH - 1)],
    '#8C4A27'
  );
  drawPoly(
    ctx,
    [isoPt(34, 64, peakZ + 1), isoPt(56, 64, plantH - 1), isoPt(56, 16, plantH - 1), isoPt(34, 16, peakZ + 1)],
    '#B86538'
  );

  drawLeftWallWindow(ctx, 18, 31, 62.2, 20, 34, false);
  drawLeftWallWindow(ctx, 36, 49, 62.2, 20, 34, false);

  // 4. TWIN SMOKESTACK CHIMNEYS
  [22, 34].forEach((uStack, idx) => {
    const topZ = peakZ + 14 + idx * 5;
    drawIsoBox(ctx, uStack, 26, peakZ - 4, uStack + 7, 33, topZ, {
      left: '#7D4E38',
      right: '#593423',
      top: '#3A1E12'
    });
    drawIsoBox(ctx, uStack - 0.4, 25.6, topZ - 4, uStack + 7.4, 33.4, topZ - 1, {
      left: '#E67E22',
      right: '#B35422',
      top: '#F39C12'
    });
  });

  // 5. SHIPPING CONTAINERS & STEEL GANTRY CRANE (Level 3)
  drawIsoBox(ctx, 16, 70, 6, 38, 82, 16, {
    left: '#D97724',
    right: '#A85516',
    top: '#E68A35'
  });
  if (level >= 3) {
    drawIsoBox(ctx, 18, 71, 16, 36, 81, 25, {
      left: '#2E6B9E',
      right: '#1D496E',
      top: '#3E82BA'
    });
    drawIsoBox(ctx, 64, 72, 6, 67, 75, 42, {
      left: '#F1C40F',
      right: '#C29D0B',
      top: '#F5D342'
    });
    drawIsoBox(ctx, 84, 72, 6, 87, 75, 42, {
      left: '#F1C40F',
      right: '#C29D0B',
      top: '#F5D342'
    });
    drawIsoBox(ctx, 62, 71, 42, 89, 76, 46, {
      left: '#F39C12',
      right: '#B87409',
      top: '#F7B731'
    });
  }

  drawStreetLamp(ctx, 12, 68, 22);
}

export const LandPlotIllustration = React.memo(function LandPlotIllustration({
  category = 'Residential',
  level = 0,
  utilityCount = 0,
  isHighlighted = false,
  showBadge = true
}) {
  const canvasRef = React.useRef(null);
  const catLower = (category || '').toLowerCase();
  const isIndustrial = catLower.includes('industrial') || catLower.includes('port');
  const isCommercial =
    !isIndustrial &&
    (catLower.includes('commercial') ||
      catLower.includes('transport') ||
      catLower.includes('institutional') ||
      catLower.includes('heritage'));

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = 300;
    const H = 145;
    if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
      canvas.width = W * dpr;
      canvas.height = H * dpr;
    }
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    // Soft Ground Drop Shadow beneath the 3D Isometric Slab
    drawPoly(
      ctx,
      [isoPt(2, 6, -2), isoPt(98, 6, -2), isoPt(98, 99, -2), isoPt(2, 99, -2)],
      'rgba(0, 0, 0, 0.35)'
    );

    if (isIndustrial) {
      renderIndustrialScene(ctx, level);
    } else if (isCommercial) {
      renderCommercialScene(ctx, level);
    } else {
      renderResidentialScene(ctx, level);
    }

    // 3 Upgrade Level Indicator Orbs along Front-Left Sidewalk Edge
    for (let step = 1; step <= 3; step++) {
      const isActive = level >= step;
      const uOrb = 20 + (step - 1) * 14;
      const [ox, oy] = isoPt(uOrb, 91, 6.5);
      ctx.beginPath();
      ctx.arc(ox, oy, 3.6, 0, Math.PI * 2);
      ctx.fillStyle = isActive ? '#ECC37A' : 'rgba(60, 20, 30, 0.45)';
      ctx.fill();
      ctx.strokeStyle = isActive ? '#3B0C18' : 'rgba(255,255,255,0.35)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.restore();
  }, [category, level, isIndustrial, isCommercial, isHighlighted]);

  const badgeLabel = isIndustrial ? 'INDUSTRIAL' : isCommercial ? 'COMMERCIAL' : 'RESIDENTIAL';

  return (
    <div
      className="relative w-full h-28 sm:h-32 select-none pointer-events-none overflow-hidden rounded-2xl"
      style={{
        background: isHighlighted
          ? 'radial-gradient(circle at 50% 35%, #4A1220 0%, #24060E 100%)'
          : 'radial-gradient(circle at 50% 35%, #340C18 0%, #1A040B 100%)'
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain block"
      />

      {showBadge && (
        <div
          className="absolute top-2.5 left-3 px-2.5 py-0.5 rounded-md border text-[9.5px] font-extrabold tracking-wider"
          style={{
            backgroundColor: '#3B0C18',
            borderColor: '#ECC37A',
            color: '#ECC37A',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        >
          {level === 0 ? 'EMPTY' : `LEVEL ${level}`}
        </div>
      )}

      {showBadge && (
        <div
          className="absolute top-2.5 right-3 px-2 py-0.5 rounded border text-[8px] font-mono font-bold tracking-widest uppercase"
          style={{
            backgroundColor: 'rgba(20, 4, 10, 0.72)',
            borderColor: 'rgba(236, 195, 122, 0.35)',
            color: '#F5E0B7'
          }}
        >
          {badgeLabel}
        </div>
      )}
    </div>
  );
});
