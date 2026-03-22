const splitSentences = (text) =>
  text
    .split(/[.!?\n]+/)
    .map((part) => part.trim())
    .filter(Boolean);

const firstMeaningfulSentence = (idea) =>
  splitSentences(idea)[0] || idea.trim();

const STOPWORDS = new Set([
  "i",
  "want",
  "to",
  "a",
  "an",
  "the",
  "and",
  "or",
  "for",
  "with",
  "in",
  "on",
  "at",
  "of",
  "my",
  "me",
  "is",
  "are",
  "be",
  "this",
  "that",
  "it",
  "from",
  "by",
  "as",
  "plan",
  "start",
  "build",
  "create",
  "day",
  "days",
  "week",
  "weeks",
  "month",
  "months",
  "year",
  "years",
]);

const detectTimeline = (idea) => {
  const timelineRegex =
    /\b(\d+\s*(day|days|week|weeks|month|months|year|years)|daily|weekly|monthly|quarterly|by\s+[a-z]+|in\s+\d+\s*(day|days|week|weeks|month|months)|q[1-4])\b/i;
  const match = idea.match(timelineRegex);
  return match ? match[0] : "";
};

const detectDomain = (idea) => {
  const lower = idea.toLowerCase();

  if (/youtube|channel|video|thumbnail|subscriber/.test(lower))
    return "content";
  if (
    /exam|study|college|course|learn|syllabus|gate|jee|neet|upsc|cat/.test(
      lower,
    )
  )
    return "study";
  if (/business|startup|revenue|sales|customer|market/.test(lower))
    return "business";
  if (/job|interview|resume|career|placement/.test(lower)) return "career";
  if (/gym|fitness|weight|workout|diet/.test(lower)) return "fitness";
  if (/app|website|project|code|software|saas/.test(lower)) return "product";

  return "general";
};

const extractTopic = (idea) => {
  const words = idea
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length >= 3 && !STOPWORDS.has(word));

  if (!words.length) return "this goal";
  return words.slice(0, 4).join(" ");
};

const detectGoal = (idea, topic, timeline) => {
  const sentence = firstMeaningfulSentence(idea);
  const hasMetric = /\b\d+\b/.test(idea);

  if (hasMetric) return sentence;
  if (timeline) {
    return `Achieve ${topic} with a measurable result by ${timeline}.`;
  }
  return `Achieve ${topic} with a measurable outcome and clear deadline.`;
};

const buildMethod = (domain, topic) => {
  if (domain === "content") {
    return "Define one audience niche, publish on a fixed schedule, and improve each batch using retention and CTR feedback.";
  }

  if (domain === "study") {
    return "Map the syllabus, study in weekly blocks, solve practice sets, and review weak areas using test scores.";
  }

  if (domain === "business") {
    return "Validate demand quickly, prioritize high-impact tasks, track revenue metrics weekly, and iterate based on customer feedback.";
  }

  if (domain === "career") {
    return "Target a specific role, build proof of skill through projects, apply consistently, and refine based on interview feedback.";
  }

  if (domain === "fitness") {
    return "Combine a structured training split, nutrition targets, and weekly progress tracking to adjust intensity and diet.";
  }

  if (domain === "product") {
    return "Start from one core user problem, build an MVP milestone plan, ship in short cycles, and measure user outcomes.";
  }

  return `Break ${topic} into milestones, execute weekly deliverables, and adapt based on measurable results.`;
};

const buildSteps = (domain, topic, timeline) => {
  if (domain === "content") {
    return [
      "Define one content niche and a specific target viewer profile.",
      "Create a 4-week publishing calendar with topics, hooks, and scripts.",
      "Prepare production assets: template, recording setup, and thumbnail style.",
      "Publish on a fixed weekly schedule and keep format consistent.",
      "Review retention and click-through data each week and refine topics.",
    ];
  }

  if (domain === "study") {
    return [
      "Split the full syllabus into weekly chapters and set completion targets.",
      "Study in focused blocks and maintain daily revision notes.",
      "Solve timed practice questions after each topic.",
      "Run a weekly mock test and analyze accuracy and speed.",
      "Reallocate time toward weak subjects until scores stabilize.",
    ];
  }

  if (domain === "business") {
    return [
      "Define the customer segment and one urgent problem to solve.",
      "Validate demand with interviews or pre-sales before building deeply.",
      "Design an offer, pricing, and a basic acquisition channel.",
      "Launch a minimum service or product and track conversion metrics.",
      "Iterate weekly using customer objections and retention signals.",
    ];
  }

  if (domain === "career") {
    return [
      "Choose a target job role and list required skill gaps.",
      "Build two portfolio projects that match real job requirements.",
      "Optimize resume and LinkedIn using role-specific keywords.",
      "Apply to a fixed number of relevant roles every week.",
      "Run interview prep sessions and improve based on feedback.",
    ];
  }

  if (domain === "fitness") {
    return [
      "Set baseline metrics: weight, measurements, strength, and activity.",
      "Follow a weekly workout split aligned to your goal.",
      "Set calorie and protein targets and track meals daily.",
      "Log workouts and recovery to prevent overtraining.",
      "Review progress weekly and adjust load or nutrition.",
    ];
  }

  if (domain === "product") {
    return [
      "Define one user problem and the smallest useful solution.",
      "List MVP features and cut anything not needed for first release.",
      "Build and test the MVP with 5 to 10 target users.",
      "Ship an initial version and capture usage and feedback data.",
      "Prioritize the next iteration based on user impact.",
    ];
  }

  return [
    `Define the exact outcome for ${topic} and who it helps.`,
    "List resources, constraints, and skills required.",
    "Split work into weekly milestones with clear outputs.",
    "Start execution with one milestone in the next 48 hours.",
    timeline
      ? `Review progress each week and align with ${timeline}.`
      : "Review progress each week and refine the next milestone.",
  ];
};

const buildActionSteps = (domain, topic, timeline) => {
  const base = [
    `Rewrite ${topic} into one measurable target with a date.`,
    "Create a resource list with exact tools, budget, and weekly hours.",
    "Block next 7 days of execution tasks on your calendar.",
    "Ship one visible output in the next 48 hours.",
    "Track one execution metric and one outcome metric weekly.",
    "Run a weekly review and update next week's priorities.",
  ];

  if (domain === "content") {
    return [
      "Write 10 content ideas with audience pain points and outcomes.",
      "Script and record your first 2 pieces this week.",
      "Design a repeatable title and thumbnail framework.",
      "Publish on fixed days and collect CTR and retention data.",
      "Review top-performing topic and create 3 follow-up pieces.",
      timeline
        ? `Set a performance checkpoint for ${timeline}.`
        : "Set a 30-day checkpoint for consistency and growth.",
    ];
  }

  if (domain === "study") {
    return [
      "Create a chapter tracker with completion and revision columns.",
      "Schedule daily deep-study blocks for the next 14 days.",
      "Take one timed practice set every 2 days.",
      "Log errors by topic and revise from the error log.",
      timeline
        ? `Set mock-test targets leading up to ${timeline}.`
        : "Set a weekly score target and track trend.",
      "Do a Sunday review to rebalance weak topics.",
    ];
  }

  return timeline
    ? [...base, `Set milestone checkpoints until ${timeline}.`]
    : base;
};

const deriveMissingElements = (idea, timeline, steps) => {
  const text = idea.toLowerCase();
  const resourceKeywordSignal =
    /\b(budget|money|tool|tools|team|time|skill|skills|resource|resources|equipment|book|books|series|software|laptop|camera|coaching|material|materials|subscription)\b/i.test(
      text,
    );
  const budgetAmountSignal =
    /(₹|\$|\binr\b|\brs\b|\busd\b)\s*\d+|\b\d+[\d,]*\s*(rupees|inr|rs|usd|dollars)\b/i.test(
      text,
    );
  const timeCommitmentSignal =
    /\b\d+\s*(hour|hours|hr|hrs)\s*(\/|per)?\s*(day|week|month)?\b/i.test(text);

  const hasGoalSignal =
    /\b(want|goal|aim|plan|start|build|launch|create)\b/i.test(text);
  const hasStepSignal =
    /\b(first|then|next|after|step|process|strategy)\b/i.test(text);
  const hasResourceSignal =
    resourceKeywordSignal || budgetAmountSignal || timeCommitmentSignal;

  const stepsMissing =
    !hasStepSignal && (!Array.isArray(steps) || steps.length === 0);

  return {
    goal_clarity: {
      missing: !hasGoalSignal,
      insight: !hasGoalSignal
        ? "Goal is too vague. Add a measurable outcome and target date."
        : "Goal is present. Improve it further by adding a numeric success metric.",
    },
    steps_missing: {
      missing: stepsMissing,
      insight: stepsMissing
        ? "Execution path is unclear. Add milestone-based steps with sequence and ownership."
        : "Execution steps exist. Improve by adding deadlines and measurable outputs per step.",
    },
    resources_missing: {
      missing: !hasResourceSignal,
      insight: !hasResourceSignal
        ? "Resources are not defined. Specify budget, tools, skills, and support needed."
        : "Resources are partially defined. Add exact budget/tools to reduce execution risk.",
    },
    timeline_missing: {
      missing: !timeline,
      insight: !timeline
        ? "Timeline is missing. Add start date, review checkpoints, and final deadline."
        : "Timeline exists. Add clear milestones (weekly or monthly checkpoints).",
    },
  };
};

const deriveCompleteness = (missingElements) => {
  const missingCount = Object.values(missingElements).filter(
    (item) => item?.missing,
  ).length;
  if (missingCount <= 1) return "high";
  if (missingCount <= 2) return "medium";
  return "low";
};

export const buildFallbackNormalizedPlan = (idea) => {
  const trimmedIdea = idea.trim();
  const timeline = detectTimeline(trimmedIdea);
  const domain = detectDomain(trimmedIdea);
  const topic = extractTopic(trimmedIdea);
  const steps = buildSteps(domain, topic, timeline);
  const missing_elements = deriveMissingElements(trimmedIdea, timeline, steps);

  return {
    goal: detectGoal(trimmedIdea, topic, timeline),
    method: buildMethod(domain, topic),
    steps,
    timeline,
    missing_elements,
    simplified_version: firstMeaningfulSentence(trimmedIdea),
    action_steps: buildActionSteps(domain, topic, timeline).slice(0, 8),
    overall_completeness: deriveCompleteness(missing_elements),
  };
};
