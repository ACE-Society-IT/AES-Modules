"use client";

import React from "react";
import { Shield, BookOpen, Activity, Trophy } from "lucide-react";

export default function EmpireFooter({ activeTab, setActiveTab }) {
  return (
    <footer className="bg-[#5a0d1b] border-t border-[#89192c] py-10 px-6 md:px-12 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#701020] border border-[#f1ca7e]/40 flex items-center justify-center">
            <Shield className="w-5 h-5 text-[#f1ca7e]" />
          </div>
          <div>
            <span className="text-base font-bold text-[#f8eee1] tracking-tight block">
              Defend The Empire
            </span>
            <p className="text-xs text-[#e8dcc6]/80">
              Alpha Entrepreneurship Summit
            </p>
          </div>
        </div>

        <nav
          aria-label="Footer Navigation"
          className="flex flex-wrap items-center justify-center gap-2.5"
        >
          <button
            type="button"
            onClick={() => {
              setActiveTab("background");
              if (typeof window !== "undefined")
                window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              activeTab === "background"
                ? "bg-[#f1ca7e] text-[#5a0d1b] font-bold shadow-md shadow-[#5a0d1b]/40"
                : "bg-[#701020] text-[#e8dcc6] border border-[#89192c] hover:border-[#f1ca7e]/60 hover:text-[#f8eee1]"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Company Background</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("simulation");
              if (typeof window !== "undefined")
                window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              activeTab === "simulation"
                ? "bg-[#f1ca7e] text-[#5a0d1b] font-bold shadow-md shadow-[#5a0d1b]/40"
                : "bg-[#701020] text-[#e8dcc6] border border-[#89192c] hover:border-[#f1ca7e]/60 hover:text-[#f8eee1]"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Crisis Simulation</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("leaderboard");
              if (typeof window !== "undefined")
                window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              activeTab === "leaderboard"
                ? "bg-[#f1ca7e] text-[#5a0d1b] font-bold shadow-md shadow-[#5a0d1b]/40"
                : "bg-[#701020] text-[#e8dcc6] border border-[#89192c] hover:border-[#f1ca7e]/60 hover:text-[#f8eee1]"
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Leaderboard</span>
          </button>
        </nav>

        <p className="text-xs font-mono text-[#e8dcc6]/70 text-center md:text-right">
          DEFEND THE EMPIRE
        </p>
      </div>
    </footer>
  );
}
