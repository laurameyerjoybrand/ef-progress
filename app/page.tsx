"use client";

import { useState, useEffect, useCallback, Fragment } from "react";
import {
  COACHING,
  getScorePattern,
  getFirstPriorityActivity,
  type TierId,
  type RatingColor,
} from "./lib/coaching-content";

// ─── Types ────────────────────────────────────────────────────────────────────

type AppMode = "chart" | "report";
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

interface TierStage {
  label: string;
  activityIds: number[];
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
  stages?: TierStage[];
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
    stages: [
      { label: "attract", activityIds: [1, 2, 3, 4] },
      { label: "convert", activityIds: [5, 6] },
      { label: "deliver", activityIds: [7, 8] },
    ],
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
        name: "50 Trackable Conversations",
        subtitle: "50 total outreach contacts while in Tier 1 — calls, messages, or conversations about your business",
        detail: {
          red: "Haven't started or under 10 trackable conversations total.",
          yellow: "Between 10–40 contacts. Moving but stalling before the finish line.",
          green: "Hit 50 total trackable conversations and actively working my list with follow-ups.",
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
        subtitle: "Holding a minimum of five discovery or consultative calls a month",
        detail: {
          red: "Haven't had any calls yet or haven't asked anyone to meet.",
          yellow: "Had a few but it feels scattered. Not a consistent cadence.",
          green: "Having multiple conversations per week. Momentum is building.",
        },
      },
      {
        id: 6,
        name: "Making the Offer",
        subtitle:
          "Clearly asking for the business at the end of every conversation or message following the collaborative close process",
        detail: {
          red: "Never get to the ask. Conversations end without a clear next step.",
          yellow: "Sometimes make the offer but back off when I feel resistance.",
          green: "Consistently making the offer and handling objections with confidence.",
        },
      },
      {
        id: 7,
        name: "Three Beta Clients, Delivered",
        subtitle: "Booked three beta clients and delivered using the LEAP method",
        detail: {
          red: "Haven't booked any beta clients yet. This is the proof-of-concept step.",
          yellow: "Have one or two betas but haven't completed full LEAP delivery or hit three yet.",
          green: "Delivered full LEAP method to three beta clients. Proof of concept complete.",
        },
      },
      {
        id: 8,
        name: "Charging Full Price",
        subtitle: "Charging full price for three additional clients beyond your betas",
        detail: {
          red: "Still offering beta pricing or haven't made the transition to full price yet.",
          yellow: "Charged full price for one or two clients but not consistently.",
          green: "Charging full price for three additional clients. The transition is made.",
        },
      },
    ],
  },
  {
    id: "grow",
    badge: "Tier 2",
    name: "GROW",
    range: "$10K — $30K / Month",
    pillars: ["Attract", "Convert", "Deliver"],
    headerClass: "grow",
    summaryTitle: "Your Progress Snapshot — Tier 2",
    stages: [
      { label: "attract", activityIds: [1, 2, 3, 4] },
      { label: "convert", activityIds: [5, 6] },
      { label: "deliver", activityIds: [7, 8] },
    ],
    activities: [
      {
        id: 1,
        name: "Content on One Platform",
        subtitle: "Posting consistently on LinkedIn or Instagram (minimum 3x/week)",
        detail: {
          red: "Not posting at all or posting on multiple platforms inconsistently.",
          yellow: "Posting occasionally but not consistently enough to build momentum.",
          green: "Posting 3+ times per week on one platform with a clear content strategy.",
        },
      },
      {
        id: 2,
        name: "Email System Active",
        subtitle: "List + nurture sequence, emailing at least weekly",
        detail: {
          red: "No email list or system in place. This hasn't started.",
          yellow: "Have a list but email rarely or have no consistent nurture.",
          green: "Emailing consistently. List is growing and opening my emails.",
        },
      },
      {
        id: 3,
        name: "Referral System",
        subtitle: "Consistently asking happy clients for referrals and introductions",
        detail: {
          red: "Never ask for referrals. Hoping clients will send people without prompting.",
          yellow: "Ask occasionally but it's not a built-in part of my client experience.",
          green: "Referral ask is built into offboarding. Getting introductions regularly.",
        },
      },
      {
        id: 4,
        name: "Brand Deck Complete",
        subtitle: "Finalized brand deck installed into Claude and distributed to key team members",
        detail: {
          red: "Brand deck doesn't exist yet. Content and team communication are inconsistent without a shared foundation.",
          yellow: "Brand deck exists but hasn't been installed into Claude or shared with the team. It's not being used yet.",
          green: "Brand deck is complete, installed into Claude, and in the hands of every key team member.",
        },
      },
      {
        id: 5,
        name: "Revenue Consistency",
        subtitle: "Income is predictable and trending toward $30K/month",
        detail: {
          red: "Very inconsistent. Can't project income more than a month out.",
          yellow: "Some months are great, others drop. Feast-or-famine is still real.",
          green: "Hitting $10K+ consistently. Revenue is predictable and growing.",
        },
      },
      {
        id: 6,
        name: "Weekly Metrics Tracking",
        subtitle: "Monitoring leads, discovery calls booked, close rate, and client LTV every week",
        detail: {
          red: "Key business metrics aren't being tracked. Decisions are based on gut feeling rather than data.",
          yellow: "Tracking some metrics but not all four consistently. Missing numbers are hiding your biggest opportunities.",
          green: "All four metrics tracked weekly: leads, calls booked, close rate, and LTV. Decisions are data-driven.",
        },
      },
      {
        id: 7,
        name: "Hiring Support",
        subtitle: "At least one person helping with admin, delivery, or operations",
        detail: {
          red: "Doing everything myself. Stuck in the bottleneck.",
          yellow: "Thinking about it or made a hire but not effectively delegating yet.",
          green: "I have support and it is genuinely freeing up my time.",
        },
      },
      {
        id: 8,
        name: "Delivery Reduction",
        subtitle: "Shifting from implementation to advisory, protecting time",
        detail: {
          red: "Still doing too much implementation work. Time is consumed by delivery.",
          yellow: "Started pulling back but still crossing the line into doing the work.",
          green: "Delivery is advisory-only. I guide, clients execute. Time is protected.",
        },
      },
    ],
  },
  {
    id: "scale",
    badge: "Tier 3",
    name: "SCALE",
    range: "$30K+ / Month",
    pillars: ["Attract", "Convert", "Deliver"],
    headerClass: "scale",
    summaryTitle: "Your Progress Snapshot — Tier 3",
    stages: [
      { label: "attract", activityIds: [1, 2, 3, 4] },
      { label: "convert", activityIds: [5] },
      { label: "deliver", activityIds: [6, 7, 8] },
    ],
    activities: [
      {
        id: 1,
        name: "Inbound Authority",
        subtitle: "Content and brand driving 10+ warm leads per week through ManyChat or platform automations",
        detail: {
          red: "No inbound system in place. No ManyChat or automation running. Still relying entirely on outreach to find clients.",
          yellow: "Some inbound but no consistent automation. Not yet hitting 10 warm leads per week.",
          green: "ManyChat or automations running consistently. 10+ warm leads per week coming in without manual outreach.",
        },
      },
      {
        id: 2,
        name: "Productized Offer",
        subtitle: "A productized, ready-to-sell offer that you can serve either one-to-one or one-to-many based on a preset curriculum",
        detail: {
          red: "No productized offer exists yet. Still building custom delivery for every client.",
          yellow: "Offer is being developed but isn't finalized, live, or generating revenue yet.",
          green: "Productized offer is live, clearly defined, and generating consistent revenue.",
        },
      },
      {
        id: 3,
        name: "Hosting Workshops & Events",
        subtitle: "Live events that both deliver value and convert attendees",
        detail: {
          red: "Haven't hosted anything. This isn't part of my strategy yet.",
          yellow: "Hosted one event but haven't made it a consistent part of my business.",
          green: "Hosting workshops regularly. They deliver value and convert attendees.",
        },
      },
      {
        id: 4,
        name: "Lead Nurture System",
        subtitle: "Email, content, and follow-up sequences working leads over time",
        detail: {
          red: "No system. Leads go cold because there's no consistent follow-up.",
          yellow: "Partial system exists but leaks leads. Not all paths lead somewhere.",
          green: "Leads are nurtured automatically. The system works without me daily.",
        },
      },
      {
        id: 5,
        name: "One-to-Many Sales System",
        subtitle: "Repeatable enrollment process for your group or leveraged offer",
        detail: {
          red: "No sales system for your group offer. Enrollment relies entirely on manual outreach.",
          yellow: "Some sales system elements exist but the path from lead to enrolled client isn't complete or consistent.",
          green: "A repeatable path from lead to enrolled client runs without manual chasing. Group offer fills itself.",
        },
      },
      {
        id: 6,
        name: "Revenue Diversification",
        subtitle: "2+ income streams contributing meaningfully to monthly revenue",
        detail: {
          red: "100% reliant on one-to-one client retainers. One lost client = real risk.",
          yellow: "One additional stream exists but it's inconsistent or minimal.",
          green: "2+ streams contributing meaningfully. Revenue is diversified and resilient.",
        },
      },
      {
        id: 7,
        name: "Team & Delegation",
        subtitle: "Right people handling operations, delivery, and/or sales",
        detail: {
          red: "Still the bottleneck for everything. Growth is capped by my capacity.",
          yellow: "Have some help but still too involved in things others should own.",
          green: "Functioning team in place. I'm working on the business, not in it.",
        },
      },
      {
        id: 8,
        name: "Administrative Time Reduction",
        subtitle: "Fewer than 5 hours per week spent on admin, scheduling, or non-revenue work",
        detail: {
          red: "Spending too much time on admin tasks. CEO-level hours are going to low-value work.",
          yellow: "Some admin delegated but still regularly pulled into scheduling, coordination, or operations.",
          green: "Under 5 hours per week on admin. Time is protected for revenue, leadership, and high-value work.",
        },
      },
    ],
  },
];

const getTierTotal = (tierId: TierId) =>
  TIERS.find((t) => t.id === tierId)!.activities.length;

const getActivityStage = (tier: TierData, actId: number): string | null => {
  if (!tier.stages) return null;
  const group = tier.stages.find((g) => g.activityIds.includes(actId));
  return group?.label ?? null;
};

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
  const [appMode, setAppMode] = useState<AppMode>("chart");
  const [ratings, setRatings] = useState<AllRatings>({ launch: {}, grow: {}, scale: {} });
  const [notes, setNotes] = useState<AllNotes>({ launch: "", grow: "", scale: "" });
  const [openDetails, setOpenDetails] = useState<OpenDetails>({});

  // Email form state
  const [emailName, setEmailName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

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

  const saveRatings = useCallback((next: AllRatings) => {
    setRatings(next);
    try { localStorage.setItem(STORAGE_KEY_RATINGS, JSON.stringify(next)); } catch { /* ignore */ }
  }, []);

  const saveNotes = useCallback((next: AllNotes) => {
    setNotes(next);
    try { localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(next)); } catch { /* ignore */ }
  }, []);

  const handleRate = (e: React.MouseEvent, tier: TierId, actId: number, color: RatingColor) => {
    e.stopPropagation();
    saveRatings({ ...ratings, [tier]: { ...ratings[tier], [actId]: color } });
  };

  const handleToggleDetail = (key: string) => {
    setOpenDetails((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleReset = (tier: TierId) => {
    saveRatings({ ...ratings, [tier]: {} });
  };

  const handleNoteChange = (tier: TierId, value: string) => {
    saveNotes({ ...notes, [tier]: value });
  };

  const handleGetReport = () => {
    setEmailStatus("idle");
    setEmailName("");
    setEmailAddress("");
    setAppMode("report");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToChart = () => {
    setAppMode("chart");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getCta = (tier: TierId): string => {
    const total = getTierTotal(tier);
    const vals = Object.values(ratings[tier]);
    const g = vals.filter((v) => v === "green").length;
    const y = vals.filter((v) => v === "yellow").length;
    const r = vals.filter((v) => v === "red").length;
    const rated = g + y + r;
    if (rated === 0) return CTAS.none;
    if (rated < total) return `${rated} of ${total} rated. Keep going.`;
    if (g === total) return CTAS.all_green;
    if (g >= Math.ceil(total * 0.67)) return CTAS.mostly_green;
    if (g + y >= Math.ceil(total * 0.5)) return CTAS.mixed;
    return CTAS.mostly_red;
  };

  const getColorCounts = (tier: TierId) => {
    const total = getTierTotal(tier);
    const vals = Object.values(ratings[tier]);
    const g = vals.filter((v) => v === "green").length;
    const y = vals.filter((v) => v === "yellow").length;
    const r = vals.filter((v) => v === "red").length;
    const rated = g + y + r;
    return {
      g, y, r,
      gW: rated ? (g / total) * 100 : 0,
      yW: rated ? (y / total) * 100 : 0,
      rW: rated ? (r / total) * 100 : 0,
    };
  };

  const getPillClass = (tier: TierId, actId: number, color: RatingColor): string => {
    return ratings[tier][actId] === color ? `pc-pill selected-${color}` : "pc-pill";
  };

  const allRated = (tier: TierId) => Object.keys(ratings[tier]).length === getTierTotal(tier);

  // Build report data for current tier
  const buildReportData = () => {
    const tier = activeTier;
    const tierObj = TIERS.find((t) => t.id === tier)!;
    const coaching = COACHING[tier];
    const total = tierObj.activities.length;
    const pattern = getScorePattern(ratings[tier], total);
    const overallMessage =
      pattern !== "incomplete" ? coaching.overall[pattern] : "";

    const activityNotes = tierObj.activities
      .filter((act) => ratings[tier][act.id] !== "green")
      .map((act) => ({
        activityName: act.name,
        rating: ratings[tier][act.id] ?? "red",
        note: coaching.activities[act.id]?.[ratings[tier][act.id] as "red" | "yellow"] ?? "",
      }));

    const greenActivities = tierObj.activities.filter(
      (act) => ratings[tier][act.id] === "green"
    );

    const priorityActId = getFirstPriorityActivity(ratings[tier], total);
    const priorityActName = priorityActId
      ? tierObj.activities.find((a) => a.id === priorityActId)?.name
      : null;

    const oneMove = priorityActName
      ? `Based on your ratings, your one move before your next coaching call is: ${priorityActName}. Bring your progress on this one thing to your next Momentum Call.`
      : "You're firing on all cylinders across every activity. Bring this chart to your next Momentum Call and let's talk about what's next.";

    return {
      tier,
      tierName: `${tierObj.badge} · ${tierObj.name}`,
      overallMessage,
      activityNotes,
      greenActivities,
      oneMove,
      notes: notes[tier],
    };
  };

  const handleSendEmail = async () => {
    if (!emailName.trim() || !emailAddress.trim()) return;
    setEmailStatus("sending");

    const report = buildReportData();
    const tierObj = TIERS.find((t) => t.id === activeTier)!;

    try {
      const res = await fetch("/api/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: emailName.trim(),
          studentEmail: emailAddress.trim(),
          tier: activeTier,
          tierName: tierObj.name,
          ratings: ratings[activeTier],
          notes: notes[activeTier],
          overallMessage: report.overallMessage,
          activityNotes: report.activityNotes,
          oneMove: report.oneMove,
        }),
      });

      if (!res.ok) throw new Error("send failed");
      setEmailStatus("sent");
    } catch {
      setEmailStatus("error");
    }
  };

  // ── Report View ─────────────────────────────────────────────────────────────

  if (appMode === "report") {
    const report = buildReportData();
    const tierObj = TIERS.find((t) => t.id === activeTier)!;

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
            <button className="pc-tier-tab active" type="button">
              {tierObj.badge} · {tierObj.name.charAt(0) + tierObj.name.slice(1).toLowerCase()} · Report
            </button>
          </div>
        </nav>

        <div className={`pc-tier-header ${tierObj.headerClass}`}>
          <div className="pc-tier-badge">{tierObj.badge} · Progress Report</div>
          <div className="pc-tier-name">{tierObj.name}</div>
          <div className="pc-tier-range">{tierObj.range}</div>
        </div>

        <div className="pc-report-body">
          {/* Back link */}
          <button className="pc-back-link" onClick={handleBackToChart} type="button">
            ← Back to my ratings
          </button>

          {/* Overall message */}
          <div className="pc-report-section">
            <div className="pc-report-section-label">Your Overall Assessment</div>
            <p className="pc-report-overall">{report.overallMessage}</p>
          </div>

          {/* Green wins */}
          {report.greenActivities.length > 0 && (
            <div className="pc-report-section">
              <div className="pc-report-section-label">What&apos;s Working</div>
              <div className="pc-green-wins">
                {report.greenActivities.map((act) => (
                  <div key={act.id} className="pc-green-win-item">
                    <span className="pc-green-check">✓</span>
                    <span>{act.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Coaching notes */}
          {report.activityNotes.length > 0 && (
            <div className="pc-report-section">
              <div className="pc-report-section-label">Your Coaching Notes</div>
              {report.activityNotes.map((note) => (
                <div key={note.activityName} className={`pc-coaching-card ${note.rating}-card`}>
                  <div className="pc-coaching-card-label">
                    <div className={`pc-coaching-dot dot-${note.rating}`} />
                    {note.rating === "red" ? "Needs Attention" : "In Progress"}
                  </div>
                  <div className="pc-coaching-card-name">{note.activityName}</div>
                  <p className="pc-coaching-card-note">{note.note}</p>
                </div>
              ))}
            </div>
          )}

          {/* One Move */}
          <div className="pc-report-section">
            <div className="pc-one-move-card">
              <div className="pc-one-move-label">Your One Move</div>
              <p className="pc-one-move-text">{report.oneMove}</p>
            </div>
          </div>

          {/* Notes */}
          <div className="pc-report-section">
            <div className="pc-report-section-label">My Focus This Week</div>
            <textarea
              className="pc-notes-input pc-report-notes-input"
              placeholder="Based on your report, what's the one red or yellow you're committing to move before your next coaching call?"
              value={notes[activeTier]}
              onChange={(e) => handleNoteChange(activeTier, e.target.value)}
            />
          </div>

          {/* Email form */}
          <div className="pc-email-section">
            <div className="pc-email-section-label">Email This Report to Yourself</div>
            <p className="pc-email-section-sub">
              Keep a copy in your inbox to reference before your next coaching call.
            </p>

            {emailStatus === "sent" ? (
              <div className="pc-email-success">
                ✓ Sent! Check your inbox.
              </div>
            ) : (
              <div className="pc-email-form">
                <input
                  className="pc-email-input"
                  type="text"
                  placeholder="Your name"
                  value={emailName}
                  onChange={(e) => setEmailName(e.target.value)}
                  disabled={emailStatus === "sending"}
                />
                <input
                  className="pc-email-input"
                  type="email"
                  placeholder="Your email address"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  disabled={emailStatus === "sending"}
                />
                <button
                  className={`pc-email-btn${!emailName.trim() || !emailAddress.trim() || emailStatus === "sending" ? " disabled" : ""}`}
                  onClick={handleSendEmail}
                  disabled={!emailName.trim() || !emailAddress.trim() || emailStatus === "sending"}
                  type="button"
                >
                  {emailStatus === "sending" ? "Sending…" : "Email My Report"}
                </button>
                {emailStatus === "error" && (
                  <p className="pc-email-error">Something went wrong. Please try again.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Chart View ──────────────────────────────────────────────────────────────

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
              onClick={() => { setActiveTier(tier.id); setAppMode("chart"); }}
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
        const canGetReport = allRated(tier.id);

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
                const currentStage = getActivityStage(tier, act.id);

                return (
                  <div key={act.id} className="pc-activity-card">
                    <div
                      className="pc-activity-header"
                      onClick={() => handleToggleDetail(detailKey)}
                    >
                      <div className="pc-activity-number">{String(act.id).padStart(2, "0")}</div>
                      <div className="pc-activity-info">
                        <div className="pc-activity-name-row">
                          <span className="pc-activity-name">{act.name}</span>
                          {currentStage && (
                            <span className={`pc-stage-pill stage-${currentStage}`}>
                              {currentStage.charAt(0).toUpperCase() + currentStage.slice(1)}
                            </span>
                          )}
                        </div>
                        <div className="pc-activity-subtitle">{act.subtitle}</div>
                      </div>
                      <div className="pc-rating-pills">
                        {(["red", "yellow", "green"] as RatingColor[]).map((color) => (
                          <button
                            key={color}
                            className={getPillClass(tier.id, act.id, color)}
                            onClick={(e) => handleRate(e, tier.id, act.id, color)}
                            type="button"
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
                  <div className="pc-progress-fill fill-green" style={{ width: `${counts.gW}%` }} />
                  <div className="pc-progress-fill fill-yellow" style={{ width: `${counts.yW}%` }} />
                  <div className="pc-progress-fill fill-red" style={{ width: `${counts.rW}%` }} />
                </div>
                <div className="pc-summary-cta">{getCta(tier.id)}</div>

                {canGetReport && (
                  <button
                    className="pc-get-report-btn"
                    onClick={handleGetReport}
                    type="button"
                  >
                    Get My Coaching Report →
                  </button>
                )}
                {!canGetReport && (
                  <p className="pc-report-hint">
                    Rate all {tier.activities.length} activities to unlock your coaching report.
                  </p>
                )}
              </div>

            </div>

            {/* Reset */}
            <div className="pc-actions-row">
              <button className="pc-reset-btn" onClick={() => handleReset(tier.id)} type="button">
                ↺ Reset Ratings
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
