import { C } from "../helpers";
import { useState, useEffect } from "react";
import { labels } from "../helpers/labels";
import "./Header.css";

export const Header = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const id = setInterval(
      () => setTime(new Date().toLocaleTimeString()),
      1000,
    );
    return () => clearInterval(id);
  }, []);

  const fetchData = () => {
    // Placeholder for fetch logic
    alert("Fetch data triggered!");
    fetch("/api/analyze")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data:", data);
        alert("Data fetched! Check console for details.");
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        alert("Failed to fetch data. Check console for details.");
      });
  };
  return (
    <header
      className="header"
      style={{
        "--header-border": C.border,
        "--header-accent": C.cyan,
        "--header-text-lo": C.textLo,
      }}
    >
      <div className="left-group">
        <div className="blink" />
        <button onClick={fetchData}>Fetch</button>
        <span className="app-name">{labels.AppName}</span>
        <span className="sub-name">/ {labels.AppName_Sub}</span>
      </div>
      <div className="status-group">
        <span className="status-live">
          <span className="blink" />
          LIVE
        </span>
        <span style={{ color: C.textLo }}>{time}</span>
      </div>
    </header>
  );
};
