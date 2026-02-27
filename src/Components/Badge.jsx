import { riskPalette, C } from "../helpers";
import "./Badge.css";

export const Badge = ({ label }) => {
  const p = riskPalette[label] || {
    bg: "rgba(255,255,255,0.1)",
    text: C.textMid,
  };
  const styleList = {
    background: p.bg,
    color: p.text,
    border: `1px solid ${p.text}55`,
  };
  return (
    <span className="badge" style={styleList}>
      {label}
    </span>
  );
};
