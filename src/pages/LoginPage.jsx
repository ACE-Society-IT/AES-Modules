import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext.jsx';
import { TactileButton } from '../components/ui/EasyComponents.jsx';

export default function LoginPage() {
  const navigate = useNavigate();
  const { gameState, loginTeam, theme, toggleTheme } = useGame();
  const [teamName, setTeamName] = useState('');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isLoginsBlocked = gameState && gameState.loginsEnabled === false;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginTeam(teamName, passcode);
      navigate('/investomania/market');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <header className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 py-2">
        <div
          onClick={() => navigate('/investomania')}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none"
        >
          <img
            src="/InvestomaniaLogo.png"
            alt="Investomania Logo"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-contain border border-[var(--border-soft)] p-0.5 bg-[var(--bg-card)] group-hover:scale-105 transition-transform shrink-0"
          />
          <span 
            className="font-display text-lg sm:text-xl font-bold tracking-tight transition-colors" 
            style={{ color: theme === 'light' ? 'var(--text-main)' : '#F1CA7E' }}
          >
            Investomania
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
            ← All Modules
          </TactileButton>
          <TactileButton
            onClick={() => navigate('/investomania/leaderboard')}
            className="rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-rounded font-semibold border transition-all cursor-pointer shadow-xs"
            style={{
              backgroundColor: theme === 'aes' ? '#701020' : 'var(--bg-card)',
              color: theme === 'aes' ? '#F8EEE1' : 'var(--text-main)',
              borderColor: theme === 'aes' ? 'rgba(241, 202, 126, 0.35)' : 'var(--border-soft)'
            }}
          >
            Leaderboard
          </TactileButton>
          <TactileButton
            onClick={toggleTheme}
            className="rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-rounded font-semibold flex items-center gap-1.5 sm:gap-2 border transition-all cursor-pointer shadow-xs"
            style={{
              backgroundColor: theme === 'aes' ? '#701020' : theme === 'dark' ? '#240E15' : '#FFFFFF',
              color: theme === 'aes' ? '#F1CA7E' : theme === 'dark' ? '#E8DCC6' : '#5A0D1B',
              borderColor: theme === 'aes' ? '#F1CA7E' : 'var(--theme-btn-border)'
            }}
            title="Click to cycle themes: White, Dark Maroon, AES Theme"
          >
            <span 
              className="w-2.5 h-2.5 rounded-full shrink-0" 
              style={{ backgroundColor: theme === 'aes' ? '#F1CA7E' : theme === 'dark' ? '#D9BB7C' : '#881B30' }}
            />
            <span className="font-bold">
              {theme === 'aes'
                ? 'AES Theme'
                : theme === 'dark'
                ? 'Dark Maroon'
                : 'White Theme'}
            </span>
          </TactileButton>
        </div>
      </header>

      {/* Center Form */}
      <main className="my-auto py-8 w-full flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md surface-box rounded-[36px] p-7 sm:p-9 space-y-6"
        >
          <div className="text-center space-y-2">
            <img
              src="/InvestomaniaLogo.png"
              alt="Investomania Logo"
              className="w-16 h-16 mx-auto object-contain drop-shadow-md mb-1"
            />
            <div className="inline-flex items-center gap-2 rounded-full bg-[#5E1B21] text-[#D9BB7C] px-4 py-1 text-xs font-rounded font-bold">
              Team Portal
            </div>
            <h1 className="font-display text-2xl sm:text-3xl" style={{ color: 'var(--text-main)' }}>
              Sign In to Your Team
            </h1>
            <p className="text-xs font-semibold" style={{ color: 'var(--text-sub)' }}>
              Enter the official credentials assigned to your team by the Event Organizers / Game Master.
            </p>
          </div>

          <div className="rounded-2xl bg-[var(--bg-inset)] border border-[var(--border-soft)] p-3 text-[11px] font-rounded text-center space-y-1">
            <span className="font-bold text-[var(--chart-stroke)] block">Official Competitor Access</span>
            <span className="text-[var(--text-sub)] block">
              Only teams with verified credentials created by the Admin can log in. If your team does not have a passcode yet, please visit the AES Organizer desk.
            </span>
          </div>

          {isLoginsBlocked && (
            <div className="rounded-2xl bg-[#C0392B]/15 border border-[#C0392B]/40 px-4 py-2.5 text-xs font-rounded font-bold text-[#C0392B] text-center">
              Logins Locked: The Game Master has temporarily closed team sign-ins.
            </div>
          )}

          {error && (
            <div className="rounded-2xl bg-[#B83A3A]/15 border border-[#B83A3A]/40 px-4 py-2.5 text-xs font-rounded font-bold text-[#B83A3A] text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-rounded font-bold px-2" style={{ color: 'var(--text-sub)' }}>
                Team Name
              </label>
              <input
                type="text"
                required
                disabled={isLoginsBlocked}
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. Team Alpha"
                className="w-full capsule-card rounded-full px-5 py-3 text-sm font-rounded font-semibold focus:outline-none disabled:opacity-50"
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
                disabled={isLoginsBlocked}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="e.g. team123"
                className="w-full capsule-card rounded-full px-5 py-3 text-sm font-rounded font-semibold focus:outline-none disabled:opacity-50"
                style={{ color: 'var(--text-main)' }}
              />
            </div>

            <TactileButton
              type="submit"
              disabled={loading || isLoginsBlocked}
              className="w-full rounded-full py-3.5 font-display font-bold text-sm shadow-lg btn-primary cursor-pointer disabled:opacity-50"
            >
              {isLoginsBlocked ? 'Team Access Suspended' : loading ? 'Connecting...' : 'Enter Trading Floor (PKR 100,000)'}
            </TactileButton>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
