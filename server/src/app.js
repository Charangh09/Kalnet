import "dotenv/config";
import cors from "cors";
import express from "express";
import analyzeRoutes from "./routes/analyzeRoutes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "*",
  }),
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/analyze", analyzeRoutes);

app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  const message = err.message || "Internal server error";

  res.status(status).json({
    error: message,
  });
});

export default app;
