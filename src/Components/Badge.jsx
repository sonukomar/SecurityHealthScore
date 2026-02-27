import { riskPalette, C, font } from "../helpers";

export const Badge = ({ label }) => {
  const p = riskPalette[label] || {
    bg: "rgba(255,255,255,0.1)",
    text: C.textMid,
  };
  return (
    <span
      style={{
        fontFamily: font,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.08em",
        padding: "3px 9px",
        borderRadius: 4,
        background: p.bg,
        color: p.text,
        border: `1px solid ${p.text}55`,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
};
