import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildAnalysisPrompt } from "./promptService.js";

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    const error = new Error(
      "GEMINI_API_KEY is missing. Add it to server/.env.",
    );
    error.status = 500;
    throw error;
  }

  return new GoogleGenerativeAI(apiKey);
};

export const getStructuredPlanFromLLM = async (idea) => {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
  });

  const prompt = buildAnalysisPrompt(idea);
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};
