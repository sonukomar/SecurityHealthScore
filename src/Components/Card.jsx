import { C } from "../helpers";
import "./Card.css";

export const Card = ({ children, style = {}, glow }) => (
  <div
    className="card"
    style={{
      "--card-bg": C.card,
      "--card-border": C.border,
      boxShadow: glow
        ? `0 0 40px ${glow}18, 0 4px 24px rgba(0,0,0,0.4)`
        : "0 4px 20px rgba(0,0,0,0.3)",
      ...style,
    }}
  >
    {children}
  </div>
);
