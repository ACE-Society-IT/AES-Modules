"use client";

import React from "react";
import {
  Shield,
  BookOpen,
  Activity,
  Trophy,
  Coins,
  AlertTriangle,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import { SIM_CONFIG, formatValuation } from "../data/crisisData";

export default function EmpireHeader({
  activeTab = "background",
  setActiveTab = () => {},
  balance = 100000,
  currentWaveIndex = 0,
  totalWaves = 10,
  isSimulationComplete = false,
  onLogout,
  currentTeam = null,
  onBackToHub,
}) {
  const isNearFloor = balance < SIM_CONFIG.startingValuation;
  const isBreached = balance < SIM_CONFIG.startingValuation - 100;

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else if (typeof window !== "undefined") {
      const confirmed = window.confirm(
        "Are you sure you want to log out of Defend The Empire?"
      );
      if (confirmed) {
        window.location.reload();
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#5a0d1b] border-b border-[#89192c] shadow-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 flex items-center justify-between gap-4">
        {/* Left: Brand Identity + Active Delegation Subtitle */}
        <div className="flex items-center gap-3 shrink-0">
          {onBackToHub && (
            <button
              type="button"
              onClick={onBackToHub}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#89192c] bg-[#701020] text-[#f1ca7e] text-xs font-bold hover:bg-[#89192c] transition-all shadow-sm"
              title="Return to Alpha Ace Summit Hub"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Summit Hub</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setActiveTab("background")}
            className="group flex items-center gap-3 text-left focus:outline-none"
            title="Defend The Empire Home"
          >
            <div className="w-10 h-10 rounded-xl bg-[#701020] border border-[#f1ca7e]/60 flex items-center justify-center shadow-sm group-hover:border-[#f1ca7e] group-hover:bg-[#89192c] transition-all shrink-0">
              <Shield className="w-5 h-5 text-[#f1ca7e]" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-base sm:text-lg font-black tracking-wider uppercase text-[#f8eee1] whitespace-nowrap group-hover:text-[#f1ca7e] transition-colors leading-tight">
                DEFEND THE EMPIRE
              </span>
              {currentTeam && (
                <span className="text-xs font-mono font-semibold text-[#f1ca7e] tracking-wider uppercase whitespace-nowrap leading-none mt-1">
                  {currentTeam.team_name}
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Center: Sleek Compact Rectangular Tabs */}
        <nav
          aria-label="Portal Navigation"
          className="flex items-center p-1.5 rounded-xl bg-[#650d1c] border border-[#89192c] shadow-inner shrink-0 gap-1"
        >
          <button
            type="button"
            onClick={() => setActiveTab("background")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-150 ${
              activeTab === "background"
                ? "bg-[#f1ca7e] text-[#5a0d1b] font-bold shadow-sm"
                : "text-[#e8dcc6] hover:text-[#f8eee1] hover:bg-[#89192c]/50"
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>Company Background</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("simulation")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-150 ${
              activeTab === "simulation"
                ? "bg-[#f1ca7e] text-[#5a0d1b] font-bold shadow-sm"
                : "text-[#e8dcc6] hover:text-[#f8eee1] hover:bg-[#89192c]/50"
            }`}
          >
            <Activity className="w-4 h-4 shrink-0" />
            <span>Crisis Simulation</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("leaderboard")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-150 ${
              activeTab === "leaderboard"
                ? "bg-[#f1ca7e] text-[#5a0d1b] font-bold shadow-sm"
                : "text-[#e8dcc6] hover:text-[#f8eee1] hover:bg-[#89192c]/50"
            }`}
          >
            <Trophy className="w-4 h-4 shrink-0" />
            <span>Leaderboard</span>
          </button>
        </nav>

        {/* Right: Live Valuation & Log Out Button */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Treasury Indicator */}
          <button
            type="button"
            onClick={() => setActiveTab("simulation")}
            title="View War Room Balance"
            className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border transition-all whitespace-nowrap ${
              isBreached
                ? "bg-[#89192c] border-[#f1ca7e] text-[#f8eee1]"
                : isNearFloor
                  ? "bg-[#701020] border-[#f1ca7e]/60 text-[#f8eee1]"
                  : "bg-[#650d1c] border-[#89192c] hover:border-[#f1ca7e]/60 text-[#f8eee1]"
            }`}
          >
            {isNearFloor ? (
              <AlertTriangle className="w-4 h-4 text-[#f1ca7e] animate-bounce shrink-0" />
            ) : (
              <Coins className="w-4 h-4 text-[#f1ca7e] shrink-0" />
            )}
            <div className="text-left leading-none">
              <span className="block text-[10px] font-mono uppercase tracking-wider text-[#e8dcc6] leading-none mb-1">
                Valuation
              </span>
              <span className="text-sm font-mono font-bold text-[#f1ca7e] leading-none">
                {formatValuation(balance)}
              </span>
            </div>
          </button>

          {/* Log Out Button */}
          <button
            type="button"
            onClick={handleLogout}
            title="Log out of command session"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#701020] text-[#f8eee1] border border-[#89192c] hover:border-[#f1ca7e]/70 hover:bg-[#89192c] text-sm font-semibold whitespace-nowrap transition-all shadow-sm"
          >
            <LogOut className="w-4 h-4 text-[#f1ca7e] shrink-0" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
