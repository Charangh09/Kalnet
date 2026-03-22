import { GoogleGenerativeAI } from "@google/generative-ai";

const promptTemplate = (idea) => `SYSTEM:
You are an expert planning assistant. Convert vague ideas into structured actionable plans.

TASK:
Analyze the user input and return STRICT JSON only.

USER INPUT:
${idea}

OUTPUT FORMAT (STRICT JSON):
{
  "goal": "",
  "method": "",
  "steps": [""],
  "timeline": "",
  "missing_elements": {
    "goal_clarity": {
      "missing": true,
      "insight": ""
    },
    "steps_missing": {
      "missing": true,
      "insight": ""
    },
    "resources_missing": {
      "missing": true,
      "insight": ""
    },
    "timeline_missing": {
      "missing": true,
      "insight": ""
    }
  },
  "simplified_version": "",
  "action_steps": [""],
  "overall_completeness": "high | medium | low"
}

RULES:
- Return valid JSON only.
- Make steps specific to the user's idea and domain.
- Avoid generic advice.
- Keep actions practical and executable.
`;

const toText = (value) => (typeof value === "string" ? value.trim() : "");

const toArray = (value) => {
  if (!Array.isArray(value)) return [];
  return value.map((item) => toText(item)).filter(Boolean);
};

const toBool = (value, fallback = true) =>
  typeof value === "boolean" ? value : fallback;

const toMissingItem = (value, fallbackMissing, fallbackInsight) => {
  if (typeof value === "boolean") {
    return { missing: value, insight: fallbackInsight };
  }

  if (value && typeof value === "object") {
    return {
      missing: toBool(value.missing, fallbackMissing),
      insight: toText(value.insight) || fallbackInsight,
    };
  }

  return { missing: fallbackMissing, insight: fallbackInsight };
};

const extractJson = (text) => {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Could not parse model JSON response.");
  }
  return text.slice(start, end + 1);
};

const normalize = (parsed) => ({
  goal: toText(parsed.goal),
  method: toText(parsed.method),
  steps: toArray(parsed.steps),
  timeline: toText(parsed.timeline),
  missing_elements: {
    goal_clarity: toMissingItem(
      parsed?.missing_elements?.goal_clarity,
      true,
      "Clarify the goal with a measurable outcome.",
    ),
    steps_missing: toMissingItem(
      parsed?.missing_elements?.steps_missing,
      true,
      "Add practical execution steps with clear sequence.",
    ),
    resources_missing: toMissingItem(
      parsed?.missing_elements?.resources_missing,
      true,
      "List budget, tools, and required skills.",
    ),
    timeline_missing: toMissingItem(
      parsed?.missing_elements?.timeline_missing,
      true,
      "Define a timeline with checkpoints.",
    ),
  },
  simplified_version: toText(parsed.simplified_version),
  action_steps: toArray(parsed.action_steps).slice(0, 8),
  overall_completeness: toText(parsed.overall_completeness).toLowerCase(),
});

const fallbackPlan = (idea) => {
  const timelineMatch = idea.match(
    /\b(\d+\s*(day|days|week|weeks|month|months|year|years)|weekly|monthly|by\s+[a-z]+|q[1-4])\b/i,
  );
  const timeline = timelineMatch?.[0] || "";

  const lower = idea.toLowerCase();
  const topic = lower
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(
      (word) =>
        word.length > 2 &&
        ![
          "want",
          "plan",
          "start",
          "build",
          "create",
          "with",
          "and",
          "for",
          "this",
          "that",
          "day",
          "days",
          "week",
          "weeks",
          "month",
          "months",
          "year",
          "years",
        ].includes(word),
    )
    .slice(0, 4)
    .join(" ");

  const domain = /youtube|video|channel|content/.test(lower)
    ? "content"
    : /study|exam|course|college|gate|jee|neet|upsc|cat/.test(lower)
      ? "study"
      : /business|startup|sales|customer/.test(lower)
        ? "business"
        : /job|career|interview|resume/.test(lower)
          ? "career"
          : /fitness|gym|workout|diet/.test(lower)
            ? "fitness"
            : "general";

  const hasResourceKeywordSignal =
    /\b(budget|money|tool|tools|team|time|skill|skills|resource|resources|equipment|book|books|series|software|laptop|camera|coaching|material|materials|subscription)\b/i.test(
      lower,
    );
  const hasBudgetAmountSignal =
    /(₹|\$|\binr\b|\brs\b|\busd\b)\s*\d+|\b\d+[\d,]*\s*(rupees|inr|rs|usd|dollars)\b/i.test(
      idea,
    );
  const hasTimeCommitmentSignal =
    /\b\d+\s*(hour|hours|hr|hrs)\s*(\/|per)?\s*(day|week|month)?\b/i.test(
      lower,
    );
  const hasResourceSignal =
    hasResourceKeywordSignal ||
    hasBudgetAmountSignal ||
    hasTimeCommitmentSignal;

  const goal = /\b\d+\b/.test(idea)
    ? toText(idea)
    : timeline
      ? `Achieve ${topic || "this goal"} with a measurable result by ${timeline}.`
      : `Achieve ${topic || "this goal"} with a measurable outcome and deadline.`;

  const methodByDomain = {
    content:
      "Pick one audience niche, publish on a fixed schedule, and improve using retention and CTR data.",
    study:
      "Map syllabus into weekly blocks, practice under timed conditions, and improve weak topics from mock analysis.",
    business:
      "Validate demand early, launch a lean offer, and iterate weekly using customer feedback and conversion metrics.",
    career:
      "Target one role, build proof-of-skill projects, apply consistently, and improve based on interview feedback.",
    fitness:
      "Combine structured training, nutrition targets, and weekly progress tracking to make data-driven adjustments.",
    general:
      "Break the goal into milestones, execute weekly deliverables, and refine the plan based on measurable outcomes.",
  };

  const stepsByDomain = {
    content: [
      "Define one audience profile and the exact value your content will deliver.",
      "Create a 4-week publishing calendar with topics, hooks, and scripts.",
      "Prepare a repeatable production workflow and publishing checklist.",
      "Publish consistently on fixed days and collect performance data.",
      "Review weekly analytics and refine topics based on top performers.",
    ],
    study: [
      "Split the syllabus into weekly units with completion targets.",
      "Follow daily deep-study blocks and capture concise revision notes.",
      "Solve timed practice sets after each topic.",
      "Run a weekly mock test and measure accuracy and speed.",
      "Shift time allocation toward weak areas until scores improve.",
    ],
    business: [
      "Define your target customer and one painful problem to solve.",
      "Validate demand through interviews, pilots, or pre-sales.",
      "Build a minimum offer with clear pricing and delivery model.",
      "Launch and track conversion, retention, and revenue signals.",
      "Iterate weekly using objections and usage feedback.",
    ],
    career: [
      "Pick a target role and list required skill gaps.",
      "Build two portfolio artifacts aligned to real job requirements.",
      "Optimize resume and profiles with role-specific keywords.",
      "Apply to a fixed number of roles each week.",
      "Practice interviews and close gaps from each attempt.",
    ],
    fitness: [
      "Record baseline metrics like weight, reps, and daily activity.",
      "Set a weekly training split aligned to your fitness objective.",
      "Define calorie and protein targets and track adherence.",
      "Log workouts and recovery to avoid overtraining.",
      "Review weekly trend data and adjust workload and nutrition.",
    ],
  };

  const steps = stepsByDomain[domain] || [
    `Define the exact outcome for ${topic || "this idea"} and who it benefits.`,
    "List constraints, tools, and skills needed for execution.",
    "Split execution into weekly milestones with measurable outputs.",
    "Complete one milestone in the next 48 hours.",
    "Review weekly progress and update next tasks.",
  ];

  const actionSteps = [
    `Rewrite the goal for ${topic || "this idea"} with a number and date.`,
    "Create a resource checklist with exact tools, budget, and weekly hours.",
    "Schedule the next 7 days of tasks in calendar blocks.",
    "Deliver one concrete output within 48 hours.",
    timeline
      ? `Set milestone checkpoints leading up to ${timeline}.`
      : "Set a weekly checkpoint and track one progress metric.",
    "Run a weekly review and revise the next sprint plan.",
  ];

  const missing = {
    goal_clarity: {
      missing: !/\b\d+\b/.test(idea),
      insight: /\b\d+\b/.test(idea)
        ? "Goal exists. Add one success metric if not already specified."
        : "Goal is broad. Add a number-based target and deadline.",
    },
    steps_missing: {
      missing: false,
      insight:
        "Execution steps exist. Add owners and dates to strengthen accountability.",
    },
    resources_missing: {
      missing: !hasResourceSignal,
      insight: hasResourceSignal
        ? "Resources are partially stated. Add exact budget and hours per week."
        : "Resources are missing. Specify budget, tools, and time commitment.",
    },
    timeline_missing: {
      missing: !timeline,
      insight: timeline
        ? "Timeline exists. Add milestone checkpoints within the timeframe."
        : "Timeline is missing. Add a concrete target date or duration.",
    },
  };

  return {
    goal,
    method: methodByDomain[domain] || methodByDomain.general,
    steps,
    timeline,
    missing_elements: missing,
    simplified_version: toText(idea),
    action_steps: actionSteps.slice(0, 8),
    overall_completeness: timeline && hasResourceSignal ? "high" : "medium",
  };
};

const scoreCompleteness = (normalized) => {
  let points;

  if (normalized.overall_completeness === "high") points = 25;
  else if (normalized.overall_completeness === "medium") points = 15;
  else if (normalized.overall_completeness === "low") points = 5;
  else {
    const checks = [
      Boolean(normalized.goal),
      Boolean(normalized.method),
      normalized.steps.length >= 3,
      Boolean(normalized.timeline),
      normalized.missing_elements.resources_missing?.missing === false,
    ];

    points = Math.round((checks.filter(Boolean).length / checks.length) * 25);
  }

  const missingCount = Object.values(normalized.missing_elements || {}).filter(
    (item) => item?.missing,
  ).length;

  if (missingCount >= 2) {
    points = Math.min(points, 5);
  } else if (missingCount === 1) {
    points = Math.min(points, 20);
  }

  if (normalized.missing_elements?.resources_missing?.missing) {
    points = Math.min(points, 10);
  }

  return Math.max(0, points);
};

const toResponse = (idea, normalized) => {
  const breakdown = {
    goal:
      normalized.goal && !normalized.missing_elements.goal_clarity?.missing
        ? 25
        : 0,
    steps:
      normalized.steps.length > 0 &&
      !normalized.missing_elements.steps_missing?.missing
        ? 25
        : 0,
    timeline:
      normalized.timeline &&
      !normalized.missing_elements.timeline_missing?.missing
        ? 25
        : 0,
    completeness: scoreCompleteness(normalized),
  };

  const total = Object.values(breakdown).reduce((sum, n) => sum + n, 0);

  return {
    input_idea: idea,
    structured_plan: {
      goal: normalized.goal,
      method: normalized.method,
      steps: normalized.steps,
      timeline: normalized.timeline,
    },
    missing_elements: normalized.missing_elements,
    simplified_version: normalized.simplified_version,
    action_steps: normalized.action_steps,
    clarity_score: {
      score: total,
      breakdown,
      reason: `Clarity score is ${total}/100. Goal defined: ${breakdown.goal}/25 | Steps present: ${breakdown.steps}/25 | Timeline present: ${breakdown.timeline}/25 | Overall completeness: ${breakdown.completeness}/25`,
    },
    generated_at: new Date().toISOString(),
  };
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const idea = toText(req.body?.idea);
  if (!idea) {
    return res
      .status(400)
      .json({ error: "'idea' is required and must be a non-empty string." });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    const fallback = fallbackPlan(idea);
    return res.status(200).json(toResponse(idea, fallback));
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
    });
    const prompt = promptTemplate(idea);
    const result = await model.generateContent(prompt);
    const text = await result.response.text();
    const parsed = JSON.parse(extractJson(text));
    const normalized = normalize(parsed);
    return res.status(200).json(toResponse(idea, normalized));
  } catch (error) {
    const message = String(error?.message || "").toLowerCase();
    if (
      message.includes("429") ||
      message.includes("quota") ||
      message.includes("rate limit")
    ) {
      const fallback = fallbackPlan(idea);
      return res.status(200).json(toResponse(idea, fallback));
    }

    return res.status(500).json({ error: "Failed to analyze plan." });
  }
}
