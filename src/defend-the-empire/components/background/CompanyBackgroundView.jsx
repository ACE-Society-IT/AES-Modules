"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

export default function CompanyBackgroundView({ onEnterSimulation }) {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#5a0d1b] text-[#f8eee1] py-12 md:py-20 px-6 sm:px-10 lg:px-16">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#f8eee1] uppercase">
          Defend The Empire: Company Background
        </h1>

        {/* Subheading */}
        <h2 className="text-xl sm:text-2xl font-bold text-[#f1ca7e]">
          Strategic Profile, Global Infrastructure, and Operational Exposure
        </h2>

        {/* Background Introduction Paragraph */}
        <p className="text-base sm:text-lg text-[#e8dcc6] leading-relaxed">
          Founded over a century ago as a maritime trade and industrial syndicate,
          the Empire operates as a central transcontinental conglomerate managing
          vital supply corridors, sovereign-grade refineries, energy distribution networks,
          and private financial clearing facilities across four continents. Its operations
          form the quiet backbone of regional economies, generating significant operating
          liquidity while sustaining deep systemic exposure to coordinated external shocks.
        </p>

        {/* Bullet Points (Plain list, zero card borders) */}
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-bold text-[#f8eee1]">
            Core Operations and Asset Footprint
          </h3>

          <ul className="list-disc pl-5 space-y-3 text-sm sm:text-base text-[#e8dcc6] leading-relaxed">
            <li>
              <strong className="text-[#f8eee1]">Maritime Logistics & Chokepoint Control:</strong> Operates
              thirty-eight deep-water terminals and holds exclusive transit rights across three critical straits,
              facilitating over twenty-two percent of raw material shipments worldwide.
            </li>
            <li>
              <strong className="text-[#f8eee1]">Metallurgical Refining & Rare-Earth Smelters:</strong> Controls
              six industrial refining complexes that process foundational components required for advanced
              aerospace, telecommunications, and regional power utilities.
            </li>
            <li>
              <strong className="text-[#f8eee1]">Autonomous Clearinghouse & Reserves:</strong> Administers
              a private transaction clearing facility handling billions in cross-border settlements, anchored
              by audited gold reserves and an operational treasury war chest.
            </li>
            <li>
              <strong className="text-[#f8eee1]">Threat Landscape & Hostile Vectors:</strong> Targeted
              by adversarial cartels deploying synchronized kinetic blockades, cyber incursions against clearing
              ledgers, aggressive short-selling campaigns, and hostile boardroom proxy actions.
            </li>
            <li>
              <strong className="text-[#f8eee1]">Mandatory Debt Floor & Covenant Constraints:</strong> Bound
              by institutional credit covenants stipulating that liquid cash must never fall below three hundred
              and fifty million dollars. A breach triggers immediate acceleration clauses and compulsory liquidation.
            </li>
          </ul>
        </div>

        {/* Conclusions */}
        <div className="space-y-3">
          <h3 className="text-lg sm:text-xl font-bold text-[#f8eee1]">
            Strategic Conclusions
          </h3>
          <p className="text-sm sm:text-base text-[#e8dcc6] leading-relaxed">
            Although the Empire holds immense physical and economic power, its high degree of centralized
            interdependence means localized disruption rapidly cascades into widespread liquidity distress.
            Preserving corporate continuity requires decisive leadership, active capital deployment, and
            unflinching resolution during critical operational bottlenecks.
          </p>
        </div>

        {/* Summary of How the Simulation Works */}
        <div className="space-y-3">
          <h3 className="text-lg sm:text-xl font-bold text-[#f1ca7e]">
            How the Crisis Simulation Works
          </h3>
          <p className="text-sm sm:text-base text-[#e8dcc6] leading-relaxed">
            In the live crisis simulation, you step directly into command of the Empire&apos;s treasury and defense
            operations across six consecutive hostile waves. Each wave introduces a real-time crisis scenario with an
            active countdown timer requiring your immediate directive. You will evaluate competing recommendations
            from your council advisors, balancing direct cash expenditure against vital indicators including Market
            Trust, Operational Stability, and Board Confidence. Allowing the timer to expire triggers an automatic
            timeout default penalty against your cash reserves. Your objective is to resolve all six crisis waves,
            repel the hostile syndicate, and ensure total remaining reserves remain strictly above the three hundred
            and fifty million dollar liquidation threshold to successfully defend the Empire.
          </p>
        </div>

        {/* CTA Button */}
        <div className="pt-6">
          <button
            type="button"
            onClick={onEnterSimulation}
            className="inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-[#f1ca7e] text-[#5a0d1b] hover:bg-[#f8eee1] font-bold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#5a0d1b]/40 text-sm sm:text-base"
          >
            <span>Enter Crisis Simulation War Room</span>
            <ArrowRight className="w-5 h-5 text-[#5a0d1b]" />
          </button>
        </div>

      </div>
    </div>
  );
}
