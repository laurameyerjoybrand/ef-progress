"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type TierId = "launch" | "grow" | "scale";
type RatingColor = "red" | "yellow" | "green";
type TierRatings = Record<number, RatingColor>;
type AllRatings = Record<TierId, TierRatings>;
type AllNotes = Record<TierId, string>;
type OpenDetails = Record<string, boolean>;

interface ActivityDetail {
  red: string;
  yellow: string;
  green: string;
}

interface Activity {
  id: number;
  name: string;
  subtitle: string;
  detail: ActivityDetail;
}

interface TierData {
  id: TierId;
  badge: string;
  name: string;
  range: string;
  pillars: string[];
  headerClass: string;
  activities: Activity[];
  summaryTitle: string;
}

// ─── Tier Data ────────────────────────────────────────────────────────────────

const TIERS: TierData[] = [
  {
    id: "launch",
    badge: "Tier 1",
    name: "LAUNCH",
    range: "$0 — $10K / Month",
    pillars: ["Attract", "Convert", "Deliver"],
    headerClass: "launch",
    summaryTitle: "Your Progress Snapshot — Tier 1",
    activities: [
      {
        id: 1,
        name: "Offer Clarity",
        subtitle: "Simple, customer-centric offer I can explain in one sentence",
        detail: {
          red: "Still building or overthinking the offer. Over-engineered or unclear.",
          yellow: "Have an offer but keep changing it. Not leading with it confidently.",
          green: "My offer is clear, simple, and I lead with it in every conversation.",
        },
      },
      {
        id: 2,
        name: "Outreach (50 Minimum)",
        subtitle: "Network outreach OR 50 new leads via local networking if needed",
        detail: {
          red: "Haven't started or under 10 outreach contacts total.",
          yellow: "Between 10–40 contacts. Moving but stalling before the finish line.",
          green: "Hit 50+ and actively working my list with follow-ups ongoing.",
        },
      },
      {
        id: 3,
        name: "Pipeline Setup",
        subtitle: "Tracking leads, conversations, and follow-ups in a simple system",
        detail: {
          red: "No pipeline exists. Tracking things mentally or nowhere.",
          yellow: "Something exists but not using it consistently or updating it.",
          green: "Checking and updating my pipeline weekly. Leads don't fall through.",
        },
      },
      {
        id: 4,
        name: "MVP Website",
        subtitle: "Live, functional site that communicates who I help and how",
        detail: {
          red: "Nothing live yet. Still waiting on perfection before publishing.",
          yellow: "Something exists but it's incomplete, outdated, or unclear.",
          green: "My site is live and I'm confident sending anyone there today.",
        },
      },
      {
        id: 5,
        name: "Booking Conversations",
        subtitle: "Holding discovery or consultative calls consistently",
        detail: {
          red: "Haven't had any calls yet or haven't asked anyone to meet.",
          yellow: "Had a few but it feels scattered. Not a consistent cadence.",
          green: "Having multiple conversations per week. Momentum is building.",
        },
      },
      {
        id: 6,
        name: "Making the Offer",
        subtitle: "Clearly asking for the business at the end of every conversation",
        detail: {
          red: "Never get to the ask. Conversations end without a clear next step.",
          yellow: "Sometimes make the offer but back off when I feel resistance.",
          green: "Consistently making the offer and handling objections with confidence.",
        },
      },
    ],
  },
  {
    id: "grow",
    badge: "Tier 2",
    name: "GROW",
    range: "$10K — $30K / Month",
    pillars: ["Stabilize", "Systematize", "Breathe"],
    headerClass: "grow",
    summaryTitle: "Your Progress Snapshot — Tier 2",
    activities: [
      {
        id: 1,
        name: "Hiring Support",
        subtitle: "At least one person helping with admin, delivery, or operations",
        detail: {
          red: "Doing everything myself. Stuck in the bottleneck.",
          yellow: "Thinking about it or made a hire but not effectively delegating yet.",
          green: "I have support and it is genuinely freeing up my time.",
        },
      },
      {
        id: 2,
        name: "Content on One Platform",
        subtitle: "Posting consistently on LinkedIn or Instagram (minimum 3x/week)",
        detail: {
          red: "Not posting at all or posting on multiple platforms inconsistently.",
          yellow: "Posting occasionally but not consistently enough to build momentum.",
          green: "Posting 3+ times per week on one platform with a clear content strategy.",
        },
      },
      {
        id: 3,
        name: "Email System Active",
        subtitle: "List + nurture sequence, emailing at least 2x per month",
        detail: {
          red: "No email list or system in place. This hasn't started.",
          yellow: "Have a list but email rarely or have no consistent nurture.",
          green: "Emailing consistently. List is growing and opening my emails.",
        },
      },
      {
        id: 4,
        name: "Delivery Reduction",
        subtitle: "Shifting from implementation to advisory — protecting time",
        detail: {
          red: "Still doing too much implementation work. Time is consumed by delivery.",
          yellow: "Started pulling back but still crossing the line into doing the work.",
          green: "Delivery is advisory-only. I guide, clients execute. Time is protected.",
        },
      },
      {
        id: 5,
        name: "Referral System",
        subtitle: "Consistently asking happy clients for referrals and introductions",
        detail: {
          red: "Never ask for referrals. Hoping clients will send people without prompting.",
          yellow: "Ask occasionally but it's not a built-in part of my client experience.",
          green: "Referral ask is built into offboarding. Getting introductions regularly.",
        },
      },
      {
        id: 6,
        name: "Revenue Consistency",
        subtitle: "Income is predictable and trending toward $30K/month",
        detail: {
          red: "Very inconsistent. Can't project income more than a month out.",
          yellow: "Some months are great, others drop. Feast-or-famine is still real.",
          green: "Hitting $10K+ consistently. Revenue is predictable and growing.",
        },
      },
    ],
  },
  {
    id: "scale",
    badge: "Tier 3",
    name: "SCALE",
    range: "$30K+ / Month",
    pillars: ["Leverage", "Multiply", "Lead"],
    headerClass: "scale",
    summaryTitle: "Your Progress Snapshot — Tier 3",
    activities: [
      {
        id: 1,
        name: "One-to-Many Offer",
        subtitle: "Active group program, workshop, or curriculum-based offer",
        detail: {
          red: "No group offer exists. Still 100% one-to-one delivery.",
          yellow: "Developing a group offer but it's not live or generating revenue yet.",
          green: "Active one-to-many offer generating consistent revenue.",
        },
      },
      {
        id: 2,
        name: "Hosting Workshops & Events",
        subtitle: "Live events that both deliver value and convert attendees",
        detail: {
          red: "Haven't hosted anything. This isn't part of my strategy yet.",
          yellow: "Hosted one event but haven't made it a consistent part of my business.",
          green: "Hosting workshops regularly. They deliver value and convert attendees.",
        },
      },
      {
        id: 3,
        name: "Lead Nurture System",
        subtitle: "Email, content, and follow-up sequences working leads over time",
        detail: {
          red: "No system. Leads go cold because there's no consistent follow-up.",
          yellow: "Partial system exists but leaks leads. Not all paths lead somewhere.",
          green: "Leads are nurtured automatically. The system works without me daily.",
        },
      },
      {
        id: 4,
        name: "Team & Delegation",
        subtitle: "Right people handling operations, delivery, and/or sales",
        detail: {
          red: "Still the bottleneck for everything. Growth is capped by my capacity.",
          yellow: "Have some help but still too involved in things others should own.",
          green: "Functioning team in place. I'm working on the business, not in it.",
        },
      },
      {
        id: 5,
        name: "Revenue Diversification",
        subtitle: "2+ income streams contributing meaningfully to monthly revenue",
        detail: {
          red: "100% reliant on one-to-one client retainers. One lost client = real risk.",
          yellow: "One additional stream exists but it's inconsistent or minimal.",
          green: "2+ streams contributing meaningfully. Revenue is diversified and resilient.",
        },
      },
      {
        id: 6,
        name: "Inbound Authority",
        subtitle: "Content and brand generating consistent inbound leads and opportunities",
        detail: {
          red: "Brand isn't generating inbound. Still relying entirely on outreach.",
          yellow: "Occasional inbound but it's unpredictable. Can't rely on it.",
          green: "Consistent inbound from content and brand. Leads come to me.",
        },
      },
    ],
  },
];

const TOTAL = 6;

const CTAS: Record<string, string> = {
  all_green: "You're firing on all cylinders. Are you ready to move to the next tier?",
  mostly_green: "Strong momentum. Pick your top yellow and make it green this week.",
  mixed: "Good self-awareness. Identify your one red and make it your only focus.",
  mostly_red: "You know where to start. Pick one red and commit to it this week — just one.",
  none: "Tap each activity above to expand the details and rate yourself.",
};

const STORAGE_KEY_RATINGS = "ef-progress-ratings";
const STORAGE_KEY_NOTES = "ef-progress-notes";

// ─── Root Component ───────────────────────────────────────────────────────────

export default function ProgressCharts() {
  const [activeTier, setActiveTier] = useState<TierId>("launch");
  const [ratings, setRatings] = useState<AllRatings>({
    launch: {},
    grow: {},
    scale: {},
  });
  const [notes, setNotes] = useState<AllNotes>({
    launch: "",
    grow: "",
    scale: "",
  });
  const [openDetails, setOpenDetails] = useState<OpenDetails>({});

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedRatings = localStorage.getItem(STORAGE_KEY_RATINGS);
      if (savedRatings) setRatings(JSON.parse(savedRatings));
      const savedNotes = localStorage.getItem(STORAGE_KEY_NOTES);
      if (savedNotes) setNotes(JSON.parse(savedNotes));
    } catch {
      // ignore parse errors
    }
  }, []);

  // Persist ratings to localStorage
  const saveRatings = useCallback((next: AllRatings) => {
    setRatings(next);
    try {
      localStorage.setItem(STORAGE_KEY_RATINGS, JSON.stringify(next));
    } catch {
      // ignore storage errors
    }
  }, []);

  // Persist notes to localStorage
  const saveNotes = useCallback((next: AllNotes) => {
    setNotes(next);
    try {
      localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(next));
    } catch {
      // ignore storage errors
    }
  }, []);

  const handleRate = (e: React.MouseEvent, tier: TierId, actId: number, color: RatingColor) => {
    e.stopPropagation();
    const next: AllRatings = {
      ...ratings,
      [tier]: { ...ratings[tier], [actId]: color },
    };
    saveRatings(next);
  };

  const handleToggleDetail = (key: string) => {
    setOpenDetails((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleReset = (tier: TierId) => {
    const next: AllRatings = { ...ratings, [tier]: {} };
    saveRatings(next);
  };

  const handleNoteChange = (tier: TierId, value: string) => {
    const next: AllNotes = { ...notes, [tier]: value };
    saveNotes(next);
  };

  const getCta = (tier: TierId): string => {
    const vals = Object.values(ratings[tier]);
    const g = vals.filter((v) => v === "green").length;
    const y = vals.filter((v) => v === "yellow").length;
    const r = vals.filter((v) => v === "red").length;
    const rated = g + y + r;

    if (rated === 0) return CTAS.none;
    if (rated < TOTAL) return `${rated} of ${TOTAL} rated. Keep going.`;
    if (g === TOTAL) return CTAS.all_green;
    if (g >= 4) return CTAS.mostly_green;
    if (g + y >= 3) return CTAS.mixed;
    return CTAS.mostly_red;
  };

  const getColorCounts = (tier: TierId) => {
    const vals = Object.values(ratings[tier]);
    const g = vals.filter((v) => v === "green").length;
    const y = vals.filter((v) => v === "yellow").length;
    const r = vals.filter((v) => v === "red").length;
    const rated = g + y + r;
    return {
      g, y, r,
      gW: rated ? (g / TOTAL) * 100 : 0,
      yW: rated ? (y / TOTAL) * 100 : 0,
      rW: rated ? (r / TOTAL) * 100 : 0,
    };
  };

  const getPillClass = (tier: TierId, actId: number, color: RatingColor): string => {
    const selected = ratings[tier][actId] === color;
    if (!selected) return "pc-pill";
    return `pc-pill selected-${color}`;
  };

  return (
    <div>
      {/* Nav */}
      <nav className="pc-nav">
        <div className="pc-nav-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/monogram-white.png" alt="Expert Freedom" className="pc-nav-logo" />
          <span className="pc-nav-title">Expert Freedom</span>
        </div>
        <div className="pc-tier-tabs">
          {TIERS.map((tier) => (
            <button
              key={tier.id}
              className={`pc-tier-tab${activeTier === tier.id ? " active" : ""}`}
              onClick={() => setActiveTier(tier.id)}
              type="button"
            >
              {tier.badge} · {tier.name.charAt(0) + tier.name.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </nav>

      {/* Tier Panels */}
      {TIERS.map((tier) => {
        const counts = getColorCounts(tier.id);
        const isActive = activeTier === tier.id;

        return (
          <div key={tier.id} style={{ display: isActive ? "block" : "none" }}>
            {/* Header Banner */}
            <div className={`pc-tier-header ${tier.headerClass}`}>
              <div className="pc-tier-badge">{tier.badge}</div>
              <div className="pc-tier-name">{tier.name}</div>
              <div className="pc-tier-range">{tier.range}</div>
              <div className="pc-tier-focus">Primary Focus</div>
              <div className="pc-tier-pillars">
                {tier.pillars.map((p) => (
                  <span key={p} className="pc-pillar-chip">{p}</span>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="pc-legend-bar">
              <span className="pc-legend-label">Rate Yourself</span>
              <div className="pc-legend-items">
                <div className="pc-legend-item">
                  <div className="pc-legend-dot dot-green" /> Green — Consistent &amp; Working
                </div>
                <div className="pc-legend-item">
                  <div className="pc-legend-dot dot-yellow" /> Yellow — Inconsistent or Stuck
                </div>
                <div className="pc-legend-item">
                  <div className="pc-legend-dot dot-red" /> Red — Not Started or Avoiding
                </div>
              </div>
            </div>

            {/* Activities */}
            <div className="pc-chart-body">
              <div className="pc-chart-section-label">
                {tier.name.charAt(0) + tier.name.slice(1).toLowerCase()} Activities — Rate Each One
              </div>

              {tier.activities.map((act) => {
                const detailKey = `${tier.id}-${act.id}`;
                const isOpen = !!openDetails[detailKey];

                return (
                  <div key={act.id} className="pc-activity-card">
                    <div
                      className="pc-activity-header"
                      onClick={() => handleToggleDetail(detailKey)}
                    >
                      <div className="pc-activity-number">
                        {String(act.id).padStart(2, "0")}
                      </div>
                      <div className="pc-activity-info">
                        <div className="pc-activity-name">{act.name}</div>
                        <div className="pc-activity-subtitle">{act.subtitle}</div>
                      </div>
                      <div className="pc-rating-pills">
                        {(["red", "yellow", "green"] as RatingColor[]).map((color) => (
                          <button
                            key={color}
                            className={getPillClass(tier.id, act.id, color)}
                            onClick={(e) => handleRate(e, tier.id, act.id, color)}
                            type="button"
                            title={color.charAt(0).toUpperCase() + color.slice(1)}
                            aria-label={`Rate ${act.name} as ${color}`}
                          >
                            {color === "red" ? "🔴" : color === "yellow" ? "🟡" : "🟢"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {isOpen && (
                      <div className="pc-activity-detail">
                        <div className="pc-detail-grid">
                          {(["red", "yellow", "green"] as RatingColor[]).map((color) => (
                            <div key={color} className={`pc-detail-col ${color}-col`}>
                              <div className="pc-detail-col-header">
                                <div className={`pc-col-dot dot-${color}`} />
                                {color.charAt(0).toUpperCase() + color.slice(1)}
                              </div>
                              <div className="pc-detail-text">{act.detail[color]}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Summary */}
              <div className="pc-summary-bar">
                <div className="pc-summary-title">{tier.summaryTitle}</div>
                <div className="pc-summary-counts">
                  <div className="pc-summary-count">
                    <span className="pc-count-num green">{counts.g}</span> Green
                  </div>
                  <div className="pc-summary-count">
                    <span className="pc-count-num yellow">{counts.y}</span> Yellow
                  </div>
                  <div className="pc-summary-count">
                    <span className="pc-count-num red">{counts.r}</span> Red
                  </div>
                </div>
                <div className="pc-progress-track">
                  <div
                    className="pc-progress-fill fill-green"
                    style={{ width: `${counts.gW}%` }}
                  />
                  <div
                    className="pc-progress-fill fill-yellow"
                    style={{ width: `${counts.yW}%` }}
                  />
                  <div
                    className="pc-progress-fill fill-red"
                    style={{ width: `${counts.rW}%` }}
                  />
                </div>
                <div className="pc-summary-cta">{getCta(tier.id)}</div>
              </div>

              {/* Notes */}
              <div className="pc-notes-area">
                <div className="pc-notes-label">My Focus This Week</div>
                <textarea
                  className="pc-notes-input"
                  placeholder="What's the one red or yellow I'm committing to move this week?"
                  value={notes[tier.id]}
                  onChange={(e) => handleNoteChange(tier.id, e.target.value)}
                />
              </div>
            </div>

            {/* Reset */}
            <div className="pc-actions-row">
              <button
                className="pc-reset-btn"
                onClick={() => handleReset(tier.id)}
                type="button"
              >
                ↺ Reset Ratings
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
