# Alpha ACE — Unified Participant Modules Suite

The official multi-module participant portal for the **Alpha Entrepreneurship Summit (AES)**.

## 🚀 Live Event Modules

When deployed to Vercel or any static host, this single repository powers all participant modules simultaneously:

1. **Module Selector Hub (`/`)**: Central event launchpad allowing contestants to select and enter their registered competition module.
2. **Investomania (`/investomania`)**: Full stock market trading desk, PSX equities, commodities, foreign exchange, live crisis breaking news feeds, and offshore tax evasion map.
3. **Defend The Empire (`/defend-the-empire`)**: Corporate crisis simulation portal with real-time scenario telemetry, background research, and dynamic response submissions.
4. **Projector View (`/investomania/projector` or `/projector`)**: Public big-screen tournament floor display with real-time countdown timer, live ticker, and sealed/unsealed 3D podium rankings.

---

## ⚡ Deployment on Vercel

This repository is optimized for instant **1-Click Vercel Deployment**:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

SPA deep-linking is pre-configured via `vercel.json` rewrites. All database interactions connect directly to the shared serverless Supabase backend without requiring a standalone API server.

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Production build test
npm run build
```
