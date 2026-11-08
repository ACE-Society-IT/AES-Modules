import React, { useState } from 'react';
import { motion } from 'framer-motion';

function IconCrown({ className = 'w-6 h-6', color = '#FFD700' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={color} stroke="none">
      <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5ZM19 19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V18H19V19Z" />
    </svg>
  );
}

export default function MonopolyPodiumLeaderboard({
  teams = [],
  currentTeamId = null,
  round = 1
}) {
  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL' | 'TOP3'

  const actualList = Array.isArray(teams) ? teams : [];

  const top1 = actualList[0] || null;
  const top2 = actualList[1] || null;
  const top3 = actualList[2] || null;

  const currentTeamIndex = actualList.findIndex((t) => String(t.id) === String(currentTeamId));
  const currentTeam = currentTeamIndex !== -1 ? actualList[currentTeamIndex] : null;

  return (
    <div className="w-full space-y-6">
      {/* 3D GLOWING PODIUM STAGE */}
      <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-b from-[#1C050D] via-[#120308] to-[#0A0205] border border-[var(--border-card)] p-6 sm:p-10 shadow-2xl">
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[120%] max-w-[1200px] h-[340px] pointer-events-none rounded-[100%]"
          style={{
            background:
              'radial-gradient(ellipse at 50% 30%, rgba(225, 29, 72, 0.35) 0%, rgba(136, 27, 48, 0.20) 45%, transparent 75%)',
            filter: 'blur(45px)'
          }}
          aria-hidden="true"
        />

        {/* Podium Stage Header */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white">
                Market Monopoly Leaderboard
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-rounded font-bold bg-[#F1CA7E]/20 text-[#F1CA7E] border border-[#F1CA7E]/30">
                Round {round}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-rounded text-[#C4B8BC] mt-1">
              Top empire portfolios ranked by net total portfolio equity (Cash + Land + Resources).
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full p-1 bg-black/40 border border-white/10 text-xs font-rounded font-bold">
            <button
              onClick={() => setFilterMode('ALL')}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                filterMode === 'ALL'
                  ? 'bg-[#F1CA7E] text-[#1B0308] font-bold shadow-md'
                  : 'text-[#C4B8BC] hover:text-white'
              }`}
            >
              All Teams ({actualList.length})
            </button>
            <button
              onClick={() => setFilterMode('TOP3')}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                filterMode === 'TOP3'
                  ? 'bg-[#F1CA7E] text-[#1B0308] font-bold shadow-md'
                  : 'text-[#C4B8BC] hover:text-white'
              }`}
            >
              Podium Top 3
            </button>
          </div>
        </div>

        {/* 3D PEDESTALS */}
        <div className="relative z-10 flex items-end justify-center gap-3 sm:gap-6 lg:gap-8 pt-10 pb-6 max-w-4xl mx-auto min-h-[360px]">
          {/* 2nd PLACE */}
          <div className="flex-1 max-w-[210px] flex flex-col items-center">
            {top2 ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="w-full flex flex-col items-center"
              >
                <div className="relative mb-3 flex flex-col items-center">
                  <div className="absolute -top-7 text-[#E2E8F0] drop-shadow-[0_0_12px_rgba(226,232,240,0.6)]">
                    <IconCrown className="w-7 h-7" color="#E2E8F0" />
                  </div>
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-1 bg-gradient-to-b from-[#A81C38] to-[#6B1527] shadow-[0_0_24px_rgba(168,28,56,0.45)]">
                    <div className="w-full h-full rounded-full bg-[#1A090E] border-2 border-white/20 flex items-center justify-center font-display font-bold text-lg sm:text-xl text-white">
                      {top2.name.slice(0, 2).toUpperCase()}
                    </div>
                  </div>
                  <span className="font-display font-bold text-xs sm:text-sm text-white mt-1.5 text-center truncate max-w-[140px] block">
                    {top2.name}
                  </span>
                </div>

                <div
                  className="w-full rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col items-center justify-between min-h-[160px] sm:min-h-[185px] shadow-[0_12px_36px_rgba(107,21,39,0.35)] border-t border-white/25"
                  style={{
                    background: 'linear-gradient(180deg, #881B30 0%, #681022 50%, #450B16 100%)'
                  }}
                >
                  <span className="font-display font-bold text-2xl sm:text-3xl text-white drop-shadow-sm">
                    2nd
                  </span>
                  <div className="w-full py-2 px-2.5 rounded-xl bg-black/40 backdrop-blur-sm text-center border border-white/15">
                    <span className="block text-[10px] sm:text-xs font-rounded font-bold text-white/75">
                      Net Worth
                    </span>
                    <span className="font-mono font-bold text-xs sm:text-sm text-white block truncate">
                      Rs {Number(top2.netWorth || 0)}L
                    </span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="w-full h-36 rounded-2xl bg-white/5 border border-dashed border-white/10 flex items-center justify-center text-xs text-white/40">
                Awaiting 2nd
              </div>
            )}
          </div>

          {/* 1st PLACE */}
          <div className="flex-1 max-w-[240px] flex flex-col items-center">
            {top1 ? (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full flex flex-col items-center"
              >
                <div className="relative mb-3 flex flex-col items-center">
                  <div className="absolute -top-9 animate-bounce drop-shadow-[0_0_16px_rgba(255,215,0,0.85)]">
                    <IconCrown className="w-9 h-9" color="#FFD700" />
                  </div>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1.5 bg-gradient-to-b from-[#C92A45] via-[#881B30] to-[#52111E] shadow-[0_0_36px_rgba(201,42,69,0.65)]">
                    <div className="w-full h-full rounded-full bg-[#120509] border-2 border-[#FFD700] flex items-center justify-center font-display font-bold text-xl sm:text-2xl text-white">
                      {top1.name.slice(0, 2).toUpperCase()}
                    </div>
                  </div>
                  <span className="font-display font-bold text-sm sm:text-base text-white mt-2 text-center truncate max-w-[160px] block">
                    {top1.name}
                  </span>
                </div>

                <div
                  className="w-full rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col items-center justify-between min-h-[210px] sm:min-h-[240px] shadow-[0_16px_48px_rgba(136,27,48,0.45)] border-t border-[#FFD700]/50"
                  style={{
                    background: 'linear-gradient(180deg, #A81C38 0%, #751428 45%, #4A0B18 100%)'
                  }}
                >
                  <span className="font-display font-extrabold text-3xl sm:text-4xl text-[#FAF7F5] drop-shadow-md">
                    1st
                  </span>
                  <div className="w-full py-2.5 px-3 rounded-xl bg-black/45 backdrop-blur-md text-center border border-[#FFD700]/30">
                    <span className="block text-[11px] sm:text-xs font-rounded font-bold text-[#E5B582]">
                      Champion Net Worth
                    </span>
                    <span className="font-mono font-extrabold text-sm sm:text-base text-white block truncate">
                      Rs {Number(top1.netWorth || 0)}L
                    </span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="w-full h-48 rounded-2xl bg-white/5 border border-dashed border-white/10 flex items-center justify-center text-xs text-white/40">
                Awaiting 1st
              </div>
            )}
          </div>

          {/* 3rd PLACE */}
          <div className="flex-1 max-w-[210px] flex flex-col items-center">
            {top3 ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="w-full flex flex-col items-center"
              >
                <div className="relative mb-3 flex flex-col items-center">
                  <div className="absolute -top-7 text-[#CD7F32] drop-shadow-[0_0_12px_rgba(205,127,50,0.6)]">
                    <IconCrown className="w-7 h-7" color="#CD7F32" />
                  </div>
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-1 bg-gradient-to-b from-[#7A1527] to-[#4A0B16] shadow-[0_0_24px_rgba(122,21,39,0.4)]">
                    <div className="w-full h-full rounded-full bg-[#150409] border-2 border-white/20 flex items-center justify-center font-display font-bold text-lg sm:text-xl text-white">
                      {top3.name.slice(0, 2).toUpperCase()}
                    </div>
                  </div>
                  <span className="font-display font-bold text-xs sm:text-sm text-white mt-1.5 text-center truncate max-w-[140px] block">
                    {top3.name}
                  </span>
                </div>

                <div
                  className="w-full rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col items-center justify-between min-h-[140px] sm:min-h-[160px] shadow-[0_12px_36px_rgba(82,17,30,0.35)] border-t border-white/20"
                  style={{
                    background: 'linear-gradient(180deg, #5A0E1C 0%, #3D0913 50%, #26050C 100%)'
                  }}
                >
                  <span className="font-display font-bold text-2xl sm:text-3xl text-white drop-shadow-sm">
                    3rd
                  </span>
                  <div className="w-full py-2 px-2.5 rounded-xl bg-black/40 backdrop-blur-sm text-center border border-white/15">
                    <span className="block text-[10px] sm:text-xs font-rounded font-bold text-white/75">
                      Net Worth
                    </span>
                    <span className="font-mono font-bold text-xs sm:text-sm text-white block truncate">
                      Rs {Number(top3.netWorth || 0)}L
                    </span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="w-full h-32 rounded-2xl bg-white/5 border border-dashed border-white/10 flex items-center justify-center text-xs text-white/40">
                Awaiting 3rd
              </div>
            )}
          </div>
        </div>

        {currentTeam && (
          <div className="relative z-10 mt-4 mx-auto max-w-xl text-center py-2.5 px-5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-rounded text-white">
            <span>Your desk <strong>{currentTeam.name}</strong> is currently ranked </span>
            <span className="font-bold text-[#FFD700]">#{currentTeamIndex + 1}</span>
            <span> out of <strong>{actualList.length} teams</strong> • Rs {Number(currentTeam.netWorth || 0)}L</span>
          </div>
        )}
      </div>

      {/* LOWER RANKINGS TABLE */}
      <div className="surface-box rounded-[32px] p-6 sm:p-8 space-y-4 shadow-xl border border-[var(--border-card)]">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[var(--border-soft)]">
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-main)' }}>
              Standings Ledger
            </h3>
            <p className="text-xs font-rounded font-semibold" style={{ color: 'var(--text-sub)' }}>
              All {actualList.length} contestant teams ranked by total portfolio net worth.
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {actualList.length === 0 ? (
            <div className="text-center py-12 text-xs font-rounded text-[var(--text-sub)]">
              No registered teams on the leaderboard yet.
            </div>
          ) : (
            actualList
              .filter((_, idx) => (filterMode === 'TOP3' ? idx < 3 : true))
              .map((t, idx) => {
                const rank = idx + 1;
                const isFirst = rank === 1;
                const isSecond = rank === 2;
                const isThird = rank === 3;
                const isCurrent = String(t.id) === String(currentTeamId);

                return (
                  <motion.div
                    key={t.id || t.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: Math.min(idx * 0.03, 0.4) }}
                    className={`capsule-card rounded-2xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-4 border transition-all ${
                      isFirst
                        ? 'border-[#881B30]/70 bg-gradient-to-r from-[#3D0D17] to-[#1F070C]'
                        : isSecond
                        ? 'border-[#6B1527]/60 bg-gradient-to-r from-[#2B0910] to-[#170509]'
                        : isThird
                        ? 'border-[#52111E]/50 bg-gradient-to-r from-[#21070D] to-[#120407]'
                        : 'border-[var(--border-soft)]'
                    } ${isCurrent ? 'ring-2 ring-[var(--border-active)]' : ''}`}
                  >
                    <div className="flex items-center gap-3.5 min-w-[200px]">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-display font-bold text-sm shrink-0 shadow-sm ${
                          isFirst
                            ? 'bg-gradient-to-br from-[#A81C38] to-[#681022] text-[#FFD700]'
                            : isSecond
                            ? 'bg-gradient-to-br from-[#881B30] to-[#52111E] text-white'
                            : isThird
                            ? 'bg-gradient-to-br from-[#5A0E1C] to-[#3D0913] text-[#FAF7F5]'
                            : 'bg-[var(--bg-inset)] text-[var(--text-sub)]'
                        }`}
                      >
                        {isFirst ? '1' : isSecond ? '2' : isThird ? '3' : `#${rank}`}
                      </div>

                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#3D0D17] to-[#6B1527] border border-white/20 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-inner">
                        {t.name.slice(0, 2).toUpperCase()}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-display font-bold text-sm sm:text-base text-[var(--text-main)]">
                            {t.name}
                          </span>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-rounded font-bold bg-[var(--btn-primary-bg)] text-white">
                              Your Team
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-rounded text-[var(--text-sub)]">
                          Props: {t.propertyCount || 0} • Resources: {t.resourceCount || (t.ownedResources || []).length} • Cash: Rs {t.cash}L
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 sm:gap-10">
                      <div className="hidden sm:block text-right">
                        <span className="text-[10px] uppercase font-rounded font-bold text-[var(--text-sub)] block">
                          Land Valuation
                        </span>
                        <span className="font-mono font-bold text-xs sm:text-sm text-[#2E7D52]">
                          Rs {t.propertyValuation || 0}L
                        </span>
                      </div>

                      <div className="text-right min-w-[130px]">
                        <span className="text-[10px] uppercase font-rounded font-bold text-[var(--text-sub)] block">
                          Total Net Worth
                        </span>
                        <span className="font-mono font-bold text-base sm:text-lg text-[var(--text-main)] block">
                          Rs {t.netWorth || 0}L
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
          )}
        </div>
      </div>
    </div>
  );
}

