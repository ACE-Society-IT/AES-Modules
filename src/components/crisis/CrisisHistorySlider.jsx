import React from 'react';
import { motion } from 'framer-motion';
import { IconCheck, IconClock, IconAlert } from '../ui/CustomIcons.jsx';

export default function CrisisHistorySlider({ gameState }) {
  const round = gameState?.currentRound || 1;
  const currentCrisisNum = gameState?.currentCrisis || 1;
  const activeCrisis = gameState?.activeCrisis;

  // Only display released crises for this round
  const rawList = Array.isArray(gameState?.releasedCrises) ? [...gameState.releasedCrises] : [];
  if (
    activeCrisis &&
    !rawList.some(
      (c) =>
        (c.id && c.id === activeCrisis.id) ||
        (Number(c.number) === Number(activeCrisis.number) &&
          Number(c.round || round) === Number(activeCrisis.round || round))
    )
  ) {
    rawList.unshift(activeCrisis);
  }

  const releasedForRound = rawList
    .filter((c) => Number(c.round || round) === Number(round))
    .sort((a, b) => (Number(b.number) || 0) - (Number(a.number) || 0)); // most recent first

  const active =
    activeCrisis ||
    releasedForRound.find((c) => Number(c.number) === Number(currentCrisisNum)) ||
    releasedForRound[0] ||
    null;

  const isCurrentlyActive = active
    ? activeCrisis
      ? (activeCrisis.id && active.id && activeCrisis.id === active.id) ||
        Number(active.number) === Number(activeCrisis.number)
      : Number(active.number) === Number(currentCrisisNum)
    : false;
  const priceApplied = active ? Boolean(active.priceChangeApplied) : false;
  const impacts = active?.impacts || {};
  const impactEntries = Object.entries(impacts);

  // Past crises in this round (if any)
  const pastCrises = releasedForRound.filter(
    (c) => (active?.id ? c.id !== active.id : Number(c.number) !== Number(active?.number))
  );

  return (
    <div className="surface-box rounded-[28px] p-5 sm:p-6 space-y-4 shadow-sm border border-[var(--border-soft)]">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-[var(--border-soft)] pb-3">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--border-active)] block">
            Round {round} Updates
          </span>
          <h3 className="font-display text-lg font-bold" style={{ color: 'var(--text-main)' }}>
            Crisis Feed
          </h3>
        </div>
        {active && (
          <span className="rounded-full bg-[#881B30] text-white border border-[#881B30] px-3 py-1 text-xs font-mono font-bold shadow-xs">
            Crisis #{active.number}
          </span>
        )}
      </div>

      {/* Current Active Crisis Detail */}
      {active ? (
        <div className="space-y-4">
          <div className="capsule-card rounded-2xl p-4 sm:p-5 space-y-3.5 border border-[var(--border-soft)]">
            {/* Status Badge (No blinking / ping animation) */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-rounded font-bold flex items-center gap-2 ${
                  isCurrentlyActive
                    ? 'bg-[#881B30] text-white border border-[#881B30] shadow-xs'
                    : 'bg-[#2E7D52]/15 text-[#2E7D52] border border-[#2E7D52]/30'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isCurrentlyActive ? 'bg-white' : 'bg-[#2E7D52]'
                  }`}
                />
                {isCurrentlyActive
                  ? `Crisis ${active.number} (Active on Floor)`
                  : `Crisis ${active.number} (Resolved)`}
              </span>

              <span className="text-xs font-mono font-bold text-[var(--border-active)]">
                {active.cipherCode || `Crisis-${round}0${active.number}`}
              </span>
            </div>

            {/* Headline & Description */}
            <div>
              <h4 className="font-display text-base sm:text-lg font-bold leading-snug" style={{ color: 'var(--text-main)' }}>
                {active.headline || active.title || 'Market Crisis Event'}
              </h4>
              <p className="text-xs mt-1.5 leading-relaxed text-[var(--text-sub)] font-rounded">
                {active.description}
              </p>
            </div>

            {/* Stock Price Changes Breakdown */}
            <div className="rounded-xl capsule-inset p-3 space-y-2">
              <div className="flex items-center justify-between text-xs font-rounded">
                <span className="font-bold text-[var(--text-main)]">
                  Stock Price Impact
                </span>
                <span
                  className={`font-semibold px-2 py-0.5 rounded-full text-[11px] flex items-center gap-1 ${
                    priceApplied
                      ? 'bg-[#2E7D52]/20 text-[#2E7D52]'
                      : 'bg-[#881B30]/15 text-[#881B30]'
                  }`}
                >
                  {priceApplied ? (
                    <>
                      <IconCheck className="w-3.5 h-3.5 text-[#2E7D52]" />
                      <span>Prices updated</span>
                    </>
                  ) : (
                    <>
                      <IconClock className="w-3.5 h-3.5 text-[#881B30]" />
                      <span className="font-bold">Impacts pending</span>
                    </>
                  )}
                </span>
              </div>

              {priceApplied ? (
                impactEntries.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {impactEntries.map(([sym, pct]) => {
                      const num = Number(pct);
                      const isUp = num >= 0;
                      return (
                        <div
                          key={sym}
                          className={`rounded-full px-2.5 py-1 text-xs font-mono tabular-nums font-bold flex items-center gap-1.5 border ${
                            isUp
                              ? 'bg-[#2E7D52]/15 border-[#2E7D52]/30 text-[#2E7D52]'
                              : 'bg-[#C0392B]/15 border-[#C0392B]/30 text-[#C0392B]'
                          }`}
                        >
                          <span>{sym}</span>
                          <span>{isUp ? `+${num}%` : `${num}%`}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-xs font-rounded text-[var(--text-sub)]">
                    General event with no direct stock price changes.
                  </div>
                )
              ) : (
                <div className="rounded-xl bg-[var(--bg-page)]/40 p-3 text-xs font-rounded flex items-center gap-2.5 border border-dashed border-[var(--border-soft)]">
                  <IconClock className="w-4 h-4 text-[#881B30] shrink-0" />
                  <span className="text-[var(--text-sub)] font-semibold">
                    Stock impacts hidden: decide which stocks will gain or drop before price adjustments are triggered.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Earlier Crises in Round (Clean list, no sliding 1 2 3 buttons) */}
          {pastCrises.length > 0 && (
            <div className="space-y-2 pt-1">
              <span className="text-xs font-rounded font-bold text-[var(--text-sub)] block">
                Earlier Events in Round {round}
              </span>
              {pastCrises.map((pc) => (
                <div
                  key={pc.id || `past-crisis-${pc.number}`}
                  className="capsule-inset rounded-xl p-3 flex items-center justify-between text-xs font-rounded"
                >
                  <div>
                    <span className="font-bold text-[var(--text-main)] block">
                      Crisis #{pc.number || 1}: {pc.headline || pc.title || 'Market Crisis Event'}
                    </span>
                    <span className="text-[11px] text-[var(--text-sub)]">
                      {pc.cipherCode || `Event ${pc.number}`}
                    </span>
                  </div>
                  <span className="rounded-full bg-[#2E7D52]/15 text-[#2E7D52] border border-[#2E7D52]/30 px-2 py-0.5 text-[10px] font-bold">
                    Resolved
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="capsule-card rounded-2xl p-6 text-center space-y-1.5">
          <div className="font-display text-sm font-bold" style={{ color: 'var(--text-main)' }}>
            No crises currently
          </div>
          <p className="text-xs font-rounded text-[var(--text-sub)] leading-relaxed max-w-xs mx-auto">
            Market crises will appear here automatically when released.
          </p>
        </div>
      )}
    </div>
  );
}
