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

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function SecurityDashboard() {
  const [tab, setTab] = useState("overview");

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
          <ThreatRing score={threatScore} />

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
              {labels.Header_Sub}{" "}
              <strong style={{ color: C.yellow }}>{labels.Header_Sub1}</strong>{" "}
              {labels.Header_Sub2}
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

      <Footer />
    </div>
  );
}
