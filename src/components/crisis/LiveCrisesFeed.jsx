import React from 'react';
import { motion } from 'framer-motion';
import { IconBroadcast, IconAlert, IconCheck, IconClock } from '../ui/CustomIcons.jsx';

export default function LiveCrisesFeed({ gameState, onOpenFullArchive }) {
  const round = gameState?.currentRound || 1;
  const currentCrisisNum = gameState?.currentCrisis || 1;
  const activeCrisis = gameState?.activeCrisis;

  // Crises trigger sequentially - newest crisis first
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

  const releasedCrises = rawList
    .filter((c) => Number(c.round || round) === Number(round))
    .sort((a, b) => (Number(b.number) || 0) - (Number(a.number) || 0));

  return (
    <div className="surface-box rounded-[28px] p-4 sm:p-5 space-y-3.5 shadow-sm border border-[var(--border-soft)] flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#881B30] text-white flex items-center justify-center shadow-sm shrink-0">
            <IconBroadcast className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-base font-bold leading-tight" style={{ color: 'var(--text-main)' }}>
                Crisis Updates
              </h3>
              {releasedCrises.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#881B30]" />
              )}
            </div>
            <span className="text-[11px] font-rounded font-semibold text-[var(--text-sub)]">
              {releasedCrises.length === 1 ? '1 active crisis' : `${releasedCrises.length} total updates`}
            </span>
          </div>
        </div>

        {onOpenFullArchive && (
          <button
            onClick={onOpenFullArchive}
            className="text-[11px] font-rounded font-bold text-[var(--border-active)] hover:underline cursor-pointer"
          >
            All updates →
          </button>
        )}
      </div>

      {/* Crises List */}
      <div className="space-y-2.5 overflow-y-auto max-h-[260px] sm:max-h-[270px] pr-1">
        {releasedCrises.length > 0 ? (
          releasedCrises.map((crisis) => {
            const isLive = activeCrisis
              ? (activeCrisis.id && crisis.id && activeCrisis.id === crisis.id) ||
                (Number(activeCrisis.number) === Number(crisis.number) && Number(activeCrisis.round || round) === Number(crisis.round || round))
              : Number(crisis.number) === Number(currentCrisisNum);
            const priceApplied = Boolean(crisis.priceChangeApplied);
            const impacts = crisis.impacts || {};
            const impactEntries = Object.entries(impacts);

            return (
              <motion.div
                key={crisis.id || `crisis-notif-${crisis.round || round}-${crisis.number}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`capsule-card rounded-[22px] p-3 space-y-2 border transition-all ${
                  isLive
                    ? 'border-[var(--border-active)] ring-1 ring-[var(--border-active)]/40 bg-[var(--bg-inset)] shadow-md'
                    : 'border-[var(--border-soft)]'
                }`}
              >
                {/* Crisis Card Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <IconAlert className={`w-3.5 h-3.5 ${isLive ? 'text-[#881B30]' : 'text-[var(--text-sub)]'}`} />
                    <span className="text-xs font-rounded font-bold text-[var(--text-main)]">
                      Crisis {crisis.number || 1}
                    </span>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-rounded font-bold ${
                      isLive
                        ? 'bg-[#881B30] text-white shadow-xs'
                        : 'bg-[#2E7D52]/15 text-[#2E7D52]'
                    }`}
                  >
                    {isLive ? 'Live Now' : 'Past Event'}
                  </span>
                </div>

                {/* Headline & Body */}
                <div className="space-y-1">
                  <h4 className="font-display text-sm font-bold leading-snug" style={{ color: 'var(--text-main)' }}>
                    {crisis.headline || crisis.title || 'Market Crisis Event'}
                  </h4>
                  <p className="text-xs font-rounded leading-relaxed text-[var(--text-sub)] line-clamp-3">
                    {crisis.description}
                  </p>
                </div>

                {/* Impact Tags Strip */}
                <div className="pt-2 border-t border-[var(--border-soft)] space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-rounded">
                    <span className="text-[var(--text-sub)] font-semibold">Stock impact</span>
                    <span className={`font-semibold flex items-center gap-1 text-[11px] ${priceApplied ? 'text-[#2E7D52]' : 'text-[#881B30]'}`}>
                      {priceApplied ? (
                        <>
                          <IconCheck className="w-3.5 h-3.5 text-[#2E7D52]" />
                          <span>Prices updated</span>
                        </>
                      ) : (
                        <>
                          <IconClock className="w-3.5 h-3.5 text-[#881B30]" />
                          <span className="font-bold">Impacts pending (predict market shift)</span>
                        </>
                      )}
                    </span>
                  </div>

                  {priceApplied ? (
                    impactEntries.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {impactEntries.map(([sym, pct]) => {
                          const num = Number(pct);
                          const isUp = num >= 0;
                          return (
                            <span
                              key={sym}
                              className={`rounded-full px-2.5 py-0.5 text-xs font-mono tabular-nums font-bold border ${
                                isUp
                                  ? 'bg-[#2E7D52]/15 border-[#2E7D52]/30 text-[#2E7D52]'
                                  : 'bg-[#C0392B]/15 border-[#C0392B]/30 text-[#C0392B]'
                              }`}
                            >
                              {sym} {isUp ? `+${num}%` : `${num}%`}
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      <span className="text-xs font-rounded text-[var(--text-sub)] block">
                        General event with no direct stock price changes.
                      </span>
                    )
                  ) : (
                    <div className="rounded-xl capsule-inset p-2.5 text-xs font-rounded flex items-center gap-2 text-[var(--text-sub)] border border-dashed border-[var(--border-soft)]">
                      <IconClock className="w-3.5 h-3.5 text-[#881B30] shrink-0" />
                      <span className="font-semibold">Impacts hidden: analyze the news to predict which stocks will rise or drop before prices update.</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="capsule-card rounded-2xl p-7 text-center space-y-2">
            <div className="font-display text-sm font-bold" style={{ color: 'var(--text-main)' }}>
              No crises currently
            </div>
            <p className="text-xs font-rounded text-[var(--text-sub)] leading-relaxed max-w-xs mx-auto">
              Market crises will show up here automatically when released.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
