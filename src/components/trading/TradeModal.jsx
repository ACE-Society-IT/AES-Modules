import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TactileButton } from '../ui/EasyComponents.jsx';
import { IconClose, IconTrade, IconCheck, IconAlert } from '../ui/CustomIcons.jsx';

export default function TradeModal({ isOpen, onClose, asset, team, onPlaceTrade, isTradingOpen, isRound3 = false }) {
  const [tradeSide, setTradeSide] = useState('BUY');
  const [tradeQty, setTradeQty] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Reset state when asset changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setTradeQty(10);
      setFeedback(null);
    }
  }, [isOpen, asset?.symbol]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !asset) return null;

  const currentPrice = Number(asset.price || asset.basePrice || 100);
  const cash = Number(team?.cash || 0);
  const rawHolding = team?.holdings?.[asset.symbol] ?? team?.holdings?.[asset.symbol?.toUpperCase()];
  const currentHolding = typeof rawHolding === 'object'
    ? Number(rawHolding?.quantity || 0)
    : Number(rawHolding || 0);
  const avgBuyPrice = typeof rawHolding === 'object' ? Number(rawHolding?.averageBuyPrice || 0) : 0;

  const totalCost = Number((currentPrice * tradeQty).toFixed(2));
  const maxBuyShares = Math.max(0, Math.floor(cash / currentPrice));
  const maxSellShares = Math.max(0, currentHolding);

  const handlePreset = (pct) => {
    if (tradeSide === 'BUY') {
      const shares = maxBuyShares > 0 ? Math.max(1, Math.floor(maxBuyShares * pct)) : 0;
      setTradeQty(shares);
    } else {
      const shares = maxSellShares > 0 ? Math.max(1, Math.floor(maxSellShares * pct)) : 0;
      setTradeQty(shares);
    }
  };

  const isHalted = asset.isHalted || asset.isCircuitBroken;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isHalted) {
      setFeedback({ type: 'error', text: `Trading on ${asset.symbol} is halted by Exchange Circuit Breaker.` });
      return;
    }
    if (isRound3) {
      setFeedback({ type: 'error', text: 'Trading floor is closed in Round 3. All trades are halted; smuggle your money through Offshore Havens.' });
      return;
    }
    if (!isTradingOpen) {
      setFeedback({ type: 'error', text: 'Trading floor is currently closed or in decrypt phase.' });
      return;
    }
    const qty = Number(tradeQty);
    if (!qty || qty <= 0) {
      setFeedback({ type: 'error', text: 'Please enter a valid share quantity greater than 0.' });
      return;
    }
    if (tradeSide === 'BUY' && totalCost > cash) {
      setFeedback({
        type: 'error',
        text: `Insufficient cash. Order requires PKR ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}, you have PKR ${cash.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}.`
      });
      return;
    }
    if (tradeSide === 'SELL' && qty > currentHolding) {
      setFeedback({
        type: 'error',
        text: `Insufficient shares. You hold ${currentHolding} ${asset.symbol}.`
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await onPlaceTrade({
        symbol: asset.symbol,
        side: tradeSide,
        quantity: qty
      });

      if (res?.success || res?.trade || res?.team || res?.ok) {
        setFeedback({
          type: 'success',
          text: `Executed ${tradeSide} for ${qty} ${asset.symbol} @ PKR ${currentPrice.toFixed(2)}`
        });
        setTimeout(() => {
          onClose();
        }, 1100);
      } else {
        setFeedback({ type: 'error', text: res?.error || 'Order rejected by trading engine.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Execution failure.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.93, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.93, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="w-full max-w-lg surface-box rounded-[32px] border border-[var(--border-soft)] shadow-2xl relative max-h-[90vh] flex flex-col overflow-hidden"
        >
          {/* Fixed Modal Header */}
          <div className="flex items-center justify-between border-b border-[var(--border-soft)] p-6 pb-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#881B30] text-white flex items-center justify-center shadow-sm shrink-0">
                <IconTrade className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-display text-lg sm:text-xl font-bold leading-tight" style={{ color: 'var(--text-main)' }}>
                  Order Ticket • {asset.symbol}
                </h3>
                <span className="text-xs font-rounded font-semibold text-[var(--text-sub)]">
                  {asset.name} ({asset.category} • {asset.sector})
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full capsule-card flex items-center justify-center text-[var(--text-main)] hover:bg-[#b81434] hover:text-[#FFF8F6] transition-colors cursor-pointer border border-[var(--border-soft)]"
              aria-label="Close"
            >
              <IconClose className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Body - Scrollbar completely inside the UI padding */}
          <div className="flex-1 overflow-y-auto p-6 pr-4 mr-1 space-y-4 modal-scrollbar">
            {/* Circuit Breaker Halt Warning Banner */}
            {isHalted && (
              <div className="rounded-xl p-3 text-xs font-rounded font-bold text-center flex items-center justify-center gap-2 bg-[#B83A3A]/20 border border-[#B83A3A]/50 text-[#B83A3A]">
                <IconAlert className="w-4 h-4 text-[#B83A3A]" />
                <span>EXCHANGE CIRCUIT BREAKER: Trading temporarily halted on {asset.symbol}.</span>
              </div>
            )}

            {/* Feedback Banner */}
            {feedback && (
              <div
                className={`rounded-xl p-3 text-xs font-rounded font-semibold text-center flex items-center justify-center gap-2 border ${
                  feedback.type === 'success'
                    ? 'bg-[#3B7A57]/15 border-[#3B7A57]/40 text-[#3B7A57]'
                    : 'bg-[#B83A3A]/15 border-[#B83A3A]/40 text-[#B83A3A]'
                }`}
              >
                {feedback.type === 'success' ? (
                  <IconCheck className="w-4 h-4 text-[#3B7A57]" />
                ) : (
                  <IconAlert className="w-4 h-4 text-[#B83A3A]" />
                )}
                <span>{feedback.text}</span>
              </div>
            )}

            {/* Instrument Stats Strip */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="capsule-card rounded-xl p-2.5 text-center">
                <span className="text-[10px] font-mono uppercase block text-[var(--text-sub)]">Market Price</span>
                <span className="font-mono tabular-nums text-sm sm:text-base font-bold text-[var(--text-main)]">
                  PKR {currentPrice.toFixed(2)}
                </span>
              </div>
              <div className="capsule-card rounded-xl p-2.5 text-center">
                <span className="text-[10px] font-mono uppercase block text-[var(--text-sub)]">Available Cash</span>
                <span className="font-mono tabular-nums text-sm sm:text-base font-bold text-[#3B7A57]">
                  PKR {cash.toLocaleString()}
                </span>
              </div>
              <div className="capsule-card rounded-xl p-2.5 text-center">
                <span className="text-[10px] font-mono uppercase block text-[var(--text-sub)]">Your Holdings</span>
                <span className="font-mono tabular-nums text-sm sm:text-base font-bold text-[var(--border-active)]">
                  {currentHolding} shares
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* BUY / SELL Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 capsule-inset rounded-2xl">
                <button
                  type="button"
                  onClick={() => setTradeSide('BUY')}
                  className={`rounded-xl py-2 font-rounded font-bold text-xs transition-all cursor-pointer ${
                    tradeSide === 'BUY'
                      ? 'bg-[#3B7A57] text-[#FAF7F5] shadow-sm'
                      : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'
                  }`}
                >
                  BUY SHARES
                </button>
                <button
                  type="button"
                  onClick={() => setTradeSide('SELL')}
                  className={`rounded-xl py-2 font-rounded font-bold text-xs transition-all cursor-pointer ${
                    tradeSide === 'SELL'
                      ? 'bg-[#B83A3A] text-[#FAF7F5] shadow-sm'
                      : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'
                  }`}
                >
                  SELL SHARES
                </button>
              </div>

              {/* Quantity Input + Steppers */}
              <div className="capsule-card rounded-2xl p-4 space-y-2.5">
                <div className="flex justify-between text-xs font-rounded">
                  <span className="font-bold text-[var(--text-main)]">Share Quantity</span>
                  <span className="text-[var(--text-sub)]">
                    {tradeSide === 'BUY' ? `Max Buy: ${maxBuyShares} shares` : `Holdings: ${maxSellShares} shares`}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTradeQty((prev) => Math.max(1, (Number(prev) || 1) - 10))}
                    className="w-10 h-10 rounded-xl capsule-inset flex items-center justify-center font-bold text-base hover:bg-[#b81434] hover:text-[#FFF8F6] cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={tradeSide === 'BUY' ? Math.max(1, maxBuyShares) : Math.max(1, maxSellShares)}
                    value={tradeQty}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setTradeQty(isNaN(val) ? '' : Math.max(0, val));
                    }}
                    className="w-full bg-transparent font-mono tabular-nums text-center text-2xl font-bold text-[var(--text-main)] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setTradeQty((prev) => Math.max(1, (Number(prev) || 0) + 10))}
                    className="w-10 h-10 rounded-xl capsule-inset flex items-center justify-center font-bold text-base hover:bg-[#b81434] hover:text-[#FFF8F6] cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Presets and BUY MAX / SELL ALL buttons */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {[
                    { label: '25%', pct: 0.25 },
                    { label: '50%', pct: 0.50 },
                    { label: '75%', pct: 0.75 }
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => handlePreset(p.pct)}
                      className="flex-1 rounded-full py-1 text-xs font-mono font-bold capsule-card hover:bg-[var(--border-active)] hover:text-white cursor-pointer transition-colors"
                    >
                      {p.label}
                    </button>
                  ))}
                  {tradeSide === 'BUY' ? (
                    <button
                      type="button"
                      onClick={() => setTradeQty(maxBuyShares)}
                      className="rounded-full py-1 px-3 text-xs font-rounded font-bold bg-[#3B7A57] hover:bg-[#2D6344] text-white shadow-xs cursor-pointer transition-colors shrink-0"
                    >
                      BUY MAX ({maxBuyShares}u)
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setTradeQty(maxSellShares)}
                      className="rounded-full py-1 px-3 text-xs font-rounded font-bold bg-[#B83A3A] hover:bg-[#8E2833] text-white shadow-xs cursor-pointer transition-colors shrink-0"
                    >
                      SELL ALL ({maxSellShares}u)
                    </button>
                  )}
                </div>
              </div>

              {/* Total Order Breakdown */}
              <div className="rounded-xl capsule-card p-3.5 space-y-1.5 text-xs font-rounded border border-[var(--border-soft)]">
                <div className="flex justify-between">
                  <span className="text-[var(--text-sub)]">Total Order Value</span>
                  <span className="font-mono tabular-nums font-bold text-sm text-[var(--text-main)]">
                    PKR {totalCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-[var(--text-sub)]">
                  <span>Estimated Cash After Order</span>
                  <span className="font-mono tabular-nums font-semibold">
                    PKR {(tradeSide === 'BUY' ? Math.max(0, cash - totalCost) : cash + totalCost).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <TactileButton
                type="submit"
                disabled={!isTradingOpen || isSubmitting || isRound3}
                className={`w-full rounded-full py-3.5 font-display font-semibold text-sm shadow-md flex items-center justify-center gap-2 ${
                  isRound3
                    ? 'bg-neutral-700 opacity-60 cursor-not-allowed text-[#FAF7F5]'
                    : tradeSide === 'BUY'
                    ? 'bg-[#3B7A57] hover:bg-[#2D6344] text-[#FAF7F5]'
                    : 'bg-[#B83A3A] hover:bg-[#8E2833] text-[#FAF7F5]'
                }`}
              >
                {isSubmitting
                  ? 'Routing Order...'
                  : isRound3
                  ? 'Trading Floor Closed in Round 3'
                  : !isTradingOpen
                  ? 'Trading Floor Closed'
                  : `Confirm ${tradeSide} ${tradeQty} ${asset.symbol}`}
              </TactileButton>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
