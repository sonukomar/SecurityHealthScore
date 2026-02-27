import { C, font } from "../helpers";
import { labels } from "../helpers/labels";

export const Footer = () => (
  <footer
    style={{
      textAlign: "center",
      padding: "24px 36px",
      borderTop: `1px solid ${C.border}`,
      fontFamily: font,
      fontSize: 10,
      color: C.textLo,
      letterSpacing: "0.1em",
    }}
  >
    {labels.Footer_Platform} &nbsp;·&nbsp; {labels.Footer_Analysis}
    &nbsp;·&nbsp; {labels.Footer_Data} &nbsp;·&nbsp; {labels.Footer}
  </footer>
);
