const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const analyzePlan = async (idea) => {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
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
