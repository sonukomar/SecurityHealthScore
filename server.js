/* eslint-disable no-undef */
import express from "express";
import dotenv from "dotenv";
// import { createValidator } from "./src/services/virustotal.js";
import analyzeSecurityFile from "./llm/analyzeWithOllama.js";

// load environment variables; this belongs only on the server side
dotenv.config();

// // construct the IP-checking function using the API key from .env
// const validateIps = createValidator(process.env.TOTAL_VIRUS_API_KEY);
// const modelName = process.env.MODEL_NAME;
// const llmUrl = process.env.LLM_URL;

const app = express();
app.use(express.json());

const modelName = process.env.MODEL_NAME;
const ollamaBaseUrl = process.env.LLM_URL;
const virusTotalApiKey = process.env.TOTAL_VIRUS_API_KEY;

/**
 * simple health check
 */
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

/**
 * POST /api/check-ips
 * body: { ips: ['1.2.3.4', '8.8.8.8'] }
 * Returns an object keyed by IP with the VT report or error info.
 */
app.post("/api/check-ips", async (req, res) => {
  const { ips } = req.body;
  if (!Array.isArray(ips)) {
    return res
      .status(400)
      .json({ error: "request body must include ips array" });
  }

  try {
    const result = await validateIps(ips);
    res.json(result);
  } catch (err) {
    console.error("error in /api/check-ips", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/analyze", async (req, res) => {
  try {
    const data = await analyzeSecurityFile("./sample-security-data.json", {
      ollamaBaseUrl: ollamaBaseUrl,
      model: modelName,
      virusTotalApiKey: virusTotalApiKey,
    });
    console.log("analysis result:", data);
    res.json({ analysis: data });
  } catch (err) {
    console.error("error in /analyze", err);
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.API_PORT || 3000;
app.listen(port, () => {
  console.log(`virus-total service listening on http://localhost:${port}`);
});
