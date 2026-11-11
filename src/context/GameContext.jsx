import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  supabase,
  fetchGameStateDirect,
  updateCachedGameStateDirect,
  authTeamDirect,
  placeTradeDirect,
  allocateTaxDirect
} from '../lib/supabaseGameService.js';

const GameContext = createContext(null);

function sanitizeParticipantGameState(rawState) {
  if (!rawState || typeof rawState !== 'object') return rawState;
  const sanitized = { ...rawState };
  delete sanitized.draftCrises;
  delete sanitized.crisesByRound;
  return sanitized;
}

export function GameProvider({ children }) {
  const [gameState, setGameState] = useState(null);
  const [team, setTeam] = useState(() => {
    try {
      const saved = sessionStorage.getItem('investomania_team');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Support 3 modes: 'aes' (AES Crimson Canvas), 'dark' (Maroon Obsidian), 'light' (Classic White)
  const [theme, setTheme] = useState(() => sessionStorage.getItem('investomania_theme') || 'aes');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    sessionStorage.setItem('investomania_theme', theme);
  }, [theme]);

  // Cycles through: Light -> Dark -> AES Mix -> Light
  const toggleTheme = useCallback(() => {
    const cycle = {
      'light': 'dark',
      'dark': 'aes',
      'aes': 'light'
    };
    if (typeof document !== 'undefined' && document.startViewTransition) {
      document.startViewTransition(() => {
        setTheme((prev) => cycle[prev] || 'light');
      });
    } else {
      setTheme((prev) => cycle[prev] || 'light');
    }
  }, []);

  const setThemeMode = useCallback((mode) => {
    if (typeof document !== 'undefined' && document.startViewTransition) {
      document.startViewTransition(() => {
        setTheme(mode);
      });
    } else {
      setTheme(mode);
    }
  }, []);

  // Fetch Authoritative State Directly from Supabase
  const fetchLatestState = useCallback(async (forceFresh = true) => {
    try {
      const directState = await fetchGameStateDirect(forceFresh);
      if (directState) {
        setGameState(sanitizeParticipantGameState(directState));
      }

      // If team is signed in, sync fresh team row directly from investomania_teams
      const savedTeamStr = sessionStorage.getItem('investomania_team');
      if (savedTeamStr) {
        try {
          const currentT = JSON.parse(savedTeamStr);
          if (currentT?.id) {
            const { data: dbTeam } = await supabase
              .from('investomania_teams')
              .select('*')
              .eq('id', currentT.id)
              .single();
            if (dbTeam) {
              setTeam((prev) => {
                const merged = {
                  ...prev,
                  id: dbTeam.id,
                  name: dbTeam.name,
                  cash: Number(dbTeam.cash ?? 0),
                  holdings: dbTeam.holdings || {},
                  isBanned: !!dbTeam.is_banned,
                  round1Profit: Number(dbTeam.round1_profit || 0),
                  round2Profit: Number(dbTeam.round2_profit || 0),
                  initialBudget: Number(dbTeam.initial_budget || 100000),
                  initialRoundBudget: Number(dbTeam.initial_budget || 100000),
                  taxDeducted: Number(dbTeam.tax_deducted || 0),
                  taxDeductedTotal: Number(dbTeam.tax_deducted || 0),
                  taxShielded: Number(dbTeam.tax_shielded || 0),
                  taxShieldedTotal: Number(dbTeam.tax_shielded || 0),
                  taxHistory: Array.isArray(dbTeam.tax_history) ? dbTeam.tax_history : []
                };
                sessionStorage.setItem('investomania_team', JSON.stringify(merged));
                return merged;
              });
            }
          }
        } catch {}
      }
    } catch (err) {
      console.warn('[GameContext] Supabase state fetch:', err.message);
    }
  }, []);

  // Realtime Supabase Subscription
  useEffect(() => {
    fetchLatestState(true);

    let channel = null;
    try {
      channel = supabase
        .channel('investomania-client-realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'investomania_state' },
          (payload) => {
            if (payload.new && payload.new.state_json) {
              updateCachedGameStateDirect(payload.new.state_json);
              setGameState(sanitizeParticipantGameState(payload.new.state_json));
            } else {
              fetchLatestState(true);
            }
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'investomania_teams' },
          (payload) => {
            const savedTeamStr = sessionStorage.getItem('investomania_team');
            if (savedTeamStr && payload.new) {
              try {
                const currentT = JSON.parse(savedTeamStr);
                if (currentT?.id && String(payload.new.id) === String(currentT.id)) {
                  const dbTeam = payload.new;
                  setTeam((prev) => {
                    const merged = {
                      ...prev,
                      id: dbTeam.id,
                      name: dbTeam.name,
                      cash: Number(dbTeam.cash ?? 0),
                      holdings: dbTeam.holdings || {},
                      isBanned: !!dbTeam.is_banned,
                      round1Profit: Number(dbTeam.round1_profit || 0),
                      round2Profit: Number(dbTeam.round2_profit || 0),
                      initialBudget: Number(dbTeam.initial_budget || 100000),
                      initialRoundBudget: Number(dbTeam.initial_budget || 100000),
                      taxDeducted: Number(dbTeam.tax_deducted || 0),
                      taxDeductedTotal: Number(dbTeam.tax_deducted || 0),
                      taxShielded: Number(dbTeam.tax_shielded || 0),
                      taxShieldedTotal: Number(dbTeam.tax_shielded || 0),
                      taxHistory: Array.isArray(dbTeam.tax_history) ? dbTeam.tax_history : []
                    };
                    sessionStorage.setItem('investomania_team', JSON.stringify(merged));
                    return merged;
                  });
                  return;
                }
              } catch {}
            }
            fetchLatestState(true);
          }
        )
        .subscribe();
    } catch (err) {
      console.warn('[GameContext] Realtime subscription error:', err.message);
    }

    const handleFocus = () => {
      if (!document.hidden) {
        fetchLatestState(true);
      }
    };
    window.addEventListener('focus', handleFocus);
    window.addEventListener('visibilitychange', handleFocus);

    // Responsive failover safety heartbeat (4s) so updates are always crisp and instant
    const pollInterval = setInterval(() => {
      if (!document.hidden) {
        fetchLatestState(false);
      }
    }, 4000);

    return () => {
      if (channel) supabase.removeChannel(channel);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('visibilitychange', handleFocus);
      clearInterval(pollInterval);
    };
  }, [fetchLatestState]);

  // Wall-Clock Accurate Countdown Ticker
  useEffect(() => {
    if (!gameState || gameState.isPaused) return;
    if (gameState.phase !== 'DECRYPT' && gameState.phase !== 'TRADING' && gameState.phase !== 'DECRYPTING') return;

    const interval = setInterval(() => {
      setGameState((prev) => {
        if (!prev || prev.isPaused) return prev;
        if (prev.roundEndsAt) {
          const rem = Math.max(0, Math.round((prev.roundEndsAt - Date.now()) / 1000));
          if (rem !== prev.remainingSeconds) {
            return { ...prev, remainingSeconds: rem };
          }
        } else if (prev.remainingSeconds > 0) {
          return { ...prev, remainingSeconds: Math.max(0, prev.remainingSeconds - 1) };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState?.phase, gameState?.isPaused, gameState?.roundEndsAt]);

  // Keep logged-in team synced whenever gameState updates
  useEffect(() => {
    if (!team) return;
    let updated = null;
    if (gameState?.teams && typeof gameState.teams === 'object' && gameState.teams[team.id]) {
      updated = gameState.teams[team.id];
    }
    // Do NOT fall back to gameState.leaderboard for live desk cash or tax balances,
    // as leaderboard is a periodic snapshot that can overwrite fresh values!
    if (updated && updated.cash !== undefined) {
      setTeam((prev) => {
        const nextTeam = { ...prev, ...updated };
        sessionStorage.setItem('investomania_team', JSON.stringify(nextTeam));
        return nextTeam;
      });
    }
  }, [gameState?.teams, team?.id]);

  // Contestant Desk Sign-In
  const loginTeam = async (teamName, passcode) => {
    const data = await authTeamDirect(teamName, passcode);
    setTeam(data.team);
    if (data.gameState) setGameState(data.gameState);
    sessionStorage.setItem('investomania_team', JSON.stringify(data.team));
    try { localStorage.removeItem('investomania_team'); } catch {}
    return data.team;
  };

  const logoutTeam = () => {
    setTeam(null);
    sessionStorage.removeItem('investomania_team');
    try { localStorage.removeItem('investomania_team'); } catch {}
  };

  // Place Trade Directly via Supabase
  const placeTrade = async ({ symbol, side, quantity }) => {
    if (!team) throw new Error('Please log in as a team first.');
    const result = await placeTradeDirect({ teamId: team.id, symbol, side, quantity });
    const enriched = {
      success: true,
      ok: true,
      trade: {
        ...result.trade,
        amount: result.trade?.totalCost || (Number(result.trade?.price || 0) * Number(result.trade?.quantity || quantity)) || 0
      },
      team: result.team
    };
    if (result.team) {
      setTeam((prev) => {
        const next = { ...prev, ...result.team };
        sessionStorage.setItem('investomania_team', JSON.stringify(next));
        return next;
      });
      setGameState((prev) => {
        if (!prev) return prev;
        const next = { ...prev };
        if (next.teams && typeof next.teams === 'object') {
          next.teams = {
            ...next.teams,
            [team.id]: {
              ...(next.teams[team.id] || {}),
              ...result.team
            }
          };
        }
        return next;
      });
    }
    return enriched;
  };

  // Round 3 Offshore Smuggling Allocation Directly via Supabase
  const allocateTaxChannel = async ({ channelId, amount }) => {
    if (!team) throw new Error('Please log in as a team first.');
    const result = await allocateTaxDirect({ teamId: team.id, channelId, amount });
    if (result.team) {
      setTeam((prev) => {
        const next = { ...prev, ...result.team };
        sessionStorage.setItem('investomania_team', JSON.stringify(next));
        return next;
      });
      // Synchronize gameState.teams immediately so portfolio and views update with zero delay
      setGameState((prev) => {
        if (!prev) return prev;
        const next = { ...prev };
        if (next.teams && typeof next.teams === 'object') {
          next.teams = {
            ...next.teams,
            [team.id]: {
              ...(next.teams[team.id] || {}),
              ...result.team
            }
          };
        }
        return next;
      });
    }
    return result;
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        team,
        theme,
        setTheme: setThemeMode,
        toggleTheme,
        loginTeam,
        logoutTeam,
        placeTrade,
        allocateTaxChannel
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);
