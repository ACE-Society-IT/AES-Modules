"use client";

import { useState, useEffect } from "react";
import {
  Trophy,
  Medal,
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  Building2,
  Sparkles,
} from "lucide-react";
import { LEADERBOARD_TEAMS } from "../../data/leaderboardData";
import { formatValuation, formatDelta } from "../../data/crisisData";
import { supabase } from "../../lib/supabaseClient";

export default function LeaderboardView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // 'all' | 'positive' | 'negative'
  const [teams, setTeams] = useState(LEADERBOARD_TEAMS);

  useEffect(() => {
    let isMounted = true;

    async function fetchLeaderboard() {
      try {
        const { data, error } = await supabase
          .from("dte_leaderboard")
          .select("*")
          .order("rank", { ascending: true });

        if (error) {
          console.warn("Could not fetch live leaderboard from Supabase:", error.message);
          return;
        }

        if (data && data.length > 0 && isMounted) {
          const mapped = data.map((t, idx) => ({
            rank: t.rank || idx + 1,
            teamId: t.team_id || `team-${idx + 1}`,
            teamName: t.team_name,
            schoolOrOrg: t.playstyle || "Sovereign Delegation",
            valuation: Number(t.current_valuation) || 100000,
            netDelta: Number(t.net_delta) || 0,
            crisesResolved: t.crises_resolved || 0,
            strategyTag: t.playstyle || "Balanced Hedger",
            lastOptionLocked: t.last_option_locked,
          }));
          setTeams(mapped);
        }
      } catch (err) {
        console.warn("Error fetching leaderboard:", err);
      }
    }

    fetchLeaderboard();

    // Subscribe to live leaderboard changes
    const channel = supabase
      .channel("dte-leaderboard-view")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "dte_leaderboard" },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const fallbackTeam = {
    rank: 0,
    teamId: "standby",
    teamName: "Standby Delegation",
    schoolOrOrg: "Sovereign Command",
    valuation: 100000,
    netDelta: 0,
  };

  const top3 = teams.slice(0, 3);
  const rank1 = top3[0] || fallbackTeam;
  const rank2 = top3[1] || fallbackTeam;
  const rank3 = top3[2] || fallbackTeam;

  // Table displays delegations ranked 4 onwards (top 3 are featured on the podium)
  const remainingTeams = teams.slice(3);

  const filteredTeams = remainingTeams.filter((team) => {
    const matchesSearch =
      (team.teamName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (team.schoolOrOrg || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (team.teamId || "").toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterType === "positive") return team.netDelta > 0;
    if (filterType === "negative") return team.netDelta < 0;
    return true;
  });

  return (
    <div className="bg-[radial-gradient(circle_at_center,#89192c_0%,#701020_45%,#5a0d1b_100%)] py-10 md:py-14 px-4 md:px-8 border-b border-[#89192c] min-h-[85vh]">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Top 3 Interactive Podium */}
        <section
          aria-label="Top 3 Delegations Podium"
          className="relative pt-8 pb-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-4xl mx-auto">
            {/* Rank 2 (Silver) */}
            <div className="order-2 md:order-1 flex flex-col items-center">
              <div className="relative group w-full bg-[#650d1c]/90 border border-slate-300/40 rounded-3xl p-6 text-center shadow-xl shadow-[#5a0d1b]/60 hover:border-slate-200 transition-all duration-300 hover:-translate-y-1">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-200 via-slate-300 to-zinc-400 text-[#5a0d1b] font-black text-xl flex items-center justify-center shadow-lg border-2 border-white/60">
                  2
                </div>
                <div className="mt-4 flex flex-col items-center">
                  <span className="text-xs font-mono uppercase tracking-widest text-slate-300 font-bold flex items-center gap-1">
                    <Medal className="w-3.5 h-3.5" /> Silver Position
                  </span>
                  <h3 className="text-lg md:text-xl font-black text-[#f8eee1] mt-1 line-clamp-1">
                    {rank2.teamName}
                  </h3>

                  <div className="w-full bg-[#5a0d1b]/80 rounded-2xl py-3 px-4 border border-slate-300/20">
                    <span className="text-[10px] font-mono text-[#e8dcc6] uppercase tracking-wider block">
                      Valuation
                    </span>
                    <span className="text-2xl font-black font-mono text-slate-200">
                      {formatValuation(rank2.valuation)}
                    </span>
                    <div className="text-xs font-bold text-emerald-400 mt-1 flex items-center justify-center gap-1 font-mono">
                      <TrendingUp className="w-3.5 h-3.5" />{" "}
                      {formatDelta(rank2.netDelta)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full hidden md:block h-16 bg-gradient-to-t from-slate-400/20 to-[#650d1c]/90 rounded-b-2xl border-x border-b border-slate-300/30 text-center pt-3 text-slate-300/80 font-mono text-xs font-bold tracking-widest uppercase">
                Rank II
              </div>
            </div>

            {/* Rank 1 (Gold - Center & Elevated) */}
            <div className="order-1 md:order-2 flex flex-col items-center">
              <div className="relative group w-full bg-gradient-to-b from-[#7c1426] to-[#5a0d1b] border-2 border-[#f1ca7e] rounded-3xl p-7 text-center shadow-2xl shadow-[#f1ca7e]/20 hover:scale-[1.02] transition-all duration-300">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-300 via-yellow-400 to-[#f1ca7e] text-[#5a0d1b] font-black text-2xl flex items-center justify-center shadow-xl border-2 border-white ring-4 ring-[#f1ca7e]/30 ">
                  <Trophy className="w-8 h-8 text-[#5a0d1b]" />
                </div>
                <div className="mt-6 flex flex-col items-center">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#f1ca7e] font-black flex items-center gap-1.5 ">
                    <Sparkles className="w-3.5 h-3.5" /> Crown Leader
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-[#f8eee1] mt-2 line-clamp-1">
                    {rank1.teamName}
                  </h3>

                  <div className="w-full bg-[#4a0a16] rounded-2xl py-3.5 px-4 border border-[#f1ca7e]/40 shadow-inner">
                    <span className="text-[10px] font-mono text-[#e8dcc6] uppercase tracking-wider block">
                      Valuation
                    </span>
                    <span className="text-3xl font-black font-mono text-[#f1ca7e]">
                      {formatValuation(rank1.valuation)}
                    </span>
                    <div className="text-sm font-black text-emerald-300 mt-1 flex items-center justify-center gap-1 font-mono">
                      <TrendingUp className="w-4 h-4" />{" "}
                      {formatDelta(rank1.netDelta)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full hidden md:block h-24 bg-gradient-to-t from-[#f1ca7e]/25 to-[#650d1c] rounded-b-2xl border-x border-b border-[#f1ca7e]/40 text-center pt-4 text-[#f1ca7e] font-mono text-sm font-black tracking-widest uppercase">
                Rank I
              </div>
            </div>

            {/* Rank 3 (Bronze) */}
            <div className="order-3 md:order-3 flex flex-col items-center">
              <div className="relative group w-full bg-[#650d1c]/90 border border-amber-700/50 rounded-3xl p-6 text-center shadow-xl shadow-[#5a0d1b]/60 hover:border-amber-600 transition-all duration-300 hover:-translate-y-1">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-600 via-amber-700 to-orange-800 text-[#f8eee1] font-black text-xl flex items-center justify-center shadow-lg border-2 border-white/40">
                  3
                </div>
                <div className="mt-4 flex flex-col items-center">
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold flex items-center gap-1">
                    <Medal className="w-3.5 h-3.5" /> Bronze Position
                  </span>
                  <h3 className="text-lg md:text-xl font-black text-[#f8eee1] mt-1 line-clamp-1">
                    {rank3.teamName}
                  </h3>

                  <div className="w-full bg-[#5a0d1b]/80 rounded-2xl py-3 px-4 border border-amber-600/30">
                    <span className="text-[10px] font-mono text-[#e8dcc6] uppercase tracking-wider block">
                      Valuation
                    </span>
                    <span className="text-2xl font-black font-mono text-amber-200">
                      {formatValuation(rank3.valuation)}
                    </span>
                    <div className="text-xs font-bold text-emerald-400 mt-1 flex items-center justify-center gap-1 font-mono">
                      <TrendingUp className="w-3.5 h-3.5" />{" "}
                      {formatDelta(rank3.netDelta)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full hidden md:block h-12 bg-gradient-to-t from-amber-800/30 to-[#650d1c]/90 rounded-b-2xl border-x border-b border-amber-700/40 text-center pt-2 text-amber-400/80 font-mono text-xs font-bold tracking-widest uppercase">
                Rank III
              </div>
            </div>
          </div>
        </section>

        {/* Delegations Rankings Table (Ranks 4-20) */}
        <section className="bg-[#650d1c]/60 border border-[#89192c] rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#89192c] bg-[#5a0d1b]/90 text-[11px] font-mono uppercase tracking-wider text-[#e8dcc6]">
                  <th className="py-4 px-6 text-center w-20">Rank</th>
                  <th className="py-4 px-6">Delegation / Team</th>
                  <th className="py-4 px-6 text-right">Valuation</th>
                  <th className="py-4 px-6 text-right">Impact Delta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#89192c]/40 text-sm">
                {filteredTeams.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-8 text-center text-[#e8dcc6]/60 text-sm font-mono"
                    >
                      No delegations match your search query.
                    </td>
                  </tr>
                ) : (
                  filteredTeams.map((team) => {
                    const isPositive = team.netDelta > 0;
                    const isNegative = team.netDelta < 0;

                    return (
                      <tr
                        key={team.teamId}
                        className="hover:bg-[#89192c]/40 transition-colors"
                      >
                        {/* Rank Indicator */}
                        <td className="py-4 px-6 text-center font-mono">
                          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-[#5a0d1b] border border-[#89192c] text-[#e8dcc6] font-semibold text-xs">
                            #{team.rank}
                          </span>
                        </td>

                        {/* Team & Org Info */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0 bg-[#5a0d1b] text-[#e8dcc6] border border-[#89192c]">
                              {(team.teamName || "TM").slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-[#f8eee1]">
                                {team.teamName}
                              </div>
                              <div className="text-xs text-[#e8dcc6]/60 flex items-center gap-1.5 mt-0.5">
                                <Building2 className="w-3 h-3" />
                                {team.schoolOrOrg}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Current Valuation */}
                        <td className="py-4 px-6 text-right font-mono font-bold text-base text-[#f1ca7e]">
                          {formatValuation(team.valuation)}
                        </td>

                        {/* Delta */}
                        <td className="py-4 px-6 text-right font-mono font-bold text-xs sm:text-sm">
                          <span
                            className={`inline-flex items-center justify-end gap-1 ${
                              isPositive
                                ? "text-emerald-400"
                                : isNegative
                                  ? "text-rose-400"
                                  : "text-[#e8dcc6]/70"
                            }`}
                          >
                            {isPositive && (
                              <TrendingUp className="w-3.5 h-3.5" />
                            )}
                            {isNegative && (
                              <TrendingDown className="w-3.5 h-3.5" />
                            )}
                            {!isPositive && !isNegative && (
                              <Minus className="w-3.5 h-3.5" />
                            )}
                            {formatDelta(team.netDelta)}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
