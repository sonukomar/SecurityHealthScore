/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import fs from "fs";
import path from "path";
import { ChatOllama } from "@langchain/ollama";
import { Tool } from "@langchain/core/tools";
import { createValidator } from "../src/services/virustotal.js";

/**
 * VirusTotal IP Validation Tool
 * Validates IPs against VirusTotal database
 */
class VirusTotalTool extends Tool {
  constructor(apiKey) {
    super();
    this.name = "virustotal_ip_checker";
    this.description =
      "Validates IP addresses against VirusTotal database to check for malicious activity. Returns threat analysis and detection information.";
    this.validator = createValidator(apiKey);
  }

  async _call(ipInput) {
    try {
      // Parse input - could be single IP or JSON array
      let ips = [];
      if (typeof ipInput === "string") {
        try {
          const parsed = JSON.parse(ipInput);
          ips = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          ips = ipInput.split(",").map((ip) => ip.trim());
        }
      } else if (Array.isArray(ipInput)) {
        ips = ipInput;
      } else {
        ips = [String(ipInput)];
      }

      // Validate and filter IPs
      const validIps = ips.filter(
        (ip) =>
          /^(\d{1,3}\.){3}\d{1,3}$/.test(ip) &&
          ip
            .split(".")
            .every((octet) => parseInt(octet) <= 255 && parseInt(octet) >= 0),
      );

      if (validIps.length === 0) {
        return JSON.stringify({
          error: "No valid IPs provided",
          input: ipInput,
        });
      }

      const results = await this.validator(validIps);

      // Extract threat information from VirusTotal response
      const analysis = {};
      for (const [ip, data] of Object.entries(results)) {
        if (data.error) {
          analysis[ip] = {
            status: "error",
            message: data.error,
          };
        } else if (data.data && data.data.attributes) {
          const attrs = data.data.attributes;
          analysis[ip] = {
            status: "analyzed",
            last_analysis_stats: attrs.last_analysis_stats || {},
            country: attrs.country || "Unknown",
            asn: attrs.asn || "Unknown",
            threat_level: calculateThreatLevel(attrs.last_analysis_stats),
            is_vpn: attrs.is_vpn || false,
            is_proxy: attrs.is_proxy || false,
          };
        }
      }

      return JSON.stringify(analysis, null, 2);
    } catch (error) {
      return JSON.stringify({
        error: `Tool execution failed: ${error.message}`,
      });
    }
  }
}

/**
 * Calculate threat level based on analysis stats
 */
function calculateThreatLevel(stats) {
  if (!stats) return "unknown";
  const malicious = stats.malicious || 0;
  const suspicious = stats.suspicious || 0;
  const total = (stats.undetected || 0) + malicious + suspicious;

  if (malicious > 0) return "critical";
  if (suspicious >= 2) return "high";
  if (suspicious === 1) return "medium";
  return "low";
}

/**
 * Read and parse local file containing security data
 * Supports JSON and CSV formats
 */
async function readSecurityFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const ext = path.extname(filePath).toLowerCase();

    let data;
    if (ext === ".json") {
      data = JSON.parse(content);
    } else if (ext === ".csv") {
      // Basic CSV parsing
      const lines = content.trim().split("\n");
      const headers = lines[0].split(",").map((h) => h.trim());
      data = lines.slice(1).map((line) => {
        const values = line.split(",").map((v) => v.trim());
        return headers.reduce((obj, header, idx) => {
          obj[header] = values[idx];
          return obj;
        }, {});
      });
    } else {
      // Treat as plain text lines
      data = content.split("\n").filter((line) => line.trim());
    }

    return data;
  } catch (error) {
    throw new Error(`Failed to read file ${filePath}: ${error.message}`);
  }
}

/**
 * Extract IPs from file data
 */
function extractIpsFromData(data) {
  const ips = new Set();
  const ipRegex = /\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/g;

  if (typeof data === "string") {
    const matches = data.match(ipRegex) || [];
    matches.forEach((ip) => ips.add(ip));
  } else if (Array.isArray(data)) {
    data.forEach((item) => {
      const str = JSON.stringify(item);
      const matches = str.match(ipRegex) || [];
      matches.forEach((ip) => ips.add(ip));
    });
  } else if (typeof data === "object") {
    const str = JSON.stringify(data);
    const matches = str.match(ipRegex) || [];
    matches.forEach((ip) => ips.add(ip));
  }

  return Array.from(ips);
}

/**
 * Main analysis function
 * Orchestrates file reading, IP extraction, LLM-based analysis, and summarization
 */
export async function analyzeSecurityFile(filePath, options = {}) {
  console.log(`\n🔐 Starting security analysis for file: ${filePath}`);
  const { ollamaBaseUrl, model, virusTotalApiKey } = options;

  console.log(`\n📂 Reading security file: ${filePath}`);

  // Step 1: Read file
  const fileData = await readSecurityFile(filePath);
  console.log(`✅ File loaded successfully`);

  // Step 2: Extract IPs
  const ips = extractIpsFromData(fileData);
  console.log(`\n🔍 Found ${ips.length} unique IP addresses`);
  console.log(`IPs: ${ips.join(", ")}`);

  // Step 3: Initialize LLM
  console.log(`\n🤖 Initializing Ollama LLM (${model})...`);
  const llm = new ChatOllama({
    baseUrl: ollamaBaseUrl,
    model,
    temperature: 0.3,
  });

  // Step 4: Create tools
  const virusTotalTool = virusTotalApiKey
    ? new VirusTotalTool(virusTotalApiKey)
    : null;

  if (!virusTotalApiKey) {
    console.warn(
      "⚠️  VirusTotal API key not configured. Skipping IP validation.",
    );
  }

  // Step 5: Analyze IPs with VirusTotal
  let ipAnalysisResults = {};
  if (virusTotalTool) {
    console.log(`\n🔐 Analyzing IPs with VirusTotal...`);
    const ipAnalysis = await virusTotalTool._call(ips);
    ipAnalysisResults = JSON.parse(ipAnalysis);
    console.log(`✅ IP Analysis complete`);
  }

  // Step 6: First LLM call - IP Analysis Summary
  console.log(`\n📊 Generating IP threat analysis...`);
  const ipAnalysisPrompt = `
You are a cybersecurity expert. Analyze the following IP addresses and their threat data:

IP Analysis Results:
${JSON.stringify(ipAnalysisResults, null, 2)}

Provide a brief security assessment for each IP, highlighting:
1. Threat level and reasoning
2. Any suspicious characteristics (VPN, proxy usage)
3. Recommended actions

Be concise but comprehensive.`;

  const ipAnalysisMessages = [{ role: "user", content: ipAnalysisPrompt }];

  const ipAnalysisResponse = await llm.invoke(ipAnalysisMessages);
  console.log(`✅ IP threat analysis generated`);

  // Step 7: Combine file data with IP analysis
  const combinedData = {
    source_file: filePath,
    file_data_summary: `File contains ${Array.isArray(fileData) ? fileData.length : 1} records`,
    identified_ips: ips,
    ip_analysis: ipAnalysisResults,
    ip_threat_assessment: ipAnalysisResponse.content,
  };

  // Step 8: Second LLM call - Overall Summary
  console.log(`\n📝 Generating security summary...`);
  const summaryPrompt = `
You are a security analyst. Based on the following combined security data, provide an executive summary:

Combined Security Data:
${JSON.stringify(combinedData, null, 2)}

File Data:
${JSON.stringify(fileData, null, 2)}

Provide:
1. Overall security posture assessment
2. Key findings and risks
3. Priority recommendations
4. Next steps for remediation



create output in given format {
  "analysis": {
    "virustotal_analysis": {
      "203.0.113.42": {
        "status": "analyzed",
        "last_analysis_stats": {
          "malicious": 0,
          "suspicious": 0,
          "undetected": 35,
          "harmless": 58,
          "timeout": 0
        },
        "country": "Unknown",
        "asn": "Unknown",
        "threat_level": "low",
        "is_vpn": false,
        "is_proxy": false
      },
      "192.168.1.100": {
        "status": "analyzed",
        "last_analysis_stats": {
          "malicious": 0,
          "suspicious": 0,
          "undetected": 33,
          "harmless": 60,
          "timeout": 0
        },
        "country": "Unknown",
        "asn": "Unknown",
        "threat_level": "low",
        "is_vpn": false,
        "is_proxy": false
      },
      "45.142.182.99": {
        "status": "analyzed",
        "last_analysis_stats": {
          "malicious": 0,
          "suspicious": 1,
          "undetected": 34,
          "harmless": 58,
          "timeout": 0
        },
        "country": "DE",
        "asn": 44592,
        "threat_level": "medium",
        "is_vpn": false,
        "is_proxy": false
      },
      "198.51.100.5": {
        "status": "analyzed",
        "last_analysis_stats": {
          "malicious": 0,
          "suspicious": 0,
          "undetected": 35,
          "harmless": 58,
          "timeout": 0
        },
        "country": "Unknown",
        "asn": "Unknown",
        "threat_level": "low",
        "is_vpn": false,
        "is_proxy": false
      },
      "192.0.2.1": {
        "status": "analyzed",
        "last_analysis_stats": {
          "malicious": 0,
          "suspicious": 0,
          "undetected": 34,
          "harmless": 59,
          "timeout": 0
        },
        "country": "Unknown",
        "asn": "Unknown",
        "threat_level": "low",
        "is_vpn": false,
        "is_proxy": false
      },
      "1.1.1.1": {
        "status": "analyzed",
        "last_analysis_stats": {
          "malicious": 0,
          "suspicious": 0,
          "undetected": 32,
          "harmless": 61,
          "timeout": 0
        },
        "country": "Unknown",
        "asn": 13335,
        "threat_level": "low",
        "is_vpn": false,
        "is_proxy": false
      }
    },
    "ip_threat_assessment": "Here's the security assessment for each IP address:\n\n**203.0.113.42**\n\n* Threat Level: Low\n* Reasoning: No malicious or suspicious activity detected.\n* Suspicious Characteristics: None\n* Recommended Actions: Continue monitoring, as it is a private IP address and may not be related to malicious activity.\n\n**192.168.1.100**\n\n* Threat Level: Low\n* Reasoning: No malicious or suspicious activity detected.\n* Suspicious Characteristics: None\n* Recommended Actions: Continue monitoring, as it is a private IP address and may not be related to malicious activity.\n\n**45.142.182.99 (DE)**\n\n* Threat Level: Medium\n* Reasoning: One suspicious event detected (1 suspicious connection).\n* Suspicious Characteristics: VPN or proxy usage suspected.\n* Recommended Actions: Investigate further, as the country is Germany (DE) and there may be legitimate reasons for this IP address.\n\n**198.51.100.5**\n\n* Threat Level: Low\n* Reasoning: No malicious or suspicious activity detected.\n* Suspicious Characteristics: None\n* Recommended Actions: Continue monitoring, as it is an unknown country and ASN.\n\n**192.0.2.1**\n\n* Threat Level: Low\n* Reasoning: No malicious or suspicious activity detected.\n* Suspicious Characteristics: None\n* Recommended Actions: Continue monitoring, as it is an unknown country and ASN.\n\n**1.1.1.1 (13335)**\n\n* Threat Level: Low\n* Reasoning: No malicious or suspicious activity detected.\n* Suspicious Characteristics: None\n* Recommended Actions: Continue monitoring, as this IP address is associated with Cloudflare, a legitimate service provider.\n\nIn summary:\n\n* IPs 203.0.113.42, 192.168.1.100 are private and do not require further action.\n* IP 45.142.182.99 (DE) may be related to VPN or proxy usage, requiring further investigation.\n* IPs 198.51.100.5, 192.0.2.1 are unknown countries with no suspicious activity detected, but should continue to be monitored.\n* IP 1.1.1.1 is associated with a legitimate service provider and does not require action.\n\nPlease note that this assessment is based on the provided data and may not reflect the actual threat level or characteristics of these IP addresses in real-world scenarios.",
  "security_posture_assessment": {
    "overall_score": 80,
    "description": "The organization has a generally good security posture, with some areas for improvement."
  },
  "key_findings_and_risks": [
    {
      "risk_id": "IP_45.142.182.99",
      "description": "Suspicious outbound connection detected from IP 192.168.1.100 to IP 45.142.182.99 on port 443 using HTTPS protocol.",
      "risk_level": "Medium"
    },
    {
      "risk_id": "MALWARE_198.51.100.5",
      "description": "Known malware signature detected on workstation_34 with file hash 5d41402abc4b2a76b9719d911017c592.",
      "risk_level": "Critical"
    },
    {
      "risk_id": "GEO_LOCATION_ANOMALY_1.1.1.1",
      "description": "Geo-location anomaly detected for user john.doe@corp.com with login location 1.1.1.1 and previous location 192.0.2.1.",
      "risk_level": "Low"
    }
  ],
  "priority_recommendations": [
    {
      "recommendation_id": "RECOMMENDATION_01",
      "description": "Investigate the suspicious outbound connection from IP 192.168.1.100 to IP 45.142.182.99 on port 443 using HTTPS protocol.",
      "priority": "High"
    },
    {
      "recommendation_id": "RECOMMENDATION_02",
      "description": "Scan workstation_34 for malware and ensure all software is up-to-date.",
      "priority": "Critical"
    },
    {
      "recommendation_id": "RECOMMENDATION_03",
      "description": "Monitor user john.doe@corp.com's login location and previous location to prevent future geo-location anomalies.",
      "priority": "Medium"
    }
  ],
  "next_steps_for_remediation": [
    {
      "step_id": "STEP_01",
      "description": "Conduct a thorough investigation into the suspicious outbound connection from IP 192.168.1.100 to IP 45.142.182.99 on port 443 using HTTPS protocol.",
      "responsibility": "Security Team"
    },
    {
      "step_id": "STEP_02",
      "description": "Scan workstation_34 for malware and ensure all software is up-to-date.",
      "responsibility": "IT Department"
    },
    {
      "step_id": "STEP_03",
      "description": "Monitor user john.doe@corp.com's login location and previous location to prevent future geo-location anomalies.",
      "responsibility": "Security Team"
    }
  ]
}

Keep it concise but actionable.`;

  const summaryMessages = [{ role: "user", content: summaryPrompt }];

  const summaryResponse = await llm.invoke(summaryMessages);
  console.log(`✅ Security summary generated`);

  // Step 9: Return comprehensive analysis
  const result = {
    timestamp: new Date().toISOString(),
    file_path: filePath,
    analysis: {
      ips_found: ips.length,
      unique_ips: ips,
      virustotal_analysis: ipAnalysisResults,
      ip_threat_assessment: ipAnalysisResponse.content,
      overall_summary: summaryResponse.content,
    },
  };

  return result;
}

/**
 * Demo/CLI usage
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  const filePath = process.argv[2] || "./sample-data.json";

  analyzeSecurityFile(filePath, {
    ollamaBaseUrl: ollamaBaseUrl,
    model: modelName,
    virusTotalApiKey: virusTotalApiKey,
  })
    .then((result) => {
      console.log("\n" + "=".repeat(60));
      console.log("SECURITY ANALYSIS REPORT");
      console.log("=".repeat(60));
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((error) => {
      console.error("Analysis failed:", error);
      process.exit(1);
    });
}

export default analyzeSecurityFile;
