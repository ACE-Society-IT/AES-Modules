import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext.jsx';
import { TactileButton } from '../components/ui/EasyComponents.jsx';
import { formatTimer } from './TradingPortal.jsx';
import { PodiumLeaderboardView } from '../components/leaderboard/PodiumLeaderboardView.jsx';

export default function ProjectorView() {
  const navigate = useNavigate();
  const { gameState, theme, toggleTheme } = useGame();

  if (!gameState) {
    return <div className="p-10 text-center font-display text-2xl">Connecting Auditorium Projector...</div>;
  }

  return (
    <div className="w-full min-h-screen p-4 sm:p-8 space-y-6">
      <div className="w-full max-w-7xl mx-auto space-y-6">
        {/* Big Stage Header */}
        <header className="surface-box rounded-full px-7 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src="/InvestomaniaLogo.png"
              alt="Investomania"
              className="w-12 h-12 rounded-2xl object-contain shadow-md shrink-0"
            />
            <div>
              <h1 className="font-display text-2xl sm:text-3xl leading-none" style={{ color: 'var(--text-main)' }}>
                Investomania Live Stage Leaderboard
              </h1>
              <span className="text-xs font-rounded font-bold" style={{ color: 'var(--text-sub)' }}>
                Round {gameState.currentRound} • Crisis #{gameState.currentCrisis} of {gameState.totalCrisesInRound}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <TactileButton
              onClick={toggleTheme}
              className="rounded-full px-4 py-2 text-xs font-rounded font-bold border transition-all cursor-pointer"
              style={{
                backgroundColor: 'var(--theme-btn-bg)',
                color: 'var(--theme-btn-text)',
                borderColor: 'var(--theme-btn-border)'
              }}
              title="Click to cycle themes"
            >
              {theme === 'aes'
                ? 'AES Stage'
                : theme === 'dark'
                ? 'Dark Maroon Stage'
                : 'White Stage'}
            </TactileButton>
          </div>
        </header>

        {/* Active Crisis Banner */}
        {gameState.activeCrisis && (
          <div className="rounded-[32px] bg-[#5E1B21] text-[#FAF7F5] p-6 flex flex-wrap items-center justify-between gap-4 shadow-lg">
            <div className="space-y-1 max-w-4xl">
              <span className="rounded-full bg-[#D9BB7C] text-[#1A080C] px-3 py-0.5 text-xs font-rounded font-bold">
                LIVE CRISIS #{gameState.currentCrisis} • {gameState.activeCrisis.cipherCode}
              </span>
              <h2 className="font-display text-2xl text-[#FAF7F5] pt-1">
                {gameState.activeCrisis.headline}
              </h2>
              <p className="text-xs text-[#FAF7F5]/85 font-rounded leading-relaxed">
                {gameState.activeCrisis.description}
              </p>
            </div>
            <div className="rounded-2xl capsule-inset p-4 text-center">
              <div className="text-xs font-rounded text-[#D9BB7C]">Floor Status</div>
              <div className="text-lg font-display font-bold">
                {gameState.phase === 'DECRYPTING' ? '3m Decrypt Window' : 'Trading Active'}
              </div>
            </div>
          </div>
        )}

        {/* Gamified 3D Podium & Rankings Table */}
        <PodiumLeaderboardView
          leaderboard={
            Array.isArray(gameState.leaderboard) && gameState.leaderboard.length > 0
              ? gameState.leaderboard
              : (gameState.teams ? (Array.isArray(gameState.teams) ? gameState.teams : Object.values(gameState.teams)) : [])
          }
          round={gameState.currentRound || 1}
          phase={gameState.phase}
          remainingTimeFormatted={formatTimer(gameState.remainingSeconds)}
          isProjector={true}
          isResultsRevealed={gameState.isResultsRevealed}
        />
      </div>
    </div>
  );
}
