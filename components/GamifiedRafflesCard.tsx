"use client";

/**
 * GamifiedRafflesCard — animated thumbnail for the Playfora / Gamified Raffles project card.
 * Royal blue (#2D3BFF) background. Shows a play card feed with entry fee badges,
 * host avatars, remaining spots, and a pulsing "LIVE" draw indicator.
 */

import { useEffect, useState } from "react";

const BRAND = "#2D3BFF";

const PLAYS = [
  { host: "Kicks818",     title: "April SB × Nike Dunk",  fee: 10, remaining: "2/10", paid: "#1a73e8" },
  { host: "Amelie",       title: "ASOS Floral Wrap Dress", fee: 20, remaining: "4/10", paid: "#e53935" },
  { host: "Vintagemen..", title: "90s Leather Jacket",     fee: 15, remaining: "7/10", paid: "#1a73e8" },
  { host: "Michaelko..",  title: "Hermès Mini Oran",       fee: 50, remaining: "1/10", paid: "#e53935" },
];

export default function GamifiedRafflesCard() {
  const [tick,   setTick]   = useState(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1100);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % PLAYS.length), 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden"
      style={{ background: BRAND, fontFamily: "system-ui,sans-serif" }}
    >
      {/* subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative flex h-full p-3 gap-2">

        {/* LEFT — play card feed */}
        <div className="flex-1 flex flex-col gap-2">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <span style={{ fontSize: 8.5, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>Plays</span>
            <span
              className="flex items-center gap-1 px-1.5 py-0.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              <span
                className="w-1 h-1 rounded-full"
                style={{ background: "#4ade80", opacity: tick % 2 === 0 ? 1 : 0.3, transition: "opacity 0.4s" }}
              />
              <span style={{ fontSize: 5.5, color: "rgba(255,255,255,0.8)", fontWeight: 700 }}>LIVE DRAW</span>
            </span>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            {["Feeds","Followed","Joined"].map((t, i) => (
              <span
                key={t}
                className="pb-0.5"
                style={{
                  fontSize: 6.5,
                  fontWeight: i === 0 ? 700 : 400,
                  color: i === 0 ? "white" : "rgba(255,255,255,0.45)",
                  borderBottom: i === 0 ? "1.5px solid white" : "1.5px solid transparent",
                }}
              >
                {t}
              </span>
            ))}
          </div>

          {/* Play cards */}
          <div className="flex-1 flex flex-col gap-2 overflow-hidden">
            {PLAYS.map((play, i) => (
              <div
                key={i}
                className="rounded-lg overflow-hidden flex-1"
                style={{
                  background: i === active ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.07)",
                  border: i === active ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(255,255,255,0.08)",
                  transition: "background 0.4s, border-color 0.4s",
                }}
              >
                <div className="relative h-full flex flex-col justify-between p-2">
                  {/* Host + bookmark */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div
                        className="w-3.5 h-3.5 rounded-full"
                        style={{ background: `hsl(${i * 60}, 60%, 65%)` }}
                      />
                      <span style={{ fontSize: 6.5, color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{play.host}</span>
                    </div>
                    <svg width="8" height="9" viewBox="0 0 24 28" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2">
                      <path d="M5 3h14a1 1 0 0 1 1 1v20l-8-5-8 5V4a1 1 0 0 1 1-1z"/>
                    </svg>
                  </div>

                  {/* Title */}
                  <p style={{ fontSize: 7, fontWeight: 600, color: "white", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {play.title}
                  </p>

                  {/* Entry fee + remaining */}
                  <div className="flex items-center justify-between">
                    <div
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded"
                      style={{ background: "rgba(0,0,0,0.35)" }}
                    >
                      <span style={{ fontSize: 5.5, color: "rgba(255,255,255,0.85)" }}>Entry: $ {play.fee}</span>
                      <span
                        className="text-[5px] font-bold px-0.5 rounded"
                        style={{ color: play.paid, background: "white", lineHeight: 1.4 }}
                      >
                        {play.paid === "#1a73e8" ? "VISA" : "●"}
                      </span>
                    </div>
                    <span style={{ fontSize: 5.5, color: "rgba(255,255,255,0.5)" }}>
                      Spots: <strong style={{ color: "rgba(255,255,255,0.8)" }}>{play.remaining}</strong>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — mini stats */}
        <div className="flex flex-col gap-2" style={{ width: "34%" }}>
          {/* Play for Good */}
          <div
            className="rounded-lg p-2 flex flex-col gap-1"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.14)" }}
          >
            <span style={{ fontSize: 7, fontWeight: 700, color: "white" }}>Play for Good</span>
            <div className="flex items-center gap-1">
              <span style={{ fontSize: 16 }}>💚</span>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: "white", lineHeight: 1 }}>1%</p>
                <p style={{ fontSize: 5.5, color: "rgba(255,255,255,0.55)" }}>of every play</p>
              </div>
            </div>
          </div>

          {/* Odds widget */}
          <div
            className="rounded-lg p-2 flex-1 flex flex-col"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.14)" }}
          >
            <span style={{ fontSize: 7, fontWeight: 700, color: "white", marginBottom: 4 }}>Your Odds</span>
            <div className="flex-1 flex flex-col justify-center gap-1.5">
              {[
                { label: "1 entry",  odds: "10%" },
                { label: "3 entries",odds: "30%" },
                { label: "5 entries",odds: "50%" },
              ].map((o, oi) => (
                <div key={o.label} className="flex items-center justify-between">
                  <span style={{ fontSize: 5.5, color: "rgba(255,255,255,0.5)" }}>{o.label}</span>
                  <div className="flex items-center gap-1">
                    <div className="rounded-full" style={{ height: 3, width: 28, background: "rgba(255,255,255,0.12)" }}>
                      <div className="rounded-full h-full" style={{ width: o.odds, background: oi === 2 ? "#4ade80" : "rgba(255,255,255,0.5)" }} />
                    </div>
                    <span style={{ fontSize: 6, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>{o.odds}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div
            className="rounded-lg py-2 flex items-center justify-center"
            style={{ background: "white" }}
          >
            <span style={{ fontSize: 7.5, fontWeight: 700, color: BRAND }}>Let&apos;s play →</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gr-fadein {
          from { opacity: 0; transform: translateY(3px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
