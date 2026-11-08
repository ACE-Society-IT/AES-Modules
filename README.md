<div align="center">

<!-- Animated Header Wave Banner -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=701020&height=220&section=header&text=ALPHA%20ACE%20MODULES&fontSize=42&fontColor=F1CA7E&animation=fadeIn&fontAlignY=38&desc=Unified%20Participant%20Competition%20Suite%20•%20AES%202026&descAlignY=62&descAlign=50&descSize=18" width="100%" alt="Alpha ACE Modules Header" />

<!-- Dynamic Animated Typing Banner -->
<a href="https://github.com/ACE-Society-IT/AES-Modules">
  <img src="https://readme-typing-svg.demolab.com?font=Outfit&weight=600&size=23&pause=1200&color=F1CA7E&background=5A0D1B00&center=true&vCenter=true&width=800&lines=✨+Alpha+Entrepreneurship+Summit+(AES)+2026;🏆+Unified+Participant+Competition+Modules;📈+Investomania%3A+Real-Time+Trading+%26+Tax+Shield;🛡️+Defend+The+Empire%3A+Corporate+Crisis+Simulation;📺+Live+3D+Podium+%26+Big-Screen+Arena+Projector;⚡+Instant+Zero-Config+Vercel+Deployment" alt="AES Modules Typing SVG" />
</a>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Alpha%20ACE%202026-701020?style=for-the-badge&logo=shield&logoColor=F1CA7E" alt="Platform" />
  <img src="https://img.shields.io/badge/Deployment-Vercel%20Serverless-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Vite" />
  <img src="https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Motion-Framer%20Motion-FF0055?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
</p>

</div>

---

### 📖 Repository Description
> **Alpha Entrepreneurship Summit (AES) Unified Participant Modules Suite** — High-performance, serverless participant portal hosting the flagship **Investomania** trading simulation, **Defend The Empire** crisis portal, public arena **3D Projectors**, and the central **Module Selection Gateway** in a single multi-tenant SPA.

---

## 🌟 Interactive Module Arena

This repository unifies all competition modules into a seamless multi-route web application. When deployed to Vercel, contestants and audience members access each arena from one unified URL:

| Module | Route | Badges | Highlights |
| :--- | :--- | :--- | :--- |
| **🌐 Module Gateway** | [`/`](file:///) | `Portal` `Lobby` | Central entry point directing participants to their registered events |
| **📈 Investomania** | [`/investomania`](file:///investomania) | `Live Market` `PSX` | Real-time stock trading, commodities, currencies, crisis decryption & tax evasion |
| **🛡️ Defend The Empire** | [`/defend-the-empire`](file:///defend-the-empire) | `Corporate Crisis` | Scenario intelligence briefings, dynamic risk meters, and team proposal submissions |
| **📺 Investomania Projector** | [`/investomania/projector`](file:///investomania/projector) | `Stage Display` `3D Podium` | Full-screen spectator arena with live ticker tape, countdown clocks, and sealed podium reveal |
| **🏆 Public Leaderboard** | [`/investomania/leaderboard`](file:///investomania/leaderboard) | `Rankings` | Live team standings, net-worth calculations, and portfolio distributions |

---

## ⚡ 1-Click Vercel Deployment

Deploy this entire multi-module suite with zero configuration:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FACE-Society-IT%2FAES-Modules)

### Build Settings
| Setting | Recommended Value |
| :--- | :--- |
| **Framework Preset** | `Vite` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

> [!NOTE]
> All client-side routing is handled automatically by the pre-configured [`vercel.json`](file:///vercel.json) rewrites, ensuring direct URL deep-linking to any module without 404 errors.

---

## 🎨 Design System & Palette

Crafted in alignment with the official **Alpha ACE Imperial Palette**:

```
█ #701020  Royal Crimson    (Primary brand accent & active states)
█ #5A0D1B  Abyssal Oxblood  (Deep competition canvas & dark theme background)
█ #F1CA7E  Imperial Gold    (Metrics, ticker gains & podium highlights)
█ #F8EEE1  Warm Cream       (High-contrast editorial typography)
```

- **Adaptive Themes**: 3 instant-toggle colorways (`AES Theme`, `Dark Maroon`, and `White Paper`).
- **Tactile Physics**: Custom micro-interactions with smooth scale press feedback via Framer Motion.
- **Glassmorphism**: 20px blurred dynamic capsule navigation and floating command bars.

---

## 🛠️ Local Development Quickstart

```bash
# Clone the repository
git clone https://github.com/ACE-Society-IT/AES-Modules.git

# Enter project directory
cd AES-Modules

# Install dependencies
npm install

# Start local development server (runs on port 5173)
npm run dev

# Run production build validation
npm run build
```

---

## 📁 Repository Structure

```tree
AES-Modules/
├── public/                 # Static brand assets & logos
│   ├── aes-logo.png        # Official AES summit crest
│   └── InvestomaniaLogo.png
├── src/
│   ├── components/         # Reusable UI components & tactile buttons
│   ├── context/            # Global Supabase & Game state providers
│   ├── pages/
│   │   ├── ModuleSelectorPage.jsx  # Arena launchpad (Route: /)
│   │   ├── LandingPage.jsx         # Investomania home & rules (/investomania)
│   │   ├── LoginPage.jsx           # Team authentication (/investomania/login)
│   │   ├── TradingPortal.jsx       # PSX market trading desk
│   │   ├── ProjectorView.jsx       # Arena big-screen display
│   │   └── PodiumLeaderboardView.jsx
│   ├── index.css           # Imperial Theme design tokens & CSS variables
│   └── App.jsx             # Unified React router configuration
├── vercel.json             # SPA deep-linking rewrite rules
└── package.json            # Scripts & dependencies
```

---

<div align="center">

<!-- Animated Waving Footer -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=5A0D1B&height=120&section=footer" width="100%" alt="Alpha ACE Modules Footer" />

<sub>Designed with excellence for the <b>Alpha Entrepreneurship Summit (AES) 2026</b></sub>

</div>
