import { C } from "../helpers";
import "./StatMini.css";

export const StatMini = ({ label, value, accent, icon }) => (
  <div
    className="stat-mini"
    style={{
      "--stat-surface": C.surface,
      "--stat-border": C.border,
      "--stat-shadow": `0 0 20px ${accent}14`,
      "--stat-accent": accent,
      "--stat-text-mid": C.textMid,
    }}
  >
    <div className="glow-circle" style={{ background: accent }} />
    <div className="icon">{icon}</div>
    <div className="value">{value}</div>
    <div className="label">{label}</div>
  </div>
);
