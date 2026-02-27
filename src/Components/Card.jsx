import { C } from "../helpers";

export const Card = ({ children, style = {}, glow }) => (
  <div
    style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 14,
      padding: 22,
      boxShadow: glow
        ? `0 0 40px ${glow}18, 0 4px 24px rgba(0,0,0,0.4)`
        : "0 4px 20px rgba(0,0,0,0.3)",
      ...style,
    }}
  >
    {children}
  </div>
);
