"use client";

import { useEffect, useRef, useState } from "react";
import {
  Play,
  RotateCcw,
  Lock,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  Radio,
  Landmark,
  Coins,
  Timer,
  Target
} from "lucide-react";
import {
  SIM_CONFIG,
  CRISES,
  formatValuation,
  formatDelta,
  formatClock,
} from "../../data/crisisData";
import CrisisIcon from "../CrisisIcon";

/* ---------- helpers ---------- */

// Smoothly tweens a number toward its target.
function useAnimatedNumber(target, duration = 900) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  useEffect(() => {
    const from = fromRef.current;
    if (from === target) return;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = from + (target - from) * eased;
      fromRef.current = next;
      setValue(next);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

const tone = (delta) =>
  delta > 0
    ? {
        text: "text-emerald-300",
        bg: "bg-emerald-400/15",
        border: "border-emerald-300/50",
        dot: "#6ee7b7",
      }
    : delta < 0
      ? {
          text: "text-rose-300",
          bg: "bg-rose-400/15",
          border: "border-rose-300/50",
          dot: "#fda4af",
        }
      : {
          text: "text-[#e8dcc6]",
          bg: "bg-white/5",
          border: "border-white/20",
          dot: "#e8dcc6",
        };

function DeltaIcon({ delta, className = "w-4 h-4" }) {
  if (delta > 0) return <TrendingUp className={className} />;
  if (delta < 0) return <TrendingDown className={className} />;
  return <Minus className={className} />;
}

/* ---------- valuation hero + path ---------- */

function ValuationPath({ history, totalCrises = SIM_CONFIG.totalCrises }) {
  const W = 560;
  const H = 120;
  const pad = 14;
  const values = history.map((p) => p.value);
  const base = SIM_CONFIG.startingValuation;
  const min = Math.min(...values, base - 100);
  const max = Math.max(...values, base + 100);
  const x = (crisis) => pad + (crisis / totalCrises) * (W - pad * 2);
  const y = (v) => H - pad - ((v - min) / (max - min)) * (H - pad * 2);
  const line = history
    .map((p, i) => `${i ? "L" : "M"}${x(p.crisis)},${y(p.value)}`)
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto"
      role="img"
      aria-label="Valuation over the round"
    >
      {/* starting valuation baseline */}
      <line
        x1={pad}
        x2={W - pad}
        y1={y(base)}
        y2={y(base)}
        stroke="#f1ca7e"
        strokeOpacity="0.35"
        strokeDasharray="4 5"
      />
      {/* stepping stones for all crises */}
      {Array.from({ length: totalCrises + 1 }).map((_, i) => (
        <circle
          key={i}
          cx={x(i)}
          cy={H - 4}
          r="2"
          fill="#f8eee1"
          fillOpacity="0.25"
        />
      ))}
      <path
        d={line}
        fill="none"
        stroke="#f1ca7e"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {history.map((p) => (
        <circle
          key={p.crisis}
          cx={x(p.crisis)}
          cy={y(p.value)}
          r={p.crisis === 0 ? 4 : 6}
          fill={p.crisis === 0 ? "#f1ca7e" : tone(p.delta).dot}
          stroke="#5a0d1b"
          strokeWidth="2"
        />
      ))}
    </svg>
  );
}

function ValuationHero({ balance, history, lastDelta, flashKey, totalCrises }) {
  const shown = useAnimatedNumber(balance);
  const net = balance - SIM_CONFIG.startingValuation;
  const t = tone(net);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#f1ca7e]/30 bg-[#4a0a16] p-5 md:p-7 grid md:grid-cols-[auto_1fr] gap-6 items-center shadow-2xl">
      {/* colour pulse whenever valuation changes */}
      {lastDelta !== null && lastDelta !== 0 && (
        <div
          key={flashKey}
          className={`absolute inset-0 pointer-events-none animate-flash ${lastDelta > 0 ? "bg-emerald-400/20" : "bg-rose-500/25"}`}
        />
      )}
      <div className="relative">
        <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#e8dcc6]">
          Company Valuation
        </p>
        <div className="relative flex items-baseline gap-3">
          <span className="text-5xl md:text-6xl font-black tabular-nums text-[#f1ca7e]">
            {formatValuation(shown)}
          </span>
          {lastDelta !== null && lastDelta !== 0 && (
            <span
              key={flashKey}
              className={`absolute left-full ml-1 top-1 whitespace-nowrap text-xl font-black animate-float-up ${tone(lastDelta).text}`}
            >
              {formatDelta(lastDelta)}
            </span>
          )}
        </div>
      </div>
      <div className="relative">
        <ValuationPath history={history} totalCrises={totalCrises} />
      </div>
    </section>
  );
}

/* ---------- round progress (Crisp, solid, unblurred) ---------- */

function RoundTrack({
  currentIndex,
  serverActiveIndex,
  decisions,
  elapsed,
  isRunning,
  onTogglePause,
  isComplete,
  crisesList,
  onSelectWave,
  remainingSeconds,
  durationSeconds,
  selectionOpen = true,
}) {
  const list = crisesList && crisesList.length > 0 ? crisesList : CRISES;
  const total = list.length;
  const dur = durationSeconds || SIM_CONFIG.crisisIntervalSeconds;

  const windowLeft =
    remainingSeconds !== undefined ? remainingSeconds : dur - (elapsed % dur);

  const progress =
    remainingSeconds !== undefined
      ? Math.max(0, Math.min(100, ((dur - remainingSeconds) / dur) * 100))
      : ((elapsed % dur) / dur) * 100;

  const urgent = windowLeft <= 60 && !isComplete;

  // Max unlocked index is strictly the server's current active wave
  const maxUnlocked = isComplete
    ? total - 1
    : (serverActiveIndex ?? currentIndex);
  const isPastWave = currentIndex < maxUnlocked;
  const isRoundOpen = isRunning && selectionOpen && !isPastWave && !isComplete;
  const isRoundPaused = !isRunning && !isPastWave && !isComplete;

  return (
    <section className="rounded-2xl border border-[#89192c] bg-[#650d1c] p-4 sm:p-5 flex flex-col gap-3.5 shadow-xl">
      {/* 1. Stepping stones bar (1..10) - Strictly no future clicking, crisp solid styling */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {list.map((c, i) => {
          const chosen = c.options?.find((o) => o.id === decisions[i]);
          const isSelected = i === currentIndex;
          const isFuture = i > maxUnlocked && !isComplete;
          const isPast = i < maxUnlocked;
          const isLiveWave = i === maxUnlocked && !isComplete;

          // Crisp, solid colors — completely unblurred
          let pillBg = "bg-[#5a0d1b] border border-[#89192c]";
          if (chosen) {
            pillBg =
              chosen.delta > 0
                ? "bg-emerald-400 border border-emerald-300"
                : chosen.delta < 0
                  ? "bg-rose-400 border border-rose-300"
                  : "bg-[#e8dcc6] border border-[#f8eee1]";
          } else if (isPast) {
            pillBg = "bg-[#5a0d1b] border border-[#89192c]";
          } else if (isLiveWave) {
            pillBg = "bg-[#701020] border-2 border-[#f1ca7e]";
          } else if (isFuture) {
            pillBg = "bg-[#4a0a16] border border-[#89192c]/40";
          }

          return (
            <button
              key={c.id || i}
              type="button"
              disabled={isFuture}
              onClick={() => {
                if (!isFuture && onSelectWave) {
                  onSelectWave(i);
                }
              }}
              className={`flex-1 flex flex-col gap-1.5 focus:outline-none text-left transition-all ${
                isFuture
                  ? "cursor-not-allowed opacity-45"
                  : "cursor-pointer group"
              }`}
              title={
                isFuture
                  ? `Crisis Wave ${i + 1}: Locked · Awaiting Facilitator Transmission`
                  : isPast
                    ? `Crisis Wave ${i + 1}: Past Selection (Click to View)`
                    : `Crisis Wave ${i + 1}: Live Active Round`
              }
            >
              <div
                className={`h-2.5 rounded-full ${pillBg} transition-all duration-300 ${
                  isSelected
                    ? "ring-2 ring-[#f1ca7e] ring-offset-2 ring-offset-[#650d1c] shadow-md shadow-[#f1ca7e]/40"
                    : !isFuture
                      ? "group-hover:scale-105"
                      : ""
                }`}
              />
              <span
                className={`text-center text-[10px] font-mono transition-colors ${
                  isSelected
                    ? "text-[#f1ca7e] font-black"
                    : !isFuture
                      ? "text-[#f8eee1] font-bold group-hover:text-[#f1ca7e]"
                      : "text-[#e8dcc6]/45 font-medium"
                }`}
              >
                {i + 1}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Middle Row: Explicit Round Status Badge (OPEN/CLOSED) + Synchronized Clock */}
      <div className="flex items-center justify-between gap-3 flex-wrap pt-1">
        {/* Proper Round Open / Closed Indicator */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-black uppercase tracking-wider border shadow-md ${
              isComplete
                ? "bg-[#5a0d1b] border-[#89192c] text-[#e8dcc6]"
                : isPastWave
                  ? "bg-[#5a0d1b] border-[#89192c] text-[#e8dcc6]"
                  : isRoundOpen
                    ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                    : isRoundPaused
                      ? "bg-[#f1ca7e]/20 border-[#f1ca7e] text-[#f1ca7e]"
                      : "bg-rose-500/20 border-rose-400 text-rose-300"
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isComplete || isPastWave
                  ? "bg-[#e8dcc6]"
                  : isRoundOpen
                    ? "bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400"
                    : isRoundPaused
                      ? "bg-[#f1ca7e]"
                      : "bg-rose-400"
              }`}
            />
            <span>
              {isComplete
                ? "SIMULATION COMPLETED"
                : isPastWave
                  ? `PREVIOUS SELECTION · WAVE ${currentIndex + 1} (CLOSED)`
                  : isRoundOpen
                    ? "ROUND OPEN · LIVE"
                    : isRoundPaused
                      ? "ROUND PAUSED"
                      : "ROUND CLOSED (SELECTION LOCKED)"}
            </span>
          </div>

          {/* Quick jump back to live round if reviewing a past selection */}
          {isPastWave && (
            <button
              type="button"
              onClick={() => onSelectWave && onSelectWave(maxUnlocked)}
              className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#f1ca7e] hover:text-[#f8eee1] transition"
            >
              <span>Jump to Live Wave {maxUnlocked + 1}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Countdown Clock */}
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Clock
            className={`w-4 h-4 ${urgent ? "text-rose-300 animate-pulse" : "text-[#f1ca7e]"}`}
          />
          {isComplete ? (
            <span className="font-semibold text-[#f8eee1]">Round complete</span>
          ) : (
            <span className="text-[#e8dcc6]">
              Next crisis in{" "}
              <span
                className={`font-mono font-black tabular-nums text-base ${urgent ? "text-rose-300" : "text-[#f1ca7e]"}`}
              >
                {maxUnlocked === total - 1
                  ? `${formatClock(windowLeft)} (round ends)`
                  : formatClock(windowLeft)}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* 3. Progress Bar: Crisp, Solid, Unblurred */}
      <div className="h-2 rounded-full bg-[#5a0d1b] border border-[#89192c] overflow-hidden shadow-inner">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${
            urgent ? "bg-rose-400" : "bg-[#f1ca7e]"
          }`}
          style={{ width: `${isComplete ? 100 : progress}%` }}
        />
      </div>
    </section>
  );
}

/* ---------- crisis + options ---------- */

function CrisisCard({
  crisis,
  index,
  serverActiveIndex,
  totalCrises = 10,
  chosenId,
  onLockIn,
  isRunning,
  selectionOpen = true,
  isRevealed = true,
  optionsRevealed = true,
  onSelectWave,
}) {
  const [pending, setPending] = useState(null);
  const answered = Boolean(chosenId);
  const chosen = crisis?.options?.find((o) => o.id === chosenId);

  const maxUnlocked = serverActiveIndex ?? index;
  const isPastWave = index < maxUnlocked;
  const isRoundOpen = isRunning && selectionOpen && !isPastWave;
  const isRoundPaused = !isRunning && !isPastWave;

  // reset local selection when a new crisis arrives
  useEffect(() => setPending(null), [index]);

  if (!crisis) return null;

  // Directive 1: If is_revealed === false and NOT a past wave, render standby banner
  if (!isRevealed && !isPastWave) {
    return (
      <section className="animate-pop-in rounded-3xl border border-[#f1ca7e]/30 bg-[#701020] p-8 md:p-12 text-center space-y-4 shadow-2xl">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#5a0d1b] border border-[#89192c] flex items-center justify-center text-[#f1ca7e] animate-pulse">
          <Radio className="w-8 h-8" />
        </div>
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#f1ca7e]">
            Crisis Wave {index + 1} of {totalCrises} · Classified
          </p>
          <h2 className="text-2xl md:text-3xl font-black text-[#f8eee1] mt-1 font-mono">
            Transmission Incoming / Standby
          </h2>
          <p className="mt-2 text-[#e8dcc6]/80 max-w-lg mx-auto text-sm leading-relaxed">
            The Supreme Chancellor and War Room Intelligence are intercepting
            incoming threat telemetry. Stand by for facilitator authorization.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      key={crisis.id}
      className="animate-pop-in rounded-3xl border border-[#f1ca7e]/30 bg-[#701020] p-5 md:p-7 space-y-5 shadow-2xl"
    >
      {/* Review Banner when viewing past selections */}
      {isPastWave && (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#5a0d1b] border border-[#f1ca7e]/40 gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f1ca7e]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#f1ca7e]">
              Reviewing Past Wave {index + 1} Selection
            </span>
            <span className="text-xs text-[#e8dcc6]/70 hidden sm:inline">
              — Locked and archived.
            </span>
          </div>
          {onSelectWave && (
            <button
              type="button"
              onClick={() => onSelectWave(maxUnlocked)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#f1ca7e] text-[#5a0d1b] text-xs font-black uppercase tracking-wider hover:scale-105 active:scale-95 transition shadow-sm"
            >
              <span>Return to Live Wave {maxUnlocked + 1}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      <header className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-[#5a0d1b] border border-[#89192c] text-[#f1ca7e] flex items-center justify-center shrink-0">
          <CrisisIcon icon={crisis.icon} className="w-8 h-8" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#f1ca7e]">
              Crisis {index + 1} of {totalCrises} · {crisis.division}
            </p>
            {/* Header Round Open/Closed Indicator */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider border ${
                isPastWave
                  ? "bg-[#5a0d1b] border-[#89192c] text-[#e8dcc6]"
                  : isRoundOpen
                    ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                    : isRoundPaused
                      ? "bg-[#f1ca7e]/20 border-[#f1ca7e] text-[#f1ca7e]"
                      : "bg-rose-500/20 border-rose-400 text-rose-300"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isPastWave
                    ? "bg-[#e8dcc6]"
                    : isRoundOpen
                      ? "bg-emerald-400 animate-pulse"
                      : isRoundPaused
                        ? "bg-[#f1ca7e]"
                        : "bg-rose-400"
                }`}
              />
              {isPastWave
                ? "Round Closed"
                : isRoundOpen
                  ? "Round Open"
                  : isRoundPaused
                    ? "Round Paused"
                    : "Round Closed"}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-[#f8eee1] mt-1">
            {crisis.title}
          </h2>
          <p className="mt-2 text-[#e8dcc6] leading-relaxed max-w-3xl">
            {crisis.story}
          </p>
        </div>
      </header>

      {/* Directive 2: If options_revealed === false and NOT answered, render placeholder */}
      {!optionsRevealed && !answered && !isPastWave ? (
        <div className="rounded-2xl border border-[#89192c] bg-[#5a0d1b] p-8 text-center space-y-2">
          <div className="text-3xl animate-pulse">⏳</div>
          <h3 className="text-base font-bold text-[#f1ca7e] uppercase tracking-wider font-mono">
            Options Deliberating / Awaiting Facilitator Broadcast
          </h3>
          <p className="text-xs text-[#e8dcc6]/80 max-w-md mx-auto">
            Tactical countermeasures are undergoing risk assessment.
            Countermeasure options will appear momentarily upon command
            authorization.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {(crisis.options || []).map((o, i) => {
            const letter = "ABCD"[i] || String.fromCharCode(65 + i);
            const isChosen = chosenId === o.id;
            const isPending = !answered && pending === o.id;
            const t = tone(o.delta);

            return (
              <button
                key={o.id}
                type="button"
                disabled={answered || !isRoundOpen}
                onClick={() => {
                  if (!answered && isRoundOpen) {
                    setPending(o.id);
                  }
                }}
                className={`group relative text-left rounded-2xl border p-4 pr-4 transition-all duration-300 flex gap-3 items-start
                  ${
                    answered
                      ? isChosen
                        ? `${t.border} ${t.bg} scale-[1.02] shadow-lg border-2`
                        : "border-white/10 bg-black/10 opacity-55 cursor-default"
                      : isPastWave
                        ? "border-white/10 bg-black/10 opacity-60 cursor-default"
                        : isPending
                          ? "border-[#f1ca7e] bg-[#f1ca7e]/15 -translate-y-0.5 shadow-lg shadow-black/30"
                          : "border-[#89192c] bg-[#5a0d1b]/60 hover:border-[#f1ca7e]/60 hover:-translate-y-0.5"
                  }
                  disabled:cursor-default`}
              >
                <span
                  className={`shrink-0 w-8 h-8 rounded-full grid place-items-center font-black text-sm
                    ${isPending || isChosen ? "bg-[#f1ca7e] text-[#5a0d1b]" : "bg-[#89192c] text-[#f1ca7e]"}`}
                >
                  {letter}
                </span>
                <span className="flex-1">
                  <span className="block font-semibold text-[#f8eee1] leading-snug">
                    {o.text}
                  </span>
                  {/* The impact is revealed only AFTER the decision is locked */}
                  {answered && isChosen && (
                    <span
                      className={`mt-2 inline-flex items-center gap-1.5 text-sm font-black animate-pop-in ${t.text}`}
                    >
                      <DeltaIcon delta={o.delta} className="w-4 h-4" />
                      {formatDelta(o.delta)}
                      <span className="ml-1 text-[10px] font-mono uppercase tracking-widest text-[#f8eee1]">
                        your pick
                      </span>
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Lock-in controls OR outcome card */}
      {!answered ? (
        isPastWave ? (
          <div className="p-4 rounded-2xl border border-[#89192c] bg-[#5a0d1b]/80 text-sm text-[#e8dcc6]/80">
            <span className="font-mono font-bold text-[#f1ca7e]">Notice:</span>{" "}
            No countermeasure was locked in for this crisis wave before the
            round concluded.
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <p className="text-xs text-[#e8dcc6]/70">
              {isRoundPaused
                ? "The round is paused by facilitator."
                : !selectionOpen
                  ? "Option selection is currently locked."
                  : "Round is Live — Select countermeasure and lock in."}
            </p>
            <button
              type="button"
              disabled={!pending || !isRoundOpen}
              onClick={() => onLockIn(pending)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#f1ca7e] text-[#5a0d1b] font-black uppercase tracking-wider text-sm
                disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:scale-[1.03] enabled:active:scale-95 transition shadow-lg shadow-black/30"
            >
              <Lock className="w-4 h-4" /> Lock in decision
            </button>
          </div>
        )
      ) : (
        <div
          className={`animate-pop-in rounded-2xl border ${tone(chosen?.delta || 0).border} ${tone(chosen?.delta || 0).bg} p-4 flex items-start gap-3`}
        >
          <DeltaIcon
            delta={chosen?.delta || 0}
            className={`w-6 h-6 shrink-0 ${tone(chosen?.delta || 0).text}`}
          />
          <div>
            <p
              className={`font-black text-lg ${tone(chosen?.delta || 0).text}`}
            >
              {chosen?.delta === 0
                ? "No effect on valuation"
                : `Valuation ${(chosen?.delta || 0) > 0 ? "up" : "down"} ${formatDelta(Math.abs(chosen?.delta || 0)).replace(/^[+−]/, "")}`}
            </p>
            <p className="text-[#f8eee1]/90">{chosen?.outcome}</p>
            <p className="mt-1 text-xs text-[#e8dcc6]/70">
              {isPastWave
                ? `Archived decision from Wave ${index + 1}.`
                : "Decision locked. The next crisis arrives when the clock hits its mark."}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

/* ---------- start & end screens ---------- */

function StartCard({ onStart }) {
  const introPoints = [
    { Icon: Coins, text: "Every team starts at $100B" },
    { Icon: Timer, text: "10 crises · one every 6 minutes" },
    { Icon: Target, text: "Pick 1 of 4 solutions. Each moves the valuation." },
  ];

  return (
    <section className="rounded-3xl border border-[#f1ca7e]/30 bg-[#701020] p-8 md:p-12 text-center space-y-6 animate-pop-in shadow-2xl">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-[#5a0d1b] border border-[#89192c] flex items-center justify-center text-[#f1ca7e]">
        <Landmark className="w-10 h-10" />
      </div>
      <h2 className="text-3xl md:text-4xl font-black">
        Defend {SIM_CONFIG.companyName}
      </h2>
      <div className="grid sm:grid-cols-3 gap-3 max-w-2xl mx-auto text-sm">
        {introPoints.map(({ Icon, text }) => (
          <div
            key={text}
            className="rounded-2xl border border-[#89192c] bg-[#5a0d1b] p-4 shadow-sm flex flex-col items-center justify-center"
          >
            <div className="p-2 mb-2 rounded-xl bg-[#701020] text-[#f1ca7e]">
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-[#e8dcc6]">{text}</p>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onStart}
        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#f1ca7e] text-[#5a0d1b] font-black uppercase tracking-wider hover:scale-105 active:scale-95 transition shadow-lg shadow-black/30"
      >
        <Play className="w-5 h-5" /> Begin the round
      </button>
    </section>
  );
}

function FinalCard({ balance, decisions, onReset, crisesList }) {
  const list = crisesList && crisesList.length > 0 ? crisesList : CRISES;
  const net = balance - SIM_CONFIG.startingValuation;
  const t = tone(net);

  return (
    <section className="rounded-3xl border border-[#f1ca7e]/30 bg-[#701020] p-6 md:p-10 space-y-6 animate-pop-in shadow-2xl">
      <div className="text-center space-y-1">
        <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#f1ca7e]">
          Final valuation
        </p>
        <p className="text-5xl md:text-6xl font-black text-[#f1ca7e] tabular-nums">
          {formatValuation(balance)}
        </p>
        <p className={`font-bold ${t.text}`}>
          {net === 0
            ? "Right where you started"
            : `${formatDelta(net)} overall`}
        </p>
      </div>
      <ul className="grid sm:grid-cols-2 gap-2 text-sm">
        {list.map((c, i) => {
          const o = c.options?.find((x) => x.id === decisions[i]);
          const d = o ? o.delta : 0;
          return (
            <li
              key={c.id || i}
              className="flex items-center justify-between gap-3 rounded-xl bg-[#5a0d1b] border border-[#89192c] px-3 py-2"
            >
              <span className="truncate flex items-center gap-2">
                <CrisisIcon icon={c.icon} className="w-4 h-4 shrink-0 text-[#f1ca7e]" />
                <span>{i + 1}. {c.title}</span>
              </span>
              <span className={`font-mono font-bold shrink-0 ${tone(d).text}`}>
                {o ? formatDelta(d) : "Missed"}
              </span>
            </li>
          );
        })}
      </ul>
      <div className="text-center">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#f1ca7e]/50 hover:bg-[#89192c] transition text-sm font-semibold"
        >
          <RotateCcw className="w-4 h-4" /> Reset simulation
        </button>
      </div>
    </section>
  );
}

/* ---------- main view ---------- */

export default function LiveCrisisSimulationView({
  balance,
  history,
  elapsed,
  hasStarted,
  isRunning,
  isSimulationComplete,
  currentIndex,
  serverActiveIndex,
  decisions,
  onStart,
  onTogglePause,
  onLockIn,
  onReset,
  crisesList,
  activeCrisis,
  onSelectWave,
  remainingSeconds,
  durationSeconds,
  selectionOpen = true,
  isRevealed = true,
  optionsRevealed = true,
}) {
  const list = crisesList && crisesList.length > 0 ? crisesList : CRISES;
  const answeredIdx = Object.keys(decisions).map(Number);
  const lastAnswered = answeredIdx.length ? Math.max(...answeredIdx) : null;
  const lastCrisisObj = lastAnswered !== null ? list[lastAnswered] : null;
  const lastChoice = lastCrisisObj
    ? lastCrisisObj.options?.find((o) => o.id === decisions[lastAnswered])
    : null;

  const currentCrisis = activeCrisis || list[currentIndex] || list[0];

  return (
    <div className="bg-[radial-gradient(circle_at_center,#89192c_0%,#701020_45%,#5a0d1b_100%)] py-8 md:py-12 px-4 md:px-8 border-b border-[#89192c]">
      <div className="max-w-5xl mx-auto space-y-5">
        <ValuationHero
          balance={balance}
          history={history}
          lastDelta={lastChoice ? lastChoice.delta : null}
          flashKey={lastAnswered}
          totalCrises={list.length}
        />

        {!hasStarted ? (
          <StartCard onStart={onStart} />
        ) : (
          <>
            <RoundTrack
              currentIndex={currentIndex}
              serverActiveIndex={serverActiveIndex}
              decisions={decisions}
              elapsed={elapsed}
              isRunning={isRunning}
              onTogglePause={onTogglePause}
              isComplete={isSimulationComplete}
              crisesList={list}
              onSelectWave={onSelectWave}
              remainingSeconds={remainingSeconds}
              durationSeconds={durationSeconds}
              selectionOpen={selectionOpen}
            />
            {isSimulationComplete ? (
              <FinalCard
                balance={balance}
                decisions={decisions}
                onReset={onReset}
                crisesList={list}
              />
            ) : (
              <CrisisCard
                crisis={currentCrisis}
                index={currentIndex}
                serverActiveIndex={serverActiveIndex}
                totalCrises={list.length}
                chosenId={decisions[currentIndex]}
                onLockIn={onLockIn}
                isRunning={isRunning}
                selectionOpen={selectionOpen}
                isRevealed={isRevealed}
                optionsRevealed={optionsRevealed}
                onSelectWave={onSelectWave}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
