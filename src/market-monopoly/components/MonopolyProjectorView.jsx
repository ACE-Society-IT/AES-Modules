import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { fetchMonopolyStore, updateCachedMonopolyStore, supabase } from '../lib/monopolyService.js';
import { KARACHI_PROPERTIES } from '../data/monopolyData.js';
import { LandPlotIllustration } from './LandPlotSvg.jsx';
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

const PROP_SLICE_PALETTE = [
  { bg: '#701020', text: '#F8EEE1' },
  { bg: '#2A1215', text: '#F1CA7E' },
  { bg: '#8B1E32', text: '#FFF8F6' },
  { bg: '#47131C', text: '#E8DCC6' },
  { bg: '#5E1B21', text: '#F1CA7E' }
];

const TEAM_SLICE_PALETTE = [
  { bg: '#701020', text: '#F8EEE1', accent: '#F1CA7E' }, // AES Crimson
  { bg: '#2A1215', text: '#F1CA7E', accent: '#FFF8F6' }, // Dark Mahogany
  { bg: '#8D5B3A', text: '#FFF8F6', accent: '#F1CA7E' }, // Brand Terracotta
  { bg: '#47131C', text: '#E8DCC6', accent: '#ECC37A' }, // Deep Espresso
  { bg: '#8B1E32', text: '#FFF8F6', accent: '#ECC37A' }, // Rich Ruby
  { bg: '#1C050B', text: '#F1CA7E', accent: '#FFF8F6' }, // Obsidian Black-Red
  { bg: '#5E1B21', text: '#F8EEE1', accent: '#F1CA7E' }, // Imperial Burgundy
  { bg: '#3B1D11', text: '#FFF8F6', accent: '#ECC37A' }, // Warm Cocoa
  { bg: '#9E2A2B', text: '#FFF8F6', accent: '#F1CA7E' }, // Vivid Terracotta
  { bg: '#581420', text: '#F1CA7E', accent: '#FFF8F6' }, // Royal Bordeaux
  { bg: '#78281F', text: '#F8EEE1', accent: '#ECC37A' }, // Brick Red
  { bg: '#330810', text: '#ECC37A', accent: '#FFF8F6' }  // Dark Velvet
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

function playTickSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(650, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.035);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.035);
  } catch {}
}

function playFinishSound(isSafe = false) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const freqs = isSafe ? [523.25, 659.25, 783.99, 1046.50] : [440, 554.37, 659.25];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.09);
      gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.09 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.09);
      osc.stop(ctx.currentTime + idx * 0.09 + 0.35);
    });
  } catch {}
}

export default function MonopolyProjectorView() {
  const [store, setStore] = useState(null);
  const [propWheelRotation, setPropWheelRotation] = useState(0);
  const [teamWheelRotation, setTeamWheelRotation] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [activeOutcome, setActiveOutcome] = useState(null);
  const lastSpinNonceRef = useRef(null);
  const propRotationRef = useRef(0);
  const teamRotationRef = useRef(0);
  const tickIntervalRef = useRef(null);

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

    const channel = supabase
      .channel('monopoly_projector_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'monopoly_state' }, (payload) => {
        if (payload?.new?.state_json) {
          const updated = updateCachedMonopolyStore(payload.new.state_json);
          if (updated) {
            setStore(updated);
            return;
          }
        }
        loadData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'monopoly_properties' }, () => {
        loadData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'monopoly_teams' }, () => {
        loadData();
      })
      .subscribe();

    const pollInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadData();
      }
    }, 4000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(pollInterval);
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    };
  }, []);

  const properties = store?.properties || KARACHI_PROPERTIES;
  const totalPropSlices = properties.length || 25;
  const propSliceAngle = 360 / totalPropSlices;

  const teams = store?.teams || [];
  const totalTeamSlices = Math.max(1, teams.length);
  const teamSliceAngle = 360 / totalTeamSlices;

  // React to lastWheelResult changes from Admin
  useEffect(() => {
    if (!store?.lastWheelResult) return;
    const res = store.lastWheelResult;
    const spinKey = `${res.id || ''}_${res.teamId}_${res.propertyId}_${res.timestamp || res.nonce || ''}`;

    if (lastSpinNonceRef.current === spinKey) return;
    lastSpinNonceRef.current = spinKey;

    setActiveOutcome(res);

    const winningPropIndex = properties.findIndex((p) => Number(p.id) === Number(res.propertyId));
    const safePropIndex = winningPropIndex !== -1 ? winningPropIndex : 0;
    const propSliceCenter = (safePropIndex + 0.5) * propSliceAngle;
    const propDesiredMod = (360 - propSliceCenter + 360) % 360;

    const winningTeamIndex = teams.findIndex((t) => String(t.id) === String(res.teamId));
    const safeTeamIndex = winningTeamIndex !== -1 ? winningTeamIndex : 0;
    const teamSliceCenter = (safeTeamIndex + 0.5) * teamSliceAngle;
    const teamDesiredMod = (360 - teamSliceCenter + 360) % 360;

    // If result was already revealed on server (e.g. reload or historical spin), show immediately without spinning
    if (res.revealed) {
      setIsCountingDown(false);
      setIsSpinning(false);
      setIsRevealed(true);
      setCountdown(null);

      propRotationRef.current = propDesiredMod;
      teamRotationRef.current = teamDesiredMod;
      setPropWheelRotation(propDesiredMod);
      setTeamWheelRotation(teamDesiredMod);
      return;
    }

    // LIVE NEW SPIN: 4-SECOND SUSPENSE COUNTDOWN -> 5-SECOND DUAL WHEEL ROTATION -> REVEAL RESULT
    setIsRevealed(false);
    setIsSpinning(false);
    setIsCountingDown(true);
    setCountdown(4);

    let secLeft = 4;
    const interval = setInterval(() => {
      secLeft -= 1;
      if (secLeft > 0) {
        setCountdown(secLeft);
      } else {
        clearInterval(interval);
        setCountdown(null);
        setIsCountingDown(false);
        setIsSpinning(true);

        // 1. Property Wheel Target Rotation
        const propCurrentMod = ((propRotationRef.current % 360) + 360) % 360;
        let propDelta = propDesiredMod - propCurrentMod;
        if (propDelta <= 0) propDelta += 360;
        const nextPropTarget = propRotationRef.current + 360 * 6 + propDelta;
        propRotationRef.current = nextPropTarget;

        // 2. Team Wheel Target Rotation
        const teamCurrentMod = ((teamRotationRef.current % 360) + 360) % 360;
        let teamDelta = teamDesiredMod - teamCurrentMod;
        if (teamDelta <= 0) teamDelta += 360;
        const nextTeamTarget = teamRotationRef.current + 360 * 6 + teamDelta;
        teamRotationRef.current = nextTeamTarget;

        requestAnimationFrame(() => {
          setPropWheelRotation(nextPropTarget);
          setTeamWheelRotation(nextTeamTarget);
        });

        // 3. Audio Tick Simulation
        if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
        let tickCount = 0;
        tickIntervalRef.current = setInterval(() => {
          tickCount += 1;
          playTickSound();
          if (tickCount >= 34) {
            clearInterval(tickIntervalRef.current);
          }
        }, 140);

        // 5.0s physical spin duration -> wheels come to full stop -> reveal result
        setTimeout(async () => {
          if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
          setIsSpinning(false);
          setIsRevealed(true);
          playFinishSound(res.status !== 'PAID_RENT');

          try {
            if (supabase) {
              await supabase.rpc('monopoly_reveal_wheel_result');
            }
          } catch (err) {
            console.error('Failed to notify server of wheel reveal:', err);
          }
        }, 5100);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    };
  }, [store?.lastWheelResult]);

  const landedProp = activeOutcome
    ? properties.find((p) => Number(p.id) === Number(activeOutcome.propertyId))
    : null;

  return (
    <div className="w-full min-h-screen bg-[#0C0A09] text-[#F8EEE1] flex flex-col justify-between p-4 sm:p-8 select-none overflow-hidden relative font-sans">
      {/* TOP AUDITORIUM BANNER */}
      <header className="relative z-10 flex items-center justify-between border-b border-[#ECC37A]/30 pb-3">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#1C050B] border border-[#ECC37A]/60 flex items-center justify-center p-2">
            <img src={aesLogo} alt="AES Logo" className="max-h-full max-w-full object-contain" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase font-bold tracking-widest text-[#F1CA7E]">
              ALPHA ENTREPRENEURSHIP SUMMIT 2026
            </span>
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#F8EEE1] leading-tight">
              Market Monopoly Live Wheel Arena
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isCountingDown ? (
            <div className="px-4 py-1.5 rounded-full bg-[#1C050B] border-2 border-[#F59E0B] text-xs font-mono font-bold text-[#F59E0B] flex items-center gap-2 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-ping" />
              <span>Starting in {countdown}s</span>
            </div>
          ) : isSpinning ? (
            <div className="px-4 py-1.5 rounded-full bg-[#1C050B] border-2 border-[#F1CA7E] text-xs font-mono font-bold text-[#F1CA7E] flex items-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-[#F1CA7E] border-t-transparent rounded-full animate-spin" />
              <span>Wheels Spinning</span>
            </div>
          ) : (
            <div className="px-3.5 py-1.5 rounded-full bg-[#1C050B] border border-[#ECC37A]/50 text-xs font-mono font-bold text-[#F1CA7E]">
              {activeOutcome?.spinNumber
                ? `Spin #${activeOutcome.spinNumber}`
                : `Total Spins: ${store?.wheelSpinsHistory?.length || store?.wheelSpinsCount || 0}`}
            </div>
          )}
        </div>
      </header>

      {/* CENTER ARENA: DUAL WHEELS (PROPERTY + PAYING TEAM) */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center gap-6 my-2">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center justify-items-center">
          {/* WHEEL 1: KARACHI LANDED PROPERTY */}
          <div className="flex flex-col items-center space-y-3 w-full">
            <div className="flex items-center justify-between w-full max-w-[380px] px-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#F1CA7E]">
                Wheel 1: Karachi Property
              </span>
              <span className="text-[10px] font-mono text-[#F8EEE1]/60">25 Plots</span>
            </div>

            <div className="relative flex items-center justify-center">
              {/* Top Golden Pointer */}
              <div className="absolute -top-5 z-30 drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]">
                <svg width="40" height="48" viewBox="0 0 48 58">
                  <polygon points="24,56 4,14 44,14" fill="#F1CA7E" stroke="#22050D" strokeWidth="2.5" />
                  <circle cx="24" cy="14" r="6" fill="#701020" stroke="#F1CA7E" strokeWidth="2" />
                </svg>
              </div>

              <div className="w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] xl:w-[420px] xl:h-[420px] rounded-full p-2.5 bg-[#24060E] shadow-[0_16px_50px_rgba(0,0,0,0.85)] border-4 sm:border-6 border-[#F1CA7E] flex items-center justify-center relative">
                <div
                  className="w-full h-full rounded-full will-change-transform"
                  style={{
                    transform: `rotate(${propWheelRotation}deg) translateZ(0)`,
                    transformOrigin: 'center center',
                    backfaceVisibility: 'hidden',
                    transition: isSpinning
                      ? 'transform 5.0s cubic-bezier(0.12, 0.82, 0.22, 1)'
                      : isCountingDown
                      ? 'none'
                      : 'transform 0.4s ease-out'
                  }}
                >
                  <svg viewBox="0 0 420 420" className="w-full h-full overflow-visible">
                    <g>
                      {properties.map((prop, idx) => {
                        const startAngle = idx * propSliceAngle;
                        const endAngle = (idx + 1) * propSliceAngle;
                        const midAngle = startAngle + propSliceAngle / 2;
                        const pathData = createSlicePath(210, 210, 204, startAngle, endAngle);
                        const palette = PROP_SLICE_PALETTE[idx % PROP_SLICE_PALETTE.length];
                        const isOwned = Boolean(prop.ownerTeamId);

                        const labelPos = polarToCartesian(210, 210, 134, midAngle);
                        const dotPos = polarToCartesian(210, 210, 194, midAngle);
                        const textRotate = midAngle - 90;
                        const shortName = SHORT_PROPERTY_NAMES[prop.id] || prop.name.slice(0, 12);

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
                              r="3.5"
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

                {/* Property Hub */}
                <div className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#180308] border-3 sm:border-4 border-[#F1CA7E] shadow-2xl flex items-center justify-center pointer-events-none overflow-hidden z-20 text-center">
                  <span className="font-serif font-black text-[10px] sm:text-xs text-[#F1CA7E] tracking-widest uppercase block leading-tight">
                    ESTATE<br />PLOT
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* WHEEL 2: PAYING TEAM WHEEL */}
          <div className="flex flex-col items-center space-y-3 w-full">
            <div className="flex items-center justify-between w-full max-w-[380px] px-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#F1CA7E]">
                Wheel 2: Paying Team
              </span>
              <span className="text-[10px] font-mono text-[#F8EEE1]/60">Pure Luck</span>
            </div>

            <div className="relative flex items-center justify-center">
              {/* Top Golden Pointer (Matches Wheel 1 Theme) */}
              <div className="absolute -top-5 z-30 drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]">
                <svg width="40" height="48" viewBox="0 0 48 58">
                  <polygon points="24,56 4,14 44,14" fill="#F1CA7E" stroke="#22050D" strokeWidth="2.5" />
                  <circle cx="24" cy="14" r="6" fill="#701020" stroke="#F1CA7E" strokeWidth="2" />
                </svg>
              </div>

              <div className="w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] xl:w-[420px] xl:h-[420px] rounded-full p-2.5 bg-[#24060E] shadow-[0_16px_50px_rgba(0,0,0,0.85)] border-4 sm:border-6 border-[#F1CA7E] flex items-center justify-center relative">
                <div
                  className="w-full h-full rounded-full will-change-transform"
                  style={{
                    transform: `rotate(${teamWheelRotation}deg) translateZ(0)`,
                    transformOrigin: 'center center',
                    backfaceVisibility: 'hidden',
                    transition: isSpinning
                      ? 'transform 5.0s cubic-bezier(0.12, 0.82, 0.22, 1)'
                      : isCountingDown
                      ? 'none'
                      : 'transform 0.4s ease-out'
                  }}
                >
                  <svg viewBox="0 0 420 420" className="w-full h-full overflow-visible">
                    <g>
                      {teams.map((team, idx) => {
                        const startAngle = idx * teamSliceAngle;
                        const endAngle = (idx + 1) * teamSliceAngle;
                        const midAngle = startAngle + teamSliceAngle / 2;
                        const pathData = createSlicePath(210, 210, 204, startAngle, endAngle);
                        const palette = TEAM_SLICE_PALETTE[idx % TEAM_SLICE_PALETTE.length];

                        const labelPos = polarToCartesian(210, 210, 134, midAngle);
                        const dotPos = polarToCartesian(210, 210, 194, midAngle);
                        const textRotate = midAngle - 90;
                        const displayName = team.name.length > 12 ? team.name.slice(0, 11) + '.' : team.name;

                        return (
                          <g key={team.id}>
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
                              r="3.5"
                              fill="#ECC37A"
                              stroke="#701020"
                              strokeWidth="1"
                            />
                            <text
                              x={labelPos.x}
                              y={labelPos.y}
                              fill={palette.text}
                              fontSize={teams.length > 12 ? '9' : '10.5'}
                              fontWeight="700"
                              fontFamily="system-ui, -apple-system, sans-serif"
                              textAnchor="middle"
                              dominantBaseline="central"
                              transform={`rotate(${textRotate}, ${labelPos.x}, ${labelPos.y})`}
                            >
                              {displayName}
                            </text>
                          </g>
                        );
                      })}
                    </g>
                  </svg>
                </div>

                {/* Team Hub (Matches Wheel 1 Luxury Editorial Theme) */}
                <div className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#180308] border-3 sm:border-4 border-[#F1CA7E] shadow-2xl flex items-center justify-center pointer-events-none overflow-hidden z-20 text-center">
                  <span className="font-serif font-black text-[10px] sm:text-xs text-[#F1CA7E] tracking-widest uppercase block leading-tight">
                    AES<br />TEAM
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 pt-2 border-t border-[#ECC37A]/20 flex items-center justify-between text-[11px] font-mono text-[#F1CA7E]/70">
        <span>Alpha Entrepreneurship Summit 2026</span>
        <span>Market Monopoly Dual Arena</span>
      </footer>

      {/* POPUP RESULT WINDOW IN THE CENTER OF THE WEBSITE (ONLY AFTER SPIN) */}
      <AnimatePresence>
        {isRevealed && activeOutcome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
            onClick={() => setIsRevealed(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 16 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-[#2A0814] via-[#1E050E] to-[#120207] border-4 border-[#ECC37A] shadow-[0_25px_90px_rgba(0,0,0,0.95)] text-center space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setIsRevealed(false)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-[#1C050B] hover:bg-[#701020] text-[#F8EEE1] border border-[#ECC37A]/50 flex items-center justify-center transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="py-4">
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-serif text-center leading-snug tracking-tight text-[#F8EEE1]">
                  <span className="text-[#F1CA7E]">{activeOutcome.teamName}</span> landed on{' '}
                  <span className="text-[#ECC37A]">{landedProp?.name || activeOutcome.propertyName || 'Property'}</span>{' '}
                  and will pay rent of{' '}
                  <span className={activeOutcome.status === 'PAID_RENT' ? 'text-[#EF4444]' : 'text-[#22C55E]'}>
                    Rs {activeOutcome.status === 'PAID_RENT' ? activeOutcome.rentAmount : 0} Lakh
                  </span>
                </h2>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsRevealed(false)}
                  className="px-8 py-3.5 rounded-2xl bg-[#ECC37A] hover:bg-[#F1CA7E] text-[#140208] font-black text-sm uppercase tracking-wider transition-all cursor-pointer shadow-xl hover:scale-105 active:scale-95"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
