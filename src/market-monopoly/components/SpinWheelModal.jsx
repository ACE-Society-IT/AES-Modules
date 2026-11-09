import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TactileButton } from '../../components/ui/EasyComponents.jsx';
import { IconClose } from '../../components/ui/CustomIcons.jsx';
import { KARACHI_UTILITIES, computePropertyRent } from '../data/monopolyData.js';
import { UtilityIcon } from './LandPlotSvg.jsx';

const SHORT_PROPERTY_NAMES = {
  1: 'DHA Phase 6',
  2: 'Clifton Blk 5',
  3: 'Gulshan 13-D',
  4: 'N. Nazimabad H',
  5: 'PECHS Blk 2',
  6: 'Bahadurabad',
  7: 'Saddar',
  8: 'Tariq Road',
  9: 'Shahrah-e-Faisal',
  10: 'Korangi Ind.',
  11: 'SITE Ind.',
  12: 'Malir Cantt',
  13: 'Scheme 33',
  14: 'Surjani Town',
  15: 'Orangi Town',
  16: 'Lyari',
  17: 'Manora',
  18: 'Port Qasim',
  19: 'KU Road',
  20: 'Jinnah Airport',
  21: 'Kharadar',
  22: 'FB Area Blk 15',
  23: 'Karsaz',
  24: 'Boat Basin',
  25: 'Hyderi Market'
};

const SLICE_PALETTE = [
  { bg: '#701020', text: '#F8EEE1' },
  { bg: '#2A1215', text: '#F1CA7E' },
  { bg: '#8B1E32', text: '#FFF8F6' },
  { bg: '#47131C', text: '#E8DCC6' },
  { bg: '#5E1B21', text: '#F1CA7E' }
];

function polarToCartesian(cx, cy, r, angleInDegrees) {
  const rad = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad)
  };
}

function createSlicePath(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return ['M', cx, cy, 'L', start.x, start.y, 'A', r, r, 0, largeArcFlag, 0, end.x, end.y, 'Z'].join(' ');
}

export default function SpinWheelModal({
  isOpen,
  onClose,
  store,
  currentTeam,
  onCompleteSpin
}) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [recentSpinOutcome, setRecentSpinOutcome] = useState(null);
  const [spinError, setSpinError] = useState('');
  const spinTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
    };
  }, []);

  if (!store || !currentTeam) return null;

  const properties = store.properties || [];
  const totalSlices = properties.length || 25;
  const sliceAngle = 360 / totalSlices;

  const currentWheelRound = Number(store.currentWheelRound || 1);
  const currentRoundSpinsMap = store.wheelSpinsByRound?.[currentWheelRound] || {};
  const mySpinForCurrentRound = currentRoundSpinsMap[currentTeam.id] || null;
  const allCurrentRoundSpins = Object.values(currentRoundSpinsMap).sort(
    (a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0)
  );

  const displayedOutcome = mySpinForCurrentRound || recentSpinOutcome;

  // Auto-animate wheel rotation when an outcome is received from Admin!
  useEffect(() => {
    if (displayedOutcome && displayedOutcome.propertyId) {
      const pId = Number(displayedOutcome.propertyId);
      const winningIndex = properties.findIndex(p => Number(p.id) === pId);
      if (winningIndex !== -1) {
        const sliceCenter = (winningIndex + 0.5) * sliceAngle;
        const desiredMod = (360 - sliceCenter + 360) % 360;
        const currentMod = ((wheelRotation % 360) + 360) % 360;
        let deltaAngle = desiredMod - currentMod;
        if (deltaAngle <= 0) deltaAngle += 360;
        setIsSpinning(true);
        setWheelRotation(prev => prev + 360 * 5 + deltaAngle);
        const t = setTimeout(() => {
          setIsSpinning(false);
        }, 4200);
        return () => clearTimeout(t);
      }
    }
  }, [displayedOutcome?.timestamp, displayedOutcome?.propertyId]);
  const landedProperty = displayedOutcome
    ? properties.find((p) => Number(p.id) === Number(displayedOutcome.propertyId))
    : null;

  const handleStartSpin = () => {
    if (isSpinning) return;
    if (mySpinForCurrentRound) {
      setSpinError(`Spin #${currentWheelRound} already used. Wait for Spin #${currentWheelRound + 1}.`);
      return;
    }

    setSpinError('');
    setRecentSpinOutcome(null);
    setIsSpinning(true);

    const winningIndex = Math.floor(Math.random() * totalSlices);
    const winningProperty = properties[winningIndex];

    const sliceCenter = (winningIndex + 0.5) * sliceAngle;
    const jitter = (Math.random() - 0.5) * (sliceAngle * 0.45);
    const desiredMod = (360 - sliceCenter + jitter + 360) % 360;

    const currentMod = ((wheelRotation % 360) + 360) % 360;
    let deltaAngle = desiredMod - currentMod;
    if (deltaAngle <= 0) deltaAngle += 360;

    const nextRotation = wheelRotation + 360 * 6 + deltaAngle;
    setWheelRotation(nextRotation);

    spinTimeoutRef.current = setTimeout(async () => {
      try {
        const result = await onCompleteSpin(winningProperty.id);
        const savedOutcome =
          result?.wheelSpinsByRound?.[currentWheelRound]?.[currentTeam.id] ||
          result?.lastWheelResult ||
          null;
        setRecentSpinOutcome(savedOutcome);
      } catch (err) {
        setSpinError(err.message || 'Could not record spin.');
      } finally {
        setIsSpinning(false);
      }
    }, 4300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            onClick={() => !isSpinning && onClose()}
            className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 cursor-pointer"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 pointer-events-none overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="pointer-events-auto surface-box w-full max-w-6xl rounded-[32px] border-2 border-[#701020] shadow-2xl overflow-hidden flex flex-col lg:flex-row max-h-[96vh]"
            >
              {/* CENTER LARGE SPIN WHEEL ARENA */}
              <div className="flex-1 p-4 sm:p-6 flex flex-col items-center justify-between gap-3 overflow-y-auto modal-scrollbar">
                <div className="w-full flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="px-3 py-1 rounded-full text-xs font-rounded font-bold bg-[#701020] text-[#F1CA7E]">
                      Spin #{currentWheelRound}
                    </span>
                    <h2 className="font-display text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-main)' }}>
                      Property Rent Wheel
                    </h2>
                  </div>

                  <button
                    type="button"
                    disabled={isSpinning}
                    onClick={onClose}
                    className="w-9 h-9 rounded-full capsule-card flex items-center justify-center font-bold text-sm hover:bg-[#701020] hover:text-white cursor-pointer shrink-0 disabled:opacity-40"
                    aria-label="Close Wheel"
                  >
                    <IconClose className="w-4 h-4" />
                  </button>
                </div>

                {/* BIG 25-PROPERTY WHEEL */}
                <div className="flex flex-col items-center justify-center my-auto py-1">
                  {/* Top Pointer */}
                  <div className="relative z-20 -mb-3.5 flex flex-col items-center">
                    <svg width="38" height="30" viewBox="0 0 38 30" className="drop-shadow-lg">
                      <polygon
                        points="19,29 2,2 36,2"
                        fill="#F1CA7E"
                        stroke="#47131C"
                        strokeWidth="3"
                      />
                    </svg>
                  </div>

                  <div className="relative w-[330px] h-[330px] sm:w-[480px] sm:h-[480px] lg:w-[540px] lg:h-[540px] rounded-full p-2.5 bg-[#2A1215] shadow-[0_14px_45px_rgba(0,0,0,0.5)] border-4 border-[#F1CA7E] flex items-center justify-center">
                    <div
                      className="w-full h-full rounded-full will-change-transform"
                      style={{
                        transform: `rotate(${wheelRotation}deg)`,
                        transition: isSpinning
                          ? 'transform 4.2s cubic-bezier(0.15, 0.85, 0.25, 1)'
                          : 'none'
                      }}
                    >
                      <svg viewBox="0 0 420 420" className="w-full h-full overflow-visible">
                        <g>
                          {properties.map((prop, idx) => {
                            const startAngle = idx * sliceAngle;
                            const endAngle = (idx + 1) * sliceAngle;
                            const midAngle = startAngle + sliceAngle / 2;
                            const pathData = createSlicePath(210, 210, 204, startAngle, endAngle);
                            const palette = SLICE_PALETTE[idx % SLICE_PALETTE.length];
                            const isOwned = Boolean(prop.ownerTeamId);
                            const isMine = prop.ownerTeamId === currentTeam.id;

                            const labelPos = polarToCartesian(210, 210, 134, midAngle);
                            const dotPos = polarToCartesian(210, 210, 194, midAngle);
                            const textRotate = midAngle - 90;
                            const shortName = SHORT_PROPERTY_NAMES[prop.id] || prop.name.slice(0, 13);

                            return (
                              <g key={prop.id}>
                                <path
                                  d={pathData}
                                  fill={palette.bg}
                                  stroke="#F1CA7E"
                                  strokeWidth="0.9"
                                  strokeOpacity="0.6"
                                />
                                <circle
                                  cx={dotPos.x}
                                  cy={dotPos.y}
                                  r="3.4"
                                  fill={isMine ? '#2E7D52' : isOwned ? '#F1CA7E' : '#8D7A7A'}
                                />
                                <text
                                  x={labelPos.x}
                                  y={labelPos.y}
                                  fill={palette.text}
                                  fontSize="8.5"
                                  fontWeight="700"
                                  fontFamily="Fredoka, Outfit, sans-serif"
                                  textAnchor="middle"
                                  dominantBaseline="central"
                                  transform={`rotate(${textRotate}, ${labelPos.x}, ${labelPos.y})`}
                                >
                                  #{prop.id} {shortName}
                                </text>
                              </g>
                            );
                          })}
                        </g>
                        <circle cx="210" cy="210" r="204" fill="none" stroke="#F1CA7E" strokeWidth="3.5" />
                      </svg>
                    </div>

                    {/* Center Spin Button */}
                    <button
                      type="button"
                      disabled={isSpinning || Boolean(mySpinForCurrentRound)}
                      onClick={handleStartSpin}
                      className={`absolute z-20 w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-[#F1CA7E] shadow-2xl flex flex-col items-center justify-center text-center transition-transform ${
                        mySpinForCurrentRound
                          ? 'bg-[#2E7D52] text-white cursor-default'
                          : isSpinning
                          ? 'bg-[#701020] text-[#F1CA7E] scale-95 cursor-wait'
                          : 'bg-[#b81434] hover:bg-[#cf1a3d] text-white cursor-pointer hover:scale-105 active:scale-95'
                      }`}
                    >
                      <span className="font-display text-base sm:text-lg font-bold uppercase tracking-wide">
                        {mySpinForCurrentRound ? 'DONE' : isSpinning ? '...' : 'SPIN'}
                      </span>
                      <span className="font-mono text-[10px] font-bold text-[#F1CA7E]">
                        #{currentWheelRound}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDEBAR: ACTION, LANDED PROPERTY RESULT & WAVE FEED */}
              <aside className="w-full lg:w-80 xl:w-96 bg-[var(--bg-inset)] border-t lg:border-t-0 lg:border-l-2 border-[#5E1B21] p-5 flex flex-col justify-between gap-4 overflow-y-auto modal-scrollbar shrink-0">
                <div className="space-y-4">
                  {/* Action Card */}
                  <div className="capsule-card rounded-[24px] p-4 border border-[var(--border-soft)] space-y-3">
                    <div className="flex items-center justify-between text-xs font-rounded font-bold">
                      <span style={{ color: 'var(--text-main)' }}>{currentTeam.name}</span>
                      <span className="font-mono text-[#2E7D52]">Cash: Rs {currentTeam.cash}L</span>
                    </div>

                    {spinError && (
                      <div className="p-2.5 rounded-xl bg-[#C0392B]/15 border border-[#C0392B]/40 text-xs font-rounded font-bold text-[#C0392B]">
                        {spinError}
                      </div>
                    )}

                    {isSpinning ? (
                      <div className="p-3.5 rounded-2xl bg-[#F1CA7E]/20 border border-[#F1CA7E]/40 text-xs font-rounded font-bold text-[#F1CA7E] text-center flex items-center justify-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-[#F1CA7E] border-t-transparent animate-spin" />
                        Admin triggered spin! Wheel is spinning...
                      </div>
                    ) : mySpinForCurrentRound ? (
                      <div className="p-3.5 rounded-2xl bg-[#2E7D52]/15 border border-[#2E7D52]/40 text-xs font-rounded font-bold text-[#2E7D52] text-center">
                        ✓ Spin #{currentWheelRound} Result Recorded & Rent Settled.
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-2xl capsule-inset text-xs font-rounded font-semibold text-center" style={{ color: 'var(--text-sub)' }}>
                        Waiting for Admin to spin the wheel for your team...
                      </div>
                    )}
                  </div>

                  {/* Landed Property Card */}
                  {displayedOutcome && landedProperty && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="surface-box rounded-[24px] p-4 border-2 border-[#F1CA7E] space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-rounded font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#701020] text-[#F1CA7E]">
                          Landed Property
                        </span>
                        <span className="font-mono text-xs font-bold" style={{ color: 'var(--text-sub)' }}>
                          #{landedProperty.id}
                        </span>
                      </div>

                      <h3 className="font-display text-lg font-bold" style={{ color: 'var(--text-main)' }}>
                        {landedProperty.name}
                      </h3>

                      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-2xl capsule-inset text-xs font-rounded">
                        <div>
                          <span className="text-[10px] uppercase opacity-75 block" style={{ color: 'var(--text-sub)' }}>
                            Owner
                          </span>
                          <strong style={{ color: 'var(--text-main)' }}>
                            {displayedOutcome.ownerTeamName || 'Unowned'}
                          </strong>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase opacity-75 block" style={{ color: 'var(--text-sub)' }}>
                            Rent Paid
                          </span>
                          <strong
                            className={`font-mono ${
                              displayedOutcome.rentAmount > 0 ? 'text-[#C0392B]' : 'text-[#2E7D52]'
                            }`}
                          >
                            Rs {displayedOutcome.rentAmount}L
                          </strong>
                        </div>
                      </div>

                      {(landedProperty.attachedUtilities || []).length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap pt-1">
                          {landedProperty.attachedUtilities.map((uId) => {
                            const util = KARACHI_UTILITIES.find((u) => u.id === Number(uId));
                            if (!util) return null;
                            return (
                              <span
                                key={uId}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-rounded font-bold border transition-colors"
                                style={{
                                  backgroundColor: 'var(--resource-badge-bg)',
                                  color: 'var(--resource-badge-text)',
                                  borderColor: 'var(--resource-badge-border)'
                                }}
                              >
                                <UtilityIcon id={util.id} className="w-3 h-3" style={{ color: 'var(--resource-icon-color)' }} />
                                <span>{util.name}</span>
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Spin Wave Feed */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-rounded font-bold px-1">
                      <span style={{ color: 'var(--text-main)' }}>Spin #{currentWheelRound} Results</span>
                      <span className="font-mono" style={{ color: 'var(--text-sub)' }}>
                        {allCurrentRoundSpins.length}/{store.teams?.length || 0}
                      </span>
                    </div>

                    {allCurrentRoundSpins.length === 0 ? (
                      <div className="p-4 rounded-2xl capsule-card text-center text-xs font-rounded" style={{ color: 'var(--text-sub)' }}>
                        No spins yet in Spin #{currentWheelRound}.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {allCurrentRoundSpins.map((spin) => (
                          <div
                            key={spin.id}
                            className="p-3 rounded-2xl capsule-card border border-[var(--border-soft)] flex items-center justify-between gap-2 text-xs font-rounded"
                          >
                            <div className="min-w-0">
                              <strong className="block truncate" style={{ color: 'var(--text-main)' }}>
                                {spin.payingTeamName} → {spin.propertyName}
                              </strong>
                              <span className="text-[11px]" style={{ color: 'var(--text-sub)' }}>
                                Owner: {spin.ownerTeamName}
                              </span>
                            </div>
                            <span className="font-mono font-bold text-[#2E7D52] shrink-0">
                              Rs {spin.rentAmount}L
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </aside>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
