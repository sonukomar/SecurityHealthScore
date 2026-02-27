import { C } from "../helpers";
import "./TabBar.css";

export const TabBar = ({ tabs, active, onChange }) => (
  <div
    className="tab-bar"
    style={{
      "--tabbar-surface": C.surface,
      "--tabbar-border": C.border,
      "--tabbar-accent": C.cyan,
      "--tabbar-text-mid": C.textMid,
    }}
  >
    {tabs.map((t) => {
      const isActive = active === t.id;
      return (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={isActive ? "active" : "inactive"}
        >
          {t.label}
        </button>
      );
    })}
  </div>
);
