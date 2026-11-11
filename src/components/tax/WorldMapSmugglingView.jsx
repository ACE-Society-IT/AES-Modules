import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DottedMap from 'dotted-map';
import { TactileButton } from '../ui/EasyComponents.jsx';
import { IconAlert, IconShield, IconLock } from '../ui/CustomIcons.jsx';
import CityLandmarkSvg from './CityLandmarkSvgs.jsx';
import { DEFAULT_TAX_HAVENS } from '../../constants/taxHavens.js';

// Spatially Calibrated Cartographic Coordinates (Accurate & Anti-Overlap Spaced)
const HAVEN_MAP_COORDINATES = {
  // Western Europe - Spaced regional anchors (NW Benelux, East Swiss Alps, West Lake Geneva, French Riviera)
  london: { x: 59.0, y: 14.7, code: 'LDN' },
  luxembourg: { x: 60.5, y: 15.5, code: 'LUX' },
  'luxembourg city': { x: 60.5, y: 15.5, code: 'LUX' },
  zurich: { x: 63.8, y: 17.0, code: 'ZRH' },
  geneva: { x: 60.0, y: 17.8, code: 'GVA' },
  monaco: { x: 62.8, y: 19.8, code: 'MCO' },

  // Middle East & Asia (Karachi on Arabian Sea coast of Pakistan, Dubai on UAE Arabian Peninsula coast)
  dubai: { x: 78.0, y: 29.2, code: 'DXB' },
  singapore: { x: 95.5, y: 35.5, code: 'SIN' },
  karachi: { x: 83.0, y: 26.85, code: 'KHI' },

  // Americas & Caribbean (Western Caribbean Sea, Panama Isthmus, Eastern Leeward Archipelago)
  'george town': { x: 30.5, y: 29.5, code: 'CYM' },
  cayman: { x: 30.5, y: 29.5, code: 'CYM' },
  'cayman islands': { x: 30.5, y: 29.5, code: 'CYM' },
  'panama city': { x: 32.0, y: 33.0, code: 'PTY' },
  panama: { x: 32.0, y: 33.0, code: 'PTY' },
  'road town': { x: 36.5, y: 29.5, code: 'BVI' },
  bvi: { x: 36.5, y: 29.5, code: 'BVI' },
  'british virgin islands': { x: 36.5, y: 29.5, code: 'BVI' },

  // Cyberspace Tumbler (Deep North Atlantic Ocean, clear of all landmasses)
  cyberspace: { x: 48.0, y: 10.0, code: 'WEB' }
};

export default function WorldMapSmugglingView({ gameState, team, onAllocateTax }) {
  const taxHavens = (Array.isArray(gameState?.taxChannels) && gameState.taxChannels.length > 0)
    ? gameState.taxChannels
    : DEFAULT_TAX_HAVENS;
  const isRound3 = Number(gameState?.currentRound) === 3;
  const isTradingOpen = gameState?.phase === 'TRADING' && !gameState?.isPaused;

  const [selectedCityId, setSelectedCityId] = useState(() => taxHavens[0]?.id || 1);
  const [hoveredCityId, setHoveredCityId] = useState(null);
  const [smuggleAmount, setSmuggleAmount] = useState('15000');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Map Zoom & Pan State
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState({ x: 60, y: 30 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);

  // Modals
  const [caughtModal, setCaughtModal] = useState(null);
  const [successModal, setSuccessModal] = useState(null);

  const svgRef = useRef(null);
  const mapContainerRef = useRef(null);
  const stateRef = useRef({ zoom: 1, center: { x: 60, y: 30 } });
  stateRef.current = { zoom, center };

  const selectedCity = taxHavens.find((h) => h.id === selectedCityId) || taxHavens[0] || null;
  const availableCash = Number(team?.cash || 0);

  useEffect(() => {
    if (taxHavens.length > 0 && !taxHavens.some((h) => h.id === selectedCityId)) {
      setSelectedCityId(taxHavens[0].id);
    }
  }, [taxHavens, selectedCityId]);

  // Generate dotted-map background dots and overlay pinpoint haven coordinates with non-overlapping spacing
  const { mapPoints, havenPins, originPin } = useMemo(() => {
    const map = new DottedMap({ height: 60, grid: 'diagonal' });
    const points = map.getPoints();

    // Karachi Desk Origin (Coastal Pakistan Arabian Sea)
    const origin = { x: 83.0, y: 26.85 };

    const pins = taxHavens.map((h) => {
      const cityKey = (h.city || h.name || '').toLowerCase();
      let coords = HAVEN_MAP_COORDINATES[cityKey];
      let code = 'OFF';

      if (coords) {
        code = coords.code;
      } else {
        if (cityKey.includes('dubai')) { coords = HAVEN_MAP_COORDINATES.dubai; code = 'DXB'; }
        else if (cityKey.includes('zurich') || cityKey.includes('swiss')) { coords = HAVEN_MAP_COORDINATES.zurich; code = 'ZRH'; }
        else if (cityKey.includes('geneva')) { coords = HAVEN_MAP_COORDINATES.geneva; code = 'GVA'; }
        else if (cityKey.includes('panama')) { coords = HAVEN_MAP_COORDINATES['panama city']; code = 'PTY'; }
        else if (cityKey.includes('luxembourg')) { coords = HAVEN_MAP_COORDINATES.luxembourg; code = 'LUX'; }
        else if (cityKey.includes('monaco')) { coords = HAVEN_MAP_COORDINATES.monaco; code = 'MCO'; }
        else if (cityKey.includes('singapore')) { coords = HAVEN_MAP_COORDINATES.singapore; code = 'SIN'; }
        else if (cityKey.includes('road') || cityKey.includes('bvi')) { coords = HAVEN_MAP_COORDINATES['road town']; code = 'BVI'; }
        else if (cityKey.includes('cayman') || cityKey.includes('george')) { coords = HAVEN_MAP_COORDINATES.cayman; code = 'CYM'; }
        else if (cityKey.includes('london')) { coords = HAVEN_MAP_COORDINATES.london; code = 'LDN'; }
        else { coords = HAVEN_MAP_COORDINATES.cyberspace; code = 'WEB'; }
      }

      return {
        ...h,
        airportCode: code,
        pinX: coords.x,
        pinY: coords.y
      };
    });

    return {
      mapPoints: points,
      havenPins: pins,
      originPin: origin
    };
  }, [taxHavens]);

  // ViewBox bounds clamping helper
  const clampCenter = useCallback((cx, cy, z) => {
    const w = 120 / z;
    const h = 60 / z;
    const clampedX = Math.max(w / 2, Math.min(120 - w / 2, cx));
    const clampedY = Math.max(h / 2, Math.min(60 - h / 2, cy));
    return { x: clampedX, y: clampedY };
  }, []);

  // Mouse Wheel Zoom Handler (non-passive to prevent page scrolling)
  useEffect(() => {
    const el = mapContainerRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const svg = svgRef.current;
      if (!svg) return;

      const rect = svg.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const ratioX = (e.clientX - rect.left) / rect.width;
      const ratioY = (e.clientY - rect.top) / rect.height;

      const currentZoom = stateRef.current.zoom;
      const currentCenter = stateRef.current.center;

      const currentW = 120 / currentZoom;
      const currentH = 60 / currentZoom;
      const currentVbX = currentCenter.x - currentW / 2;
      const currentVbY = currentCenter.y - currentH / 2;

      const worldX = currentVbX + ratioX * currentW;
      const worldY = currentVbY + ratioY * currentH;

      const zoomFactor = e.deltaY < 0 ? 1.25 : 0.8;
      const newZoom = Math.max(1, Math.min(4, Number((currentZoom * zoomFactor).toFixed(2))));
      if (newZoom === currentZoom) return;

      const newW = 120 / newZoom;
      const newH = 60 / newZoom;

      const targetVbX = worldX - ratioX * newW;
      const targetVbY = worldY - ratioY * newH;

      const targetCx = targetVbX + newW / 2;
      const targetCy = targetVbY + newH / 2;

      const clamped = clampCenter(targetCx, targetCy, newZoom);
      setZoom(newZoom);
      setCenter(clamped);
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [clampCenter]);

  // Double-Click Zoom Handler
  const handleDoubleClick = (e) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    if (zoom > 1.2) {
      setZoom(1);
      setCenter({ x: 60, y: 30 });
    } else {
      const ratioX = (e.clientX - rect.left) / rect.width;
      const ratioY = (e.clientY - rect.top) / rect.height;

      const currentW = 120 / zoom;
      const currentH = 60 / zoom;
      const currentVbX = center.x - currentW / 2;
      const currentVbY = center.y - currentH / 2;

      const worldX = currentVbX + ratioX * currentW;
      const worldY = currentVbY + ratioY * currentH;

      const newZoom = 2.4;
      const clamped = clampCenter(worldX, worldY, newZoom);
      setZoom(newZoom);
      setCenter(clamped);
    }
  };

  // Drag-to-Pan Handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({
      clientX: e.clientX,
      clientY: e.clientY,
      center: { ...center },
      hasMoved: false
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !dragStart) return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dxPx = e.clientX - dragStart.clientX;
    const dyPx = e.clientY - dragStart.clientY;

    if (!dragStart.hasMoved && Math.hypot(dxPx, dyPx) > 4) {
      dragStart.hasMoved = true;
    }

    const currentW = 120 / zoom;
    const currentH = 60 / zoom;

    const dxWorld = (dxPx / rect.width) * currentW;
    const dyWorld = (dyPx / rect.height) * currentH;

    const targetCx = dragStart.center.x - dxWorld;
    const targetCy = dragStart.center.y - dyWorld;

    const clamped = clampCenter(targetCx, targetCy, zoom);
    setCenter(clamped);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(4, Number((zoom * 1.3).toFixed(2)));
    const clamped = clampCenter(center.x, center.y, newZoom);
    setZoom(newZoom);
    setCenter(clamped);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(1, Number((zoom / 1.3).toFixed(2)));
    const clamped = clampCenter(center.x, center.y, newZoom);
    setZoom(newZoom);
    setCenter(clamped);
  };

  const handleResetZoom = () => {
    setZoom(1);
    setCenter({ x: 60, y: 30 });
  };

  const handleSelectJurisdiction = (haven) => {
    setSelectedCityId(haven.id);
    if (zoom > 1.2) {
      const clamped = clampCenter(haven.pinX, haven.pinY, zoom);
      setCenter(clamped);
    }
  };

  const currentW = 120 / zoom;
  const currentH = 60 / zoom;
  const vbX = center.x - currentW / 2;
  const vbY = center.y - currentH / 2;
  const pinScale = Math.max(0.65, 1 / Math.sqrt(zoom));

  const formatAmount = (val) => {
    const num = Number(val || 0);
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  };

  const parsedSmuggle = parseFloat(smuggleAmount);
  const currentAmount = isNaN(parsedSmuggle)
    ? 0
    : Math.max(0, Math.min(availableCash, Number(parsedSmuggle.toFixed(2))));
  const estimatedTaxFee = selectedCity
    ? Number(((currentAmount * (selectedCity.taxRatePercent || 20)) / 100).toFixed(2))
    : 0;
  const estimatedNetShielded = Math.max(0, Number((currentAmount - estimatedTaxFee).toFixed(2)));

  const handleExecuteWire = async (e) => {
    e.preventDefault();
    if (!selectedCity || isSubmitting) return;

    const sendAmount = Number(currentAmount.toFixed(2));
    if (sendAmount <= 0) {
      alert('Please enter an amount greater than PKR 0.');
      return;
    }
    if (sendAmount > availableCash) {
      alert('Amount exceeds your available cash.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await onAllocateTax({
        channelId: selectedCity.id,
        amount: sendAmount
      });

      if (res.caught) {
        setCaughtModal({
          city: selectedCity.city || selectedCity.name,
          country: selectedCity.country,
          airportCode: selectedCity.airportCode || 'OFF',
          amount: sendAmount,
          taxDeducted: res.taxRecord?.taxDeducted || sendAmount * 0.45,
          message: res.message || 'The government intercepted this transfer.'
        });
      } else {
        setSuccessModal({
          city: selectedCity.city || selectedCity.name,
          country: selectedCity.country,
          airportCode: selectedCity.airportCode || 'OFF',
          amount: sendAmount,
          taxDeducted: res.taxRecord?.taxDeducted || estimatedTaxFee,
          message: res.message || 'Funds were safely sheltered offshore.'
        });
      }
    } catch (err) {
      alert(err.message || 'Could not complete transfer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top HUD */}
      <div className="surface-box rounded-[28px] p-6 space-y-4 border border-[var(--border-soft)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[var(--border-active)] block">
              Round 3 Tax Shelter
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight leading-tight" style={{ color: 'var(--text-main)' }}>
              Offshore Havens
            </h2>
            <p className="text-xs font-rounded text-[var(--text-sub)]">
              Move cash into offshore accounts to lower your domestic taxes. Beware secret government limits.
            </p>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-4 py-1.5 text-xs font-rounded font-bold border tracking-wide ${
                isRound3 && isTradingOpen
                  ? 'bg-[#3B7A57]/20 border-[#3B7A57]/40 text-[#3B7A57]'
                  : isRound3
                  ? 'bg-[var(--bg-inset)] border-[var(--border-soft)] text-[var(--text-sub)]'
                  : 'bg-[var(--bg-inset)] border-[var(--border-soft)] text-[var(--text-sub)]'
              }`}
            >
              {isRound3 && isTradingOpen
                ? 'Shelter Floor Open'
                : isRound3
                ? 'Floor Closed'
                : 'Opens in Round 3'}
            </span>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
          <div className="capsule-card rounded-2xl p-4 space-y-1">
            <span className="text-[11px] font-mono font-bold tracking-wide block uppercase text-[var(--text-sub)]">
              Liquid Cash
            </span>
            <div className="font-display tabular-nums text-xl sm:text-2xl font-bold text-[var(--text-main)]">
              PKR {formatAmount(availableCash)}
            </div>
            <span className="text-xs font-rounded text-[#3B7A57] font-semibold">Ready to transfer</span>
          </div>

          <div className="capsule-card rounded-2xl p-4 space-y-1 border-l-2 border-[#3B7A57]">
            <span className="text-[11px] font-mono font-bold tracking-wide block uppercase text-[#3B7A57]">
              Shielded Offshore
            </span>
            <div className="font-display tabular-nums text-xl sm:text-2xl font-bold text-[#3B7A57]">
              PKR {formatAmount(team?.taxShieldedTotal ?? team?.taxShielded ?? 0)}
            </div>
            <span className="text-xs font-rounded text-[var(--text-sub)]">Protected from domestic tax</span>
          </div>

          <div className="capsule-card rounded-2xl p-4 space-y-1 border-l-2 border-[#B83A3A]">
            <span className="text-[11px] font-mono font-bold tracking-wide block uppercase text-[#B83A3A]">
              Fines Incurred
            </span>
            <div className="font-display tabular-nums text-xl sm:text-2xl font-bold text-[#B83A3A]">
              -PKR {formatAmount(team?.taxDeductedTotal ?? team?.taxDeducted ?? 0)}
            </div>
            <span className="text-xs font-rounded text-[var(--text-sub)]">Penalties from caught transfers</span>
          </div>
        </div>
      </div>

      {/* Main Workspace: Map & Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Map Canvas */}
        <div className="lg:col-span-7 surface-box rounded-[28px] p-5 sm:p-6 space-y-4 border border-[var(--border-soft)]">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-rounded font-bold text-[var(--text-sub)]">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D9BB7C]" />
              <span className="tracking-wider uppercase font-mono text-[11px]" style={{ color: 'var(--text-main)' }}>
                World Map • 10 Haven Locations
              </span>
            </span>

            <span className="text-xs font-rounded text-[var(--text-sub)]">
              Double-click or scroll to zoom • Click a pin to select
            </span>
          </div>

          {/* Interactive SVG Canvas */}
          <div
            ref={mapContainerRef}
            className={`w-full relative aspect-[120/60] rounded-2xl overflow-hidden border border-[var(--border-soft)] select-none ${
              isDragging ? 'cursor-grabbing' : zoom > 1 ? 'cursor-grab' : 'cursor-crosshair'
            }`}
            style={{ backgroundColor: 'var(--map-bg)' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onDoubleClick={handleDoubleClick}
          >
            {/* Top-Right Zoom Controls */}
            <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 bg-[var(--bg-card)]/90 backdrop-blur-md p-1 rounded-xl border border-[var(--border-soft)] shadow-md">
              <button
                type="button"
                onClick={handleZoomIn}
                title="Zoom In"
                className="w-7 h-7 rounded-lg bg-[#b81434] text-[#FFF8F6] hover:bg-[#A8243C] flex items-center justify-center font-bold text-sm cursor-pointer shadow-xs"
              >
                +
              </button>
              <button
                type="button"
                onClick={handleZoomOut}
                title="Zoom Out"
                className="w-7 h-7 rounded-lg bg-[#b81434] text-[#FFF8F6] hover:bg-[#A8243C] flex items-center justify-center font-bold text-sm cursor-pointer shadow-xs"
              >
                −
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                title="Reset View"
                className="px-2 h-7 rounded-lg capsule-card text-[var(--text-main)] hover:bg-[var(--row-hover)] flex items-center justify-center font-mono text-xs font-semibold cursor-pointer border border-[var(--border-soft)]"
              >
                {zoom.toFixed(1)}x ⟲
              </button>
            </div>

            <svg
              ref={svgRef}
              viewBox={`${vbX} ${vbY} ${currentW} ${currentH}`}
              className="w-full h-full"
            >
              <rect x="0" y="0" width="120" height="60" fill="var(--map-bg)" />

              {/* Dotted Map Matrix */}
              <g id="dotted-map-matrix">
                {mapPoints.map((pt, i) => (
                  <circle
                    key={`dot-${i}`}
                    cx={pt.x}
                    cy={pt.y}
                    r={0.25}
                    fill="var(--map-dot)"
                    opacity="0.65"
                  />
                ))}
              </g>

              {/* Flight Wire Arcs */}
              {havenPins.map((haven) => {
                const isSelected = selectedCity?.id === haven.id;
                const isHovered = hoveredCityId === haven.id;
                const midX = (originPin.x + haven.pinX) / 2;
                const midY = Math.min(originPin.y, haven.pinY) - 6;

                return (
                  <path
                    key={`wire-arc-${haven.id}`}
                    d={`M ${originPin.x},${originPin.y} Q ${midX},${midY} ${haven.pinX},${haven.pinY}`}
                    fill="none"
                    stroke="#D9BB7C"
                    strokeWidth={isSelected ? '0.5' : isHovered ? '0.35' : '0.18'}
                    strokeDasharray={isSelected ? '0.8,0.8' : '0.4,1.4'}
                    strokeOpacity={isSelected ? '0.9' : isHovered ? '0.7' : '0.22'}
                  />
                );
              })}

              {/* Desk Origin Marker */}
              <g transform={`translate(${originPin.x}, ${originPin.y})`}>
                <g transform={`scale(${pinScale})`}>
                  <path
                    d="M 0,0 C -0.3,-0.6 -1.3,-1.7 -1.3,-2.8 A 1.3,1.3 0 1,1 1.3,-2.8 C 1.3,-1.7 0.3,-0.6 0,0 Z"
                    fill="#3B7A57"
                    stroke="#FAF7F5"
                    strokeWidth="0.22"
                  />
                  <circle cx="0" cy="-2.8" r="0.45" fill="#FAF7F5" />
                  <g transform="translate(0, -4.0)" className="pointer-events-none">
                    <path d="M-0.6 -0.1 L0 0.5 L0.6 -0.1 Z" fill="var(--bg-card)" stroke="#3B7A57" strokeWidth="0.2" />
                    <rect x="-7.0" y="-1.7" width="14" height="3.4" rx="1.7" fill="var(--bg-card)" stroke="#3B7A57" strokeWidth="0.28" />
                    <text x="0" y="0.5" textAnchor="middle" fill="var(--text-main)" fontSize="1.15" fontWeight="bold">
                      KARACHI (BASE)
                    </text>
                  </g>
                </g>
              </g>

              {/* Haven Navigation Pins */}
              {havenPins.map((haven) => {
                const isSelected = selectedCity?.id === haven.id;
                const isHovered = hoveredCityId === haven.id;

                return (
                  <g
                    key={`pin-${haven.id}`}
                    transform={`translate(${haven.pinX}, ${haven.pinY})`}
                    className="cursor-pointer"
                    onClick={(e) => {
                      if (dragStart?.hasMoved) return;
                      e.stopPropagation();
                      handleSelectJurisdiction(haven);
                    }}
                    onMouseEnter={() => setHoveredCityId(haven.id)}
                    onMouseLeave={() => setHoveredCityId(null)}
                  >
                    <g transform={`scale(${pinScale})`}>
                      <path
                        d="M 0,0 C -0.3,-0.6 -1.2,-1.6 -1.2,-2.6 A 1.2,1.2 0 1,1 1.2,-2.6 C 1.2,-1.6 0.3,-0.6 0,0 Z"
                        fill={isSelected ? '#D9BB7C' : isHovered ? '#8E2833' : '#5E1B21'}
                        stroke={isSelected ? '#1A080C' : '#D9BB7C'}
                        strokeWidth="0.18"
                      />
                      <circle cx="0" cy="-2.6" r="0.42" fill={isSelected ? '#1A080C' : '#FAF7F5'} />

                      {/* Floating Callout on Active/Hovered Pin */}
                      {(isSelected || isHovered) && (
                        <g transform="translate(0, -3.8)">
                          <rect
                            x="-6.5"
                            y="-1.7"
                            width="13"
                            height="3.4"
                            rx="1.7"
                            fill="var(--bg-card)"
                            stroke={isSelected ? 'var(--border-active)' : 'var(--border-soft)'}
                            strokeWidth="0.25"
                            fillOpacity="0.96"
                          />
                          <text
                            x="0"
                            y="0.5"
                            textAnchor="middle"
                            fill="var(--text-main)"
                            fontSize="1.15"
                            fontWeight="bold"
                            fontFamily="sans-serif"
                          >
                            {haven.airportCode || haven.city.slice(0, 3).toUpperCase()} • {haven.taxRatePercent}%
                          </text>
                        </g>
                      )}
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Selection Haven Buttons - Columns & Rows Grid (Zero horizontal scroll) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
            {havenPins.map((h) => {
              const active = selectedCity?.id === h.id;
              return (
                <button
                  key={h.id}
                  onClick={() => handleSelectJurisdiction(h)}
                  data-active={active ? "true" : "false"}
                  className={`city-haven-btn relative overflow-hidden group rounded-2xl p-2.5 text-xs font-rounded font-bold flex flex-col items-start gap-1 cursor-pointer transition-all border ${
                    active
                      ? 'active btn-primary ring-2 ring-[var(--border-active)]/50 shadow-md'
                      : 'capsule-card hover:bg-[var(--row-hover)] text-[var(--text-main)] border border-[var(--border-soft)]'
                  }`}
                >
                  {/* City Landmark SVG Watermark - High Visibility in White, Dark & AES Theme */}
                  <div
                    className={`absolute -right-1 -bottom-1 pointer-events-none transition-all duration-300 ${
                      active
                        ? 'opacity-85 text-white scale-105'
                        : 'opacity-45 dark:opacity-25 text-[var(--border-active)] group-hover:opacity-75 dark:group-hover:opacity-45 group-hover:scale-105'
                    }`}
                  >
                    <CityLandmarkSvg code={h.airportCode} className="w-16 h-12" />
                  </div>

                  <div className="flex items-center justify-between w-full relative z-10">
                    <span className="font-mono text-[10px] uppercase font-bold" style={{ color: active ? 'var(--btn-primary-text)' : 'var(--border-active)' }}>
                      {h.airportCode}
                    </span>
                    <span className="rounded-full px-1.5 py-0.2 text-[10px] font-mono font-bold" style={{ backgroundColor: active ? 'rgba(0,0,0,0.2)' : 'var(--bg-inset)', color: active ? 'var(--btn-primary-text)' : 'var(--border-active)' }}>
                      {h.taxRatePercent}%
                    </span>
                  </div>
                  <span className="truncate w-full text-left relative z-10" style={{ color: active ? 'var(--btn-primary-text)' : 'var(--text-main)' }}>
                    {h.city}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Wire Transfer Terminal */}
        <div className="lg:col-span-5 surface-box rounded-[28px] p-6 space-y-4 border border-[var(--border-soft)]">
          {selectedCity ? (
            <div className="space-y-4">
              {/* Destination Header with Landmark Watermark */}
              <div className="haven-destination-landmark relative overflow-hidden rounded-2xl p-4 border border-[var(--border-soft)] flex items-start justify-between gap-3 capsule-card">
                {/* Landmark illustration watermark */}
                <div className="absolute right-1 -bottom-2 pointer-events-none opacity-40 dark:opacity-25 text-[var(--border-active)] transition-transform duration-300">
                  <CityLandmarkSvg code={selectedCity.airportCode} className="w-28 h-22" />
                </div>

                <div className="relative z-10">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--border-active)]">
                    Selected Destination ({selectedCity.airportCode})
                  </span>
                  <h3 className="font-display text-xl font-bold leading-tight" style={{ color: 'var(--text-main)' }}>
                    {selectedCity.city || selectedCity.name}
                  </h3>
                  <span className="text-xs font-rounded text-[var(--text-sub)]">
                    {selectedCity.country}
                  </span>
                </div>

                <span className="relative z-10 rounded-full bg-[var(--bg-inset)] text-[var(--border-active)] border border-[var(--border-soft)] px-3 py-1 text-xs font-rounded font-bold shrink-0">
                  {selectedCity.airportCode}
                </span>
              </div>

              {/* Fiduciary Summary */}
              <div className="capsule-card rounded-2xl p-3.5 space-y-2 text-xs font-rounded">
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-sub)]">Domestic Tax Shelter Fee</span>
                  <span className="font-mono tabular-nums font-bold text-sm text-[#2E7D52]">
                    {selectedCity.taxRatePercent}%
                  </span>
                </div>
              </div>

              {/* Warning Notice */}
              <div className="rounded-xl bg-[#C0392B]/10 border border-[#C0392B]/30 px-3.5 py-2.5 text-xs font-rounded text-[#C0392B] flex items-center gap-2">
                <IconAlert className="w-4 h-4 text-[#C0392B] shrink-0" />
                <span>The government can trace you if you over-smuggle.</span>
              </div>

              {/* Wire Form */}
              <form onSubmit={handleExecuteWire} noValidate className="space-y-4">
                <div className="capsule-card rounded-2xl p-4 space-y-3 border border-[var(--border-soft)]">
                  <div className="flex justify-between text-xs font-rounded">
                    <label className="font-bold text-[var(--text-main)]">
                      Transfer Amount
                    </label>
                    <span className="text-[var(--text-sub)]">
                      Available: <strong className="font-display tabular-nums font-bold" style={{ color: 'var(--text-main)' }}>PKR {formatAmount(availableCash)}</strong>
                    </span>
                  </div>

                  {/* Input */}
                  <div className="flex items-center gap-2">
                    <span className="font-display text-lg font-bold text-[var(--border-active)]">PKR</span>
                    <input
                      type="number"
                      min="0.01"
                      max={availableCash}
                      step="any"
                      placeholder="0.00"
                      value={smuggleAmount}
                      onChange={(e) => setSmuggleAmount(e.target.value)}
                      className="w-full bg-transparent font-display tabular-nums font-bold text-2xl focus:outline-none"
                      style={{ color: 'var(--text-main)' }}
                    />
                  </div>

                  {/* Slider */}
                  <div className="pt-1">
                    <input
                      type="range"
                      min="0"
                      max={Math.max(1, availableCash)}
                      step="any"
                      value={currentAmount}
                      onChange={(e) => setSmuggleAmount(e.target.value)}
                      className="w-full h-2 bg-[var(--bg-inset)] border border-[var(--border-soft)] rounded-lg appearance-none cursor-pointer accent-[var(--border-active)]"
                    />
                  </div>

                  {/* Presets */}
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    {[
                      { label: '25%', val: Number((availableCash * 0.25).toFixed(2)) },
                      { label: '50%', val: Number((availableCash * 0.50).toFixed(2)) },
                      { label: '75%', val: Number((availableCash * 0.75).toFixed(2)) },
                      { label: 'MAX', val: availableCash }
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setSmuggleAmount(String(preset.val))}
                        className="rounded-full py-1 text-xs font-display tabular-nums font-bold capsule-card hover:bg-[var(--border-active)] hover:text-white cursor-pointer text-[var(--text-main)] border border-[var(--border-soft)]"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calculation */}
                <div className="rounded-2xl capsule-card p-4 space-y-2 text-xs font-rounded border border-[var(--border-soft)]">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-sub)]">Gross transfer</span>
                    <span className="font-display tabular-nums font-bold" style={{ color: 'var(--text-main)' }}>
                      PKR {formatAmount(currentAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#C0392B]">
                    <span>Tax fee ({selectedCity.taxRatePercent}%)</span>
                    <span className="font-display tabular-nums font-bold">
                      -PKR {formatAmount(estimatedTaxFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold pt-2 border-t border-[var(--border-soft)] text-[#2E7D52]">
                    <span>Estimated net shielded</span>
                    <span className="font-display tabular-nums font-bold">
                      PKR {formatAmount(estimatedNetShielded)}
                    </span>
                  </div>
                </div>

                {/* Submit Execute Button */}
                <TactileButton
                  type="submit"
                  disabled={!isRound3 || !isTradingOpen || isSubmitting || currentAmount <= 0}
                  className={`w-full rounded-full py-3.5 font-display font-bold text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    !isRound3 || !isTradingOpen || currentAmount <= 0
                      ? 'opacity-60 cursor-not-allowed bg-[var(--bg-inset)] text-[var(--text-sub)] border border-[var(--border-soft)]'
                      : 'btn-primary text-white hover:brightness-105'
                  }`}
                  style={{
                    backgroundColor: (!isRound3 || !isTradingOpen || currentAmount <= 0)
                      ? 'var(--bg-inset)'
                      : 'var(--btn-primary-bg)',
                    color: (!isRound3 || !isTradingOpen || currentAmount <= 0)
                      ? 'var(--text-sub)'
                      : 'var(--btn-primary-text)',
                    borderColor: (!isRound3 || !isTradingOpen || currentAmount <= 0)
                      ? 'var(--border-soft)'
                      : 'var(--border-active)'
                  }}
                >
                  <IconShield className="w-4 h-4 shrink-0" />
                  {isSubmitting
                    ? 'Executing Wire Transfer...'
                    : !isRound3
                    ? 'Execute Locked • Unlocks in Round 3'
                    : !isTradingOpen
                    ? 'Execute Locked • Trading Floor Closed'
                    : currentAmount <= 0
                    ? 'Execute Offshore Wire • Enter Amount'
                    : `Execute Wire Transfer • PKR ${formatAmount(currentAmount)} to ${selectedCity.city || selectedCity.name}`}
                </TactileButton>
              </form>
            </div>
          ) : (
            <div className="capsule-card rounded-2xl p-8 text-center text-xs font-rounded text-[var(--text-sub)]">
              Select a haven location on the map to begin.
            </div>
          )}
        </div>
      </div>

      {/* History Ledger */}
      <div className="surface-box rounded-[28px] p-6 space-y-4 border border-[#9E7B81]/20">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#9E7B81]/20 pb-3">
          <div className="space-y-0.5">
            <h3 className="font-display text-xl font-bold" style={{ color: 'var(--text-main)' }}>
              Transfer History
            </h3>
            <p className="text-xs font-rounded text-[var(--text-sub)]">
              A log of your offshore transfers and government penalties.
            </p>
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-wide text-[var(--text-sub)]">
            {team?.taxHistory?.length || 0} Transfers
          </span>
        </div>

        {team?.taxHistory && team.taxHistory.length > 0 ? (
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {team.taxHistory.map((rec, i) => {
              const isBust = rec.status === 'CAUGHT' || rec.caughtByGovernment;
              return (
                <div
                  key={rec.id || `hist-${i}`}
                  className={`capsule-card rounded-2xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs font-rounded border ${
                    isBust ? 'border-[#B83A3A]/40 bg-[#B83A3A]/10' : 'border-[#3B7A57]/30 bg-[#3B7A57]/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-black/20 shrink-0">
                      {isBust ? (
                        <IconAlert className="w-4 h-4 text-[#B83A3A]" />
                      ) : (
                        <IconShield className="w-4 h-4 text-[#3B7A57]" />
                      )}
                    </div>
                    <div>
                      <div className="font-display text-sm font-bold" style={{ color: 'var(--text-main)' }}>
                        {rec.channelName || rec.city}{' '}
                        <span className={isBust ? 'text-[#B83A3A]' : 'text-[#3B7A57]'}>
                          • {isBust ? 'Intercepted by Government' : 'Safely Sheltered'}
                        </span>
                      </div>
                      <div className="font-display tabular-nums text-xs text-[var(--text-sub)] pt-0.5">
                        Amount: PKR {formatAmount(rec.inputAmount)} • Crisis {rec.crisisNumber || 1}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`font-display tabular-nums text-sm font-bold ${isBust ? 'text-[#B83A3A]' : 'text-[#3B7A57]'}`}>
                      -PKR {formatAmount(rec.taxDeducted)}
                    </div>
                    <span className="text-[11px] font-rounded text-[var(--text-sub)]">
                      {isBust ? 'Penalty Fine' : `${rec.taxRatePercent || 20}% Fee`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="capsule-card rounded-2xl p-6 text-center text-xs font-rounded text-[var(--text-sub)]">
            No transfers recorded yet.
          </div>
        )}
      </div>

      {/* Modals with Zero Emojis */}
      <AnimatePresence>
        {caughtModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 26 }}
              className="w-full max-w-md surface-box rounded-[28px] p-7 sm:p-8 space-y-5 border-4 border-[#B83A3A] shadow-2xl text-center"
            >
              <div className="w-16 h-16 rounded-full bg-[#B83A3A]/25 border-2 border-[#B83A3A] mx-auto flex items-center justify-center">
                <IconAlert className="w-8 h-8 text-[#B83A3A]" />
              </div>

              <div className="space-y-2">
                <span
                  className="rounded-full bg-[#B83A3A] !text-white px-4 py-1 text-xs font-display font-bold tracking-wider uppercase inline-block"
                  style={{ color: '#FFFFFF', backgroundColor: '#B83A3A' }}
                >
                  Transfer Intercepted
                </span>
                <h3 className="font-display text-2xl font-bold leading-tight tracking-tight" style={{ color: 'var(--text-main)' }}>
                  You got caught by the government!
                </h3>
                <p className="text-xs font-rounded leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                  Financial authorities intercepted your transfer of{' '}
                  <span
                    className="font-display font-bold text-sm tracking-tight px-2 py-0.5 rounded-md inline-block mx-1 shadow-xs"
                    style={{
                      color: '#B83A3A',
                      backgroundColor: 'rgba(184, 58, 58, 0.14)',
                      border: '1.5px solid rgba(184, 58, 58, 0.35)',
                      fontWeight: 800
                    }}
                  >
                    PKR {formatAmount(caughtModal.amount)}
                  </span>{' '}
                  to <strong className="font-display font-bold" style={{ color: 'var(--text-main)' }}>{caughtModal.city}</strong> because it exceeded the secret limit.
                </p>
              </div>

              <div className="rounded-2xl capsule-inset p-4 space-y-1 text-xs font-rounded border border-[#B83A3A]/40" style={{ backgroundColor: 'var(--bg-inset)' }}>
                <div style={{ color: 'var(--text-sub)' }}>Fine Deducted:</div>
                <div className="text-3xl font-display font-bold tracking-tight" style={{ color: '#B83A3A' }}>
                  -PKR {formatAmount(caughtModal.taxDeducted)}
                </div>
              </div>

              <TactileButton
                onClick={() => setCaughtModal(null)}
                className="w-full rounded-full py-3.5 bg-[#B83A3A] hover:bg-[#8F2626] !text-white font-display font-bold text-sm shadow-md cursor-pointer"
                style={{ color: '#FFFFFF', backgroundColor: '#B83A3A' }}
              >
                <span className="!text-white font-display font-bold" style={{ color: '#FFFFFF' }}>
                  Acknowledge Fine
                </span>
              </TactileButton>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {successModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 26 }}
              className="w-full max-w-md surface-box rounded-[28px] p-7 sm:p-8 space-y-5 border-2 border-[#3B7A57] shadow-2xl text-center"
            >
              <div className="w-16 h-16 rounded-full bg-[#3B7A57]/25 border-2 border-[#3B7A57] mx-auto flex items-center justify-center">
                <IconShield className="w-8 h-8 text-[#3B7A57]" />
              </div>

              <div className="space-y-2">
                <span
                  className="rounded-full bg-[#3B7A57] !text-white px-4 py-1 text-xs font-display font-bold uppercase tracking-wider inline-block"
                  style={{ color: '#FFFFFF', backgroundColor: '#3B7A57' }}
                >
                  Transfer Successful
                </span>
                <h3 className="font-display text-2xl font-bold leading-tight tracking-tight" style={{ color: 'var(--text-main)' }}>
                  Funds Safely Sheltered Offshore
                </h3>
                <p className="text-xs font-rounded leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                  Your transfer of{' '}
                  <span
                    className="font-display font-bold text-sm tracking-tight px-2 py-0.5 rounded-md inline-block mx-1 shadow-xs"
                    style={{
                      color: '#3B7A57',
                      backgroundColor: 'rgba(59, 122, 87, 0.14)',
                      border: '1.5px solid rgba(59, 122, 87, 0.35)',
                      fontWeight: 800
                    }}
                  >
                    PKR {formatAmount(successModal.amount)}
                  </span>{' '}
                  arrived safely in <strong className="font-display font-bold" style={{ color: 'var(--text-main)' }}>{successModal.city}</strong> under the radar limit.
                </p>
              </div>

              <div className="rounded-2xl capsule-inset p-4 space-y-1 text-xs font-rounded border border-[#3B7A57]/30" style={{ backgroundColor: 'var(--bg-inset)' }}>
                <div style={{ color: 'var(--text-sub)' }}>Tax Fee Deducted:</div>
                <div className="text-3xl font-display font-bold tracking-tight" style={{ color: '#3B7A57' }}>
                  -PKR {formatAmount(successModal.taxDeducted)}
                </div>
              </div>

              <TactileButton
                onClick={() => setSuccessModal(null)}
                className="w-full rounded-full py-3.5 bg-[#3B7A57] hover:bg-[#2E7D52] !text-white font-display font-bold text-sm shadow-md cursor-pointer"
                style={{ color: '#FFFFFF', backgroundColor: '#3B7A57' }}
              >
                <span className="!text-white font-display font-bold" style={{ color: '#FFFFFF' }}>
                  Done
                </span>
              </TactileButton>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
