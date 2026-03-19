export const buildAnalysisPrompt = (userIdea) => {
  return `SYSTEM:
You are an expert planning assistant. Convert vague ideas into structured actionable plans.

TASK:
Analyze the user input and return STRICT JSON only.

USER INPUT:
${userIdea}

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
- Return valid JSON only (no markdown, no commentary).
- Keep response concise, practical, and implementation-focused.
- Make steps specific to the user's idea and domain.
- Avoid generic planning advice (no vague tips like "stay consistent" without context).
- Every step and action should be real-world and executable.
- Provide domain-relevant actions, tools, channels, or resources where appropriate.
- Use 5 to 8 items for action_steps.
- In missing_elements, always return both:
  - missing: boolean (true = missing/unclear)
  - insight: short practical explanation of what is missing and how to improve it.
- If timeline is not explicitly present, set timeline to empty string and timeline_missing to true.
- Do not include any extra keys beyond the schema.
`;
};
