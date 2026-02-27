import { C } from "../helpers/index";
const ipData = [
  { time: "00:00", requests: 12, blocked: 2 },
  { time: "04:00", requests: 8, blocked: 1 },
  { time: "08:00", requests: 47, blocked: 9 },
  { time: "12:00", requests: 89, blocked: 14 },
  { time: "16:00", requests: 102, blocked: 23 },
  { time: "20:00", requests: 74, blocked: 11 },
  { time: "23:59", requests: 31, blocked: 5 },
];

const suspiciousIPs = [
  {
    ip: "192.168.4.21",
    country: "RU",
    requests: 342,
    risk: "HIGH",
    status: "BLOCKED",
  },
  {
    ip: "103.45.78.12",
    country: "CN",
    requests: 218,
    risk: "HIGH",
    status: "BLOCKED",
  },
  {
    ip: "45.33.32.156",
    country: "US",
    requests: 97,
    risk: "MEDIUM",
    status: "MONITORED",
  },
  {
    ip: "178.62.194.50",
    country: "NL",
    requests: 64,
    risk: "MEDIUM",
    status: "MONITORED",
  },
  {
    ip: "10.0.0.214",
    country: "LOCAL",
    requests: 29,
    risk: "LOW",
    status: "SAFE",
  },
];

const mediaUsageData = [
  { name: "Camera", value: 38, color: C.cyan },
  { name: "Microphone", value: 29, color: C.red },
  { name: "Screen Share", value: 18, color: C.yellow },
  { name: "Location", value: 15, color: C.purple },
];

const permissionTimeline = [
  { day: "Mon", camera: 4, mic: 7, location: 2, screen: 1 },
  { day: "Tue", camera: 6, mic: 5, location: 4, screen: 3 },
  { day: "Wed", camera: 2, mic: 9, location: 1, screen: 0 },
  { day: "Thu", camera: 8, mic: 6, location: 5, screen: 2 },
  { day: "Fri", camera: 11, mic: 13, location: 3, screen: 6 },
  { day: "Sat", camera: 3, mic: 4, location: 7, screen: 1 },
  { day: "Sun", camera: 5, mic: 2, location: 2, screen: 0 },
];

const autofillData = [
  { field: "Email", fills: 84, exposed: 12 },
  { field: "Password", fills: 61, exposed: 3 },
  { field: "Phone", fills: 47, exposed: 19 },
  { field: "Address", fills: 38, exposed: 8 },
  { field: "Credit Card", fills: 22, exposed: 1 },
  { field: "Name", fills: 95, exposed: 0 },
];

const radarData = [
  { metric: "IP Safety", score: 62 },
  { metric: "Media Privacy", score: 78 },
  { metric: "Form Security", score: 45 },
  { metric: "Mic Control", score: 70 },
  { metric: "Camera Trust", score: 55 },
  { metric: "Auth Strength", score: 83 },
];

const micAccessLog = [
  { app: "Google Meet", duration: "2h 14m", date: "Today", trust: "SAFE" },
  { app: "Unknown Script", duration: "0m 08s", date: "Today", trust: "DANGER" },
  { app: "Zoom", duration: "45m", date: "Yesterday", trust: "SAFE" },
  {
    app: "Browser Tab #12",
    duration: "3m 22s",
    date: "Yesterday",
    trust: "WARN",
  },
  { app: "Discord", duration: "1h 07m", date: "2 days ago", trust: "SAFE" },
];

const cameraAccessLog = [
  { app: "Zoom", snapshots: 3, date: "Today", trust: "SAFE" },
  { app: "Suspicious Site", snapshots: 14, date: "Today", trust: "DANGER" },
  { app: "Google Meet", snapshots: 1, date: "Yesterday", trust: "SAFE" },
  { app: "FaceTime", snapshots: 2, date: "2 days ago", trust: "SAFE" },
];

const recommendations = [
  {
    level: "danger",
    text: "Phone number autofill exposed 19 times — disable or mask.",
  },
  {
    level: "warn",
    text: "Email autofill has 12 exposures across 3rd-party iframes.",
  },
  { level: "warn", text: "Address fields filled on 3 unencrypted HTTP sites." },
  {
    level: "safe",
    text: "Credit card autofill appears well-controlled. Keep monitoring.",
  },
  {
    level: "safe",
    text: "Password manager integration detected. Strong practice.",
  },
];

const threatScore = 67;

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "ip-tracking", label: "IP Tracking" },
  { id: "media", label: "Media" },
  { id: "autofill", label: "Autofill" },
];

export {
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
};
