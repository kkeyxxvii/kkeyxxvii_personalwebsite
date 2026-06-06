"use client";

/**
 * RentalMarketplaceCard — animated thumbnail for the B2B Rental Marketplace project card.
 * Workorbits deep navy (#0d1b4b) with coral (#e84c3d) accent.
 * Shows a browser-frame mockup of the Workorbits marketing website with animated
 * client logo ticker and booking CTA cards.
 */

import { useEffect, useState } from "react";

const BRAND  = "#0d1b4b";
const ACCENT = "#e84c3d";

const CLIENTS = ["Paytm Insider", "AtomX", "Zomato", "BlinkIt", "Zepto", "Adani Realty"];

export default function RentalMarketplaceCard() {
  const [tick,      setTick]      = useState(0);
  const [logoIdx,   setLogoIdx]   = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 900);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setLogoIdx((l) => (l + 1) % CLIENTS.length), 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden"
      style={{ background: "#f0f2f5", fontFamily: "system-ui,sans-serif" }}
    >
      {/* ── Browser chrome ─────────────────────────── */}
      <div
        className="absolute inset-2 rounded-xl overflow-hidden flex flex-col"
        style={{
          boxShadow: "0 8px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10)",
          background: BRAND,
        }}
      >
        {/* Title bar */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-2 shrink-0"
          style={{ background: "#0a1652", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: "#ff5f57" }} />
          <span className="w-2 h-2 rounded-full" style={{ background: "#ffbc2e" }} />
          <span className="w-2 h-2 rounded-full" style={{ background: "#28c840" }} />
          <div
            className="flex-1 mx-2 rounded flex items-center gap-1.5 px-2"
            style={{ height: 13, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            <svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span style={{ fontSize: 5.5, color: "rgba(255,255,255,0.6)" }}>workorbits.com</span>
          </div>
        </div>

        {/* ── Site content ───────────────────────── */}
        <div className="flex-1 overflow-hidden flex flex-col">

          {/* Nav */}
          <div
            className="flex items-center justify-between px-3 py-1.5 shrink-0"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded" style={{ background: ACCENT }} />
              <span style={{ fontSize: 7, fontWeight: 700, color: "white", letterSpacing: "-0.01em" }}>workorbits</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="px-1.5 py-0.5 rounded"
                style={{ background: "rgba(255,255,255,0.12)", fontSize: 5, color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.15)" }}
              >
                Get Demo
              </div>
              <div
                className="px-1.5 py-0.5 rounded"
                style={{ background: ACCENT, fontSize: 5, color: "white", fontWeight: 700 }}
              >
                Get Listed
              </div>
            </div>
          </div>

          {/* Hero */}
          <div
            className="relative flex flex-col items-center justify-center text-center px-4 shrink-0"
            style={{ paddingTop: 10, paddingBottom: 10 }}
          >
            {/* Grid overlay */}
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
                                   linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
                backgroundSize: "18px 18px",
              }}
            />
            <h1 style={{ fontSize: 8.5, fontWeight: 800, color: "white", lineHeight: 1.3, maxWidth: 140, position: "relative" }}>
              A rental marketplace for booking on-demand temporary staff and venues
            </h1>
            <p style={{ fontSize: 5.5, color: "rgba(255,255,255,0.55)", marginTop: 4, maxWidth: 120, lineHeight: 1.4, position: "relative" }}>
              On-demand bookings tailored to your specific needs
            </p>

            {/* CTA cards */}
            <div className="flex gap-2 mt-3 w-full max-w-[160px]" style={{ position: "relative" }}>
              {[
                { title: "Get the Right Staff", sub: "Book temporary staff for your event", btn: "Book Staff", domain: "Workorbits" },
                { title: "Ready to Book?",       sub: "Find the ideal location for your event", btn: "Book Venue", domain: "Hourly.club" },
              ].map((card) => (
                <div
                  key={card.btn}
                  className="flex-1 flex flex-col items-center rounded-lg p-2"
                  style={{ background: "rgba(255,255,255,0.95)", border: "1px solid rgba(255,255,255,0.2)" }}
                >
                  <p style={{ fontSize: 5.5, fontWeight: 700, color: BRAND, textAlign: "center", lineHeight: 1.3, marginBottom: 3 }}>{card.title}</p>
                  <p style={{ fontSize: 4.5, color: "#666", textAlign: "center", lineHeight: 1.3, marginBottom: 4 }}>{card.sub}</p>
                  <div
                    className="w-full rounded flex items-center justify-center"
                    style={{ background: BRAND, padding: "2.5px 0", fontSize: 5, fontWeight: 700, color: "white" }}
                  >
                    {card.btn}
                  </div>
                  <p style={{ fontSize: 4, color: "#999", marginTop: 2 }}>{card.domain}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Client logos ticker */}
          <div
            className="mt-auto shrink-0 px-3 py-2"
            style={{ background: "rgba(255,255,255,0.95)", borderTop: "1px solid rgba(0,0,0,0.06)" }}
          >
            <p style={{ fontSize: 5, color: "#888", textAlign: "center", marginBottom: 4 }}>
              Tried, tested and trusted by hundreds of clients
            </p>
            <div className="flex items-center justify-between gap-1">
              {CLIENTS.map((name, i) => (
                <div
                  key={name}
                  className="flex items-center justify-center rounded"
                  style={{
                    flex: 1,
                    height: 12,
                    background: i === logoIdx ? "rgba(13,27,75,0.06)" : "transparent",
                    transition: "background 0.4s ease",
                  }}
                >
                  <span
                    style={{
                      fontSize: 4,
                      fontWeight: 700,
                      color: i === logoIdx ? BRAND : "#aaa",
                      letterSpacing: "0.02em",
                      transition: "color 0.4s ease",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Funding badge */}
          <div
            className="flex items-center justify-center gap-1 py-1 shrink-0"
            style={{ background: "#1a3470" }}
          >
            <span
              className="w-1 h-1 rounded-full"
              style={{ background: "#4caf50", opacity: tick % 2 === 0 ? 1 : 0.3, transition: "opacity 0.5s" }}
            />
            <span style={{ fontSize: 5, color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>
              🚀 We closed $300K in funding!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
