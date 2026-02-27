import { C, font } from "../helpers";
import { useState, useEffect } from "react";
import { labels } from "../helpers/labels";

export const Header = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const id = setInterval(
      () => setTime(new Date().toLocaleTimeString()),
      1000,
    );
    return () => clearInterval(id);
  }, []);
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(6,8,15,0.88)",
        backdropFilter: "blur(14px)",
        borderBottom: `1px solid ${C.border}`,
        padding: "14px 36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: C.cyan,
            boxShadow: `0 0 10px ${C.cyan}`,
            animation: "blink 2s infinite",
          }}
        />
        <span
          style={{
            fontFamily: font,
            fontSize: 13,
            color: C.cyan,
            letterSpacing: "0.18em",
          }}
        >
          {labels.AppName}
        </span>
        <span style={{ fontFamily: font, fontSize: 11, color: C.textLo }}>
          / {labels.AppName_Sub}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontFamily: font,
            fontSize: 11,
            color: "#4ade80",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#4ade80",
              display: "inline-block",
              boxShadow: `0 0 6px #4ade80`,
            }}
          />
          LIVE
        </span>
        <span style={{ fontFamily: font, fontSize: 11, color: C.textLo }}>
          {time}
        </span>
      </div>
    </header>
  );
};
