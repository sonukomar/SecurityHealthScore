/* eslint-disable no-undef */
import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import cors from "cors";

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

// Configure CORS for your client's origin
app.use(
  cors({
    origin: "http://localhost:5173", // Match the origin of your app
    credentials: true, // Important for sessions/cookies if you use them
  }),
);

const modelName = process.env.MODEL_NAME;
const ollamaBaseUrl = process.env.LLM_URL;
const virusTotalApiKey = process.env.TOTAL_VIRUS_API_KEY;

// Store connected clients
const clients = new Set();

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

app.post("/api/save", async (req, res) => {
  const { activity, tracking } = req.body;
  try {
    const data = { ...activity, ...tracking };
    console.log("Received data for analysis:", data);
    fs.writeFile("./data-for-analysis.json", JSON.stringify(data), (err) => {
      if (err) {
        console.error("Error writing to file:", err);
        return;
      }
      console.log("Data written to file successfully.");
      sendReloadEvent();
      res.status(200).json({ message: "Data received and saved for analysis" });
    });
  } catch (err) {
    console.error("error in /api/check-urls", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/analyze", async (req, res) => {
  try {
    const data = await analyzeSecurityFile("./data-for-analysis.json", {
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

app.get("/events", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  // Add this client
  clients.add(res);

  // Remove client when they disconnect
  req.on("close", () => {
    clients.delete(res);
  });
});

// Helper to broadcast to all connected clients
const sendReloadEvent = () => {
  clients.forEach((res) => {
    res.write("event: reload\n");
    res.write("data: Data updated, please reload\n\n");
  });
};

// Start the server
const port = process.env.API_PORT || 3000;
app.listen(port, () => {
  console.log(`virus-total service listening on http://localhost:${port}`);
});
