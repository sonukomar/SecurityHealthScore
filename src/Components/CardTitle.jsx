import { C, font } from "../helpers";

export const CardTitle = ({ children, accent = C.cyan }) => (
  <p
    style={{
      fontFamily: font,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      color: accent,
      marginBottom: 18,
    }}
  >
    {children}
  </p>
);
