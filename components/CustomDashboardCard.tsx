"use client";

/**
 * CustomDashboardCard — animated thumbnail for the Custom Dashboard project card.
 * Dark navy background. Shows a live-feed widget row + mini bar chart + alarm console.
 * Rows fade in staggered; one row has a red "Denied" blink.
 */

import { useEffect, useState } from "react";

const ROWS = [
  { time: "10:42:18", user: "James Wilson",  door: "Main Entrance",   action: "Granted",   ac: "#16a34a", ab: "#f0fdf4" },
  { time: "10:41:55", user: "Sarah Chen",    door: "Server Room",     action: "Denied",    ac: "#ef4444", ab: "#fef2f2" },
  { time: "10:41:30", user: "Mark Johnson",  door: "Floor 3 East",    action: "Granted",   ac: "#16a34a", ab: "#f0fdf4" },
  { time: "10:40:12", user: "Lisa Park",     door: "Parking B",       action: "Granted",   ac: "#16a34a", ab: "#f0fdf4" },
  { time: "10:39:44", user: "Tom Bradley",   door: "Server Room",     action: "Door Held", ac: "#ea580c", ab: "#fff7ed" },
];

const BARS = [18, 35, 72, 89, 61, 44, 80, 95, 70, 52, 36, 18];

export default function CustomDashboardCard() {
  const [tick, setTick]     = useState(0);
  const [blink, setBlink]   = useState(false);

  /* Pulse live indicator */
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1200);
    return () => clearInterval(id);
  }, []);

  /* Blink the Denied row */
  useEffect(() => {
    const id = setInterval(() => setBlink((b) => !b), 900);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden"
      style={{ background: "#0e1b2e", fontFamily: "system-ui,sans-serif" }}
    >
      {/* subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative flex h-full p-3 gap-2">
        {/* LEFT: Access Log Live Feed */}
        <div
          className="flex-1 flex flex-col rounded-lg overflow-hidden"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          {/* widget header */}
          <div
            className="flex items-center justify-between px-2.5 py-1.5 shrink-0"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <span style={{ fontSize: 8, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>
              Access Log Live Feed
            </span>
            <span
              className="flex items-center gap-1 px-1.5 py-0.5 rounded-full"
              style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.2)" }}
            >
              <span
                className="w-1 h-1 rounded-full"
                style={{
                  background: "#22c55e",
                  opacity: tick % 2 === 0 ? 1 : 0.3,
                  transition: "opacity 0.4s",
                }}
              />
              <span style={{ fontSize: 6, color: "#4ade80", fontWeight: 600 }}>LIVE</span>
            </span>
          </div>

          {/* table header */}
          <div
            className="grid px-2 pt-1.5 pb-1"
            style={{ gridTemplateColumns: "0.55fr 1fr 1fr 0.75fr", gap: "0 4px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}
          >
            {["Time","User","Door","Action"].map((h) => (
              <span key={h} style={{ fontSize: 6.5, color: "rgba(255,255,255,0.25)" }}>{h}</span>
            ))}
          </div>

          {/* rows */}
          <div className="flex-1 overflow-hidden px-2 pt-1 flex flex-col">
            {ROWS.map((row, i) => (
              <div
                key={i}
                className="grid items-center py-1"
                style={{
                  gridTemplateColumns: "0.55fr 1fr 1fr 0.75fr",
                  gap: "0 4px",
                  borderBottom: "1px solid rgba(255,255,255,0.03)",
                  opacity: i === 1 ? (blink ? 1 : 0.6) : 1,
                  transition: "opacity 0.4s",
                  animationDelay: `${i * 0.12}s`,
                  animation: "io-fadein 0.5s ease both",
                }}
              >
                <span style={{ fontSize: 6.5, color: "rgba(255,255,255,0.3)" }}>{row.time}</span>
                <span style={{ fontSize: 7, color: "rgba(255,255,255,0.7)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.user}</span>
                <span style={{ fontSize: 7, color: "rgba(255,255,255,0.4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.door}</span>
                <span
                  className="px-1 py-0.5 rounded w-fit"
                  style={{ fontSize: 6, fontWeight: 600, background: row.ab + "22", color: row.ac }}
                >
                  {row.action}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT column: two mini widgets */}
        <div className="flex flex-col gap-2" style={{ width: "38%" }}>
          {/* Daily Arrival chart */}
          <div
            className="flex-1 flex flex-col rounded-lg overflow-hidden"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div
              className="flex items-center justify-between px-2.5 py-1.5 shrink-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <span style={{ fontSize: 7.5, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>Daily Arrival</span>
              <span style={{ fontSize: 6.5, color: "rgba(255,255,255,0.25)" }}>Today</span>
            </div>
            <div className="flex-1 px-2 py-1.5 flex flex-col justify-end gap-1">
              <div className="flex items-end gap-0.5" style={{ height: 36 }}>
                {BARS.map((h, bi) => (
                  <div
                    key={bi}
                    className="flex-1 rounded-sm"
                    style={{
                      height: `${h}%`,
                      background: bi === 7 ? "#1677ff" : "rgba(22,119,255,0.25)",
                      transition: "height 0.6s ease",
                    }}
                  />
                ))}
              </div>
              <p style={{ fontSize: 7, color: "rgba(255,255,255,0.5)" }}>
                <strong style={{ color: "rgba(255,255,255,0.85)", fontSize: 11 }}>247</strong> arrivals
              </p>
            </div>
          </div>

          {/* Alarm Console */}
          <div
            className="flex-1 flex flex-col rounded-lg overflow-hidden"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div
              className="flex items-center justify-between px-2.5 py-1.5 shrink-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <span style={{ fontSize: 7.5, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>Alarms</span>
              <span
                className="px-1.5 py-0.5 rounded-full"
                style={{ background: "rgba(239,68,68,0.15)", fontSize: 6, color: "#f87171", fontWeight: 700 }}
              >
                3 ACTIVE
              </span>
            </div>
            <div className="flex-1 px-2 py-1.5 flex flex-col gap-1 overflow-hidden">
              {[
                { name: "Door Held Open",    sev: "High",   c: "#ef4444" },
                { name: "Motion After Hours",sev: "Medium", c: "#ea580c" },
                { name: "Tailgate Attempt",  sev: "High",   c: "#ef4444" },
              ].map((a, ai) => (
                <div
                  key={ai}
                  className="flex items-center justify-between px-1.5 py-1 rounded"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <span style={{ fontSize: 6.5, color: "rgba(255,255,255,0.6)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 70 }}>{a.name}</span>
                  <span className="shrink-0" style={{ fontSize: 6, color: a.c, fontWeight: 600 }}>{a.sev}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes io-fadein {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
