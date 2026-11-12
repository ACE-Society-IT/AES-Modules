import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://dvynsvvmqaibybjdsukb.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2eW5zdnZtcWFpYnliamRzdWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM5NTg1NDIsImV4cCI6MjEwOTUzNDU0Mn0.F_J9N24gb-MDT4NkOoLufVWasvvGiAosRNRZUNiEJQE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

function formatDbError(err, fallbackMsg = 'Database operation failed') {
  if (!err) return new Error(fallbackMsg);
  if (err instanceof Error) return err;
  const msg = err.message || err.details || err.hint || (typeof err === 'object' ? JSON.stringify(err) : String(err));
  return new Error(msg || fallbackMsg);
}

let _clientGameStateCache = null;
let _clientGameStateCachedAt = 0;
let _clientGameStatePromise = null;
const CLIENT_CACHE_TTL_MS = 0;

export function invalidateClientStateCache() {
  _clientGameStateCache = null;
  _clientGameStateCachedAt = 0;
  _clientGameStatePromise = null;
}

export function updateCachedGameStateDirect(rawState) {
  if (!rawState || typeof rawState !== 'object') return null;
  const sanitized = { ...rawState };
  delete sanitized.draftCrises;
  delete sanitized.crisesByRound;
  _clientGameStateCache = sanitized;
  _clientGameStateCachedAt = Date.now();
  return sanitized;
}

/**
 * Fetch authoritative game state directly from Supabase
 */
export async function fetchGameStateDirect(forceFresh = false) {
  if (forceFresh) {
    invalidateClientStateCache();
  } else {
    if (_clientGameStateCache && CLIENT_CACHE_TTL_MS > 0 && Date.now() - _clientGameStateCachedAt < CLIENT_CACHE_TTL_MS) {
      return _clientGameStateCache;
    }
    if (_clientGameStatePromise) {
      return _clientGameStatePromise;
    }
  }

  const run = async () => {
    try {
      const { data, error } = await supabase
        .from('investomania_state')
        .select('state_json')
        .eq('id', 1)
        .single();

      if (error) throw formatDbError(error, 'Failed to fetch floor state');
      const state = data?.state_json || null;
      if (state && typeof state === 'object') {
        const sanitized = { ...state };
        delete sanitized.draftCrises;
        delete sanitized.crisesByRound;
        _clientGameStateCache = sanitized;
        _clientGameStateCachedAt = Date.now();
        return sanitized;
      }
      _clientGameStateCache = state;
      _clientGameStateCachedAt = Date.now();
      return state;
    } finally {
      _clientGameStatePromise = null;
    }
  };

  _clientGameStatePromise = run();
  return _clientGameStatePromise;
}

/**
 * Desk sign-in directly via Supabase Security Definer RPC
 * Supports 'Team 25', 'team25', 'team 25', or '25'
 */
export async function authTeamDirect(teamName, passcode) {
  const cleanInput = (teamName || '').trim();
  const cleanPass = (passcode || '').trim();

  // 1. Direct authentication attempt
  let { data, error } = await supabase.rpc('investomania_team_auth', {
    p_team_name: cleanInput,
    p_passcode: cleanPass
  });

  // 2. Intelligent normalization fallback (e.g. 'team25' -> 'Team 25' or '25' -> 'Team 25')
  if ((!data?.ok || error) && /^team\s*\d+$/i.test(cleanInput)) {
    const num = cleanInput.replace(/^team\s*/i, '');
    const normalizedName = `Team ${num}`;
    const retry = await supabase.rpc('investomania_team_auth', {
      p_team_name: normalizedName,
      p_passcode: cleanPass
    });
    if (retry.data?.ok) {
      data = retry.data;
      error = retry.error;
    }
  } else if ((!data?.ok || error) && /^\d+$/.test(cleanInput)) {
    const normalizedName = `Team ${cleanInput}`;
    const retry = await supabase.rpc('investomania_team_auth', {
      p_team_name: normalizedName,
      p_passcode: cleanPass
    });
    if (retry.data?.ok) {
      data = retry.data;
      error = retry.error;
    }
  }

  if (error) throw formatDbError(error, 'Desk authentication failed');
  if (!data?.ok) throw new Error(data?.error || 'Desk sign-in failed');
  return data.data;
}

/**
 * Place trade atomically directly via Supabase Security Definer RPC
 */
export async function placeTradeDirect({ teamId, symbol, side, quantity }) {
  const { data, error } = await supabase.rpc('investomania_place_trade', {
    p_team_id: teamId,
    p_symbol: symbol,
    p_side: side,
    p_quantity: Number(quantity)
  });

  if (error) throw formatDbError(error, 'Trade routing failed');
  if (!data?.ok) throw new Error(data?.error || 'Trade execution failed');
  invalidateClientStateCache();

  // Query updated team record immediately so client balance is 100% authoritative and instant
  try {
    const { data: teamRow } = await supabase
      .from('investomania_teams')
      .select('*')
      .eq('id', teamId)
      .single();

    if (teamRow) {
      return {
        ...data.data,
        team: {
          id: teamRow.id,
          name: teamRow.name,
          passcode: teamRow.passcode,
          cash: Number(teamRow.cash ?? 0),
          initialBudget: Number(teamRow.initial_budget || 100000),
          initialRoundBudget: Number(teamRow.initial_budget || 100000),
          holdings: teamRow.holdings || {},
          isBanned: !!teamRow.is_banned,
          round1Profit: Number(teamRow.round1_profit || 0),
          round2Profit: Number(teamRow.round2_profit || 0),
          taxDeducted: Number(teamRow.tax_deducted || 0),
          taxDeductedTotal: Number(teamRow.tax_deducted || 0),
          taxShielded: Number(teamRow.tax_shielded || 0),
          taxShieldedTotal: Number(teamRow.tax_shielded || 0),
          taxHistory: Array.isArray(teamRow.tax_history) ? teamRow.tax_history : []
        }
      };
    }
  } catch (err) {
    console.warn('[placeTradeDirect] Failed to re-fetch updated team:', err);
  }

  return data.data;
}

/**
 * Round 3 Tax Evasion & Offshore Smuggling directly via Supabase RPC
 */
export async function allocateTaxDirect({ teamId, channelId, amount }) {
  const { data, error } = await supabase.rpc('investomania_allocate_tax', {
    p_team_id: teamId,
    p_channel_id: Number(channelId),
    p_amount: Number(amount)
  });

  if (error) throw formatDbError(error, 'Offshore allocation failed');
  if (!data?.ok) throw new Error(data?.error || 'Offshore allocation failed');
  invalidateClientStateCache();

  // Immediately query authoritative team record so cash, taxShielded, taxDeducted, and taxHistory update with zero delay
  try {
    const { data: teamRow } = await supabase
      .from('investomania_teams')
      .select('*')
      .eq('id', teamId)
      .single();

    if (teamRow) {
      const formattedTeam = {
        id: teamRow.id,
        name: teamRow.name,
        passcode: teamRow.passcode,
        cash: Number(teamRow.cash ?? 0),
        initialBudget: Number(teamRow.initial_budget || 100000),
        initialRoundBudget: Number(teamRow.initial_budget || 100000),
        holdings: teamRow.holdings || {},
        isBanned: !!teamRow.is_banned,
        round1Profit: Number(teamRow.round1_profit || 0),
        round2Profit: Number(teamRow.round2_profit || 0),
        taxDeducted: Number(teamRow.tax_deducted || 0),
        taxDeductedTotal: Number(teamRow.tax_deducted || 0),
        taxShielded: Number(teamRow.tax_shielded || 0),
        taxShieldedTotal: Number(teamRow.tax_shielded || 0),
        taxHistory: Array.isArray(teamRow.tax_history) ? teamRow.tax_history : []
      };

      return {
        ...data.data,
        team: formattedTeam
      };
    }
  } catch (err) {
    console.warn('[allocateTaxDirect] Failed to re-fetch updated team row:', err);
  }

  return data.data;
}

/**
 * Fetch all registered competitor desks directly from Supabase
 */
export async function fetchTeamsDirect() {
  const { data, error } = await supabase
    .from('investomania_teams')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.warn('Error querying investomania_teams:', error);
    return [];
  }

  return (data || []).map((t) => ({
    id: t.id,
    name: t.name || t.id,
    passcode: t.passcode,
    cash: Number(t.cash || 0),
    initialBudget: Number(t.initial_budget || t.cash || 100000),
    holdings: t.holdings || {},
    isBanned: !!t.is_banned,
    round1Profit: Number(t.round1_profit || 0),
    round2Profit: Number(t.round2_profit || 0),
    taxDeducted: Number(t.tax_deducted || 0),
    taxShielded: Number(t.tax_shielded || 0),
    updatedAt: t.updated_at
  }));
}
