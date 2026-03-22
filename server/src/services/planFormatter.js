const extractJsonObject = (text) => {
  if (typeof text !== "string") {
    throw new Error("Invalid model response type.");
  }

  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("Could not find JSON object in model response.");
  }

  return text.slice(firstBrace, lastBrace + 1);
};

const toStringOrEmpty = (value) =>
  typeof value === "string" ? value.trim() : "";

const toStringArray = (value) => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
};

const toBoolean = (value, fallback = true) => {
  if (typeof value === "boolean") return value;
  return fallback;
};

const toMissingItem = (value, fallbackMissing = true, fallbackInsight = "") => {
  if (typeof value === "boolean") {
    return {
      missing: value,
      insight: fallbackInsight,
    };
  }

  if (value && typeof value === "object") {
    return {
      missing: toBoolean(value.missing, fallbackMissing),
      insight: toStringOrEmpty(value.insight) || fallbackInsight,
    };
  }

  return {
    missing: fallbackMissing,
    insight: fallbackInsight,
  };
};

export const parseAndNormalizeModelOutput = (rawText) => {
  const jsonText = extractJsonObject(rawText);

  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error("Model returned invalid JSON. Please try again.");
  }

  const normalized = {
    goal: toStringOrEmpty(parsed.goal),
    method: toStringOrEmpty(parsed.method),
    steps: toStringArray(parsed.steps),
    timeline: toStringOrEmpty(parsed.timeline),
    missing_elements: {
      goal_clarity: toMissingItem(
        parsed?.missing_elements?.goal_clarity,
        true,
        "Clarify your goal with a measurable target.",
      ),
      steps_missing: toMissingItem(
        parsed?.missing_elements?.steps_missing,
        true,
        "Add practical execution steps with order and deadlines.",
      ),
      resources_missing: toMissingItem(
        parsed?.missing_elements?.resources_missing,
        true,
        "List resources such as time, budget, tools, and skills.",
      ),
      timeline_missing: toMissingItem(
        parsed?.missing_elements?.timeline_missing,
        true,
        "Define a timeline with checkpoints and deadline.",
      ),
    },
    simplified_version: toStringOrEmpty(parsed.simplified_version),
    action_steps: toStringArray(parsed.action_steps).slice(0, 8),
    overall_completeness: toStringOrEmpty(
      parsed.overall_completeness,
    ).toLowerCase(),
  };

  if (!normalized.action_steps.length && normalized.steps.length) {
    normalized.action_steps = normalized.steps.slice(0, 8);
  }

  return normalized;
};

const calculateCompletenessPoints = ({
  goal,
  method,
  steps,
  timeline,
  missing_elements,
  overall_completeness,
}) => {
  let points;

  if (overall_completeness === "high") points = 25;
  else if (overall_completeness === "medium") points = 15;
  else if (overall_completeness === "low") points = 5;
  else {
    const checks = [
      Boolean(goal),
      Boolean(method),
      steps.length >= 3,
      Boolean(timeline),
      missing_elements.resources_missing?.missing === false,
    ];

    const passed = checks.filter(Boolean).length;
    points = Math.round((passed / checks.length) * 25);
  }

  // Missing elements should reduce completeness even if model marks overall as high.
  const missingCount = Object.values(missing_elements || {}).filter(
    (item) => item?.missing,
  ).length;

  if (missingCount >= 2) {
    points = Math.min(points, 5);
  } else if (missingCount === 1) {
    points = Math.min(points, 20);
  }

  if (missing_elements?.resources_missing?.missing) {
    points = Math.min(points, 10);
  }

  return Math.max(0, points);
};

const buildScoreReason = (scoreBreakdown, total) => {
  const details = [
    `Goal defined: ${scoreBreakdown.goal}/25`,
    `Steps present: ${scoreBreakdown.steps}/25`,
    `Timeline present: ${scoreBreakdown.timeline}/25`,
    `Overall completeness: ${scoreBreakdown.completeness}/25`,
  ];

  return `Clarity score is ${total}/100. ` + details.join(" | ");
};

export const formatPlanResponse = (idea, normalized) => {
  const scoreBreakdown = {
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
    completeness: calculateCompletenessPoints(normalized),
  };

  const totalScore = Object.values(scoreBreakdown).reduce(
    (sum, value) => sum + value,
    0,
  );

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
      score: totalScore,
      breakdown: scoreBreakdown,
      reason: buildScoreReason(scoreBreakdown, totalScore),
    },
    generated_at: new Date().toISOString(),
  };
};
