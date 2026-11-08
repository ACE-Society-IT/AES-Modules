import React from 'react';

/**
 * High-fidelity vector landmark silhouettes for the 10 Offshore Tax Havens:
 * - CYM: Cayman Islands (Seven Mile Palm & Offshore Yacht)
 * - ZRH: Zurich (Swiss Alpine Matterhorn Peaks & Vault Cog)
 * - GVA: Geneva (Jet d'Eau 140m Lake Fountain & Basin)
 * - PTY: Panama City (Panama Canal Container Ship & Locks)
 * - LUX: Luxembourg City (Pont Adolphe Grand Arched Bridge & Fortress)
 * - MCO: Monaco (Monte Carlo Casino Dome & Superyacht)
 * - WEB: Cyberspace (ZK Decentralized Nodes & Dark Pool Matrix)
 * - DXB: Dubai (Burj Khalifa Needle & Burj Al Arab Sail)
 * - SIN: Singapore (Marina Bay Sands Triple Towers & Skypark)
 * - BVI: British Virgin Islands (Twin-Hull Catamaran & Caribbean Archipelago)
 */

export function CaymanLandmark({ className = 'w-12 h-10' }) {
  return (
    <svg viewBox="0 0 100 80" fill="currentColor" className={className}>
      {/* Palm tree trunk */}
      <path d="M72,75 C70,55 76,38 85,25 C83,27 77,45 74,75 Z" opacity="0.9" />
      {/* Palm fronds */}
      <path d="M85,25 C92,18 99,22 100,28 C95,28 89,27 85,25 Z" />
      <path d="M85,25 C90,12 80,8 72,14 C76,18 80,21 85,25 Z" />
      <path d="M85,25 C82,10 70,12 62,20 C68,22 75,24 85,25 Z" />
      <path d="M85,25 C88,32 95,38 99,42 C96,36 91,31 85,25 Z" />
      {/* Yacht Hull */}
      <path d="M10,65 L55,65 L48,73 L18,73 Z" />
      {/* Yacht Main Sail */}
      <path d="M36,20 L36,60 L54,60 Z" opacity="0.85" />
      {/* Yacht Jib Sail */}
      <path d="M33,26 L33,60 L16,60 Z" opacity="0.7" />
      {/* Gentle Ocean Waves */}
      <path d="M5,76 Q25,73 45,76 T85,76 T100,76" stroke="currentColor" strokeWidth="2.5" fill="none" opacity="0.5" />
    </svg>
  );
}

export function ZurichLandmark({ className = 'w-12 h-10' }) {
  return (
    <svg viewBox="0 0 100 80" fill="currentColor" className={className}>
      {/* Swiss Alps / Matterhorn Peaks */}
      <polygon points="10,75 42,22 68,75" opacity="0.8" />
      <polygon points="42,22 36,36 44,38 48,32 56,42 68,75 10,75" opacity="0.9" />
      <polygon points="45,75 75,32 98,75" opacity="0.6" />
      {/* Snow cap highlights */}
      <polygon points="42,22 38,32 44,30 48,34 52,28" fill="#FFF" opacity="0.3" />
      {/* Swiss Fiduciary Cross in circle */}
      <circle cx="28" cy="62" r="10" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.75" />
      <rect x="25" y="56" width="6" height="12" rx="1" fill="currentColor" opacity="0.85" />
      <rect x="22" y="59" width="12" height="6" rx="1" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

export function GenevaLandmark({ className = 'w-12 h-10' }) {
  return (
    <svg viewBox="0 0 100 80" fill="currentColor" className={className}>
      {/* Jet d'Eau soaring plume (140m water fountain) */}
      <path d="M48,75 C48,45 46,20 49,8 C51,8 53,20 52,75 Z" opacity="0.85" />
      {/* Water plume spray mist */}
      <path d="M49,8 C45,15 35,28 32,45 C38,40 45,30 48,22 Z" opacity="0.4" />
      <path d="M50,8 C54,15 64,28 67,45 C61,40 54,30 51,22 Z" opacity="0.4" />
      <path d="M49,8 C42,22 30,38 24,58 C32,52 42,42 47,32 Z" opacity="0.25" />
      <path d="M50,8 C57,22 69,38 75,58 C67,52 57,42 52,32 Z" opacity="0.25" />
      {/* Lake Geneva basin ripples */}
      <ellipse cx="50" cy="74" rx="42" ry="4" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6" />
    </svg>
  );
}

export function PanamaLandmark({ className = 'w-12 h-10' }) {
  return (
    <svg viewBox="0 0 100 80" fill="currentColor" className={className}>
      {/* Panama Canal Lock Wall */}
      <rect x="5" y="55" width="22" height="20" opacity="0.6" />
      <rect x="73" y="55" width="22" height="20" opacity="0.6" />
      {/* Container Ship Bow & Hull */}
      <path d="M22,60 L78,60 L72,74 L28,74 Z" opacity="0.9" />
      <path d="M78,60 L88,54 L82,70 L72,74 Z" opacity="0.75" />
      {/* Cargo Containers stacked */}
      <rect x="30" y="46" width="10" height="13" opacity="0.7" />
      <rect x="42" y="44" width="10" height="15" opacity="0.8" />
      <rect x="54" y="46" width="10" height="13" opacity="0.7" />
      {/* Ship Bridge / Tower */}
      <rect x="25" y="38" width="8" height="21" opacity="0.85" />
      <rect x="27" y="32" width="4" height="6" opacity="0.9" />
      {/* Canal Water Surface */}
      <line x1="20" y1="75" x2="80" y2="75" stroke="currentColor" strokeWidth="2" opacity="0.5" />
    </svg>
  );
}

export function LuxembourgLandmark({ className = 'w-12 h-10' }) {
  return (
    <svg viewBox="0 0 100 80" fill="currentColor" className={className}>
      {/* Pont Adolphe Arched Bridge Deck */}
      <rect x="5" y="40" width="90" height="6" rx="2" opacity="0.85" />
      {/* Main Grand Arch */}
      <path d="M22,75 L22,46 C22,46 32,58 50,58 C68,58 78,46 78,46 L78,75 Z" fill="none" stroke="currentColor" strokeWidth="4" opacity="0.85" />
      {/* Side Arches */}
      <path d="M8,75 L8,46 C8,46 12,56 20,56 L20,75 Z" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.7" />
      <path d="M80,75 L80,56 C88,56 92,46 92,46 L92,75 Z" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.7" />
      {/* Medieval Castle Turret in background */}
      <rect x="44" y="18" width="12" height="22" opacity="0.7" />
      <polygon points="42,18 50,8 58,18" opacity="0.9" />
    </svg>
  );
}

export function MonacoLandmark({ className = 'w-12 h-10' }) {
  return (
    <svg viewBox="0 0 100 80" fill="currentColor" className={className}>
      {/* Monte Carlo Grand Casino Dome */}
      <path d="M30,55 L30,42 C30,30 40,22 50,22 C60,22 70,30 70,42 L70,55 Z" opacity="0.7" />
      <path d="M46,22 C46,14 50,10 50,10 C50,10 54,14 54,22 Z" opacity="0.9" />
      {/* Palace Classical Columns */}
      <rect x="34" y="42" width="4" height="20" opacity="0.9" />
      <rect x="44" y="42" width="4" height="20" opacity="0.9" />
      <rect x="52" y="42" width="4" height="20" opacity="0.9" />
      <rect x="62" y="42" width="4" height="20" opacity="0.9" />
      {/* Mega Yacht Hull at port */}
      <path d="M12,68 L88,68 L80,76 L20,76 Z" opacity="0.8" />
      <polygon points="76,68 88,68 82,62 72,62" opacity="0.75" />
    </svg>
  );
}

export function CyberspaceLandmark({ className = 'w-12 h-10' }) {
  return (
    <svg viewBox="0 0 100 80" fill="currentColor" className={className}>
      {/* Central ZK Matrix Block / Isometric Polygon */}
      <polygon points="50,15 80,32 50,49 20,32" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.9" />
      <polygon points="20,32 50,49 50,75 20,58" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.75" />
      <polygon points="80,32 50,49 50,75 80,58" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.75" />
      {/* Network Nodes */}
      <circle cx="50" cy="15" r="4" opacity="0.9" />
      <circle cx="80" cy="32" r="4" opacity="0.9" />
      <circle cx="20" cy="32" r="4" opacity="0.9" />
      <circle cx="50" cy="49" r="3.5" opacity="0.8" />
      <circle cx="50" cy="75" r="4" opacity="0.9" />
      {/* Satellite cross-chain links */}
      <circle cx="12" cy="18" r="2.5" opacity="0.5" />
      <line x1="20" y1="32" x2="12" y2="18" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.5" />
      <circle cx="88" cy="18" r="2.5" opacity="0.5" />
      <line x1="80" y1="32" x2="88" y2="18" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.5" />
    </svg>
  );
}

export function DubaiLandmark({ className = 'w-12 h-10' }) {
  return (
    <svg viewBox="0 0 100 80" fill="currentColor" className={className}>
      {/* Burj Khalifa Towering Spire */}
      <polygon points="38,75 42,75 42,45 44,45 44,30 46,30 46,14 47,14 47,4 49,4 49,14 50,14 50,30 52,30 52,45 54,45 54,75 58,75" opacity="0.85" />
      {/* Spire needle */}
      <line x1="48" y1="4" x2="48" y2="0" stroke="currentColor" strokeWidth="2" opacity="0.9" />
      {/* Burj Al Arab Sail (Right) */}
      <path d="M68,75 C68,48 76,32 88,26 L88,75 Z" opacity="0.7" />
      <line x1="88" y1="20" x2="88" y2="75" stroke="currentColor" strokeWidth="3" opacity="0.85" />
      {/* Desert Dunes baseline */}
      <path d="M5,75 Q35,70 65,75 T100,75" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5" />
    </svg>
  );
}

export function SingaporeLandmark({ className = 'w-12 h-10' }) {
  return (
    <svg viewBox="0 0 100 80" fill="currentColor" className={className}>
      {/* Marina Bay Sands 3 Towers */}
      <path d="M22,75 L25,32 L33,32 L35,75 Z" opacity="0.8" />
      <path d="M43,75 L45,32 L53,32 L55,75 Z" opacity="0.8" />
      <path d="M63,75 L65,32 L73,32 L75,75 Z" opacity="0.8" />
      {/* SkyPark Ship Cantilever Roof */}
      <path d="M14,30 C35,26 65,26 88,31 L84,36 C65,31 35,31 16,35 Z" opacity="0.95" />
      <circle cx="85" cy="28" r="1.5" opacity="0.8" />
      {/* Supertree Grove silhouette */}
      <path d="M88,75 L91,58 C86,52 96,52 91,58 Z" opacity="0.6" />
    </svg>
  );
}

export function BviLandmark({ className = 'w-12 h-10' }) {
  return (
    <svg viewBox="0 0 100 80" fill="currentColor" className={className}>
      {/* Twin-Hull Catamaran Yacht */}
      {/* Left Hull */}
      <path d="M12,68 L50,68 L44,75 L18,75 Z" opacity="0.8" />
      {/* Right Hull */}
      <path d="M52,68 L90,68 L84,75 L58,75 Z" opacity="0.8" />
      {/* Bridged Cockpit Deck */}
      <rect x="30" y="62" width="42" height="6" rx="2" opacity="0.85" />
      {/* Catamaran Mast & Mainsail */}
      <path d="M51,18 L51,62 L78,62 Z" opacity="0.8" />
      <path d="M48,25 L48,62 L28,62 Z" opacity="0.65" />
      {/* Caribbean Ocean Wave */}
      <path d="M5,76 Q25,72 50,76 T95,76" stroke="currentColor" strokeWidth="2.5" fill="none" opacity="0.5" />
    </svg>
  );
}

// Master Lookup by Airport Code or City Substring
export default function CityLandmarkSvg({ code = '', className = 'w-12 h-10' }) {
  const c = String(code).toUpperCase();
  const svgClass = `city-landmark-svg ${className}`.trim();

  if (c === 'CYM' || c.includes('CAYMAN') || c.includes('GEORGE')) {
    return <CaymanLandmark className={svgClass} />;
  }
  if (c === 'ZRH' || c.includes('ZURICH') || c.includes('SWISS')) {
    return <ZurichLandmark className={svgClass} />;
  }
  if (c === 'GVA' || c.includes('GENEVA')) {
    return <GenevaLandmark className={svgClass} />;
  }
  if (c === 'PTY' || c.includes('PANAMA')) {
    return <PanamaLandmark className={svgClass} />;
  }
  if (c === 'LUX' || c.includes('LUXEMBOURG')) {
    return <LuxembourgLandmark className={svgClass} />;
  }
  if (c === 'MCO' || c.includes('MONACO')) {
    return <MonacoLandmark className={svgClass} />;
  }
  if (c === 'DXB' || c.includes('DUBAI') || c.includes('UAE')) {
    return <DubaiLandmark className={svgClass} />;
  }
  if (c === 'SIN' || c.includes('SINGAPORE')) {
    return <SingaporeLandmark className={svgClass} />;
  }
  if (c === 'BVI' || c.includes('ROAD') || c.includes('VIRGIN')) {
    return <BviLandmark className={svgClass} />;
  }
  return <CyberspaceLandmark className={svgClass} />;
}

