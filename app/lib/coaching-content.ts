export type TierId = "launch" | "grow" | "scale";
export type RatingColor = "red" | "yellow" | "green";
export type ScorePattern =
  | "all_green"
  | "mostly_green"
  | "mixed"
  | "mostly_red"
  | "all_red"
  | "incomplete";

export interface ActivityCoaching {
  red: string;
  yellow: string;
}

export interface TierCoaching {
  overall: Record<Exclude<ScorePattern, "incomplete">, string>;
  activities: Record<number, ActivityCoaching>;
}

export const COACHING: Record<TierId, TierCoaching> = {
  launch: {
    overall: {
      all_red:
        "You know exactly where you are, and that's actually the most powerful place to start. Most students who come in with all reds leave with their first client faster than they expect, because nothing else is competing for their attention. Begin with the 30-Day Quick Start, and you'll have tasks complete and a new update for us next time you visit this progress chart.",
      mostly_red:
        "You have glimmers of green, which means you know what it feels like to get something working. Now the job is to take that same energy and apply it to your reds, one at a time. Don't spread across all of them. Find the red that's blocking everything else and make that your only focus. If you're finding it difficult to know what to tackle first or how to go about it, bring that to our Momentum Calls, and we'll get you on track.",
      mixed:
        "You're in the most common spot because mixed results can feel like progress, but they can also mask the one thing that's quietly stalling you. Look at your reds. Which one, if you fixed it this week, would make the yellows easier? Also, sometimes once we start making progress, we go backwards. Don't let that happen to you. Bring what you're stalling out on to a Momentum Call, and we'll get you back on track.",
      mostly_green:
        "You're close! This isn't the time to go back and polish what's already working. Start looking at what needs to be in place for you to get to that next jump in growth. Your reds are the only thing standing between where you are and consistent revenue.",
      all_green:
        "You've built the foundation. Everything in Tier 1 is working. The question now is whether you're ready to stop launching and start growing. Time to head to Tier 2.",
    },
    activities: {
      1: {
        red: `Write one sentence: "I help [who] do [what] so they can [outcome]." That's your offer. This is fully explained in the Beta Client Blueprint in Fractional Freedom. But if you want to get going quickly, begin with the 30-Day Quick Start Agent. It walks you through this step by step. If you're still stuck, bring it to a Momentum Call or drop it in the community.`,
        yellow: `Changing your offer or questioning yourself is a form of avoiding the market. Lock it for 30 days and lead with it exactly as it is, even if you are not sure if it's "perfect". The market will tell you what needs to change.`,
      },
      2: {
        red: "Open your contacts today, identify 10 people you could reach out to this week, and start there. Remember: trackable conversations count — calls, messages, even talking with a friend about your new business. The 30-Day Quick Start has your outreach framework so make sure you use it. The main thing to know is that tinkering with a website or creating another social media post is not going to help you generate revenue. Conversations equal cash.",
        yellow:
          "You're moving but stalling before the finish line. Many people are scared to have conversations, but conversations equal cash. Every call, message, or real conversation about your business counts. If you're not sure how to move through this fear, bring it to a Momentum Call. Consistent effort is what's going to get you consistent results.",
      },
      3: {
        red: "Out of sight is out of mind. A simple Notion chart, or a pipeline in GHL, with basic stages is enough to start. Build it before your next conversation. Bring your setup to a Momentum Call if you want eyes on it. Having a system like this is the key to remembering where you left off with leads and picking back up when the time is right.",
        yellow:
          "A pipeline you don't use is decoration. The fix isn't to keep messing around with your website. It's a 10-minute daily habit. Every day, open it, reach out to some of your network, and update every column.",
      },
      4: {
        red: "Your website doesn't need to be perfect. It's just nice to be done. Our 30-Day Quick Start Agent will give this to you with a simple booking calendar at the bottom.",
        yellow:
          "If you wouldn't confidently send a prospect there today, find the one thing making you hesitate and fix only that. Don't redesign or spend weeks on this. It's going to change anyways.",
      },
      5: {
        red: "You cannot close a client you haven't talked to. Your goal is five sales calls a month and you want to start by booking one this week. If you're not sure how to ask, bring it to a Momentum Call or the community. The Beta Client Blueprint inside of Fractional Freedom will help you craft your initial message and communicate clearly with your elevator pitch.",
        yellow:
          "Your biggest leading indicator at this stage in business is the volume of sales calls. Five a month is the target; rhythm maintaining your pipeline gets you there.",
      },
      6: {
        red: "Ending a conversation without asking is the most expensive habit in your business. Follow the Collaborative Close process at the end of every call and every follow-up message. If you haven't learned it yet, that's your first stop. Make sure you're recording every conversation so you can get feedback on it with our agent.",
        yellow:
          "Backing off when you feel resistance is costing you clients who actually want to say yes. Resistance is a question in disguise, so stay in the conversation and follow the Collaborative Close process through. Make sure that recording happens. That's the best way to know how you're doing.",
      },
      7: {
        red: "You can't build confidence in your offer without delivering it. Book your first beta client this week, starting with someone from your outreach list who said yes or showed interest. The LEAP Method training inside Expert Freedom will walk you through exactly how to deliver. Three completed betas is your proof of concept.",
        yellow:
          "You're partway there, so keep going. Don't stop at one or two. Each delivery builds your confidence and sharpens your process. Bring your experience to a Momentum Call so we can help you tighten it up before the next one.",
      },
      8: {
        red: "You've done the hard work. Now it's time to move from your discounted beta rate to your full price. The next three clients pay at full price. If you're unsure where to set that, bring it to a Momentum Call and we'll help you think it through.",
        yellow:
          "You've made the ask at full price at least once. Now make it the standard. Three full-price clients is the Tier 1 finish line.",
      },
    },
  },

  grow: {
    overall: {
      all_red:
        "You've made it to $10K, which means you know how to get clients. But right now everything is sitting on your shoulders, and that's what will stall your growth before anything else does. None of this is complicated. It's just not built yet. Pick the one thing that's costing you the most time and start there. Bring it to a Momentum Call and we'll help you figure out what to tackle first.",
      mostly_red:
        "You have proof that some of this works. Now the job is to stop doing everything manually and start building the systems that let your business run without you in every piece of it. Bring your biggest time drain to a Momentum Call and let's figure out what to hand off first.",
      mixed:
        "You've built some structure and it's showing. But the gaps are real, and at this stage, gaps become bottlenecks fast. The things still in red are probably the ones you keep pushing off because they feel complex. They're not. They just need attention. Which one is costing you the most right now?",
      mostly_green:
        "You are close to cracking the code on Grow. Your foundation is solid. Now it's about closing the last few gaps so your revenue becomes truly predictable. Don't let almost get in the way of done.",
      all_green:
        "You've done the hard work of building a real business, not just a busy one. Everything in Tier 2 is working. It's time to stop growing and start scaling. Head to Tier 3.",
    },
    activities: {
      1: {
        red: "Doing everything yourself is not a badge of honor at this stage. It's a ceiling. You will not get to $30K by adding more to your plate. The first hire doesn't have to be full-time or expensive. A VA, a contractor, a part-time admin, even a Claude EA (as found in the asset library). Bring what you need off your plate to a Momentum Call and we'll help you figure out what to delegate first.",
        yellow:
          "Delegation is a skill and it takes practice. You'll find details on who to hire and when inside of Operation Delegation.",
      },
      2: {
        red: "Content is how people find you when you're not in the room. Pick one platform, show up daily using the systems in Expert Content OS, and don't switch until you have momentum. If you're not sure what to post, bring it to a Momentum Call or drop ideas in the community.",
        yellow:
          "Posting occasionally is actually harder than posting consistently because you're always starting from zero. Batch your content weekly using the Expert Content OS systems. The community is a great place to share what you're creating and get feedback.",
      },
      3: {
        red: "Your email list is the one audience you actually own. Your social following can disappear overnight. If you don't have a list yet, starting one is your first move. If you have one but aren't emailing it, you're leaving relationship and revenue on the table. Learn how to set up your email system and send weekly emails using Expert Growth OS.",
        yellow:
          "Emailing inconsistently teaches your list to ignore you. Pick a cadence, build two weeks of emails in advance so you're never scrambling, and protect it like a client commitment.",
      },
      4: {
        red: "If your clients are paying for your thinking and you're giving them your time, you've created a job, not a business. At Grow, the shift is from any doing you're still hanging on to into guiding. You advise, they execute. Make sure you're following the Leap Method exactly the way that we teach it inside of Fractional Freedom.",
        yellow: `Crossing back into implementation "just this once" is a habit in disguise. Every time you do the work for a client, you train them to expect it and train yourself to avoid the boundary. Hold the line. If this is something you struggle with, the Influencing Change training inside of Fractional Freedom will help you.`,
      },
      5: {
        red: `Happy clients who don't refer you are a missed opportunity, and most of the time it's because you never asked. A simple ask is enough: "If you know someone who could use this, I'd love an introduction." Bring it to a Momentum Call if you want help scripting it.`,
        yellow:
          "Asking once and hoping isn't a system. It's a wish. Build the ask into a specific moment in your client journey (usually after a win) so it happens every time without you having to remember. Also, always make sure that you get testimonials immediately after a win as well, so you can use those to market your business.",
      },
      6: {
        red: "Feast-or-famine at this stage usually means one thing: you stop selling when you get busy with delivery. Your pipeline has to keep moving even when you're full. Five sales calls a month is still your target, even when you're totally booked up.",
        yellow:
          "Good months masking bad months is a dangerous pattern. Look at your last three months. If there's a swing of more than 30%, you have a consistency problem, not a revenue problem. Bring that pattern to a Momentum Call and let's diagnose it.",
      },
    },
  },

  scale: {
    overall: {
      all_red:
        "You've built real revenue, and now you're hitting the wall that every successful Grow-stage business hits. The model that got you here won't get you to $30K+. This tier is about building differently, not working harder. Pick the one thing that feels most like a bottleneck right now and bring it to a Momentum Call. That's where we start.",
      mostly_red:
        "You have momentum and a few things working at scale. Now the job is to build out the rest of the infrastructure so your business isn't dependent on you being in it every day. The green spots are proof you can do this. Now apply that same energy to what's still red.",
      mixed:
        "You're in the middle of a real transformation, from operator to CEO. That's uncomfortable by design. The reds you're looking at aren't failures. They're the next layer of the business you're building. Which one, if you solved it this month, would change everything?",
      mostly_green:
        "You are running a real business at scale. The last few gaps are the difference between a business that grows with you and one that grows without you. Close them and you've built something most people only talk about.",
      all_green:
        "This is what Expert Freedom is built for. You've done it. A business that works, scales, and doesn't require you to be in every corner of it. The question now is: what does the next level look like for you? Bring that to a Momentum Call.",
    },
    activities: {
      1: {
        red: "One-to-one delivery has a revenue ceiling and you've probably hit it. The one-to-many offer is how you break through. If you don't have one yet, that's the work. You'll find how to do this inside of Expert Offer Mastery. Bring your ideas to a call with Laura and we'll help you design the right offer for where you are.",
        yellow:
          "A group offer in development that isn't generating revenue isn't an offer yet. It's a side project. Set a launch date, put people in it, and let the first version be imperfect. Done will teach you more than planned ever will.",
      },
      2: {
        red: "Workshops are one of the fastest ways to build trust with a room full of people at once. If this isn't part of your strategy yet, it should be. Start with one: a 60-minute live session on the problem you solve best. Bring your topic idea to a Momentum Call and we'll pressure-test it.",
        yellow:
          "The magic of workshops is in the repetition. Attendees who didn't convert the first time often do the second or third. Build it into your quarterly rhythm.",
      },
      3: {
        red: "Leads going cold is a systems problem, not a people problem. You need a sequence that stays in touch with prospects automatically: email, content, and follow-up, so no one falls through the gaps. Use Expert Growth OS to build this out if you haven't already.",
        yellow:
          "A partial system that leaks leads is almost worse than no system. It gives you the illusion of follow-up without the result. Map every lead path and make sure each one ends somewhere. Bring it to a coaching call with Laura if you want a second set of eyes.",
      },
      4: {
        red: "If you're still the bottleneck for everything, your growth is capped at your personal capacity. Operation Delegation inside the program will help you identify who to hire next and what to hand off first. But if you're working more than 30 hours a week, this is an important place to look.",
        yellow:
          "Having help and still being in everything is the most common trap at Scale. The goal isn't to have a team. It's to have a team that actually frees you. If you're still pulled into things others should own, bring that to a call with Laura. We'll help you let go of the right things.",
      },
      5: {
        red: "The challenge with a high-ticket, low-volume business is that if one client leaves, it's a significant reduction in revenue. This stage is an important place to start diversifying your revenue streams. Start with what your audience is already asking for.",
        yellow:
          "An inconsistent second stream is a signal, not a failure. It means the offer has potential but the delivery or marketing isn't dialed in yet. Bring it to a call with Laura and let's figure out which one it is.",
      },
      6: {
        red: "If every client still comes from you reaching out, you're working harder than you need to. Inbound is built through consistent content, clear positioning, and showing up as the authority in your space. Expert Content OS is your starting point.",
        yellow:
          "Unpredictable inbound means your content is working sometimes but not systematically. Look at what's actually driving leads and do more of that. The community is a great place to share what's landing and get feedback. At this stage, it's important not to be the best-kept secret around.",
      },
    },
  },
};

export function getScorePattern(
  ratings: Record<number, RatingColor>,
  total: number
): ScorePattern {
  const vals = Object.values(ratings);
  if (vals.length < total) return "incomplete";
  const g = vals.filter((v) => v === "green").length;
  const y = vals.filter((v) => v === "yellow").length;
  if (g === total) return "all_green";
  if (g === 0) return "all_red";
  if (g >= Math.ceil(total * 0.67)) return "mostly_green";
  if (g + y >= Math.ceil(total * 0.5)) return "mixed";
  return "mostly_red";
}

export function getFirstPriorityActivity(
  ratings: Record<number, RatingColor>,
  total: number
): number | null {
  for (let i = 1; i <= total; i++) {
    if (ratings[i] === "red") return i;
  }
  for (let i = 1; i <= total; i++) {
    if (ratings[i] === "yellow") return i;
  }
  return null;
}
