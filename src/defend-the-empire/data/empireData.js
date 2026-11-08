export const EMPIRE_METADATA = {
  name: "Aurelia Sovereign Holdings",
  shortName: "AURELIA EMPIRE",
  motto: "Per Ferrum et Aurum — Through Iron and Gold, We Endure",
  classification: "SOVEREIGN TIER-1 CONGLOMERATE // DOSSIER REF: ASH-2026-IX",
  founded: "1894 • Geneva & Alexandria",
  headquarters: "The Citadel Tower, Zurich & Port Aurelia",
  fiscalQuarter: "Q4 2026 // EMERGENCY WAR ROOM SESSION",
  initialBalance: 850, // in $ Millions ($850.0M)
  criticalThreshold: 350, // in $ Millions ($350.0M minimum sovereign covenant)
  optimalTarget: 700, // in $ Millions ($700.0M strong reserve line)
  initialMetrics: {
    marketTrust: 88,
    operationalStability: 92,
    boardConfidence: 85,
  },
  baselineHistory: [
    {
      step: 0,
      label: "Q1 Base",
      eventTitle: "Pre-Crisis Sovereign Reserve",
      balance: 810,
      delta: 0,
      decisionCode: "BASE-Q1",
      marketTrust: 86,
      operationalStability: 90,
    },
    {
      step: 1,
      label: "Q2 Audit",
      eventTitle: "Bullion & Maritime Dividend",
      balance: 835,
      delta: 25,
      decisionCode: "BASE-Q2",
      marketTrust: 87,
      operationalStability: 91,
    },
    {
      step: 2,
      label: "Q3 Open",
      eventTitle: "Crisis War Room Activation",
      balance: 850,
      delta: 15,
      decisionCode: "INIT-00",
      marketTrust: 88,
      operationalStability: 92,
    },
  ],
};

export const COMPANY_DOSSIER = {
  executiveSummary: {
    headline: "Architects of Global Trade, Sovereign Liquidity & Strategic Infrastructure",
    lead: "For over a century, Aurelia Sovereign Holdings has operated as the silent backbone of transcontinental commerce, controlling 34% of deep-water maritime chokepoints, six sovereign-grade rare-earth refineries, and an autonomous clearing house backed by physical bullion.",
    doctrine:
      "In November 2026, intelligence intercepted a coordinated multi-vector offensive codenamed 'OPERATION ECLIPSE' aimed at triggering a liquidity cascade across our four core divisions. As Supreme Chancellor of the War Room, you hold unilateral authority over the $850.0M Emergency Sovereign Reserve. If liquid reserves drop below the $350.0M Debt Covenant Floor, hostile creditors can trigger forced liquidation of the Empire.",
    pillars: [
      {
        id: "pillar-liquidity",
        title: "Covenant Liquidity Shield",
        metric: "$850.0M Liquid / $350.0M Floor",
        detail:
          "Our syndicated sovereign bond requires maintaining at least $350.0M in unencumbered liquid capital at all times.",
      },
      {
        id: "pillar-infrastructure",
        title: "Chokepoint Monopoly",
        metric: "14 Global Maritime & Rail Hubs",
        detail:
          "Disruption in any single shipping corridor reverberates across our refinery supply chains within 12 hours.",
      },
      {
        id: "pillar-governance",
        title: "The Iron Council Charter",
        metric: "7 Voting Sovereign Houses",
        detail:
          "Every capital deployment alters Board Confidence, Market Trust, and Operational Stability in real time.",
      },
    ],
  },

  keyStats: [
    {
      id: "stat-reserve",
      label: "Liquid War Chest",
      value: "$850.0M",
      subtext: "Immediate deployable sovereign liquidity",
      badge: "ACTIVE RESERVE",
    },
    {
      id: "stat-covenant",
      label: "Debt Covenant Floor",
      value: "$350.0M",
      subtext: "Breach triggers hostile syndicate takeover",
      badge: "HARD FLOOR",
    },
    {
      id: "stat-assets",
      label: "Total Empire Valuation",
      value: "$14.8B",
      subtext: "Across 4 sovereign industrial divisions",
      badge: "AAA RATED",
    },
    {
      id: "stat-workforce",
      label: "Global Operatives",
      value: "42,600",
      subtext: "Stationed across 28 sovereign jurisdictions",
      badge: "TIER-1 SECURITY",
    },
  ],

  divisions: [
    {
      id: "div-maritime",
      code: "DIV-01 // MARITIME",
      name: "Aurelia Maritime & Strait Logistics",
      director: "Admiral Marcus Sterling",
      revenueShare: "38% of Empire Revenue",
      annualValuation: "$5.6B Asset Base",
      riskExposure: "CRITICAL — Strait Blockades & Piracy",
      headquarters: "Port Aurelia, Mediterranean Basin",
      summary:
        "Operates 68 ultra-large automated container vessels and three private deep-water canal terminals. Generates the empire's primary daily cash flow, but faces extreme exposure to geopolitical blockades.",
      strategicTip:
        "Starving Maritime of emergency escort funding causes severe cascading supply penalties in subsequent waves.",
    },
    {
      id: "div-refinery",
      code: "DIV-02 // RESOURCES",
      name: "Vespera Rare-Earth & Energy Smelters",
      director: "Dr. Viktor Kaelen",
      revenueShare: "29% of Empire Revenue",
      annualValuation: "$4.3B Asset Base",
      riskExposure: "HIGH — Grid Sabotage & Export Embargoes",
      headquarters: "Vespera Alpine Complex, Zurich",
      summary:
        "Refines 41% of Europe and Asia's aerospace-grade neodymium, lithium, and palladium. High fixed operating costs mean any facility shutdown rapidly drains cash reserves.",
      strategicTip:
        "Investing in autonomous micro-grid backups early shields the Empire from extortionate spot-energy spikes.",
    },
    {
      id: "div-treasury",
      code: "DIV-03 // CAPITAL",
      name: "Solaris Sovereign Clearing & Bullion",
      director: "Elena Rostova",
      revenueShare: "21% of Empire Revenue",
      annualValuation: "$3.1B Asset Base",
      riskExposure: "SEVERE — Algorithmic Short Attacks",
      headquarters: "The Citadel Vault, Geneva",
      summary:
        "Manages sovereign gold vaults, institutional bond issuance, and inter-bank settlement corridors. Acts as the financial nerve center protecting our currency pegs and credit rating.",
      strategicTip:
        "High-cost bond buybacks hurt immediate cash balance but can restore Market Trust and unlock emergency dividends.",
    },
    {
      id: "div-aegis",
      code: "DIV-04 // DEFENSE",
      name: "Aegis Cybernetics & Orbital Telemetry",
      director: "Lord Cassian Vance",
      revenueShare: "12% of Empire Revenue",
      annualValuation: "$1.8B Asset Base",
      riskExposure: "HIGH — Zero-Day Ransomware & Insider Leaks",
      headquarters: "Blackwatch Spire, Vienna",
      summary:
        "Maintains low-earth-orbit reconnaissance satellites, encrypted quantum comms, and counter-espionage protocols across all Aurelia facilities.",
      strategicTip:
        "Deploying Aegis counter-intelligence teams often reveals covert low-cost resolutions with high Board approval.",
    },
  ],

  boardMembers: [
    {
      id: "adv-rostova",
      name: "Elena Rostova",
      role: "Chief Sovereign Treasurer",
      specialty: "Liquidity Preservation & Bond Markets",
      stance: "Fiscal Hawk",
      quote:
        "Every million we burn in panic brings the Obsidian Syndicate closer to triggering our $350M debt covenant. Spend with surgical precision.",
    },
    {
      id: "adv-vance",
      name: "Lord Cassian Vance",
      role: "Director of Counter-Intelligence",
      specialty: "Asymmetric Warfare & Cyber Containment",
      stance: "Strategic Realist",
      quote:
        "Crises are rarely accidents. Look for the hidden hand behind the disruption before paying ransom to mercenaries.",
    },
    {
      id: "adv-sterling",
      name: "Admiral Marcus Sterling",
      role: "Supreme Commander of Logistics",
      specialty: "Supply Chain Resilience & Fleet Security",
      stance: "Operational Hardliner",
      quote:
        "Paper reserves mean nothing if our hulls are stranded and our smelters go cold. Protect the physical arteries of the Empire first.",
    },
    {
      id: "adv-chen",
      name: "Dr. Aria Chen",
      role: "Chief Sovereign Counsel",
      specialty: "International Tribunals & Regulatory Immunity",
      stance: "Diplomatic Architect",
      quote:
        "When brute force drains the treasury, treaty leverage and sovereign arbitration can turn an enemy's blockade against them.",
    },
  ],

  historicalTimeline: [
    {
      year: "1894",
      title: "The Geneva Bullion Charter",
      description:
        "House Aurelia establishes a private clearing house financing trans-Alpine rail tunnels and Mediterranean steamship routes.",
    },
    {
      year: "1958",
      title: "Acquisition of Vespera Rare-Earth Mines",
      description:
        "Strategic pivot into aerospace metallurgy and sovereign energy reserves, tripling industrial net worth.",
    },
    {
      year: "1999",
      title: "Port Aurelia Autonomous Zone Treaty",
      description:
        "Secures a 99-year sovereign lease over three deep-water maritime chokepoints, creating a near-monopoly on East-West freight.",
    },
    {
      year: "2022",
      title: "Launch of Aegis Orbital Constellation",
      description:
        "Deployment of 18 proprietary telemetry satellites to automate fleet routing and secure quantum vault ledgers.",
    },
    {
      year: "NOV 2026",
      title: "Operation Eclipse — The Syndicate Offensive",
      description:
        "Rival consortium 'The Obsidian Syndicate' launches a synchronized six-wave attack on Aurelia's ships, vaults, grids, and board.",
    },
  ],
};

export const CRISIS_SCENARIOS = [
  {
    id: "crisis-wave-1",
    waveNumber: 1,
    codeName: "OPERATION IRON CHOKE",
    title: "Hormuz-Suez Convoy Seizure & Strait Blockade",
    category: "MARITIME LOGISTICS CRISIS",
    severity: "CRITICAL // LEVEL 5",
    divisionAffected: "Aurelia Maritime & Strait Logistics",
    location: "Red Sea & Eastern Mediterranean Approaches",
    timeLimitSeconds: 90,
    incomingTransmission:
      "FLASH ALERT: Three flagship LNG & rare-earth carriers (Aurelia Titan, Sovereign Star, Vespera Crown) have been surrounded by privateer gunboats operating under a fabricated environmental seizure warrant. 18% of quarterly refinery feedstock is frozen at sea. Every hour of delay triggers $12M in penalty clauses.",
    intelligenceNotes: [
      "Dossier Cross-Ref: Admiral Sterling warns that halting feedstock starves Vespera Smelters within 48 hours.",
      "Aegis telemetry indicates the gunboats are funded by a shell bank in Liechtenstein tied to the Obsidian Syndicate.",
      "Paying raw extortion damages Market Trust, while full naval intervention carries steep immediate mobilization costs.",
    ],
    timeoutPenalty: {
      costDelta: -140,
      marketTrustDelta: -18,
      operationalStabilityDelta: -20,
      boardConfidenceDelta: -22,
      headline: "COMMAND PARALYSIS: Convoy Impounded & Feedstock Contracts Defaulted",
      analysis:
        "Because the War Room failed to issue orders before the deadline expired, maritime authorities impounded all three vessels and penalty clauses triggered automatically across European clearing banks.",
    },
    options: [
      {
        id: "w1-opt-a",
        code: "DIRECTIVE ALPHA-01",
        title: "Deploy Aegis Private Naval Flotilla & Reroute Convoy",
        strategyType: "DECISIVE FORCE",
        costDelta: -85,
        riskLevel: "MODERATE RISK",
        metricsDelta: {
          marketTrust: +8,
          operationalStability: +10,
          boardConfidence: +9,
        },
        advisorName: "Admiral Marcus Sterling",
        advisorQuote:
          "Show overwhelming steel. Escort our hulls through international waters and dare their gunboats to fire on an armed sovereign convoy.",
        description:
          "Mobilize two contracted Aegis fast-attack corvettes, deploy electronic jamming pods, and divert the convoy through our secondary Crete deep-water corridor.",
        resultHeadline: "CONVOY LIBERATED: All Three Flagships Clear the Strait Intact",
        resultAnalysis:
          "The rapid deployment of Aegis naval assets forced the privateer flotilla to stand down without firing a shot. Fuel and charter mobilization cost $85.0M, but refinery schedules remain 100% unbroken and institutional investors applauded our resolve.",
        longTermConsequence: "Shipping lanes fortified; Market Trust and Operational Stability surged.",
      },
      {
        id: "w1-opt-b",
        code: "DIRECTIVE BETA-01",
        title: "Execute Back-Channel Geneva Bond Swap & Maritime Injunction",
        strategyType: "DIPLOMATIC LEVERAGE",
        costDelta: -45,
        riskLevel: "LOW RISK",
        metricsDelta: {
          marketTrust: +4,
          operationalStability: -3,
          boardConfidence: +5,
        },
        advisorName: "Dr. Aria Chen",
        advisorQuote:
          "Freeze the coastal magistrate's sovereign debt holdings in our Geneva clearing house. They will release our ships within six hours to save their own bond rating.",
        description:
          "Use Solaris Clearing House leverage to freeze regional port lines of credit while filing an emergency sovereign immunity bond of $45.0M.",
        resultHeadline: "INJUNCTION GRANTED: Vessels Released After 14-Hour Diplomatic Standoff",
        resultAnalysis:
          "Dr. Chen's legal counter-strike paralyzed the port authority's central bank clearing accounts. The ships were released for a modest $45.0M escrow settlement, preserving our cash war chest with only minor schedule delays.",
        longTermConsequence: "Preserved $40.0M in extra liquidity compared to military mobilization.",
      },
      {
        id: "w1-opt-c",
        code: "DIRECTIVE GAMMA-01",
        title: "Abandon Detained Cargo & Short Regional Shipping Futures",
        strategyType: "RUTHLESS SPECULATION",
        costDelta: +35,
        riskLevel: "EXTREME RISK",
        metricsDelta: {
          marketTrust: -14,
          operationalStability: -16,
          boardConfidence: -8,
        },
        advisorName: "Elena Rostova",
        advisorQuote:
          "If the world expects a supply shock, let us profit from the panic. Short the freight index through Zurich shells and claim maritime insurance.",
        description:
          "Declare force majeure on client deliveries, collect sovereign hull insurance, and execute leveraged derivative shorts on global freight indices to net +$35.0M.",
        resultHeadline: "TREASURY PROFITED +$35.0M, BUT INDUSTRIAL REPUTATION BATTERED",
        resultAnalysis:
          "Solaris traders extracted $35.0M in windfall derivative profits from the shipping spike, boosting our immediate balance to $885.0M. However, abandoning three flagship cargoes sparked client outrage and starved our smelters of raw ore.",
        longTermConsequence: "Cash balance increased, but Market Trust and Operational Stability suffered heavy erosion.",
      },
    ],
  },

  {
    id: "crisis-wave-2",
    waveNumber: 2,
    codeName: "PROTOCOL BLACKOUT",
    title: "Zero-Day Quantum Ransomware in Solaris Clearing Vaults",
    category: "CYBER & FINANCIAL WARFARE",
    severity: "SEVERE // LEVEL 5",
    divisionAffected: "Solaris Sovereign Clearing & Bullion",
    location: "The Citadel Vault, Geneva & Vienna Telemetry Spire",
    timeLimitSeconds: 85,
    incomingTransmission:
      "FLASH ALERT: A polymorphic zero-day payload ('CRIMSON WORM') has infiltrated the Solaris inter-bank settlement ledger. Attackers threaten to corrupt cryptographic bullion certificates within 85 seconds unless a $110M untraceable bearer-bond ransom is wired, or we sever our live clearing nodes.",
    intelligenceNotes: [
      "Dossier Cross-Ref: Lord Cassian Vance notes that Aegis maintains air-gapped cold ledgers in the Blackwatch Spire.",
      "Paying cyber-extortionists never guarantees ledger integrity and signals weakness to Wall Street and London.",
      "Hard-severing live nodes halts institutional trading fees for 72 hours, costing liquidity.",
    ],
    timeoutPenalty: {
      costDelta: -155,
      marketTrustDelta: -22,
      operationalStabilityDelta: -18,
      boardConfidenceDelta: -20,
      headline: "LEDGER CORRUPTION: Emergency Central Bank Bailout Forced",
      analysis:
        "Unchecked execution of the Crimson Worm corrupted three days of bullion settlement records, forcing Solaris to spend $155.0M in emergency liquidity guarantees to prevent a bank run.",
    },
    options: [
      {
        id: "w2-opt-a",
        code: "DIRECTIVE ALPHA-02",
        title: "Activate Air-Gapped Cold Ledgers & Purge Infected Nodes",
        strategyType: "TECHNICAL CONTAINMENT",
        costDelta: -60,
        riskLevel: "LOW RISK",
        metricsDelta: {
          marketTrust: +7,
          operationalStability: +6,
          boardConfidence: +8,
        },
        advisorName: "Lord Cassian Vance",
        advisorQuote:
          "Sever the fiber trunks immediately and switch to Aegis orbital quantum relays. We absorb 48 hours of settlement rebates, but the Syndicate gets zero.",
        description:
          "Physically isolate Geneva servers, migrate clearing to Aegis satellite relays, and compensate institutional clients $60.0M for 24-hour settlement latency.",
        resultHeadline: "QUANTUM FAILOVER COMPLETE: Zero Bullion Certificates Compromised",
        resultAnalysis:
          "Aegis engineers executed a textbook cold-ledger migration in 19 minutes. While client latency rebates and hardware replacement cost $60.0M, global regulators praised Aurelia's impenetrable resilience.",
        longTermConsequence: "Cyber architecture hardened against future syndicate intrusions.",
      },
      {
        id: "w2-opt-b",
        code: "DIRECTIVE BETA-02",
        title: "Launch Offensive Counter-Hack to Seize Syndicate Escrow",
        strategyType: "ASYMMETRIC COUNTER-STRIKE",
        costDelta: -20,
        riskLevel: "HIGH RISK",
        metricsDelta: {
          marketTrust: -2,
          operationalStability: +4,
          boardConfidence: +10,
        },
        advisorName: "Lord Cassian Vance",
        advisorQuote:
          "We traced their command-and-control signature to an offshore crypto-custodian in Cyprus. Let Aegis strike back and drain their operational wallet.",
        description:
          "Deploy offensive Aegis cyber-operatives ($20.0M black-budget authorization) to neutralize the attacker servers and recover stolen cryptographic keys.",
        resultHeadline: "SYNDICATE SERVERS NEUTRALIZED: Decryption Keys Recovered at Minimal Cost",
        resultAnalysis:
          "Aegis offensive teams breached the attackers' relay infrastructure and neutralized the kill-switch for just $20.0M. Rumors of unauthorized cyber-retaliation made conservative bondholders slightly nervous, but the Board celebrated the decisive victory.",
        longTermConsequence: "Saved massive capital; Board Confidence soared.",
      },
      {
        id: "w2-opt-c",
        code: "DIRECTIVE GAMMA-02",
        title: "Quietly Settle $110M Ransom via Shadow Shell Accounts",
        strategyType: "CAPITULATION",
        costDelta: -110,
        riskLevel: "HIGH RISK",
        metricsDelta: {
          marketTrust: -15,
          operationalStability: -6,
          boardConfidence: -16,
        },
        advisorName: "Elena Rostova",
        advisorQuote:
          "I strongly advise against this! Wiring $110M in bearer bonds drains our reserve and will almost certainly leak to the financial press.",
        description:
          "Authorize an immediate $110.0M bearer-bond transfer to obtain the decryption key without interrupting trading desk uptime.",
        resultHeadline: "RANSOM PAID & LEAKED: Financial Press Exposes $110.0M Payout",
        resultAnalysis:
          "Although systems stayed online, investigative journalists leaked the bearer-bond transfer within hours. The Empire lost $110.0M in liquid reserves and suffered a humiliating blow to both Market Trust and Board Confidence.",
        longTermConsequence: "Heavy treasury drain and reputational damage.",
      },
    ],
  },

  {
    id: "crisis-wave-3",
    waveNumber: 3,
    codeName: "OPERATION FURNACE FREEZE",
    title: "Alpine Hydro-Grid Sabotage at Vespera Rare-Earth Smelters",
    category: "INDUSTRIAL & ENERGY CRISIS",
    severity: "CRITICAL // LEVEL 4",
    divisionAffected: "Vespera Rare-Earth & Energy Smelters",
    location: "Vespera Alpine Complex, Canton Valais",
    timeLimitSeconds: 80,
    incomingTransmission:
      "FLASH ALERT: Coordinated transformer explosions have severed external high-voltage power to our six primary neodymium and palladium arc furnaces. If molten crucibles cool below 1,100°C over the next 80 seconds of simulation window, the solidified alloys will destroy the furnaces permanently.",
    intelligenceNotes: [
      "Dossier Cross-Ref: Vespera accounts for 29% of Empire revenue and supplies sovereign aerospace contracts.",
      "Purchasing emergency cross-border spot electricity during a grid spike costs $95M.",
      "Diverting reserve aviation fuel from Maritime depots to run on-site turbines is cheaper ($50M) but strains logistics.",
    ],
    timeoutPenalty: {
      costDelta: -165,
      marketTrustDelta: -16,
      operationalStabilityDelta: -25,
      boardConfidenceDelta: -18,
      headline: "CRUCIBLE SOLIDIFICATION: Four Primary Arc Furnaces Destroyed",
      analysis:
        "Inaction allowed the molten rare-earth alloys to solidify inside the reactors, requiring $165.0M in emergency demolition and replacement imports.",
    },
    options: [
      {
        id: "w3-opt-a",
        code: "DIRECTIVE ALPHA-03",
        title: "Fire Up Autonomous Micro-Turbines via Strategic Fuel Reserve",
        strategyType: "OPERATIONAL AGILITY",
        costDelta: -50,
        riskLevel: "LOW RISK",
        metricsDelta: {
          marketTrust: +6,
          operationalStability: +9,
          boardConfidence: +7,
        },
        advisorName: "Admiral Marcus Sterling",
        advisorQuote:
          "Air-lift our strategic maritime gas-turbine fuel into the Alpine valley and ignite Vespera's internal co-generation plant immediately.",
        description:
          "Spend $50.0M to airlift strategic fuel reserves and activate Vespera's closed-loop micro-grid, keeping all six furnaces at optimal thermal load.",
        resultHeadline: "THERMAL INTEGRITY SAVED: Closed-Loop Turbines Stabilize All Six Furnaces",
        resultAnalysis:
          "Emergency airlifts delivered turbine fuel with minutes to spare. For a controlled expenditure of $50.0M, Vespera achieved complete energy independence from the sabotaged municipal grid.",
        longTermConsequence: "Vespera smelters remain at 100% output capacity.",
      },
      {
        id: "w3-opt-b",
        code: "DIRECTIVE BETA-03",
        title: "Purchase Emergency Cross-Border Spot Power & Rebuild Substation",
        strategyType: "CAPITAL INTENSIVE",
        costDelta: -95,
        riskLevel: "LOW RISK",
        metricsDelta: {
          marketTrust: +9,
          operationalStability: +11,
          boardConfidence: +3,
        },
        advisorName: "Elena Rostova",
        advisorQuote:
          "Buying French and Italian peak-load interconnects at spot prices is painfully expensive ($95M), though it guarantees zero operational friction.",
        description:
          "Pay $95.0M for priority sovereign grid routing and rapid helicopter replacement of the destroyed high-voltage transformers.",
        resultHeadline: "GRID RESTORED AT PREMIUM COST: Zero Downtime, Heavy Treasury Outflow",
        resultAnalysis:
          "High-voltage redundancy was restored immediately, impressing aerospace clients. However, the $95.0M expenditure consumed a substantial portion of our liquid buffer.",
        longTermConsequence: "Maximum stability achieved at high monetary cost.",
      },
      {
        id: "w3-opt-c",
        code: "DIRECTIVE GAMMA-03",
        title: "Controlled Shutdown of Four Furnaces & Sell Raw Ore Inventory",
        strategyType: "AUSTERITY LIQUIDATION",
        costDelta: +20,
        riskLevel: "HIGH RISK",
        metricsDelta: {
          marketTrust: -11,
          operationalStability: -15,
          boardConfidence: -9,
        },
        advisorName: "Elena Rostova",
        advisorQuote:
          "Draining the crucibles and selling unrefined ore raises +$20M cash now, but our aerospace buyers will penalize us for missed deliveries.",
        description:
          "Emergency-drain four furnaces to prevent solidification damage and liquidate raw stockpiles on the spot market for a net +$20.0M cash injection.",
        resultHeadline: "ORE STOCKPILES LIQUIDATED (+$20.0M), AEROSPACE OUTPUT SLASHED BY 65%",
        resultAnalysis:
          "The treasury gained $20.0M from raw ore sales, lifting cash reserves, but shutting down four of six smelters crippled quarterly industrial capacity and rattled defense contractors.",
        longTermConsequence: "Short-term cash infusion traded against severe operational contraction.",
      },
    ],
  },

  {
    id: "crisis-wave-4",
    waveNumber: 4,
    codeName: "BEAR RAID ECLIPSE",
    title: "Coordinated Sovereign Bond Short Attack & Credit Downgrade Threat",
    category: "CAPITAL MARKETS WARFARE",
    severity: "EXTREME // LEVEL 5",
    divisionAffected: "Solaris Sovereign Clearing & Bullion",
    location: "London, Zurich & New York Debt Desks",
    timeLimitSeconds: 85,
    incomingTransmission:
      "FLASH ALERT: The Obsidian Syndicate has dumped $2.4B in synthetic credit default swaps against Aurelia Holdings while planting fabricated insolvency rumors. Rating agencies threaten an immediate downgrade unless we demonstrate overwhelming liquidity or execute a sovereign gold-backed defense.",
    intelligenceNotes: [
      "Dossier Cross-Ref: Elena Rostova can deploy physical bullion audits from the Citadel Vault to crush short-sellers.",
      "An aggressive open-market bond buyback ($105M) squeezes the shorts directly.",
      "Opening the Citadel Vault for live physical gold verification costs only $35M and restores institutional confidence.",
    ],
    timeoutPenalty: {
      costDelta: -150,
      marketTrustDelta: -25,
      operationalStabilityDelta: -12,
      boardConfidenceDelta: -24,
      headline: "CREDIT RATING DOWNGRADED: Margin Calls Drain $150.0M",
      analysis:
        "Failure to respond before the market bell allowed the short attack to succeed, triggering automatic margin calls of $150.0M across our credit facilities.",
    },
    options: [
      {
        id: "w4-opt-a",
        code: "DIRECTIVE ALPHA-04",
        title: "Broadcast Live Citadel Bullion Audit & Issue Gold-Backed Notes",
        strategyType: "TRANSPARENCY & PROOF",
        costDelta: -35,
        riskLevel: "LOW RISK",
        metricsDelta: {
          marketTrust: +14,
          operationalStability: +5,
          boardConfidence: +12,
        },
        advisorName: "Elena Rostova",
        advisorQuote:
          "Short-sellers thrive in shadows. Open the Geneva bullion vaults to Swiss central bank auditors live on air and back our bonds with physical gold bars.",
        description:
          "Spend $35.0M on immediate sovereign audit underwriting and gold-convertible yield coupons, proving beyond doubt that Aurelia's reserves are rock-solid.",
        resultHeadline: "SHORT SELLERS CRUSHED: Live Bullion Verification Triggers Massive Rally",
        resultAnalysis:
          "The sight of 400 metric tons of audited Aurelian gold bars on live financial television vaporized the insolvency rumors in minutes. For just $35.0M, Aurelia bonds surged to a five-year high.",
        longTermConsequence: "Market Trust and Board Confidence reached peak resilience.",
      },
      {
        id: "w4-opt-b",
        code: "DIRECTIVE BETA-04",
        title: "Execute $105M Open-Market Short Squeeze Buyback",
        strategyType: "AGGRESSIVE CAPITAL WARFARE",
        costDelta: -105,
        riskLevel: "MODERATE RISK",
        metricsDelta: {
          marketTrust: +10,
          operationalStability: +2,
          boardConfidence: +6,
        },
        advisorName: "Elena Rostova",
        advisorQuote:
          "Buying back $105M of our own discounted bonds punishes the Syndicate directly, though it locks up a huge chunk of liquid cash.",
        description:
          "Deploy $105.0M of liquid cash reserves to aggressively buy up shorted Aurelia debt on the open market, forcing Syndicate funds to cover at steep losses.",
        resultHeadline: "SYNDICATE FUNDS SQUEEZED: Bond Price Stabilized at $105.0M Cash Cost",
        resultAnalysis:
          "Our massive open-market purchase broke the bear raid and defended our AAA rating, though deploying $105.0M in cash noticeably narrowed our safety margin above the $350.0M covenant floor.",
        longTermConsequence: "Credit rating defended, but liquid war chest significantly reduced.",
      },
      {
        id: "w4-opt-c",
        code: "DIRECTIVE GAMMA-04",
        title: "Issue High-Yield Emergency Junk Tranche to Raise +$60M Cash",
        strategyType: "DEBT DILUTION",
        costDelta: +60,
        riskLevel: "EXTREME RISK",
        metricsDelta: {
          marketTrust: -18,
          operationalStability: -8,
          boardConfidence: -15,
        },
        advisorName: "Dr. Aria Chen",
        advisorQuote:
          "Raising emergency subordinated debt at 14% interest adds +$60M to our cash balance today, but the market will view it as a sign of desperation.",
        description:
          "Accept predatory hedge-fund financing to inject +$60.0M into the liquid balance immediately while diluting long-term bondholder seniority.",
        resultHeadline: "EMERGENCY CASH RAISED (+$60.0M), INSTITUTIONAL PRESTIGE PLUMMETS",
        resultAnalysis:
          "The treasury absorbed +$60.0M in fresh liquidity, bolstering our cash graph, but issuing high-yield debt during a bear raid convinced analysts that Aurelia was under severe financial stress.",
        longTermConsequence: "Immediate cash balance padded at a steep cost to Market Trust.",
      },
    ],
  },

  {
    id: "crisis-wave-5",
    waveNumber: 5,
    codeName: "TRIBUNAL INQUISITION",
    title: "Brussels & Geneva Sovereign Antitrust Asset Freeze Threat",
    category: "REGULATORY & LEGAL CRISIS",
    severity: "HIGH // LEVEL 4",
    divisionAffected: "All Sovereign Divisions",
    location: "European Court of Arbitration, Geneva",
    timeLimitSeconds: 80,
    incomingTransmission:
      "FLASH ALERT: Lobbyists bankrolled by the Obsidian Syndicate have pushed an emergency antitrust injunction before the Transnational Trade Tribunal, alleging Aurelia's control of Port Aurelia and Vespera Rare-Earths constitutes an illegal cartel. A preliminary ruling in 80 seconds could freeze $180M in clearing accounts.",
    intelligenceNotes: [
      "Dossier Cross-Ref: Dr. Aria Chen holds the original 1999 Port Aurelia Sovereign Treaty granting diplomatic immunity.",
      "Offering a voluntary Strategic Rare-Earth Reserve partnership ($40M) turns European regulators into allies.",
      "Fighting with scorched-earth trade embargoes risks heavy retaliatory fines.",
    ],
    timeoutPenalty: {
      costDelta: -145,
      marketTrustDelta: -15,
      operationalStabilityDelta: -15,
      boardConfidenceDelta: -18,
      headline: "DEFAULT JUDGMENT ENTERED: Tribunal Freezes $145.0M in Escrow",
      analysis:
        "Missing the tribunal filing deadline resulted in an automatic preliminary injunction freezing $145.0M of Aurelia's European operating accounts.",
    },
    options: [
      {
        id: "w5-opt-a",
        code: "DIRECTIVE ALPHA-05",
        title: "Invoke 1999 Sovereign Treaty & Establish $40M Joint Strategic Reserve",
        strategyType: "MASTERWORK DIPLOMACY",
        costDelta: -40,
        riskLevel: "LOW RISK",
        metricsDelta: {
          marketTrust: +11,
          operationalStability: +8,
          boardConfidence: +11,
        },
        advisorName: "Dr. Aria Chen",
        advisorQuote:
          "Present our 1999 Sovereign Charter alongside a $40M European Rare-Earth Security Compact. The Tribunal will dismiss the Syndicate's petition and grant us 10-year regulatory immunity.",
        description:
          "Co-invest $40.0M into a joint sovereign mineral buffer with European central authorities, neutralizing the antitrust claim and exposing the Syndicate's lobbyists.",
        resultHeadline: "INJUNCTION DISMISSED WITH PREJUDICE: 10-Year Sovereign Immunity Secured",
        resultAnalysis:
          "Dr. Chen's treaty defense combined with the $40.0M strategic mineral compact turned the Tribunal in our favor. The court dismissed all antitrust charges and opened an investigation into the Obsidian Syndicate's fraudulent filings.",
        longTermConsequence: "Regulatory threat eliminated; European governments aligned with Aurelia.",
      },
      {
        id: "w5-opt-b",
        code: "DIRECTIVE BETA-05",
        title: "Pre-Emptively Transfer $75M Compliance Bond & Restructure Subsidiaries",
        strategyType: "DEFENSIVE RESTRUCTURING",
        costDelta: -75,
        riskLevel: "MODERATE RISK",
        metricsDelta: {
          marketTrust: +3,
          operationalStability: +1,
          boardConfidence: +2,
        },
        advisorName: "Elena Rostova",
        advisorQuote:
          "Ring-fencing our four divisions into separate Zurich trusts costs $75M in legal and tax restructuring, but legally insulates the parent treasury.",
        description:
          "Post a $75.0M regulatory compliance bond and legally unbundle Maritime and Refinery voting shares into insulated trusts.",
        resultHeadline: "SUBSIDIARIES RING-FENCED: Accounts Protected at $75.0M Restructuring Cost",
        resultAnalysis:
          "The rapid corporate restructuring satisfied the court's structural demands and prevented an asset freeze, though legal and tax friction consumed $75.0M.",
        longTermConsequence: "Assets protected with moderate treasury outflow.",
      },
      {
        id: "w5-opt-c",
        code: "DIRECTIVE GAMMA-05",
        title: "Threaten Immediate Rare-Earth Export Embargo Unless Case Dropped",
        strategyType: "COERCIVE BRINKMANSHIP",
        costDelta: -90,
        riskLevel: "EXTREME RISK",
        metricsDelta: {
          marketTrust: -12,
          operationalStability: -10,
          boardConfidence: -11,
        },
        advisorName: "Admiral Marcus Sterling",
        advisorQuote:
          "Remind Brussels that without Vespera palladium, their aerospace factories halt in a week. Beware: if they call our bluff, contempt fines will be severe.",
        description:
          "Issue an ultimatum halting all rare-earth shipments to tribunal member states unless the inquiry is terminated immediately.",
        resultHeadline: "ULTIMATUM BACKFIRES: Tribunal Levies $90.0M Contempt Tariff",
        resultAnalysis:
          "Regulators refused to bow to public coercion and imposed an immediate $90.0M customs seizure and emergency tariff on Aurelia shipments.",
        longTermConsequence: "Heavy financial penalty and strained diplomatic relations.",
      },
    ],
  },

  {
    id: "crisis-wave-6",
    waveNumber: 6,
    codeName: "ENDGAME: THE CITADEL COUP",
    title: "Hostile Proxy Vote & Obsidian Syndicate Takeover Bid",
    category: "SOVEREIGN GOVERNANCE FINALE",
    severity: "OMEGA // FINAL WAVE",
    divisionAffected: "The Iron Council & Parent Holdings",
    location: "Grand Council Chamber, The Citadel Tower, Zurich",
    timeLimitSeconds: 95,
    incomingTransmission:
      "FINAL TRANSMISSION: Having failed to break our operations externally, the Obsidian Syndicate has secretly accumulated 24% of voting bearer shares from two wavering family houses. They have called an emergency midnight proxy vote to oust the Chancellor and liquidate Aurelia Holdings. Your final directive determines the fate of the Empire.",
    intelligenceNotes: [
      "Dossier Cross-Ref: Aegis intelligence discovered that the Syndicate used illegal margin loans to buy those bearer shares.",
      "Launching a Counter-Takeover Acquisition of the Syndicate's distressed clearing bank ($80M) turns the tables completely.",
      "Alternatively, exposing their illegal margin loans via Aegis + Solaris forensic dossier ($30M) invalidates their voting rights and recovers damages!",
    ],
    timeoutPenalty: {
      costDelta: -180,
      marketTrustDelta: -25,
      operationalStabilityDelta: -25,
      boardConfidenceDelta: -30,
      headline: "PROXY COUP SUCCEEDS: Hostile Restructuring Drains $180.0M",
      analysis:
        "Silence in the Grand Council Chamber allowed the hostile proxy motion to carry, triggering $180.0M in golden-parachute defaults and syndicate break-up fees.",
    },
    options: [
      {
        id: "w6-opt-a",
        code: "DIRECTIVE OMEGA-01",
        title: "Unseal Aegis Forensic Dossier & Seize Syndicate Margin Collateral (+$45M Net)",
        strategyType: "SOVEREIGN CHECKMATE",
        costDelta: +45,
        riskLevel: "CALCULATED MASTERSTROKE",
        metricsDelta: {
          marketTrust: +15,
          operationalStability: +12,
          boardConfidence: +18,
        },
        advisorName: "Lord Cassian Vance",
        advisorQuote:
          "The Syndicate pledged stolen clearing certificates as collateral for their proxy shares. Unseal our forensic proof before the Council—we annul their votes and forfeit their $45M escrow deposit directly into our Treasury!",
        description:
          "Present Aegis quantum-verified evidence of syndicate margin fraud to the Iron Council and Swiss authorities, nullifying the hostile shares and seizing their +$45.0M forfeiture bond.",
        resultHeadline: "SYNDICATE ANNIHILATED: Hostile Shares Nullified & +$45.0M Escrow Seized",
        resultAnalysis:
          "In a stunning finale in the Grand Council Chamber, Lord Vance and Dr. Chen presented irrefutable cryptographic proof of the Obsidian Syndicate's illegal margin scheme. Swiss authorities immediately froze the hostile shares, awarded Aurelia +$45.0M in forfeited syndicate collateral, and unanimously reaffirmed your Chancellorship.",
        longTermConsequence: "Total sovereign victory; Treasury enriched and Empire unified.",
      },
      {
        id: "w6-opt-b",
        code: "DIRECTIVE OMEGA-02",
        title: "Execute $80M White-Knight Buyout of Wavering Sovereign Houses",
        strategyType: "IRON CONSOLIDATION",
        costDelta: -80,
        riskLevel: "LOW RISK",
        metricsDelta: {
          marketTrust: +12,
          operationalStability: +10,
          boardConfidence: +15,
        },
        advisorName: "Elena Rostova",
        advisorQuote:
          "If we have the cash buffer, buy out the two wavering houses directly at $80M and retire their voting shares forever. Nobody will ever threaten the Citadel again.",
        description:
          "Deploy $80.0M from the Sovereign Treasury to purchase and permanently retire the contested family bearer shares, securing a 76% supermajority.",
        resultHeadline: "SUPERMAJORITY LOCKED: Contested Shares Retired for $80.0M",
        resultAnalysis:
          "By purchasing the wavering houses' shares outright for $80.0M, you permanently consolidated control of the Iron Council. The Obsidian Syndicate was left holding worthless proxy pledges as Aurelia emerged stronger and more unified than ever.",
        longTermConsequence: "Unbreakable governance supermajority established.",
      },
      {
        id: "w6-opt-c",
        code: "DIRECTIVE OMEGA-03",
        title: "Declare Martial Corporate Charter & Suspend All Dividend Payouts (-$115M Fallout)",
        strategyType: "AUTOCRATIC LOCKDOWN",
        costDelta: -115,
        riskLevel: "HIGH RISK",
        metricsDelta: {
          marketTrust: -16,
          operationalStability: -8,
          boardConfidence: -14,
        },
        advisorName: "Admiral Marcus Sterling",
        advisorQuote:
          "Lock the Citadel doors and suspend the charter vote for 90 days. It will trigger $115M in institutional redemption clauses, but we keep the chair.",
        description:
          "Invoke emergency wartime charter clauses to dissolve the proxy session unilaterally, triggering $115.0M in automatic institutional redemption penalties.",
        resultHeadline: "COUP BLOCKED BY DECREE, BUT $115.0M IN REDEMPTIONS DRAIN TREASURY",
        resultAnalysis:
          "You retained command of the Empire through unilateral decree, blocking the Syndicate takeover. However, institutional bondholders exercised their charter redemption rights, draining $115.0M from the treasury.",
        longTermConsequence: "Control retained at heavy financial and reputational cost.",
      },
    ],
  },
];

export const evaluateEmpireStanding = (finalBalance, metrics) => {
  const avgMetrics = Math.round(
    (metrics.marketTrust + metrics.operationalStability + metrics.boardConfidence) / 3
  );

  if (finalBalance < EMPIRE_METADATA.criticalThreshold) {
    return {
      rankCode: "TIER-IV // COVENANT BREACH",
      title: "Sovereign Insolvency & Syndicate Receivership",
      verdict: "CRITICAL FAILURE",
      summary:
        "Liquid reserves fell below the $350.0M Debt Covenant Floor. Despite your tactical efforts, hostile creditors triggered forced restructuring of Aurelia Sovereign Holdings.",
      avgMetrics,
    };
  }

  if (finalBalance >= 620 && avgMetrics >= 85) {
    return {
      rankCode: "TIER-S // IMPERIAL ARCHITECT",
      title: "Grand Sovereign of the Golden Citadel",
      verdict: "SUPREME VICTORY",
      summary:
        "Masterclass leadership. You preserved an impregnable treasury well above optimal reserves while crushing the Obsidian Syndicate across all six waves and elevating global trust in the Empire.",
      avgMetrics,
    };
  }

  if (finalBalance >= 480 && avgMetrics >= 70) {
    return {
      rankCode: "TIER-A // IRON CHANCELLOR",
      title: "Defender of the Sovereign Realm",
      verdict: "DECISIVE VICTORY",
      summary:
        "You navigated all six crisis waves with disciplined capital allocation, protecting the $350.0M Debt Covenant Floor and keeping the Empire's industrial arteries online.",
      avgMetrics,
    };
  }

  return {
    rankCode: "TIER-B // SURVIVING REGENT",
    title: "Battered But Unbroken",
    verdict: "PYRRHIC SURVIVAL",
    summary:
      "The Empire survived Operation Eclipse above the $350.0M insolvency floor, but heavy treasury attrition or governance friction will require quarters of careful reconstruction.",
    avgMetrics,
  };
};

