import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      studentName,
      studentEmail,
      tier,
      tierName,
      ratings,
      notes,
      overallMessage,
      activityNotes,
      oneMove,
    } = body;

    const results: { email?: string; sheets?: string; error?: string } = {};

    // ── Email via Resend ──────────────────────────────────────────────────────
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const htmlBody = buildEmailHtml({
        studentName,
        tier,
        tierName,
        overallMessage,
        activityNotes,
        oneMove,
        notes,
      });

      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Expert Freedom <progress@getexpertfreedom.com>",
          to: [studentEmail],
          subject: `Your Expert Freedom Progress Report — ${tierName}`,
          html: htmlBody,
        }),
      });

      if (!resendRes.ok) {
        const err = await resendRes.json().catch(() => ({}));
        console.error("Resend error:", err);
        results.email = "error";
      } else {
        results.email = "sent";
      }
    } else {
      console.warn("RESEND_API_KEY not set — skipping email send");
      results.email = "skipped";
    }

    // ── Google Sheets via Apps Script webhook ─────────────────────────────────
    const sheetsUrl = process.env.SHEETS_WEBHOOK_URL;
    if (sheetsUrl) {
      const ratingsFlat = Object.entries(ratings as Record<string, string>)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([, v]) => v)
        .join(", ");

      const sheetsRes = await fetch(sheetsUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          name: studentName,
          email: studentEmail,
          tier: tierName,
          activity1: (ratings as Record<string, string>)["1"] ?? "",
          activity2: (ratings as Record<string, string>)["2"] ?? "",
          activity3: (ratings as Record<string, string>)["3"] ?? "",
          activity4: (ratings as Record<string, string>)["4"] ?? "",
          activity5: (ratings as Record<string, string>)["5"] ?? "",
          activity6: (ratings as Record<string, string>)["6"] ?? "",
          allRatings: ratingsFlat,
          notes: notes ?? "",
          oneMove: oneMove ?? "",
        }),
      });

      results.sheets = sheetsRes.ok ? "logged" : "error";
    } else {
      console.warn("SHEETS_WEBHOOK_URL not set — skipping Sheets logging");
      results.sheets = "skipped";
    }

    // Return success as long as at least email or sheets worked
    return Response.json({ success: true, results });
  } catch (err) {
    console.error("send-report error:", err);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

// ── Email HTML builder ────────────────────────────────────────────────────────

interface ActivityNote {
  activityName: string;
  rating: string;
  note: string;
}

interface EmailData {
  studentName: string;
  tier: string;
  tierName: string;
  overallMessage: string;
  activityNotes: ActivityNote[];
  oneMove: string;
  notes: string;
}

function buildEmailHtml(data: EmailData): string {
  const { studentName, tierName, overallMessage, activityNotes, oneMove, notes } = data;

  const colorMap: Record<string, string> = {
    red: "#9B3A3A",
    yellow: "#C4922A",
    green: "#4A7C59",
  };

  const bgMap: Record<string, string> = {
    red: "#FAEAEA",
    yellow: "#FDF4E3",
    green: "#EAF2EC",
  };

  const labelMap: Record<string, string> = {
    red: "🔴 Needs Attention",
    yellow: "🟡 In Progress",
    green: "🟢 Consistent & Working",
  };

  const activityRows = activityNotes
    .map(
      (a) => `
      <div style="background:${bgMap[a.rating] ?? "#F2F2EE"};border-left:4px solid ${colorMap[a.rating] ?? "#857479"};border-radius:6px;padding:16px 20px;margin-bottom:12px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${colorMap[a.rating] ?? "#857479"};margin-bottom:6px;">${labelMap[a.rating] ?? a.rating}</div>
        <div style="font-weight:700;font-size:15px;color:#361F36;margin-bottom:8px;">${a.activityName}</div>
        <div style="font-size:13px;line-height:1.6;color:#361F36;">${a.note}</div>
      </div>`
    )
    .join("");

  const notesSection = notes
    ? `<div style="background:#F2F2EE;border-radius:6px;padding:16px 20px;margin-top:16px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#857479;margin-bottom:8px;">My Focus This Week</div>
        <div style="font-size:13px;line-height:1.6;color:#361F36;">${notes}</div>
       </div>`
    : "";

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F2F2EE;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F2F2EE;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr><td style="background:#361F36;border-radius:12px 12px 0 0;padding:32px 36px 28px;text-align:center;">
          <div style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:rgba(242,242,238,0.6);margin-bottom:8px;">Expert Freedom Progress Report</div>
          <div style="font-size:28px;font-weight:700;color:#F2F2EE;margin-bottom:4px;">${tierName}</div>
          <div style="font-size:14px;color:rgba(242,242,238,0.6);">Self-Assessment Report for ${studentName}</div>
        </td></tr>

        <!-- Overall Message -->
        <tr><td style="background:#ffffff;padding:28px 36px;">
          <div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#857479;margin-bottom:12px;">Your Overall Assessment</div>
          <div style="font-size:15px;line-height:1.7;color:#361F36;">${overallMessage}</div>
        </td></tr>

        <!-- Activity Notes -->
        <tr><td style="background:#ffffff;padding:0 36px 8px;">
          <div style="border-top:1px solid rgba(54,31,54,0.08);padding-top:24px;margin-bottom:16px;">
            <div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#857479;margin-bottom:16px;">Your Coaching Notes</div>
            ${activityRows}
          </div>
        </td></tr>

        <!-- One Move -->
        <tr><td style="background:#ffffff;padding:0 36px 28px;">
          <div style="background:#361F36;border-radius:8px;padding:20px 24px;">
            <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:rgba(242,242,238,0.6);margin-bottom:8px;">Your One Move</div>
            <div style="font-size:14px;line-height:1.6;color:#F2F2EE;">${oneMove}</div>
          </div>
        </td></tr>

        ${notesSection ? `<tr><td style="background:#ffffff;padding:0 36px 28px;">${notesSection}</td></tr>` : ""}

        <!-- Footer -->
        <tr><td style="background:#ffffff;border-top:1px solid rgba(54,31,54,0.08);border-radius:0 0 12px 12px;padding:20px 36px;text-align:center;">
          <div style="font-size:12px;color:#857479;line-height:1.6;">
            Expert Freedom &nbsp;·&nbsp; <a href="https://getexpertfreedom.com" style="color:#857479;">getexpertfreedom.com</a>
          </div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
