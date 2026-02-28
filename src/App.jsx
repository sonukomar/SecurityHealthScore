import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ipData,
  suspiciousIPs,
  mediaUsageData,
  permissionTimeline,
  autofillData,
  radarData,
  micAccessLog,
  cameraAccessLog,
  recommendations,
  threatScore,
  tabs,
} from "./mockData/mockData";
import { C, font, fontSans } from "./helpers";
import { Badge } from "./Components/Badge";
import { CustomTooltip } from "./Components/CustomTooltip";
import { Card } from "./Components/Card";
import { CardTitle } from "./Components/CardTitle";
import { StatMini } from "./Components/StatMini";
import { TabBar } from "./Components/TabBar";
import { ThreatRing } from "./Components/ThreatRing";
import { Footer } from "./Components/Footer";
import { Header } from "./Components/Header";
import { labels } from "./helpers/labels";

const eventSource = new EventSource("http://localhost:3000/events");

eventSource.addEventListener("reload", () => {
  console.log("Server requested reload via SSE. Reloading page...");
  [location.reload()]();
});

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function SecurityDashboard() {
  const [tab, setTab] = useState("overview");
  const [analysisData, setAnalysisData] = useState({});

  function parseMarkdown(md) {
    return md
      .replace(/^## (.*$)/gim, '<div class="section-title">$1</div>')
      .replace(/^\- (.*$)/gim, '<div class="bullet">• $1</div>')
      .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
      .replace(/\n/g, "<br>");
  }

  function convertSummaryToJson(res) {
    try {
      let response = res.analysis.analysis; // Start with the original response object
      // Extract JSON from the overall_summary string
      const summaryText = res.analysis.analysis.overall_summary;

      // Find the starting index of the JSON object
      const jsonStart = summaryText.indexOf("{");
      const jsonEnd = summaryText.lastIndexOf("}") + 1;

      if (jsonStart === -1 || jsonEnd === 0) {
        throw new Error("No valid JSON found in overall_summary");
      }

      // Extract and parse the JSON string
      const jsonString = summaryText.substring(jsonStart, jsonEnd);
      const parsedJson = JSON.parse(jsonString);
      response.overall_summary = parsedJson; // Replace the original string with the parsed JSON object
      return response;
    } catch (error) {
      console.error("Error converting summary to JSON:", error);
      return null;
    }
  }

  useEffect(() => {
    // Read data from report and assign to state (simulate API call)
    const controller = new AbortController();
    const response = {
      analysis: {
        timestamp: "2026-02-28T08:24:23.690Z",
        file_path: "./data-for-analysis.json",
        analysis: {
          ips_found: 4,
          unique_ips: [
            "104.18.12.37",
            "13.232.249.136",
            "160.79.104.10",
            "142.251.222.164",
          ],
          virustotal_analysis: {
            "104.18.12.37": {
              status: "analyzed",
              last_analysis_stats: {
                malicious: 0,
                suspicious: 0,
                undetected: 32,
                harmless: 61,
                timeout: 0,
              },
              country: "Unknown",
              asn: 13335,
              threat_level: "low",
              is_vpn: false,
              is_proxy: false,
            },
            "13.232.249.136": {
              status: "analyzed",
              last_analysis_stats: {
                malicious: 0,
                suspicious: 0,
                undetected: 93,
                harmless: 0,
                timeout: 0,
              },
              country: "IN",
              asn: 16509,
              threat_level: "low",
              is_vpn: false,
              is_proxy: false,
            },
            "160.79.104.10": {
              status: "analyzed",
              last_analysis_stats: {
                malicious: 1,
                suspicious: 0,
                undetected: 33,
                harmless: 59,
                timeout: 0,
              },
              country: "US",
              asn: 399358,
              threat_level: "critical",
              is_vpn: false,
              is_proxy: false,
            },
            "142.251.222.164": {
              status: "analyzed",
              last_analysis_stats: {
                malicious: 0,
                suspicious: 0,
                undetected: 33,
                harmless: 60,
                timeout: 0,
              },
              country: "US",
              asn: 15169,
              threat_level: "low",
              is_vpn: false,
              is_proxy: false,
            },
          },
          ip_threat_assessment:
            'Here\'s the security assessment for each IP address:\n\n**IP Address: 104.18.12.37**\n\n* Threat Level: Low\n* Reasoning: The IP has been analyzed and found to be harmless with a high percentage of "harmless" results (61%). It also lacks any suspicious characteristics, such as VPN or proxy usage.\n* Recommended Actions: Continue monitoring the IP for any changes in behavior.\n\n**IP Address: 13.232.249.136**\n\n* Threat Level: Low\n* Reasoning: The IP has been analyzed and found to be harmless with a high percentage of "harmless" results (0%). However, it is located in India (IN), which may indicate potential risks related to data localization or censorship laws.\n* Recommended Actions: Consider implementing additional security measures, such as encryption, when communicating with servers or services hosted in India.\n\n**IP Address: 160.79.104.10**\n\n* Threat Level: Critical\n* Reasoning: The IP has been analyzed and found to be malicious (1%) due to its high threat level and suspicious behavior. This IP is located in the United States (US), which may indicate a potential insider threat or malicious actor.\n* Recommended Actions:\n\t+ Immediately block this IP address from accessing any sensitive resources.\n\t+ Conduct a thorough investigation into the source of the malicious traffic.\n\t+ Implement additional security measures to prevent similar incidents in the future.\n\n**IP Address: 142.251.222.164**\n\n* Threat Level: Low\n* Reasoning: The IP has been analyzed and found to be harmless with a high percentage of "harmless" results (60%). It also lacks any suspicious characteristics, such as VPN or proxy usage.\n* Recommended Actions: Continue monitoring the IP for any changes in behavior.\n\nIn summary, IP address 160.79.104.10 poses a significant security risk due to its malicious activity, while the other IPs appear to be harmless.',
          overall_summary:
            'Here is the output in the requested format:\n\n```\n{\n  "analysis": {\n    "security_posture_assessment": {\n      "overall_score": 80,\n      "description": "The organization has a generally good security posture, with some areas for improvement."\n    },\n    "key_findings_and_risks": [\n      {\n        "risk_id": "IP_45.142.182.99",\n        "description": "Suspicious outbound connection detected from IP 192.168.1.100 to IP 45.142.182.99 on port 443 using HTTPS protocol.",\n        "risk_level": "Medium"\n      },\n      {\n        "risk_id": "MALWARE_198.51.100.5",\n        "description": "Known malware signature detected on workstation_34 with file hash 5d41402abc4b2a76b9719d911017c592.",\n        "risk_level": "Critical"\n      },\n      {\n        "risk_id": "GEO_LOCATION_ANOMALY_1.1.1.1",\n        "description": "Geo-location anomaly detected for user john.doe@corp.com with login location 1.1.1.1 and previous location 192.0.2.1.",\n        "risk_level": "Low"\n      }\n    ],\n    "priority_recommendations": [\n      {\n        "recommendation_id": "RECOMMENDATION_01",\n        "description": "Investigate the suspicious outbound connection from IP 192.168.1.100 to IP 45.142.182.99 on port 443 using HTTPS protocol.",\n        "priority": "High"\n      },\n      {\n        "recommendation_id": "RECOMMENDATION_02",\n        "description": "Scan workstation_34 for malware and ensure all software is up-to-date.",\n        "priority": "Critical"\n      },\n      {\n        "recommendation_id": "RECOMMENDATION_03",\n        "description": "Monitor user john.doe@corp.com\'s login location and previous location to prevent future geo-location anomalies.",\n        "priority": "Medium"\n      }\n    ],\n    "next_steps_for_remediation": [\n      {\n        "step_id": "STEP_01",\n        "description": "Conduct a thorough investigation into the suspicious outbound connection from IP 192.168.1.100 to IP 45.142.182.99 on port 443 using HTTPS protocol.",\n        "responsibility": "Security Team"\n      },\n      {\n        "step_id": "STEP_02",\n        "description": "Scan workstation_34 for malware and ensure all software is up-to-date.",\n        "responsibility": "IT Department"\n      },\n      {\n        "step_id": "STEP_03",\n        "description": "Monitor user john.doe@corp.com\'s login location and previous location to prevent future geo-location anomalies.",\n        "responsibility": "Security Team"\n      }\n    ]\n  }\n}\n```\n\n**Overall Security Posture Assessment:**\nThe organization has a generally good security posture, with some areas for improvement. The overall score is 80.\n\n**Key Findings and Risks:**\n\n1. **IP_45.142.182.99**: Suspicious outbound connection detected from IP 192.168.1.100 to IP 45.142.182.99 on port 443 using HTTPS protocol.\n\t* Risk Level: Medium\n2. **MALWARE_198.51.100.5**: Known malware signature detected on workstation_34 with file hash 5d41402abc4b2a76b9719d911017c592.\n\t* Risk Level: Critical\n3. **GEO_LOCATION_ANOMALY_1.1.1.1**: Geo-location anomaly detected for user john.doe@corp.com with login location 1.1.1.1 and previous location 192.0.2.1.\n\t* Risk Level: Low\n\n**Priority Recommendations:**\n\n1. **RECOMMENDATION_01**: Investigate the suspicious outbound connection from IP 192.168.1.100 to IP 45.142.182.99 on port 443 using HTTPS protocol.\n\t* Priority: High\n2. **RECOMMENDATION_02**: Scan workstation_34 for malware and ensure all software is up-to-date.\n\t* Priority: Critical\n3. **RECOMMENDATION_03**: Monitor user john.doe@corp.com\'s login location and previous location to prevent future geo-location anomalies.\n\t* Priority: Medium\n\n**Next Steps for Remediation:**\n\n1. **STEP_01**: Conduct a thorough investigation into the suspicious outbound connection from IP 192.168.1.100 to IP 45.142.182.99 on port 443 using HTTPS protocol.\n\t* Responsibility: Security Team\n2. **STEP_02**: Scan workstation_34 for malware and ensure all software is up-to-date.\n\t* Responsibility: IT Department\n3. **STEP_03**: Monitor user john.doe@corp.com\'s login location and previous location to prevent future geo-location anomalies.\n\t* Responsibility: Security Team',
        },
      },
    };
    const convertedData = convertSummaryToJson(response);
    console.log("Converted analysis data:", convertedData);
    setAnalysisData(convertedData);
    fetch("/api/analyzes", { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        const convertedData = convertSummaryToJson(data);
        console.log("Converted analysis data:", convertedData);
        setAnalysisData(convertedData);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Error fetching analysis data:", err);
        }
      });

    return () => controller.abort(); // Cleanup: abort the fetch on unmount
  }, []);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        backgroundImage: `
        radial-gradient(ellipse at 15% 10%, ${C.cyan}10 0%, transparent 42%),
        radial-gradient(ellipse at 85% 90%, ${C.purple}10 0%, transparent 42%)
      `,
        fontFamily: fontSans,
        color: C.textHi,
      }}
    >
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.bg}; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        ::-webkit-scrollbar { width: 5px; background: ${C.surface}; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius:3px; }
      `}</style>

      {/* ── HEADER ── */}
      <Header />
      <main
        style={{ maxWidth: 1300, margin: "0 auto", padding: "32px 36px 72px" }}
      >
        {/* ── HERO CARD ── */}
        <Card
          style={{
            marginBottom: 28,
            display: "flex",
            alignItems: "center",
            gap: 36,
            flexWrap: "wrap",
          }}
          glow={C.cyan}
        >
          <ThreatRing
            score={
              analysisData?.overall_summary?.analysis
                ?.security_posture_assessment?.overall_score || threatScore
            }
          />

          <div style={{ flex: "1 1 200px" }}>
            <h1
              style={{
                fontFamily: fontSans,
                fontSize: 22,
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              {labels.Header}
            </h1>
            <p
              style={{
                color: C.textMid,
                fontSize: 13,
                lineHeight: 1.65,
                marginBottom: 16,
              }}
            >
              {analysisData?.overall_summary?.analysis
                ?.security_posture_assessment?.description ||
                `${labels.Header_Sub} ${labels.Header_Sub1} ${labels.Header_Sub2}`}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[
                `${12} ${labels.Blocked_IPs}`,
                `1 ${labels.Rouge_Mic_Access}`,
                `1 ${labels.Camera_Inrusions}`,
                `${labels.Autofill_Exposures}`,
              ].map((t) => (
                <span
                  key={t}
                  style={{
                    fontFamily: font,
                    fontSize: 10,
                    padding: "4px 11px",
                    borderRadius: 20,
                    background: "rgba(255,69,96,0.12)",
                    color: C.red,
                    border: `1px solid ${C.red}44`,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              flexShrink: 0,
            }}
          >
            <StatMini label="IP Threats" value="23" accent={C.red} icon="🛡️" />
            <StatMini
              label="Perm Requests"
              value="41"
              accent={C.yellow}
              icon="🔐"
            />
            <StatMini
              label="Autofill Fields"
              value="347"
              accent={C.purple}
              icon="📋"
            />
            <StatMini
              label="Unresolved Alerts"
              value="7"
              accent={C.cyan}
              icon="⚡"
            />
          </div>
        </Card>

        {/* ── TAB BAR ── */}
        <div style={{ marginBottom: 24 }}>
          <TabBar tabs={tabs} active={tab} onChange={setTab} />
        </div>

        {/* ══════ OVERVIEW ══════ */}
        {tab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 20,
              }}
            >
              <Card glow={C.purple}>
                <CardTitle accent={C.purple}>{labels.Security_Radar}</CardTitle>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                    <PolarAngleAxis
                      dataKey="metric"
                      tick={{ fill: C.textLo, fontSize: 10, fontFamily: font }}
                    />
                    <Radar
                      dataKey="score"
                      stroke={C.purple}
                      fill={C.purple}
                      fillOpacity={0.18}
                      strokeWidth={2}
                    />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </Card>

              <Card glow={C.cyan}>
                <CardTitle accent={C.cyan}>
                  {labels.Media_Usages_Breakdown}
                </CardTitle>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={mediaUsageData}
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={85}
                      dataKey="value"
                      paddingAngle={4}
                    >
                      {mediaUsageData.map((e, i) => (
                        <Cell
                          key={i}
                          fill={e.color}
                          style={{ filter: `drop-shadow(0 0 5px ${e.color})` }}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      iconType="circle"
                      wrapperStyle={{
                        fontSize: 11,
                        fontFamily: font,
                        color: C.textMid,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              <Card glow={C.red}>
                <CardTitle accent={C.red}>{labels.IP_Request_Volume}</CardTitle>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={ipData}>
                    <defs>
                      <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor={C.cyan}
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="100%"
                          stopColor={C.cyan}
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={C.red} stopOpacity={0.4} />
                        <stop offset="100%" stopColor={C.red} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                      dataKey="time"
                      tick={{ fill: C.textLo, fontSize: 10, fontFamily: font }}
                    />
                    <YAxis
                      tick={{ fill: C.textLo, fontSize: 10, fontFamily: font }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="requests"
                      stroke={C.cyan}
                      fill="url(#g1)"
                      strokeWidth={2}
                      name="Requests"
                    />
                    <Area
                      type="monotone"
                      dataKey="blocked"
                      stroke={C.red}
                      fill="url(#g2)"
                      strokeWidth={2}
                      name="Blocked"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: 20,
              }}
            >
              <Card glow={C.yellow}>
                <CardTitle accent={C.yellow}>
                  Weekly Permission Requests
                </CardTitle>
                <ResponsiveContainer width="100%" height={210}>
                  <BarChart data={permissionTimeline} barGap={3}>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                      dataKey="day"
                      tick={{ fill: C.textLo, fontSize: 10, fontFamily: font }}
                    />
                    <YAxis
                      tick={{ fill: C.textLo, fontSize: 10, fontFamily: font }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{
                        fontSize: 11,
                        fontFamily: font,
                        color: C.textMid,
                      }}
                    />
                    <Bar
                      dataKey="camera"
                      fill={C.cyan}
                      radius={[3, 3, 0, 0]}
                      name="Camera"
                    />
                    <Bar
                      dataKey="mic"
                      fill={C.red}
                      radius={[3, 3, 0, 0]}
                      name="Microphone"
                    />
                    <Bar
                      dataKey="location"
                      fill={C.purple}
                      radius={[3, 3, 0, 0]}
                      name="Location"
                    />
                    <Bar
                      dataKey="screen"
                      fill={C.yellow}
                      radius={[3, 3, 0, 0]}
                      name="Screen"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card glow={C.purple}>
                <CardTitle accent={C.purple}>Autofill Exposure</CardTitle>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 13 }}
                >
                  {autofillData.map((d) => (
                    <div key={d.field}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 5,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: font,
                            fontSize: 11,
                            color: C.textMid,
                          }}
                        >
                          {d.field}
                        </span>
                        <span
                          style={{
                            fontFamily: font,
                            fontSize: 11,
                            color:
                              d.exposed > 10
                                ? C.red
                                : d.exposed > 0
                                  ? C.yellow
                                  : C.cyan,
                          }}
                        >
                          {d.exposed > 0 ? `${d.exposed} ⚠` : "✓"}
                        </span>
                      </div>
                      <div
                        style={{
                          height: 5,
                          background: "rgba(255,255,255,0.08)",
                          borderRadius: 3,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            borderRadius: 3,
                            width: `${(d.fills / 100) * 100}%`,
                            background: `linear-gradient(90deg, ${C.purple}, ${C.cyan})`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ══════ IP TRACKING ══════ */}
        {tab === "ip-tracking" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Card glow={C.cyan}>
              <CardTitle accent={C.cyan}>Network Traffic Timeline</CardTitle>
              <ResponsiveContainer width="100%" height={270}>
                <LineChart data={ipData}>
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="time"
                    tick={{ fill: C.textLo, fontSize: 11, fontFamily: font }}
                  />
                  <YAxis
                    tick={{ fill: C.textLo, fontSize: 11, fontFamily: font }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{
                      fontSize: 11,
                      fontFamily: font,
                      color: C.textMid,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="requests"
                    stroke={C.cyan}
                    strokeWidth={2}
                    dot={{ fill: C.cyan, r: 4 }}
                    name="Total Requests"
                  />
                  <Line
                    type="monotone"
                    dataKey="blocked"
                    stroke={C.red}
                    strokeWidth={2}
                    dot={{ fill: C.red, r: 4 }}
                    name="Blocked"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card glow={C.red}>
              <CardTitle accent={C.red}>Suspicious IP Addresses</CardTitle>
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontFamily: font,
                    fontSize: 12,
                  }}
                >
                  <thead>
                    <tr>
                      {[
                        "IP Address",
                        "Country",
                        "Requests",
                        "Risk Level",
                        "Status",
                      ].map((h) => (
                        <th
                          key={h}
                          style={{
                            textAlign: "left",
                            padding: "8px 16px 12px 0",
                            color: C.textLo,
                            fontSize: 10,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            borderBottom: `1px solid ${C.border}`,
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {suspiciousIPs.map((ip, i) => (
                      <tr
                        key={i}
                        style={{
                          borderBottom: `1px solid rgba(255,255,255,0.04)`,
                        }}
                      >
                        <td
                          style={{ padding: "13px 16px 13px 0", color: C.cyan }}
                        >
                          {ip.ip}
                        </td>
                        <td
                          style={{
                            padding: "13px 16px 13px 0",
                            color: C.textMid,
                          }}
                        >
                          {ip.country}
                        </td>
                        <td
                          style={{
                            padding: "13px 16px 13px 0",
                            color: C.textHi,
                          }}
                        >
                          {ip.requests}
                        </td>
                        <td style={{ padding: "13px 16px 13px 0" }}>
                          <Badge label={ip.risk} />
                        </td>
                        <td style={{ padding: "13px 0" }}>
                          <Badge label={ip.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* ══════ MEDIA ══════ */}
        {tab === "media" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
              }}
            >
              <Card glow={C.red}>
                <CardTitle accent={C.red}>🎤 Microphone Access Log</CardTitle>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {micAccessLog.map((e, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "12px 14px",
                        borderRadius: 10,
                        background: "rgba(255,255,255,0.04)",
                        border: `1px solid ${e.trust === "DANGER" ? C.red + "55" : C.border}`,
                        boxShadow:
                          e.trust === "DANGER" ? `0 0 12px ${C.red}22` : "none",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 500,
                            marginBottom: 3,
                          }}
                        >
                          {e.app}
                        </p>
                        <p
                          style={{
                            fontFamily: font,
                            fontSize: 11,
                            color: C.textLo,
                          }}
                        >
                          {e.date} · {e.duration}
                        </p>
                      </div>
                      <Badge label={e.trust} />
                    </div>
                  ))}
                </div>
              </Card>

              <Card glow={C.cyan}>
                <CardTitle accent={C.cyan}>📷 Camera Access Log</CardTitle>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {cameraAccessLog.map((e, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "12px 14px",
                        borderRadius: 10,
                        background: "rgba(255,255,255,0.04)",
                        border: `1px solid ${e.trust === "DANGER" ? C.red + "55" : C.border}`,
                        boxShadow:
                          e.trust === "DANGER" ? `0 0 12px ${C.red}22` : "none",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 500,
                            marginBottom: 3,
                          }}
                        >
                          {e.app}
                        </p>
                        <p
                          style={{
                            fontFamily: font,
                            fontSize: 11,
                            color: C.textLo,
                          }}
                        >
                          {e.date} · {e.snapshots} snapshots
                        </p>
                      </div>
                      <Badge label={e.trust} />
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card glow={C.yellow}>
              <CardTitle accent={C.yellow}>
                Daily Media Permission Activity
              </CardTitle>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={permissionTimeline} barGap={4}>
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: C.textLo, fontSize: 11, fontFamily: font }}
                  />
                  <YAxis
                    tick={{ fill: C.textLo, fontSize: 11, fontFamily: font }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{
                      fontSize: 11,
                      fontFamily: font,
                      color: C.textMid,
                    }}
                  />
                  <Bar
                    dataKey="camera"
                    fill={C.cyan}
                    radius={[4, 4, 0, 0]}
                    name="Camera"
                  />
                  <Bar
                    dataKey="mic"
                    fill={C.red}
                    radius={[4, 4, 0, 0]}
                    name="Microphone"
                  />
                  <Bar
                    dataKey="screen"
                    fill={C.yellow}
                    radius={[4, 4, 0, 0]}
                    name="Screen"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {/* ══════ AUTOFILL ══════ */}
        {tab === "autofill" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Card glow={C.purple}>
              <CardTitle accent={C.purple}>
                Autofill Usage vs Exposure by Field
              </CardTitle>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={autofillData} layout="vertical">
                  <CartesianGrid
                    stroke="rgba(255,255,255,0.05)"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fill: C.textLo, fontSize: 10, fontFamily: font }}
                  />
                  <YAxis
                    dataKey="field"
                    type="category"
                    width={88}
                    tick={{ fill: C.textMid, fontSize: 11, fontFamily: font }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{
                      fontSize: 11,
                      fontFamily: font,
                      color: C.textMid,
                    }}
                  />
                  <Bar
                    dataKey="fills"
                    fill={C.purple}
                    radius={[0, 4, 4, 0]}
                    name="Total Fills"
                  />
                  <Bar
                    dataKey="exposed"
                    fill={C.red}
                    radius={[0, 4, 4, 0]}
                    name="Exposed Events"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
              }}
            >
              <Card glow={C.red}>
                <CardTitle accent={C.red}>Field Exposure Rates</CardTitle>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  {autofillData.map((d) => {
                    const rate = +((d.exposed / d.fills) * 100 || 0).toFixed(1);
                    const col =
                      rate > 30 ? C.red : rate > 10 ? C.yellow : C.cyan;
                    return (
                      <div key={d.field}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 6,
                          }}
                        >
                          <span style={{ fontSize: 13, fontWeight: 500 }}>
                            {d.field}
                          </span>
                          <span
                            style={{
                              fontFamily: font,
                              fontSize: 11,
                              color: col,
                            }}
                          >
                            {rate}%
                          </span>
                        </div>
                        <div
                          style={{
                            height: 6,
                            background: "rgba(255,255,255,0.08)",
                            borderRadius: 4,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              borderRadius: 4,
                              width: `${rate}%`,
                              background: col,
                              boxShadow: `0 0 8px ${col}`,
                              transition: "width 0.9s ease",
                            }}
                          />
                        </div>
                        <p
                          style={{
                            fontFamily: font,
                            fontSize: 10,
                            color: C.textLo,
                            marginTop: 4,
                          }}
                        >
                          {d.fills} fills · {d.exposed} exposed
                        </p>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card glow={C.cyan}>
                <CardTitle accent={C.cyan}>Security Recommendations</CardTitle>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {recommendations.map((r, i) => {
                    const icons = { danger: "🔴", warn: "🟡", safe: "🟢" };
                    return (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          gap: 12,
                          alignItems: "flex-start",
                          padding: "12px 14px",
                          borderRadius: 10,
                          background: "rgba(255,255,255,0.04)",
                          border: `1px solid ${C.border}`,
                        }}
                      >
                        <span
                          style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}
                        >
                          {icons[r.level]}
                        </span>
                        <p
                          style={{
                            fontSize: 12,
                            color: C.textMid,
                            lineHeight: 1.65,
                          }}
                        >
                          {r.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </div>
        )}
      </main>
      {JSON.stringify(analysisData) !== "{}" && (
        <Card glow={C.yellow} style={{ margin: "0 36px 36px" }}>
          <CardTitle accent={C.yellow}>Security Assesment</CardTitle>
          <pre
            style={{
              fontFamily: fontSans,
              fontSize: 11,
              color: C.textMid,

              overflow: "auto",
              background: "rgba(255,255,255,0.04)",
              padding: 12,
              borderRadius: 8,
            }}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: parseMarkdown(analysisData?.ip_threat_assessment),
              }}
            />
          </pre>
        </Card>
      )}

      {JSON.stringify(analysisData) !== "{}" && (
        <Card glow={C.yellow} style={{ margin: "0 36px 36px" }}>
          <CardTitle accent={C.yellow}>Next Step For Remediation</CardTitle>
          <pre
            style={{
              fontFamily: fontSans,
              fontSize: 11,
              color: C.textMid,
              maxHeight: 200,
              overflow: "auto",
              background: "rgba(255,255,255,0.04)",
              padding: 12,
              borderRadius: 8,
            }}
          >
            <ul>
              {analysisData?.overall_summary?.analysis?.next_steps_for_remediation?.map(
                (step) => (
                  <li key={step.step_id}>
                    <h3 style={{ fontFamily: fontSans }}>{step.description}</h3>
                    <p
                      style={{
                        fontSize: 10,
                        color: C.textLo,
                        fontFamily: fontSans,
                      }}
                    >
                      Responsible: {step.responsibility}
                    </p>
                  </li>
                ),
              )}
            </ul>
          </pre>
        </Card>
      )}
      {JSON.stringify(analysisData) !== "{}" && (
        <Card glow={C.yellow} style={{ margin: "0 36px 36px" }}>
          <CardTitle accent={C.yellow}>Priority Recommendations</CardTitle>
          <pre
            style={{
              fontFamily: fontSans,
              fontSize: 11,
              color: C.textMid,
              maxHeight: 200,
              overflow: "auto",
              background: "rgba(255,255,255,0.04)",
              padding: 12,
              borderRadius: 8,
            }}
          >
            <ul>
              {analysisData?.overall_summary?.analysis?.priority_recommendations?.map(
                (step) => (
                  <li key={step.recommendation_id}>
                    <h3 style={{ fontFamily: fontSans }}>{step.description}</h3>
                    <p
                      style={{
                        fontSize: 10,
                        color: C.textLo,
                        fontFamily: fontSans,
                      }}
                    >
                      Priority: {step.priority}
                    </p>
                  </li>
                ),
              )}
            </ul>
          </pre>
        </Card>
      )}

      <Footer />
    </div>
  );
}
