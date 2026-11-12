import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TactileButton,
  MorphingPillTabs,
  MiniSparkline,
  AreaTrajectoryGraph,
  EasyStockModalChart
} from '../ui/EasyComponents.jsx';
import { IconClose } from '../ui/CustomIcons.jsx';

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

// Memoized Stock Card Component for 60fps scrolling on low-end hardware
const StockCard = React.memo(function StockCard({
  stock,
  isUp,
  userHoldings,
  idx,
  onOpenTrade
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.22,
        delay: Math.min(idx * 0.02, 0.3),
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      onClick={() => onOpenTrade(stock)}
      className="surface-box rounded-[28px] p-5 space-y-3.5 cursor-pointer border border-[var(--border-soft)] hover:border-[var(--border-active)] transition-all relative flex flex-col justify-between"
      style={{ contain: 'content' }}
    >
      {/* Header: Symbol + Category Tag */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-[var(--border-active)]/15 text-[var(--border-active)] border border-[var(--border-active)]/30 flex items-center justify-center font-rounded font-bold text-xs shadow-sm">
            {stock.symbol.slice(0, 4)}
          </div>
          <div>
            <h4 className="font-display font-semibold text-sm leading-tight" style={{ color: 'var(--text-main)' }}>
              {stock.name}
            </h4>
            <span className="text-[11px] font-rounded font-semibold" style={{ color: 'var(--text-sub)' }}>
              {stock.symbol} • {normalizeCategorySector(stock.sector)}
            </span>
          </div>
        </div>

        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-rounded font-bold flex items-center gap-1 ${
            stock.isHalted
              ? 'bg-[#B83A3A] text-white'
              : isUp
              ? 'bg-[#3B7A57]/15 text-[#2D6344]'
              : 'bg-[#B83A3A]/15 text-[#B83A3A]'
          }`}
        >
          {stock.isHalted ? (
            <span>HALTED</span>
          ) : (
            <>
              <span>{isUp ? '↑' : '↓'}</span>
              <span>{isUp ? '+' : ''}{Number(stock.changePercent || 0).toFixed(2)}%</span>
            </>
          )}
        </span>
      </div>

      {/* Brief Description */}
      <p className="text-[11px] font-rounded leading-relaxed line-clamp-2" style={{ color: 'var(--text-sub)' }}>
        {stock.description || `${stock.name} listed in the ${stock.sector} market.`}
      </p>

      {/* Dynamic Mini Graph Icon Area */}
      <div className="rounded-2xl capsule-inset p-3 flex items-center justify-between gap-2">
        <div className="w-full">
          <MiniSparkline series={stock.history || [stock.basePrice, stock.price]} isPositive={isUp} />
        </div>
        <span className="text-[10px] font-rounded font-bold opacity-75 shrink-0">
          Live
        </span>
      </div>

      {/* Price & Action Row */}
      <div className="flex items-center justify-between pt-1 border-t border-[var(--border-soft)] text-xs font-rounded">
        <div>
          <span className="text-[10px] block opacity-75" style={{ color: 'var(--text-sub)' }}>
            Market Price
          </span>
          <strong className="text-sm font-bold font-mono" style={{ color: 'var(--text-main)' }}>
            PKR {Number(stock.price).toFixed(2)}
          </strong>
        </div>

        <div className="flex items-center gap-2">
          {userHoldings > 0 && (
            <span className="rounded-full bg-[var(--bg-inset)] text-[var(--border-active)] border border-[var(--border-soft)] px-2.5 py-1 text-xs font-bold font-mono">
              {userHoldings}u
            </span>
          )}
          <span className="rounded-full px-4 py-2 font-extrabold text-xs shadow-md btn-primary flex items-center gap-1.5 transition-transform hover:scale-105">
            <span>Trade</span>
            <span className="text-[13px] leading-none">→</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
});

export default function StocksOverviewGrid({ gameState, team, onPlaceTrade }) {
  const assets = gameState?.assets || [];
  const isTradingOpen = gameState?.phase === 'TRADING' && !gameState?.isPaused;
  const isRound3 = Number(gameState?.currentRound) === 3;
  const isTradeExecutionAllowed = isTradingOpen;

  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStock, setSelectedStock] = useState(null);

  // Modal Buy/Sell State
  const [tradeSide, setTradeSide] = useState('BUY');
  const [tradeQty, setTradeQty] = useState(10);
  const [tradeFeedback, setTradeFeedback] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // Dynamic Concise Category Filter: Fuel & Power merged, Arrows on categories, NO arrow on ALL in top area
  const categoryFilters = useMemo(() => {
    const list = [
      {
        id: 'ALL',
        label: 'All Instruments',
        count: assets.length,
        hasArrow: false // No arrow in the top "All Instruments" category
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

  const filteredAssets = assets.filter((a) => {
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

  const handleOpenTradeModal = (stock) => {
    setSelectedStock(stock);
    setTradeSide('BUY');
    setTradeQty(10);
    setTradeFeedback(null);
  };

  const handleExecuteTrade = async (e) => {
    e.preventDefault();
    if (!selectedStock || isExecuting) return;

    setTradeFeedback(null);
    setIsExecuting(true);
    try {
      const res = await onPlaceTrade({
        symbol: selectedStock.symbol,
        side: tradeSide,
        quantity: Number(tradeQty)
      });
      setTradeFeedback({
        type: 'success',
        text: `Order executed! ${tradeSide} ${tradeQty} ${selectedStock.symbol} @ PKR ${selectedStock.price.toFixed(2)} (Total: PKR ${res.trade.amount.toLocaleString()})`
      });
    } catch (err) {
      setTradeFeedback({
        type: 'error',
        text: err.message || 'Trade execution rejected'
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const getHeldQty = (t, sym) => {
    if (!t?.holdings || !sym || !t.holdings[sym]) return 0;
    const pos = t.holdings[sym];
    return typeof pos === 'object' ? Number(pos.quantity || 0) : Number(pos || 0);
  };

  const heldQty = selectedStock ? getHeldQty(team, selectedStock.symbol) : 0;
  const maxAffordable = selectedStock
    ? Math.max(0, Math.floor(Number(team?.cash || 0) / Number(selectedStock.price || 1)))
    : 0;
  const totalOrderValue = selectedStock
    ? Number((selectedStock.price * Number(tradeQty || 0)).toFixed(2))
    : 0;

  return (
    <div className="w-full space-y-6">
      {/* Top Filter and Search Bar */}
      <div className="surface-box rounded-[32px] p-6 space-y-4 border border-[var(--border-soft)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl sm:text-2xl" style={{ color: 'var(--text-main)' }}>
              Stocks & Assets Overview
            </h2>
            <p className="text-xs font-rounded font-semibold" style={{ color: 'var(--text-sub)' }}>
              Live dynamic sparklines for all market instruments. Click any card to inspect business fundamentals and trade.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[var(--border-active)]/15 text-[var(--border-active)] border border-[var(--border-active)]/30 px-4 py-1.5 text-xs font-rounded font-bold">
              {filteredAssets.length} Instruments Listed
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-2 border-t border-[var(--border-soft)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[var(--border-active)]">
              Sector & Category Performance
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search symbol, company, or sector..."
              className="capsule-card rounded-full px-5 py-2 text-xs font-rounded font-semibold focus:outline-none w-full sm:w-64 border border-[var(--border-soft)]"
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
                          ? 'bg-[#2E7D52]/20 text-[#2E7D52]'
                          : 'bg-[#C0392B]/20 text-[#C0392B]'
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
      </div>

      {/* DYNAMIC STOCKS GRID - FLUID & RESPONSIVE ACROSS ALL SCREEN SIZES */}
      {filteredAssets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3.5 sm:gap-4">
          {filteredAssets.map((stock, idx) => {
            const isUp = (stock.changePercent || 0) >= 0;
            const pos = team?.holdings?.[stock.symbol];
            const userHoldings = typeof pos === 'object' ? Number(pos?.quantity || 0) : Number(pos || 0);

            return (
              <StockCard
                key={stock.symbol}
                stock={stock}
                isUp={isUp}
                userHoldings={userHoldings}
                idx={idx}
                onOpenTrade={handleOpenTradeModal}
              />
            );
          })}
        </div>
      ) : (
        <div className="surface-box rounded-[32px] p-12 text-center space-y-2 border border-[var(--border-soft)]">
          <div className="font-display text-lg" style={{ color: 'var(--text-main)' }}>
            No Instruments Found
          </div>
          <p className="text-xs font-rounded font-semibold" style={{ color: 'var(--text-sub)' }}>
            No stocks matching this filter or search query are active.
          </p>
        </div>
      )}

      {/* POPUP TRADE MODAL WINDOW (OPENS ON CLICK) */}
      <AnimatePresence>
        {selectedStock && (
          <motion.div
            key="trade-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm"
          >
            <motion.div
              key={selectedStock.symbol}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-lg surface-box rounded-[32px] border border-[var(--border-soft)] shadow-2xl relative max-h-[90vh] flex flex-col overflow-hidden"
            >
                {/* Fixed Modal Header */}
                <div className="flex items-center justify-between p-5 pb-4 border-b border-[var(--border-soft)] shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-[#881B30] text-white flex items-center justify-center font-rounded font-bold text-sm shadow-sm shrink-0">
                      {selectedStock.symbol.slice(0, 4)}
                    </div>
                    <div>
                      <h3 className="font-display text-lg sm:text-xl font-bold leading-tight" style={{ color: 'var(--text-main)' }}>
                        {selectedStock.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="rounded-full bg-[var(--bg-inset)] text-[var(--border-active)] border border-[var(--border-soft)] px-2.5 py-0.5 text-xs font-rounded font-bold">
                          {selectedStock.symbol}
                        </span>
                        <span className="text-xs font-rounded font-semibold text-[var(--text-sub)]">
                          {selectedStock.category} • {normalizeCategorySector(selectedStock.sector)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedStock(null)}
                    className="w-8 h-8 rounded-full capsule-card flex items-center justify-center text-sm font-bold cursor-pointer hover:bg-[#b81434] hover:text-white transition-colors"
                    aria-label="Close"
                  >
                    <IconClose className="w-4 h-4" />
                  </button>
                </div>

                {/* Scrollable Body - Scrollbar completely inside the UI padding away from rounded corners */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 modal-scrollbar pr-3 mr-1">
                  {/* Feedback Alert */}
                  {tradeFeedback && (
                    <div
                      className={`rounded-2xl p-3 text-xs font-rounded font-semibold text-center border ${
                        tradeFeedback.type === 'success'
                          ? 'bg-[#3B7A57]/15 border-[#3B7A57]/40 text-[#2D6344]'
                          : 'bg-[#B83A3A]/15 border-[#B83A3A]/40 text-[#B83A3A]'
                      }`}
                    >
                      {tradeFeedback.text}
                    </div>
                  )}

                  {/* Stock Description & Fundamentals */}
                  <div className="rounded-2xl capsule-card p-4 space-y-2 text-xs font-rounded">
                    <span className="font-bold block" style={{ color: 'var(--text-main)' }}>
                      Instrument Overview & Profile
                    </span>
                    <p className="leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                      {selectedStock.description ||
                        `${selectedStock.name} (${selectedStock.symbol}) is an active security on the Investomania trading floor in the ${selectedStock.sector} sector.`}
                    </p>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--border-soft)] text-center">
                      <div>
                        <span className="opacity-75 block text-[10px]">Base Price</span>
                        <strong className="text-xs font-bold font-mono">PKR {Number(selectedStock.basePrice).toFixed(2)}</strong>
                      </div>
                      <div>
                        <span className="opacity-75 block text-[10px]">Previous Price</span>
                        <strong className="text-xs font-bold font-mono">PKR {Number(selectedStock.previousPrice || selectedStock.basePrice).toFixed(2)}</strong>
                      </div>
                      <div>
                        <span className="opacity-75 block text-[10px]">Units Owned</span>
                        <strong className="text-xs font-bold text-[var(--border-active)]">{heldQty} units</strong>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Trajectory Mini Graph */}
                  <div className="rounded-2xl capsule-inset p-3.5 space-y-1.5 min-w-0">
                    <EasyStockModalChart stock={selectedStock} />
                  </div>

                  {/* Buy / Sell Execution Ticket Form */}
                  <form onSubmit={handleExecuteTrade} className="space-y-4">
                    {/* BUY / SELL Switch */}
                    <div className="capsule-inset p-1.5 rounded-full grid grid-cols-2 gap-1">
                      <TactileButton
                        type="button"
                        onClick={() => setTradeSide('BUY')}
                        className={`rounded-full py-2 text-xs font-rounded font-bold ${
                          tradeSide === 'BUY' ? 'bg-[#3B7A57] text-white shadow-xs' : 'opacity-70'
                        }`}
                      >
                        BUY {selectedStock.symbol}
                      </TactileButton>
                      <TactileButton
                        type="button"
                        onClick={() => setTradeSide('SELL')}
                        className={`rounded-full py-2 text-xs font-rounded font-bold ${
                          tradeSide === 'SELL' ? 'bg-[#B83A3A] text-white shadow-xs' : 'opacity-70'
                        }`}
                      >
                        SELL {selectedStock.symbol}
                      </TactileButton>
                    </div>

                    {/* Quantity Input */}
                    <div className="capsule-card rounded-2xl p-4 space-y-2.5">
                      <div className="flex justify-between text-xs font-rounded">
                        <label className="font-bold" style={{ color: 'var(--text-main)' }}>
                          Quantity of Units to {tradeSide}
                        </label>
                        <span style={{ color: 'var(--text-sub)' }}>
                          {tradeSide === 'BUY' ? (
                            <>Available: <strong className="font-mono" style={{ color: 'var(--text-main)' }}>PKR {Number(team?.cash || 0).toLocaleString()}</strong></>
                          ) : (
                            <>Holdings: <strong className="font-mono text-[var(--border-active)] font-bold">{heldQty} units</strong></>
                          )}
                        </span>
                      </div>

                      <input
                        type="number"
                        min="1"
                        max={tradeSide === 'BUY' ? maxAffordable : heldQty || 1}
                        step="1"
                        value={tradeQty}
                        onChange={(e) => setTradeQty(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full capsule-inset rounded-xl p-2.5 font-mono font-bold text-xl text-center focus:outline-none"
                        style={{ color: 'var(--text-main)' }}
                      />

                      {/* Preset Chips + BUY MAX / SELL ALL buttons in 5-col grid */}
                      <div className="grid grid-cols-5 gap-1.5 pt-1">
                        {[10, 25, 50, 100].map((preset) => (
                          <button
                            type="button"
                            key={preset}
                            onClick={() => setTradeQty(preset)}
                            className="rounded-full py-1.5 text-xs font-mono font-bold capsule-card hover:bg-[var(--border-active)] hover:text-white cursor-pointer transition-colors text-center"
                          >
                            {preset}u
                          </button>
                        ))}
                        {tradeSide === 'BUY' ? (
                          <button
                            type="button"
                            onClick={() => setTradeQty(Math.max(1, maxAffordable))}
                            className="rounded-full py-1.5 px-1 text-xs font-rounded font-bold bg-[#2E7D52] hover:bg-[#246240] text-white shadow-xs cursor-pointer transition-colors text-center truncate"
                            title={`Buy Maximum (${maxAffordable} units)`}
                          >
                            MAX ({maxAffordable})
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setTradeQty(Math.max(1, heldQty))}
                            className="rounded-full py-1.5 px-1 text-xs font-rounded font-bold bg-[#C0392B] hover:bg-[#962d22] text-white shadow-xs cursor-pointer transition-colors text-center truncate"
                            title={`Sell All Holdings (${heldQty} units)`}
                          >
                            ALL ({heldQty})
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="rounded-2xl capsule-inset p-3.5 space-y-1 text-xs font-rounded">
                      <div className="flex justify-between">
                        <span style={{ color: 'var(--text-sub)' }}>Unit Execution Price</span>
                        <span className="font-bold font-mono">PKR {Number(selectedStock.price).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold pt-1 border-t border-[var(--border-soft)]">
                        <span>Total Order Cost</span>
                        <span className="text-[#D9BB7C] font-mono">PKR {totalOrderValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span>
                      </div>
                    </div>

                    {/* Submit Action */}
                    <div className="flex items-center gap-3">
                      <TactileButton
                        type="button"
                        onClick={() => setSelectedStock(null)}
                        className="w-1/3 rounded-full py-3 capsule-card text-xs font-rounded font-bold"
                      >
                        Cancel
                      </TactileButton>

                      <TactileButton
                        type="submit"
                        disabled={!isTradeExecutionAllowed || isExecuting}
                        className="w-2/3 rounded-full py-3 btn-primary font-display font-semibold text-sm shadow-md"
                      >
                        {isExecuting
                          ? 'Executing Order...'
                          : !isTradingOpen
                          ? 'Floor Closed (Decrypting Crisis)'
                          : `Confirm ${tradeSide} ${tradeQty} ${selectedStock.symbol}`}
                      </TactileButton>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
}

