/* eslint-disable no-undef */

/**
 * Advanced Integration Examples
 * Shows how to use the security analysis tool in different contexts
 */

import analyzeSecurityFile, { VirusTotalTool } from "./analyzeWithOllama.js";
import { ChatOllama } from "@langchain/ollama";
import fs from "fs";

/**
 * Example 1: Simple File Analysis
 * Analyzes a security file and logs the results
 */
export async function example1_SimpleAnalysis() {
  console.log("Example 1: Simple File Analysis\n");

  try {
    const result = await analyzeSecurityFile("./sample-security-data.json", {
      ollamaBaseUrl: "http://localhost:11434",
      model: "llama2",
      virusTotalApiKey: process.env.TOTAL_VIRUS_API_KEY,
    });

    console.log("Analysis Results:");
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error:", error.message);
  }
}

/**
 * Example 2: Batch Analysis
 * Analyzes multiple security files and aggregates results
 */
export async function example2_BatchAnalysis(fileList) {
  console.log("Example 2: Batch Analysis\n");

  const allResults = [];

  for (const file of fileList) {
    try {
      console.log(`Analyzing: ${file}...`);
      const result = await analyzeSecurityFile(file, {
        ollamaBaseUrl: "http://localhost:11434",
        model: "llama2",
        virusTotalApiKey: process.env.TOTAL_VIRUS_API_KEY,
      });
      allResults.push(result);
    } catch (error) {
      console.error(`Failed to analyze ${file}:`, error.message);
    }
  }

  // Save aggregated results
  const aggregated = {
    total_files_analyzed: allResults.length,
    total_ips: allResults.reduce((sum, r) => sum + r.analysis.ips_found, 0),
    results: allResults,
  };

  fs.writeFileSync(
    "batch_analysis_result.json",
    JSON.stringify(aggregated, null, 2),
  );
  console.log("Batch analysis saved to: batch_analysis_result.json");
}

/**
 * Example 3: Custom LLM Analysis
 * Uses custom prompts with the LLM
 */
export async function example3_CustomAnalysis() {
  console.log("Example 3: Custom LLM Analysis\n");

  const llm = new ChatOllama({
    baseUrl: "http://localhost:11434",
    model: "llama2",
    temperature: 0.3,
  });

  const customPrompt = `
You are a cybersecurity threat intelligence analyst. 

Given this list of suspicious IP addresses, provide:
1. A risk assessment for each IP
2. Potential attack vectors
3. Recommended defensive measures
4. Whether these IPs appear to be coordinated attacks

IPs: 45.142.182.99, 203.0.113.42, 198.51.100.5

Format your response as a detailed threat report.`;

  const messages = [{ role: "user", content: customPrompt }];

  try {
    const response = await llm.invoke(messages);
    console.log("LLM Response:");
    console.log(response.content);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

/**
 * Example 4: Tool-Only IP Validation
 * Uses just the VirusTotal tool without full analysis
 */
export async function example4_IPValidationOnly() {
  console.log("Example 4: IP Validation Only\n");

  const apiKey = process.env.TOTAL_VIRUS_API_KEY;
  if (!apiKey) {
    console.error("VirusTotal API key not configured");
    return;
  }

  const tool = new VirusTotalTool(apiKey);

  const ips = ["1.1.1.1", "8.8.8.8", "45.142.182.99", "203.0.113.42"];

  try {
    const results = await tool._call(ips);
    console.log("VirusTotal Analysis:");
    console.log(JSON.stringify(JSON.parse(results), null, 2));
  } catch (error) {
    console.error("Error:", error.message);
  }
}

/**
 * Example 5: Real-time Security Monitoring
 * Continuous monitoring with periodic analysis
 */
export async function example5_ContinuousMonitoring(
  filePath,
  intervalSeconds = 30,
) {
  console.log(
    `Example 5: Continuous Monitoring (${intervalSeconds}s intervals)\n`,
  );

  let lastModified = 0;
  let analysisCount = 0;

  const checkAndAnalyze = async () => {
    try {
      const stats = fs.statSync(filePath);
      const currentModified = stats.mtimeMs;

      if (currentModified > lastModified) {
        analysisCount++;
        console.log(
          `\n[${new Date().toISOString()}] File changed, running analysis #${analysisCount}...`,
        );

        const result = await analyzeSecurityFile(filePath, {
          ollamaBaseUrl: "http://localhost:11434",
          model: "llama2",
          virusTotalApiKey: process.env.TOTAL_VIRUS_API_KEY,
        });

        console.log(`  - Found ${result.analysis.ips_found} IPs`);
        console.log(
          `  - Summary: ${result.analysis.overall_summary.substring(0, 100)}...`,
        );

        lastModified = currentModified;
      }
    } catch (error) {
      console.error("Monitoring error:", error.message);
    }
  };

  console.log(`Starting continuous monitoring of: ${filePath}`);
  console.log(`Checking every ${intervalSeconds} seconds...`);
  console.log("Press Ctrl+C to stop\n");

  // Run analysis every intervalSeconds
  setInterval(checkAndAnalyze, intervalSeconds * 1000);

  // Initial check
  await checkAndAnalyze();
}

/**
 * Example 6: Export Analysis Results
 * Saves analysis to different formats
 */
export async function example6_ExportResults() {
  console.log("Example 6: Export Results\n");

  try {
    const result = await analyzeSecurityFile("./sample-security-data.json", {
      ollamaBaseUrl: "http://localhost:11434",
      model: "llama2",
      virusTotalApiKey: process.env.TOTAL_VIRUS_API_KEY,
    });

    // Export to JSON
    fs.writeFileSync("analysis_export.json", JSON.stringify(result, null, 2));
    console.log("✅ Exported to JSON: analysis_export.json");

    // Export to CSV
    const csvContent = [
      ["IP", "Threat Level", "Country", "VPN", "Proxy"],
      ...Object.entries(result.analysis.virustotal_analysis).map(
        ([ip, data]) => [
          ip,
          data.threat_level || "N/A",
          data.country || "N/A",
          data.is_vpn ? "Yes" : "No",
          data.is_proxy ? "Yes" : "No",
        ],
      ),
    ]
      .map((row) => row.join(","))
      .join("\n");

    fs.writeFileSync("analysis_export.csv", csvContent);
    console.log("✅ Exported to CSV: analysis_export.csv");

    // Export to markdown report
    const markdown = `
# Security Analysis Report

**Generated:** ${result.timestamp}  
**File:** ${result.file_path}

## Summary
IPs Found: ${result.analysis.ips_found}

## IP Threat Assessment
${result.analysis.ip_threat_assessment}

## Overall Summary
${result.analysis.overall_summary}

## Raw Data
\`\`\`json
${JSON.stringify(result, null, 2)}
\`\`\`
`;

    fs.writeFileSync("analysis_export.md", markdown);
    console.log("✅ Exported to Markdown: analysis_export.md");
  } catch (error) {
    console.error("Export error:", error.message);
  }
}

/**
 * Example 7: Alert-Based Analysis
 * Analyzes only high-priority alerts
 */
export async function example7_AlertBasedAnalysis(filePath) {
  console.log("Example 7: Alert-Based Analysis\n");

  try {
    // Read and filter high-priority alerts
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(fileContent);

    // Filter for high/critical severity
    const criticalAlerts = data.alerts.filter((alert) =>
      ["high", "critical"].includes(alert.severity),
    );

    console.log(`Total alerts: ${data.alerts.length}`);
    console.log(`Critical alerts: ${criticalAlerts.length}`);

    // Create temporary file with critical alerts only
    const tempFile = "temp_critical_alerts.json";
    fs.writeFileSync(
      tempFile,
      JSON.stringify({ alerts: criticalAlerts }, null, 2),
    );

    // Analyze
    const result = await analyzeSecurityFile(tempFile, {
      ollamaBaseUrl: "http://localhost:11434",
      model: "llama2",
      virusTotalApiKey: process.env.TOTAL_VIRUS_API_KEY,
    });

    console.log("\nCritical Alert Analysis:");
    console.log(result.analysis.overall_summary);

    // Cleanup
    fs.unlinkSync(tempFile);
  } catch (error) {
    console.error("Analysis error:", error.message);
  }
}

// Demo runner
if (import.meta.url === `file://${process.argv[1]}`) {
  const example = process.argv[2] || "1";

  console.log("🔐 Security Analysis - Advanced Examples\n");
  console.log(`Running Example ${example}...\n`);

  switch (example) {
    case "1":
      example1_SimpleAnalysis();
      break;
    case "2":
      example2_BatchAnalysis([
        "./sample-security-data.json",
        "./sample-security-data.json",
      ]);
      break;
    case "3":
      example3_CustomAnalysis();
      break;
    case "4":
      example4_IPValidationOnly();
      break;
    case "5":
      example5_ContinuousMonitoring("./sample-security-data.json", 10);
      break;
    case "6":
      example6_ExportResults();
      break;
    case "7":
      example7_AlertBasedAnalysis("./sample-security-data.json");
      break;
    default:
      console.log("Examples 1-7 available. Usage: node llm/examples.js [1-7]");
  }
}

export default {
  example1_SimpleAnalysis,
  example2_BatchAnalysis,
  example3_CustomAnalysis,
  example4_IPValidationOnly,
  example5_ContinuousMonitoring,
  example6_ExportResults,
  example7_AlertBasedAnalysis,
};
