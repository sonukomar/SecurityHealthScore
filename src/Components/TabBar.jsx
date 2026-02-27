import { C, font } from "../helpers";

export const TabBar = ({ tabs, active, onChange }) => (
  <div
    style={{
      display: "flex",
      gap: 4,
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 12,
      padding: 4,
      width: "fit-content",
    }}
  >
    {tabs.map((t) => (
      <button
        key={t.id}
        onClick={() => onChange(t.id)}
        style={{
          fontFamily: font,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          padding: "8px 18px",
          borderRadius: 8,
          border: "none",
          cursor: "pointer",
          transition: "all 0.18s ease",
          background: active === t.id ? C.cyan : "transparent",
          color: active === t.id ? "#06080f" : C.textMid,
          boxShadow: active === t.id ? `0 0 16px ${C.cyan}55` : "none",
        }}
      >
        {t.label}
      </button>
    ))}
  </div>
);
