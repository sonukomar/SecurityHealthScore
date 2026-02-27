import { C } from "../helpers";
import { labels } from "../helpers/labels";
import "./Footer.css";

export const Footer = () => (
  <footer
    className="footer"
    style={{
      "--footer-border": C.border,
      color: C.textLo,
    }}
  >
    {labels.Footer_Platform} &nbsp;·&nbsp; {labels.Footer_Analysis}
    &nbsp;·&nbsp; {labels.Footer_Data} &nbsp;·&nbsp; {labels.Footer}
  </footer>
);
