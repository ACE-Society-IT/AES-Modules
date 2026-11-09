import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { GameProvider, useGame } from './context/GameContext.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

// Code-Split Dynamic Lazy Imports for Ultra-Fast Initial Bundle
const ModuleSelectorPage = lazy(() => import('./pages/ModuleSelectorPage.jsx'));
const LandingPage = lazy(() => import('./pages/LandingPage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const TradingPortal = lazy(() => import('./pages/TradingPortal.jsx'));
const ProjectorView = lazy(() => import('./pages/ProjectorView.jsx'));
const EmpirePortalShell = lazy(() => import('./defend-the-empire/components/EmpirePortalShell.jsx'));
const MarketMonopolyApp = lazy(() => import('./market-monopoly/components/MarketMonopolyApp.jsx'));
const MonopolyProjectorView = lazy(() => import('./market-monopoly/components/MonopolyProjectorView.jsx'));

function PageTitleSync() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.toLowerCase();
    if (path === '/' || path === '') {
      document.title = 'AES Modules';
    } else if (path.startsWith('/market-monopoly')) {
      document.title = 'Market Monopoly';
    } else if (path.startsWith('/defend-the-empire')) {
      document.title = 'Defend The Empire';
    } else if (path.startsWith('/investomania')) {
      document.title = 'Investomania';
    } else {
      document.title = 'AES Modules';
    }
  }, [location.pathname]);

  return null;
}

function AppLoadingFallback({ message = 'Connecting to Investomania Floor...' }) {
  return (
    <div className="w-full min-h-screen flex items-center justify-center p-6 bg-[#5A0D1B] text-[#F1CA7E]">
      <div className="p-8 rounded-2xl border border-[rgba(241,202,126,0.35)] bg-[#701020] text-center max-w-sm w-full space-y-3 shadow-2xl">
        <div className="w-8 h-8 mx-auto border-2 border-[#F1CA7E] border-t-transparent rounded-full animate-spin" />
        <p className="font-rounded font-bold text-sm text-[#F8EEE1]">{message}</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { team } = useGame();
  const location = useLocation();

  if (!team) {
    return <Navigate to="/investomania/login" state={{ from: location }} replace />;
  }
  return children;
}

export default function App() {
  return (
    <ErrorBoundary>
      <GameProvider>
        <BrowserRouter>
          <PageTitleSync />
          <Suspense fallback={<AppLoadingFallback />}>
            <Routes>
              {/* Main Entrance (app.alphaace.pk): AES Theme Module Selector */}
              <Route path="/" element={<ModuleSelectorPage />} />

              {/* Module 1: Investomania Separate Landing & Sub-pages */}
              <Route path="/investomania" element={<LoginPage />} />
              <Route path="/investomania/landing" element={<LandingPage />} />
              <Route path="/investomania/login" element={<LoginPage />} />

              {/* Investomania Trading Desk Routes */}
              <Route path="/investomania/market" element={<ProtectedRoute><TradingPortal activeTab="market" /></ProtectedRoute>} />
              <Route path="/investomania/stocks" element={<ProtectedRoute><TradingPortal activeTab="stocks" /></ProtectedRoute>} />
              <Route path="/investomania/portfolio" element={<ProtectedRoute><TradingPortal activeTab="portfolio" /></ProtectedRoute>} />
              <Route path="/investomania/crisis" element={<ProtectedRoute><TradingPortal activeTab="crisis" /></ProtectedRoute>} />
              <Route path="/investomania/leaderboard" element={<ProtectedRoute><TradingPortal activeTab="leaderboard" /></ProtectedRoute>} />
              <Route path="/investomania/rules" element={<ProtectedRoute><TradingPortal activeTab="rules" /></ProtectedRoute>} />
              <Route path="/investomania/tax" element={<ProtectedRoute><TradingPortal activeTab="tax" /></ProtectedRoute>} />
              <Route path="/investomania/projector" element={<ProjectorView />} />

              {/* Legacy route redirects -> /investomania/... */}
              <Route path="/market" element={<Navigate to="/investomania/market" replace />} />
              <Route path="/login" element={<Navigate to="/investomania/login" replace />} />
              <Route path="/stocks" element={<Navigate to="/investomania/stocks" replace />} />
              <Route path="/portfolio" element={<Navigate to="/investomania/portfolio" replace />} />
              <Route path="/crisis" element={<Navigate to="/investomania/crisis" replace />} />
              <Route path="/leaderboard" element={<Navigate to="/investomania/leaderboard" replace />} />
              <Route path="/rules" element={<Navigate to="/investomania/rules" replace />} />
              <Route path="/tax" element={<Navigate to="/investomania/tax" replace />} />
              <Route path="/projector" element={<Navigate to="/investomania/projector" replace />} />

              {/* Defend the Empire Participant Module */}
              <Route path="/defend-the-empire" element={<EmpirePortalShell />} />
                            {/* Market Monopoly Classroom Projector (Hidden URL) */}
              <Route path="/market-monopoly/projector" element={<MonopolyProjectorView />} />
              <Route path="/market-monopoly/*" element={<MarketMonopolyApp />} />

              {/* Explicitly Block & Redirect Any Admin Access Attempts from Modules */}
              <Route path="/admin" element={<Navigate to="/" replace />} />
              <Route path="/investomania/admin" element={<Navigate to="/" replace />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </GameProvider>
    </ErrorBoundary>
  );
}
