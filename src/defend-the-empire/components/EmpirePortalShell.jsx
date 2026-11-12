"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SIM_CONFIG, CRISES } from "../data/crisisData";
import { supabase, subscribeToSimulation } from "../lib/supabaseClient";
import EmpireHeader from "./EmpireHeader";
import CompanyBackgroundView from "./background/CompanyBackgroundView";
import LiveCrisisSimulationView from "./crisis/LiveCrisisSimulationView";
import LeaderboardView from "./leaderBoard/LeaderboardView";
import EmpireFooter from "./EmpireFooter";
import { Shield, Lock, Users, AlertCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { useGame } from "../../context/GameContext.jsx";

export default function EmpirePortalShell() {
  const navigate = useNavigate();
  const { gameState } = useGame() || {};
  const isDteBlocked = gameState?.moduleAccess?.defendTheEmpire === false;
  // Primary View Tab: "background" | "simulation" | "leaderboard"
  const [activeTab, setActiveTab] = useState("background");

  // Supabase Data State
  const [crises, setCrises] = useState([]);
  const [teams, setTeams] = useState([]);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Authentication inputs
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [inputPasscode, setInputPasscode] = useState("");
  const [authError, setAuthError] = useState("");

  // Clock & Simulation Controls
  const [elapsed, setElapsed] = useState(0);
  const [localRemainingSeconds, setLocalRemainingSeconds] = useState(360);
  const [selectedWaveIdx, setSelectedWaveIdx] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);

  // Fetch all crises from dte_crisis
  const fetchCrises = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("dte_crisis")
        .select("*")
        .order("wave_order", { ascending: true });

      if (error) {
        console.warn("Could not fetch dte_crisis:", error.message);
        return;
      }

      if (data && data.length > 0) {
        setCrises(data);
      }
    } catch (err) {
      console.warn("Error fetching crises:", err);
    }
  }, []);

  // Fetch all teams from dte_teams
  const fetchTeams = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("dte_teams")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.warn("Could not fetch dte_teams:", error.message);
        return;
      }

      if (data && data.length > 0) {
        setTeams(data);
        return data;
      }
    } catch (err) {
      console.warn("Error fetching teams:", err);
    }
    return [];
  }, []);

  // Initial load and auth check
  useEffect(() => {
    async function init() {
      await fetchCrises();
      const loadedTeams = await fetchTeams();

      // Check stored team session
      const savedTeamId =
        typeof window !== "undefined"
          ? localStorage.getItem("dte_team_id")
          : null;

      if (savedTeamId && loadedTeams && loadedTeams.length > 0) {
        const found = loadedTeams.find((t) => t.id === savedTeamId);
        if (found) {
          setCurrentTeam(found);
          setHasStarted(true);
        } else {
          setAuthModalOpen(true);
        }
      } else {
        setAuthModalOpen(true);
      }
    }

    init();

    // Subscribe to realtime simulation changes
    const unsubscribe = subscribeToSimulation((table) => {
      if (table === "crisis") {
        fetchCrises();
      } else if (table === "teams") {
        fetchTeams().then((updatedTeams) => {
          if (updatedTeams) {
            const savedTeamId = localStorage.getItem("dte_team_id");
            if (savedTeamId) {
              const matched = updatedTeams.find((t) => t.id === savedTeamId);
              if (matched) setCurrentTeam(matched);
            }
          }
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [fetchCrises, fetchTeams]);

  // Set default selected team in modal once teams load
  useEffect(() => {
    if (teams.length > 0 && !selectedTeamId) {
      setSelectedTeamId(teams[0].id);
    }
  }, [teams, selectedTeamId]);

  // Real-time Auto-Logout if Administrator locks Defend the Empire logins
  useEffect(() => {
    if (isDteBlocked) {
      const activeId = localStorage.getItem("dte_team_id");
      if (currentTeam || activeId) {
        console.warn("[DTE] Defend the Empire access blocked by Admin. Logging out session.");
        localStorage.removeItem("dte_team_id");
        setCurrentTeam(null);
        setAuthError("War Room access has been locked by the Administrator. All active sessions have been signed out.");
        setAuthModalOpen(true);
      }
    }
  }, [isDteBlocked, currentTeam]);

  // Active crisis calculation based on database status
  const crisesList = crises.length > 0 ? crises : CRISES;

  const serverActiveIndex = useMemo(() => {
    if (crises.length === 0) return 0;
    // Find crisis with running or paused status
    const runningIdx = crises.findIndex(
      (c) => c.status === "running" || c.status === "paused"
    );
    if (runningIdx !== -1) return runningIdx;

    // Find first idle crisis
    const idleIdx = crises.findIndex((c) => c.status === "idle");
    if (idleIdx !== -1) return idleIdx;

    // If all completed, return last crisis
    return Math.max(0, crises.length - 1);
  }, [crises]);

  const currentIndex =
    selectedWaveIdx !== null && selectedWaveIdx <= serverActiveIndex
      ? selectedWaveIdx
      : serverActiveIndex;

  const activeCrisis = crisesList[currentIndex] || crisesList[0];

  const liveCrisis = crisesList[serverActiveIndex] || crisesList[0];
  const isLiveRunning = liveCrisis?.status === "running";

  const isSimulationComplete =
    crises.length > 0
      ? crises.every((c) => c.status === "completed")
      : elapsed >= SIM_CONFIG.totalSeconds;

  const isRunning = isLiveRunning;
  const selectionOpen = Boolean(liveCrisis?.selection_open);
  const isRevealed = activeCrisis?.is_revealed !== false;
  const optionsRevealed = activeCrisis?.options_revealed !== false;

  // Sync remaining seconds from live active crisis
  useEffect(() => {
    if (liveCrisis && typeof liveCrisis.remaining_seconds === "number") {
      setLocalRemainingSeconds(liveCrisis.remaining_seconds);
    }
  }, [liveCrisis]);

  // Local second-by-second timer tick when running
  useEffect(() => {
    if (!isLiveRunning || isSimulationComplete) return;

    const id = setInterval(() => {
      setLocalRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      setElapsed((prev) => Math.min(prev + 1, SIM_CONFIG.totalSeconds));
    }, 1000);

    return () => clearInterval(id);
  }, [isLiveRunning, isSimulationComplete]);

  // Decisions map: { [crisisIndex]: optionId }
  const decisions = useMemo(() => {
    return currentTeam?.decisions || {};
  }, [currentTeam]);

  // Valuation is derived deterministically from decisions
  const { balance, history } = useMemo(() => {
    let value = currentTeam?.starting_valuation || SIM_CONFIG.startingValuation;

    if (currentTeam?.manual_adjustment) {
      value += Number(currentTeam.manual_adjustment);
    }

    const points = [{ crisis: 0, value, delta: 0, answered: true }];

    crisesList.forEach((crisis, i) => {
      const chosen = crisis.options?.find((o) => o.id === decisions[i]);
      const delta = chosen ? chosen.delta : 0;
      value += delta;
      // Plot crises that have already passed or been answered
      if (chosen || i < currentIndex || isSimulationComplete) {
        points.push({
          crisis: i + 1,
          value,
          delta,
          answered: Boolean(chosen),
        });
      }
    });

    return { balance: value, history: points };
  }, [decisions, currentIndex, isSimulationComplete, currentTeam, crisesList]);

  // Handle Team Login
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setAuthError("");

    if (isDteBlocked) {
      setAuthError("Defend the Empire access has been locked by the Administrator. Sign-ins are currently disabled.");
      return;
    }

    const targetTeam = teams.find((t) => t.id === selectedTeamId);
    if (!targetTeam) {
      setAuthError("Please select a delegation from the list.");
      return;
    }

    if (targetTeam.passcode && targetTeam.passcode !== inputPasscode.trim()) {
      setAuthError(
        "Invalid delegation passcode. Please check with your facilitator."
      );
      return;
    }

    // Success
    localStorage.setItem("dte_team_id", targetTeam.id);
    setCurrentTeam(targetTeam);
    setAuthModalOpen(false);
    setInputPasscode("");
    setHasStarted(true);
  };

  // Option lock-in handler according to guide
  const handleLockIn = async (optionId) => {
    if (!currentTeam) {
      setAuthModalOpen(true);
      return;
    }

    if (!selectionOpen || !isRunning) {
      alert(
        "Option selecting is currently locked or paused by the command facilitator."
      );
      return;
    }

    if (decisions[currentIndex] || isSimulationComplete) return;

    const nextDecisions = {
      ...decisions,
      [currentIndex]: optionId,
    };

    // Calculate new current valuation
    let nextVal =
      currentTeam.starting_valuation || SIM_CONFIG.startingValuation;
    if (currentTeam.manual_adjustment) {
      nextVal += Number(currentTeam.manual_adjustment);
    }
    crisesList.forEach((c, i) => {
      const choiceId = nextDecisions[i];
      if (choiceId && c.options) {
        const opt = c.options.find((o) => o.id === choiceId);
        if (opt && typeof opt.delta === "number") {
          nextVal += opt.delta;
        }
      }
    });

    // Optimistically update local team state for instant feedback
    const updatedTeam = {
      ...currentTeam,
      decisions: nextDecisions,
      current_valuation: nextVal,
      last_answered_wave: currentIndex,
    };
    setCurrentTeam(updatedTeam);

    try {
      // 1. Update dte_teams
      await supabase
        .from("dte_teams")
        .update({
          decisions: nextDecisions,
          current_valuation: nextVal,
          last_answered_wave: currentIndex,
          updated_at: new Date().toISOString(),
        })
        .eq("id", currentTeam.id);

      // 2. Update dte_leaderboard
      await supabase
        .from("dte_leaderboard")
        .update({
          decisions: nextDecisions,
          current_valuation: nextVal,
          net_delta:
            nextVal -
            (currentTeam.starting_valuation || SIM_CONFIG.startingValuation),
          last_option_locked: optionId,
          last_answered_wave: currentIndex,
          crises_resolved: Object.keys(nextDecisions).length,
          updated_at: new Date().toISOString(),
        })
        .eq("team_id", currentTeam.id);
    } catch (err) {
      console.warn("Error updating decision in Supabase:", err);
    }
  };

  const handleStart = () => {
    setHasStarted(true);
    if (!currentTeam) {
      setAuthModalOpen(true);
    }
  };

  const handleReset = () => {
    setSelectedWaveIdx(null);
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      const confirmed = window.confirm(
        "Are you sure you want to log out of the command terminal?"
      );
      if (confirmed) {
        localStorage.removeItem("dte_team_id");
        setCurrentTeam(null);
        setAuthModalOpen(true);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#5a0d1b] text-[#f8eee1]">
      <EmpireHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        balance={balance}
        currentWaveIndex={currentIndex}
        totalWaves={crisesList.length}
        isSimulationComplete={isSimulationComplete}
        onLogout={handleLogout}
        currentTeam={currentTeam}
        onBackToHub={() => navigate("/")}
      />

      <main className="flex-1">
        {activeTab === "background" ? (
          <CompanyBackgroundView
            balance={balance}
            onEnterSimulation={() => setActiveTab("simulation")}
          />
        ) : activeTab === "simulation" ? (
          <LiveCrisisSimulationView
            balance={balance}
            history={history}
            elapsed={elapsed}
            hasStarted={hasStarted}
            isRunning={isRunning}
            isSimulationComplete={isSimulationComplete}
            currentIndex={currentIndex}
            serverActiveIndex={serverActiveIndex}
            decisions={decisions}
            onStart={handleStart}
            onTogglePause={() => {}}
            onLockIn={handleLockIn}
            onReset={handleReset}
            crisesList={crisesList}
            activeCrisis={activeCrisis}
            onSelectWave={(idx) => {
              if (idx <= serverActiveIndex || isSimulationComplete) {
                setSelectedWaveIdx(idx);
              }
            }}
            remainingSeconds={localRemainingSeconds}
            durationSeconds={liveCrisis?.duration_seconds || 360}
            selectionOpen={selectionOpen}
            isRevealed={isRevealed}
            optionsRevealed={optionsRevealed}
          />
        ) : (
          <LeaderboardView
            currentTeamValuation={balance}
            currentWaveIndex={currentIndex}
          />
        )}
      </main>

      <EmpireFooter activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Team Authentication Modal */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-pop-in">
          <div className="relative w-full max-w-md rounded-3xl border-2 border-[#f1ca7e]/60 bg-[#701020] p-6 sm:p-8 shadow-2xl shadow-[#5a0d1b]/80 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#5a0d1b] border border-[#f1ca7e]/60 flex items-center justify-center shadow-md">
                <Shield className="w-7 h-7 text-[#f1ca7e]" />
              </div>
              <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#f1ca7e]">
                Aurelia Sovereign Holdings
              </p>
              <h2 className="text-xl sm:text-2xl font-black text-[#f8eee1]">
                War Room Authentication
              </h2>
              <p className="text-xs text-[#e8dcc6]/80 max-w-xs mx-auto">
                Select your assigned delegation and enter the mission passcode
                to access real-time crisis telemetries.
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-[#e8dcc6]">
                  Select Delegation
                </label>
                <div className="relative">
                  <select
                    disabled={isDteBlocked}
                    value={selectedTeamId}
                    onChange={(e) => setSelectedTeamId(e.target.value)}
                    className="w-full appearance-none rounded-xl bg-[#5a0d1b] border border-[#89192c] px-4 py-3 text-sm text-[#f8eee1] focus:outline-none focus:border-[#f1ca7e] transition disabled:opacity-50"
                  >
                    {teams.length === 0 ? (
                      <option value="">Connecting to registry...</option>
                    ) : (
                      teams.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.team_name} ({t.id})
                        </option>
                      ))
                    )}
                  </select>
                  <Users className="w-4 h-4 text-[#f1ca7e] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-[#e8dcc6]">
                  Delegation Passcode
                </label>
                <div className="relative">
                  <input
                    type="password"
                    disabled={isDteBlocked}
                    placeholder="Enter passcode"
                    value={inputPasscode}
                    onChange={(e) => setInputPasscode(e.target.value)}
                    className="w-full rounded-xl bg-[#5a0d1b] border border-[#89192c] px-4 py-3 text-sm text-[#f8eee1] placeholder-[#e8dcc6]/40 focus:outline-none focus:border-[#f1ca7e] transition disabled:opacity-50"
                  />
                  <Lock className="w-4 h-4 text-[#f1ca7e] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {isDteBlocked && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs">
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>Logins Locked: The Administrator has temporarily closed team sign-ins for Defend the Empire.</span>
                </div>
              )}

              {authError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-300 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isDteBlocked}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#f1ca7e] text-[#5a0d1b] font-black uppercase tracking-wider text-sm hover:scale-[1.02] active:scale-[0.98] transition shadow-lg shadow-black/30 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Authenticate & Enter War Room</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
