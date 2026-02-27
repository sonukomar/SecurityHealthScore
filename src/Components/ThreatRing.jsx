import { C, font } from "../helpers";

export const ThreatRing = ({ score }) => {
  const r = 58;
  const circ = 2 * Math.PI * r;
  const fill = (circ * score) / 100;
  const color = score >= 70 ? C.cyan : score >= 50 ? C.yellow : C.red;
  return (
    <div
      style={{ position: "relative", width: 140, height: 140, flexShrink: 0 }}
    >
      <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="10"
        />
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={`${fill} ${circ}`}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: font,
            fontSize: 32,
            fontWeight: 700,
            color,
            lineHeight: 1,
          }}
        >
          {score}
        </span>
        <span style={{ fontFamily: font, fontSize: 10, color: C.textLo }}>
          &nbsp;/ 100
        </span>
      </div>
    </div>
  );
};
