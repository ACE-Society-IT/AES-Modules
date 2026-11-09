import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchMonopolyStore, supabase } from '../lib/monopolyService.js';
import { KARACHI_PROPERTIES, computePropertyRent, computePropertyValuation } from '../data/monopolyData.js';
import { UtilityIcon, LandPlotIllustration } from './LandPlotSvg.jsx';
import aesLogo from '../../assets/aes-logo.png';

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

export default function MonopolyProjectorView() {
  const [store, setStore] = useState(null);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [activeOutcome, setActiveOutcome] = useState(null);
  const lastSpinNonceRef = useRef(null);
  const wheelRotationRef = useRef(0);

  const loadData = async () => {
    try {
      const data = await fetchMonopolyStore(true);
      setStore(data);
    } catch (e) {
      console.error('Projector load error:', e);
    }
  };

  useEffect(() => {
    loadData();

    // Supabase Realtime subscription
    const channel = supabase
      .channel('monopoly_projector_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'monopoly_state' }, () => {
        loadData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const properties = store?.properties || KARACHI_PROPERTIES;
  const totalSlices = properties.length || 25;
  const sliceAngle = 360 / totalSlices;

  // React to lastWheelResult changes from Admin
  useEffect(() => {
    if (!store?.lastWheelResult) return;
    const res = store.lastWheelResult;
    const spinKey = `${res.teamId}_${res.propertyId}_${res.timestamp || res.nonce || ''}`;

    if (lastSpinNonceRef.current === spinKey) return;
    lastSpinNonceRef.current = spinKey;

    setActiveOutcome(res);

    // If result was already revealed on server (e.g. reload or historical spin), show immediately without spinning
    if (res.revealed) {
      setIsCountingDown(false);
      setIsSpinning(false);
      setIsRevealed(true);
      setCountdown(null);

      const winningIndex = properties.findIndex(p => Number(p.id) === Number(res.propertyId));
      if (winningIndex !== -1) {
        const sliceCenter = (winningIndex + 0.5) * sliceAngle;
        const desiredMod = (360 - sliceCenter + 360) % 360;
        wheelRotationRef.current = desiredMod;
        setWheelRotation(desiredMod);
      }
      return;
    }

    // LIVE NEW SPIN: 5-SECOND SUSPENSE COUNTDOWN -> 5.5-SECOND PHYSICS ROTATION -> REVEAL RESULT
    const winningIndex = properties.findIndex(p => Number(p.id) === Number(res.propertyId));
    if (winningIndex === -1) return;

    setIsRevealed(false);
    setIsSpinning(false);
    setIsCountingDown(true);
    setCountdown(5);

    let secLeft = 5;
    const interval = setInterval(() => {
      secLeft -= 1;
      if (secLeft > 0) {
        setCountdown(secLeft);
      } else {
        clearInterval(interval);
        setCountdown(null);
        setIsCountingDown(false);
        setIsSpinning(true);

        // Calculate target slice angle under pointer (top 12 o'clock)
        const sliceCenter = (winningIndex + 0.5) * sliceAngle;
        const desiredMod = (360 - sliceCenter + 360) % 360;
        const currentMod = ((wheelRotationRef.current % 360) + 360) % 360;
        let deltaAngle = desiredMod - currentMod;
        if (deltaAngle <= 0) deltaAngle += 360;

        // 6 full 360 spins + target slice delta for high-speed physics rotation
        const nextTarget = wheelRotationRef.current + 360 * 6 + deltaAngle;
        wheelRotationRef.current = nextTarget;

        requestAnimationFrame(() => {
          setWheelRotation(nextTarget);
        });

        // 5.5s physical spin duration -> wheel comes to full stop -> reveal result!
        setTimeout(async () => {
          setIsSpinning(false);
          setIsRevealed(true);

          // Tell server to reveal result so team dialog pops up at this exact moment!
          try {
            if (supabase) {
              await supabase.rpc('monopoly_reveal_wheel_result');
            }
          } catch (err) {
            console.error('Failed to notify server of wheel reveal:', err);
          }
        }, 5500);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [store?.lastWheelResult]);

  const landedProp = activeOutcome
    ? properties.find(p => Number(p.id) === Number(activeOutcome.propertyId))
    : null;

  return (
    <div className="w-full min-h-screen bg-[#14040A] text-[#F8EEE1] flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden relative font-sans">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-40" style={{
        background: 'radial-gradient(circle at 50% 40%, #701020 0%, #1A040B 65%, #0B0105 100%)'
      }} />

      {/* TOP AUDITORIUM BANNER */}
      <header className="relative z-10 flex items-center justify-between border-b border-[#ECC37A]/30 pb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#3B0C18] border border-[#ECC37A] flex items-center justify-center p-2 shadow-lg">
            <img src={aesLogo} alt="AES Logo" className="max-h-full max-w-full object-contain" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase font-bold tracking-widest text-[#F1CA7E]">
              ALPHA ENTREPRENEURSHIP SUMMIT 2026 · AUDITORIUM PROJECTOR
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#F8EEE1] leading-tight">
              Market Monopoly · Live Classroom Property Wheel
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#3B0C18] border border-[#ECC37A]/60 text-[#F1CA7E] font-mono text-xs font-bold">
            <span className={`w-2.5 h-2.5 rounded-full ${isCountingDown ? 'bg-[#F59E0B] animate-ping' : isSpinning ? 'bg-[#EF4444] animate-ping' : 'bg-[#22C55E]'}`} />
            <span>{isCountingDown ? `Spin in ${countdown}s` : isSpinning ? 'Spinning Wheel...' : 'Ready For Spin'}</span>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-[#3B0C18] border border-[#ECC37A]/50 text-center font-mono">
            <span className="text-[10px] uppercase text-[#F1CA7E] block">Wave</span>
            <strong className="text-xl font-bold text-[#F8EEE1]">#{store?.currentWheelRound || 1}</strong>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-[#3B0C18] border border-[#ECC37A]/50 text-center font-mono">
            <span className="text-[10px] uppercase text-[#F1CA7E] block">Properties</span>
            <strong className="text-xl font-bold text-[#2E7D52]">25 Plots</strong>
          </div>
        </div>
      </header>

      {/* CENTER ARENA: MASSIVE HIGH-RESOLUTION SPIN WHEEL & LIVE OUTCOME BOARD */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14 my-4">
        {/* WHEEL CONTAINER */}
        <div className="relative flex items-center justify-center">
          {/* Top Pointer */}
          <div className="absolute -top-6 z-30 drop-shadow-[0_6px_12px_rgba(0,0,0,0.8)]">
            <svg width="48" height="58" viewBox="0 0 48 58">
              <polygon points="24,56 4,14 44,14" fill="#F1CA7E" stroke="#22050D" strokeWidth="2.5" />
              <circle cx="24" cy="14" r="7" fill="#701020" stroke="#F1CA7E" strokeWidth="2" />
            </svg>
          </div>

          <div className="w-[380px] h-[380px] sm:w-[540px] sm:h-[540px] lg:w-[620px] lg:h-[620px] rounded-full p-3 bg-[#24060E] shadow-[0_20px_60px_rgba(0,0,0,0.85)] border-8 border-[#F1CA7E] flex items-center justify-center relative">
            <div
              className="w-full h-full rounded-full will-change-transform"
              style={{
                transform: `rotate(${wheelRotation}deg) translateZ(0)`,
                transformOrigin: 'center center',
                backfaceVisibility: 'hidden',
                willChange: 'transform',
                transition: isSpinning
                  ? 'transform 5.5s cubic-bezier(0.12, 0.82, 0.22, 1)'
                  : isCountingDown
                  ? 'none'
                  : 'transform 0.5s ease-out'
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

                    const labelPos = polarToCartesian(210, 210, 136, midAngle);
                    const dotPos = polarToCartesian(210, 210, 194, midAngle);
                    const textRotate = midAngle - 90;
                    const shortName = SHORT_PROPERTY_NAMES[prop.id] || prop.name.slice(0, 13);

                    return (
                      <g key={prop.id}>
                        <path
                          d={pathData}
                          fill={palette.bg}
                          stroke="#F1CA7E"
                          strokeWidth="1"
                          strokeOpacity="0.75"
                        />
                        <circle
                          cx={dotPos.x}
                          cy={dotPos.y}
                          r="4"
                          fill={isOwned ? '#ECC37A' : '#701020'}
                          stroke="#ECC37A"
                          strokeWidth="1"
                        />
                        <text
                          x={labelPos.x}
                          y={labelPos.y}
                          fill={palette.text}
                          fontSize="9.5"
                          fontWeight="700"
                          fontFamily="system-ui, -apple-system, sans-serif"
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
              </svg>
            </div>

            {/* Wheel Center Hub with Suspense Countdown or Spinning Radar or AES Logo */}
            <div className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#180308] border-4 border-[#F1CA7E] shadow-2xl flex items-center justify-center pointer-events-none overflow-hidden z-20">
              <AnimatePresence mode="wait">
                {isCountingDown && countdown ? (
                  <motion.div
                    key={`hub-suspense-${countdown}`}
                    initial={{ scale: 1.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col items-center justify-center text-center"
                  >
                    <span className="font-mono font-black text-4xl sm:text-5xl text-[#F59E0B] leading-none drop-shadow-[0_0_12px_rgba(245,158,11,0.7)]">
                      {countdown}
                    </span>
                    <span className="text-[8px] uppercase tracking-widest font-mono text-[#F1CA7E]/80 font-bold mt-0.5">
                      SUSPENSE
                    </span>
                  </motion.div>
                ) : isSpinning ? (
                  <motion.div
                    key="hub-spinning"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                  >
                    <div className="w-7 h-7 mx-auto mb-1 border-2 border-[#F1CA7E] border-t-transparent rounded-full animate-spin" />
                    <span className="font-serif font-black text-[9px] text-[#F1CA7E] tracking-widest uppercase block">
                      SPINNING
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="hub-logo"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                  >
                    <span className="font-serif font-black text-[11px] sm:text-xs text-[#F1CA7E] tracking-widest uppercase leading-tight block">
                      AES<br />KARACHI
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* RIGHT SCOREBOARD & OUTCOME CARD */}
        <div className="w-full max-w-md lg:max-w-lg flex flex-col gap-5">
          <div className="p-6 sm:p-7 rounded-[28px] bg-[#22060E]/95 border-2 border-[#ECC37A] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#ECC37A]/30 pb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase border transition-colors ${
                isCountingDown
                  ? 'bg-[#B45309] text-[#FEF3C7] border-[#F59E0B] animate-pulse'
                  : isSpinning
                  ? 'bg-[#701020] text-[#F1CA7E] border-[#F1CA7E] animate-pulse'
                  : 'bg-[#3B0C18] text-[#F1CA7E] border-[#ECC37A]/50'
              }`}>
                {isCountingDown ? `Suspense Countdown · ${countdown}s` : isSpinning ? 'Wheel Spinning...' : 'Wheel Standby'}
              </span>
              {activeOutcome && (
                <span className="font-mono text-xs text-[#F1CA7E]/70">
                  {new Date(activeOutcome.timestamp || Date.now()).toLocaleTimeString()}
                </span>
              )}
            </div>

            {isCountingDown ? (
              <div className="py-8 flex flex-col items-center justify-center space-y-4 text-center">
                <div className="w-24 h-24 rounded-full border-2 border-[#F59E0B] bg-[#170308] flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={`suspense-timer-${countdown}`}
                      initial={{ scale: 1.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="text-5xl font-black font-mono text-[#F59E0B]"
                    >
                      {countdown}s
                    </motion.span>
                  </AnimatePresence>
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#F8EEE1]">
                    {activeOutcome?.teamName || 'Team'}
                  </h3>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#F1CA7E]/80 block font-bold">
                    Wheel will spin in {countdown}s... Get Ready!
                  </span>
                </div>
              </div>
            ) : isSpinning ? (
              <div className="py-8 flex flex-col items-center justify-center space-y-4 text-center">
                <div className="w-24 h-24 rounded-full border-2 border-[#F1CA7E] bg-[#170308] flex items-center justify-center shadow-[0_0_25px_rgba(241,202,126,0.3)]">
                  <div className="w-10 h-10 border-3 border-[#F1CA7E] border-t-transparent rounded-full animate-spin" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#F8EEE1]">
                    {activeOutcome?.teamName || 'Team'}
                  </h3>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#F1CA7E]/70 block">
                    Selecting Property at Random...
                  </span>
                </div>
              </div>
            ) : isRevealed && activeOutcome && landedProp ? (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="border-b border-[#ECC37A]/20 pb-2">
                  <h2 className="text-3xl font-black font-serif text-[#F8EEE1]">
                    {activeOutcome.teamName}
                  </h2>
                </div>

                {/* 3D Property Preview Plinth */}
                <div className="rounded-2xl overflow-hidden border border-[#ECC37A]/40 bg-[#120207]">
                  <LandPlotIllustration
                    category={landedProp.category}
                    level={Number(landedProp.upgradeLevel || 0)}
                    utilityCount={(landedProp.attachedUtilities || []).length}
                    showBadge
                  />
                </div>

                <div className="p-4 rounded-2xl bg-[#19040B] border border-[#ECC37A]/30 space-y-2.5 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-[#F1CA7E]">Landed On:</span>
                    <strong className="text-sm text-white">#{landedProp.id} · {landedProp.name}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#F1CA7E]">Property Owner:</span>
                    <strong className="text-sm text-white">{activeOutcome.ownerTeamName || 'Unowned'}</strong>
                  </div>
                  <div className="pt-2 border-t border-[#ECC37A]/20 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#F1CA7E]">Rent Settlement:</span>
                    <strong className={`font-mono text-xl font-bold ${activeOutcome.status === 'PAID_RENT' ? 'text-[#EF4444]' : 'text-[#22C55E]'}`}>
                      {activeOutcome.status === 'PAID_RENT'
                        ? `-Rs ${activeOutcome.rentAmount}L Paid`
                        : activeOutcome.status === 'OWN_PROPERTY'
                        ? 'Rs 0L (Own Property)'
                        : 'Rs 0L (Unowned)'}
                    </strong>
                  </div>
                </div>

                {/* Next Spin Status Ticker */}
                <div className="p-2.5 rounded-xl bg-[#150308] border border-[#ECC37A]/40 flex items-center justify-center gap-2 text-xs font-mono font-bold text-[#F1CA7E]">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                  <span>Ready for Next Team Spin</span>
                </div>
              </div>
            ) : (
              <div className="py-14 text-center space-y-3">
                <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#3B0C18] border-2 border-[#ECC37A]/60 text-[#F1CA7E] font-mono font-bold text-sm shadow-xl">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
                  <span>Ready for Next Spin</span>
                </div>
                <p className="text-xs font-mono text-[#F1CA7E]/60">
                  Classroom Projector · Waiting for Admin to trigger wheel
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 pt-3 border-t border-[#ECC37A]/25 flex items-center justify-between text-xs font-mono text-[#F1CA7E]/75">
        <span>Alpha Entrepreneurship Summit 2026 · Market Monopoly Arena</span>
        <span>URL: /market-monopoly/projector</span>
      </footer>
    </div>
  );
}
