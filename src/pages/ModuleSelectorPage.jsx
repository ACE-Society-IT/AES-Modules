import React from 'react';
import { useNavigate } from 'react-router-dom';
import aesLogo from '../assets/aes-logo.png';
import investomaniaLogo from '../assets/InvestomaniaLogo.png';

export default function ModuleSelectorPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#5a0d1b', color: '#f8eee1', fontFamily: 'Outfit, system-ui, -apple-system, sans-serif', padding: '28px 24px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
      
      {/* AES Source Code Radial Gradient Background */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 15%, #89192c 0%, #701020 45%, #5a0d1b 100%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Subtle Guilloché Pattern Overlay */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="aes-lattice-exact" width="90" height="90" patternUnits="userSpaceOnUse">
            <circle cx="45" cy="45" r="42" fill="none" stroke="#f1ca7e" strokeWidth="0.6" strokeOpacity="0.08" />
            <circle cx="45" cy="45" r="28" fill="none" stroke="#f1ca7e" strokeWidth="0.4" strokeOpacity="0.06" />
            <path d="M 0 45 Q 22.5 22.5, 45 45 T 90 45" fill="none" stroke="#f1ca7e" strokeWidth="0.5" strokeOpacity="0.07" />
            <path d="M 45 0 Q 22.5 22.5, 45 45 T 45 90" fill="none" stroke="#f1ca7e" strokeWidth="0.5" strokeOpacity="0.07" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#aes-lattice-exact)" />
      </svg>

      {/* Main Container */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1440px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, gap: '32px' }}>
        
        {/* Header with Official AES Logo */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '22px', borderBottom: '1px solid #89192c' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Official AES Logo */}
            <div style={{ minHeight: '46px', display: 'flex', alignItems: 'center' }}>
              <img
                src={aesLogo}
                alt="Alpha Entrepreneurship Summit Logo"
                style={{ height: '46px', width: 'auto', objectFit: 'contain', display: 'block' }}
              />
            </div>

            <div style={{ borderLeft: '1px solid #89192c', paddingLeft: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '0.04em', color: '#f8eee1' }}>
                  ALPHA ENTREPRENEURSHIP SUMMIT
                </span>
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', background: '#89192c', color: '#f1ca7e', padding: '4px 10px', borderRadius: '9999px', border: '1px solid #f1ca7e' }}>
                  AES 2026
                </span>
              </div>
              <p style={{ color: '#e8dcc6', fontSize: '12px', marginTop: '2px', fontWeight: 400 }}>
                Pakistan's Premier Youth Entrepreneurship & Business Battleground
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '12px', color: '#e8dcc6', fontWeight: 500 }}>
              Gateway: <strong style={{ color: '#f1ca7e' }}>app.alphaace.com</strong>
            </span>
          </div>
        </header>

        {/* Center Presentation */}
        <main style={{ padding: '16px 0' }}>
          <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 44px auto' }}>
            <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'rgba(137, 25, 44, 0.6)', color: '#f1ca7e', border: '1px solid rgba(241, 202, 126, 0.35)', padding: '6px 14px', borderRadius: '9999px', marginBottom: '14px' }}>
              CHOOSE YOUR BATTLEGROUND
            </span>
            <h1 style={{ fontSize: '48px', fontWeight: 800, lineHeight: 1.15, color: '#f8eee1', letterSpacing: '-0.02em', margin: 0 }}>
              Select Your Competition Arena
            </h1>
            <p style={{ color: '#e8dcc6', fontSize: '16px', marginTop: '12px', lineHeight: 1.6, fontWeight: 400 }}>
              Select a module to view its dedicated tournament overview, rules, and live desk access.
            </p>
          </div>

          {/* 3 Module Cards in Strict AES Palette */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '26px' }}>

            {/* Card 1: Investomania */}
            <div style={{ background: 'rgba(112, 16, 32, 0.85)', border: '1px solid #89192c', borderRadius: '24px', padding: '36px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backdropFilter: 'blur(16px)', boxShadow: '0 14px 40px rgba(90, 13, 27, 0.5)' }}>
              <div>
                {/* Module Logo */}
                <div style={{ width: '68px', height: '68px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#5a0d1b', border: '1px solid #f1ca7e', marginBottom: '22px', overflow: 'hidden', padding: '6px' }}>
                  <img src={investomaniaLogo} alt="Investomania Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>

                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', background: '#89192c', color: '#f1ca7e', border: '1px solid rgba(241, 202, 126, 0.4)', padding: '4px 12px', borderRadius: '9999px' }}>
                  01 · FINANCIAL ARENA
                </span>
                <h2 style={{ color: '#f1ca7e', fontSize: '28px', marginTop: '14px', fontWeight: 800, letterSpacing: '-0.01em' }}>
                  Investomania
                </h2>
                <p style={{ color: '#e8dcc6', fontSize: '14px', lineHeight: 1.7, marginTop: '14px', fontWeight: 400 }}>
                  The high-stakes financial trading floor of AES 2026. Trade benchmark equities on the Pakistan Stock Exchange, decipher breaking central bank crisis bulletins in real time, and capitalize on sudden market price shocks to grow your portfolio net worth.
                </p>
              </div>

              <div style={{ marginTop: '36px' }}>
                <button
                  onClick={() => navigate('/investomania')}
                  style={{ width: '100%', padding: '14px 26px', borderRadius: '9999px', fontWeight: 700, fontSize: '13px', letterSpacing: '0.04em', border: 'none', background: '#f1ca7e', color: '#5a0d1b', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s ease-out' }}
                >
                  View Investomania Arena →
                </button>
              </div>
            </div>

            {/* Card 2: Defend the Empire */}
            <div style={{ background: 'rgba(112, 16, 32, 0.85)', border: '1px solid #89192c', borderRadius: '24px', padding: '36px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backdropFilter: 'blur(16px)', boxShadow: '0 14px 40px rgba(90, 13, 27, 0.5)' }}>
              <div>
                {/* Module Logo: Imperial Fortress Shield */}
                <div style={{ width: '68px', height: '68px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#5a0d1b', border: '1px solid #f1ca7e', marginBottom: '22px' }}>
                  <svg style={{ width: '36px', height: '36px' }} viewBox="0 0 24 24" fill="none" stroke="#f1ca7e" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <line x1="8" y1="10" x2="16" y2="10" />
                    <line x1="12" y1="6" x2="12" y2="14" />
                  </svg>
                </div>

                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', background: '#89192c', color: '#f1ca7e', border: '1px solid rgba(241, 202, 126, 0.4)', padding: '4px 12px', borderRadius: '9999px' }}>
                  02 · STRATEGIC WARFARE
                </span>
                <h2 style={{ color: '#f1ca7e', fontSize: '28px', marginTop: '14px', fontWeight: 800, letterSpacing: '-0.01em' }}>
                  Defend the Empire
                </h2>
                <p style={{ color: '#e8dcc6', fontSize: '14px', lineHeight: 1.7, marginTop: '14px', fontWeight: 400 }}>
                  The grand geopolitical strategy battleground. Lead your province through complex military campaigns, fortify territorial citadels, negotiate covert alliance treaties, and withstand adversarial siege rounds under the watchful eyes of senior adjudicators.
                </p>
              </div>

              <div style={{ marginTop: '36px' }}>
                <button
                  onClick={() => navigate('/defend-the-empire')}
                  style={{ width: '100%', padding: '14px 26px', borderRadius: '9999px', fontWeight: 700, fontSize: '13px', letterSpacing: '0.04em', border: 'none', background: '#f1ca7e', color: '#5a0d1b', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s ease-out' }}
                >
                  View Defend the Empire →
                </button>
              </div>
            </div>

            {/* Card 3: Market Monopoly */}
            <div style={{ background: 'rgba(112, 16, 32, 0.85)', border: '1px solid #89192c', borderRadius: '24px', padding: '36px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backdropFilter: 'blur(16px)', boxShadow: '0 14px 40px rgba(90, 13, 27, 0.5)' }}>
              <div>
                {/* Module Logo: Commercial Architecture / Gavel */}
                <div style={{ width: '68px', height: '68px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#5a0d1b', border: '1px solid #f1ca7e', marginBottom: '22px' }}>
                  <svg style={{ width: '36px', height: '36px' }} viewBox="0 0 24 24" fill="none" stroke="#f1ca7e" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="9" y1="21" x2="9" y2="9" />
                    <path d="M14 15l2 2 4-4" />
                  </svg>
                </div>

                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', background: '#89192c', color: '#f1ca7e', border: '1px solid rgba(241, 202, 126, 0.4)', padding: '4px 12px', borderRadius: '9999px' }}>
                  03 · COMMERCIAL MONOPOLY
                </span>
                <h2 style={{ color: '#f1ca7e', fontSize: '28px', marginTop: '14px', fontWeight: 800, letterSpacing: '-0.01em' }}>
                  Market Monopoly
                </h2>
                <p style={{ color: '#e8dcc6', fontSize: '14px', lineHeight: 1.7, marginTop: '14px', fontWeight: 400 }}>
                  The premier corporate real estate and auction arena. Compete in live English gavel auctions for prime municipal commercial lots, build monopolistic syndicates across key business districts, extract rental yields, and orchestrate hostile syndicate liquidations.
                </p>
              </div>

              <div style={{ marginTop: '36px' }}>
                <button
                  onClick={() => navigate('/market-monopoly')}
                  style={{ width: '100%', padding: '14px 26px', borderRadius: '9999px', fontWeight: 700, fontSize: '13px', letterSpacing: '0.04em', border: 'none', background: '#f1ca7e', color: '#5a0d1b', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s ease-out' }}
                >
                  View Market Monopoly →
                </button>
              </div>
            </div>

          </div>
        </main>

        {/* Footer */}
        <footer style={{ paddingTop: '22px', borderTop: '1px solid #89192c', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#e8dcc6' }}>
          <div>Alpha Entrepreneurship Summit 2026 · Target: <strong>app.alphaace.pk</strong></div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>November 13–15, 2026</span>
            <span>·</span>
            <span>Alpha College Karachi</span>
          </div>
        </footer>

      </div>
    </div>
  );
}
