const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const buildAnalyzeUrl = () => {
  if (API_BASE_URL) {
    return `${API_BASE_URL.replace(/\/$/, "")}/analyze`;
  }

  return "/api/analyze";
};

export const analyzePlan = async (idea) => {
  const response = await fetch(buildAnalyzeUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idea }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to analyze plan.");
  }

  return data;
};
