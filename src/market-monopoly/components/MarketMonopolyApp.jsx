import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TactileButton, EasyLoadingScreen } from '../../components/ui/EasyComponents.jsx';
import {
  IconWallet,
  IconBriefcase,
  IconLayers,
  IconCalendar,
  IconSun,
  IconMoon,
  IconSearch,
  IconClose,
  IconRadar,
  IconTrendingUp
} from '../../components/ui/CustomIcons.jsx';
import {
  KARACHI_PROPERTIES,
  KARACHI_UTILITIES,
  computePropertyValuation,
  computePropertyRent,
  computePropertyUpgradeLevel
} from '../data/monopolyData.js';
import { KARACHI_PROPERTY_DOSSIERS } from '../data/propertyDossiers.js';
import {
  fetchMonopolyStore,
  authenticateMonopolyTeam,
  attachUtilityToProperty,
  buyUtilityTokenFromBank,
  executePropertySpecificationUpgrade,
  upgradePropertyLevel,
  executeTeamWheelSpinAndPayRent,
  computeTeamSummary,
  updateCachedMonopolyStore,
  supabase
} from '../lib/monopolyService.js';
import { useGame } from '../../context/GameContext.jsx';
import { UtilityIcon, LandPlotIllustration, PropertyCategoryBackdrop } from './LandPlotSvg.jsx';
import SpinWheelModal from './SpinWheelModal.jsx';
import MonopolyPodiumLeaderboard from './MonopolyPodiumLeaderboard.jsx';
import aesLogo from '../../assets/aes-logo.png';

export default function MarketMonopolyApp() {
  const navigate = useNavigate();
  const location = useLocation();

  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('investomania_monopoly_theme') || 'aes';
    } catch {
      return 'aes';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('investomania_monopoly_theme', theme);
    } catch { }
  }, [theme]);

  const cycleTheme = () => {
    setTheme((prev) => (prev === 'aes' ? 'dark' : prev === 'dark' ? 'light' : 'aes'));
  };

  const [store, setStore] = useState(null);

  // Persist session across page refreshes
  const [activeTeamId, setActiveTeamId] = useState(() => {
    try {
      return sessionStorage.getItem('investomania_monopoly_team_id') || localStorage.getItem('investomania_monopoly_team_id') || '';
    } catch {
      return '';
    }
  });
  const [activeTeamName, setActiveTeamName] = useState(() => {
    try {
      return sessionStorage.getItem('investomania_monopoly_team_name') || localStorage.getItem('investomania_monopoly_team_name') || '';
    } catch {
      return '';
    }
  });

  // Keep storage in sync whenever active team changes
  useEffect(() => {
    try {
      if (activeTeamId) {
        sessionStorage.setItem('investomania_monopoly_team_id', String(activeTeamId));
        localStorage.setItem('investomania_monopoly_team_id', String(activeTeamId));
      } else {
        sessionStorage.removeItem('investomania_monopoly_team_id');
        localStorage.removeItem('investomania_monopoly_team_id');
      }
      if (activeTeamName) {
        sessionStorage.setItem('investomania_monopoly_team_name', activeTeamName);
        localStorage.setItem('investomania_monopoly_team_name', activeTeamName);
      } else {
        sessionStorage.removeItem('investomania_monopoly_team_name');
        localStorage.removeItem('investomania_monopoly_team_name');
      }
    } catch { }
  }, [activeTeamId, activeTeamName]);

  const [loginName, setLoginName] = useState('');
  const [loginPasscode, setLoginPasscode] = useState('');
  const [loginError, setLoginError] = useState('');

  const { gameState } = useGame() || {};
  const isMonopolyBlocked =
    (gameState?.moduleAccess && gameState.moduleAccess.marketMonopoly === false) ||
    (store?.loginsEnabled === false);

  // Real-time Auto-Logout if Administrator locks Market Monopoly logins
  useEffect(() => {
    if (isMonopolyBlocked) {
      const activeId =
        activeTeamId ||
        sessionStorage.getItem('investomania_monopoly_team_id') ||
        localStorage.getItem('investomania_monopoly_team_id');
      if (activeId === 'admin') return; // Admin is exempt
      if (activeId) {
        console.warn('[Monopoly] Market Monopoly logins blocked by Admin. Logging out session.');
        setActiveTeamId('');
        setActiveTeamName('');
        try {
          sessionStorage.removeItem('investomania_monopoly_team_id');
          sessionStorage.removeItem('investomania_monopoly_team_name');
          localStorage.removeItem('investomania_monopoly_team_id');
          localStorage.removeItem('investomania_monopoly_team_name');
        } catch {}
        setLoginError('Market Monopoly access has been locked by the Administrator. All active sessions have been signed out.');
      }
    }
  }, [isMonopolyBlocked, activeTeamId]);

  // Sync tab with URL: /market-monopoly/land, /market-monopoly/buy-resources, /market-monopoly/bank, etc.
  const validTabs = useMemo(() => ['land', 'buy-resources', 'bank', 'standings', 'guide', 'catalogue'], []);
  const getTabFromPath = useCallback(() => {
    const segments = location.pathname.split('/').filter(Boolean);
    // Path looks like ['market-monopoly', 'tab-name']
    const lastSeg = segments[segments.length - 1];
    if (validTabs.includes(lastSeg)) return lastSeg;
    return 'land';
  }, [location.pathname, validTabs]);

  const [activeTab, setActiveTabState] = useState(getTabFromPath);

  // When URL path changes, update state
  useEffect(() => {
    const tabFromUrl = getTabFromPath();
    if (tabFromUrl !== activeTab) {
      setActiveTabState(tabFromUrl);
    }
  }, [location.pathname, getTabFromPath, activeTab]);

  // Tab switch handler updates the URL
  const setActiveTab = useCallback((newTab) => {
    setActiveTabState(newTab);
    navigate(`/market-monopoly/${newTab}`, { replace: true });
  }, [navigate]);

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const [draggedUtilityId, setDraggedUtilityId] = useState(null);
  const [hoveredPropertyId, setHoveredPropertyId] = useState(null);

  const [contextMenu, setContextMenu] = useState(null);
  const [inspectedPropertyId, setInspectedPropertyId] = useState(null);
  const [previewLevelOverride, setPreviewLevelOverride] = useState(null);
  const [isWheelModalOpen, setIsWheelModalOpen] = useState(false);

  // Interactive Guide Tab State
  const [guideSubTab, setGuideSubTab] = useState('all'); // 'all', 'level-up', 'utilities', 'dossiers', 'wheel', 'victory'
  const [guideSimLevel, setGuideSimLevel] = useState(1); // 0, 1, 2, 3
  const [guideSimCategory, setGuideSimCategory] = useState('Residential'); // 'Residential', 'Commercial', 'Industrial'
  const [guideSamplePropId, setGuideSamplePropId] = useState(1); // Default to DHA Phase 6
  const [guideUtilFilter, setGuideUtilFilter] = useState('ALL'); // 'ALL', 'Power', 'Water', 'Energy', 'Sanitation', 'Access', 'Security', 'Comms'

  // Rent settlement popup state (for paying rent & collecting rent)
  const [activeRentDialog, setActiveRentDialog] = useState(null);
  const initialSpinsSeededRef = useRef({});
  const [dismissedRentKeys, setDismissedRentKeys] = useState(() => {
    try {
      const stored = localStorage.getItem('monopoly_dismissed_rent_keys');
      if (!stored || !stored.trim() || stored === 'undefined' || stored === 'null') return {};
      return JSON.parse(stored);
    } catch {
      return {};
    }
  });

  const [purchasingUtilityId, setPurchasingUtilityId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const refreshStore = useCallback(async (forceFresh = false) => {
    try {
      const loaded = await fetchMonopolyStore(forceFresh);
      setStore(loaded);
    } catch (err) {
      console.error('Supabase refreshStore error:', err);
    }
  }, []);

  const activeUtilities = useMemo(() => {
    return Array.isArray(store?.utilities) && store.utilities.length > 0
      ? store.utilities
      : KARACHI_UTILITIES;
  }, [store?.utilities]);

  useEffect(() => {
    refreshStore(true);

    const sub = supabase
      .channel('monopoly_client_updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'monopoly_state', filter: 'id=eq.1' },
        (payload) => {
          if (payload?.new?.state_json) {
            const updated = updateCachedMonopolyStore(payload.new.state_json);
            if (updated) {
              setStore(updated);
              return;
            }
          }
          refreshStore(true);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'monopoly_teams' },
        () => {
          refreshStore(true);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'monopoly_properties' },
        () => {
          refreshStore(true);
        }
      )
      .subscribe();

    // Responsive failover heartbeat (4s) so participant and projector views update with zero lag
    const poll = setInterval(() => {
      if (document.visibilityState === 'visible') {
        refreshStore(false);
      }
    }, 4000);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        refreshStore(true);
      }
    };
    window.addEventListener('focus', handleVisibility);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      supabase.removeChannel(sub);
      clearInterval(poll);
      window.removeEventListener('focus', handleVisibility);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [refreshStore]);

  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  const allTeamSummaries = useMemo(() => {
    if (!store) return [];
    return (store.teams || [])
      .map((t) => computeTeamSummary(t, store.properties))
      .sort((a, b) => b.netWorth - a.netWorth);
  }, [store]);

  const currentTeam = useMemo(() => {
    if ((!activeTeamId && !activeTeamName) || !allTeamSummaries.length) return null;
    return (
      allTeamSummaries.find(
        (t) =>
          (activeTeamId && String(t.id) === String(activeTeamId)) ||
          (activeTeamName && t.name.toLowerCase() === activeTeamName.toLowerCase()) ||
          (activeTeamName && t.username && t.username.toLowerCase() === activeTeamName.toLowerCase())
      ) || null
    );
  }, [activeTeamId, activeTeamName, allTeamSummaries]);

  // Detect new wheel spin outcomes:
  // 1. If my team spun -> show dialog that I landed on X and rent was settled / paid to owner
  // 2. If another team landed on my property -> show dialog that I collected rent from them (supports multiple teams paying for the same land!)
  // Rent settlement popup state (for paying rent & collecting rent)
  // Deterministic event keys prevent repeat popups across refreshes/logins.
  // Historical spins that existed before login are seeded once so they never trigger on login.
  useEffect(() => {
    if (!currentTeam || !store?.wheelSpinsByRound) return;

    const teamKey = String(currentTeam.id);

    // If this is the initial load for this team, seed existing spins so past spins never pop up on login!
    if (!initialSpinsSeededRef.current[teamKey]) {
      initialSpinsSeededRef.current[teamKey] = true;
      setDismissedRentKeys((prev) => {
        const teamMap = { ...(prev[teamKey] || {}) };
        Object.keys(store.wheelSpinsByRound).forEach((roundKey) => {
          const roundSpins = store.wheelSpinsByRound[roundKey] || {};
          Object.values(roundSpins).forEach((spin) => {
            if (!spin) return;
            teamMap[`payer_${roundKey}_${spin.propertyId}_${spin.teamId}`] = true;
            teamMap[`rcv_${roundKey}_${spin.teamId}_${spin.propertyId}`] = true;
          });
        });
        const next = { ...prev, [teamKey]: teamMap };
        try {
          localStorage.setItem('monopoly_dismissed_rent_keys', JSON.stringify(next));
        } catch (_) {}
        return next;
      });
      return;
    }

    const seenMap = dismissedRentKeys[teamKey] || {};
    const unseenPayerEvents = [];
    const unseenReceiverEvents = [];

    const rounds = Object.keys(store.wheelSpinsByRound);
    rounds.forEach((roundKey) => {
      const roundSpins = store.wheelSpinsByRound[roundKey] || {};
      Object.values(roundSpins).forEach((spin) => {
        if (!spin) return;

        // Ensure outcome is revealed by projector before popping up on team screens!
        // We wait until spin.revealed === true or store.lastWheelResult is revealed.
        // Fallback: If 15 seconds have elapsed, auto-reveal so teams are never stuck if projector is offline.
        const spinTime = spin.timestamp ? new Date(spin.timestamp).getTime() : 0;
        const isExpiredFallback = spinTime > 0 && (Date.now() - spinTime > 15000);
        const isRevealed = spin.revealed === true ||
          (store?.lastWheelResult?.propertyId === spin.propertyId &&
           String(store?.lastWheelResult?.teamId) === String(spin.teamId) &&
           store?.lastWheelResult?.revealed === true) ||
          isExpiredFallback;

        if (!isRevealed) {
          // Projector is still in suspense countdown or spinning wheel!
          return;
        }

        // 1. As Spinner (My team spun and landed on a property)
        if (String(spin.teamId) === teamKey) {
          const payerKey = `payer_${roundKey}_${spin.propertyId}_${spin.teamId}`;
          if (!seenMap[payerKey]) {
            unseenPayerEvents.push({ ...spin, eventKey: payerKey, roundKey });
          }
        }

        // 2. As Landlord (Another team landed on my property and paid rent)
        if (
          spin.status === 'PAID_RENT' &&
          String(spin.ownerTeamId) === teamKey &&
          String(spin.teamId) !== teamKey
        ) {
          const receiverKey = `rcv_${roundKey}_${spin.teamId}_${spin.propertyId}`;
          if (!seenMap[receiverKey]) {
            unseenReceiverEvents.push({ ...spin, eventKey: receiverKey, roundKey });
          }
        }
      });
    });

    if (unseenPayerEvents.length > 0) {
      setActiveRentDialog({
        type: 'PAYER',
        data: unseenPayerEvents[0],
        keysToDismiss: [unseenPayerEvents[0].eventKey]
      });
    } else if (unseenReceiverEvents.length > 0) {
      setActiveRentDialog({
        type: 'RECEIVER',
        events: unseenReceiverEvents,
        keysToDismiss: unseenReceiverEvents.map((e) => e.eventKey)
      });
    } else {
      setActiveRentDialog(null);
    }
  }, [store?.wheelSpinsByRound, store?.lastWheelResult, currentTeam?.id, dismissedRentKeys]);

  const handleDismissRentDialog = useCallback(() => {
    if (!activeRentDialog || !currentTeam) return;
    const teamKey = String(currentTeam.id);
    const keys = activeRentDialog.keysToDismiss || [];

    setDismissedRentKeys((prev) => {
      const teamMap = { ...(prev[teamKey] || {}) };
      keys.forEach((k) => {
        teamMap[k] = true;
      });
      const next = { ...prev, [teamKey]: teamMap };
      try {
        localStorage.setItem('monopoly_dismissed_rent_keys', JSON.stringify(next));
      } catch {}
      return next;
    });

    setActiveRentDialog(null);
  }, [activeRentDialog, currentTeam]);

  const inspectedProperty = useMemo(() => {
    if (!store || !inspectedPropertyId) return null;
    return store.properties.find((p) => Number(p.id) === Number(inspectedPropertyId)) || null;
  }, [store, inspectedPropertyId]);

  const contextProperty = useMemo(() => {
    if (!store || !contextMenu?.propertyId) return null;
    return store.properties.find((p) => Number(p.id) === Number(contextMenu.propertyId)) || null;
  }, [store, contextMenu]);

  const guideSampleProp = useMemo(() => {
    return KARACHI_PROPERTIES.find((p) => Number(p.id) === Number(guideSamplePropId)) || KARACHI_PROPERTIES[0];
  }, [guideSamplePropId]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoginError('');

    try {
      const { team, store: latestStore } = await authenticateMonopolyTeam({
        identifier: loginName,
        passcode: loginPasscode
      });
      if (latestStore) setStore(latestStore);
      setActiveTeamId(team.id);
      setActiveTeamName(team.name);
      showToast(`Signed in as ${team.name}`);
    } catch (err) {
      setLoginError(err.message || 'Authentication failed.');
    }
  };

  const handleSignOut = () => {
    setActiveTeamId('');
    setActiveTeamName('');
    try {
      sessionStorage.removeItem('investomania_monopoly_team_id');
      sessionStorage.removeItem('investomania_monopoly_team_name');
      localStorage.removeItem('investomania_monopoly_team_id');
      localStorage.removeItem('investomania_monopoly_team_name');
    } catch { }
    setIsSignOutModalOpen(false);
  };

  const handleBuyTokenFromBank = async (utilityId) => {
    if (!currentTeam) return;
    try {
      const updated = await buyUtilityTokenFromBank(currentTeam.id, utilityId);
      setStore(updated);
      const util = activeUtilities.find((u) => u.id === Number(utilityId));
      showToast(`Purchased ${util ? util.name : 'Token'} from Bank for Rs ${util ? util.cost : 0}L!`);
    } catch (err) {
      showToast(err.message || 'Failed to purchase token', 'error');
    }
  };

  const handleExecuteRecipeUpgrade = async (propertyId) => {
    if (!currentTeam) return;
    try {
      const updated = await executePropertySpecificationUpgrade(currentTeam.id, propertyId);
      setStore(updated);
      const prop = updated.properties.find((p) => p.id === Number(propertyId));
      showToast(`Successfully upgraded ${prop ? prop.name : 'Property'} to Level ${prop ? prop.upgradeLevel : ''}!`);
    } catch (err) {
      showToast(err.message || 'Failed to upgrade property', 'error');
    }
  };

  const handleInstallUtility = async (propertyId, utilityId) => {
    if (!currentTeam) return;
    try {
      const prevProp = store.properties.find((p) => Number(p.id) === Number(propertyId));
      const prevLvl = Number(prevProp?.upgradeLevel || 0);
      const updated = await attachUtilityToProperty({
        store,
        teamId: currentTeam.id,
        propertyId,
        utilityId
      });
      setStore(updated);
      const util = activeUtilities.find((u) => Number(u.id) === Number(utilityId));
      const prop = updated.properties.find((p) => Number(p.id) === Number(propertyId));
      const newLvl = Number(prop?.upgradeLevel || 0);
      if (newLvl > prevLvl) {
        showToast(`Installed ${util?.name}! ${prop?.name} UPGRADED to Level ${newLvl}!`);
      } else {
        showToast(`Attached ${util?.name} to ${prop?.name}`);
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleUpgradeProperty = async (propertyId) => {
    if (!currentTeam) return;
    try {
      const updated = await upgradePropertyLevel({
        store,
        teamId: currentTeam.id,
        propertyId
      });
      setStore(updated);
      const prop = updated.properties.find((p) => Number(p.id) === Number(propertyId));
      showToast(`${prop?.name} upgraded to Level ${prop?.upgradeLevel}`);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleTeamSpinWheel = async (propertyId) => {
    if (!currentTeam) return store;
    const updated = await executeTeamWheelSpinAndPayRent({
      store,
      teamId: currentTeam.id,
      propertyId
    });
    setStore(updated);
    const activeWave = Number(updated.currentWheelRound || 1);
    const spinRec = updated.wheelSpinsByRound?.[activeWave]?.[currentTeam.id];
    if (spinRec) {
      if (spinRec.status === 'PAID_RENT') {
        showToast(`Landed on ${spinRec.propertyName}: Paid Rs ${spinRec.rentAmount}L rent to ${spinRec.ownerTeamName}`);
      } else if (spinRec.status === 'OWN_PROPERTY') {
        showToast(`Landed on your own property (${spinRec.propertyName})`);
      } else {
        showToast(`Landed on ${spinRec.propertyName} (Unowned)`);
      }
    }
    return updated;
  };

  const onDragStartUtility = (e, utilityId) => {
    setDraggedUtilityId(utilityId);
    e.dataTransfer.setData('text/plain', String(utilityId));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const onDragOverPlot = (e, propertyId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (hoveredPropertyId !== propertyId) {
      setHoveredPropertyId(propertyId);
    }
  };

  const onDropOnPlot = (e, propertyId) => {
    e.preventDefault();
    const utilId = Number(e.dataTransfer.getData('text/plain') || draggedUtilityId);
    setHoveredPropertyId(null);
    setDraggedUtilityId(null);
    if (utilId) {
      handleInstallUtility(propertyId, utilId);
    }
  };

  const onPlotContextMenu = (e, propertyId) => {
    e.preventDefault();
    e.stopPropagation();
    const x = Math.min(e.clientX, window.innerWidth - 280);
    const y = Math.min(e.clientY, window.innerHeight - 340);
    setContextMenu({ x, y, propertyId });
  };

  const filteredCatalogue = useMemo(() => {
    if (!store) return [];
    return store.properties.filter((p) => {
      const dossier = KARACHI_PROPERTY_DOSSIERS[p.id] || {};
      const matchesCat = categoryFilter === 'ALL' || p.category.toLowerCase().includes(categoryFilter.toLowerCase());
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.zone && p.zone.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q) ||
        (dossier.importance && dossier.importance.toLowerCase().includes(q)) ||
        (dossier.problems && dossier.problems.toLowerCase().includes(q)) ||
        (dossier.benefits && dossier.benefits.toLowerCase().includes(q));
      return matchesCat && matchesQuery;
    });
  }, [store, categoryFilter, searchQuery]);

  if (!store) {
    return <EasyLoadingScreen message="Opening Market Monopoly..." />;
  }

  // =========================================================================
  // TEAM SIGN-IN VIEW (Matches Investomania LoginPage.jsx)
  // =========================================================================
  if (!currentTeam) {
    return (
      <div className="w-full min-h-screen flex flex-col justify-between p-4 sm:p-8">
        <header className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 py-2">
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none"
          >
            <img
              src={aesLogo}
              alt="Market Monopoly Logo"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-contain border border-[var(--border-soft)] p-1 bg-[var(--bg-card)] group-hover:scale-105 transition-transform shrink-0"
            />
            <span
              className="font-display text-lg sm:text-xl font-bold tracking-tight transition-colors"
              style={{ color: theme === 'light' ? 'var(--text-main)' : '#F1CA7E' }}
            >
              Market Monopoly
            </span>
          </div>

          <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
            <TactileButton
              onClick={() => navigate('/')}
              className="rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-rounded font-semibold border transition-all cursor-pointer shadow-xs"
              style={{
                backgroundColor: theme === 'aes' ? '#701020' : 'var(--bg-card)',
                color: theme === 'aes' ? '#F8EEE1' : 'var(--text-main)',
                borderColor: theme === 'aes' ? 'rgba(241, 202, 126, 0.35)' : 'var(--border-soft)'
              }}
            >
              All Modules
            </TactileButton>
            <TactileButton
              onClick={cycleTheme}
              className="rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-rounded font-semibold flex items-center gap-1.5 sm:gap-2 border transition-all cursor-pointer shadow-xs"
              style={{
                backgroundColor: theme === 'aes' ? '#701020' : theme === 'dark' ? '#240E15' : '#FFFFFF',
                color: theme === 'aes' ? '#F1CA7E' : theme === 'dark' ? '#E8DCC6' : '#5A0D1B',
                borderColor: theme === 'aes' ? '#F1CA7E' : 'var(--theme-btn-border)'
              }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: theme === 'aes' ? '#F1CA7E' : theme === 'dark' ? '#D9BB7C' : '#881B30' }}
              />
              <span className="font-bold">
                {theme === 'aes' ? 'AES Theme' : theme === 'dark' ? 'Dark Maroon' : 'White Theme'}
              </span>
            </TactileButton>
          </div>
        </header>

        <main className="my-auto py-8 w-full flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-full max-w-md surface-box rounded-[36px] p-7 sm:p-9 space-y-6"
          >
            <div className="text-center space-y-2">
              <img
                src={aesLogo}
                alt="Market Monopoly Logo"
                className="w-16 h-16 mx-auto object-contain drop-shadow-md mb-1"
              />
              <div className="inline-flex items-center gap-2 rounded-full bg-[#5E1B21] text-[#D9BB7C] px-4 py-1 text-xs font-rounded font-bold">
                Team Desk
              </div>
              <h1 className="font-display text-2xl sm:text-3xl" style={{ color: 'var(--text-main)' }}>
                Sign In to Your Team
              </h1>
            </div>

            {isMonopolyBlocked && (
              <div className="rounded-2xl bg-[#DC2626]/15 border border-[#DC2626]/40 px-4 py-2.5 text-xs font-rounded font-bold text-[#DC2626] text-center">
                Logins Locked: The Administrator has temporarily closed team sign-ins for Market Monopoly.
              </div>
            )}

            {loginError && (
              <div className="rounded-2xl bg-[#B83A3A]/15 border border-[#B83A3A]/40 px-4 py-2.5 text-xs font-rounded font-bold text-[#B83A3A] text-center">
                {loginError}
              </div>
            )}

            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-rounded font-bold px-2" style={{ color: 'var(--text-sub)' }}>
                  Team Name
                </label>
                <input
                  type="text"
                  required
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  placeholder="Enter Team Name"
                  className="w-full capsule-card rounded-full px-5 py-3 text-sm font-rounded font-semibold focus:outline-none"
                  style={{ color: 'var(--text-main)' }}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-rounded font-bold px-2" style={{ color: 'var(--text-sub)' }}>
                  Team Passcode
                </label>
                <input
                  type="password"
                  required
                  value={loginPasscode}
                  onChange={(e) => setLoginPasscode(e.target.value)}
                  placeholder="Enter Passcode"
                  className="w-full capsule-card rounded-full px-5 py-3 text-sm font-rounded font-semibold focus:outline-none"
                  style={{ color: 'var(--text-main)' }}
                />
              </div>

              <TactileButton
                type="submit"
                className="w-full rounded-full py-3.5 font-display font-bold text-sm shadow-lg btn-primary cursor-pointer"
              >
                Sign In
              </TactileButton>
            </form>
          </motion.div>
        </main>
      </div>
    );
  }

  // =========================================================================
  // MAIN WORKSPACE
  // =========================================================================
  const isRankingsVisible = store.showRankings === true;
  const sidebarItems = [
    { id: 'land', label: 'My Land', badge: currentTeam.propertyCount },
    { id: 'buy-resources', label: 'Store', badge: '15 Tokens' },
    { id: 'bank', label: 'History', badge: store.transactions?.length || 0 },
    ...(isRankingsVisible ? [{ id: 'standings', label: 'Rankings', badge: store.teams?.length || 0 }] : []),
    { id: 'guide', label: 'Guide', badge: 'Handbook' },
    { id: 'catalogue', label: 'Info', badge: '25P·15R' }
  ];

  return (
    <div className="w-full min-h-screen lg:h-screen lg:overflow-hidden flex flex-col lg:flex-row p-0">
      {/* FIXED ANCHORED LEFT SIDEBAR */}
      <div className="w-full lg:w-64 xl:w-72 lg:h-full shrink-0 p-3 sm:p-4 lg:p-5 lg:pr-0 flex flex-col z-30">
        <aside className="surface-box rounded-[24px] sm:rounded-[28px] lg:rounded-[32px] p-3.5 sm:p-4 flex flex-col justify-between w-full h-full shrink-0 gap-2.5 sm:gap-3 shadow-lg">
          <div className="flex flex-col items-stretch gap-2.5 sm:gap-3 w-full min-h-0 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 w-full shrink-0">
              <div
                onClick={() => navigate('/')}
                className="flex items-center gap-2.5 sm:gap-3 px-1 pt-1 shrink-0 cursor-pointer group"
              >
                <img
                  src={aesLogo}
                  alt="Market Monopoly"
                  className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl object-contain shrink-0 shadow-sm group-hover:scale-105 transition-transform p-1 bg-[var(--bg-card)] border border-[var(--border-soft)]"
                />
                <div className="block min-w-0">
                  <div className="font-display text-sm sm:text-lg font-bold leading-tight truncate" style={{ color: 'var(--text-main)' }}>
                    Market Monopoly
                  </div>
                  <span className="text-[10px] sm:text-xs font-rounded font-semibold block truncate" style={{ color: 'var(--text-sub)' }}>
                    Round {store.currentRound}
                  </span>
                </div>
              </div>

              <div className="flex lg:hidden items-center justify-end gap-1.5 sm:gap-2 shrink-0">
                <TactileButton
                  onClick={() => setIsMobileNavOpen(true)}
                  className="rounded-full py-1.5 px-3 text-[11px] sm:text-xs font-rounded font-bold border transition-all cursor-pointer shadow-sm"
                  style={{
                    backgroundColor: 'var(--tab-active-bg)',
                    color: 'var(--tab-active-text)',
                    borderColor: 'var(--border-active)'
                  }}
                >
                  Menu
                </TactileButton>

                <TactileButton
                  onClick={cycleTheme}
                  className="rounded-full py-1.5 px-2.5 text-xs font-rounded font-semibold flex items-center justify-center gap-1 border transition-all cursor-pointer"
                  style={{
                    backgroundColor: 'var(--theme-btn-bg)',
                    color: 'var(--theme-btn-text)',
                    borderColor: 'var(--theme-btn-border)'
                  }}
                >
                  {theme === 'aes' ? (
                    <IconSun className="w-3.5 h-3.5 text-[#89192C]" />
                  ) : theme === 'dark' ? (
                    <IconSun className="w-3.5 h-3.5 text-[#D9BB7C]" />
                  ) : (
                    <IconMoon className="w-3.5 h-3.5 text-[#6B1527]" />
                  )}
                </TactileButton>

                <TactileButton
                  onClick={() => setIsSignOutModalOpen(true)}
                  style={{
                    backgroundColor: 'var(--btn-signout-bg)',
                    color: 'var(--btn-signout-text)',
                    borderColor: 'var(--btn-signout-border)'
                  }}
                  className="rounded-full py-1.5 px-2.5 text-[11px] sm:text-xs font-rounded font-bold text-center transition-all border cursor-pointer shrink-0"
                >
                  Sign Out
                </TactileButton>
              </div>
            </div>

            {/* Desktop Team Summary Capsule */}
            <div className="capsule-card rounded-[24px] p-3.5 hidden lg:block border border-[var(--border-soft)] shrink-0 space-y-1">
              <div className="flex items-center justify-between text-xs font-rounded">
                <span className="font-bold truncate" style={{ color: 'var(--text-main)' }}>
                  {currentTeam.name}
                </span>
                <span className="inline-flex items-center gap-1 text-[#2E7D52] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#2E7D52]" /> Active
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-rounded font-bold" style={{ color: 'var(--text-sub)' }}>
                <span>Available Cash:</span>
                <strong className="font-mono" style={{ color: 'var(--text-main)' }}>Rs {currentTeam.cash}L</strong>
              </div>
              <div className="flex items-center justify-between text-xs font-rounded font-bold text-[#C0392B]">
                <span>Deducted Money:</span>
                <strong className="font-mono">-Rs {currentTeam.totalDeducted || 0}L</strong>
              </div>
              <div className="flex items-center justify-between text-xs font-rounded text-[#2E7D52] font-bold">
                <span>Portfolio Value:</span>
                <strong className="font-mono">Rs {currentTeam.netWorth}L</strong>
              </div>
            </div>

            {/* Desktop Navigation Pills */}
            <nav className="hidden lg:flex flex-col gap-2 overflow-y-auto no-scrollbar w-full py-1 flex-1 min-h-0 pr-0.5">
              {sidebarItems.map((item) => {
                const active = activeTab === item.id;
                return (
                  <TactileButton
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full whitespace-nowrap rounded-full px-4 py-2.5 flex items-center justify-between gap-2.5 text-xs font-rounded font-bold transition-all shrink-0 ${active
                        ? 'border-2 border-[var(--border-active)] shadow-sm'
                        : 'border-2 border-transparent opacity-80 text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--row-hover)]'
                      }`}
                    style={
                      active
                        ? {
                          backgroundColor: 'var(--tab-active-bg)',
                          color: 'var(--tab-active-text)'
                        }
                        : {}
                    }
                  >
                    <span className="truncate">{item.label}</span>
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-mono font-bold shrink-0"
                      style={
                        active
                          ? {
                            backgroundColor: 'var(--tab-badge-bg)',
                            color: 'var(--tab-badge-text)'
                          }
                          : {
                            backgroundColor: 'var(--bg-inset)',
                            color: 'var(--text-sub)'
                          }
                      }
                    >
                      {item.badge}
                    </span>
                  </TactileButton>
                );
              })}
            </nav>
          </div>

          <div className="hidden lg:flex flex-col gap-2 pt-3 border-t border-[var(--border-soft)] w-full shrink-0">
            <TactileButton
              onClick={cycleTheme}
              className="w-full rounded-full py-2.5 px-3 text-xs font-rounded font-semibold flex items-center justify-center gap-2 border transition-all cursor-pointer"
              style={{
                backgroundColor: 'var(--theme-btn-bg)',
                color: 'var(--theme-btn-text)',
                borderColor: 'var(--theme-btn-border)'
              }}
            >
              {theme === 'aes' ? (
                <>
                  <IconSun className="w-4 h-4 text-[#89192C]" />
                  <span className="font-bold">AES Theme</span>
                </>
              ) : theme === 'dark' ? (
                <>
                  <IconSun className="w-4 h-4 text-[#D9BB7C]" />
                  <span className="font-bold">Dark Maroon</span>
                </>
              ) : (
                <>
                  <IconMoon className="w-4 h-4 text-[#6B1527]" />
                  <span className="font-bold">White Theme</span>
                </>
              )}
            </TactileButton>

            <TactileButton
              onClick={() => setIsSignOutModalOpen(true)}
              style={{
                backgroundColor: 'var(--btn-signout-bg)',
                color: 'var(--btn-signout-text)',
                borderColor: 'var(--btn-signout-border)'
              }}
              className="w-full rounded-full py-2.5 px-3 text-xs font-rounded font-bold text-center transition-all border cursor-pointer hover:brightness-105"
            >
              Sign Out
            </TactileButton>
          </div>
        </aside>
      </div>

      {/* MAIN WORKSPACE */}
      <main className="flex-1 min-w-0 w-full lg:h-full lg:overflow-y-auto screen-scrollbar p-3 sm:p-4 lg:py-5 lg:pl-5 lg:pr-16 xl:pr-20 space-y-5">
        {/* COMPACT TOP PORTFOLIO BAR */}
        <div className="surface-box rounded-[28px] p-4 shadow-sm border border-[var(--border-card)] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#b81434]/15 text-[var(--border-active)] flex items-center justify-center shrink-0 border border-[var(--border-soft)]">
              <IconCalendar className="w-4 h-4 text-[var(--border-active)]" />
            </div>
            <div>
              <span className="text-[10px] font-rounded text-[var(--text-sub)] uppercase font-bold tracking-wider block">
                Round {store.currentRound} of 2
              </span>
              <h2 className="text-base sm:text-lg font-bold font-display" style={{ color: 'var(--text-main)' }}>
                {store.currentRound === 1 ? 'Property Auction' : 'Land & Utilities'}
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl capsule-card border border-[var(--border-soft)]">
              <IconWallet className="w-3.5 h-3.5 text-[var(--border-active)] shrink-0" />
              <span className="text-xs font-bold font-mono text-[var(--text-main)] tabular-nums">
                Cash: Rs {currentTeam.cash}L
              </span>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl capsule-card border border-[var(--border-soft)]">
              <span className="text-xs font-bold font-mono text-[#C0392B] tabular-nums">
                Deducted: -Rs {currentTeam.totalDeducted || 0}L
              </span>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl capsule-card border border-[var(--border-soft)]">
              <IconBriefcase className="w-3.5 h-3.5 text-[#2E7D52] shrink-0" />
              <span className="text-xs font-bold font-mono text-[var(--text-main)] tabular-nums">
                Properties: {currentTeam.propertyCount} · Resources: {(currentTeam.ownedResources || []).length}
              </span>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl capsule-card border border-[var(--border-soft)]">
              <IconTrendingUp className="w-3.5 h-3.5 text-[#2E7D52] shrink-0" />
              <span className="text-xs font-bold font-mono text-[#2E7D52] tabular-nums">
                Portfolio: Rs {currentTeam.netWorth}L
              </span>
            </div>
          </div>
        </div>

        {/* TAB CONTENT */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="w-full will-change-transform"
          >
            {/* ================================================================= */}
            {/* TAB 1: MY LAND (9 Cols, Extra Tall) + UTILITIES SHOP (3 Cols)     */}
            {/* ================================================================= */}
            {activeTab === 'land' && (
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-stretch">
                {/* LEFT 9 COLS: BIG UNIFIED KARACHI LAND GRID BOARD */}
                <div className="xl:col-span-9 flex flex-col">
                  <div className="surface-box rounded-[28px] p-5 border border-[var(--border-card)] min-h-[700px] lg:min-h-[760px] flex flex-col gap-4">
                    <div className="flex flex-wrap items-center justify-between border-b border-[var(--border-soft)] pb-3 shrink-0 gap-2">
                      <div>
                        <h3 className="font-display text-lg font-bold" style={{ color: 'var(--text-main)' }}>
                          Karachi Master Land Grid ({currentTeam.propertyCount} Owned Plots)
                        </h3>
                        <p className="text-[11px] font-rounded" style={{ color: 'var(--text-sub)' }}>
                          Click any property plot on the grid to inspect info, view Level 1–3 progression, or attach Bid Resources.
                        </p>
                      </div>
                      <span className="capsule-inset font-mono text-xs font-bold px-3 py-1 rounded-full" style={{ color: 'var(--text-main)' }}>
                        Rent Power: Rs {currentTeam.totalRentPower}L
                      </span>
                    </div>

                    {/* BIG UNIFIED LAND ESTATE GRID SURFACE */}
                    <div
                      className="flex-1 rounded-[24px] p-4 sm:p-5 border-2 relative overflow-hidden flex flex-col justify-between capsule-inset"
                      style={{
                        borderColor: 'var(--border-card)',
                        backgroundColor: 'var(--bg-inset)'
                      }}
                    >
                      {/* Subtle Architectural Survey Grid Lines Overlay (Theme-Adaptive) */}
                      <div
                        className="absolute inset-0 pointer-events-none opacity-60"
                        style={{
                          backgroundImage:
                            'linear-gradient(to right, var(--chart-grid) 1px, transparent 1px), linear-gradient(to bottom, var(--chart-grid) 1px, transparent 1px)',
                          backgroundSize: '44px 44px'
                        }}
                      />

                      {currentTeam.ownedProperties.length === 0 ? (
                        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center p-8 gap-2">
                          <div className="w-48 h-28 rounded-2xl overflow-hidden border border-[var(--border-card)] opacity-85">
                            <LandPlotIllustration category="Residential" level={0} showBadge={false} />
                          </div>
                          <span className="font-display text-base font-bold" style={{ color: 'var(--text-main)' }}>
                            Your Land Grid is Vacant
                          </span>
                          <span className="text-xs font-rounded max-w-sm" style={{ color: 'var(--text-sub)' }}>
                            Acquire properties from the Wheel Spin or Auction to place them onto your Karachi Master Land Grid.
                          </span>
                        </div>
                      ) : (
                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 content-start">
                          {currentTeam.ownedProperties.map((prop) => {
                            const val = computePropertyValuation(prop);
                            const rent = computePropertyRent(prop);
                            const attachedIds = Array.isArray(prop.attachedUtilities) ? prop.attachedUtilities : [];
                            const lvl = Math.min(3, Math.max(0, Number(prop.upgradeLevel || 0)));
                            const isDropTarget = hoveredPropertyId === prop.id;
                            const isSelected = Number(inspectedPropertyId) === Number(prop.id);

                            return (
                              <div
                                key={prop.id}
                                onClick={() => setInspectedPropertyId(prop.id)}
                                onDragOver={(e) => onDragOverPlot(e, prop.id)}
                                onDragLeave={() => setHoveredPropertyId(null)}
                                onDrop={(e) => onDropOnPlot(e, prop.id)}
                                onContextMenu={(e) => onPlotContextMenu(e, prop.id)}
                                className={`group relative rounded-2xl p-3 transition-all cursor-pointer select-none border-2 capsule-card flex flex-col gap-2.5 ${isDropTarget
                                    ? 'scale-[1.02] shadow-2xl ring-2 ring-[#ECC37A]'
                                    : isSelected
                                      ? 'shadow-xl ring-2 ring-[var(--border-active)]'
                                      : 'hover:shadow-lg'
                                  }`}
                                style={{
                                  backgroundColor: 'var(--bg-card)',
                                  borderColor:
                                    isDropTarget || isSelected ? 'var(--border-active)' : 'var(--border-card)'
                                }}
                              >
                                {/* Plot Title & Options Header */}
                                <div className="flex items-center justify-between gap-2">
                                  <h4
                                    className="font-display text-sm font-bold truncate"
                                    style={{ color: 'var(--text-main)' }}
                                  >
                                    {prop.name}
                                  </h4>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setInspectedPropertyId(prop.id);
                                    }}
                                    className="px-2.5 py-0.5 rounded-full text-[10px] font-rounded font-bold bg-[#701020] text-[#F1CA7E] hover:opacity-90 transition-opacity shrink-0"
                                  >
                                    Options
                                  </button>
                                </div>

                                {/* 3D Isometric Plot Tile */}
                                <div className="rounded-xl overflow-hidden">
                                  <LandPlotIllustration
                                    category={prop.category}
                                    level={lvl}
                                    utilityCount={attachedIds.length}
                                    isHighlighted={isDropTarget || isSelected}
                                  />
                                </div>

                                {/* Cost / Value / Rent Capsule */}
                                <div className="capsule-inset rounded-xl px-3 py-1.5 grid grid-cols-3 gap-2 text-center">
                                  <div>
                                    <span className="text-[9px] font-rounded block" style={{ color: 'var(--text-sub)' }}>
                                      Cost
                                    </span>
                                    <span className="font-mono text-xs font-bold" style={{ color: 'var(--text-main)' }}>
                                      Rs {prop.openingValue}L
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-[9px] font-rounded block" style={{ color: 'var(--text-sub)' }}>
                                      Value
                                    </span>
                                    <span className="font-mono text-xs font-bold text-[#2E7D52]">
                                      Rs {val}L
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-[9px] font-rounded block" style={{ color: 'var(--text-sub)' }}>
                                      Rent
                                    </span>
                                    <span className="font-mono text-xs font-bold" style={{ color: 'var(--text-main)' }}>
                                      Rs {rent}L
                                    </span>
                                  </div>
                                </div>

                                {/* LEVEL PROGRESS BAR & UPGRADE STATUS */}
                                <div className="capsule-inset rounded-xl px-3 py-2 space-y-1.5">
                                  <div className="flex items-center justify-between text-[10px] font-rounded font-bold">
                                    <span style={{ color: 'var(--text-sub)' }}>
                                      Level Progress ({attachedIds.length} Attached Tokens)
                                    </span>
                                    <span className="text-[#2E7D52]">
                                      {lvl >= 3 ? 'Level 3 Max' : `Level ${lvl} / 3`}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-3 gap-1.5">
                                    {[1, 2, 3].map((step) => (
                                      <div
                                        key={step}
                                        className={`h-2 rounded-full transition-all ${lvl >= step ? 'bg-[#2E7D52]' : 'bg-black/15 dark:bg-white/15'
                                          }`}
                                      />
                                    ))}
                                  </div>
                                </div>

                                {/* WHAT RESOURCES NEEDED TO UPGRADE IN LAND */}
                                {lvl < 3 ? (() => {
                                  const nextLvl = lvl + 1;
                                  const reqs = (prop.upgradeRequirements && prop.upgradeRequirements[String(nextLvl)]) || [];
                                  const costs = prop.upgradeCosts || [10, 15, 20];
                                  const cashCost = costs[nextLvl - 1] || 10;
                                  const hasCash = Number(currentTeam.cash || 0) >= cashCost;
                                  const targetVal = prop.targetValues?.[nextLvl] || prop.level3Target;

                                  const attachedToProp = (prop.attachedUtilities || []).map(Number);
                                  const unassignedTokens = (currentTeam.ownedResources || []).filter((r) => !r.attachedToPropertyId);

                                  let allTokensReady = true;
                                  let allTokensInstalled = reqs.length > 0;
                                  const recipeStatus = reqs.map((item) => {
                                    const uId = Number(item.utilityId);
                                    const countNeeded = Number(item.count || 1);
                                    const installed = attachedToProp.filter((id) => id === uId).length;
                                    const inBag = unassignedTokens.filter((r) => Number(r.utilityId) === uId).length;
                                    const totalHave = installed + inBag;
                                    if (totalHave < countNeeded) allTokensReady = false;
                                    if (installed < countNeeded) allTokensInstalled = false;
                                    return {
                                      ...item,
                                      have: totalHave,
                                      installed,
                                      needed: countNeeded,
                                      ready: totalHave >= countNeeded,
                                      isFullyInstalled: installed >= countNeeded
                                    };
                                  });
                                  const canUpgradeCard = allTokensInstalled || (hasCash && allTokensReady);

                                  return (
                                    <div className="p-2.5 rounded-xl border border-[var(--border-soft)] capsule-card space-y-2">
                                      <div className="flex items-center justify-between text-[10.5px] font-rounded font-bold border-b border-[var(--border-soft)] pb-1.5">
                                        <div>
                                          <span className="text-[9px] font-mono uppercase text-[#2E7D52] block font-bold">
                                            Next Upgrade
                                          </span>
                                          <span style={{ color: 'var(--text-main)' }}>
                                            Level {nextLvl} (Target: Rs {targetVal}L)
                                          </span>
                                        </div>
                                        <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                          allTokensInstalled || hasCash ? 'bg-[#2E7D52]/15 text-[#2E7D52]' : 'bg-[#C0392B]/15 text-[#C0392B]'
                                        }`}>
                                          {allTokensInstalled ? 'Ready to Upgrade' : `Rs ${cashCost}L ${hasCash ? '[Ready]' : `[Need Rs ${cashCost - Number(currentTeam.cash || 0)}L]`}`}
                                        </span>
                                      </div>

                                      {/* Token Requirements Checklist */}
                                      <div className="space-y-1">
                                        <span className="text-[9.5px] font-rounded font-bold block" style={{ color: 'var(--text-sub)' }}>
                                          Required Utility Tokens:
                                        </span>
                                        <div className="flex flex-wrap gap-1">
                                          {recipeStatus.map((item) => (
                                            <span
                                              key={item.utilityId}
                                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9.5px] font-rounded font-bold border ${
                                                item.isFullyInstalled
                                                  ? 'bg-[#2E7D52]/20 text-[#2E7D52] border-[#2E7D52]/50'
                                                  : item.ready
                                                  ? 'bg-[#D97706]/15 text-[#D97706] border-[#D97706]/40'
                                                  : 'bg-[#C0392B]/10 text-[#C0392B] border-[#C0392B]/30'
                                              }`}
                                            >
                                              <UtilityIcon id={item.utilityId} className="w-2.5 h-2.5 shrink-0" />
                                              <span>{item.count}× {item.utilityName}</span>
                                              <span className="font-mono text-[8.5px] opacity-90">
                                                {item.isFullyInstalled ? '[Installed]' : `(${item.have}/${item.needed})`}
                                              </span>
                                            </span>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Upgrade Execution or Action Prompt */}
                                      <div className="pt-1">
                                        {canUpgradeCard ? (
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleExecuteRecipeUpgrade(prop.id);
                                            }}
                                            className="w-full py-1.5 px-3 rounded-xl text-xs font-rounded font-bold bg-[#2E7D52] hover:bg-[#256643] text-white transition-all cursor-pointer shadow-sm text-center"
                                          >
                                            {allTokensInstalled
                                              ? `Complete Level ${nextLvl} Upgrade`
                                              : `Upgrade to Level ${nextLvl} (Cost: Rs ${cashCost}L)`}
                                          </button>
                                        ) : (
                                          <div className="flex items-center justify-between gap-1.5 text-[10px] font-rounded">
                                            <span className="text-[#C0392B] font-bold truncate">
                                              {!hasCash && allTokensReady
                                                ? `Need Rs ${cashCost - Number(currentTeam.cash || 0)}L cash`
                                                : 'Missing tokens to upgrade'}
                                            </span>
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveTab('buy-resources');
                                              }}
                                              className="px-2.5 py-1 rounded-lg text-[10px] font-rounded font-bold bg-[#701020] text-[#F1CA7E] hover:opacity-90 transition-opacity cursor-pointer shrink-0"
                                            >
                                              Store
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })() : (
                                  <div className="p-2.5 rounded-xl bg-[#2E7D52]/10 border border-[#2E7D52]/30 text-center space-y-0.5">
                                    <span className="text-[10px] font-mono font-bold uppercase text-[#2E7D52] block">
                                      Max Level 3 Achieved
                                    </span>
                                    <span className="text-[10px] font-rounded" style={{ color: 'var(--text-sub)' }}>
                                      Full Valuation Rs {prop.level3Target}L · Rent Rs {rent}L
                                    </span>
                                  </div>
                                )}

                                {/* Attached Resource Badges */}
                                {attachedIds.length > 0 && (
                                  <div className="flex items-center gap-1 flex-wrap">
                                    {attachedIds.map((uId) => {
                                      const util = activeUtilities.find((u) => u.id === Number(uId));
                                      if (!util) return null;
                                      return (
                                        <span
                                          key={uId}
                                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-rounded font-bold"
                                          style={{
                                            backgroundColor: 'var(--resource-badge-bg)',
                                            color: 'var(--resource-badge-text)'
                                          }}
                                        >
                                          <UtilityIcon id={util.id} className="w-2.5 h-2.5" />
                                          <span className="truncate max-w-[90px]">{util.name}</span>
                                        </span>
                                      );
                                    })}
                                  </div>
                                )}

                                {/* Bottom Action Footer */}
                                <div className="mt-auto pt-1 flex items-center justify-between gap-2 text-[10px] font-rounded font-bold">
                                  {lvl >= 3 ? (
                                    <span style={{ color: 'var(--text-sub)' }}>Maximum Level 3 Reached</span>
                                  ) : (
                                    <span className="text-[#2E7D52] font-semibold">Inspect full recipe & attach</span>
                                  )}
                                  <span
                                    className="capsule-inset px-2.5 py-0.5 rounded-full text-[10px] font-rounded font-bold"
                                    style={{ color: 'var(--text-main)' }}
                                  >
                                    Inspect Plot
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Grid Legend Footer */}
                      <div
                        className="relative z-10 mt-4 pt-3 border-t border-[var(--border-soft)] flex flex-wrap items-center justify-between gap-2 text-[11px] font-rounded"
                        style={{ color: 'var(--text-sub)' }}
                      >
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#ECC37A] border border-black/20 inline-block" />
                            <span style={{ color: 'var(--text-main)' }}>Level 1–3 3D Plots</span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D52] inline-block" />
                            <span>Click any plot to inspect full info & attach resources</span>
                          </span>
                        </div>
                        <span className="font-mono text-[10px] font-bold" style={{ color: 'var(--text-main)' }}>
                          Total Plots on Grid: {currentTeam.ownedProperties.length} / 25
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT 3 COLS: YOUR BID RESOURCES (DRAG TO LAND TO LEVEL UP) */}
                <div className="xl:col-span-3 flex flex-col">
                  <div className="surface-box rounded-[28px] p-4 border border-[var(--border-card)] min-h-[700px] lg:min-h-[760px] flex flex-col gap-3">
                    <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-2.5 shrink-0">
                      <h3 className="font-display text-sm font-bold" style={{ color: 'var(--text-main)' }}>
                        Your Utility Tokens ({(currentTeam.ownedResources || []).filter((r) => !r.attachedToPropertyId).length})
                      </h3>
                      <span className="text-[10px] font-rounded font-bold px-2 py-0.5 rounded-full bg-[#701020] text-[#F1CA7E]">
                        Drag to Level Up
                      </span>
                    </div>

                                        <div className="space-y-2 overflow-y-auto modal-scrollbar pr-1 flex-1">
                      {(() => {
                        const unassignedList = (currentTeam.ownedResources || []).filter((r) => !r.attachedToPropertyId);
                        if (unassignedList.length === 0) {
                          return (
                            <div className="p-4 rounded-2xl capsule-inset text-center space-y-2">
                              <span className="block text-xs font-rounded font-bold" style={{ color: 'var(--text-main)' }}>
                                No Unassigned Resources
                              </span>
                              <span className="block text-[11px] font-rounded" style={{ color: 'var(--text-sub)' }}>
                                Buy utility tokens in the Bank Store to apply them toward property upgrades.
                              </span>
                              <TactileButton
                                onClick={() => setActiveTab('buy-resources')}
                                className="btn-primary rounded-full px-3.5 py-1.5 text-xs font-rounded font-bold cursor-pointer inline-block"
                              >
                                Open Store
                              </TactileButton>
                            </div>
                          );
                        }

                        // Group unassigned tokens by utilityId so users see exact quantity count (e.g., "x3")
                        const groups = {};
                        unassignedList.forEach((r) => {
                          const uid = Number(r.utilityId);
                          if (!groups[uid]) {
                            const totalOwned = (currentTeam.ownedResources || []).filter(
                              (item) => Number(item.utilityId) === uid
                            ).length;
                            groups[uid] = {
                              utilityId: uid,
                              name: r.name || r.utilityName,
                              category: r.category,
                              availableCount: 0,
                              totalOwned,
                              firstInstanceId: r.instanceId || r.id
                            };
                          }
                          groups[uid].availableCount += 1;
                        });

                        return Object.values(groups).map((grp) => (
                          <div
                            key={grp.utilityId}
                            draggable
                            onDragStart={(e) => onDragStartUtility(e, grp.utilityId)}
                            onDragEnd={() => {
                              setDraggedUtilityId(null);
                              setHoveredPropertyId(null);
                            }}
                            className="p-2.5 rounded-2xl capsule-card border-2 border-[#2E7D52]/50 hover:border-[var(--border-active)] transition-all cursor-grab active:cursor-grabbing flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors relative"
                                style={{
                                  backgroundColor: 'var(--resource-icon-bg)',
                                  borderColor: 'var(--resource-badge-border)'
                                }}
                              >
                                <UtilityIcon id={grp.utilityId} className="w-4 h-4" style={{ color: 'var(--resource-icon-color)' }} />
                                {grp.availableCount > 1 && (
                                  <span className="absolute -top-1.5 -right-1.5 bg-[#2E7D52] text-white text-[9px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                                    {grp.availableCount}
                                  </span>
                                )}
                              </div>
                              <div className="min-w-0">
                                <span className="text-xs font-rounded font-bold truncate block" style={{ color: 'var(--text-main)' }}>
                                  {grp.name}
                                </span>
                                <span className="text-[10px] font-mono text-[#2E7D52] font-semibold block">
                                  Qty: {grp.availableCount} available {grp.totalOwned > grp.availableCount ? `(${grp.totalOwned} total)` : ''}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-[#2E7D52]/15 text-[#2E7D52] border border-[#2E7D52]/30">
                                ×{grp.availableCount}
                              </span>

                              {currentTeam.ownedProperties.length > 0 && (
                                <TactileButton
                                  onClick={() => {
                                    const targetProp =
                                      currentTeam.ownedProperties.find(
                                        (p) =>
                                          (p.attachedUtilities || []).length < 3 &&
                                          !(p.attachedUtilities || []).includes(grp.utilityId)
                                      ) || currentTeam.ownedProperties[0];
                                    handleInstallUtility(targetProp.id, grp.utilityId);
                                  }}
                                  className="px-2.5 py-1 rounded-full text-[10px] font-rounded font-bold btn-primary"
                                >
                                  Attach
                                </TactileButton>
                              )}
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            )}



            {/* ================================================================= */}

            {/* ============================================================= */}
            {/* TAB: BANK STORE (BUY TOKENS & UTILITIES FROM BANK)          */}
            {/* ============================================================= */}
            {activeTab === 'buy-resources' && (
              <div className="space-y-6">
                {/* Top Header Card */}
                <div className="surface-box rounded-[28px] p-5 sm:p-6 border border-[var(--border-card)] space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-soft)] pb-4">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-[#701020] text-[#F1CA7E] px-3 py-1 text-xs font-mono font-bold uppercase mb-1.5">
                        Utility Store · 15 Token Classes
                      </div>
                      <h3 className="font-display text-2xl font-bold" style={{ color: 'var(--text-main)' }}>
                        Municipal Infrastructure & Utility Tokens
                      </h3>
                      <p className="text-xs font-rounded mt-1 max-w-2xl" style={{ color: 'var(--text-sub)' }}>
                        Buy utility utility tokens directly using your team cash from the Store. These tokens satisfy the exact Level 1, 2, and 3 development recipes for your Karachi properties.
                      </p>
                    </div>

                    {/* Cash Balance Indicator */}
                    <div className="capsule-inset rounded-2xl p-3.5 border border-[var(--border-card)] shrink-0 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#2E7D52]/20 text-[#2E7D52]">
                        <IconWallet className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase font-bold block" style={{ color: 'var(--text-sub)' }}>
                          Available Team Cash
                        </span>
                        <strong className="font-mono text-xl font-bold text-[#2E7D52]">
                          Rs {currentTeam.cash}L
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Quick Inventory Summary of What the Team Owns */}
                  <div className="capsule-card rounded-2xl p-4 border border-[var(--border-soft)] space-y-2">
                    <div className="flex items-center justify-between text-xs font-rounded font-bold">
                      <span style={{ color: 'var(--text-main)' }}>
                        Your Owned Utility Token Inventory ({(currentTeam.ownedResources || []).length} Total)
                      </span>
                      <span className="text-xs font-mono text-[#2E7D52]">
                        {(currentTeam.ownedResources || []).filter(r => !r.attachedToPropertyId).length} Available for Upgrades
                      </span>
                    </div>

                    {(currentTeam.ownedResources || []).length === 0 ? (
                      <p className="text-xs font-rounded opacity-70" style={{ color: 'var(--text-sub)' }}>
                        Your team does not own any utility tokens yet. Purchase tokens below or win them in the Admin Resource Bid.
                      </p>
                    ) : (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {activeUtilities.map((u) => {
                          const total = (currentTeam.ownedResources || []).filter(r => Number(r.utilityId) === Number(u.id)).length;
                          const unassigned = (currentTeam.ownedResources || []).filter(r => Number(r.utilityId) === Number(u.id) && !r.attachedToPropertyId).length;
                          if (total === 0) return null;
                          return (
                            <span
                              key={u.id}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold border"
                              style={{
                                backgroundColor: 'var(--resource-badge-bg)',
                                color: 'var(--resource-badge-text)',
                                borderColor: 'var(--resource-badge-border)'
                              }}
                            >
                              <UtilityIcon id={u.id} className="w-3.5 h-3.5" style={{ color: 'var(--resource-icon-color)' }} />
                              <span>{u.name}</span>
                              <span className="bg-[#2E7D52] text-white px-1.5 py-0.2 rounded-full text-[9px]">
                                {unassigned} avail ({total} total)
                              </span>
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* 15 UTILITY TOKENS GRID FOR DIRECT PURCHASE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                  {activeUtilities.map((res) => {
                    const cost = Number(res.cost || 0);
                    const canAfford = Number(currentTeam.cash || 0) >= cost;
                    const ownedCopies = (currentTeam.ownedResources || []).filter(
                      (r) => Number(r.utilityId) === Number(res.id)
                    ).length;
                    const readyCopies = (currentTeam.ownedResources || []).filter(
                      (r) => Number(r.utilityId) === Number(res.id) && !r.attachedToPropertyId
                    ).length;

                    return (
                      <div
                        key={res.id}
                        className="surface-box rounded-2xl p-4 sm:p-5 border border-[var(--border-card)] flex flex-col justify-between gap-3 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="space-y-3">
                          {/* Card Top: ID, Category & Inventory Count */}
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#701020] text-[#F1CA7E]">
                              #{res.id} · {res.category}
                            </span>
                            {ownedCopies > 0 ? (
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#2E7D52] text-white">
                                {readyCopies} Ready ({ownedCopies} Owned)
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono opacity-70" style={{ color: 'var(--text-sub)' }}>
                                In Stock
                              </span>
                            )}
                          </div>

                          {/* Token Icon & Title */}
                          <div className="flex items-start gap-3">
                            <div
                              className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border transition-colors shadow-sm"
                              style={{
                                backgroundColor: 'var(--resource-icon-bg)',
                                borderColor: 'var(--resource-badge-border)'
                              }}
                            >
                              <UtilityIcon id={res.id} className="w-5 h-5" style={{ color: 'var(--resource-icon-color)' }} />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-display text-base font-bold truncate" style={{ color: 'var(--text-main)' }}>
                                {res.name}
                              </h4>
                              <span className="text-xs font-mono font-bold text-[#2E7D52] block">
                                Bank Price: Rs {cost} Lakh
                              </span>
                            </div>
                          </div>

                          {/* Summary / Game Theme Effect */}
                          <p className="text-xs font-rounded leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                            {res.summary}
                          </p>
                        </div>

                        {/* Purchase Action Button */}
                        <div className="pt-3 border-t border-[var(--border-soft)] flex items-center justify-between gap-2">
                          <div className="space-y-0.5">
                            <span className="text-[11px] font-mono block" style={{ color: 'var(--text-sub)' }}>
                              Price: <strong style={{ color: 'var(--text-main)' }}>Rs {cost}L</strong>
                            </span>
                            <span className="text-[10px] font-rounded font-semibold block" style={{ color: ownedCopies > 0 ? '#2E7D52' : 'var(--text-sub)' }}>
                              You own: <strong className="font-mono">{ownedCopies}</strong> ({readyCopies} available)
                            </span>
                          </div>

                          <TactileButton
                            disabled={!canAfford}
                            onClick={() => setPurchasingUtilityId(res.id)}
                            className={`rounded-full px-4 py-1.5 text-xs font-rounded font-bold transition-all cursor-pointer ${canAfford
                                ? 'btn-primary shadow-sm hover:scale-[1.02]'
                                : 'opacity-40 cursor-not-allowed capsule-inset'
                              }`}
                            style={!canAfford ? { color: 'var(--text-sub)' } : undefined}
                          >
                            {canAfford ? `Buy for Rs ${cost}L` : 'Insufficient Cash'}
                          </TactileButton>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: BANK HISTORY (TEAM LEDGER & PORTFOLIO LOG)                */}
            {/* ================================================================= */}
            {activeTab === 'bank' && (() => {
              // Participant portal only displays events concerning the current team
              const allTxs = (Array.isArray(store.transactions) ? store.transactions : []).filter((tx) => {
                if (!currentTeam) return false;
                const teamIdStr = String(currentTeam.id);
                const teamNameLower = (currentTeam.name || '').toLowerCase();
                return (
                  String(tx.teamId) === teamIdStr ||
                  String(tx.targetTeamId) === teamIdStr ||
                  String(tx.ownerTeamId) === teamIdStr ||
                  (tx.teamName && tx.teamName.toLowerCase() === teamNameLower) ||
                  (tx.targetTeamName && tx.targetTeamName.toLowerCase() === teamNameLower) ||
                  (tx.note && tx.note.toLowerCase().includes(teamNameLower))
                );
              });
              const teamOwnedProps = currentTeam.ownedProperties || [];
              const teamOwnedResources = Array.isArray(currentTeam.ownedResources)
                ? currentTeam.ownedResources
                : [];
              const propTransactions = allTxs.filter(
                (tx) =>
                  tx.type === 'AUCTION_WIN' ||
                  tx.type === 'SALE_REVOKED' ||
                  tx.category === 'PROPERTY'
              );
              const resourceTransactions = allTxs.filter(
                (tx) =>
                  tx.type === 'RESOURCE_BID_WIN' ||
                  tx.type === 'RESOURCE_REVOKED' ||
                  tx.type === 'RESOURCE_LEVEL_UP' ||
                  tx.category === 'RESOURCE'
              );

              return (
                <div className="space-y-5">
                  {/* 1. PORTFOLIO MONEY & DEDUCTED MONEY SUMMARY BANNER */}
                  <div className="surface-box rounded-[28px] p-5 sm:p-6 border border-[var(--border-card)] space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-soft)] pb-3">
                      <div>
                        <span className="text-xs font-mono uppercase font-bold tracking-wider block" style={{ color: 'var(--text-sub)' }}>
                          {currentTeam.name} · Financial & Asset Ledger
                        </span>
                        <h3 className="font-display text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-main)' }}>
                          Money, Deducted Money & Portfolio History
                        </h3>
                      </div>
                      <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-[#701020] text-[#F1CA7E] self-start sm:self-auto">
                        Starting Budget: Rs {currentTeam.startingBudget || 500}L
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      <div className="p-4 rounded-2xl capsule-card border border-[var(--border-soft)] space-y-1">
                        <span className="text-[11px] font-rounded font-bold uppercase block" style={{ color: 'var(--text-sub)' }}>
                          Available Money
                        </span>
                        <strong className="font-mono text-lg sm:text-xl font-bold block" style={{ color: 'var(--text-main)' }}>
                          Rs {currentTeam.cash}L
                        </strong>
                        <span className="text-[10px] font-mono block" style={{ color: 'var(--text-sub)' }}>
                          From Rs {currentTeam.startingBudget || 500}L start
                        </span>
                      </div>

                      <div className="p-4 rounded-2xl capsule-card border border-[#C0392B]/40 space-y-1">
                        <span className="text-[11px] font-rounded font-bold uppercase block text-[#C0392B]">
                          Total Deducted Money
                        </span>
                        <strong className="font-mono text-lg sm:text-xl font-bold block text-[#C0392B]">
                          -Rs {currentTeam.totalDeducted || 0}L
                        </strong>
                        <span className="text-[10px] font-mono block" style={{ color: 'var(--text-sub)' }}>
                          Props: {currentTeam.propertySpent || 0}L · Res: {currentTeam.resourceSpent || 0}L
                        </span>
                      </div>

                      <div className="p-4 rounded-2xl capsule-card border border-[var(--border-soft)] space-y-1">
                        <span className="text-[11px] font-rounded font-bold uppercase block" style={{ color: 'var(--text-sub)' }}>
                          Properties Portfolio ({teamOwnedProps.length})
                        </span>
                        <strong className="font-mono text-lg sm:text-xl font-bold block text-[#2E7D52]">
                          Rs {currentTeam.propertyValuation}L
                        </strong>
                        <span className="text-[10px] font-mono block" style={{ color: 'var(--text-sub)' }}>
                          Rent Power: Rs {currentTeam.totalRentPower}L
                        </span>
                      </div>

                      <div className="p-4 rounded-2xl capsule-card border border-[var(--border-soft)] space-y-1">
                        <span className="text-[11px] font-rounded font-bold uppercase block" style={{ color: 'var(--text-sub)' }}>
                          Resources Received ({teamOwnedResources.length})
                        </span>
                        <strong className="font-mono text-lg sm:text-xl font-bold block" style={{ color: 'var(--text-main)' }}>
                          Rs {currentTeam.resourceSpent || 0}L
                        </strong>
                        <span className="text-[10px] font-mono block" style={{ color: 'var(--text-sub)' }}>
                          {teamOwnedResources.filter((r) => r.attachedToPropertyId).length} Attached ·{' '}
                          {teamOwnedResources.filter((r) => !r.attachedToPropertyId).length} Ready
                        </span>
                      </div>

                      <div className="p-4 rounded-2xl capsule-card border-2 border-[#2E7D52] space-y-1 col-span-2 md:col-span-1">
                        <span className="text-[11px] font-rounded font-bold uppercase block text-[#2E7D52]">
                          Total Net Worth
                        </span>
                        <strong className="font-mono text-lg sm:text-xl font-bold block text-[#2E7D52]">
                          Rs {currentTeam.netWorth}L
                        </strong>
                        <span className="text-[10px] font-mono block" style={{ color: 'var(--text-sub)' }}>
                          Cash + Land + Resources
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 2. SIDE-BY-SIDE HEADLINES: PROPERTIES RECEIVED vs RESOURCES RECEIVED */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                    {/* PROPERTIES HEADLINE SECTION */}
                    <div className="surface-box rounded-[28px] p-5 border border-[var(--border-card)] space-y-4">
                      <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-3">
                        <div>
                          <span className="text-[10px] font-mono uppercase font-bold text-[#2E7D52] block">
                            Properties Headline
                          </span>
                          <h4 className="font-display text-lg font-bold" style={{ color: 'var(--text-main)' }}>
                            Properties You Received ({teamOwnedProps.length})
                          </h4>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold capsule-inset text-[#C0392B]">
                          Deducted: -Rs {currentTeam.propertySpent || 0}L
                        </span>
                      </div>

                      {teamOwnedProps.length === 0 ? (
                        <div className="p-6 rounded-2xl capsule-inset text-center">
                          <p className="text-xs font-rounded font-bold" style={{ color: 'var(--text-sub)' }}>
                            No properties received yet. When the Admin assigns properties to {currentTeam.name}, they appear here with their price and rent details.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2.5 max-h-[380px] overflow-y-auto modal-scrollbar pr-1">
                          {teamOwnedProps.map((prop) => {
                            const val = computePropertyValuation(prop);
                            const rent = computePropertyRent(prop);
                            const paid = Number(prop.purchasePrice || prop.openingValue || 0);
                            const lvl = Math.min(3, Math.max(0, Number(prop.upgradeLevel || 0)));
                            return (
                              <div
                                key={prop.id}
                                className="p-4 rounded-2xl capsule-card border border-[var(--border-soft)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#701020] text-[#F1CA7E]">
                                      #{prop.id} · {prop.category}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#2E7D52]/15 text-[#2E7D52]">
                                      Level {lvl}/3
                                    </span>
                                  </div>
                                  <h5 className="font-display text-base font-bold" style={{ color: 'var(--text-main)' }}>
                                    You received {prop.name}
                                  </h5>
                                  <p className="text-xs font-rounded" style={{ color: 'var(--text-sub)' }}>
                                    Current Valuation: <strong className="text-[#2E7D52]">Rs {val}L</strong> · Rent Power: <strong>Rs {rent}L</strong>
                                  </p>
                                </div>

                                <div className="text-left sm:text-right shrink-0 font-mono">
                                  <span className="text-xs font-bold text-[#C0392B] block">
                                    -Rs {paid}L Deducted
                                  </span>
                                  <span className="text-[11px] text-[#2E7D52] font-bold block">
                                    +Rs {val}L Asset Value
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* RESOURCES HEADLINE SECTION */}
                    <div className="surface-box rounded-[28px] p-5 border border-[var(--border-card)] space-y-4">
                      <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-3">
                        <div>
                          <span className="text-[10px] font-mono uppercase font-bold text-[#F1CA7E] bg-[#701020] px-2 py-0.5 rounded inline-block mb-0.5">
                            Resources Headline
                          </span>
                          <h4 className="font-display text-lg font-bold" style={{ color: 'var(--text-main)' }}>
                            Resources You Received ({teamOwnedResources.length})
                          </h4>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold capsule-inset text-[#C0392B]">
                          Deducted: -Rs {currentTeam.resourceSpent || 0}L
                        </span>
                      </div>

                      {teamOwnedResources.length === 0 ? (
                        <div className="p-6 rounded-2xl capsule-inset text-center">
                          <p className="text-xs font-rounded font-bold" style={{ color: 'var(--text-sub)' }}>
                            No utility tokens purchased yet. Tokens purchased from the Bank Store appear here.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2.5 max-h-[380px] overflow-y-auto modal-scrollbar pr-1">
                          {teamOwnedResources.map((res) => (
                            <div
                              key={res.instanceId}
                              className="p-4 rounded-2xl capsule-card border border-[var(--border-soft)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border transition-colors shadow-sm"
                                  style={{
                                    backgroundColor: 'var(--resource-icon-bg)',
                                    borderColor: 'var(--resource-badge-border)'
                                  }}
                                >
                                  <UtilityIcon id={res.utilityId} className="w-4 h-4" style={{ color: 'var(--resource-icon-color)' }} />
                                </div>
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-[10px] font-mono font-bold uppercase" style={{ color: 'var(--text-sub)' }}>
                                      Resource #{res.utilityId} · {res.category}
                                    </span>
                                    <span
                                      className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border transition-colors"
                                      style={
                                        res.attachedToPropertyName
                                          ? {
                                            backgroundColor: 'rgba(46, 125, 82, 0.15)',
                                            color: '#2E7D52',
                                            borderColor: 'rgba(46, 125, 82, 0.3)'
                                          }
                                          : {
                                            backgroundColor: 'var(--resource-badge-bg)',
                                            color: 'var(--resource-badge-text)',
                                            borderColor: 'var(--resource-badge-border)'
                                          }
                                      }
                                    >
                                      {res.attachedToPropertyName
                                        ? `Attached to ${res.attachedToPropertyName}`
                                        : 'In Inventory (Ready to Attach)'}
                                    </span>
                                  </div>
                                  <h5 className="font-display text-base font-bold" style={{ color: 'var(--text-main)' }}>
                                    You received {res.name}
                                  </h5>
                                  <p className="text-xs font-rounded" style={{ color: 'var(--text-sub)' }}>
                                    Boosts property level by +1 Level (up to Max Level 3)
                                  </p>
                                </div>
                              </div>

                              <div className="text-left sm:text-right shrink-0 font-mono">
                                <span className="text-xs font-bold text-[#C0392B] block">
                                  -Rs {res.bidPrice}L Deducted
                                </span>
                                <span className="text-[11px] text-[#2E7D52] font-bold block">
                                  +1 Property Level
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 3. FULL DETAILED TRANSACTION FEED (ALL TEAMS & YOUR TEAM) */}
                  <div className="surface-box rounded-[28px] p-5 sm:p-6 border border-[var(--border-card)] space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-soft)] pb-3">
                      <div>
                        <span className="text-xs font-mono uppercase font-bold block" style={{ color: 'var(--text-sub)' }}>
                          Team Activity Log ({allTxs.length} Events)
                        </span>
                        <h4 className="font-display text-lg sm:text-xl font-bold" style={{ color: 'var(--text-main)' }}>
                          {currentTeam.name} Financial & Asset History
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="px-2.5 py-1 rounded-full capsule-inset">
                          Properties: {propTransactions.length}
                        </span>
                        <span className="px-2.5 py-1 rounded-full capsule-inset">
                          Resources: {resourceTransactions.length}
                        </span>
                      </div>
                    </div>

                    {allTxs.length === 0 ? (
                      <div className="p-10 rounded-2xl text-center capsule-inset">
                        <p className="text-sm font-rounded font-bold" style={{ color: 'var(--text-sub)' }}>
                          No activity recorded for {currentTeam.name} yet.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[540px] overflow-y-auto modal-scrollbar pr-1">
                        {allTxs.map((tx) => {
                          const isMyTeam =
                            String(tx.teamId) === String(currentTeam.id) ||
                            String(tx.targetTeamId) === String(currentTeam.id) ||
                            (tx.teamName &&
                              tx.teamName.toLowerCase() === currentTeam.name.toLowerCase());

                          const isPropertyTx =
                            tx.type === 'AUCTION_WIN' ||
                            tx.type === 'SALE_REVOKED' ||
                            tx.category === 'PROPERTY';
                          const isResourceTx =
                            tx.type === 'RESOURCE_BID_WIN' ||
                            tx.type === 'RESOURCE_REVOKED' ||
                            tx.type === 'RESOURCE_LEVEL_UP' ||
                            tx.category === 'RESOURCE';
                          const isRentTx = tx.type === 'WHEEL_RENT';
                          const isRefund =
                            tx.type === 'SALE_REVOKED' || tx.type === 'RESOURCE_REVOKED';

                          let badgeLabel = 'SYSTEM';
                          let badgeStyle = { backgroundColor: 'var(--bg-inset)', color: 'var(--text-main)', borderColor: 'var(--border-soft)' };
                          if (isPropertyTx) {
                            badgeLabel = 'PROPERTY';
                            badgeStyle = { backgroundColor: '#2E7D52', color: '#FFFFFF', borderColor: '#2E7D52' };
                          } else if (isResourceTx) {
                            badgeLabel = 'RESOURCE';
                            badgeStyle = {
                              backgroundColor: 'var(--resource-badge-bg)',
                              color: 'var(--resource-badge-text)',
                              borderColor: 'var(--resource-badge-border)'
                            };
                          } else if (isRentTx) {
                            badgeLabel = 'WHEEL RENT';
                            badgeStyle = { backgroundColor: '#B42318', color: '#FFFFFF', borderColor: '#B42318' };
                          } else if (tx.type === 'ADMIN_CASH_ADJUST') {
                            badgeLabel = 'CASH ADJUST';
                            badgeStyle = { backgroundColor: 'var(--tab-active-bg)', color: 'var(--tab-active-text)', borderColor: 'var(--border-card)' };
                          }

                          return (
                            <div
                              key={tx.id}
                              className={`p-4 rounded-2xl capsule-card border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isMyTeam
                                  ? 'border-2 border-[var(--border-active)]'
                                  : 'border-[var(--border-soft)]'
                                }`}
                            >
                              <div className="space-y-1.5 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span
                                    className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border transition-colors inline-flex items-center gap-1"
                                    style={badgeStyle}
                                  >
                                    {isResourceTx && (
                                      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: 'var(--resource-icon-color)' }} />
                                    )}
                                    {badgeLabel}
                                  </span>
                                  {isMyTeam && (
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#2E7D52]/20 text-[#2E7D52] border border-[#2E7D52]/30">
                                      YOUR TEAM
                                    </span>
                                  )}
                                  {tx.teamName && (
                                    <span className="text-xs font-mono font-bold" style={{ color: 'var(--text-sub)' }}>
                                      Team: {tx.teamName}
                                    </span>
                                  )}
                                  {tx.createdAt && (
                                    <span className="text-[11px] font-mono opacity-75" style={{ color: 'var(--text-sub)' }}>
                                      · {new Date(tx.createdAt).toLocaleTimeString()}
                                    </span>
                                  )}
                                </div>

                                <p className="text-sm sm:text-base font-rounded font-bold" style={{ color: 'var(--text-main)' }}>
                                  {tx.note}
                                </p>

                                {/* Itemized Pills if multiple Properties or Resources were given */}
                                {Array.isArray(tx.items) && tx.items.length > 0 && (
                                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                                    {tx.items.map((item, idx) => (
                                      <span
                                        key={`${tx.id}_item_${idx}`}
                                        className="px-2.5 py-0.5 rounded-lg capsule-inset text-[11px] font-mono font-semibold border"
                                        style={{ color: 'var(--text-main)', borderColor: 'var(--border-soft)' }}
                                      >
                                        {item.name} (-Rs {item.price}L)
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {Number(tx.amount) > 0 && (
                                <div className="text-left sm:text-right shrink-0 font-mono">
                                  <span
                                    className={`text-sm sm:text-base font-bold block ${isRefund ? 'text-[#2E7D52]' : 'text-[#C0392B]'
                                      }`}
                                  >
                                    {isRefund ? `+Rs ${tx.amount}L Refunded` : `-Rs ${tx.amount}L Deducted`}
                                  </span>
                                  {tx.cashAfter !== undefined && (
                                    <span className="text-[11px] block" style={{ color: 'var(--text-sub)' }}>
                                      Balance After: Rs {tx.cashAfter}L
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* ================================================================= */}
            {/* TAB: RANKINGS (INVESTOMANIA 3D PODIUM & STANDINGS LEDGER)        */}
            {/* ================================================================= */}
            {activeTab === 'standings' && (
              !isRankingsVisible ? (
                <div className="surface-box rounded-[28px] p-8 sm:p-12 border border-[var(--border-card)] text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center bg-[#701020]/20 text-[#F1CA7E] border border-[#701020]/40">
                    <IconBriefcase className="w-7 h-7" />
                  </div>
                  <h3 className="font-display text-2xl font-bold" style={{ color: 'var(--text-main)' }}>
                    Rankings Hidden by Game Host
                  </h3>
                  <p className="text-xs font-rounded max-w-md mx-auto" style={{ color: 'var(--text-sub)' }}>
                    Official podium rankings and net-worth standings are currently hidden by the tournament referee. Check back when revealed!
                  </p>
                  <TactileButton
                    onClick={() => setActiveTab('land')}
                    className="btn-primary rounded-full px-5 py-2 text-xs font-rounded font-bold cursor-pointer inline-block"
                  >
                    Back to My Land
                  </TactileButton>
                </div>
              ) : (
                <MonopolyPodiumLeaderboard
                  teams={allTeamSummaries}
                  currentTeamId={currentTeam.id}
                  round={store.currentRound}
                />
              )
            )}

            {/* ================================================================= */}
            {/* TAB: FIELD GUIDE & MASTER STRATEGY PLAYBOOK                       */}
            {/* ================================================================= */}
            {activeTab === 'guide' && (
              <div className="space-y-6">
                {/* 1. Header Hero Card with Quick Nav Pills */}
                <div className="surface-box rounded-[28px] p-6 sm:p-7 border border-[var(--border-card)] space-y-4 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-soft)] pb-4">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-[#701020] text-[#F1CA7E] px-3 py-1 text-xs font-mono font-bold uppercase mb-1.5">
                        Official Tournament Field Guide & Playbook
                      </div>
                      <h3 className="font-display text-2xl font-bold" style={{ color: 'var(--text-main)' }}>
                        Karachi Market Monopoly Master Guide
                      </h3>
                      <p className="text-xs font-rounded mt-1 max-w-2xl" style={{ color: 'var(--text-sub)' }}>
                        Complete interactive documentation for Karachi property acquisitions, 3-tier building level ups, utility socketing, deed dossiers, and rent economics.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs shrink-0 flex-wrap">
                      <span className="px-3 py-1 rounded-full capsule-inset font-bold" style={{ color: 'var(--text-main)' }}>
                        Starting: Rs 500L
                      </span>
                      <span className="px-3 py-1 rounded-full text-[#F1CA7E] bg-[#701020] font-bold">
                        Round {store.currentRound}
                      </span>
                    </div>
                  </div>

                  {/* Section Filter Pills */}
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    {[
                      { id: 'all', label: 'All Sections' },
                      { id: 'level-up', label: 'How to Level Up' },
                      { id: 'utilities', label: 'How to Get Utilities' },
                      { id: 'dossiers', label: 'Property Dossiers & Info' },
                      { id: 'wheel', label: 'The Rent Wheel' },
                      { id: 'victory', label: 'Victory Formula' }
                    ].map((tab) => {
                      const isActive = guideSubTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setGuideSubTab(tab.id)}
                          className={`px-4 py-2 rounded-full text-xs font-rounded font-bold transition-all cursor-pointer ${
                            isActive ? 'btn-primary shadow-sm' : 'capsule-card hover:bg-[var(--border-active)] hover:text-white'
                          }`}
                          style={!isActive ? { color: 'var(--text-main)' } : undefined}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Fast Action Shortcuts */}
                  <div className="capsule-inset rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 border border-[var(--border-soft)]">
                    <span className="text-xs font-rounded font-bold" style={{ color: 'var(--text-sub)' }}>
                      Quick Navigation Jump:
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setActiveTab('land')}
                        className="px-3 py-1.5 rounded-full text-xs font-rounded font-bold bg-[#8D5B3A] text-white hover:opacity-90 transition-opacity cursor-pointer"
                      >
                        Open My Land Grid
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('buy-resources')}
                        className="px-3 py-1.5 rounded-full text-xs font-rounded font-bold bg-[#2E7D52] text-white hover:opacity-90 transition-opacity cursor-pointer"
                      >
                        Open Store (15 Tokens)
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('catalogue')}
                        className="px-3 py-1.5 rounded-full text-xs font-rounded font-bold bg-[#701020] text-[#F1CA7E] hover:opacity-90 transition-opacity cursor-pointer"
                      >
                        View Full 25-Property Info
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('bank')}
                        className="px-3 py-1.5 rounded-full text-xs font-rounded font-bold capsule-card hover:bg-[var(--border-active)] hover:text-white transition-colors cursor-pointer"
                        style={{ color: 'var(--text-main)' }}
                      >
                        View Rent History
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Core Overview & 4 Golden Laws */}
                {(guideSubTab === 'all' || guideSubTab === 'overview') && (
                  <div className="surface-box rounded-[28px] p-6 border border-[var(--border-card)] space-y-4">
                    <div className="border-b border-[var(--border-soft)] pb-3">
                      <span className="text-[10px] font-mono uppercase font-bold text-[#8D5B3A] block">
                        Core Tournament Architecture
                      </span>
                      <h4 className="font-display text-lg font-bold" style={{ color: 'var(--text-main)' }}>
                        The 4 Golden Rules of Market Monopoly
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                      <div className="p-4 rounded-2xl capsule-inset space-y-1.5 border border-[var(--border-soft)]">
                        <span className="text-[10px] font-mono uppercase font-bold text-[#2E7D52] block">Rule 01</span>
                        <div className="text-sm font-bold" style={{ color: 'var(--text-main)' }}>Starting Capital</div>
                        <p className="text-xs font-rounded leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                          Every team starts with Rs 500 Lakh. Liquid cash must be balanced between buying land plots and acquiring utility tokens.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl capsule-inset space-y-1.5 border border-[var(--border-soft)]">
                        <span className="text-[10px] font-mono uppercase font-bold text-[#8D5B3A] block">Rule 02</span>
                        <div className="text-sm font-bold" style={{ color: 'var(--text-main)' }}>No Direct Cash Upgrades</div>
                        <p className="text-xs font-rounded leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                          Properties cannot be leveled up by money alone. Upgrades require specific municipal utility tokens plus a development fee.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl capsule-inset space-y-1.5 border border-[var(--border-soft)]">
                        <span className="text-[10px] font-mono uppercase font-bold text-[#701020] block">Rule 03</span>
                        <div className="text-sm font-bold" style={{ color: 'var(--text-main)' }}>Level 3 Maximum Cap</div>
                        <p className="text-xs font-rounded leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                          Each plot accepts up to 3 attached utility sockets. Each socket unlocks +1 Level (Vacant L0 to Landmark High-Rise L3).
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl capsule-inset space-y-1.5 border border-[var(--border-soft)]">
                        <span className="text-[10px] font-mono uppercase font-bold text-[#D97706] block">Rule 04</span>
                        <div className="text-sm font-bold" style={{ color: 'var(--text-main)' }}>Rent Wheel Settlement</div>
                        <p className="text-xs font-rounded leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                          When the wheel spins, landing on another team's property pays calculated rent directly to that owner. Landing on your own plot is free.
                        </p>
                      </div>
                    </div>

                    {/* Phase 1 vs Phase 2 Comparison */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="p-4 rounded-2xl capsule-card border border-[var(--border-soft)] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-[#2E7D52]/15 text-[#2E7D52]">
                            Phase One · Round 1
                          </span>
                          <span className="text-xs font-mono font-bold" style={{ color: 'var(--text-sub)' }}>25 Land Plots</span>
                        </div>
                        <h5 className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>Karachi Property Auction</h5>
                        <p className="text-xs font-rounded leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                          The Admin presents 25 prime Karachi land plots. Teams bid live on the floor. Winning plots appear immediately on your My Land grid at Base Level 0 (Vacant surveyed plot).
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl capsule-card border border-[var(--border-soft)] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-[#701020] text-[#F1CA7E]">
                            Phase Two · Round 2
                          </span>
                          <span className="text-xs font-mono font-bold" style={{ color: 'var(--text-sub)' }}>15 Utilities · Wheel</span>
                        </div>
                        <h5 className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>Store Purchasing, Upgrades & The Rent Wheel</h5>
                        <p className="text-xs font-rounded leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                          Buy utility tokens directly from the Store or win them at auction, socket them onto your land to level up to L3, and collect heavy rent payments as competitors spin the wheel!
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. SECTION: HOW TO LEVEL UP */}
                {(guideSubTab === 'all' || guideSubTab === 'level-up') && (
                  <div className="surface-box rounded-[28px] p-6 border border-[var(--border-card)] space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-soft)] pb-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase font-bold text-[#2E7D52] block">
                          Building Progression Guide
                        </span>
                        <h4 className="font-display text-xl font-bold" style={{ color: 'var(--text-main)' }}>
                          How to Level Up Your Properties (L0 to L3)
                        </h4>
                        <p className="text-xs font-rounded mt-0.5" style={{ color: 'var(--text-sub)' }}>
                          Follow the exact 3-step workflow to develop raw surveyed land into high-earning landmark high-rises.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('land')}
                        className="px-3.5 py-1.5 rounded-full text-xs font-rounded font-bold bg-[#8D5B3A] text-white self-start sm:self-auto cursor-pointer"
                      >
                        Go to My Land
                      </button>
                    </div>

                    {/* Step-by-Step 3 Card Flow */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-2xl capsule-card border border-[var(--border-soft)] space-y-2">
                        <div className="w-8 h-8 rounded-xl bg-[#8D5B3A]/20 text-[#8D5B3A] flex items-center justify-center font-mono font-bold text-sm">
                          1
                        </div>
                        <h5 className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>Check Property Recipe</h5>
                        <p className="text-xs font-rounded leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                          In <strong>My Land</strong>, click <strong>Options</strong> on your property. The recipe details the exact tokens required (e.g. Water Supply, Electricity, Solar) and the development fee in Lakhs.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl capsule-card border border-[var(--border-soft)] space-y-2">
                        <div className="w-8 h-8 rounded-xl bg-[#2E7D52]/20 text-[#2E7D52] flex items-center justify-center font-mono font-bold text-sm">
                          2
                        </div>
                        <h5 className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>Acquire Utility Tokens</h5>
                        <p className="text-xs font-rounded leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                          Navigate to the <strong>Store</strong> tab and purchase the matching utility tokens using your team cash, or win them during live Admin resource bidding sessions.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl capsule-card border border-[var(--border-soft)] space-y-2">
                        <div className="w-8 h-8 rounded-xl bg-[#701020]/20 text-[#F1CA7E] flex items-center justify-center font-mono font-bold text-sm">
                          3
                        </div>
                        <h5 className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>Socket Tokens & Execute</h5>
                        <p className="text-xs font-rounded leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                          Drag the token onto your land plot from the right-hand panel, or click <strong>Execute Recipe Upgrade</strong> in the Options modal. The plot transforms visually and rent increases!
                        </p>
                      </div>
                    </div>

                    {/* Interactive 3D Visual & Numerical Level Simulator */}
                    <div className="capsule-inset rounded-2xl p-5 border border-[var(--border-soft)] space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-soft)] pb-3">
                        <div>
                          <span className="text-[10px] font-mono uppercase font-bold text-[#8D5B3A] block">
                            Interactive Architectural Simulator
                          </span>
                          <h5 className="font-display text-base font-bold" style={{ color: 'var(--text-main)' }}>
                            Test Visual & Financial Level Progression
                          </h5>
                          <p className="text-xs font-rounded" style={{ color: 'var(--text-sub)' }}>
                            Click each level and category below to inspect the 3D isometric evolution and numerical multipliers.
                          </p>
                        </div>

                        {/* Category Selector */}
                        <div className="flex items-center gap-1.5">
                          {['Residential', 'Commercial', 'Industrial'].map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setGuideSimCategory(cat)}
                              className={`px-3 py-1 rounded-full text-xs font-rounded font-bold transition-all cursor-pointer ${
                                guideSimCategory === cat ? 'bg-[#8D5B3A] text-white shadow-xs' : 'capsule-card text-[var(--text-sub)]'
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Level Buttons Bar */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { lvl: 0, label: 'Level 0: Vacant Plot', sockets: '0 Sockets' },
                          { lvl: 1, label: 'Level 1: Cottage', sockets: '1 Socket' },
                          { lvl: 2, label: 'Level 2: Plaza', sockets: '2 Sockets' },
                          { lvl: 3, label: 'Level 3: Landmark High-Rise', sockets: '3 Sockets (MAX)' }
                        ].map((item) => {
                          const isSel = guideSimLevel === item.lvl;
                          return (
                            <button
                              key={item.lvl}
                              type="button"
                              onClick={() => setGuideSimLevel(item.lvl)}
                              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                isSel
                                  ? 'border-[#2E7D52] bg-[#2E7D52]/10 ring-2 ring-[#2E7D52]/40 shadow-sm'
                                  : 'border-[var(--border-card)] capsule-card hover:bg-[var(--row-hover)]'
                              }`}
                            >
                              <div className="flex items-center justify-between text-[10px] font-mono font-bold mb-1">
                                <span className={isSel ? 'text-[#2E7D52]' : 'text-[var(--text-sub)]'}>
                                  LVL {item.lvl}
                                </span>
                                <span className="opacity-75">{item.sockets}</span>
                              </div>
                              <div className="text-xs font-bold leading-tight" style={{ color: 'var(--text-main)' }}>
                                {item.label.split(':')[1].trim()}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Simulator Output Stage: 3D Illustration + Dynamic Specs */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                        <div className="lg:col-span-6 rounded-2xl overflow-hidden border-2 border-[var(--border-card)] shadow-lg bg-[var(--bg-card)]">
                          <LandPlotIllustration
                            category={guideSimCategory}
                            level={guideSimLevel}
                            utilityCount={guideSimLevel}
                            showBadge={true}
                          />
                        </div>

                        <div className="lg:col-span-6 space-y-3 text-xs font-rounded">
                          <div className="p-3.5 rounded-xl capsule-card border border-[var(--border-soft)] space-y-1.5">
                            <span className="text-[10px] font-mono uppercase font-bold text-[#2E7D52] block">
                              Level {guideSimLevel} Architectural Features
                            </span>
                            <div className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>
                              {guideSimLevel === 0 && 'Raw Surveyed Plot with Perimeter Boundary'}
                              {guideSimLevel === 1 && 'Cottage / Single Structure + 1 Golden Curb Sphere'}
                              {guideSimLevel === 2 && '3-Story Urban Plaza / Complex + 2 Golden Curb Spheres'}
                              {guideSimLevel === 3 && 'Landmark Skyscraper Spire + Beacon + 3 Golden Curb Spheres'}
                            </div>
                            <p className="leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                              {guideSimLevel === 0 && 'The plot is in raw surveyed status. Dashed curbs indicate no utilities connected yet. Baseline valuation and base rent apply.'}
                              {guideSimLevel === 1 && 'First building constructed. The first golden upgrade orb illuminates on the curb. Adds +1 rent multiplier and initial value increment.'}
                              {guideSimLevel === 2 && 'Expands into a multi-story illuminated plaza. 2 golden upgrade orbs illuminated. Rent increases to 2.5× baseline.'}
                              {guideSimLevel === 3 && 'Crowned with an architectural landmark spire, illuminated rooftop beacon, and all 3 gold upgrade orbs active. Max rent extraction power!'}
                            </p>
                          </div>

                          <div className="grid grid-cols-3 gap-2.5 font-mono text-center">
                            <div className="p-2.5 rounded-xl capsule-inset">
                              <span className="text-[10px] block opacity-75" style={{ color: 'var(--text-sub)' }}>Sockets</span>
                              <strong className="text-sm font-bold text-[#8D5B3A]">{guideSimLevel} / 3</strong>
                            </div>
                            <div className="p-2.5 rounded-xl capsule-inset">
                              <span className="text-[10px] block opacity-75" style={{ color: 'var(--text-sub)' }}>Rent Multiplier</span>
                              <strong className="text-sm font-bold text-[#2E7D52]">
                                {guideSimLevel === 0 ? '1.0× Base' : guideSimLevel === 1 ? '1.5×' : guideSimLevel === 2 ? '2.5×' : '3.5× Max'}
                              </strong>
                            </div>
                            <div className="p-2.5 rounded-xl capsule-inset">
                              <span className="text-[10px] block opacity-75" style={{ color: 'var(--text-sub)' }}>Valuation</span>
                              <strong className="text-sm font-bold text-[#701020]">
                                {guideSimLevel === 0 ? 'Opening' : guideSimLevel === 1 ? '+33%' : guideSimLevel === 2 ? '+67%' : 'Target Max'}
                              </strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Real Karachi Asset Recipe Showcase */}
                    <div className="space-y-3 pt-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-mono uppercase font-bold text-[#701020] block">
                            Document Recipe Inspection
                          </span>
                          <h5 className="font-display text-base font-bold" style={{ color: 'var(--text-main)' }}>
                            Exact Karachi Upgrade Recipes from Official Catalogue
                          </h5>
                        </div>
                        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full capsule-inset" style={{ color: 'var(--text-sub)' }}>
                          Click a sample to inspect
                        </span>
                      </div>

                      {/* Property Selector Pills */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {[
                          { id: 1, name: 'DHA Phase 6', cat: 'Residential' },
                          { id: 2, name: 'Clifton Block 5', cat: 'Residential' },
                          { id: 8, name: 'Tariq Road', cat: 'Commercial' },
                          { id: 9, name: 'Shahrah-e-Faisal', cat: 'Commercial' },
                          { id: 13, name: 'Scheme 33', cat: 'Residential' },
                          { id: 18, name: 'Port Qasim', cat: 'Industrial' }
                        ].map((p) => {
                          const isSel = Number(guideSamplePropId) === Number(p.id);
                          return (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => setGuideSamplePropId(p.id)}
                              className={`px-3 py-1.5 rounded-full text-xs font-rounded font-bold transition-all cursor-pointer ${
                                isSel ? 'btn-primary shadow-xs' : 'capsule-card hover:bg-[var(--border-active)] hover:text-white'
                              }`}
                              style={!isSel ? { color: 'var(--text-main)' } : undefined}
                            >
                              #{p.id} {p.name}
                            </button>
                          );
                        })}
                      </div>

                      {/* Recipe Table & Specs for Selected Property */}
                      {guideSampleProp && (
                        <div className="p-4 rounded-2xl capsule-card border border-[var(--border-soft)] space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-soft)] pb-2.5">
                            <div>
                              <div className="font-display text-base font-bold" style={{ color: 'var(--text-main)' }}>
                                #{guideSampleProp.id} {guideSampleProp.name} ({guideSampleProp.category})
                              </div>
                              <span className="text-xs font-mono" style={{ color: 'var(--text-sub)' }}>
                                Opening: Rs {guideSampleProp.openingValue}L · L3 Target: <strong className="text-[#2E7D52]">Rs {guideSampleProp.level3Target}L</strong> · Total Upgrade Cost: Rs {(guideSampleProp.upgradeCosts?.[0] || 0) + (guideSampleProp.upgradeCosts?.[1] || 0) + (guideSampleProp.upgradeCosts?.[2] || 0)}L
                              </span>
                            </div>
                            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-[#701020] text-[#F1CA7E]">
                              Zone: {guideSampleProp.zone || 'Karachi Metropolitan'}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {[1, 2, 3].map((lvlNum) => {
                              const cost = guideSampleProp.upgradeCosts?.[lvlNum - 1] || 0;
                              const targetVal = guideSampleProp.targetValues?.[lvlNum] || 0;
                              const rentVal = guideSampleProp.rentValues?.[lvlNum] || 0;
                              const reqList = (guideSampleProp.upgradeRequirements && guideSampleProp.upgradeRequirements[String(lvlNum)]) || [];

                              return (
                                <div key={lvlNum} className="p-3.5 rounded-xl capsule-inset space-y-2 text-xs font-rounded border border-[var(--border-soft)]">
                                  <div className="flex items-center justify-between font-bold border-b border-[var(--border-soft)] pb-1.5">
                                    <span style={{ color: 'var(--text-main)' }}>Level {lvlNum} Upgrade</span>
                                    <span className="font-mono text-[#2E7D52]">Cost: Rs {cost}L</span>
                                  </div>
                                  <div className="space-y-1 font-mono text-[11px]">
                                    <div className="flex justify-between">
                                      <span style={{ color: 'var(--text-sub)' }}>Valuation:</span>
                                      <strong className="text-[#2E7D52]">Rs {targetVal}L</strong>
                                    </div>
                                    <div className="flex justify-between">
                                      <span style={{ color: 'var(--text-sub)' }}>Rent Payout:</span>
                                      <strong>Rs {rentVal}L</strong>
                                    </div>
                                  </div>
                                  {reqList.length > 0 && (
                                    <div className="space-y-1 pt-1">
                                      <span className="text-[10px] font-mono uppercase font-bold block" style={{ color: 'var(--text-sub)' }}>
                                        Required Utility Tokens:
                                      </span>
                                      <div className="flex items-center gap-1 flex-wrap">
                                        {reqList.map((r, rIdx) => (
                                          <span key={rIdx} className="px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-[10px] font-mono font-bold">
                                            {r.count}× {r.utilityName}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 4. SECTION: HOW TO GET UTILITIES */}
                {(guideSubTab === 'all' || guideSubTab === 'utilities') && (
                  <div className="surface-box rounded-[28px] p-6 border border-[var(--border-card)] space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-soft)] pb-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase font-bold text-[#F1CA7E] bg-[#701020] px-2 py-0.5 rounded inline-block mb-1">
                          Utility Token Procurement
                        </span>
                        <h4 className="font-display text-xl font-bold" style={{ color: 'var(--text-main)' }}>
                          How to Acquire & Socket Utility Tokens
                        </h4>
                        <p className="text-xs font-rounded mt-0.5" style={{ color: 'var(--text-sub)' }}>
                          Understand token acquisition from the Bank Store, bidding rules, and socketing methods.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('buy-resources')}
                        className="px-3.5 py-1.5 rounded-full text-xs font-rounded font-bold bg-[#2E7D52] text-white self-start sm:self-auto cursor-pointer"
                      >
                        Open Store Tab
                      </button>
                    </div>

                    {/* 2 Ways to Get Tokens */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl capsule-card border border-[var(--border-soft)] space-y-2">
                        <span className="text-[10px] font-mono uppercase font-bold text-[#2E7D52] block">Channel A · Instant</span>
                        <h5 className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>Bank Store Direct Purchase</h5>
                        <p className="text-xs font-rounded leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                          Click the <strong>Store</strong> tab in the sidebar. All 15 municipal utility tokens are in stock at transparent bank prices (Rs 2L to Rs 12L). Purchasing deducts team cash immediately and places tokens in your unassigned inventory.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl capsule-card border border-[var(--border-soft)] space-y-2">
                        <span className="text-[10px] font-mono uppercase font-bold text-[#8D5B3A] block">Channel B · Floor Action</span>
                        <h5 className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>Admin Resource Bids (Round 2)</h5>
                        <p className="text-xs font-rounded leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                          During live competition sessions, the Admin conducts floor bidding for high-demand bundled resources. Winning bids deduct team cash and assign the tokens straight into your inventory.
                        </p>
                      </div>
                    </div>

                    {/* How Socketing Works */}
                    <div className="capsule-inset rounded-2xl p-4 space-y-2 text-xs font-rounded border border-[var(--border-soft)]">
                      <div className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>
                        How to Attach / Socket Tokens to Your Land:
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-xs leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                        <li><strong>Drag and Drop:</strong> On your <strong>My Land</strong> grid, drag any unassigned token from the right-hand panel directly onto any owned property tile.</li>
                        <li><strong>Options Modal:</strong> Click <strong>Options</strong> on your plot tile, then click <strong>Install Utility</strong> to socket an individual token, or click <strong>Execute Recipe Upgrade</strong> to apply the complete level upgrade.</li>
                        <li><strong>Socket Capacity:</strong> Each plot has exactly 3 utility sockets (Level 1, Level 2, Level 3). Once all 3 sockets are filled, the property reaches Landmark High-Rise status.</li>
                      </ul>
                    </div>

                    {/* Interactive 15-Utility Directory Explorer */}
                    <div className="space-y-3 pt-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-mono uppercase font-bold text-[#8D5B3A] block">
                            15 Municipal Utility Classes
                          </span>
                          <h5 className="font-display text-base font-bold" style={{ color: 'var(--text-main)' }}>
                            Explore Utility Costs & Functions
                          </h5>
                        </div>

                        {/* Category Filter Pills */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {['ALL', 'Power', 'Water', 'Energy', 'Sanitation', 'Access', 'Security', 'Comms'].map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setGuideUtilFilter(cat)}
                              className={`px-2.5 py-1 rounded-full text-xs font-rounded font-bold transition-all cursor-pointer ${
                                guideUtilFilter === cat ? 'btn-primary shadow-xs' : 'capsule-card text-[var(--text-sub)]'
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Utilities Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                        {activeUtilities
                          .filter((u) => guideUtilFilter === 'ALL' || u.category === guideUtilFilter)
                          .map((u) => (
                            <div key={u.id} className="p-3 rounded-xl capsule-card border border-[var(--border-soft)] space-y-2 flex flex-col justify-between">
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#701020] text-[#F1CA7E]">
                                    #{u.id} · {u.category}
                                  </span>
                                  <span className="font-mono text-xs font-bold text-[#2E7D52]">
                                    Rs {u.cost}L
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 pt-1">
                                  <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border"
                                    style={{
                                      backgroundColor: 'var(--resource-icon-bg)',
                                      borderColor: 'var(--resource-badge-border)'
                                    }}
                                  >
                                    <UtilityIcon id={u.id} className="w-4 h-4" style={{ color: 'var(--resource-icon-color)' }} />
                                  </div>
                                  <div className="font-bold text-xs leading-tight truncate" style={{ color: 'var(--text-main)' }}>
                                    {u.name}
                                  </div>
                                </div>
                                <p className="text-[11px] font-rounded leading-snug line-clamp-2" style={{ color: 'var(--text-sub)' }}>
                                  {u.summary}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. SECTION: PROPERTY DOSSIERS & DEED INFO */}
                {(guideSubTab === 'all' || guideSubTab === 'dossiers') && (
                  <div className="surface-box rounded-[28px] p-6 border border-[var(--border-card)] space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-soft)] pb-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase font-bold text-[#2E7D52] block">
                          Real Estate Terminology & Due Diligence
                        </span>
                        <h4 className="font-display text-xl font-bold" style={{ color: 'var(--text-main)' }}>
                          What is Mentioned in the Property Dossiers & Info
                        </h4>
                        <p className="text-xs font-rounded mt-0.5" style={{ color: 'var(--text-sub)' }}>
                          How to evaluate property metrics, identify urban challenges, and spot high-upside acquisitions.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('catalogue')}
                        className="px-3.5 py-1.5 rounded-full text-xs font-rounded font-bold bg-[#701020] text-[#F1CA7E] self-start sm:self-auto cursor-pointer"
                      >
                        Open 25 Properties Info
                      </button>
                    </div>

                    {/* Metric Glossary Breakdown */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                      <div className="p-4 rounded-2xl capsule-inset space-y-1.5 border border-[var(--border-soft)]">
                        <span className="text-[10px] font-mono uppercase font-bold text-[#8D5B3A] block">Metric 01</span>
                        <div className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>Opening Value</div>
                        <p className="text-xs font-rounded leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                          The opening auction valuation and baseline purchase benchmark (Rs 55L to Rs 180L). This is what the property contributes to initial net worth.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl capsule-inset space-y-1.5 border border-[var(--border-soft)]">
                        <span className="text-[10px] font-mono uppercase font-bold text-[#2E7D52] block">Metric 02</span>
                        <div className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>Level 3 Target</div>
                        <p className="text-xs font-rounded leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                          The catalogue target valuation after completing all 3 upgrade levels. It represents the maximum asset appreciation cap (up to Rs 285L).
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl capsule-inset space-y-1.5 border border-[var(--border-soft)]">
                        <span className="text-[10px] font-mono uppercase font-bold text-[#701020] block">Metric 03</span>
                        <div className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>Upgrade Costs Array</div>
                        <p className="text-xs font-rounded leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                          The 3 expenditure stages [L1, L2, L3]. Always budget for both the cash upgrade fee AND the required utility tokens when calculating ROI.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl capsule-inset space-y-1.5 border border-[var(--border-soft)]">
                        <span className="text-[10px] font-mono uppercase font-bold text-[#D97706] block">Metric 04</span>
                        <div className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>Rent Multipliers</div>
                        <p className="text-xs font-rounded leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                          The 4 rent collection amounts [L0, L1, L2, L3]. Upgraded assets multiply rent harvest power, turning wheel spins into active cash cows.
                        </p>
                      </div>
                    </div>

                    {/* Karachi Urban Reality & Strategic Playstyles */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      <div className="p-4 rounded-2xl capsule-card border border-[var(--border-soft)] space-y-2">
                        <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-[#2E7D52]/15 text-[#2E7D52]">
                          Residential Playstyle
                        </span>
                        <h5 className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>Elite Residential Hubs</h5>
                        <p className="text-xs font-rounded leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                          <strong>DHA, Clifton, PECHS, Gulshan:</strong> High initial cost, huge Level 3 targets. Face persistent challenges like tanker reliance (needs Water Supply) and voltage surges (needs Solar & Surge Protection).
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl capsule-card border border-[var(--border-soft)] space-y-2">
                        <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-[#8D5B3A]/20 text-[#8D5B3A]">
                          Commercial Playstyle
                        </span>
                        <h5 className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>High-Yield Commercial Corridors</h5>
                        <p className="text-xs font-rounded leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                          <strong>Shahrah-e-Faisal, Tariq Road, Saddar:</strong> Constant customer footfall and massive rent multipliers. Vulnerable to parking congestion (needs Car Parking) and fire risks (needs Burglary/Fire Safety).
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl capsule-card border border-[var(--border-soft)] space-y-2">
                        <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-[#701020]/20 text-[#F1CA7E]">
                          Growth & Industrial Playstyle
                        </span>
                        <h5 className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>Affordable Suburban & Ports</h5>
                        <p className="text-xs font-rounded leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                          <strong>Scheme 33, Surjani, Port Qasim, Korangi:</strong> Lower entry costs (Rs 55L to Rs 120L) allowing rapid doubling of capital. Dependent on Road Maintenance, Sewerage Systems, and Public Transport.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. SECTION: THE RENT WHEEL */}
                {(guideSubTab === 'all' || guideSubTab === 'wheel') && (
                  <div className="surface-box rounded-[28px] p-6 border border-[var(--border-card)] space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-soft)] pb-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase font-bold text-[#D97706] block">
                          Round 2 Revenue Mechanism
                        </span>
                        <h4 className="font-display text-xl font-bold" style={{ color: 'var(--text-main)' }}>
                          The 25-Sector Karachi Rent Wheel
                        </h4>
                        <p className="text-xs font-rounded mt-0.5" style={{ color: 'var(--text-sub)' }}>
                          How spinning the wheel triggers rent transfers between competing teams.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('bank')}
                        className="px-3.5 py-1.5 rounded-full text-xs font-rounded font-bold capsule-card hover:bg-[var(--border-active)] hover:text-white self-start sm:self-auto cursor-pointer"
                        style={{ color: 'var(--text-main)' }}
                      >
                        Open Rent Ledger
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-rounded">
                      <div className="p-4 rounded-2xl capsule-inset space-y-1.5 border border-[var(--border-soft)]">
                        <strong className="block font-bold text-sm text-[#C0392B]">
                          Landing on Competitor's Land
                        </strong>
                        <p className="leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                          If Team A spins and lands on a property owned by Team B, Team A must immediately pay the calculated rent for that property to Team B.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl capsule-inset space-y-1.5 border border-[var(--border-soft)]">
                        <strong className="block font-bold text-sm text-[#2E7D52]">
                          Landing on Your Own Land
                        </strong>
                        <p className="leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                          Safe sanctuary! Landing on a plot that your team already owns costs Rs 0 in rent. Owning more properties increases your safety probability!
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl capsule-inset space-y-1.5 border border-[var(--border-soft)]">
                        <strong className="block font-bold text-sm text-[#8D5B3A]">
                          Landing on Unowned Bank Land
                        </strong>
                        <p className="leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                          If the wheel lands on a property that is still unowned or in the bank's custody, no rent is owed by the spinner.
                        </p>
                      </div>
                    </div>

                    {/* Rent Comparison Card */}
                    <div className="p-4 rounded-2xl capsule-card border border-[var(--border-soft)] space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono font-bold">
                        <span style={{ color: 'var(--text-main)' }}>Why Upgrading Maximizes Rent Revenue</span>
                        <span className="text-[#2E7D52]">Level 3 Commands 3× to 5× Rent</span>
                      </div>
                      <p className="text-xs font-rounded leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                        In Round 2, the Admin spins the wheel multiple times across all participating teams. If opponents land on your Level 3 high-rises, they pay massive sums (up to Rs 71 Lakh per landing), creating an insurmountable net worth lead.
                      </p>
                    </div>
                  </div>
                )}

                {/* 7. SECTION: VICTORY CONDITIONS */}
                {(guideSubTab === 'all' || guideSubTab === 'victory') && (
                  <div className="surface-box rounded-[28px] p-6 border border-[var(--border-card)] space-y-4">
                    <div className="border-b border-[var(--border-soft)] pb-3">
                      <span className="text-[10px] font-mono uppercase font-bold text-[#2E7D52] block">
                        Final Leaderboard Arithmetic
                      </span>
                      <h4 className="font-display text-xl font-bold" style={{ color: 'var(--text-main)' }}>
                        Tournament Victory Formula & Net Worth Calculation
                      </h4>
                    </div>

                    <div className="p-4 rounded-2xl capsule-inset space-y-2 border border-[#2E7D52]/30">
                      <span className="text-xs font-mono font-bold uppercase text-[#2E7D52] block">
                        Authoritative Valuation Equation
                      </span>
                      <div className="font-mono text-base sm:text-lg font-bold" style={{ color: 'var(--text-main)' }}>
                        Net Worth = Liquid Cash + Total Property Valuations + Unassigned Utility Tokens
                      </div>
                      <p className="text-xs font-rounded leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                        Your ranking on the live leaderboard and final podium is determined by total net worth. Every rupee spent on buying land or utility tokens remains credited to your net worth, plus all appreciation unlocked through leveling up!
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-rounded">
                      <div className="p-4 rounded-2xl capsule-card border border-[var(--border-soft)] space-y-1">
                        <strong className="block font-bold text-sm" style={{ color: 'var(--text-main)' }}>Do Not Hoard Cash</strong>
                        <p style={{ color: 'var(--text-sub)' }}>
                          Cash earns 0% rent. Investing in properties and leveling them up to Level 2 and Level 3 generates high rental yields and massive capital appreciation.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl capsule-card border border-[var(--border-soft)] space-y-1">
                        <strong className="block font-bold text-sm" style={{ color: 'var(--text-main)' }}>Match Recipe Utilities</strong>
                        <p style={{ color: 'var(--text-sub)' }}>
                          Only buy the utility tokens that match your owned properties' recipes. Focused upgrades yield faster Level 3 completions.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl capsule-card border border-[var(--border-soft)] space-y-1">
                        <strong className="block font-bold text-sm" style={{ color: 'var(--text-main)' }}>Podium Ceremony</strong>
                        <p style={{ color: 'var(--text-sub)' }}>
                          At the conclusion of Round 2, the live 3D Tournament Podium reveals the top 3 winners with Gold, Silver, and Bronze trophies.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB: INFO (PROPERTIES CATALOGUE + 17 BID RESOURCES DIRECTORY)    */}
            {/* ================================================================= */}
            {activeTab === 'catalogue' && (
              <div className="space-y-6">
                {/* 1. 25 KARACHI PROPERTIES DIRECTORY */}
                <div className="surface-box rounded-[28px] p-5 border border-[var(--border-card)] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-soft)] pb-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase font-bold text-[#2E7D52] block">
                        Asset Class 1 · Real Estate
                      </span>
                      <h3 className="font-display text-xl font-bold" style={{ color: 'var(--text-main)' }}>
                        25 Karachi Properties Directory
                      </h3>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold capsule-inset">
                      Total: 25 Land Plots
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                    <div className="relative flex-1 max-w-sm">
                      <IconSearch className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 opacity-60" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search properties..."
                        className="w-full capsule-card rounded-full pl-10 pr-4 py-2 text-xs font-rounded font-semibold focus:outline-none"
                        style={{ color: 'var(--text-main)' }}
                      />
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {['ALL', 'Residential', 'Commercial', 'Industrial'].map((cat) => (
                        <TactileButton
                          key={cat}
                          onClick={() => setCategoryFilter(cat)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-rounded font-bold transition-colors ${categoryFilter === cat ? 'btn-primary' : 'capsule-card'
                            }`}
                          style={categoryFilter !== cat ? { color: 'var(--text-main)' } : undefined}
                        >
                          {cat === 'ALL' ? 'All (25)' : cat}
                        </TactileButton>
                      ))}
                    </div>
                  </div>

                  {/* BIG 25-PLOT KARACHI LAND GRID BOARD */}
                  <div
                    className="rounded-[24px] p-4 sm:p-5 border-2 relative overflow-hidden capsule-inset"
                    style={{
                      borderColor: 'var(--border-card)',
                      backgroundColor: 'var(--bg-inset)'
                    }}
                  >
                    {/* Subtle Architectural Survey Grid Lines Overlay (Theme-Adaptive) */}
                    <div
                      className="absolute inset-0 pointer-events-none opacity-60"
                      style={{
                        backgroundImage:
                          'linear-gradient(to right, var(--chart-grid) 1px, transparent 1px), linear-gradient(to bottom, var(--chart-grid) 1px, transparent 1px)',
                        backgroundSize: '44px 44px'
                      }}
                    />

                    <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
                      {filteredCatalogue.map((prop) => {
                        const owner = store.teams.find((t) => t.id === prop.ownerTeamId);
                        const rent = computePropertyRent(prop);
                        const attachedIds = Array.isArray(prop.attachedUtilities) ? prop.attachedUtilities : [];
                        const plotLvl = owner
                          ? Math.min(3, Math.max(0, Number(prop.upgradeLevel || 0)))
                          : 3;

                        return (
                          <div
                            key={prop.id}
                            onClick={() => setInspectedPropertyId(prop.id)}
                            className="group relative rounded-2xl p-3 transition-all cursor-pointer select-none border-2 capsule-card hover:scale-[1.01] hover:shadow-lg flex flex-col gap-2"
                            style={{
                              backgroundColor: 'var(--bg-card)',
                              borderColor: 'var(--border-card)'
                            }}
                          >
                            {/* 3D Isometric Plot Tile */}
                            <div className="relative rounded-xl overflow-hidden">
                              <LandPlotIllustration
                                category={prop.category}
                                level={plotLvl}
                                utilityCount={attachedIds.length}
                                showBadge={false}
                              />
                              <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1.5">
                                <span className="text-[10px] font-rounded font-bold px-2 py-0.5 rounded-md bg-black/75 text-[#F8EEE1] border border-[#F1CA7E]/40">
                                  #{prop.id} · {prop.category.split('/')[0].trim()}
                                </span>
                                {owner ? (
                                  <span className="text-[10px] font-rounded font-bold px-2 py-0.5 rounded-md bg-[#2E7D52] text-white shadow-sm truncate max-w-[95px]">
                                    {owner.name} (L{plotLvl})
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-rounded font-bold px-2 py-0.5 rounded-md bg-[#701020] text-[#F1CA7E] border border-[#F1CA7E]/40 shadow-sm">
                                    Available
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Plot Name & Quick Stats */}
                            <div className="px-0.5 flex items-center justify-between gap-2">
                              <div className="min-w-0">
                                <h4
                                  className="font-display text-sm font-bold truncate"
                                  style={{ color: 'var(--text-main)' }}
                                >
                                  {prop.name}
                                </h4>
                                <span className="text-[10px] font-mono block" style={{ color: 'var(--text-sub)' }}>
                                  Base: Rs {prop.openingValue}L · L3: <strong className="text-[#2E7D52]">Rs {prop.level3Target}L</strong> · Rent: Rs {rent}L
                                </span>
                              </div>
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-rounded font-bold bg-[#701020] text-[#F1CA7E] shrink-0 group-hover:opacity-90 transition-opacity">
                                Inspect
                              </span>
                            </div>

                            {/* Compact Level Progress Bar */}
                            <div className="capsule-inset rounded-xl px-2.5 py-1.5 space-y-1">
                              <div className="flex items-center justify-between text-[9.5px] font-rounded font-bold">
                                <span style={{ color: 'var(--text-sub)' }}>
                                  {owner ? `Level Progress (${attachedIds.length}/3)` : 'Max Level 3 Preview'}
                                </span>
                                <span className="text-[#2E7D52]">
                                  {owner ? `Level ${plotLvl}/3` : '3 / 3'}
                                </span>
                              </div>
                              <div className="grid grid-cols-3 gap-1">
                                {[1, 2, 3].map((step) => (
                                  <div
                                    key={step}
                                    className={`h-1.5 rounded-full transition-all ${plotLvl >= step ? 'bg-[#2E7D52]' : 'bg-black/15 dark:bg-white/15'
                                      }`}
                                  />
                                ))}
                              </div>
                            </div>

                            {/* How Much it Takes to Upgrade Level (Document Upgrade Recipe Breakdown) */}
                            {Array.isArray(prop.upgradeCosts) && prop.upgradeCosts.length >= 3 && (
                              <div className="p-2.5 rounded-xl capsule-card border border-[var(--border-soft)] space-y-2">
                                <div className="flex items-center justify-between text-[10.5px] font-rounded font-bold border-b border-[var(--border-soft)] pb-1.5">
                                  <div>
                                    <span className="text-[9px] font-mono uppercase text-[#2E7D52] block font-bold">
                                      Level Upgrade Pricing & Requirements
                                    </span>
                                    <span style={{ color: 'var(--text-main)' }}>
                                      How Much to Upgrade Each Level:
                                    </span>
                                  </div>
                                  <span className="font-mono text-[#2E7D52] font-bold text-[10px] px-2 py-0.5 rounded-md capsule-inset">
                                    Total L1-L3: Rs {prop.upgradeCosts[0] + prop.upgradeCosts[1] + prop.upgradeCosts[2]}L
                                  </span>
                                </div>

                                <div className="space-y-1.5">
                                  {[1, 2, 3].map((lvlNum) => {
                                    const cost = prop.upgradeCosts[lvlNum - 1];
                                    const targetVal = prop.targetValues?.[lvlNum] || 0;
                                    const reqList = (prop.upgradeRequirements && prop.upgradeRequirements[String(lvlNum)]) || [];

                                    return (
                                      <div key={lvlNum} className="p-2 rounded-lg capsule-inset space-y-1 text-[10.5px]">
                                        <div className="flex items-center justify-between font-bold">
                                          <span className="font-rounded" style={{ color: 'var(--text-main)' }}>
                                            Level {lvlNum} (Target: Rs {targetVal}L)
                                          </span>
                                          <span className="font-mono text-[#2E7D52]">
                                            Cost: Rs {cost}L
                                          </span>
                                        </div>
                                        {reqList.length > 0 && (
                                          <div className="flex items-center gap-1 flex-wrap text-[9px] font-mono" style={{ color: 'var(--text-sub)' }}>
                                            <span className="font-rounded font-bold">Requires:</span>
                                            {reqList.map((r, rIdx) => (
                                              <span key={rIdx} className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10">
                                                {r.count}× {r.utilityName}
                                              </span>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Deed Note Highlight (From New Note PDF) */}
                            {(() => {
                              const dossier = KARACHI_PROPERTY_DOSSIERS[prop.id];
                              if (!dossier) return null;
                              return (
                                <div className="p-2 rounded-xl capsule-inset space-y-1 text-[10.5px] leading-tight">
                                  {dossier.benefits && (
                                    <div className="line-clamp-2" style={{ color: 'var(--text-sub)' }}>
                                      <strong className="text-[#2E7D52]">Upside: </strong>
                                      {dossier.benefits}
                                    </div>
                                  )}
                                  {dossier.problems && (
                                    <div className="line-clamp-1 truncate text-[#C0392B]">
                                      <strong>Risk: </strong>
                                      <span style={{ color: 'var(--text-sub)' }}>{dossier.problems}</span>
                                    </div>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 2. 17 BID RESOURCES DIRECTORY */}
                <div className="surface-box rounded-[28px] p-5 border border-[var(--border-card)] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-soft)] pb-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase font-bold text-[#F1CA7E] bg-[#701020] px-2 py-0.5 rounded inline-block mb-1">
                        Asset Class 2 · Bid Resources & Utilities
                      </span>
                      <h3 className="font-display text-xl font-bold" style={{ color: 'var(--text-main)' }}>
                        17 Bid Resources Directory
                      </h3>
                      <p className="text-xs font-rounded mt-0.5" style={{ color: 'var(--text-sub)' }}>
                        Purchase tokens directly from the Bank Store to fulfill property upgrade recipes and level up.
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold capsule-inset self-start sm:self-auto">
                      17 Unique Resources
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
                    {activeUtilities.map((res) => {
                      const isOwnedByMyTeam = (currentTeam.ownedResources || []).some(
                        (r) => Number(r.utilityId) === Number(res.id)
                      );
                      const myTeamCopies = (currentTeam.ownedResources || []).filter(
                        (r) => Number(r.utilityId) === Number(res.id)
                      ).length;

                      return (
                        <div
                          key={res.id}
                          className={`p-4 rounded-2xl capsule-card border transition-all flex flex-col justify-between gap-3 ${isOwnedByMyTeam ? 'border-[#2E7D52]/60 ring-1 ring-[#2E7D52]/40' : 'border-[var(--border-soft)]'
                            }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#701020] text-[#F1CA7E]">
                                #{res.id} · {res.category}
                              </span>
                              {isOwnedByMyTeam ? (
                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#2E7D52] text-white">
                                  Owned ({myTeamCopies})
                                </span>
                              ) : (
                                <span className="text-[10px] font-mono opacity-70" style={{ color: 'var(--text-sub)' }}>
                                  Available in Bid
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2.5">
                              <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm border transition-colors"
                                style={{
                                  backgroundColor: 'var(--resource-icon-bg)',
                                  borderColor: 'var(--resource-badge-border)'
                                }}
                              >
                                <UtilityIcon id={res.id} className="w-4 h-4" style={{ color: 'var(--resource-icon-color)' }} />
                              </div>
                              <div className="min-w-0">
                                <h5 className="font-display text-sm font-bold truncate" style={{ color: 'var(--text-main)' }}>
                                  {res.name}
                                </h5>
                                <span className="text-[10px] font-mono text-[#2E7D52] font-semibold block">
                                  Base ~Rs {res.cost}L · +1 Level
                                </span>
                              </div>
                            </div>

                            <p className="text-xs font-rounded leading-relaxed line-clamp-2" style={{ color: 'var(--text-sub)' }}>
                              {res.summary}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-[var(--border-soft)] flex items-center justify-between text-[11px] font-mono">
                            <span style={{ color: 'var(--text-sub)' }}>Level Boost:</span>
                            <strong className="text-[#2E7D52]">+1 Property Level (Max 3)</strong>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating spin button removed per specification */}

      {/* Wheel spin is exclusively projected in classroom on /market-monopoly/projector */}

      {/* SIGN OUT MODAL */}
      <AnimatePresence>
        {isSignOutModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsSignOutModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="surface-box rounded-[28px] p-6 max-w-sm w-full space-y-4 border border-[var(--border-card)] shadow-2xl text-center"
            >
              <h3 className="font-display text-xl font-bold" style={{ color: 'var(--text-main)' }}>
                Sign Out?
              </h3>
              <div className="flex items-center gap-3 pt-2">
                <TactileButton
                  type="button"
                  onClick={() => setIsSignOutModalOpen(false)}
                  className="flex-1 rounded-full py-2.5 capsule-card text-xs font-rounded font-bold border border-[var(--border-soft)]"
                >
                  Cancel
                </TactileButton>
                <TactileButton
                  type="button"
                  onClick={handleSignOut}
                  style={{
                    backgroundColor: 'var(--btn-signout-bg)',
                    color: 'var(--btn-signout-text)',
                    borderColor: 'var(--btn-signout-border)'
                  }}
                  className="flex-1 rounded-full py-2.5 text-xs font-rounded font-bold border cursor-pointer"
                >
                  Sign Out
                </TactileButton>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* MOBILE NAVIGATION MODAL */}
        {isMobileNavOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm"
            onClick={() => setIsMobileNavOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="surface-box w-full max-w-sm overflow-hidden flex flex-col shadow-2xl rounded-[28px] border border-[var(--border-card)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-[var(--border-soft)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IconLayers className="w-4 h-4" />
                  <h3 className="font-display font-bold text-base" style={{ color: 'var(--text-main)' }}>
                    Menu
                  </h3>
                </div>
                <TactileButton
                  onClick={() => setIsMobileNavOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center border border-[var(--border-soft)] cursor-pointer"
                >
                  <IconClose className="w-4 h-4" />
                </TactileButton>
              </div>

              <div className="p-4 space-y-2">
                {sidebarItems.map((item) => {
                  const active = activeTab === item.id;
                  return (
                    <TactileButton
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileNavOpen(false);
                      }}
                      className={`w-full rounded-2xl p-3 flex items-center justify-between text-xs font-rounded font-bold ${active ? 'border-2 border-[var(--border-active)]' : 'border-2 border-transparent'
                        }`}
                      style={
                        active
                          ? { backgroundColor: 'var(--tab-active-bg)', color: 'var(--tab-active-text)' }
                          : { backgroundColor: 'var(--bg-inset)', color: 'var(--text-main)' }
                      }
                    >
                      <span>{item.label}</span>
                      <span className="font-mono">{item.badge}</span>
                    </TactileButton>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RIGHT-CLICK CONTEXT MENU FOR LAND PLOTS */}
      <AnimatePresence>
        {contextMenu && contextProperty && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.14, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            style={{ top: contextMenu.y, left: contextMenu.x }}
            className="fixed z-50 w-68 rounded-2xl surface-box border-2 border-[#701020] shadow-2xl p-3 space-y-2.5"
          >
            <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-2">
              <span className="font-display text-sm font-bold truncate" style={{ color: 'var(--text-main)' }}>
                {contextProperty.name}
              </span>
              <button
                type="button"
                onClick={() => setContextMenu(null)}
                className="p-1 rounded-lg hover:bg-[var(--bg-inset)] cursor-pointer"
              >
                <IconClose className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="px-1 text-[11px] font-rounded font-bold" style={{ color: 'var(--text-sub)' }}>
              Level {contextProperty.upgradeLevel || 0} / 3 Max · Attach a Bid Resource:
            </div>

            <div className="max-h-48 overflow-y-auto modal-scrollbar space-y-1 pr-1">
              {(currentTeam.ownedResources || []).filter((r) => !r.attachedToPropertyId).length === 0 ? (
                <div className="p-2.5 rounded-xl capsule-inset text-xs font-rounded text-center" style={{ color: 'var(--text-sub)' }}>
                  No unassigned Bid Resources in your inventory.
                </div>
              ) : (
                (currentTeam.ownedResources || [])
                  .filter((r) => !r.attachedToPropertyId)
                  .map((res) => {
                    const alreadyInstalled = (contextProperty.attachedUtilities || []).includes(res.utilityId);
                    return (
                      <button
                        key={res.instanceId}
                        type="button"
                        disabled={alreadyInstalled || (contextProperty.upgradeLevel || 0) >= 3}
                        onClick={() => {
                          handleInstallUtility(contextProperty.id, res.utilityId);
                          setContextMenu(null);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-rounded font-semibold flex items-center justify-between cursor-pointer ${alreadyInstalled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[var(--bg-inset)]'
                          }`}
                        style={{ color: 'var(--text-main)' }}
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <UtilityIcon id={res.utilityId} className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--resource-icon-color)' }} />
                          <span className="truncate">{res.name}</span>
                        </span>
                        <span className="font-mono text-[11px] font-bold text-[#2E7D52] shrink-0">
                          {alreadyInstalled ? 'Added' : '+Attach'}
                        </span>
                      </button>
                    );
                  })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PROPERTY DETAILS & RESOURCE UPGRADE MODAL */}
      <AnimatePresence>
        {inspectedProperty && (() => {
          const attachedIds = Array.isArray(inspectedProperty.attachedUtilities)
            ? inspectedProperty.attachedUtilities
            : [];
          const actualLevel = Math.min(
            3,
            Math.max(0, Number(inspectedProperty.upgradeLevel || 0))
          );
          const displayedLevel =
            previewLevelOverride !== null ? previewLevelOverride : actualLevel;
          const isOwnedByMe =
            currentTeam && Number(inspectedProperty.ownerTeamId) === Number(currentTeam.id);
          const ownerTeam = store.teams.find(
            (t) => Number(t.id) === Number(inspectedProperty.ownerTeamId)
          );
          const currentVal = computePropertyValuation(inspectedProperty);
          const currentRent = computePropertyRent(inspectedProperty);
          const unassignedResources = (currentTeam?.ownedResources || []).filter(
            (r) => !r.attachedToPropertyId
          );

          return (
            <div
              onClick={() => {
                setInspectedPropertyId(null);
                setPreviewLevelOverride(null);
              }}
              className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.16, ease: 'easeOut' }}
                onClick={(e) => e.stopPropagation()}
                className="surface-box rounded-[28px] max-w-lg w-full p-5 border border-[var(--border-card)] space-y-3.5 max-h-[90vh] overflow-y-auto modal-scrollbar"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-rounded font-bold px-2.5 py-0.5 rounded-full bg-[#701020] text-[#F1CA7E]">
                        #{inspectedProperty.id} · {inspectedProperty.category}
                      </span>
                      {ownerTeam ? (
                        <span className="text-[10px] font-rounded font-bold px-2.5 py-0.5 rounded-full bg-[#2E7D52] text-white">
                          Owned by {ownerTeam.name} (Level {actualLevel})
                        </span>
                      ) : (
                        <span className="text-[10px] font-rounded font-bold px-2.5 py-0.5 rounded-full capsule-inset" style={{ color: 'var(--text-main)' }}>
                          Available in Pool
                        </span>
                      )}
                    </div>
                    <h2 className="font-display text-lg font-bold mt-1" style={{ color: 'var(--text-main)' }}>
                      {inspectedProperty.name}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setInspectedPropertyId(null);
                      setPreviewLevelOverride(null);
                    }}
                    className="p-1.5 rounded-xl bg-[var(--bg-inset)] cursor-pointer"
                  >
                    <IconClose className="w-4 h-4" />
                  </button>
                </div>

                {/* 3D Isometric Plot Preview + Interactive Level 0/1/2/3 Version Switcher */}
                <div className="space-y-2">
                  <div className="rounded-2xl overflow-hidden border border-[var(--border-soft)]">
                    <LandPlotIllustration
                      category={inspectedProperty.category}
                      level={displayedLevel}
                      utilityCount={attachedIds.length}
                      isHighlighted
                    />
                  </div>

                  {/* Level 0 / 1 / 2 / 3 Architectural Version Preview Selector */}
                  <div className="flex items-center justify-between gap-1.5 p-1.5 rounded-2xl capsule-inset">
                    <span className="text-[10px] font-rounded font-bold px-2" style={{ color: 'var(--text-sub)' }}>
                      Preview 3D Version:
                    </span>
                    <div className="flex items-center gap-1">
                      {[0, 1, 2, 3].map((lvlOpt) => {
                        const active = displayedLevel === lvlOpt;
                        const isCurrent = actualLevel === lvlOpt && previewLevelOverride === null;
                        return (
                          <button
                            key={lvlOpt}
                            type="button"
                            onClick={() =>
                              setPreviewLevelOverride(lvlOpt === actualLevel ? null : lvlOpt)
                            }
                            className={`px-2.5 py-1 rounded-xl text-[10px] font-rounded font-bold transition-all cursor-pointer ${active
                                ? 'bg-[#701020] text-[#F1CA7E] shadow-sm'
                                : 'hover:bg-black/10'
                              }`}
                            style={!active ? { color: 'var(--text-main)' } : undefined}
                          >
                            {lvlOpt === 0 ? 'Empty' : `Lvl ${lvlOpt}`}
                            {isCurrent ? ' [Current]' : ''}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Valuation & Rent Metrics */}
                <div className="grid grid-cols-4 gap-2 text-center p-2.5 rounded-2xl capsule-inset font-mono text-xs">
                  <div>
                    <span className="text-[10px] font-rounded opacity-75 block" style={{ color: 'var(--text-sub)' }}>Base</span>
                    <strong style={{ color: 'var(--text-main)' }}>Rs {inspectedProperty.openingValue}L</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-rounded opacity-75 block" style={{ color: 'var(--text-sub)' }}>Value</span>
                    <strong className="text-[#2E7D52]">Rs {currentVal}L</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-rounded opacity-75 block" style={{ color: 'var(--text-sub)' }}>L3 Target</span>
                    <strong className="text-[#2E7D52]">Rs {inspectedProperty.level3Target}L</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-rounded opacity-75 block" style={{ color: 'var(--text-sub)' }}>Rent</span>
                    <strong style={{ color: 'var(--text-main)' }}>Rs {currentRent}L</strong>
                  </div>
                </div>

                {/* OFFICIAL 3-LEVEL UPGRADE ROADMAP & PRICING (Visible for All Properties in Info & Land) */}
                <div className="p-4 rounded-2xl capsule-card border border-[var(--border-card)] space-y-3">
                  <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-2.5">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase text-[#2E7D52] block">
                        Official Upgrade Specification
                      </span>
                      <h5 className="font-display text-sm font-bold" style={{ color: 'var(--text-main)' }}>
                        3-Level Upgrade Costs & Required Tokens
                      </h5>
                    </div>
                    <span className="font-mono text-[10px] font-bold px-2.5 py-1 rounded-full capsule-inset" style={{ color: '#2E7D52' }}>
                      Total L1–L3: Rs {(inspectedProperty.upgradeCosts?.[0] || 0) + (inspectedProperty.upgradeCosts?.[1] || 0) + (inspectedProperty.upgradeCosts?.[2] || 0)}L
                    </span>
                  </div>

                  <div className="space-y-2">
                    {[1, 2, 3].map((lvlNum) => {
                      const cost = inspectedProperty.upgradeCosts?.[lvlNum - 1] || 0;
                      const targetVal = inspectedProperty.targetValues?.[lvlNum] || 0;
                      const reqList = (inspectedProperty.upgradeRequirements && inspectedProperty.upgradeRequirements[String(lvlNum)]) || [];
                      const isReached = actualLevel >= lvlNum;
                      const isNext = actualLevel === lvlNum - 1;

                      return (
                        <div
                          key={lvlNum}
                          className={`p-3 rounded-xl border text-xs font-rounded space-y-1.5 transition-all ${
                            isReached
                              ? 'border-[#2E7D52]/40 bg-[#2E7D52]/10'
                              : isNext && isOwnedByMe
                              ? 'border-[#8D5B3A] bg-[#8D5B3A]/10'
                              : 'border-[var(--border-soft)] capsule-inset'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] ${
                                isReached ? 'bg-[#2E7D52] text-white' : 'bg-black/15 dark:bg-white/15'
                              }`}>
                                LEVEL {lvlNum}
                              </span>
                              <span style={{ color: 'var(--text-main)' }}>
                                Target: Rs {targetVal}L
                              </span>
                              {isReached && (
                                <span className="text-[10px] text-[#2E7D52] font-mono">[Unlocked]</span>
                              )}
                              {isNext && isOwnedByMe && (
                                <span className="text-[10px] text-[#8D5B3A] font-mono">[Next Target]</span>
                              )}
                            </div>
                            <span className="font-mono text-[#2E7D52] font-bold">
                              Upgrade Cost: Rs {cost}L
                            </span>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] font-bold block" style={{ color: 'var(--text-sub)' }}>
                              Required Utility Tokens ({reqList.length} types):
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {reqList.map((item, iIdx) => (
                                <span
                                  key={iIdx}
                                  className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-semibold bg-black/10 dark:bg-white/10 flex items-center gap-1.5"
                                  style={{ color: 'var(--text-main)' }}
                                >
                                  <UtilityIcon id={item.utilityId} className="w-3 h-3 shrink-0" />
                                  <span>{item.count}× {item.utilityName}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ACTIVE LEVEL UPGRADE RECIPE CHECKLIST & EXECUTE (For Owned Plots) */}
                {isOwnedByMe && actualLevel < 3 && (() => {
                  const nextLvl = actualLevel + 1;
                  const reqs = (inspectedProperty.upgradeRequirements && inspectedProperty.upgradeRequirements[nextLvl]) || [];
                  const costs = inspectedProperty.upgradeCosts || [10, 15, 20];
                  const cashCost = costs[nextLvl - 1] || 10;
                  const hasCash = Number(currentTeam.cash || 0) >= cashCost;

                  // Check token readiness: count both tokens already installed on this property AND tokens in unassigned inventory
                  const attachedToThisPlot = (inspectedProperty.attachedUtilities || []).map(Number);
                  const unassignedTokens = (currentTeam.ownedResources || []).filter(r => !r.attachedToPropertyId);
                  let allTokensReady = true;
                  let allTokensInstalled = reqs.length > 0;
                  const recipeStatus = reqs.map(item => {
                    const uId = Number(item.utilityId);
                    const countNeeded = Number(item.count || 1);
                    const installed = attachedToThisPlot.filter(id => id === uId).length;
                    const inBag = unassignedTokens.filter(r => Number(r.utilityId) === uId).length;
                    const totalHave = installed + inBag;
                    if (totalHave < countNeeded) allTokensReady = false;
                    if (installed < countNeeded) allTokensInstalled = false;
                    return {
                      ...item,
                      have: totalHave,
                      installed,
                      needed: countNeeded,
                      ready: totalHave >= countNeeded,
                      isFullyInstalled: installed >= countNeeded
                    };
                  });

                  const canUpgrade = allTokensInstalled || (hasCash && allTokensReady);

                  return (
                    <div className="p-4 rounded-2xl capsule-card border-2 border-[var(--border-card)] space-y-3">
                      <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-2.5">
                        <div>
                          <span className="text-[10px] font-mono font-bold uppercase text-[#2E7D52] block">
                            Upgrade Execution Console
                          </span>
                          <h5 className="font-display text-sm font-bold" style={{ color: 'var(--text-main)' }}>
                            Upgrade to Level {nextLvl} {allTokensInstalled ? '(Ready)' : `(Cost: Rs ${cashCost}L)`}
                          </h5>
                        </div>
                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-full capsule-inset" style={{ color: allTokensInstalled || hasCash ? '#2E7D52' : '#C0392B' }}>
                          {allTokensInstalled ? 'Ready to Upgrade' : `Cash: Rs ${cashCost}L ${hasCash ? '[Ready]' : '[Need Cash]'}`}
                        </span>
                      </div>

                      {/* Required Tokens Checklist */}
                      <div className="space-y-1.5">
                        <span className="text-[10.5px] font-rounded font-bold block" style={{ color: 'var(--text-sub)' }}>
                          Required Utility Tokens for Level {nextLvl}:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {recipeStatus.map((item) => (
                            <div
                              key={item.utilityId}
                              className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs font-rounded font-semibold ${item.isFullyInstalled
                                  ? 'border-[#2E7D52]/60 bg-[#2E7D52]/15 text-[var(--text-main)]'
                                  : item.ready
                                  ? 'border-[#D97706]/50 bg-[#D97706]/10 text-[var(--text-main)]'
                                  : 'border-[#C0392B]/50 bg-[#C0392B]/10 text-[var(--text-main)]'
                                }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <UtilityIcon id={item.utilityId} className="w-4 h-4 shrink-0" style={{ color: item.ready ? '#2E7D52' : '#C0392B' }} />
                                <span className="truncate">{item.needed}× {item.utilityName}</span>
                              </div>
                              <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${item.isFullyInstalled ? 'bg-[#2E7D52] text-white' : item.ready ? 'bg-[#D97706] text-white' : 'bg-[#C0392B] text-white'
                                }`}>
                                {item.isFullyInstalled ? 'Installed' : `${item.have} / ${item.needed}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Execute Upgrade Button */}
                      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                        <div className="text-[11px] font-rounded" style={{ color: 'var(--text-sub)' }}>
                          {allTokensInstalled ? (
                            <span className="text-[#2E7D52] font-bold">[Ready] All required utilities installed! Click below to complete upgrade.</span>
                          ) : canUpgrade ? (
                            <span className="text-[#2E7D52] font-bold">[Ready] Tokens verified & cash available!</span>
                          ) : !hasCash ? (
                            <span className="text-[#C0392B] font-bold">[Alert] Short on Cash: Need Rs ${cashCost - currentTeam.cash}L more.</span>
                          ) : (
                            <span className="text-[#C0392B] font-bold">[Alert] Missing tokens: Buy required utility tokens in the Store tab.</span>
                          )}
                        </div>

                        <TactileButton
                          disabled={!canUpgrade}
                          onClick={() => handleExecuteRecipeUpgrade(inspectedProperty.id)}
                          className={`rounded-full px-5 py-2 text-xs font-rounded font-bold transition-all cursor-pointer ${canUpgrade
                              ? 'btn-primary shadow-md hover:scale-[1.02]'
                              : 'opacity-40 cursor-not-allowed capsule-inset'
                            }`}
                          style={!canUpgrade ? { color: 'var(--text-sub)' } : undefined}
                        >
                          {allTokensInstalled ? `Complete Level ${nextLvl} Upgrade` : `Execute Level ${nextLvl} Upgrade`}
                        </TactileButton>
                      </div>
                    </div>
                  );
                })()}

                {/* LEVEL PROGRESS & ATTACH BID RESOURCES PANEL (FOR OWNED PLOTS) */}
                {isOwnedByMe && (
                  <div className="p-3.5 rounded-2xl capsule-card border border-[var(--border-soft)] space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-rounded font-bold">
                      <span style={{ color: 'var(--text-main)' }}>
                        Property Level Progress ({attachedIds.length} / 3 Resources)
                      </span>
                      <span className="font-mono text-[#2E7D52]">
                        {actualLevel >= 3 ? 'Level 3 Max Reached' : `Level ${actualLevel} / 3`}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      {[1, 2, 3].map((step) => (
                        <div
                          key={step}
                          className={`h-2 rounded-full transition-all duration-300 ${actualLevel >= step ? 'bg-[#2E7D52]' : 'bg-black/15'
                            }`}
                        />
                      ))}
                    </div>

                    {/* Installed Resources */}
                    {attachedIds.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {attachedIds.map((uId) => {
                          const util = activeUtilities.find((u) => u.id === Number(uId));
                          if (!util) return null;
                          return (
                            <span
                              key={uId}
                              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-rounded font-bold border"
                              style={{
                                backgroundColor: 'var(--resource-badge-bg)',
                                color: 'var(--resource-badge-text)',
                                borderColor: 'var(--resource-badge-border)'
                              }}
                            >
                              <UtilityIcon id={util.id} className="w-3 h-3" style={{ color: 'var(--resource-icon-color)' }} />
                              <span>{util.name}</span>
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {/* Attach Unassigned Resources Directly from Modal */}
                    {actualLevel < 3 && (
                      <div className="pt-2 border-t border-[var(--border-soft)] space-y-1.5">
                        <span className="text-[11px] font-rounded font-bold block" style={{ color: 'var(--text-sub)' }}>
                          Attach a Bid Resource to Upgrade (+1 Level):
                        </span>
                        {unassignedResources.length === 0 ? (
                          <div className="p-2 rounded-xl capsule-inset text-[11px] font-rounded text-center" style={{ color: 'var(--text-sub)' }}>
                            No unassigned utility tokens in your inventory. Purchase tokens in the Store!
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {unassignedResources.map((res) => {
                              const alreadyInstalled = attachedIds.includes(res.utilityId);
                              return (
                                <button
                                  key={res.instanceId}
                                  type="button"
                                  disabled={alreadyInstalled}
                                  onClick={() => handleInstallUtility(inspectedProperty.id, res.utilityId)}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-rounded font-bold flex items-center justify-between border transition-all cursor-pointer ${alreadyInstalled
                                      ? 'opacity-40 cursor-not-allowed border-transparent capsule-inset'
                                      : 'border-[#2E7D52]/50 capsule-inset hover:border-[#2E7D52]'
                                    }`}
                                  style={{ color: 'var(--text-main)' }}
                                >
                                  <span className="flex items-center gap-1.5 truncate">
                                    <UtilityIcon id={res.utilityId} className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--resource-icon-color)' }} />
                                    <span className="truncate">{res.name}</span>
                                  </span>
                                  <span className="font-mono text-[10px] font-bold text-[#2E7D52] shrink-0 ml-1">
                                    {alreadyInstalled ? 'Added' : '+Attach'}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* OFFICIAL PROPERTY DEED & LOCATION INTELLIGENCE DOSSIER (FROM NEW NOTE PDF) */}
                {(() => {
                  const dossier = KARACHI_PROPERTY_DOSSIERS[inspectedProperty.id] || {};
                  return (
                    <div className="space-y-3 pt-1 border-t border-[var(--border-soft)]">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#701020] dark:text-[#F1CA7E]">
                          Deed Intelligence Dossier · Note Sheet
                        </span>
                        <span className="text-[10px] font-mono capsule-inset px-2.5 py-0.5 rounded-full font-bold">
                          Opening: Rs {inspectedProperty.openingValue}L
                        </span>
                      </div>

                      {/* 1. Why is this property important? */}
                      {dossier.importance && (
                        <div className="p-3.5 rounded-2xl capsule-card border border-[var(--border-soft)] space-y-1">
                          <strong className="text-xs flex items-center gap-1.5" style={{ color: 'var(--text-main)' }}>
                            <span className="font-mono text-[#8D5B3A]">[Context]</span> Why is this property important?
                          </strong>
                          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                            {dossier.importance}
                          </p>
                        </div>
                      )}

                      {/* 2. Why is its value reasonable? */}
                      {dossier.valueReasoning && (
                        <div className="p-3.5 rounded-2xl capsule-card border border-[var(--border-soft)] space-y-1">
                          <strong className="text-xs flex items-center gap-1.5 text-[#2E7D52]">
                            <span className="font-mono text-[#2E7D52]">[Analysis]</span> Valuation Justification
                          </strong>
                          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                            {dossier.valueReasoning}
                          </p>
                        </div>
                      )}

                      {/* 3. Problems and Benefits Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {dossier.problems && (
                          <div className="p-3 rounded-2xl capsule-inset border border-[#C0392B]/30 space-y-1">
                            <strong className="text-xs flex items-center gap-1.5 text-[#C0392B]">
                              <span className="font-mono text-[#C0392B]">[Risk]</span> Area Challenges & Problems
                            </strong>
                            <p className="text-[11.5px] leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                              {dossier.problems}
                            </p>
                          </div>
                        )}

                        {dossier.benefits && (
                          <div className="p-3 rounded-2xl capsule-inset border border-[#2E7D52]/30 space-y-1">
                            <strong className="text-xs flex items-center gap-1.5 text-[#2E7D52]">
                              <span className="font-mono text-[#2E7D52]">[Upside]</span> Area Benefits & Opportunities
                            </strong>
                            <p className="text-[11.5px] leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                              {dossier.benefits}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* 4. Indicative Utility Base Values Table from Deed Note */}
                      <div className="p-3.5 rounded-2xl capsule-card border border-[var(--border-soft)] space-y-2">
                        <div className="flex items-center justify-between">
                          <strong className="text-[11px] font-rounded uppercase tracking-wider block" style={{ color: 'var(--text-main)' }}>
                            Deed Indicative Utility Values (Rs Lakh)
                          </strong>
                          <span className="text-[10px] font-mono text-[#2E7D52] font-bold">17 Assets Reference</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[11px] font-mono">
                          {[
                            { name: 'Electricity', val: 12 },
                            { name: 'Water Supply', val: 7 },
                            { name: 'Natural Gas', val: 7 },
                            { name: 'Internet / Wi-Fi', val: 5 },
                            { name: 'Sewerage System', val: 6 },
                            { name: 'Parking (CPS)', val: 4 },
                            { name: 'Garbage Collection', val: 2 },
                            { name: 'Mobile Network', val: 2 },
                            { name: 'Solar Panels', val: 5 },
                            { name: 'CCTV Security', val: 5 },
                            { name: 'Public Transport', val: 3 },
                            { name: 'Road Maintenance', val: 5 },
                            { name: 'Burglar Alarm', val: 1 },
                            { name: 'Water Filter', val: 3 },
                            { name: 'Surge Protection', val: 2 },
                            { name: 'Trading Desk', val: 13 },
                            { name: 'Warehouse Hub', val: 8 },
                          ].map((u, i) => (
                            <div key={i} className="flex items-center justify-between p-1.5 rounded-lg capsule-inset">
                              <span className="truncate" style={{ color: 'var(--text-sub)' }}>{u.name}</span>
                              <strong className="text-[#2E7D52] ml-1 shrink-0">{u.val}L</strong>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* BUY TOKEN CONFIRMATION DIALOG */}
      <AnimatePresence>
        {purchasingUtilityId !== null && (() => {
          const res = activeUtilities.find((u) => u.id === Number(purchasingUtilityId));
          if (!res) return null;
          const cost = Number(res.cost || 0);
          const currentCash = Number(currentTeam.cash || 0);
          const canAfford = currentCash >= cost;
          const cashAfter = currentCash - cost;
          const ownedCount = (currentTeam.ownedResources || []).filter(
            (r) => Number(r.utilityId) === Number(res.id)
          ).length;
          const readyCount = (currentTeam.ownedResources || []).filter(
            (r) => Number(r.utilityId) === Number(res.id) && !r.attachedToPropertyId
          ).length;

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                className="w-full max-w-md surface-box rounded-[32px] p-6 space-y-5 border-2 border-[var(--border-card)] shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center border shadow-sm"
                      style={{
                        backgroundColor: 'var(--resource-icon-bg)',
                        borderColor: 'var(--resource-badge-border)'
                      }}
                    >
                      <UtilityIcon id={res.id} className="w-5 h-5" style={{ color: 'var(--resource-icon-color)' }} />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase block text-[#2E7D52]">
                        Confirm Bank Purchase
                      </span>
                      <h4 className="font-display text-lg font-bold" style={{ color: 'var(--text-main)' }}>
                        {res.name} Token
                      </h4>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPurchasingUtilityId(null)}
                    className="p-1.5 rounded-xl capsule-inset cursor-pointer"
                  >
                    <IconClose className="w-4 h-4" />
                  </button>
                </div>

                {/* Current Quantity Owned Callout */}
                <div className="p-3.5 rounded-2xl capsule-inset space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-rounded font-bold">
                    <span style={{ color: 'var(--text-sub)' }}>Current Quantity in Your Inventory:</span>
                    <span className="font-mono text-sm font-bold text-[#2E7D52]">
                      {ownedCount} Token{ownedCount === 1 ? '' : 's'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono" style={{ color: 'var(--text-sub)' }}>
                    <span>Available for upgrades (unattached):</span>
                    <strong style={{ color: 'var(--text-main)' }}>{readyCount}</strong>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono" style={{ color: 'var(--text-sub)' }}>
                    <span>Already attached to properties:</span>
                    <strong style={{ color: 'var(--text-main)' }}>{ownedCount - readyCount}</strong>
                  </div>
                </div>

                {/* Financial Impact Breakdown */}
                <div className="space-y-2 p-3.5 rounded-2xl capsule-card border border-[var(--border-soft)] text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--text-sub)' }}>Token Price:</span>
                    <strong className="text-[#C0392B]">-Rs {cost}L</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--text-sub)' }}>Current Available Cash:</span>
                    <strong style={{ color: 'var(--text-main)' }}>Rs {currentCash}L</strong>
                  </div>
                  <div className="pt-2 border-t border-[var(--border-soft)] flex items-center justify-between font-bold">
                    <span style={{ color: 'var(--text-main)' }}>Cash Balance After Purchase:</span>
                    <strong className={canAfford ? 'text-[#2E7D52]' : 'text-[#C0392B]'}>
                      Rs {cashAfter}L
                    </strong>
                  </div>
                </div>

                <p className="text-xs font-rounded leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                  This token will be added to your inventory immediately and can be applied toward completing property level recipes in your Karachi Land Grid.
                </p>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <TactileButton
                    onClick={() => setPurchasingUtilityId(null)}
                    className="rounded-full px-4 py-2 text-xs font-rounded font-bold capsule-card cursor-pointer"
                    style={{ color: 'var(--text-main)' }}
                  >
                    Cancel
                  </TactileButton>

                  <TactileButton
                    disabled={!canAfford}
                    onClick={async () => {
                      const id = purchasingUtilityId;
                      setPurchasingUtilityId(null);
                      await handleBuyTokenFromBank(id);
                    }}
                    className={`rounded-full px-5 py-2 text-xs font-rounded font-bold cursor-pointer transition-all ${
                      canAfford ? 'btn-primary shadow-md hover:scale-[1.02]' : 'opacity-40 cursor-not-allowed capsule-inset'
                    }`}
                  >
                    Confirm Purchase (Rs {cost}L)
                  </TactileButton>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* RENT SETTLEMENT POPUP DIALOG (PAYER & RECEIVER) */}
      <AnimatePresence>
        {activeRentDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full max-w-md surface-box rounded-[32px] p-6 space-y-5 border-2 border-[var(--border-card)] shadow-2xl"
            >
              {activeRentDialog.type === 'PAYER' ? (() => {
                const data = activeRentDialog.data;
                const isRentPaid = data.status === 'PAID_RENT';
                const isOwn = data.status === 'OWN_PROPERTY';

                return (
                  <>
                    <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-3">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase block text-[#701020] dark:text-[#F1CA7E]">
                          Wheel Spin Settlement · Wave #{data.wheelRound || store?.currentWheelRound || 1}
                        </span>
                        <h4 className="font-display text-xl font-bold" style={{ color: 'var(--text-main)' }}>
                          {isRentPaid ? 'Rent Payment Settled' : isOwn ? 'Safe Landing' : 'Unclaimed Plot'}
                        </h4>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                        isRentPaid
                          ? 'bg-[#FEF3F2] text-[#B42318] border-[#FECDCA]'
                          : 'bg-[#ECFDF3] text-[#027A48] border-[#A6F4C5]'
                      }`}>
                        {isRentPaid ? `-Rs ${data.rentAmount}L` : 'Rs 0L'}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl capsule-inset space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span style={{ color: 'var(--text-sub)' }}>Landed Property:</span>
                        <strong className="text-sm" style={{ color: 'var(--text-main)' }}>
                          #{data.propertyId} {data.propertyName}
                        </strong>
                      </div>
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span style={{ color: 'var(--text-sub)' }}>Property Owner:</span>
                        <strong className="text-sm" style={{ color: 'var(--text-main)' }}>
                          {data.ownerTeamName || 'Unowned'}
                        </strong>
                      </div>
                      <div className="pt-2 border-t border-[var(--border-soft)] flex items-center justify-between text-xs font-mono">
                        <span style={{ color: 'var(--text-sub)' }}>Rent Settlement:</span>
                        <strong className={`text-base font-bold ${isRentPaid ? 'text-[#C0392B]' : 'text-[#2E7D52]'}`}>
                          {isRentPaid ? `-Rs ${data.rentAmount}L (Paid)` : 'Rs 0L (No Rent)'}
                        </strong>
                      </div>
                    </div>

                    <p className="text-xs font-mono text-center" style={{ color: 'var(--text-sub)' }}>
                      {isRentPaid
                        ? `You landed on ${data.propertyName} owned by ${data.ownerTeamName}. Rs ${data.rentAmount}L rent has been transferred to their treasury.`
                        : isOwn
                        ? `You landed on ${data.propertyName}. Since your team owns this property, no rent was deducted.`
                        : `You landed on ${data.propertyName}. This plot has no owner yet, so no rent was charged.`}
                    </p>

                    <TactileButton
                      onClick={handleDismissRentDialog}
                      className="w-full py-3 text-xs font-black uppercase tracking-wider btn-primary"
                    >
                      Understood
                    </TactileButton>
                  </>
                );
              })() : (() => {
                const events = activeRentDialog.events || [];
                const totalRent = events.reduce((sum, e) => sum + Number(e.rentAmount || 0), 0);

                return (
                  <>
                    <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-3">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase block text-[#2E7D52]">
                          Treasury Credit · Wave #{events[0]?.wheelRound || store?.currentWheelRound || 1}
                        </span>
                        <h4 className="font-display text-xl font-bold" style={{ color: 'var(--text-main)' }}>
                          Rent Collected!
                        </h4>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#ECFDF3] text-[#027A48] border border-[#A6F4C5]">
                        +Rs {totalRent}L Total
                      </span>
                    </div>

                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1 modal-scrollbar">
                      {events.map((evt, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl capsule-inset border border-[var(--border-soft)] flex items-center justify-between"
                        >
                          <div>
                            <strong className="text-xs block" style={{ color: 'var(--text-main)' }}>
                              {evt.teamName}
                            </strong>
                            <span className="text-[11px] font-mono block" style={{ color: 'var(--text-sub)' }}>
                              Landed on #{evt.propertyId} {evt.propertyName}
                            </span>
                          </div>
                          <span className="font-mono text-sm font-bold text-[#2E7D52]">
                            +Rs {evt.rentAmount}L
                          </span>
                        </div>
                      ))}
                    </div>

                    <p className="text-xs font-mono text-center" style={{ color: 'var(--text-sub)' }}>
                      {events.length === 1
                        ? `${events[0].teamName} landed on your property. Rs ${events[0].rentAmount}L has been credited to your treasury.`
                        : `${events.length} teams landed on your properties! Rs ${totalRent}L has been credited to your treasury.`}
                    </p>

                    <TactileButton
                      onClick={handleDismissRentDialog}
                      className="w-full py-3 text-xs font-black uppercase tracking-wider btn-primary"
                    >
                      Collect Rent & Close
                    </TactileButton>
                  </>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className={`fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-2xl shadow-xl text-xs font-rounded font-bold ${toast.type === 'error' ? 'bg-[#C0392B] text-white' : 'bg-[#2E7D52] text-white'
              }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
