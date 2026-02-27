import { C, font } from "../helpers";
export const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#0a0d1a",
        border: `1px solid ${C.cyan}55`,
        borderRadius: 8,
        padding: "10px 14px",
        fontFamily: font,
        fontSize: 11,
        boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
      }}
    >
      <p style={{ color: C.cyan, marginBottom: 6 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, margin: "2px 0" }}>
          {p.name}: <span style={{ color: C.textHi }}>{p.value}</span>
        </p>
      ))}
    </div>
  );
};
