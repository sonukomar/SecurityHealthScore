# LangChain + Ollama Security Analysis Tool

## Overview

This directory contains a sophisticated security analysis tool that combines:

- **LangChain** for AI-powered analysis orchestration
- **Ollama** for local LLM inference
- **VirusTotal API** for IP reputation checking
- **File parsing** for various data formats (JSON, CSV, TXT)

## Files

- **analyzeWithOllama.js** - Main analysis engine
- **initialize.js** - (Empty placeholder for custom initialization)

## Features

### 1. **IP Extraction**

Automatically extracts IP addresses from any input file (JSON, CSV, or plain text)

### 2. **VirusTotal Integration**

Creates a custom `VirusTotalTool` that:

- Validates IP addresses against VirusTotal database
- Extracts threat levels and detection data
- Evaluates malicious/suspicious activity
- Identifies VPN/proxy usage

### 3. **Multi-Stage LLM Analysis**

- **Stage 1**: IP Threat Assessment - Analyzes each IP's security posture
- **Stage 2**: Overall Summary - Provides executive-level security recommendations

### 4. **Flexible Input Handling**

Supports multiple file formats:

- JSON files
- CSV files
- Plain text files with newline-separated data

## Setup

### Prerequisites

1. **Ollama** - Install from https://ollama.ai
2. **Node.js** - v16 or higher
3. **VirusTotal API Key** (optional but recommended)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add:
# VIRUSTOTAL_API_KEY=your_api_key_here
# OLLAMA_BASE_URL=http://localhost:11434
# OLLAMA_MODEL=llama2
```

### Start Ollama

```bash
# In a separate terminal, start Ollama service
ollama serve

# In another terminal, pull your model (if not already done)
ollama pull llama2
# or for other models:
# ollama pull mistral
# ollama pull neural-chat
```

## Usage

### CLI Usage

```bash
# Analyze your security data file
node llm/analyzeWithOllama.js path/to/your/data.json

# With custom options
OLLAMA_MODEL=mistral VIRUSTOTAL_API_KEY=your_key node llm/analyzeWithOllama.js data.json
```

### Programmatic Usage

```javascript
import analyzeSecurityFile from "./llm/analyzeWithOllama.js";

const result = await analyzeSecurityFile("./security-data.json", {
  ollamaBaseUrl: "http://localhost:11434",
  model: "llama2",
  virusTotalApiKey: process.env.VIRUSTOTAL_API_KEY,
});

console.log(result.analysis.overall_summary);
```

## Example Output

The tool returns a comprehensive analysis with:

```json
{
  "timestamp": "2024-02-27T10:30:00Z",
  "file_path": "./data.json",
  "analysis": {
    "ips_found": 4,
    "unique_ips": ["45.142.182.99", "203.0.113.42", ...],
    "virustotal_analysis": {
      "45.142.182.99": {
        "status": "analyzed",
        "threat_level": "critical",
        "country": "China",
        "is_vpn": false
      }
    },
    "ip_threat_assessment": "Detailed LLM analysis of threats...",
    "overall_summary": "Executive summary with recommendations..."
  }
}
```

## Architecture

### VirusTotalTool (Custom LangChain Tool)

- Extends `Tool` class from LangChain
- Handles IP validation and parsing
- Returns structured threat intelligence
- Gracefully handles errors

### Analysis Pipeline

```
File Input
    ↓
Extract IPs
    ↓
Initialize LLM (Ollama)
    ↓
Query VirusTotal → IP Analysis
    ↓
LLM: Generate IP Threat Assessment
    ↓
Combine Data (File + IP Analysis)
    ↓
LLM: Generate Security Summary
    ↓
Return Results
```

## Threat Level Calculation

Threat levels are determined by VirusTotal detection stats:

- **Critical**: Any malicious detections
- **High**: 2+ suspicious detections
- **Medium**: 1 suspicious detection
- **Low**: No malicious/suspicious detections

## Environment Variables

```env
VIRUSTOTAL_API_KEY=        # Your VirusTotal API key
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2        # Options: llama2, mistral, neural-chat, etc.
```

## Supported Input Formats

### JSON

```json
{
  "alerts": [
    { "ip": "1.1.1.1", "severity": "high" },
    { "ip": "8.8.8.8", "severity": "low" }
  ]
}
```

### CSV

```csv
ip_address,severity,timestamp
1.1.1.1,high,2024-02-27T10:00:00Z
8.8.8.8,low,2024-02-27T09:00:00Z
```

### Plain Text

```
Log data with IPs:
Connection from 1.1.1.1 blocked
Alert: 8.8.8.8 suspicious activity
```

## Troubleshooting

### "Cannot connect to Ollama"

- Ensure Ollama is running on the configured URL
- Check `OLLAMA_BASE_URL` environment variable
- Verify port 11434 is open

### "API key invalid"

- Get a free VirusTotal API key from https://www.virustotal.com
- Add it to `.env` file
- Restart the application

### "Model not found"

- List available models: `ollama list`
- Pull a model: `ollama pull mistral`
- Update `OLLAMA_MODEL` in `.env`

## Advanced Configuration

### Using Different Models

```bash
# Faster inference (smaller model)
OLLAMA_MODEL=neural-chat node llm/analyzeWithOllama.js data.json

# More detailed analysis (larger model)
OLLAMA_MODEL=mistral node llm/analyzeWithOllama.js data.json
```

### Custom Temperature Settings

Modify the LLM initialization in code to adjust response creativity:

```javascript
const llm = new ChatOllama({
  baseUrl: ollamaBaseUrl,
  model,
  temperature: 0.3, // 0 = deterministic, 1 = creative
});
```

## Performance Notes

- IP validation: ~1-2 seconds per IP (depends on VirusTotal API)
- LLM inference: Depends on model size and system (typically 10-60 seconds)
- Total analysis time: 1-2 minutes for typical security data

## License

MIT
