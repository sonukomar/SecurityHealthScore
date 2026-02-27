import { C } from "../helpers";
import "./CustomTooltip.css";

export const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="custom-tooltip"
      style={{
        "--tooltip-border-color": C.cyan,
        "--tooltip-accent-color": C.cyan,
        "--tooltip-text-hi": C.textHi,
      }}
    >
      <p className="tooltip-label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="tooltip-item" style={{ color: p.color }}>
          {p.name}: <span>{p.value}</span>
        </p>
      ))}
    </div>
  );
};
