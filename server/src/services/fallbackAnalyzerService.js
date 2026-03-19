const splitSentences = (text) =>
  text
    .split(/[.!?\n]+/)
    .map((part) => part.trim())
    .filter(Boolean);

const firstMeaningfulSentence = (idea) =>
  splitSentences(idea)[0] || idea.trim();

const detectTimeline = (idea) => {
  const timelineRegex =
    /\b(\d+\s*(day|days|week|weeks|month|months|year|years)|daily|weekly|monthly|by\s+\w+|in\s+\d+\s*(day|days|week|weeks|month|months))\b/i;
  const match = idea.match(timelineRegex);
  return match ? match[0] : "";
};

const detectGoal = (idea) => {
  const lower = idea.toLowerCase();

  if (lower.includes("youtube")) {
    return "Build and grow a YouTube channel with a clear monetization path.";
  }

  if (lower.includes("business")) {
    return "Define and launch a viable business plan with measurable milestones.";
  }

  return firstMeaningfulSentence(idea);
};

const buildMethod = (idea) => {
  const lower = idea.toLowerCase();

  if (lower.includes("youtube")) {
    return "Choose a focused niche, publish consistently, optimize content quality, and use analytics to improve execution.";
  }

  return "Break the goal into small milestones, execute consistently, track outcomes, and adjust based on feedback.";
};

const buildSteps = (idea) => {
  const lower = idea.toLowerCase();

  if (lower.includes("youtube")) {
    return [
      "Pick one niche and define your audience persona.",
      "Create a 4-week content plan with at least 8 video ideas.",
      "Set up channel branding and content templates.",
      "Publish two videos per week with clear titles and thumbnails.",
      "Review analytics weekly and improve the next batch of content.",
    ];
  }

  return [
    "Define the exact outcome you want to achieve.",
    "List required resources, skills, and constraints.",
    "Break the work into 3-5 execution milestones.",
    "Assign weekly tasks to each milestone.",
    "Review progress weekly and refine your approach.",
  ];
};

const buildActionSteps = (idea, timeline) => {
  const base = [
    "Define one measurable target (number + date) for this plan.",
    "List required resources with exact budget, tools, and time commitment.",
    "Break the plan into weekly tasks and assign due dates in your calendar.",
    "Deliver the first concrete output within the next 48 hours.",
    "Track 1-2 execution metrics every week in a simple sheet.",
    "Run a weekly review and update next week's tasks based on results.",
  ];

  if (idea.toLowerCase().includes("youtube")) {
    return [
      "Choose one niche and define your target audience today.",
      "Write 8 video topics and scripts for the next 4 weeks.",
      "Design a simple thumbnail/title template for consistency.",
      "Publish your first two videos this week.",
      "Track click-through rate and audience retention for each upload.",
      "Improve topic selection based on your top-performing video.",
      timeline
        ? `Set a checkpoint using timeline: ${timeline}.`
        : "Set a 30-day checkpoint to evaluate growth and refine strategy.",
    ];
  }

  return base;
};

const deriveMissingElements = (idea, timeline, steps) => {
  const text = idea.toLowerCase();
  const hasGoalSignal =
    /\b(want|goal|aim|plan|start|build|launch|create)\b/i.test(text);
  const hasStepSignal =
    /\b(first|then|next|after|step|process|strategy)\b/i.test(text);
  const hasResourceSignal =
    /\b(budget|money|tool|team|time|skill|resource|equipment)\b/i.test(text);

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
  const steps = buildSteps(trimmedIdea);
  const missing_elements = deriveMissingElements(trimmedIdea, timeline, steps);

  return {
    goal: detectGoal(trimmedIdea),
    method: buildMethod(trimmedIdea),
    steps,
    timeline,
    missing_elements,
    simplified_version: firstMeaningfulSentence(trimmedIdea),
    action_steps: buildActionSteps(trimmedIdea, timeline).slice(0, 8),
    overall_completeness: deriveCompleteness(missing_elements),
  };
};
