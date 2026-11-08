// Round 2 — Live Crisis Simulation data.
// All money values are in $ MILLIONS. Starting valuation: $100 Billion.

export const SIM_CONFIG = {
  companyName: "Aurelia Sovereign Holdings",
  startingValuation: 100000, // $100B in millions — identical for every team
  crisisIntervalSeconds: 6 * 60, // a new crisis every 6 minutes
  totalCrises: 10,
  totalSeconds: 60 * 60, // 60-minute round
};

export function formatValuation(millions) {
  const abs = Math.abs(millions);
  return abs >= 1000
    ? `$${(millions / 1000).toFixed(2)}B`
    : `$${millions.toFixed(0)}M`;
}

export function formatDelta(millions) {
  if (millions === 0) return "No change";
  const sign = millions > 0 ? "+" : "−";
  return `${sign}$${Math.abs(millions)}M`;
}

export function formatClock(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

const opt = (id, text, delta, outcome) => ({ id, text, delta, outcome });

export const CRISES = [
  {
    id: 1,
    icon: "ship",
    division: "Maritime",
    title: "Flagship Convoy Seized",
    story:
      "Privateer gunboats have surrounded three of our cargo carriers in the Red Sea and are demanding a 'port fee'. Refineries are waiting on that cargo.",
    options: [
      opt("a", "Pay the fee quietly and sail on", 0, "The ships move, but word of the payout spreads. Neutral on balance."),
      opt("b", "Escort the convoy with a private naval flotilla", 100, "The privateers back down. Investors applaud the show of strength."),
      opt("c", "File a sovereign injunction and wait it out", 50, "Ships are released after a day. Modest delay, modest gain."),
      opt("d", "Abandon the cargo and claim insurance", -50, "Clients are furious and the smelters starve for ore."),
    ],
  },
  {
    id: 2,
    icon: "laptop",
    division: "Capital",
    title: "Ransomware in the Vault",
    story:
      "A zero-day worm is creeping through the clearing ledger. The attackers want $110M in 'untraceable bonds' before it corrupts the bullion records.",
    options: [
      opt("a", "Wire the ransom to keep trading online", -50, "The payment leaks to the press within hours."),
      opt("b", "Switch to air-gapped cold ledgers and purge the nodes", 50, "Clean failover, regulators are impressed."),
      opt("c", "Counter-hack and seize their wallet", 100, "Servers neutralised, keys recovered, board delighted."),
      opt("d", "Ignore it and hope the worm stalls", 0, "Nothing breaks… this time."),
    ],
  },
  {
    id: 3,
    icon: "factory",
    division: "Resources",
    title: "Smelter Grid Sabotaged",
    story:
      "Transformers at the Alpine rare-earth smelters have exploded. Molten furnaces will solidify and be ruined within hours without power.",
    options: [
      opt("a", "Shut four furnaces down and sell the ore stockpile", -50, "Cash comes in, but aerospace output collapses."),
      opt("b", "Airlift fuel and run the on-site micro-turbines", 100, "Furnaces stay hot, output unbroken."),
      opt("c", "Buy emergency spot power at premium prices", 50, "Zero downtime, but an expensive bill."),
      opt("d", "Wait for the municipal grid to recover", 0, "The grid returns just in time. Lucky."),
    ],
  },
  {
    id: 4,
    icon: "trending-down",
    division: "Capital",
    title: "Bear Raid on Our Bonds",
    story:
      "Rivals have bet billions against Aurelia and planted insolvency rumours. Rating agencies are circling with a downgrade.",
    options: [
      opt("a", "Issue junk bonds to look liquid", -50, "Analysts read it as desperation. Confidence slips."),
      opt("b", "Open the bullion vaults for a live audit", 100, "Rumours die on live TV and the bonds rally."),
      opt("c", "Say nothing and let the market settle", 0, "A bumpy day, then business as usual."),
      opt("d", "Buy back our own bonds to squeeze the shorts", 50, "Shorts are squeezed, though cash is tied up."),
    ],
  },
  {
    id: 5,
    icon: "scale",
    division: "Legal",
    title: "Antitrust Freeze Threat",
    story:
      "A tribunal is about to rule on a cartel claim that could freeze our European accounts. You have one filing to make.",
    options: [
      opt("a", "Threaten an export embargo unless it's dropped", -50, "Regulators call the bluff and levy a contempt tariff."),
      opt("b", "Cite our 1999 treaty and offer a joint reserve", 100, "Case dismissed. Ten years of regulatory goodwill."),
      opt("c", "Ring-fence subsidiaries into separate trusts", 50, "Accounts protected, legal fees paid."),
      opt("d", "Let the lawyers handle it as usual", 0, "The ruling is postponed. No harm done."),
    ],
  },
  {
    id: 6,
    icon: "satellite",
    division: "Defense",
    title: "Satellite Constellation Hacked",
    story:
      "Our orbital telemetry network is feeding false positions to the fleet. Ships are drifting off course and clients are calling.",
    options: [
      opt("a", "Reset every satellite at once", 0, "Reboot works, with a few hours of lost data."),
      opt("b", "Switch to backup relays and trace the intruder", 75, "Fleet stays on course and the intruder is exposed."),
      opt("c", "Pause all fleet movement for 48 hours", -75, "Safe, but deliveries stall and penalties pile up."),
      opt("d", "Hire the hackers as 'consultants'", 150, "A shock win: they patch the hole and hand over rival intel."),
    ],
  },
  {
    id: 7,
    icon: "speech",
    division: "Reputation",
    title: "Leaked Boardroom Memo",
    story:
      "A memo discussing 'strategic layoffs' has gone viral. Staff are anxious, unions are mobilising and the press wants a statement.",
    options: [
      opt("a", "Deny everything and hunt for the leaker", -50, "The denial is disproved by a second leak."),
      opt("b", "Issue a transparent plan with retraining funds", 100, "Trust rises. Employees become your best advocates."),
      opt("c", "Hold an all-hands town hall", 50, "Mostly calming. Some questions remain unanswered."),
      opt("d", "Stay silent until the news cycle moves on", 0, "It fades after a week."),
    ],
  },
  {
    id: 8,
    icon: "package",
    division: "Supply Chain",
    title: "Key Supplier Goes Bankrupt",
    story:
      "The sole supplier of our specialty alloy has collapsed overnight. Production lines will stop in three days.",
    options: [
      opt("a", "Buy the supplier's assets outright", 50, "You own the supply chain now, at a hefty price."),
      opt("b", "Sign a pricey long-term deal with a rival", -50, "Supply secured but at a margin-crushing cost."),
      opt("c", "Fast-track an in-house alternative alloy", 100, "R&D delivers. A new competitive edge."),
      opt("d", "Run on inventory and decide later", 0, "Buys time, solves nothing."),
    ],
  },
  {
    id: 9,
    icon: "wind",
    division: "Operations",
    title: "Storm Hits Port Aurelia",
    story:
      "A once-in-a-century storm is bearing down on our main port. Cranes, warehouses and thousands of containers are at risk.",
    options: [
      opt("a", "Evacuate and fully secure the port in advance", 50, "Losses are minimal and the team stays safe."),
      opt("b", "Keep operating until the last minute", -50, "Equipment is damaged and shipments are lost."),
      opt("c", "Reroute traffic to partner ports and pre-pay insurance", 100, "Revenue flows, and the insurer pays out smoothly."),
      opt("d", "Do nothing special; the storm may veer off", 0, "It veers. Phew."),
    ],
  },
  {
    id: 10,
    icon: "crown",
    division: "Governance",
    title: "The Hostile Takeover Vote",
    story:
      "The Obsidian Syndicate has quietly bought 24% of voting shares and called a midnight vote to oust leadership. This is the final decision.",
    options: [
      opt("a", "Expose their illegal margin loans to void their votes", 200, "Checkmate. Their shares are frozen and their collateral seized."),
      opt("b", "Buy out the wavering shareholders", 100, "Control is locked in, though it costs cash."),
      opt("c", "Suspend dividends and rally the board", -100, "Shareholders revolt over the payouts."),
      opt("d", "Negotiate a truce and share board seats", 0, "Peace, but the rivalry will return."),
    ],
  },
];

