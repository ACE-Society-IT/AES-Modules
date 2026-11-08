import React from 'react';
import { motion } from 'framer-motion';
import {
  IconRules,
  IconShield,
  IconClock,
  IconWallet,
  IconCash,
  IconTrade,
  IconAlert,
  IconCheck,
  IconBriefcase
} from '../ui/CustomIcons.jsx';

export default function TournamentRulesView() {
  return (
    <div className="w-full space-y-6">
      {/* Header Banner */}
      <div className="surface-box rounded-[32px] p-6 sm:p-8 space-y-3 border border-[var(--border-soft)] shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#b81434] text-[#FFFFFF] flex items-center justify-center font-bold shadow-md shrink-0">
              <IconRules className="w-6 h-6 text-[#FFFFFF]" />
            </div>
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-main)' }}>
                Investomania Official Contestant Rulebook
              </h2>
              <p className="text-xs font-rounded font-semibold text-[var(--text-sub)]">
                Procedural guidelines, market protocols, capital carryover arithmetic, and victory conditions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[var(--border-active)]/15 text-[var(--border-active)] border border-[var(--border-active)]/30 px-4 py-1.5 text-xs font-mono font-bold">
              Institutional Regulations • 3 Rounds
            </span>
          </div>
        </div>
      </div>

      {/* Beginner / Student Plain-English Guide */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="surface-box rounded-[32px] p-6 sm:p-8 space-y-5 border border-[var(--border-soft)] shadow-sm"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-soft)] pb-4">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--border-active)] block">
              Beginner's Handbook • Plain English
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--text-main)]">
              What Does Everything Mean? (Student Field Guide)
            </h3>
            <p className="text-xs font-rounded text-[var(--text-sub)]">
              Never traded before? Here is a simple, no-jargon breakdown of liquid cash, placing orders, calculating net worth, and winning.
            </p>
          </div>
          <span className="rounded-full bg-[#2E7D52]/15 text-[#2E7D52] border border-[#2E7D52]/30 px-3.5 py-1 text-xs font-mono font-bold">
            Read First
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. Liquid Cash */}
          <div className="capsule-card rounded-2xl p-4 space-y-2 border border-[var(--border-soft)] flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#2E7D52]">
                <IconCash className="w-5 h-5 shrink-0" />
                <h4 className="font-display font-bold text-sm text-[var(--text-main)]">
                  1. Liquid Cash (Money in Hand)
                </h4>
              </div>
              <p className="text-xs font-rounded text-[var(--text-sub)] leading-relaxed">
                This is the actual unspent cash sitting in your wallet. You start Round 1 with <strong className="font-display text-[var(--text-main)]">PKR 100,000</strong>.
              </p>
              <div className="rounded-xl p-2.5 bg-[var(--bg-inset)] border border-[var(--border-soft)] text-[11px] font-rounded text-[var(--text-sub)] space-y-1">
                <span className="font-bold text-[var(--text-main)] block">How it changes:</span>
                <div>• Buying stocks <strong className="text-[#B83A3A]">deducts</strong> cash.</div>
                <div>• Selling stocks <strong className="text-[#2E7D52]">adds</strong> cash back.</div>
                <div>• You cannot spend more than your liquid cash (no loans / zero margin).</div>
              </div>
            </div>
          </div>

          {/* 2. BUY & SELL Orders */}
          <div className="capsule-card rounded-2xl p-4 space-y-2 border border-[var(--border-soft)] flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[var(--border-active)]">
                <IconTrade className="w-5 h-5 shrink-0" />
                <h4 className="font-display font-bold text-sm text-[var(--text-main)]">
                  2. Orders (BUY & SELL)
                </h4>
              </div>
              <p className="text-xs font-rounded text-[var(--text-sub)] leading-relaxed">
                An "Order" is a transaction instruction you send to the exchange engine:
              </p>
              <div className="rounded-xl p-2.5 bg-[var(--bg-inset)] border border-[var(--border-soft)] text-[11px] font-rounded text-[var(--text-sub)] space-y-1">
                <div>• <strong className="text-[#2E7D52]">BUY:</strong> You spend cash to acquire shares of a company (e.g. Meezan Bank, OGDC, PSO).</div>
                <div>• <strong className="text-[#B83A3A]">SELL:</strong> You sell shares you already own back to the market at current price.</div>
                <div>• <strong className="text-[var(--border-active)]">Quick Chips:</strong> Click <strong>25%</strong>, <strong>50%</strong>, or <strong>MAX</strong> to calculate quantities instantly without typing numbers!</div>
              </div>
            </div>
          </div>

          {/* 3. Total Net Worth */}
          <div className="capsule-card rounded-2xl p-4 space-y-2 border border-[var(--border-soft)] flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#D9BB7C]">
                <IconWallet className="w-5 h-5 shrink-0" />
                <h4 className="font-display font-bold text-sm text-[var(--text-main)]">
                  3. Total Net Worth (Your Real Score)
                </h4>
              </div>
              <p className="text-xs font-rounded text-[var(--text-sub)] leading-relaxed">
                Net Worth is your <strong>true financial power</strong> and your rank on the Leaderboard:
              </p>
              <div className="rounded-xl p-2.5 bg-[var(--bg-inset)] border border-[var(--border-soft)] text-[11px] font-rounded text-[var(--text-sub)] space-y-1">
                <div className="font-display font-bold text-[var(--text-main)]">
                  Net Worth = Liquid Cash + Value of All Stocks + Offshore Sheltered Cash
                </div>
                <div className="pt-1">
                  <em>Example:</em> If you spend all PKR 100,000 buying shares and their price doubles, your Cash is PKR 0 but your Net Worth is <strong className="text-[#2E7D52]">PKR 200,000</strong>!
                </div>
              </div>
            </div>
          </div>

          {/* 4. Holdings & Positions */}
          <div className="capsule-card rounded-2xl p-4 space-y-2 border border-[var(--border-soft)] flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[var(--border-active)]">
                <IconBriefcase className="w-5 h-5 shrink-0" />
                <h4 className="font-display font-bold text-sm text-[var(--text-main)]">
                  4. Holdings & Positions
                </h4>
              </div>
              <p className="text-xs font-rounded text-[var(--text-sub)] leading-relaxed">
                The actual bundle of stocks and assets your team currently owns in your vault:
              </p>
              <div className="rounded-xl p-2.5 bg-[var(--bg-inset)] border border-[var(--border-soft)] text-[11px] font-rounded text-[var(--text-sub)] space-y-1">
                <div>• If you bought 200 shares of PSO at PKR 120, your holding is "200 PSO".</div>
                <div>• If PSO rises to PKR 150, your holding is now worth PKR 30,000 (PKR 6,000 profit).</div>
                <div>• View all active holdings anytime under the <strong>My Portfolio</strong> tab.</div>
              </div>
            </div>
          </div>

          {/* 5. Crisis Decrypt & Price Shocks */}
          <div className="capsule-card rounded-2xl p-4 space-y-2 border border-[var(--border-soft)] flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#C0392B]">
                <IconAlert className="w-5 h-5 shrink-0" />
                <h4 className="font-display font-bold text-sm text-[var(--text-main)]">
                  5. Crisis News & Price Shocks
                </h4>
              </div>
              <p className="text-xs font-rounded text-[var(--text-sub)] leading-relaxed">
                How you make profit from breaking economic events:
              </p>
              <div className="rounded-xl p-2.5 bg-[var(--bg-inset)] border border-[var(--border-soft)] text-[11px] font-rounded text-[var(--text-sub)] space-y-1">
                <div>• <strong className="text-[#D9BB7C]">Decrypt Phase (180s):</strong> The market is frozen. Read the news bulletin! Guess which stocks will go UP or DOWN.</div>
                <div>• <strong className="text-[#2E7D52]">Trading Floor (300-540s):</strong> Floor unlocks. Buy stocks that will jump; sell stocks that will drop.</div>
                <div>• <strong className="text-[#C0392B]">Price Shock:</strong> Prices shift suddenly. Good predictions yield massive net worth surges!</div>
              </div>
            </div>
          </div>

          {/* 6. Round 3 Offshore Tax Havens & Secret Limits */}
          <div className="capsule-card rounded-2xl p-4 space-y-2 border border-[var(--border-soft)] flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#3B7A57]">
                <IconShield className="w-5 h-5 shrink-0" />
                <h4 className="font-display font-bold text-sm text-[var(--text-main)]">
                  6. Offshore Havens & Secret Limits (R3)
                </h4>
              </div>
              <p className="text-xs font-rounded text-[var(--text-sub)] leading-relaxed">
                In Round 3, domestic taxes eat away at unshielded profits:
              </p>
              <div className="rounded-xl p-2.5 bg-[var(--bg-inset)] border border-[var(--border-soft)] text-[11px] font-rounded text-[var(--text-sub)] space-y-1">
                <div>• Wire money to 10 cities (Zurich, Cayman, Dubai, Panama, etc.) to get low tax rates.</div>
                <div>• <strong className="text-[#B83A3A]">Secret Limits:</strong> Every city has a confidential safe limit set by the Game Master!</div>
                <div>• If you wire more than the secret safe limit, you get <strong className="text-[#B83A3A]">CAUGHT BY THE GOVERNMENT</strong> and pay a heavy fine!</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Grid of Rule Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Module 1: Tournament Structure & Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, delay: 0.05 }}
          className="surface-box rounded-[28px] p-6 space-y-4 border border-[var(--border-soft)] flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-[var(--border-soft)]">
              <div className="w-8 h-8 rounded-xl bg-[#b81434]/15 text-[var(--border-active)] flex items-center justify-center font-bold text-xs border border-[var(--border-soft)]">
                01
              </div>
              <h3 className="font-display text-base font-bold text-[var(--text-main)]">
                Three Simulation Rounds
              </h3>
            </div>

            <div className="space-y-3 text-xs font-rounded">
              <div className="capsule-card rounded-2xl p-3.5 space-y-1 border border-[var(--border-soft)]">
                <span className="font-bold text-[var(--border-active)] block">
                  Round 1: PSX Equities Trading Floor
                </span>
                <p className="text-[var(--text-sub)] leading-relaxed">
                  Base allocation of <strong>PKR 100,000</strong>. Trade top Pakistani blue-chip equities across 4 key sectors: Fuel & Power, Banking, Industrials, and Technology.
                </p>
              </div>

              <div className="capsule-card rounded-2xl p-3.5 space-y-1 border border-[var(--border-soft)]">
                <span className="font-bold text-[var(--border-active)] block">
                  Round 2: Global Macro & Multi-Asset Volatility
                </span>
                <p className="text-[var(--text-sub)] leading-relaxed">
                  Starting desk capital equals <strong>PKR 100,000 ± Round 1 Net PnL</strong>. Market expands to global commodities and currency shifts under international shocks.
                </p>
              </div>

              <div className="capsule-card rounded-2xl p-3.5 space-y-1 border border-[var(--border-soft)]">
                <span className="font-bold text-[var(--border-active)] block">
                  Round 3: Offshore Tax Havens & Money Smuggling
                </span>
                <p className="text-[var(--text-sub)] leading-relaxed">
                  Starting desk capital equals <strong>PKR 100,000 + Round 1 PnL + Round 2 PnL</strong>. High-stakes floor where domestic corporate taxes bite unless shielded offshore.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Module 2: Capital Carryover Arithmetic */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, delay: 0.1 }}
          className="surface-box rounded-[28px] p-6 space-y-4 border border-[var(--border-soft)] flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-[var(--border-soft)]">
              <div className="w-8 h-8 rounded-xl bg-[#b81434]/15 text-[var(--border-active)] flex items-center justify-center font-bold text-xs border border-[var(--border-soft)]">
                02
              </div>
              <h3 className="font-display text-base font-bold text-[var(--text-main)]">
                Profit & Loss Carryover Formula
              </h3>
            </div>

            <p className="text-xs font-rounded text-[var(--text-sub)] leading-relaxed">
              Every rupee earned or lost directly alters your starting budget for subsequent rounds. No artificial zero floor is applied to losses:
            </p>

            <div className="capsule-inset rounded-2xl p-4 space-y-2.5 font-mono text-xs border border-[var(--border-soft)]">
              <div className="flex justify-between items-center text-[var(--text-main)]">
                <span>Round 1 Given Budget:</span>
                <strong className="text-[#D9BB7C]">PKR 100,000.00</strong>
              </div>
              <div className="flex justify-between items-center text-[var(--text-main)] pt-1 border-t border-[var(--border-soft)]">
                <span>Round 2 Given Budget:</span>
                <strong className="text-[#D9BB7C]">PKR 100,000 + R1 Profit/Loss</strong>
              </div>
              <div className="flex justify-between items-center text-[var(--text-main)] pt-1 border-t border-[var(--border-soft)]">
                <span>Round 3 Given Budget:</span>
                <strong className="text-[#D9BB7C]">PKR 100,000 + R1 PnL + R2 PnL</strong>
              </div>
            </div>

            <div className="rounded-2xl capsule-card p-3.5 text-xs font-rounded border border-[var(--border-soft)] space-y-1">
              <span className="font-bold text-[var(--text-main)] block">Important Note on Capital Drawdowns</span>
              <p className="text-[var(--text-sub)] leading-relaxed">
                If your desk sustains a net loss of PKR 12,000 in Round 1, your Round 2 starting cash will be exactly PKR 88,000. Conversely, gains are credited immediately into your cash reserves.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Module 3: 3-Minute Crisis Decrypt & Trading Cycle */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, delay: 0.15 }}
          className="surface-box rounded-[28px] p-6 space-y-4 border border-[var(--border-soft)] flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-[var(--border-soft)]">
              <div className="w-8 h-8 rounded-xl bg-[#b81434]/15 text-[var(--border-active)] flex items-center justify-center font-bold text-xs border border-[var(--border-soft)]">
                03
              </div>
              <h3 className="font-display text-base font-bold text-[var(--text-main)]">
                Crisis Decrypt & Price Shock Cycle
              </h3>
            </div>

            <div className="space-y-3 text-xs font-rounded">
              <div className="capsule-card rounded-2xl p-3.5 space-y-1 border border-[var(--border-soft)]">
                <span className="font-bold text-[#D9BB7C] flex items-center gap-1.5">
                  <IconClock className="w-3.5 h-3.5 text-[#D9BB7C]" />
                  Phase 1: 3-Minute Crisis Decrypt (Floor Closed)
                </span>
                <p className="text-[var(--text-sub)] leading-relaxed">
                  Trading is locked. A breaking headline bulletin is decrypted on all desks and the central projector. Teams have 180 seconds to forecast impact on corporate balance sheets.
                </p>
              </div>

              <div className="capsule-card rounded-2xl p-3.5 space-y-1 border border-[var(--border-soft)]">
                <span className="font-bold text-[#2E7D52] flex items-center gap-1.5">
                  <IconTrade className="w-3.5 h-3.5 text-[#2E7D52]" />
                  Phase 2: Live Trading Window (Floor Open)
                </span>
                <p className="text-[var(--text-sub)] leading-relaxed">
                  Trading desk opens for 300 to 540 seconds. Place BUY or SELL orders, manage position size, and utilize BUY MAX or SELL ALL chips to secure desired allocations.
                </p>
              </div>

              <div className="capsule-card rounded-2xl p-3.5 space-y-1 border border-[var(--border-soft)]">
                <span className="font-bold text-[#C0392B] flex items-center gap-1.5">
                  <IconAlert className="w-3.5 h-3.5 text-[#C0392B]" />
                  Phase 3: Periodic Price Shocks (Every 60-90s)
                </span>
                <p className="text-[var(--text-sub)] leading-relaxed">
                  Automated market shocks shift prices dynamically based on the crisis parameters. Positions taken ahead of the shock will crystallize gains or losses.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Module 4: Desk Invariants & Fair Play */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, delay: 0.2 }}
          className="surface-box rounded-[28px] p-6 space-y-4 border border-[var(--border-soft)] flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-[var(--border-soft)]">
              <div className="w-8 h-8 rounded-xl bg-[#b81434]/15 text-[var(--border-active)] flex items-center justify-center font-bold text-xs border border-[var(--border-soft)]">
                04
              </div>
              <h3 className="font-display text-base font-bold text-[var(--text-main)]">
                Trading Invariants & Enforcement
              </h3>
            </div>

            <div className="space-y-2.5 text-xs font-rounded">
              <div className="flex items-start gap-2.5 capsule-card rounded-xl p-3 border border-[var(--border-soft)]">
                <IconCheck className="w-4 h-4 text-[#2E7D52] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[var(--text-main)] block">No Negative Cash (Zero Margin)</strong>
                  <span className="text-[var(--text-sub)] leading-relaxed">
                    Orders exceeding available liquid cash will be rejected immediately by the exchange engine.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 capsule-card rounded-xl p-3 border border-[var(--border-soft)]">
                <IconCheck className="w-4 h-4 text-[#2E7D52] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[var(--text-main)] block">Physical Holding Enforcement</strong>
                  <span className="text-[var(--text-sub)] leading-relaxed">
                    You can only sell shares your desk currently owns. Naked short selling is technically restricted.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 capsule-card rounded-xl p-3 border border-[var(--border-soft)]">
                <IconAlert className="w-4 h-4 text-[#C0392B] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[var(--text-main)] block">Game Master Suspension Powers</strong>
                  <span className="text-[var(--text-sub)] leading-relaxed">
                    Any desk attempting to tamper with network requests or disrupt the session will be banned by the Game Master.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Module 5: Round 3 Tax Evasion Detailed Rules Banner */}
      <div className="surface-box rounded-[32px] p-6 sm:p-8 space-y-4 border border-[var(--border-soft)] shadow-sm">
        <div className="flex items-center gap-3 pb-3 border-b border-[var(--border-soft)]">
          <div className="w-10 h-10 rounded-2xl bg-[#D9BB7C]/20 text-[var(--border-active)] flex items-center justify-center font-bold shrink-0 border border-[var(--border-soft)]">
            <IconShield className="w-5 h-5 text-[var(--border-active)]" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-[var(--text-main)]">
              Round 3 Offshore Tax Shield & Smuggling Mechanics
            </h3>
            <span className="text-xs font-rounded text-[var(--text-sub)] font-semibold">
              Balancing lower tax rates against high-probability regulatory seizure audits.
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-rounded">
          <div className="capsule-card rounded-2xl p-4 space-y-2 border border-[var(--border-soft)]">
            <strong className="text-[var(--text-main)] block">Domestic Tax Drain</strong>
            <p className="text-[var(--text-sub)] leading-relaxed">
              In Round 3, unshielded cash held on the domestic floor is subjected to automatic corporate tax deductions at the end of each crisis cycle.
            </p>
          </div>

          <div className="capsule-card rounded-2xl p-4 space-y-2 border border-[var(--border-soft)]">
            <strong className="text-[var(--text-main)] block">10 Global Haven Havens</strong>
            <p className="text-[var(--text-sub)] leading-relaxed">
              Allocate capital to offshore channels across Zurich, Geneva, Cayman, Panama, Luxembourg, Monaco, Swarm Dark Pool, Dubai, Singapore, and BVI.
            </p>
          </div>

          <div className="capsule-card rounded-2xl p-4 space-y-2 border border-[var(--border-soft)]">
            <strong className="text-[var(--text-main)] block">Risk vs. Rate Tradeoff</strong>
            <p className="text-[var(--text-sub)] leading-relaxed">
              Havens with ultra-low tax rates (e.g. Dark Pool @ 10%) carry higher surveillance risk, while Swiss vaults (@ 35%) offer near-certain legal immunity.
            </p>
          </div>
        </div>
      </div>

      {/* Victory Criteria Footer */}
      <div className="surface-box rounded-[28px] p-6 text-center space-y-2 border-2 border-[var(--border-active)] shadow-md">
        <h3 className="font-display text-lg font-bold text-[var(--text-main)]">
          Victory Condition & Trophy Award
        </h3>
        <p className="text-xs font-rounded text-[var(--text-sub)] max-w-2xl mx-auto leading-relaxed">
          The team with the highest verified <strong>Total Net Worth</strong> (Liquid Cash + Equities Market Value + Net Tax-Shielded Offshore Reserves) at the conclusion of Round 3 will be awarded first place on the live Projector View.
        </p>
      </div>
    </div>
  );
}

