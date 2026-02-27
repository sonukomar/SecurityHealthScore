# SecurityHealthScore

A comprehensive security analysis dashboard built with React and Vite that provides real-time threat assessment, vulnerability analysis, and security recommendations powered by AI/LLM integration.

## Features

### 📊 Interactive Dashboard

- **Overview Tab**: Real-time security metrics and threat visualization
- **IP Analysis**: Detect and analyze suspicious IP addresses with VirusTotal integration
- **Permission Tracking**: Monitor app permissions and access logs
- **Media Usage Analytics**: Track media device access (camera, microphone)
- **Threat Scoring**: Visual threat assessment with ring charts and gauges
- **Risk Assessment**: Comprehensive security posture evaluation

### 🤖 AI-Powered Analysis

- **LLM Integration**: Ollama-based AI analysis for security data
- **Intelligent Recommendations**: AI-generated actionable security recommendations
- **Threat Assessment**: Automated threat level classification and analysis

### 📈 Data Visualization

- Area charts for trend analysis
- Bar charts for comparative metrics
- Pie charts for distribution analysis
- Radar charts for multi-dimensional threat assessment
- Line charts for timeline analysis
- Custom threat ring visualization

### 🔒 Security Features

- VirusTotal IP validation and threat analysis
- Malware detection indicators
- Geo-location anomaly detection
- VPN/Proxy detection
- ASN and country-based threat assessment

## Tech Stack

- **Frontend**: React 19.2.4 with Vite 7.3.1
- **Styling**: Tailwind CSS 4.2.1 with PostCSS
- **Charts**: Recharts 2.10.0 (interactive data visualization)
- **Backend**: Express.js 5.2.1
- **AI/LLM**: LangChain + Ollama for intelligent analysis
- **Linting**: ESLint 9.39.1
- **Build Tool**: Vite with HMR (Hot Module Replacement)

## Project Structure

```
security-anlysis/
├── src/
│   ├── App.jsx                 # Main dashboard component
│   ├── Components/             # Reusable UI components
│   │   ├── Badge.jsx
│   │   ├── Card.jsx
│   │   ├── CardTitle.jsx
│   │   ├── CustomTooltip.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── StatMini.jsx
│   │   ├── TabBar.jsx
│   │   └── ThreatRing.jsx
│   ├── helpers/                # Utility functions
│   │   ├── index.js
│   │   └── labels.js
│   ├── mockData/               # Sample data for development
│   │   ├── mockData.js
│   │   ├── main_llm_response.json
│   │   └── response_llm.json
│   ├── services/               # API services
│   │   └── virustotal.js
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── llm/
│   ├── analyzeWithOllama.js    # LLM analysis engine
│   ├── runner.js               # LLM execution runner
│   ├── examples.js
│   └── README.md
├── public/                     # Static assets
├── server.js                   # Express backend server
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── package.json
└── README.md
```

## Installation & Setup

### Prerequisites

- Node.js 16+
- npm or yarn
- VirusTotal API key (for IP validation)
- Ollama (for LLM analysis features)

### Step 1: Clone and Install Dependencies

```bash
git clone <repository-url>
cd security-anlysis
npm install
```

### Step 2: Configure Environment Variables

Create a `.env` file at the project root:

```dotenv
TOTAL_VIRUS_API_KEY=your_virustotal_api_key_here
VITE_API_URL=http://localhost:3001
```

### Step 3: Run Development Server

Start the frontend development server with Vite:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Step 4: Run Backend API (Optional)

Start the Node.js/Express backend server:

```bash
npm run api
```

Backend runs on `http://localhost:3001`

## API Endpoints

### VirusTotal IP Checker

**POST** `/api/check-ips`

Validate a list of IP addresses against VirusTotal:

```bash
curl -H "Content-Type: application/json" \
     -d '{"ips":["1.1.1.1","8.8.8.8"]}' \
     http://localhost:3001/api/check-ips
```

**Response:**

```json
{
  "results": {
    "1.1.1.1": {
      "status": "analyzed",
      "threat_level": "low",
      "malicious": 0,
      "suspicious": 0,
      "country": "Unknown",
      "asn": 13335,
      "is_vpn": false,
      "is_proxy": false
    }
  }
}
```

### Security Analysis

**GET** `/api/analyze`

Retrieve comprehensive security analysis with AI-generated recommendations.

## LLM Integration (Ollama)

The application includes AI-powered analysis using Ollama:

### Setup Ollama

1. Install Ollama: https://ollama.ai
2. Pull a model (e.g., llama2):
   ```bash
   ollama pull llama2
   ```
3. Start Ollama (runs on port 11434 by default)

### Using LLM Features

The LLM integration provides:

- Automated threat assessment and analysis
- Security recommendations generation
- Risk level classification
- Actionable remediation steps

See `/llm/README.md` for detailed LLM configuration and usage.

## Development Commands

```bash
# Start development server (Vite HMR enabled)
npm run dev

# Build for production
npm run build

# Run linting checks
npm run lint

# Preview production build locally
npm run preview

# Start backend API service
npm run api
```

## Dashboard Tabs

1. **Overview**: Security metrics, threat levels, and risk summary
2. **IP Analysis**: Suspicious IP detection and VirusTotal analysis
3. **Threats**: Detailed threat assessment by category
4. **Recommendations**: AI-generated security recommendations
5. **Activity**: Permission timelines and access logs

## Key Components

### SecurityDashboard (App.jsx)

Main dashboard component that orchestrates all analytics and visualization. Handles data fetching, state management, and LLM analysis integration.

### ThreatRing

Custom circular threat visualization with severity indicators showing overall security health score.

### Card & CardTitle

Reusable card components for data grouping and presentation with consistent styling.

### CustomTooltip

Enhanced tooltip for chart interactivity and detailed hover information on data points.

### TabBar

Dynamic tab navigation for switching between different dashboard views.

### Badge

Component for displaying threat levels, categories, and status indicators.

### StatMini

Compact statistics display component for key metrics throughout the dashboard.

## Data Sources

- **Mock Data**: `src/mockData/mockData.js` for development and testing
- **VirusTotal**: Real-time IP threat intelligence and reputation data
- **LLM Analysis**: Ollama-powered automated analysis for insights and recommendations
- **System Logs**: Permission and access timeline data for activity tracking

## Security Notes

- VirusTotal API key should be stored securely in `.env`
- Do not commit `.env` file to version control
- Ollama should run in a secure, isolated environment
- All IP addresses are validated before API requests
- Sensitive data should never be logged to console in production

## Browser Compatibility

- Chrome/Chromium 90+
- Firefox 88+
- Safari 15+
- Edge 90+

## Performance Optimizations

- Vite for fast development with HMR and optimized production builds
- React functional components with hooks for better performance
- Memoization for expensive operations in visualizations
- Recharts lazy loading for large datasets
- Tailwind CSS for minimal and optimized CSS payload
- Code splitting via Vite for faster initial load times

## Application Workflow

1. **Data Loading**: Application fetches security analysis data from `/api/analyze`
2. **Data Processing**: LLM analysis results are parsed and converted to structured JSON
3. **State Management**: Data is stored in React state for component access
4. **Visualization**: Various charts and cards display the analyzed security data
5. **User Interaction**: Users can switch between tabs to explore different aspects of security
6. **Recommendations**: AI-generated recommendations are displayed with priority levels

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Ensure ESLint passes: `npm run lint`
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

For issues and questions, please open an issue in the repository.

---

**Last Updated**: February 28, 2026
**Version**: 1.0.0
