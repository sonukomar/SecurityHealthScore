const C = {
  bg: "darkslategray",
  surface: "#0c0f1a",
  card: "#101422",
  border: "rgba(255,255,255,0.07)",
  cyan: "#00e5c4",
  red: "#ff4560",
  yellow: "#ffc93c",
  purple: "#9b6dff",
  blue: "#3d9be9",
  textHi: "#f0f4ff",
  textMid: "rgba(240,244,255,0.55)",
  textLo: "rgba(240,244,255,0.25)",
};

const riskPalette = {
  HIGH: { bg: "rgba(255,69,96,0.15)", text: C.red },
  MEDIUM: { bg: "rgba(255,201,60,0.15)", text: C.yellow },
  LOW: { bg: "rgba(0,229,196,0.15)", text: C.cyan },
  BLOCKED: { bg: "rgba(255,69,96,0.15)", text: C.red },
  MONITORED: { bg: "rgba(255,201,60,0.15)", text: C.yellow },
  SAFE: { bg: "rgba(0,229,196,0.15)", text: C.cyan },
  DANGER: { bg: "rgba(255,69,96,0.2)", text: C.red },
  WARN: { bg: "rgba(255,201,60,0.15)", text: C.yellow },
};

const font = "'IBM Plex Mono', 'Courier New', monospace";
const fontSans = "'DM Sans', 'Segoe UI', sans-serif";

const threatScore = 67;

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "ip-tracking", label: "IP Tracking" },
  { id: "media", label: "Media" },
  { id: "autofill", label: "Autofill" },
];

export { riskPalette, font, fontSans, threatScore, tabs, C };
