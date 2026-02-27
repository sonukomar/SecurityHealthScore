import { C, font, fontSans } from "../helpers";

export const StatMini = ({ label, value, accent, icon }) => (
  <div
    style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 12,
      padding: "16px 18px",
      boxShadow: `0 0 20px ${accent}14`,
      position: "relative",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: -20,
        right: -20,
        width: 64,
        height: 64,
        borderRadius: "50%",
        background: accent,
        opacity: 0.14,
        filter: "blur(18px)",
        pointerEvents: "none",
      }}
    />
    <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
    <div
      style={{
        fontFamily: font,
        fontSize: 26,
        fontWeight: 700,
        color: accent,
        lineHeight: 1,
      }}
    >
      {value}
    </div>
    <div
      style={{
        fontFamily: fontSans,
        fontSize: 12,
        color: C.textMid,
        marginTop: 5,
      }}
    >
      {label}
    </div>
  </div>
);
