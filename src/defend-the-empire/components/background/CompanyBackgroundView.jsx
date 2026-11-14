"use client";

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
          Zaika Foods — Company Profile, Heritage &amp; Financial Position
        </h2>

        {/* Background Introduction Paragraph */}
        <p className="text-base sm:text-lg text-[#e8dcc6] leading-relaxed">
          Zaika Foods was founded in 1953 in Karachi, Pakistan, as a small,
          one-room cottage industry by Sheherzad Azeemi. The company began by
          introducing spice blends in local markets just before the Eid holiday.
          Those spice blends quickly gained popularity, driving the worldwide
          expansion of the business into a global food processing and FMCG
          enterprise. Today, headquartered in Karachi with 2,600 employees and
          annual revenue of PKR 15 billion (2025), Zaika Foods operates across
          more than 75 countries on five continents.
        </p>

        {/* Bullet Points (Plain list, zero card borders) */}
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-bold text-[#f8eee1]">
            Company Profile &amp; Core Focus Areas
          </h3>

          <ul className="list-disc pl-5 space-y-3 text-sm sm:text-base text-[#e8dcc6] leading-relaxed">
            <li>
              <strong className="text-[#f8eee1]">Company Snapshot:</strong>{" "}
              Founded in 1953 and headquartered in Karachi, Pakistan, Zaika
              Foods operates in the food processing and FMCG industry with 2,600
              employees and a presence in over 75 countries across 5 continents.
            </li>
            <li>
              <strong className="text-[#f8eee1]">
                Authenticity of Flavors &amp; Recipes:
              </strong>{" "}
              Staying true to traditional taste, authentic recipes, and
              time-honored cooking methods.
            </li>
            <li>
              <strong className="text-[#f8eee1]">
                Heritage &amp; Cultural Identity:
              </strong>{" "}
              Highlighting the heritage, traditions, and cultural background of
              Pakistan across every market.
            </li>
            <li>
              <strong className="text-[#f8eee1]">
                Customer Education &amp; Experience:
              </strong>{" "}
              Creating an easily accessible cultural experience that connects
              customers with the story and craft behind each product.
            </li>
          </ul>
        </div>

        {/* Financial Position (Plain list, zero card borders) */}
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-bold text-[#f8eee1]">
            Financial Position
          </h3>

          <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-[#e8dcc6] leading-relaxed">
            <li>
              <strong className="text-[#f8eee1]">Company Valuation:</strong> PKR
              10 billion
            </li>
            <li>
              <strong className="text-[#f8eee1]">Annual Revenue (2025):</strong>{" "}
              PKR 15 billion
            </li>
            <li>
              <strong className="text-[#f8eee1]">Annual Expenses:</strong> PKR
              12.5 billion
            </li>
            <li>
              <strong className="text-[#f8eee1]">Annual Profit:</strong> PKR 2.5
              billion
            </li>
            <li>
              <strong className="text-[#f8eee1]">Cash Reserves:</strong> PKR 1
              billion
            </li>
            <li>
              <strong className="text-[#f8eee1]">Outstanding Debt:</strong> PKR
              2 billion
            </li>
          </ul>
        </div>

        {/* Summary of How the Simulation Works */}
        <div className="space-y-3">
          <h3 className="text-lg sm:text-xl font-bold text-[#f1ca7e]">
            How the Crisis Simulation Works
          </h3>
          <p className="text-sm sm:text-base text-[#e8dcc6] leading-relaxed">
            In the live crisis simulation, you step directly into command of the
            company&apos;s treasury and defense operations across six
            consecutive hostile waves. Each wave introduces a real-time crisis
            scenario with an active countdown timer requiring your immediate
            directive. You will evaluate competing recommendations from your
            council advisors, balancing direct cash expenditure against vital
            indicators including Market Trust, Operational Stability, and Board
            Confidence. Allowing the timer to expire triggers an automatic
            timeout default penalty against your cash reserves. Your objective
            is to resolve all six crisis waves and preserve sufficient cash
            reserves above the critical threshold to successfully defend the
            company.
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
