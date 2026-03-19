import Analysis from "../models/Analysis.js";
import mongoose from "mongoose";
import { getStructuredPlanFromLLM } from "../services/geminiService.js";
import { buildFallbackNormalizedPlan } from "../services/fallbackAnalyzerService.js";
import {
  formatPlanResponse,
  parseAndNormalizeModelOutput,
} from "../services/planFormatter.js";

const isQuotaOrRateLimitError = (error) => {
  const message = (error?.message || "").toLowerCase();
  return (
    message.includes("429") ||
    message.includes("quota") ||
    message.includes("too many requests") ||
    message.includes("rate limit")
  );
};

export const analyzeIdea = async (req, res, next) => {
  try {
    const { idea } = req.body;

    if (!idea || typeof idea !== "string" || !idea.trim()) {
      return res
        .status(400)
        .json({ error: "'idea' is required and must be a non-empty string." });
    }

    let normalized;

    try {
      const llmRaw = await getStructuredPlanFromLLM(idea.trim());
      normalized = parseAndNormalizeModelOutput(llmRaw);
    } catch (error) {
      if (isQuotaOrRateLimitError(error)) {
        normalized = buildFallbackNormalizedPlan(idea.trim());
      } else {
        throw error;
      }
    }

    const result = formatPlanResponse(idea.trim(), normalized);

    if (process.env.MONGODB_URI && mongoose.connection.readyState === 1) {
      await Analysis.create({
        userInput: idea.trim(),
        aiOutput: result,
      });
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
