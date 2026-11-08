import { createClient } from "@supabase/supabase-js";

const DEFAULT_URL = 'https://dvynsvvmqaibybjdsukb.supabase.co';
const DEFAULT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2eW5zdnZtcWFpYnliamRzdWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM5NTg1NDIsImV4cCI6MjEwOTUzNDU0Mn0.F_J9N24gb-MDT4NkOoLufVWasvvGiAosRNRZUNiEJQE';

const supabaseUrl =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  import.meta.env?.VITE_SUPABASE_URL ||
  DEFAULT_URL;

const supabaseAnonKey =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  import.meta.env?.VITE_SUPABASE_ANON_KEY ||
  DEFAULT_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Subscribes to real-time changes across dte_crisis, dte_teams, and dte_leaderboard.
 * @param {(table: 'crisis' | 'teams' | 'leaderboard', payload: any) => void} onUpdate
 * @returns {() => void} unsubscribe function
 */
export function subscribeToSimulation(onUpdate) {
  const channel = supabase
    .channel("dte-live-sync")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "dte_crisis" },
      (payload) => onUpdate("crisis", payload)
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "dte_teams" },
      (payload) => onUpdate("teams", payload)
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "dte_leaderboard" },
      (payload) => onUpdate("leaderboard", payload)
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
