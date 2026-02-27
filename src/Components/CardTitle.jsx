import { C } from "../helpers";
import "./CardTitle.css";

export const CardTitle = ({ children, accent = C.cyan }) => (
  <p className="card-title" style={{ color: accent }}>
    {children}
  </p>
);
