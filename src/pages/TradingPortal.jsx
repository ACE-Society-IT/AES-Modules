import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGame } from '../context/GameContext.jsx';
import {
  TactileButton,
  MiniSparkline,
  AreaTrajectoryGraph,
  EasyLoadingScreen
} from '../components/ui/EasyComponents.jsx';
import CrisisHistorySlider from '../components/crisis/CrisisHistorySlider.jsx';
import StocksOverviewGrid from '../components/stocks/StocksOverviewGrid.jsx';
import TradeModal from '../components/trading/TradeModal.jsx';
import LiveCrisesFeed from '../components/crisis/LiveCrisesFeed.jsx';
import {
  IconAlert,
  IconWallet,
  IconCash,
  IconBriefcase,
  IconLayers,
  IconClock,
  IconCalendar,
  IconBroadcast,
  IconCheck,
  IconClose,
  IconPieChart,
  IconTrade,
  IconSun,
  IconMoon
} from '../components/ui/CustomIcons.jsx';
import { Menu, X } from 'lucide-react';

// Code-split heavy sub-tabs for fast floor switching
const WorldMapSmugglingView = lazy(() => import('../components/tax/WorldMapSmugglingView.jsx'));
const TournamentRulesView = lazy(() => import('../components/rules/TournamentRulesView.jsx'));
const PodiumLeaderboardView = lazy(() =>
  import('../components/leaderboard/PodiumLeaderboardView.jsx').then((m) => ({ default: m.PodiumLeaderboardView }))
);

function TabSubLoadingFallback({ title = 'Loading...' }) {
  return (
    <div className="surface-box rounded-2xl p-8 text-center space-y-3 border border-[var(--border-card)]">
      <div className="w-6 h-6 mx-auto border-2 border-[var(--border-active)] border-t-transparent rounded-full animate-spin" />
      <p className="text-xs font-rounded font-semibold" style={{ color: 'var(--text-sub)' }}>
        {title}
      </p>
    </div>
  );
}

export function normalizeCategorySector(sector = '') {
  const s = String(sector || '').trim().toLowerCase();
  if (s.includes('oil') || s.includes('gas') || s.includes('fuel') || s.includes('power') || s.includes('utilities') || s.includes('energy')) {
    return 'Fuel & Power';
  }
  if (s.includes('bank') || s.includes('finance')) {
    return 'Banking';
  }
  if (s.includes('tech') || s.includes('software') || s.includes('it')) {
    return 'Technology';
  }
  if (s.includes('cement') || s.includes('conglomerate') || s.includes('fertilizer') || s.includes('construction') || s.includes('petrochem') || s.includes('agri') || s.includes('industr')) {
    return 'Industrials';
  }
  return sector || 'Other';
}

export function formatTimer(seconds = 0) {
  const s = Math.max(0, Math.floor(seconds));
  const mins = String(Math.floor(s / 60)).padStart(2, '0');
  const secs = String(s % 60).padStart(2, '0');
  return `${mins}:${secs}`;
}

export default function TradingPortal({ activeTab = 'market' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const validTabs = ['market', 'stocks', 'crisis', 'portfolio', 'leaderboard', 'rules', 'tax'];
  const pathParts = location.pathname.split('/').filter(Boolean);
  const foundTab = pathParts.find((part) => validTabs.includes(part));
  const currentTab = foundTab || activeTab || 'market';
  const { gameState, team, logoutTeam, placeTrade, allocateTaxChannel, theme, toggleTheme } = useGame();

  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssetSymbol, setSelectedAssetSymbol] = useState(null);
  const [isCrisisDrawerOpen, setIsCrisisDrawerOpen] = useState(false);
  const [crisisRoundFilter, setCrisisRoundFilter] = useState('ALL');

  // Authoritative Released Crises & Live Active Crisis directly from Supabase
  const allReleasedCrises = useMemo(() => {
    const raw = Array.isArray(gameState?.releasedCrises) ? [...gameState.releasedCrises] : [];
    if (
      gameState?.activeCrisis &&
      !raw.some(
        (c) =>
          (c.id && c.id === gameState.activeCrisis.id) ||
          (Number(c.number) === Number(gameState.activeCrisis.number) &&
            Number(c.round || gameState.currentRound) === Number(gameState.activeCrisis.round || gameState.currentRound))
      )
    ) {
      raw.unshift(gameState.activeCrisis);
    }
    return raw;
  }, [gameState?.releasedCrises, gameState?.activeCrisis, gameState?.currentRound]);

  const filteredCrises = useMemo(() => {
    if (crisisRoundFilter === 'ALL') return allReleasedCrises;
    return allReleasedCrises.filter((c) => Number(c.round || gameState?.currentRound) === Number(crisisRoundFilter));
  }, [allReleasedCrises, crisisRoundFilter, gameState?.currentRound]);

  // Popup Trade Modal State
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [tradeModalAsset, setTradeModalAsset] = useState(null);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const assets = gameState?.assets || [];
  const selectedAsset = assets.find((a) => a.symbol === selectedAssetSymbol) || assets[0] || null;

  useEffect(() => {
    if (assets.length > 0 && !assets.some((a) => a.symbol === selectedAssetSymbol)) {
      setSelectedAssetSymbol(assets[0].symbol);
    }
  }, [assets, selectedAssetSymbol]);

  const isTradingOpen = gameState?.phase === 'TRADING' && !gameState?.isPaused;
  const isRound3 = Number(gameState?.currentRound) === 3;

  // Dynamic Concise Category Filter: Fuel & Power merged, Arrows on categories, NO arrow on ALL in top area
  const categoryFilters = useMemo(() => {
    const list = [
      {
        id: 'ALL',
        label: 'All Instruments',
        count: assets.length,
        hasArrow: false // No arrow on the top "All Instruments" category
      }
    ];

    const order = ['Fuel & Power', 'Banking', 'Industrials', 'Technology'];
    const sectorMap = new Map();

    assets.forEach((a) => {
      const sec = normalizeCategorySector(a.sector);
      if (!sectorMap.has(sec)) {
        sectorMap.set(sec, []);
      }
      sectorMap.get(sec).push(a);
    });

    const orderedSectors = [
      ...order.filter((s) => sectorMap.has(s)),
      ...Array.from(sectorMap.keys()).filter((s) => !order.includes(s))
    ];

    orderedSectors.forEach((sec) => {
      const secAssets = sectorMap.get(sec) || [];
      const total = secAssets.reduce((sum, a) => sum + Number(a.changePercent || 0), 0);
      const avg = secAssets.length > 0 ? (total / secAssets.length) : 0;
      list.push({
        id: `SEC:${sec}`,
        label: sec,
        count: secAssets.length,
        avgChange: avg,
        isUp: avg >= 0,
        hasArrow: true // Show profit/loss arrow in categories
      });
    });

    return list;
  }, [assets]);

  const filteredAssets = useMemo(() => {
    return assets.filter((a) => {
      let matchesCat = true;
      if (categoryFilter !== 'ALL') {
        if (categoryFilter.startsWith('SEC:')) {
          const targetSec = categoryFilter.replace('SEC:', '');
          matchesCat = normalizeCategorySector(a.sector) === targetSec;
        } else {
          matchesCat = a.category === categoryFilter;
        }
      }
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        a.symbol.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q) ||
        normalizeCategorySector(a.sector).toLowerCase().includes(q) ||
        a.sector.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [assets, categoryFilter, searchQuery]);

  // Top Metrics calculation (matching Investor Forum's OverviewView layout)
  const initialBudget = Number(team?.initialRoundBudget || 100000);
  const teamCash = Number(team?.cash || 0);

  // Dynamic detailed holdings computed from team.holdings and real-time market prices
  const detailedHoldings = useMemo(() => {
    if (!team?.holdings || typeof team.holdings !== 'object') return [];
    return Object.entries(team.holdings)
      .map(([sym, h]) => {
        const qty = typeof h === 'object' ? Number(h?.quantity || 0) : Number(h || 0);
        if (qty <= 0) return null;
        const asset = (gameState?.assets || []).find(
          (a) => a.symbol?.toUpperCase() === sym.toUpperCase()
        );
        const avgBuy = typeof h === 'object' ? Number(h?.averageBuyPrice || 0) : 0;
        const curPrice = Number(asset?.price || avgBuy || 0);
        const marketVal = Number((qty * curPrice).toFixed(2));
        const totalInvested = typeof h === 'object' && h?.totalInvested 
          ? Number(h.totalInvested) 
          : (avgBuy ? Number((qty * avgBuy).toFixed(2)) : marketVal);
        const pnl = Number((marketVal - totalInvested).toFixed(2));
        const pnlPercent = totalInvested > 0 ? ((pnl / totalInvested) * 100).toFixed(2) : '0.00';

        return {
          symbol: sym,
          name: asset?.name || sym,
          quantity: qty,
          avgBuyPrice: avgBuy || curPrice,
          currentPrice: curPrice,
          marketValue: marketVal,
          pnl,
          pnlPercent,
          asset
        };
      })
      .filter(Boolean);
  }, [team?.holdings, gameState?.assets]);

  const holdingsVal = useMemo(
    () => detailedHoldings.reduce((sum, h) => sum + h.marketValue, 0),
    [detailedHoldings]
  );
  const totalNetWorth = Number((teamCash + holdingsVal).toFixed(2));
  const allTimePnl = Number((totalNetWorth - initialBudget).toFixed(2));
  const allTimePnlPct = initialBudget > 0 ? ((allTimePnl / initialBudget) * 100).toFixed(2) : '0.00';
  const cashPct = totalNetWorth > 0 ? Math.min(100, Math.max(0, (teamCash / totalNetWorth) * 100)) : 100;
  const holdingsPct = totalNetWorth > 0 ? Math.min(100, Math.max(0, (holdingsVal / totalNetWorth) * 100)) : 0;
  const activePositions = detailedHoldings.length;
  const executedTrades = (team?.taxHistory?.length || 0) + (team?.transactions?.length || team?.tradeCount || 0);

  // Tournament Round Performance & Carryover Calculations
  const currentRound = Number(gameState?.currentRound || 1);
  const r1Profit = typeof team?.round1Profit === 'number' ? team.round1Profit : null;
  const r2Profit = typeof team?.round2Profit === 'number' ? team.round2Profit : null;
  
  // Unrealized / Realized Round 1 PnL
  const liveR1Pnl = currentRound === 1 
    ? Number((totalNetWorth - 100000).toFixed(2))
    : (r1Profit !== null ? r1Profit : 0);

  // Cumulative Completed PnL (Round 1 + Round 2)
  const cumulativeCompletedPnl = Number(((r1Profit || 0) + (r2Profit || 0)).toFixed(2));
  
  // Round given budgets
  const round2GivenBudget = Math.max(1000, Number((100000 + (r1Profit || 0)).toFixed(2)));
  const round3GivenBudget = Math.max(1000, Number((100000 + (r1Profit || 0) + (r2Profit || 0)).toFixed(2)));

  const handleOpenTrade = (asset) => {
    setTradeModalAsset(asset);
    setIsTradeModalOpen(true);
  };

  if (!gameState || !team) {
    return <EasyLoadingScreen message="Connecting to Investomania Floor..." />;
  }

  return (
    <div className="w-full min-h-screen lg:h-screen lg:overflow-hidden flex flex-col lg:flex-row p-0">
      {/* FIXED ANCHORED SIDEBAR WRAPPER (RESPONSIVE WIDTH & FIXED IN PLACE) */}
      <div className="w-full lg:w-64 xl:w-72 lg:h-full shrink-0 p-3 sm:p-4 lg:p-5 lg:pr-0 flex flex-col z-30">
        <aside className="surface-box rounded-[24px] sm:rounded-[28px] lg:rounded-[32px] p-3.5 sm:p-4 flex flex-col justify-between w-full h-full shrink-0 gap-2.5 sm:gap-3 shadow-lg">
          <div className="flex flex-col items-stretch gap-2.5 sm:gap-3 w-full min-h-0 flex-1">
            {/* Brand Header + Mobile/Tablet Quick Actions */}
            <div className="flex items-center justify-between gap-3 w-full shrink-0">
              <div
                onClick={() => navigate('/investomania')}
                className="flex items-center gap-2.5 sm:gap-3 px-1 pt-1 shrink-0 cursor-pointer group"
                title="Return to Investomania Landing"
              >
                <img
                  src="/InvestomaniaLogo.png"
                  alt="Investomania Logo"
                  className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl object-contain shrink-0 shadow-sm group-hover:scale-105 transition-transform"
                />
                <div className="block">
                  <div className="font-display text-base sm:text-lg font-bold leading-tight" style={{ color: 'var(--text-main)' }}>
                    Investomania
                  </div>
                  <span className="text-[11px] sm:text-xs font-rounded font-semibold" style={{ color: 'var(--text-sub)' }}>
                    Round {gameState.currentRound} Floor
                  </span>
                </div>
              </div>

              {/* Mobile / Tablet Header Controls (Menu Window, Theme & Sign Out) */}
              <div className="flex lg:hidden items-center gap-1.5 sm:gap-2 shrink-0">
                <TactileButton
                  onClick={() => setIsMobileNavOpen(true)}
                  className="rounded-full py-1.5 px-3 text-xs font-rounded font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer shadow-sm"
                  style={{
                    backgroundColor: 'var(--tab-active-bg)',
                    color: 'var(--tab-active-text)',
                    borderColor: 'var(--border-active)'
                  }}
                  title="Open Navigation Menu Window"
                >
                  <Menu className="w-3.5 h-3.5" />
                  <span>Floor Menu</span>
                </TactileButton>

                <TactileButton
                  onClick={toggleTheme}
                  className="rounded-full py-1.5 px-2.5 sm:px-3 text-xs font-rounded font-semibold flex items-center justify-center gap-1 border transition-all cursor-pointer"
                  style={{
                    backgroundColor: 'var(--theme-btn-bg)',
                    color: 'var(--theme-btn-text)',
                    borderColor: 'var(--theme-btn-border)'
                  }}
                  title="Click to cycle themes"
                >
                  {theme === 'aes' ? (
                    <IconSun className="w-3.5 h-3.5 text-[#89192C]" />
                  ) : theme === 'dark' ? (
                    <IconSun className="w-3.5 h-3.5 text-[#D9BB7C]" />
                  ) : (
                    <IconMoon className="w-3.5 h-3.5 text-[#6B1527]" />
                  )}
                  <span className="hidden sm:inline font-bold uppercase text-[10px]">{theme}</span>
                </TactileButton>

                <TactileButton
                  onClick={() => setIsSignOutModalOpen(true)}
                  style={{
                    backgroundColor: 'var(--btn-signout-bg)',
                    color: 'var(--btn-signout-text)',
                    borderColor: 'var(--btn-signout-border)'
                  }}
                  className="rounded-full py-1.5 px-2.5 sm:px-3 text-[11px] sm:text-xs font-rounded font-bold text-center transition-all border cursor-pointer hover:brightness-105"
                >
                  Sign Out
                </TactileButton>
              </div>
            </div>

            {/* Mobile & Tablet Compact Active Team Banner */}
            <div className="capsule-card rounded-2xl px-3.5 py-2 flex lg:hidden items-center justify-between gap-3 text-xs font-rounded border border-[var(--border-soft)] shrink-0 w-full">
              <div className="flex items-center gap-2 truncate">
                <span className="w-2 h-2 rounded-full bg-[#2E7D52] shrink-0" />
                <span className="font-bold truncate" style={{ color: 'var(--text-main)' }}>
                  {team?.name || 'Trading Desk'}
                </span>
              </div>
              <div className="flex items-center gap-2.5 font-mono text-[11px] sm:text-xs shrink-0">
                <span>Cash: <strong style={{ color: 'var(--text-main)' }}>PKR {Number(team?.cash || 0).toLocaleString()}</strong></span>
                {((team?.round1Profit || 0) > 0 || (team?.round2Profit || 0) > 0) && (
                  <span className="text-[#2E7D52] hidden sm:inline font-bold">
                    +PKR {Number((team?.round1Profit || 0) + (team?.round2Profit || 0)).toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Desktop Active Team Capsule */}
            <div className="capsule-card rounded-[24px] p-3.5 hidden lg:block border border-[var(--border-soft)] shrink-0">
              <div className="flex items-center justify-between text-xs font-rounded mb-1">
                <span className="font-bold truncate" style={{ color: 'var(--text-main)' }}>
                  {team?.name || 'Trading Desk'}
                </span>
                <span className="inline-flex items-center gap-1 text-[#2E7D52] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#2E7D52]" /> Online
                </span>
              </div>
              <div className="text-xs font-rounded font-bold" style={{ color: 'var(--text-sub)' }}>
                Cash: <strong style={{ color: 'var(--text-main)' }}>PKR {Number(team?.cash || 0).toLocaleString()}</strong>
              </div>
              {((team?.round1Profit || 0) > 0 || (team?.round2Profit || 0) > 0) && (
                <div className="text-xs font-rounded text-[#2E7D52] mt-0.5">
                  Carryover: +PKR {Number((team?.round1Profit || 0) + (team?.round2Profit || 0)).toLocaleString()}
                </div>
              )}
            </div>

            {/* Desktop Navigation Pills (Hidden on mobile/tablet so ZERO scrollbars appear on screen) */}
            <nav className="hidden lg:flex flex-col gap-2 overflow-y-auto no-scrollbar w-full py-1 flex-1 min-h-0 pr-0.5" aria-label="Portal Navigation">
              {[
                { id: 'market', label: 'Trading Floor', badge: assets.length },
                { id: 'stocks', label: 'All Stocks', badge: gameState.allStocks?.length || assets.length },
                { id: 'tax', label: isRound3 ? 'Offshore Tax' : 'Offshore Havens', badge: 10 },
                { id: 'crisis', label: 'Crisis News', badge: allReleasedCrises.length },
                { id: 'portfolio', label: 'My Portfolio', badge: activePositions },
                { id: 'leaderboard', label: 'Rankings', badge: gameState.leaderboard?.length || 0 },
                { id: 'rules', label: 'Tournament Rules', badge: 'Guide' }
              ].map((item) => {
                const active = currentTab === item.id;
                return (
                  <TactileButton
                    key={item.id}
                    onClick={() => navigate(`/investomania/${item.id}`)}
                    className={`w-auto lg:w-full whitespace-nowrap rounded-full px-3.5 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2.5 text-xs font-rounded font-bold transition-all shrink-0 ${
                      active
                        ? 'border-2 border-[var(--border-active)] shadow-sm'
                        : 'border-2 border-transparent hover:opacity-100 opacity-80 text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--row-hover)]'
                    }`}
                    style={
                      active
                        ? {
                            backgroundColor: 'var(--tab-active-bg)',
                            color: 'var(--tab-active-text)'
                          }
                        : {}
                    }
                  >
                    <span className="truncate">{item.label}</span>
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-mono font-bold shrink-0"
                      style={
                        active
                          ? {
                              backgroundColor: 'var(--tab-badge-bg)',
                              color: 'var(--tab-badge-text)'
                            }
                          : {
                              backgroundColor: 'var(--bg-inset)',
                              color: 'var(--text-sub)'
                            }
                      }
                    >
                      {item.badge}
                    </span>
                  </TactileButton>
                );
              })}
            </nav>
          </div>

          {/* Desktop Bottom Sidebar Controls (Hidden on mobile/tablet since integrated in top header) */}
          <div className="hidden lg:flex flex-col gap-2 pt-3 border-t border-[var(--border-soft)] w-full shrink-0">
            <TactileButton
              onClick={toggleTheme}
              className="w-full rounded-full py-2.5 px-3 text-xs font-rounded font-semibold flex items-center justify-center gap-2 border transition-all cursor-pointer"
              style={{
                backgroundColor: 'var(--theme-btn-bg)',
                color: 'var(--theme-btn-text)',
                borderColor: 'var(--theme-btn-border)'
              }}
              title="Click to cycle themes: Light, Dark, AES Mix"
            >
              {theme === 'aes' ? (
                <>
                  <IconSun className="w-4 h-4 text-[#89192C]" />
                  <span className="font-bold">AES Theme</span>
                </>
              ) : theme === 'dark' ? (
                <>
                  <IconSun className="w-4 h-4 text-[#D9BB7C]" />
                  <span className="font-bold">Dark Maroon</span>
                </>
              ) : (
                <>
                  <IconMoon className="w-4 h-4 text-[#6B1527]" />
                  <span className="font-bold">White Theme</span>
                </>
              )}
            </TactileButton>

            <TactileButton
              onClick={() => setIsSignOutModalOpen(true)}
              style={{
                backgroundColor: 'var(--btn-signout-bg)',
                color: 'var(--btn-signout-text)',
                borderColor: 'var(--btn-signout-border)'
              }}
              className="w-full rounded-full py-2.5 px-3 text-xs font-rounded font-bold text-center transition-all border cursor-pointer hover:brightness-105"
            >
              Sign Out
            </TactileButton>
          </div>
        </aside>
      </div>

      {/* MAIN WORKSPACE - INDEPENDENT SCROLL (SCROLLBAR STRETCHED TO 100% SCREEN EDGE) */}
      <main className="flex-1 min-w-0 w-full lg:h-full lg:overflow-y-auto screen-scrollbar p-3 sm:p-4 lg:py-5 lg:pl-5 lg:pr-5 xl:pr-6 space-y-6">
          {/* 0. TOURNAMENT ROUND PROGRESS & LIVE STATS TOP BAR (Visible on Every Tab) */}
          <div className="surface-box rounded-[28px] p-4 sm:p-5 shadow-sm border border-[var(--border-card)]">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
              {/* Left: Tournament Schedule & Phase Title */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#b81434]/15 text-[var(--border-active)] flex items-center justify-center shrink-0 border border-[var(--border-soft)]">
                  <IconCalendar className="w-5 h-5 text-[var(--border-active)]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-rounded text-[var(--text-sub)] uppercase font-bold tracking-wider">
                      Tournament Floor
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-rounded bg-[#b81434] text-[#FFF8F6]">
                      {gameState.phase === 'COMPLETED' ? 'CONCLUDED' : `ROUND ${gameState.currentRound} OF 3`}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold font-display mt-0.5" style={{ color: 'var(--text-main)' }}>
                    {gameState.currentRound === 1 && 'Round 1: PSX Equities Trading Floor'}
                    {gameState.currentRound === 2 && 'Round 2: Commodities & FX Trading Floor'}
                    {gameState.currentRound === 3 && 'Round 3: Multi-Asset Floor + Offshore Tax Havens'}
                  </h2>
                </div>
              </div>

              {/* Right: Key Portfolio Metrics & Clock (Always Visible Across All Tabs!) */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {/* Total Net Worth */}
                <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl capsule-card border border-[var(--border-soft)]">
                  <div className="w-7 h-7 rounded-lg bg-[#b81434]/15 text-[var(--border-active)] flex items-center justify-center shrink-0">
                    <IconWallet className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-rounded font-semibold text-[var(--text-sub)] uppercase block leading-none">
                      Total Net Worth
                    </span>
                    <span className="text-xs sm:text-sm font-bold font-mono text-[var(--text-main)] tabular-nums">
                      PKR {Number(totalNetWorth).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Active Holdings */}
                <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl capsule-card border border-[var(--border-soft)]">
                  <div className="w-7 h-7 rounded-lg bg-[#2E7D52]/15 text-[#2E7D52] flex items-center justify-center shrink-0">
                    <IconBriefcase className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-rounded font-semibold text-[var(--text-sub)] uppercase block leading-none">
                      Active Positions
                    </span>
                    <span className="text-xs sm:text-sm font-bold font-mono text-[var(--text-main)] tabular-nums">
                      {activePositions} {activePositions === 1 ? 'Holding' : 'Holdings'}
                    </span>
                  </div>
                </div>

                {/* Floor Timer */}
                <div
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border ${
                    gameState.phase === 'TRADING'
                      ? 'bg-[#2E7D52]/15 border-[#2E7D52]/40 text-[#2E7D52]'
                      : (gameState.phase === 'DECRYPT' || gameState.phase === 'DECRYPTING')
                      ? 'bg-[#881B30]/15 border-[#881B30]/40 text-[#881B30]'
                      : 'capsule-card text-[var(--text-sub)] border-[var(--border-soft)]'
                  }`}
                >
                  <IconClock className="w-4 h-4" />
                  <div>
                    <span className="text-[10px] uppercase block text-[var(--text-sub)] leading-none font-rounded font-bold">
                      {gameState.phase === 'TRADING' && (gameState.isUntimed ? 'Floor Open (Untimed)' : 'Trading Floor Open')}
                      {(gameState.phase === 'DECRYPT' || gameState.phase === 'DECRYPTING') && 'Floor Locked · Decrypting'}
                      {gameState.phase === 'IDLE' && 'Waiting for Round'}
                      {gameState.phase === 'PRE_ROUND' && 'Pre-Round Staging'}
                      {gameState.phase === 'RESULTS' && 'Round Results'}
                      {gameState.phase === 'COMPLETED' && 'Round Ended'}
                    </span>
                    <span className="text-sm font-bold font-mono tabular-nums">
                      {gameState.isUntimed ? '∞ UNTIMED' : formatTimer(gameState.remainingSeconds)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ANIMATED TAB SWITCH CONTAINER */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 12, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.995 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="w-full space-y-6"
            >
              {/* TAB 1: TRADING FLOOR (Only Tab That Displays Detailed Cards + Side-by-Side Chart & Crisis Feed) */}
              {(currentTab === 'market' || !['stocks', 'crisis', 'portfolio', 'leaderboard', 'rules', 'tax'].includes(currentTab)) && (
            <div className="space-y-6">
              {/* 1. TOP 4 STATS CARDS - FLUID RESPONSIVE ACROSS ALL SCREEN SIZES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-4">
                {/* Card 1: Total Net Worth */}
                <div className="surface-box rounded-[28px] p-5 flex flex-col justify-between border border-[var(--border-soft)] shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-rounded font-semibold text-[var(--text-sub)] uppercase tracking-wider">Total Net Worth</span>
                    <div className="w-8 h-8 rounded-xl bg-[#b81434]/15 text-[var(--border-active)] flex items-center justify-center shrink-0 border border-[var(--border-soft)]">
                      <IconWallet className="w-4 h-4 text-[var(--border-active)]" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="text-xl sm:text-2xl font-bold font-mono text-[var(--text-main)] block truncate">
                      PKR {Number(totalNetWorth).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <div className="flex items-center gap-1.5 mt-1 text-xs font-rounded font-semibold">
                      <span className={`font-mono font-bold ${allTimePnl >= 0 ? 'text-[#2E7D52]' : 'text-[#C0392B]'}`}>
                        {allTimePnl >= 0 ? '+' : ''}{allTimePnlPct}%
                      </span>
                      <span className="text-[var(--text-sub)]">all-time PnL</span>
                    </div>
                  </div>
                </div>

                {/* Card 2: Liquid Cash Power */}
                <div className="surface-box rounded-[28px] p-5 flex flex-col justify-between border border-[var(--border-soft)] shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-rounded font-semibold text-[var(--text-sub)] uppercase tracking-wider">Liquid Cash Power</span>
                    <div className="w-8 h-8 rounded-xl bg-[#2E7D52]/15 text-[#2E7D52] flex items-center justify-center shrink-0 border border-[#2E7D52]/30">
                      <IconCash className="w-4 h-4 text-[#2E7D52]" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="text-xl sm:text-2xl font-bold font-mono text-[var(--text-main)] block truncate">
                      PKR {Number(teamCash).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <div className="flex items-center gap-1.5 mt-1 text-xs font-rounded font-semibold text-[var(--text-sub)]">
                      <span className="font-mono">{cashPct.toFixed(1)}%</span> of portfolio
                    </div>
                  </div>
                </div>

                {/* Card 3: Equities Value */}
                <div className="surface-box rounded-[28px] p-5 flex flex-col justify-between border border-[var(--border-soft)] shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-rounded font-semibold text-[var(--text-sub)] uppercase tracking-wider">Equities Value</span>
                    <div className="w-8 h-8 rounded-xl bg-[#b81434]/15 text-[var(--border-active)] flex items-center justify-center shrink-0 border border-[var(--border-soft)]">
                      <IconBriefcase className="w-4 h-4 text-[var(--border-active)]" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="text-xl sm:text-2xl font-bold font-mono text-[var(--text-main)] block truncate">
                      PKR {Number(holdingsVal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <div className="flex items-center gap-1.5 mt-1 text-xs font-rounded font-semibold text-[var(--text-sub)]">
                      <span className="font-mono">{activePositions}</span> {activePositions === 1 ? 'Active Position' : 'Active Positions'}
                    </div>
                  </div>
                </div>

                {/* Card 4: Executed Orders */}
                <div className="surface-box rounded-[28px] p-5 flex flex-col justify-between border border-[var(--border-soft)] shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-rounded font-semibold text-[var(--text-sub)] uppercase tracking-wider">Executed Orders</span>
                    <div className="w-8 h-8 rounded-xl bg-[#D9BB7C]/20 text-[var(--border-active)] flex items-center justify-center shrink-0 border border-[var(--border-soft)]">
                      <IconLayers className="w-4 h-4 text-[var(--border-active)]" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="text-xl sm:text-2xl font-bold font-mono text-[var(--text-main)] block truncate">
                      {executedTrades}
                    </span>
                    <div className="flex items-center gap-1.5 mt-1 text-xs font-rounded font-semibold text-[var(--text-sub)]">
                      <span>{executedTrades === 1 ? 'Audited trade logged' : 'Audited trades logged'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* COMPACT TOURNAMENT ROUND PERFORMANCE & CARRYOVER BUDGET (MINIMAL CLUTTER) */}
              <div className="surface-box rounded-[20px] p-3 sm:px-4 sm:py-2.5 border border-[var(--border-soft)] flex flex-wrap items-center justify-between gap-2.5 shadow-xs">
                <div className="flex items-center gap-2 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-[#b81434]" />
                  <span className="text-xs font-bold font-display uppercase tracking-wider" style={{ color: 'var(--text-main)' }}>
                    Round Carryover Budget
                  </span>
                  <span className="rounded-full bg-[var(--bg-inset)] text-[var(--border-active)] border border-[var(--border-soft)] px-2 py-0.5 text-[10px] font-mono font-bold">
                    R{currentRound}/3
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-rounded">
                  {/* Round 1 Result */}
                  <div className="capsule-card rounded-xl px-2.5 py-1 flex items-center gap-1.5 border border-[var(--border-soft)]">
                    <span className="text-[10px] font-bold text-[var(--text-sub)]">R1:</span>
                    <span className={`font-mono font-bold ${(currentRound === 1 ? liveR1Pnl : (r1Profit || 0)) >= 0 ? 'text-[#2E7D52]' : 'text-[#C0392B]'}`}>
                      {(currentRound === 1 ? liveR1Pnl : (r1Profit || 0)) >= 0 ? '+' : ''}
                      PKR {Number(currentRound === 1 ? liveR1Pnl : (r1Profit || 0)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>

                  {/* Round 2 Result */}
                  <div className="capsule-card rounded-xl px-2.5 py-1 flex items-center gap-1.5 border border-[var(--border-soft)]">
                    <span className="text-[10px] font-bold text-[var(--text-sub)]">R2:</span>
                    {currentRound > 2 && r2Profit !== null ? (
                      <span className={`font-mono font-bold ${r2Profit >= 0 ? 'text-[#2E7D52]' : 'text-[#C0392B]'}`}>
                        {r2Profit >= 0 ? '+' : ''}PKR {Number(r2Profit).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                    ) : (
                      <span className="font-mono text-[11px] text-[var(--text-sub)]">
                        {currentRound === 2 ? 'Active' : 'Pending'}
                      </span>
                    )}
                  </div>

                  {/* Round 3 Starting Budget */}
                  <div className="capsule-card rounded-xl px-2.5 py-1 flex items-center gap-1.5 border border-[var(--border-soft)] bg-[var(--bg-inset)]">
                    <span className="text-[10px] font-bold text-[var(--border-active)]">R3 Budget:</span>
                    <strong className="font-mono font-bold text-[var(--border-active)]">
                      PKR {Number(round3GivenBudget).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </strong>
                  </div>
                </div>
              </div>

              {/* 2. CAPITAL ALLOCATION VISUAL BAR */}
              <div className="surface-box rounded-[28px] p-5 sm:p-6 border border-[var(--border-soft)] space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconPieChart className="w-4 h-4 text-[var(--border-active)]" />
                    <h3 className="text-xs font-bold uppercase tracking-wider font-rounded text-[var(--text-main)]">
                      Capital Allocation
                    </h3>
                  </div>
                  <span className="text-xs font-rounded text-[var(--text-sub)] font-semibold">
                    Total Assets: <strong className="font-mono text-[var(--text-main)]">PKR {Number(totalNetWorth).toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
                  </span>
                </div>

                <div className="w-full h-3.5 rounded-full bg-[var(--bg-inset)] overflow-hidden flex border border-[var(--border-soft)] p-0.5">
                  <div
                    style={{ width: `${Math.max(2, cashPct)}%` }}
                    className="bg-[#D9BB7C] rounded-l-full transition-all duration-300"
                    title={`Liquid Cash: ${cashPct.toFixed(1)}%`}
                  />
                  <div
                    style={{ width: `${Math.max(2, holdingsPct)}%` }}
                    className="bg-[#b81434] rounded-r-full transition-all duration-300"
                    title={`Equities & Assets: ${holdingsPct.toFixed(1)}%`}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-rounded font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#D9BB7C]" />
                    <span className="text-[var(--text-sub)]">Liquid Cash (<span className="font-mono">{cashPct.toFixed(1)}%</span>)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#b81434]" />
                    <span className="text-[var(--text-sub)]">Equities & Assets (<span className="font-mono">{holdingsPct.toFixed(1)}%</span>)</span>
                  </div>
                </div>
              </div>

              {/* 3. SIDE-BY-SIDE: COMPACT TRAJECTORY GRAPH (LEFT) + CRISES UPDATES (RIGHT) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                {/* Left: Compact Area Trajectory Graph */}
                <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
                  <AreaTrajectoryGraph asset={selectedAsset} />
                </div>

                {/* Right: Crisis Updates directly on the right of the graph */}
                <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
                  <LiveCrisesFeed
                    gameState={gameState}
                    onOpenFullArchive={() => setIsCrisisDrawerOpen(true)}
                  />
                </div>
              </div>

              {/* 4. FULL WIDTH: STOCKS FLOOR LIST */}
              <div className="surface-box rounded-[32px] p-5 sm:p-6 space-y-4 border border-[var(--border-soft)] shadow-sm">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[var(--border-active)]">
                      Sector & Asset Categories
                    </span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter symbol or sector..."
                      className="capsule-card rounded-full px-4 py-1.5 text-xs font-rounded font-semibold focus:outline-none border border-[var(--border-soft)] w-full sm:w-64"
                      style={{ color: 'var(--text-main)' }}
                    />
                  </div>

                  {/* Category & Sector Pills: Specific categories show arrows, top "ALL" category does NOT show arrow */}
                  <div className="flex items-center gap-2 overflow-x-auto p-1.5 modal-scrollbar">
                    {categoryFilters.map((cat) => {
                      const isSelected = categoryFilter === cat.id;
                      const isUp = (cat.avgChange || 0) >= 0;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategoryFilter(cat.id)}
                          className={`rounded-full px-4 py-2 text-xs font-rounded font-bold shrink-0 flex items-center gap-2 cursor-pointer transition-all border ${
                            isSelected
                              ? 'btn-primary border-transparent'
                              : 'capsule-card hover:bg-[var(--row-hover)] text-[var(--text-main)] border border-[var(--border-soft)]'
                          }`}
                        >
                          <span className="tracking-wide">{cat.label}</span>
                          <span className="opacity-80 text-[10px] font-mono font-bold">({cat.count})</span>
                          {cat.hasArrow && (
                            <span
                              className={`inline-flex items-center gap-0.5 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                                isSelected
                                  ? 'bg-black/25 text-white'
                                  : isUp
                                  ? 'bg-[#2E7D52]/15 text-[#2E7D52]'
                                  : 'bg-[#C0392B]/15 text-[#C0392B]'
                              }`}
                            >
                              {isUp ? '↑' : '↓'} {isUp ? '+' : ''}{Number(cat.avgChange || 0).toFixed(1)}%
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Stock Cards List */}
                <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
                  {filteredAssets.length > 0 ? (
                    filteredAssets.map((item, idx) => {
                      const isUp = (item.changePercent || 0) >= 0;
                      const pos = team?.holdings?.[item.symbol];
                      const heldQty = typeof pos === 'object' ? Number(pos?.quantity || 0) : Number(pos || 0);
                      const isSelected = selectedAsset?.symbol === item.symbol;

                      return (
                        <motion.div
                          key={item.symbol}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.22,
                            delay: Math.min(idx * 0.03, 0.45),
                            ease: [0.22, 1, 0.36, 1]
                          }}
                          onClick={() => setSelectedAssetSymbol(item.symbol)}
                          className={`capsule-card capsule-row cursor-pointer rounded-[22px] px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border transition-all ${
                            isSelected ? 'border-[var(--border-active)] ring-2 ring-[var(--border-active)]/40 shadow-sm' : 'border-[var(--border-soft)]'
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-full bg-[#881B30] text-white flex items-center justify-center font-rounded font-bold text-xs shadow-sm shrink-0">
                              {item.symbol.slice(0, 4)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-display font-bold text-sm" style={{ color: 'var(--text-main)' }}>
                                  {item.name}
                                </span>
                                <span className="rounded-full bg-[var(--bg-inset)] text-[var(--text-sub)] border border-[var(--border-soft)] px-2.5 py-0.5 text-xs font-rounded font-bold">
                                  {item.symbol} • {normalizeCategorySector(item.sector)}
                                </span>
                              </div>
                              <div className="text-xs font-rounded font-semibold mt-0.5" style={{ color: 'var(--text-sub)' }}>
                                Prev: <span className="font-mono">PKR {Number(item.previousPrice).toFixed(2)}</span> • Held:{' '}
                                <strong className="font-mono" style={{ color: 'var(--text-main)' }}>{heldQty} units</strong>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="hidden sm:block">
                              <MiniSparkline series={item.history} isPositive={isUp} />
                            </div>
                            <div className="text-right font-rounded">
                              <div className="text-sm font-bold font-mono" style={{ color: 'var(--text-main)' }}>
                                PKR {Number(item.price).toFixed(2)}
                              </div>
                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold font-mono ${
                                  isUp ? 'bg-[#2E7D52]/15 text-[#2E7D52]' : 'bg-[#C0392B]/15 text-[#C0392B]'
                                }`}
                              >
                                <span>{isUp ? '↑' : '↓'}</span>
                                <span>{isUp ? '+' : ''}{Number(item.changePercent || 0).toFixed(2)}%</span>
                              </span>
                            </div>

                            {/* Tactile Button to Open Window Popup Trade Modal */}
                            <TactileButton
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenTrade(item);
                              }}
                              className="rounded-full px-5 py-2.5 font-rounded font-extrabold text-xs flex items-center gap-2 cursor-pointer btn-primary shadow-md hover:scale-105 transition-transform"
                            >
                              <IconTrade className="w-4 h-4 text-white" />
                              <span>Trade</span>
                            </TactileButton>
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="capsule-card rounded-[24px] p-8 text-center space-y-2 border border-[var(--border-soft)]">
                      <div className="font-display text-base font-bold" style={{ color: 'var(--text-main)' }}>
                        No floor instruments available
                      </div>
                      <p className="text-xs font-rounded font-semibold" style={{ color: 'var(--text-sub)' }}>
                        The Game Master has not added stocks for this round yet. Once added via the Admin Panel, they will populate here in real time.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: ALL STOCKS OVERVIEW GRID */}
          {currentTab === 'stocks' && (
            <StocksOverviewGrid
              gameState={gameState}
              team={team}
              onPlaceTrade={placeTrade}
            />
          )}

          {/* TAB 2: ROUND 3 TAX EVASION & GLOBAL MONEY SMUGGLING MAP */}
          {currentTab === 'tax' && (
            <Suspense fallback={<TabSubLoadingFallback title="Loading Offshore Smuggling Map..." />}>
              <WorldMapSmugglingView
                gameState={gameState}
                team={team}
                onAllocateTax={allocateTaxChannel}
              />
            </Suspense>
          )}

          {/* TAB 3: CRISIS ARCHIVE */}
          {currentTab === 'crisis' && (
            <div className="surface-box rounded-[32px] p-6 sm:p-8 space-y-6 border border-[var(--border-soft)]">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-soft)] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#881B30] animate-pulse" />
                    <h2 className="font-display text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-main)' }}>
                      Crisis Intelligence & Historical Feed
                    </h2>
                  </div>
                  <p className="text-xs font-semibold pt-1" style={{ color: 'var(--text-sub)' }}>
                    Real-time market shocks, government policy bulletins, and asset price impact logs from Supabase.
                  </p>
                </div>

                {/* Round Filter Tabs */}
                <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl capsule-inset border border-[var(--border-soft)]">
                  {[
                    { id: 'ALL', label: 'All News', count: allReleasedCrises.length },
                    { id: '1', label: 'Round 1', count: allReleasedCrises.filter((c) => Number(c.round || 1) === 1).length },
                    { id: '2', label: 'Round 2', count: allReleasedCrises.filter((c) => Number(c.round) === 2).length },
                    { id: '3', label: 'Round 3', count: allReleasedCrises.filter((c) => Number(c.round) === 3).length }
                  ].map((filter) => {
                    const active = crisisRoundFilter === filter.id;
                    return (
                      <button
                        key={filter.id}
                        onClick={() => setCrisisRoundFilter(filter.id)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-rounded font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          active
                            ? 'bg-[var(--border-active)] !text-white shadow-xs'
                            : 'text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                        style={active ? { color: '#FFFFFF', backgroundColor: 'var(--border-active)' } : {}}
                      >
                        <span>{filter.label}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                            active
                              ? 'bg-white/25 text-white'
                              : 'bg-[var(--border-soft)] text-[var(--text-sub)]'
                          }`}
                        >
                          {filter.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Breaking Crisis Spotlight (If active crisis is currently live) */}
              {gameState?.activeCrisis && (
                <div className="rounded-[28px] p-6 space-y-4 border-2 border-[#881B30] bg-[#881B30]/5 shadow-md relative overflow-hidden">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#881B30] animate-ping" />
                      <span className="rounded-full bg-[#881B30] !text-white px-3.5 py-1 text-xs font-display font-bold uppercase tracking-wider shadow-xs">
                        LIVE CRISIS BULLETIN • ROUND {gameState.activeCrisis.round || gameState.currentRound} #{gameState.activeCrisis.number}
                      </span>
                      <span className="text-xs font-mono font-bold text-[var(--text-sub)] px-2 py-0.5 rounded capsule-inset">
                        {gameState.activeCrisis.cipherCode}
                      </span>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-rounded font-bold inline-flex items-center gap-1.5 ${
                        gameState.activeCrisis.priceChangeApplied
                          ? 'bg-[#3B7A57]/20 text-[#3B7A57] border border-[#3B7A57]/40'
                          : 'bg-[#C0392B]/15 text-[#C0392B] border border-[#C0392B]/40 animate-pulse'
                      }`}
                    >
                      {gameState.activeCrisis.priceChangeApplied ? (
                        <>
                          <IconCheck className="w-3.5 h-3.5 text-[#3B7A57]" />
                          <span>Price impact applied to order book</span>
                        </>
                      ) : (
                        <>
                          <IconClock className="w-3.5 h-3.5 text-[#C0392B]" />
                          <span>Pending price shock ({gameState.priceShockCountdown || 0}s remaining)</span>
                        </>
                      )}
                    </span>
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl font-bold leading-snug" style={{ color: 'var(--text-main)' }}>
                    {gameState.activeCrisis.headline}
                  </h3>

                  <p className="text-sm font-rounded leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                    {gameState.activeCrisis.description}
                  </p>

                  {/* Impacts preview */}
                  {gameState.activeCrisis.impacts && Object.keys(gameState.activeCrisis.impacts).length > 0 && (
                    <div className="pt-3 border-t border-[var(--border-soft)]">
                      {gameState.activeCrisis.priceChangeApplied ? (
                        <div>
                          <span className="text-xs font-rounded font-bold block mb-1.5" style={{ color: 'var(--text-main)' }}>
                            Stock Price Impacts Applied to PSX:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(gameState.activeCrisis.impacts).map(([sym, pct]) => {
                              const isPositive = Number(pct) >= 0;
                              return (
                                <span
                                  key={sym}
                                  className={`rounded-full px-3 py-1 text-xs font-rounded font-bold border ${
                                    isPositive
                                      ? 'bg-[#2E7D52]/15 border-[#2E7D52]/30 text-[#2E7D52]'
                                      : 'bg-[#C0392B]/15 border-[#C0392B]/30 text-[#C0392B]'
                                  }`}
                                >
                                  {sym}: {isPositive ? `+${pct}%` : `${pct}%`}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="capsule-inset rounded-xl p-3 text-xs font-rounded flex items-center gap-2.5 text-[var(--text-sub)] border border-dashed border-[var(--border-soft)]">
                          <IconClock className="w-4 h-4 text-[#D9BB7C] shrink-0" />
                          <span>
                            Price shock impacts will apply automatically when the floor countdown expires. Analyze the news to place orders early!
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Feed of Released Crises */}
              {filteredCrises && filteredCrises.length > 0 ? (
                <div className="space-y-4">
                  {filteredCrises.map((c, idx) => (
                    <div
                      key={`${c.round || 1}-${c.number || 1}-${c.id || idx}`}
                      className="capsule-card rounded-[24px] p-6 space-y-3 border border-[var(--border-soft)] transition-all hover:border-[var(--border-active)]/50"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-[var(--border-active)]/15 text-[var(--border-active)] border border-[var(--border-active)]/30 px-3.5 py-1 text-xs font-rounded font-bold">
                            Round {c.round || gameState.currentRound} • Crisis #{c.number}
                          </span>
                          {c.cipherCode && (
                            <span className="text-xs font-mono font-bold text-[var(--text-sub)]">
                              {c.cipherCode}
                            </span>
                          )}
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-rounded font-bold inline-flex items-center gap-1.5 ${
                            c.priceChangeApplied
                              ? 'bg-[#3B7A57]/20 text-[#3B7A57]'
                              : 'bg-[#881B30]/15 text-[#881B30]'
                          }`}
                        >
                          {c.priceChangeApplied ? (
                            <>
                              <IconCheck className="w-3.5 h-3.5 text-[#3B7A57]" />
                              <span>Price shifts applied</span>
                            </>
                          ) : (
                            <>
                              <IconClock className="w-3.5 h-3.5 text-[#881B30]" />
                              <span>Waiting for price trigger</span>
                            </>
                          )}
                        </span>
                      </div>

                      <h3 className="font-display text-lg sm:text-xl font-bold" style={{ color: 'var(--text-main)' }}>
                        {c.headline}
                      </h3>
                      <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                        {c.description}
                      </p>

                      {/* Stock Impact Matrix */}
                      {c.impacts && Object.keys(c.impacts).length > 0 && (
                        <div className="pt-2 border-t border-[var(--border-soft)]">
                          {c.priceChangeApplied ? (
                            <>
                              <span className="text-xs font-rounded font-bold block mb-1.5" style={{ color: 'var(--text-main)' }}>
                                Stock Price Impacts (Applied):
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {Object.entries(c.impacts).map(([sym, pct]) => {
                                  const isPositive = Number(pct) >= 0;
                                  return (
                                    <span
                                      key={sym}
                                      className={`rounded-full px-3 py-1 text-xs font-rounded font-bold border ${
                                        isPositive
                                          ? 'bg-[#2E7D52]/15 border-[#2E7D52]/30 text-[#2E7D52]'
                                          : 'bg-[#C0392B]/15 border-[#C0392B]/30 text-[#C0392B]'
                                      }`}
                                    >
                                      {sym}: {isPositive ? `+${pct}%` : `${pct}%`}
                                    </span>
                                  );
                                })}
                              </div>
                            </>
                          ) : (
                            <div className="capsule-inset rounded-xl p-3 text-xs font-rounded flex items-center gap-2.5 text-[var(--text-sub)] border border-dashed border-[var(--border-soft)]">
                              <IconClock className="w-4 h-4 text-[#D9BB7C] shrink-0" />
                              <span>Stock impacts hidden: analyze the news to predict which stocks will rise or drop before prices update.</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="capsule-card rounded-[24px] p-10 text-center space-y-2">
                  <div className="font-display text-base font-bold" style={{ color: 'var(--text-main)' }}>
                    {crisisRoundFilter === 'ALL'
                      ? 'No Crises Released Yet'
                      : `No Crises Released for Round ${crisisRoundFilter} Yet`}
                  </div>
                  <p className="text-xs font-rounded font-semibold" style={{ color: 'var(--text-sub)' }}>
                    Market crises will appear here automatically in real time when released by the Game Master.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: TEAM PORTFOLIO */}
          {currentTab === 'portfolio' && (
            <div className="space-y-5">
              {/* Portfolio Allocation Visual Bar */}
              <div className="surface-box rounded-[28px] p-6 space-y-3.5 border border-[var(--border-soft)]">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-xl" style={{ color: 'var(--text-main)' }}>
                      Portfolio Allocation Breakdown
                    </h2>
                    <span className="text-xs font-rounded font-bold" style={{ color: 'var(--text-sub)' }}>
                      Initial Round Budget: PKR {Number(team?.initialRoundBudget || 100000).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-rounded font-semibold" style={{ color: 'var(--text-sub)' }}>Net Equity: </span>
                    <strong className="text-lg font-display" style={{ color: 'var(--text-main)' }}>PKR {totalNetWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                  </div>
                </div>

                <div className="h-5 w-full rounded-full capsule-inset p-0.5 flex gap-1 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#5E1B21] transition-all duration-300"
                    style={{ width: `${Math.max(4, holdingsPct)}%` }}
                    title={`Invested Holdings: ${holdingsPct.toFixed(1)}%`}
                  />
                  <div
                    className="h-full rounded-full bg-[#D9BB7C] transition-all duration-300"
                    style={{ width: `${Math.max(4, cashPct)}%` }}
                    title={`Liquid Cash: ${cashPct.toFixed(1)}%`}
                  />
                </div>

                <div className="flex items-center justify-between text-xs font-rounded font-semibold" style={{ color: 'var(--text-sub)' }}>
                  <span>Invested in Stocks/Commodities: PKR {holdingsVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({holdingsPct.toFixed(0)}%)</span>
                  <span>Available Liquid Cash: PKR {teamCash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({cashPct.toFixed(0)}%)</span>
                </div>
              </div>

              {/* Holdings Positions Table */}
              <div className="surface-box rounded-[28px] p-6 space-y-4 border border-[var(--border-soft)]">
                <h3 className="font-display text-lg" style={{ color: 'var(--text-main)' }}>
                  Active Securities & Holdings
                </h3>

                {detailedHoldings && detailedHoldings.length > 0 ? (
                  <div className="space-y-2.5">
                    {detailedHoldings.map((pos) => (
                      <div
                        key={pos.symbol}
                        className="capsule-card rounded-[22px] px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 font-rounded text-xs border border-[var(--border-soft)]"
                      >
                        <div>
                          <span className="font-display text-sm font-bold" style={{ color: 'var(--text-main)' }}>
                            {pos.symbol}: {pos.name}
                          </span>
                          <div style={{ color: 'var(--text-sub)' }}>
                            {pos.quantity} units @ Avg PKR {pos.avgBuyPrice.toFixed(2)} • Market PKR {pos.currentPrice.toFixed(2)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold font-mono" style={{ color: 'var(--text-main)' }}>
                            Market Value: PKR {pos.marketValue.toLocaleString()}
                          </div>
                          <span className={pos.pnl >= 0 ? 'text-[#3B7A57] font-bold' : 'text-[#B83A3A] font-bold'}>
                            {pos.pnl >= 0 ? '+' : ''}PKR {pos.pnl.toLocaleString()} ({pos.pnl >= 0 ? '+' : ''}{pos.pnlPercent}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="capsule-card rounded-[24px] p-8 text-center text-xs font-rounded" style={{ color: 'var(--text-sub)' }}>
                    No securities currently held. Trade on the Trading Floor tab to allocate capital.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: LEADERBOARD & RANKINGS PODIUM */}
          {currentTab === 'leaderboard' && (
            <Suspense fallback={<TabSubLoadingFallback title="Loading Rankings Podium..." />}>
              <PodiumLeaderboardView
                leaderboard={
                  Array.isArray(gameState.leaderboard) && gameState.leaderboard.length > 0
                    ? gameState.leaderboard
                    : (gameState.teams ? (Array.isArray(gameState.teams) ? gameState.teams : Object.values(gameState.teams)) : [])
                }
                currentTeamId={team?.id}
                round={gameState.currentRound || 1}
                phase={gameState.phase}
                remainingTimeFormatted={formatTimer(gameState.remainingSeconds)}
                isResultsRevealed={gameState.isResultsRevealed}
              />
            </Suspense>
          )}

          {/* TAB 6: RULES */}
          {currentTab === 'rules' && (
            <Suspense fallback={<TabSubLoadingFallback title="Loading Rules Guidebook..." />}>
              <TournamentRulesView />
            </Suspense>
          )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* FLOATING CRISIS ALERT BUTTON (RIGHT MID-SCREEN, NO BLINKING, NO EXPANDING LAG, CRISP TACTILE) */}
      <div className="fixed right-3 sm:right-5 top-1/2 -translate-y-1/2 z-40 pointer-events-auto">
        <motion.button
          onClick={() => setIsCrisisDrawerOpen(true)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="group relative flex items-center justify-center w-12 h-12 rounded-full shadow-2xl border-2 border-[#b81434] bg-[#b81434] hover:bg-[#cf1a3d] text-[#FFFFFF] cursor-pointer transition-colors shadow-[0_4px_20px_rgba(184,20,52,0.45)]"
          aria-label="Open Crisis Feed"
        >
          <IconAlert className="w-5 h-5 text-[#FFFFFF] transition-colors" />

          {/* Instant CSS Tooltip (Zero JS layout reflow lag on mouseleave) */}
          <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-xl bg-[#1E1E1E] border border-[#3d000e] px-3 py-1.5 text-xs font-rounded font-bold text-[#FFFFFF] shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            Crisis Feed #{gameState.currentCrisis || 1}
          </span>
        </motion.button>
      </div>

      {/* SLIDING RIGHT SIDEBAR DRAWER WITH CRISIS DETAILS & STOCK IMPACTS (ZERO EMOJIS) */}
      <AnimatePresence>
        {isCrisisDrawerOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCrisisDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 cursor-pointer"
            />

            {/* Sliding Drawer Panel */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 240 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md surface-box z-50 p-6 overflow-y-auto shadow-2xl border-l-2 border-[#5E1B21] space-y-5"
            >
              <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-full bg-[#5E1B21] text-[#D9BB7C] flex items-center justify-center font-bold text-sm">
                    <IconBroadcast className="w-4 h-4 text-[#D9BB7C]" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg" style={{ color: 'var(--text-main)' }}>
                      Crisis Updates
                    </h3>
                    <span className="text-xs font-rounded font-semibold" style={{ color: 'var(--text-sub)' }}>
                      Round {gameState.currentRound} • Crisis #{gameState.currentCrisis} of {gameState.totalCrisesInRound}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsCrisisDrawerOpen(false)}
                  className="w-8 h-8 rounded-full capsule-card flex items-center justify-center font-bold text-sm hover:bg-[#5E1B21] hover:text-white cursor-pointer"
                  aria-label="Close Drawer"
                >
                  <IconClose className="w-4 h-4" />
                </button>
              </div>

              {/* Embed Crisis History & Impact Slider */}
              <CrisisHistorySlider gameState={gameState} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* POPUP ORDER EXECUTION WINDOW MODAL (Triggered when user clicks Trade on any stock row) */}
      <TradeModal
        isOpen={isTradeModalOpen}
        onClose={() => setIsTradeModalOpen(false)}
        asset={tradeModalAsset || selectedAsset}
        team={team}
        onPlaceTrade={placeTrade}
        isTradingOpen={isTradingOpen}
      />

      {/* SIGN OUT CONFIRMATION DIALOG MODAL */}
      <AnimatePresence>
        {isSignOutModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsSignOutModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="surface-box rounded-[28px] p-6 max-w-sm w-full space-y-4 border border-[var(--border-card)] shadow-2xl text-center"
            >
              <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center font-bold text-lg" style={{ backgroundColor: 'var(--btn-signout-bg)', color: 'var(--btn-signout-text)' }}>
                ?
              </div>

              <div className="space-y-1.5">
                <h3 className="font-display text-xl font-bold" style={{ color: 'var(--text-main)' }}>
                  Sign Out of Investomania?
                </h3>
                <p className="text-xs font-rounded font-semibold" style={{ color: 'var(--text-sub)' }}>
                  Are you sure you want to sign out? Your team portfolio and orders remain safely logged in the tournament engine.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <TactileButton
                  type="button"
                  onClick={() => setIsSignOutModalOpen(false)}
                  className="flex-1 rounded-full py-2.5 capsule-card text-xs font-rounded font-bold border border-[var(--border-soft)]"
                >
                  Cancel
                </TactileButton>

                <TactileButton
                  type="button"
                  onClick={() => {
                    setIsSignOutModalOpen(false);
                    logoutTeam();
                    navigate('/investomania/login');
                  }}
                  style={{
                    backgroundColor: 'var(--btn-signout-bg)',
                    color: 'var(--btn-signout-text)',
                    borderColor: 'var(--btn-signout-border)'
                  }}
                  className="flex-1 rounded-full py-2.5 text-xs font-rounded font-bold border cursor-pointer hover:brightness-105"
                >
                  Yes, Sign Out
                </TactileButton>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* MOBILE / TABLET NAVIGATION WINDOW MODAL */}
        {isMobileNavOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm"
            onClick={() => setIsMobileNavOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="surface-box w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col shadow-2xl rounded-[28px] border border-[var(--border-card)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Window Header */}
              <div className="p-4 sm:p-5 border-b border-[var(--border-soft)] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[var(--border-active)] text-white flex items-center justify-center">
                    <IconLayers className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base leading-tight" style={{ color: 'var(--text-main)' }}>
                      Floor Navigation
                    </h3>
                    <p className="text-xs font-rounded font-semibold" style={{ color: 'var(--text-sub)' }}>
                      Round {gameState.currentRound} Trading Desk
                    </p>
                  </div>
                </div>

                <TactileButton
                  onClick={() => setIsMobileNavOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center border border-[var(--border-soft)] hover:bg-[var(--row-hover)] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </TactileButton>
              </div>

              {/* Window Body: Vertical List of all tabs */}
              <div className="p-4 overflow-y-auto space-y-2 flex-1 no-scrollbar">
                {[
                  { id: 'market', label: 'Trading Floor', desc: 'Real-time order books & live execution', badge: assets.length },
                  { id: 'stocks', label: 'All Stocks', desc: 'PSX equities, FX pairs & sector overview', badge: gameState.allStocks?.length || assets.length },
                  { id: 'tax', label: isRound3 ? 'Offshore Tax' : 'Offshore Havens (R3)', desc: '10 World tax haven cities & smuggling routes', badge: 10 },
                  { id: 'crisis', label: 'Crisis News', desc: 'Market shocks, intelligence & breaking news', badge: allReleasedCrises.length },
                  { id: 'portfolio', label: 'My Portfolio', desc: 'Active asset holdings & profit trajectory', badge: activePositions },
                  { id: 'leaderboard', label: 'Rankings', desc: 'Global floor valuation standings', badge: gameState.leaderboard?.length || 0 },
                  { id: 'rules', label: 'Tournament Rules', desc: 'Scoring guidebook & transaction rules', badge: 'Guide' }
                ].map((item) => {
                  const active = currentTab === item.id;
                  return (
                    <TactileButton
                      key={item.id}
                      onClick={() => {
                        navigate(`/investomania/${item.id}`);
                        setIsMobileNavOpen(false);
                      }}
                      className={`w-full rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs font-rounded font-bold transition-all ${
                        active
                          ? 'border-2 border-[var(--border-active)] shadow-sm'
                          : 'border-2 border-transparent hover:bg-[var(--row-hover)] text-[var(--text-sub)] hover:text-[var(--text-main)]'
                      }`}
                      style={
                        active
                          ? {
                              backgroundColor: 'var(--tab-active-bg)',
                              color: 'var(--tab-active-text)'
                            }
                          : {
                              backgroundColor: 'var(--bg-inset)'
                            }
                      }
                    >
                      <div className="text-left">
                        <span className="text-sm font-bold block">{item.label}</span>
                        <span className="text-[11px] font-normal opacity-75 block">{item.desc}</span>
                      </div>
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-mono font-bold shrink-0"
                        style={
                          active
                            ? {
                                backgroundColor: 'var(--tab-badge-bg)',
                                color: 'var(--tab-badge-text)'
                              }
                            : {
                                backgroundColor: 'var(--card-bg)',
                                color: 'var(--text-sub)'
                              }
                        }
                      >
                        {item.badge}
                      </span>
                    </TactileButton>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
