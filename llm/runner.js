#!/usr/bin/env node

/* eslint-disable no-undef */

/**
 * Security Analysis Runner Script
 * Provides an interactive CLI for analyzing security files with LangChain + Ollama
 *
 * Usage:
 *   node llm/runner.js [file-path]
 *   node llm/runner.js --interactive
 *   node llm/runner.js --help
 */

import fs from "fs";
import path from "path";
import readline from "readline";
import analyzeSecurityFile from "./analyzeWithOllama.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function validateFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return { valid: false, error: `File not found: ${filePath}` };
    }

    const ext = path.extname(filePath).toLowerCase();
    if (![".json", ".csv", ".txt"].includes(ext)) {
      return {
        valid: false,
        error: `Unsupported file format: ${ext}. Use JSON, CSV, or TXT.`,
      };
    }

    const stats = fs.statSync(filePath);
    if (stats.size === 0) {
      return { valid: false, error: "File is empty" };
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

async function interactiveMode() {
  console.log("\n🔐 Security Analysis Tool - Interactive Mode\n");

  // Get file path
  let filePath;
  let validation;
  do {
    filePath = await question("📂 Enter path to security file: ");
    validation = await validateFile(filePath);
    if (!validation.valid) {
      console.error(`❌ ${validation.error}`);
    }
  } while (!validation.valid);

  // Get Ollama URL (with default)
  const urlInput = await question(
    `🌐 Ollama base URL (${process.env.OLLAMA_BASE_URL || "http://localhost:11434"}): `,
  );
  const ollamaBaseUrl =
    urlInput || process.env.OLLAMA_BASE_URL || "http://localhost:11434";

  // Get model (with default)
  const modelInput = await question(
    `🤖 LLM model (${process.env.OLLAMA_MODEL || "llama2"}): `,
  );
  const model = modelInput || process.env.OLLAMA_MODEL || "llama2";

  // Get VirusTotal API key (optional)
  let virusTotalApiKey = process.env.VIRUSTOTAL_API_KEY;
  if (!virusTotalApiKey) {
    const keyInput = await question(
      "🔑 VirusTotal API key (optional, press Enter to skip): ",
    );
    virusTotalApiKey = keyInput || null;
  }

  rl.close();

  // Start analysis
  console.log("\n" + "=".repeat(60));
  console.log("Starting Security Analysis...");
  console.log("=".repeat(60));

  try {
    const result = await analyzeSecurityFile(filePath, {
      ollamaBaseUrl,
      model,
      virusTotalApiKey,
    });

    // Display results
    console.log("\n" + "=".repeat(60));
    console.log("ANALYSIS COMPLETE");
    console.log("=".repeat(60));

    const output = {
      timestamp: result.timestamp,
      file: result.file_path,
      ips_found: result.analysis.ips_found,
      threat_assessment: result.analysis.ip_threat_assessment,
      summary: result.analysis.overall_summary,
    };

    console.log(JSON.stringify(output, null, 2));

    // Save results to file
    const outputFileName = `analysis_${Date.now()}.json`;
    fs.writeFileSync(outputFileName, JSON.stringify(result, null, 2));
    console.log(`\n✅ Full results saved to: ${outputFileName}`);
  } catch (error) {
    console.error("❌ Analysis failed:", error.message);
    process.exit(1);
  }
}

async function directAnalysis(filePath) {
  const validation = await validateFile(filePath);
  if (!validation.valid) {
    console.error(`❌ ${validation.error}`);
    process.exit(1);
  }

  console.log("\n🔐 Security Analysis Tool\n");
  console.log("Configuration:");
  console.log(`  File: ${filePath}`);
  console.log(
    `  Ollama URL: ${process.env.OLLAMA_BASE_URL || "http://localhost:11434"}`,
  );
  console.log(`  Model: ${process.env.OLLAMA_MODEL || "llama2"}`);
  console.log(
    `  VirusTotal: ${process.env.VIRUSTOTAL_API_KEY ? "✅ Configured" : "❌ Not configured"}`,
  );

  console.log("\n" + "=".repeat(60));
  console.log("Starting Security Analysis...");
  console.log("=".repeat(60));

  try {
    const result = await analyzeSecurityFile(filePath, {
      ollamaBaseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
      model: process.env.OLLAMA_MODEL || "llama2",
      virusTotalApiKey: process.env.VIRUSTOTAL_API_KEY,
    });

    // Display results
    console.log("\n" + "=".repeat(60));
    console.log("ANALYSIS COMPLETE");
    console.log("=".repeat(60));

    const output = {
      timestamp: result.timestamp,
      file: result.file_path,
      ips_found: result.analysis.ips_found,
      threat_assessment: result.analysis.ip_threat_assessment,
      summary: result.analysis.overall_summary,
    };

    console.log(JSON.stringify(output, null, 2));

    // Save results to file
    const outputFileName = `analysis_${Date.now()}.json`;
    fs.writeFileSync(outputFileName, JSON.stringify(result, null, 2));
    console.log(`\n✅ Full results saved to: ${outputFileName}`);
  } catch (error) {
    console.error("❌ Analysis failed:", error.message);
    process.exit(1);
  }
}

function showHelp() {
  console.log(`
🔐 Security Analysis Tool with LangChain & Ollama

Usage:
  node llm/runner.js [file-path]       Run analysis on a specific file
  node llm/runner.js --interactive     Interactive mode
  node llm/runner.js --help           Show this help message

Supported Formats:
  - JSON files (with embedded IP addresses)
  - CSV files (with IP columns)
  - TXT files (plain text with IP addresses)

Environment Variables:
  VIRUSTOTAL_API_KEY                  VirusTotal API key for IP validation
  OLLAMA_BASE_URL                     Ollama server URL (default: http://localhost:11434)
  OLLAMA_MODEL                        LLM model to use (default: llama2)

Examples:
  node llm/runner.js ./security-data.json
  node llm/runner.js --interactive
  OLLAMA_MODEL=mistral node llm/runner.js ./alerts.csv

Prerequisites:
  1. Ollama running: ollama serve
  2. Model installed: ollama pull llama2
  3. VirusTotal API key (optional): Get from https://www.virustotal.com

For more information, see llm/README.md
`);
}

// Main entry point
const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  showHelp();
} else if (args.includes("--interactive") || args.includes("-i")) {
  interactiveMode().catch((error) => {
    console.error("Error:", error.message);
    process.exit(1);
  });
} else if (args.length > 0) {
  directAnalysis(args[0]).catch((error) => {
    console.error("Error:", error.message);
    process.exit(1);
  });
} else {
  showHelp();
  process.exit(1);
}
