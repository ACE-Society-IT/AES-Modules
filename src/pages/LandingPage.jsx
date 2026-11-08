import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext.jsx';
import { ShimmerButton, EasyBeamButton, EasySpotlightCard, EasyScrollReveal } from '../components/landing/LandingComponents.jsx';

/* =========================================================================
   CLEAN GEOMETRIC SVG ICONS (ZERO EMOJIS • ZERO SPARKLES • ZERO EM-DASHES)
   ========================================================================= */
function IconLogin({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
    </svg>
  );
}

function IconProjector({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function IconSun({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="5" stroke="currentColor" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function IconMoon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function IconArrowRight({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}

function IconExternalLink({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

function IconWallet({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconTrendUp({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}

function IconChartBars({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function IconLineGraph({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
    </svg>
  );
}

function IconShield({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

/* Smooth scroll-reveal section variant (Rule #1: cubic-bezier(0.22, 1, 0.36, 1)) */
const revealVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function LandingPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme, team } = useGame();
  const scrollContainerRef = useRef(null);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [scrollBlurRatio, setScrollBlurRatio] = React.useState(0);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const top = scrollContainerRef.current.scrollTop;
      setIsScrolled(top > 40);
      setScrollBlurRatio(Math.min(1, top / 350));
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const [openFaq, setOpenFaq] = React.useState(null);

  // Official FAQ directly from Investomania.docx & Summit rules
  const faqs = [
    {
      q: 'How does crisis decryption and the trading window work?',
      a: 'When a crisis appears on screen, all teams have exactly 3 minutes to read and decrypt the news while the trading floor is strictly CLOSED (buy/sell is locked). After 3 minutes, the floor opens for 5 minutes (9 minutes in Round 3) to execute buy and sell orders. When the timer hits zero, market prices shift immediately by the crisis percentages.'
    },
    {
      q: 'How is team capital calculated across the 3 rounds?',
      a: 'Every team starts Round 1 with PKR 100,000. In Round 2, teams receive a fresh PKR 100,000 budget while their Round 1 profits remain safely vaulted. In Round 3, teams receive PKR 100,000 PLUS their net profits from both Round 1 and Round 2.'
    },
    {
      q: 'Can teams view previous crises after a new crisis begins?',
      a: 'Yes. All past crises remain visible and searchable inside the live Crisis History Archive in the trading portal, allowing teams to cross-reference macroeconomic trendlines throughout each round.'
    },
    {
      q: 'How does the Round 3 Tax Evasion / Wealth Shield calculation operate?',
      a: 'In Round 3, teams allocate a portion of their portfolio into 10 wealth management channels. For example: with a PKR 150,000 portfolio, placing PKR 10,000 into an Offshore Account (30% tax rate) deducts exactly 30% of the allocated PKR 10,000 (PKR 3,000), resulting in a net retained portfolio of PKR 147,000.'
    },
    {
      q: 'What tradable instruments are featured in each stage?',
      a: 'Round 1 features 20 Pakistan Stock Exchange (PSX) blue-chip equities. Round 2 unlocks 25 global assets (20 commodities like Gold, Crude Oil, and Natural Gas + 5 forex pairs like USD/PKR). Round 3 combines all 45 instruments simultaneously.'
    }
  ];

  // Official 5 AES 2026 Summit Modules (from https://alphaace.com.pk/)
  const aesModules = [
    { id: '01', name: 'Investomania', sub: 'PSX • Commodities • Tax Shield', live: true },
    { id: '02', name: 'Defend The Empire', sub: 'Crisis Triage • Mock Press', live: true },
    { id: '03', name: 'Market Monopoly', sub: 'Karachi Property Auctions', live: true },
    { id: '04', name: 'Venture Verse', sub: 'Shark Pitch • VC Cross-Exam', live: false },
    { id: '05', name: 'Viral Velocity', sub: 'Guerrilla Growth • Campus Stalls', live: true }
  ];

  // Sample Round 3 Tax Shield Channels
  const taxChannels = [
    { name: 'Offshore Account', tax: '30% Tax', width: 'w-4/5', accent: 'bg-[var(--btn-primary-bg)]' },
    { name: 'Swiss Numbered Vault', tax: '22% Tax', width: 'w-3/5', accent: 'bg-[#6B1527]' },
    { name: 'Panamanian Shell Corp', tax: '18% Tax', width: 'w-1/2', accent: 'bg-[#881B30]' }
  ];

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="h-screen w-full overflow-y-auto overflow-x-hidden scroll-smooth screen-scrollbar bg-[var(--bg-page)] text-[var(--text-main)] transition-colors duration-300 text-[15px]"
    >

      {/* =====================================================================
          DYNAMIC FLOATING CAPSULE NAVBAR (HORIZONTAL COMPACTION ON SCROLL)
          - Constant height, constant logo, constant typography and button size
          - Only horizontal length decreases with scroll
          ===================================================================== */}
      <div className="fixed top-3 sm:top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <motion.header
          animate={{
            maxWidth: isScrolled ? '900px' : '1180px'
          }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="dynamic-floating-nav rounded-full flex items-center justify-between gap-4 w-full px-6 sm:px-7 py-3 pointer-events-auto shadow-2xl flex-nowrap"
        >
          {/* Brand Logo (Text hides on scroll so only logo shows when navbar smallens) */}
          <div
            onClick={() => scrollToSection('overview')}
            className="flex items-center gap-2.5 cursor-pointer shrink-0"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[var(--border-active)] bg-[#1A090E] p-0.5 shrink-0 hover:scale-105 transition-transform flex items-center justify-center">
              <picture>
                <source srcSet="/InvestomaniaLogo.webp" type="image/webp" />
                <source srcSet="/InvestomaniaLogo.png" type="image/png" />
                <img src="/InvestomaniaLogo.jpg" alt="Investomania" className="w-full h-full object-contain rounded-full" />
              </picture>
            </div>
            <AnimatePresence initial={false}>
              {!isScrolled && (
                <motion.span
                  initial={{ opacity: 0, width: 0, x: -8 }}
                  animate={{ opacity: 1, width: 'auto', x: 0 }}
                  exit={{ opacity: 0, width: 0, x: -8 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="font-display font-bold tracking-tight text-[var(--text-main)] text-lg sm:text-xl whitespace-nowrap overflow-hidden hidden sm:inline-block"
                >
                  INVESTOMANIA
                </motion.span>
              )}
            </AnimatePresence>

            <button
              onClick={(e) => { e.stopPropagation(); navigate('/'); }}
              className="hidden md:inline-flex items-center gap-1 text-[11px] font-rounded font-bold px-3 py-1 rounded-full border border-[var(--border-soft)] text-[var(--text-sub)] hover:text-[var(--text-main)] hover:border-[var(--border-active)] transition-all cursor-pointer"
              title="Return to Alpha Ace 2026 Module Selection Hub"
            >
              <span>← All Arenas</span>
            </button>
          </div>

          {/* Scroll Navigation Links (Constant Size) */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6 font-rounded font-bold text-sm text-[var(--text-sub)]">
            <button onClick={() => scrollToSection('overview')} className="hover:text-[var(--text-main)] transition-colors cursor-pointer">
              Overview
            </button>
            <button onClick={() => scrollToSection('metrics')} className="hover:text-[var(--text-main)] transition-colors cursor-pointer">
              Metrics
            </button>
            <button onClick={() => scrollToSection('rules-compulsory')} className="hover:text-[var(--text-main)] transition-colors cursor-pointer">
              Rules
            </button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-[var(--text-main)] transition-colors cursor-pointer">
              FAQ
            </button>
            <button onClick={() => scrollToSection('terminal')} className="hover:text-[var(--text-main)] transition-colors cursor-pointer">
              Terminal
            </button>
            <button onClick={() => scrollToSection('rounds')} className="hover:text-[var(--text-main)] transition-colors cursor-pointer">
              3 Rounds
            </button>
            <a
              href="https://alphaace.com.pk/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[var(--chart-stroke)] font-bold hover:underline"
            >
              <span>AES 2026</span>
              <IconExternalLink className="w-3.5 h-3.5" />
            </a>
          </nav>

          {/* Theme Switcher + Log In CTA (No redundant Enter Floor button, preventing overflow) */}
          <div className="flex items-center gap-2.5 shrink-0">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={toggleTheme}
              aria-label="Toggle Theme (Light, Dark, AES Mix)"
              className="rounded-full border border-[var(--border-soft)] bg-[var(--bg-card)] text-[var(--text-main)] font-rounded font-bold flex items-center gap-1.5 cursor-pointer transition-all px-3.5 py-2 text-xs"
              title="Click to cycle themes: White, Dark, AES Theme"
            >
              {theme === 'aes' ? (
                <>
                  <IconSun className="w-3.5 h-3.5 text-[#89192C]" />
                  <span className="hidden sm:inline">AES Theme</span>
                </>
              ) : theme === 'dark' ? (
                <>
                  <IconSun className="w-3.5 h-3.5 text-[#C4B8BC]" />
                  <span className="hidden sm:inline">White</span>
                </>
              ) : (
                <>
                  <IconMoon className="w-3.5 h-3.5 text-[var(--btn-primary-bg)]" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </motion.button>

            {team ? (
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate('/investomania/market')}
                style={{ boxShadow: 'var(--btn-primary-shadow)' }}
                className="rounded-full font-rounded font-bold bg-[var(--btn-primary-bg)] hover:brightness-110 text-[var(--btn-primary-text)] cursor-pointer transition-all px-5 py-2 text-xs sm:text-sm"
              >
                Floor ({team.name})
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate('/investomania/login')}
                style={{ boxShadow: 'var(--btn-primary-shadow)' }}
                className="rounded-full font-rounded font-bold bg-[var(--btn-primary-bg)] hover:brightness-110 text-[var(--btn-primary-text)] cursor-pointer transition-all px-5 py-2 text-xs sm:text-sm"
              >
                Log In
              </motion.button>
            )}
          </div>
        </motion.header>
      </div>

      {/* =====================================================================
          SCREEN 1 (100VH FULL SCREEN): BULKY HERO
          ===================================================================== */}
      <section
        id="overview"
        className="relative min-h-screen lg:h-screen w-full px-4 sm:px-8 lg:px-14 xl:px-20 pt-28 sm:pt-32 pb-8 flex flex-col justify-between gap-6 overflow-hidden"
      >
        {/* Glowing Arc Gradient covering bottom of top section */}
        <div className="glowing-arc-bottom" aria-hidden="true" />

        {/* 1B. BULKY CENTERED HERO BLOCK */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={revealVariant}
          className="w-full max-w-5xl mx-auto text-center space-y-6 my-auto py-6 relative z-10"
        >
          {/* Top Event Pill (Smaller Text) */}
          <a
            href="https://alphaace.com.pk/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4.5 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-soft)] text-[11px] sm:text-xs font-rounded font-bold text-[var(--text-main)] hover:border-[var(--border-active)] transition-colors shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--btn-primary-bg)]" />
            <span>Alpha Entrepreneurship Summit • Nov 13-15, 2026 • Alpha College Karachi</span>
            <IconExternalLink className="w-3.5 h-3.5 text-[var(--chart-stroke)]" />
          </a>

          {/* Display Headline with Centered Ambient Yellow Glow Gradient (Hidden in Dark Theme Only) */}
          <div className="relative inline-block w-full max-w-4xl mx-auto">
            {theme !== 'dark' && (
              <>
                {/* Ambient Intense Yellow Glow Gradient in center behind headline (Preserved for Light & AES Theme) */}
                <div
                  className="headline-yellow-glow pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] sm:w-[650px] lg:w-[840px] h-[220px] sm:h-[300px] rounded-full blur-[60px] sm:blur-[80px] -z-10"
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(241, 202, 126, 0.75) 0%, rgba(217, 187, 124, 0.45) 40%, rgba(137, 25, 44, 0.2) 65%, transparent 80%)'
                  }}
                  aria-hidden="true"
                />
                {/* Core vibrant highlight center dot */}
                <div
                  className="headline-yellow-glow pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] sm:w-[360px] h-[100px] sm:h-[150px] rounded-full blur-[35px] -z-10"
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(255, 222, 133, 0.85) 0%, rgba(241, 202, 126, 0.4) 60%, transparent 80%)'
                  }}
                  aria-hidden="true"
                />
              </>
            )}

            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-display font-bold tracking-tight leading-[1.04] relative z-10 text-[var(--text-main)]">
              The Trading Floor<br />
              Built for <span className="velocity-accent">Velocity</span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base lg:text-lg text-[var(--text-sub)] font-medium leading-relaxed">
            Decrypt live macroeconomic shocks, trade 45 PSX equities and global commodities in real time, and route Round 3 tax shield channels.
          </p>

          {/* Bulky Centered CTAs: ONLY Login and Projector Buttons with Easy UI Animation */}
          <div className="flex flex-wrap items-center justify-center gap-5 pt-4">
            <EasyBeamButton
              onClick={() => navigate('/investomania/login')}
              variant="primary"
              icon={IconLogin}
            >
              Login
            </EasyBeamButton>

            <EasyBeamButton
              onClick={() => navigate('/investomania/projector')}
              variant="secondary"
              icon={IconProjector}
            >
              Projector
            </EasyBeamButton>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <div className="w-full flex justify-center pb-2 relative z-10">
          <button
            onClick={() => scrollToSection('metrics')}
            className="flex items-center gap-2 text-xs font-rounded font-bold text-[var(--text-sub)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
          >
            <span>Scroll for Metrics &amp; Live Terminal</span>
            <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Blurred transition feather at bottom of main hero section */}
        <div className="section-seam-blur-bottom" aria-hidden="true" />
      </section>

      {/* =====================================================================
          SCREEN 2 (100VH FULL SCREEN): TOURNAMENT METRICS & VOLATILITY BENCHMARKS
          - Seamless flat edge transition with deep 60px blur
          - Restored gradient background (landing-section-gradient)
          - Generous top padding (pt-28 sm:pt-32) pushes headline below floating navbar
          ===================================================================== */}
      <motion.section
        id="metrics"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={revealVariant}
        className="relative min-h-screen lg:h-screen w-full px-4 sm:px-8 lg:px-14 xl:px-20 pt-28 sm:pt-32 pb-8 sm:pb-10 flex flex-col justify-between gap-6 landing-section-gradient overflow-hidden"
      >
        {/* Soft blurred edge transitions */}
        <div className="section-seam-blur-top" aria-hidden="true" />
        <div className="section-seam-blur-bottom" aria-hidden="true" />
        <div className="text-center space-y-2 shrink-0">
          <div className="text-xs sm:text-sm font-rounded font-bold uppercase tracking-widest text-[var(--chart-stroke)]">
            COMPETITION BENCHMARKS
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold">
            Live Floor Dynamics &amp; <span className="text-[var(--chart-stroke)]">Capital Controls</span>
          </h2>
        </div>

        {/* FULL-WIDTH STRETCHED 3-CARD KPI ROW (EasyUI Spotlight Lazy Load Cards) */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-stretch my-auto">
          {/* Card 1: Starting Liquidity */}
          <EasySpotlightCard delay={0.06} className="md:col-span-3 surface-box p-6 sm:p-7 lg:p-8 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--chart-stroke)]">
                <IconWallet className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[var(--bg-card)] border border-[var(--border-soft)] font-mono text-[11px] font-semibold tracking-wider uppercase text-[var(--text-sub)]">
                Per Round
              </span>
            </div>
            <div className="space-y-2 pt-6">
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-sub)]">
                Starting Round Budget
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-[var(--text-main)] tracking-tight tabular-nums leading-none">
                PKR 100,000
              </div>
              <div className="text-xs font-rounded font-semibold text-[var(--chart-stroke)] flex items-center gap-1.5 pt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--chart-stroke)] shrink-0" aria-hidden="true" />
                <span>+ R1 &amp; R2 Carryover in R3</span>
              </div>
            </div>
          </EasySpotlightCard>

          {/* Card 2: Tradable Instruments */}
          <EasySpotlightCard delay={0.14} className="md:col-span-3 surface-box p-6 sm:p-7 lg:p-8 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--chart-stroke)]">
                <IconTrendUp className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[var(--bg-card)] border border-[var(--border-soft)] font-mono text-[11px] font-semibold tracking-wider uppercase text-[#2E7D52]">
                1.0s Sync
              </span>
            </div>
            <div className="space-y-2 pt-6">
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-sub)]">
                Tradable Instruments
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-[var(--text-main)] tracking-tight tabular-nums leading-none">
                45 Assets
              </div>
              <div className="text-xs font-rounded font-semibold text-[var(--chart-stroke)] flex items-center gap-1.5 pt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--chart-stroke)] shrink-0" aria-hidden="true" />
                <span>20 PSX Stocks • 25 Commodities/FX</span>
              </div>
            </div>
          </EasySpotlightCard>

          {/* Wide Card 3: Crisis Volatility (Left) + Solid Area Graph (Right) */}
          <EasySpotlightCard delay={0.22} className="md:col-span-6 surface-box p-6 sm:p-7 lg:p-8 flex flex-col justify-between">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-center">
              {/* Left Column: All text & stats with clear spacing (zero overlap) */}
              <div className="lg:col-span-6 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-[var(--bg-card)] border border-[var(--border-soft)] font-mono text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-[var(--chart-stroke)]">
                    Live Shock Engine
                  </span>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-sub)]">
                    Tournament Volatility
                  </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-[var(--text-main)] tracking-tight tabular-nums leading-none">
                    30 Crises
                  </div>
                  <div className="text-xs font-rounded font-semibold text-[var(--chart-stroke)] flex items-center gap-1.5 pt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--chart-stroke)] shrink-0" aria-hidden="true" />
                    <span>8 in R1 • 12 in R2 • 10 in R3</span>
                  </div>
                </div>

                <div className="text-xs text-[var(--text-sub)] font-body leading-relaxed pt-1 border-t border-[var(--border-soft)]/50">
                  3m Decrypt Closed / 5m-9m Trade Open
                </div>
              </div>

              {/* Right Column: Clean Solid-Fill Graph Container */}
              <div className="lg:col-span-6 capsule-card p-4 sm:p-5 flex flex-col justify-center">
                <svg viewBox="0 0 320 95" className="w-full h-24 sm:h-28 overflow-visible">
                  <line x1="0" y1="22" x2="320" y2="22" stroke="var(--chart-grid)" strokeDasharray="3 3" />
                  <line x1="0" y1="52" x2="320" y2="52" stroke="var(--chart-grid)" strokeDasharray="3 3" />
                  <line x1="0" y1="82" x2="320" y2="82" stroke="var(--chart-grid)" strokeDasharray="3 3" />
                  <path
                    d="M0,76 L45,62 L90,68 L135,40 L180,50 L225,26 L270,32 L320,12 L320,90 L0,90 Z"
                    fill="rgba(136, 27, 48, 0.28)"
                  />
                  <path
                    d="M0,76 L45,62 L90,68 L135,40 L180,50 L225,26 L270,32 L320,12"
                    fill="none"
                    stroke="var(--chart-stroke)"
                    strokeWidth="2.5"
                  />
                  <circle cx="320" cy="12" r="4.5" fill="var(--chart-stroke)" />
                </svg>
                <div className="flex justify-between font-mono text-[10px] uppercase font-bold tracking-widest text-[var(--text-sub)] mt-2 tabular-nums">
                  <span>C1</span>
                  <span>C4</span>
                  <span>C8</span>
                  <span>C12</span>
                  <span>R3</span>
                </div>
              </div>
            </div>
          </EasySpotlightCard>
        </div>

        {/* Section Navigation Quick Bar (Borderless so no hard lines show) */}
        <div className="w-full flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="text-xs font-rounded font-bold text-[var(--text-sub)]">
            Stage 1: 64m • Stage 2: 96m • Stage 3: 120m (Total 280 Tournament Minutes)
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => scrollToSection('rules-compulsory')}
              className="text-xs font-rounded font-bold text-[var(--chart-stroke)] hover:underline cursor-pointer"
            >
              Next: View Compulsory Rules &rarr;
            </button>
          </div>
        </div>
      </motion.section>

      {/* =====================================================================
          SCREEN 3 (100VH FULL SCREEN): COMPULSORY TOURNAMENT RULES & ACCURATE FAQ
          - Generous top padding (pt-28 sm:pt-32) pushes headline below floating navbar
          ===================================================================== */}
      <motion.section
        id="rules-compulsory"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={revealVariant}
        className="relative min-h-screen lg:h-screen w-full px-4 sm:px-8 lg:px-14 xl:px-20 pt-28 sm:pt-32 pb-8 sm:pb-10 flex flex-col justify-between gap-6 landing-section-gradient-alt overflow-hidden"
      >
        {/* Soft blurred edge transitions */}
        <div className="section-seam-blur-top" aria-hidden="true" />
        <div className="section-seam-blur-bottom" aria-hidden="true" />
        <div className="text-center space-y-1.5 shrink-0 relative z-10">
          <div className="text-xs sm:text-sm font-rounded font-bold uppercase tracking-widest text-[var(--chart-stroke)]">
            GOVERNANCE &amp; FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-bold">
            Compulsory Rules &amp; <span className="text-[var(--chart-stroke)]">Tournament FAQ</span>
          </h2>
        </div>

        {/* Two-Column Grid: Compulsory Rules (Left) + Interactive FAQ (Right) */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch my-auto">
          
          {/* Left Column (5 Cols): 5 Mandatory Compulsory Rules */}
          <EasySpotlightCard delay={0.08} className="lg:col-span-5 surface-box p-6 sm:p-7 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-soft)]">
                <span className="text-sm sm:text-base font-display font-bold text-[var(--text-main)]">
                  Mandatory Execution Rules
                </span>
                <span className="px-3 py-1 rounded-full bg-[var(--bg-inset)] border border-[var(--border-soft)] text-xs font-rounded font-bold text-[var(--chart-stroke)]">
                  Investomania.docx
                </span>
              </div>

              <div className="space-y-3.5 pt-4 text-xs sm:text-sm font-rounded">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <span className="font-bold text-[var(--text-main)]">Zero Trading During Decrypt</span>
                    <p className="text-xs text-[var(--text-sub)] mt-0.5">
                      The 3-minute crisis decryption phase is strictly read-only. Any attempt to buy or sell while the floor is locked is automatically rejected by the engine.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <span className="font-bold text-[var(--text-main)]">Strict Execution Window</span>
                    <p className="text-xs text-[var(--text-sub)] mt-0.5">
                      All orders must be submitted within the 5-minute trade window (9 minutes in Round 3). Orders pending at 00:00 will not be executed.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <span className="font-bold text-[var(--text-main)]">No Debt or Negative Cash</span>
                    <p className="text-xs text-[var(--text-sub)] mt-0.5">
                      Teams cannot trade on leverage or margin. Order cost must never exceed available unallocated liquid balance.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <span className="font-bold text-[var(--text-main)]">Permanent Crisis Archive</span>
                    <p className="text-xs text-[var(--text-sub)] mt-0.5">
                      Past crises persist throughout the session and cannot be removed. Market effects compound across successive news shocks.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    5
                  </div>
                  <div>
                    <span className="font-bold text-[var(--text-main)]">Automated Tax Deduction</span>
                    <p className="text-xs text-[var(--text-sub)] mt-0.5">
                      Round 3 tax channel allocations deduct fees instantaneously upon submission and reflect on the public projector scoreboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate('/investomania/rules')}
                className="w-full py-2.5 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-card)] hover:bg-[var(--row-hover)] text-xs font-rounded font-bold text-[var(--text-main)] transition-colors cursor-pointer"
              >
                Read Complete Official Rulebook &rarr;
              </button>
            </div>
          </EasySpotlightCard>

          {/* Right Column (7 Cols): Official Accurate FAQ Accordion */}
          <EasySpotlightCard delay={0.16} className="lg:col-span-7 surface-box p-6 sm:p-7 flex flex-col justify-between space-y-3">
            <div id="faq" className="w-full flex flex-col justify-between h-full space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-soft)]">
              <span className="text-sm sm:text-base font-display font-bold text-[var(--text-main)]">
                Frequently Asked Questions
              </span>
              <span className="text-xs font-rounded font-bold text-[var(--text-sub)]">
                5 Key Topics
              </span>
            </div>

            <div className="space-y-2.5 flex-1 overflow-y-auto pr-1">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={faq.q}
                    className="capsule-card p-4 transition-all"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between gap-3 text-left cursor-pointer"
                    >
                      <span className="font-bold text-xs sm:text-sm text-[var(--text-main)]">
                        {faq.q}
                      </span>
                      <span className="w-5 h-5 rounded-full bg-[var(--bg-inset)] flex items-center justify-center text-xs font-bold text-[var(--chart-stroke)] shrink-0">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.2 }}
                        className="text-xs text-[var(--text-sub)] leading-relaxed pt-2.5 mt-2 border-t border-[var(--border-soft)]"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex items-center justify-between text-xs font-rounded text-[var(--text-sub)] border-t border-[var(--border-soft)]">
              <span>Have more questions? Ask competition organizers</span>
              <button
                onClick={() => scrollToSection('terminal')}
                className="font-bold text-[var(--chart-stroke)] hover:underline cursor-pointer"
              >
                Jump to Terminal &rarr;
              </button>
            </div>
            </div>
          </EasySpotlightCard>

        </div>
      </motion.section>

      {/* =====================================================================
          SCREEN 4 (100VH FULL SCREEN): STRETCHED SPLIT TERMINAL SHOWCASE
          - Generous top padding (pt-28 sm:pt-32) pushes headline below floating navbar
          ===================================================================== */}
      <motion.section
        id="terminal"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={revealVariant}
        className="relative min-h-screen lg:h-screen w-full px-4 sm:px-8 lg:px-14 xl:px-20 pt-28 sm:pt-32 pb-8 sm:pb-10 flex flex-col justify-center landing-section-gradient overflow-hidden"
      >
        {/* Soft blurred edge transitions */}
        <div className="section-seam-blur-top" aria-hidden="true" />
        <div className="section-seam-blur-bottom" aria-hidden="true" />
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">

          {/* Left Column (4 cols): Big Bulky Stacked Copy */}
          <div className="lg:col-span-4 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-soft)] text-xs sm:text-sm font-rounded font-bold tracking-widest uppercase text-[var(--chart-stroke)]">
              DECRYPT • EXECUTE • SHELTER
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.06]">
              Everything you<br />
              need to turn<br />
              crises into<br />
              <span className="text-[var(--chart-stroke)]">portfolios</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-[var(--text-sub)] leading-relaxed">
              One synchronized competition terminal for live PSX order execution, global commodity hedging, and Round 3 tax channel routing.
            </p>
            <div className="pt-2">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/investomania/market')}
                style={{ boxShadow: 'var(--btn-primary-shadow)' }}
                className="px-8 py-4 rounded-full text-sm sm:text-base font-rounded font-bold bg-[var(--btn-primary-bg)] hover:brightness-110 text-[var(--btn-primary-text)] inline-flex items-center gap-3 cursor-pointer"
              >
                <span>Launch Trading Desk</span>
                <IconArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Right Column (8 cols): Bulky Multi-Panel Terminal Frame (.surface-box Main Card) */}
          <div className="lg:col-span-8 surface-box p-6 sm:p-8 lg:p-9">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

              {/* Left Sub-Column: 5 AES Modules Sub-Card + R3 Tax Bars Sub-Card */}
              <div className="md:col-span-5 flex flex-col justify-between gap-6">
                <div className="capsule-card p-5 sm:p-6 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base font-display font-bold text-[var(--text-main)]">AES 2026 Arenas</span>
                    <span className="text-xs font-rounded font-bold px-3 py-1 rounded-full bg-[var(--bg-inset)] border border-[var(--border-soft)] text-[var(--text-sub)]">
                      5 Modules
                    </span>
                  </div>
                  <div className="space-y-2.5 text-xs sm:text-sm">
                    {aesModules.map((mod) => (
                      <div key={mod.id} className="flex items-center justify-between py-1.5 border-b border-[var(--border-soft)] last:border-none">
                        <div>
                          <div className="font-bold text-[var(--text-main)]">{mod.id} {mod.name}</div>
                          <div className="text-xs text-[var(--text-sub)]">{mod.sub}</div>
                        </div>
                        <span className={`w-2.5 h-2.5 rounded-full ${mod.live ? 'bg-[#2E7D52]' : 'bg-[var(--chart-stroke)]'}`} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="capsule-card p-5 sm:p-6 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base font-display font-bold text-[var(--text-main)]">R3 Tax Shield</span>
                    <span className="text-xs font-rounded font-bold text-[var(--chart-stroke)]">10 Channels</span>
                  </div>
                  <div className="space-y-3 text-xs sm:text-sm font-rounded">
                    {taxChannels.map((ch) => (
                      <div key={ch.name}>
                        <div className="flex justify-between mb-1.5 font-semibold">
                          <span className="text-[var(--text-main)]">{ch.name}</span>
                          <span className="text-[var(--text-sub)]">{ch.tax}</span>
                        </div>
                        <div className="h-2 rounded-full bg-[var(--bg-inset)] overflow-hidden">
                          <div className={`h-full ${ch.width} ${ch.accent} rounded-full`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Sub-Column: 3 Timer Sub-Cards + Tax Math Ledger Sub-Card + Tickers Sub-Card */}
              <div className="md:col-span-7 flex flex-col justify-between gap-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="capsule-card p-4 sm:p-5">
                    <div className="text-xs text-[var(--text-sub)] font-rounded font-semibold">Decrypt Phase</div>
                    <div className="text-lg sm:text-2xl font-rounded font-bold text-[var(--text-main)] mt-1">3m 00s</div>
                    <div className="text-xs text-[var(--chart-stroke)] font-rounded font-bold mt-0.5">Floor Closed</div>
                  </div>
                  <div className="capsule-card p-4 sm:p-5">
                    <div className="text-xs text-[var(--text-sub)] font-rounded font-semibold">Trade Window</div>
                    <div className="text-lg sm:text-2xl font-rounded font-bold text-[var(--text-main)] mt-1">5m / 9m</div>
                    <div className="text-xs text-[#2E7D52] font-rounded font-bold mt-0.5">Floor Open</div>
                  </div>
                  <div className="capsule-card p-4 sm:p-5">
                    <div className="text-xs text-[var(--text-sub)] font-rounded font-semibold">Engine Sync</div>
                    <div className="text-lg sm:text-2xl font-rounded font-bold text-[var(--text-main)] mt-1">1.0 sec</div>
                    <div className="text-xs text-[var(--chart-stroke)] font-rounded font-bold mt-0.5">Socket.io</div>
                  </div>
                </div>

                {/* Clean 2D Tax & Order Execution Ledger Sub-Card with Recessed Inset */}
                <div className="capsule-card p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base font-display font-bold text-[var(--text-main)]">
                      Round 3 Tax Deduction Example
                    </span>
                    <span className="text-xs font-rounded font-bold px-3 py-1 rounded-full bg-[var(--bg-inset)] border border-[var(--border-soft)] text-[var(--chart-stroke)]">
                      Investomania.docx
                    </span>
                  </div>

                  <div className="capsule-inset p-4 sm:p-5 font-rounded text-xs sm:text-sm space-y-2.5">
                    <div className="flex justify-between">
                      <span className="text-[var(--text-sub)]">1. Portfolio Before Tax</span>
                      <span className="font-bold text-[var(--text-main)]">PKR 150,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-sub)]">2. Selected Channel</span>
                      <span className="font-bold text-[var(--chart-stroke)]">Offshore Account (30%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-sub)]">3. Channel Allocation</span>
                      <span className="font-bold text-[var(--text-main)]">PKR 10,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-sub)]">4. Deducted Fee (30% of 10k)</span>
                      <span className="font-bold text-[#C0392B]">-PKR 3,000</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-[var(--border-soft)] text-sm sm:text-base">
                      <span className="font-bold text-[var(--text-main)]">5. Updated Net Portfolio</span>
                      <span className="font-bold text-[#2E7D52]">PKR 147,000</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-rounded font-semibold text-[var(--text-sub)]">
                      Instant P&amp;L &amp; Tax Calculation
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate('/investomania/tax')}
                      style={{ boxShadow: 'var(--btn-primary-shadow)' }}
                      className="px-5 py-2 rounded-full bg-[var(--btn-primary-bg)] hover:brightness-110 text-[var(--btn-primary-text)] text-xs sm:text-sm font-rounded font-bold cursor-pointer"
                    >
                      Open Tax Shield
                    </motion.button>
                  </div>
                </div>

                {/* Connected Tickers Bar Sub-Card */}
                <div className="capsule-card p-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {['OGDC', 'LUCK', 'HBL', 'SYS', 'GOLD', 'USD/PKR'].map((sym) => (
                      <span
                        key={sym}
                        className="px-3 py-1.5 rounded-xl bg-[var(--bg-inset)] border border-[var(--border-soft)] text-xs font-rounded font-bold text-[var(--text-main)]"
                      >
                        {sym}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-rounded font-bold text-[#2E7D52] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#2E7D52]" /> 45 Feeds Active
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </motion.section>

      {/* =====================================================================
          SCREEN 5 (100VH FULL SCREEN): STRETCHED 3-COLUMN ROUND CARDS + FOOTER
          - Generous top padding (pt-28 sm:pt-32) pushes headline below floating navbar
          ===================================================================== */}
      <motion.section
        id="rounds"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={revealVariant}
        className="relative min-h-screen lg:h-screen w-full px-4 sm:px-8 lg:px-14 xl:px-20 pt-28 sm:pt-32 pb-6 sm:pb-8 flex flex-col justify-between gap-6 landing-section-gradient-alt overflow-hidden"
      >
        {/* Soft blurred edge transition */}
        <div className="section-seam-blur-top" aria-hidden="true" />
        <div className="text-center space-y-2 shrink-0 relative z-10">
          <div className="text-xs sm:text-sm font-rounded font-bold uppercase tracking-widest text-[var(--chart-stroke)]">
            3 PROGRESSIVE STAGES
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold">
            A competition that <span className="text-[var(--chart-stroke)]">scales</span> with your strategy
          </h2>
        </div>

        {/* Bulky Stretched 3-Column Round Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch my-auto">

          {/* CARD 1: Round 1 (surface-box) + Sub-Card Bar Chart */}
          <EasySpotlightCard delay={0.06} className="surface-box rounded-[32px] p-7 sm:p-8 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="w-11 h-11 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--chart-stroke)]">
                <IconChartBars className="w-5 h-5" />
              </div>
              <div className="text-[11px] font-rounded font-bold uppercase tracking-wider text-[var(--chart-stroke)]">
                ROUND 01 • 64 MINUTES
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-[var(--text-main)] leading-snug">
                Pakistan Stock Exchange
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-sub)] leading-relaxed">
                PKR 100,000 budget • 20 PSX equities • 8 crises (3m decrypt closed + 5m trade open).
              </p>
            </div>

            <div className="pt-6">
              <div className="capsule-card p-4">
                <div className="h-28 flex items-end justify-between gap-2.5 px-2 border-b border-[var(--border-soft)] pb-2">
                  <div className="w-full bg-[var(--chart-stroke)] opacity-40 rounded-t-md h-8" />
                  <div className="w-full bg-[var(--chart-stroke)] opacity-50 rounded-t-md h-12" />
                  <div className="w-full bg-[var(--chart-stroke)] opacity-60 rounded-t-md h-14" />
                  <div className="w-full bg-[var(--chart-stroke)] opacity-70 rounded-t-md h-18" />
                  <div className="w-full bg-[var(--chart-stroke)] opacity-80 rounded-t-md h-22" />
                  <div className="w-full bg-[var(--chart-stroke)] opacity-90 rounded-t-md h-24" />
                  <div className="w-full bg-[var(--chart-stroke)] rounded-t-md h-28" />
                </div>
                <div className="flex justify-between text-[11px] font-mono font-bold text-[var(--text-sub)] pt-2">
                  <span>C1</span><span>C2</span><span>C3</span><span>C4</span><span>C5</span><span>C6</span><span>C8</span>
                </div>
              </div>
            </div>
          </EasySpotlightCard>

          {/* CARD 2: Main Surface Card (.surface-box) + Sub-Card Graph Container (.capsule-card) */}
          <EasySpotlightCard delay={0.14} className="surface-box rounded-[32px] p-7 sm:p-8 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="w-11 h-11 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--chart-stroke)]">
                <IconLineGraph className="w-5 h-5" />
              </div>
              <div className="text-[11px] font-rounded font-bold uppercase tracking-wider text-[var(--chart-stroke)]">
                ROUND 02 • 96 MINUTES
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-[var(--text-main)] leading-snug">
                Commodities &amp; Forex
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-sub)] leading-relaxed">
                PKR 100,000 fresh budget • 20 commodities + 5 currency pairs • 12 global crises.
              </p>
            </div>

            <div className="pt-6">
              <div className="capsule-card p-4">
                <div className="h-28 flex items-center border-b border-[var(--border-soft)] pb-2">
                  <svg viewBox="0 0 240 85" className="w-full h-full overflow-visible">
                    <line x1="0" y1="20" x2="240" y2="20" stroke="var(--chart-grid)" />
                    <line x1="0" y1="48" x2="240" y2="48" stroke="var(--chart-grid)" />
                    <line x1="0" y1="76" x2="240" y2="76" stroke="var(--chart-grid)" />
                    <polyline
                      fill="none"
                      stroke="var(--chart-stroke)"
                      strokeWidth="3"
                      points="10,70 50,52 90,58 130,34 170,38 210,16 235,10"
                    />
                    <circle cx="10" cy="70" r="4" fill="var(--text-main)" />
                    <circle cx="50" cy="52" r="4" fill="var(--text-main)" />
                    <circle cx="90" cy="58" r="4" fill="var(--text-main)" />
                    <circle cx="130" cy="34" r="4" fill="var(--text-main)" />
                    <circle cx="170" cy="38" r="4" fill="var(--text-main)" />
                    <circle cx="210" cy="16" r="4" fill="var(--text-sub)" />
                    <circle cx="235" cy="10" r="5" fill="var(--chart-stroke)" />
                  </svg>
                </div>
                <div className="flex justify-between text-[11px] font-mono font-bold text-[var(--text-sub)] pt-2">
                  <span>Gold</span><span>WTI</span><span>Silver</span><span>USD</span><span>Copper</span><span>Brent</span>
                </div>
              </div>
            </div>
          </EasySpotlightCard>

          {/* CARD 3: Main Surface Card (.surface-box) + Sub-Card Ring Gauge (.capsule-card) */}
          <EasySpotlightCard delay={0.22} className="surface-box rounded-[32px] p-7 sm:p-8 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="w-11 h-11 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--chart-stroke)]">
                <IconShield className="w-5 h-5" />
              </div>
              <div className="text-[11px] font-rounded font-bold uppercase tracking-wider text-[var(--chart-stroke)]">
                ROUND 03 • 120 MINUTES
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-[var(--text-main)] leading-snug">
                Full Floor &amp; Tax Shield
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-sub)] leading-relaxed">
                PKR 100,000 + R1/R2 profits • All 45 assets • 10 crises + 10 tax channels (9m trade).
              </p>
            </div>

            <div className="pt-6">
              <div className="capsule-card p-4 flex flex-col items-center">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="var(--bg-inset)" strokeWidth="11" fill="none" />
                    <circle cx="50" cy="50" r="38" stroke="var(--chart-stroke)" strokeWidth="11" strokeDasharray="175 240" strokeLinecap="round" fill="none" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-lg font-rounded font-bold text-[var(--text-main)]">70.0%</span>
                    <span className="text-[11px] text-[var(--text-sub)] font-rounded font-semibold">Retained</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-[11px] font-rounded font-bold text-[var(--text-sub)] pt-2">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[var(--chart-stroke)]" /> Net Retained</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[var(--bg-inset)]" /> Tax Fee</span>
                </div>
              </div>
            </div>
          </EasySpotlightCard>

        </div>

        {/* COMPACT FULL-WIDTH FOOTER (ANCHORED AT BOTTOM OF SCREEN 3) */}
        <footer className="surface-box rounded-full px-6 sm:px-9 py-4 text-xs sm:text-sm font-rounded text-[var(--text-sub)] shrink-0">
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-display font-bold text-[var(--text-main)]">INVESTOMANIA</span>
              <span>•</span>
              <span>Alpha Entrepreneurship Summit (Nov 13-15, 2026)</span>
              <span>•</span>
              <span>Alpha College Karachi</span>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <span className="font-semibold">Presidents: Mansoor Moiz (0335 7555253) • Zoya Ehtasham</span>
              <a
                href="https://alphaace.com.pk/"
                target="_blank"
                rel="noreferrer"
                className="text-[var(--chart-stroke)] font-bold hover:underline inline-flex items-center gap-1"
              >
                <span>alphaace.com.pk</span>
                <IconExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </footer>
      </motion.section>

    </div>
  );
}
