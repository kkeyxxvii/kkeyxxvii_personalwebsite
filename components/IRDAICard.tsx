"use client";

/**
 * IRDAICard — animated thumbnail for the IRDAI Government Website Redesign project card.
 * IRDAI navy (#0d3880) brand with red (#c0392b) accent.
 * Shows a browser-frame mockup of the redesigned homepage with
 * hero section, nav bar, accessibility toolbar and key stats.
 */

import { useEffect, useState } from "react";

const BRAND  = "#0d3880";
const ACCENT = "#c0392b";
const WHITE  = "#ffffff";

const STATS = [
  { value: "50%", label: "A11y improvement"   },
  { value: "25%", label: "User retention"      },
  { value: "40%", label: "Complaint time ↓"   },
];

const NAV_ITEMS = ["Home", "Regulations", "Consumer", "About", "Contact"];

export default function IRDAICard() {
  const [tick,    setTick]    = useState(0);
  const [statIdx, setStatIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 900);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setStatIdx((s) => (s + 1) % STATS.length), 2400);
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
          background: WHITE,
        }}
      >
        {/* Title bar */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-2 shrink-0"
          style={{ background: "#f5f5f5", borderBottom: "1px solid rgba(0,0,0,0.07)" }}
        >
          {/* Traffic lights */}
          <span className="w-2 h-2 rounded-full" style={{ background: "#ff5f57" }} />
          <span className="w-2 h-2 rounded-full" style={{ background: "#ffbc2e" }} />
          <span className="w-2 h-2 rounded-full" style={{ background: "#28c840" }} />

          {/* URL bar */}
          <div
            className="flex-1 mx-2 rounded flex items-center gap-1.5 px-2"
            style={{
              height: 13,
              background: WHITE,
              border: "1px solid rgba(0,0,0,0.09)",
            }}
          >
            <svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span style={{ fontSize: 5.5, color: "#666", letterSpacing: 0 }}>irdai.gov.in</span>
          </div>
        </div>

        {/* ── Site content ───────────────────────── */}
        <div className="flex-1 overflow-hidden flex flex-col">

          {/* Top utility bar */}
          <div
            className="flex items-center justify-between px-3 py-1 shrink-0"
            style={{ background: BRAND, borderBottom: `2px solid ${ACCENT}` }}
          >
            <div className="flex items-center gap-1.5">
              {/* Ashoka emblem placeholder */}
              <div
                className="rounded-full flex items-center justify-center shrink-0"
                style={{ width: 10, height: 10, background: "rgba(255,255,255,0.2)" }}
              >
                <span style={{ fontSize: 6, color: WHITE }}>⊛</span>
              </div>
              <div>
                <p style={{ fontSize: 5.5, fontWeight: 700, color: WHITE, lineHeight: 1.2 }}>IRDAI</p>
                <p style={{ fontSize: 4.5, color: "rgba(255,255,255,0.65)", lineHeight: 1 }}>Govt. of India</p>
              </div>
            </div>

            {/* Accessibility + language pill */}
            <div className="flex items-center gap-1">
              <div
                className="flex items-center gap-0.5 px-1.5 py-0.5 rounded"
                style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}
              >
                <span style={{ fontSize: 5, color: "rgba(255,255,255,0.9)", fontWeight: 700 }}>A+</span>
                <span style={{ fontSize: 4.5, color: "rgba(255,255,255,0.55)" }}>|</span>
                <span style={{ fontSize: 5, color: "rgba(255,255,255,0.9)" }}>A</span>
                <span style={{ fontSize: 4.5, color: "rgba(255,255,255,0.55)" }}>|</span>
                <span style={{ fontSize: 5, color: "rgba(255,255,255,0.55)" }}>A−</span>
              </div>
              <div
                className="px-1.5 py-0.5 rounded"
                style={{ background: ACCENT, fontSize: 5, color: WHITE, fontWeight: 600 }}
              >
                हिन्दी
              </div>
            </div>
          </div>

          {/* Nav bar */}
          <div
            className="flex items-center gap-0 shrink-0"
            style={{ background: WHITE, borderBottom: "1px solid rgba(0,0,0,0.07)" }}
          >
            {NAV_ITEMS.map((item, i) => (
              <div
                key={item}
                className="px-2.5 py-1.5"
                style={{
                  fontSize: 5.5,
                  fontWeight: i === 0 ? 700 : 500,
                  color: i === 0 ? BRAND : "#444",
                  borderBottom: i === 0 ? `2px solid ${BRAND}` : "2px solid transparent",
                  whiteSpace: "nowrap",
                }}
              >
                {item}
              </div>
            ))}
            <div className="flex-1" />
            {/* Search icon */}
            <div className="px-2">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </div>
          </div>

          {/* Hero section */}
          <div
            className="relative shrink-0 overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${BRAND} 0%, #1a56b0 100%)`, height: "34%" }}
          >
            {/* Subtle grid pattern */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
                                   linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`,
                backgroundSize: "14px 14px",
              }}
            />
            <div className="relative flex h-full items-center px-3 gap-3">
              <div className="flex-1">
                <div
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded mb-1"
                  style={{ background: ACCENT, fontSize: 4.5, color: WHITE, fontWeight: 700, letterSpacing: "0.06em" }}
                >
                  WCAG 2.1 AA ✓
                </div>
                <h2 style={{ fontSize: 9, fontWeight: 700, color: WHITE, lineHeight: 1.3, maxWidth: 100 }}>
                  Insurance Regulatory &amp; Development Authority
                </h2>
                <p style={{ fontSize: 5.5, color: "rgba(255,255,255,0.65)", marginTop: 3, lineHeight: 1.4, maxWidth: 90 }}>
                  Protecting policyholders across India
                </p>
                {/* CTA buttons */}
                <div className="flex items-center gap-1.5 mt-2">
                  <div
                    className="px-2 py-1 rounded"
                    style={{ background: WHITE, fontSize: 5.5, fontWeight: 700, color: BRAND }}
                  >
                    File a Complaint
                  </div>
                  <div
                    className="px-2 py-1 rounded"
                    style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", fontSize: 5.5, color: WHITE }}
                  >
                    Find Policy →
                  </div>
                </div>
              </div>

              {/* Animated stat panel */}
              <div
                className="shrink-0 rounded-lg p-2 flex flex-col items-center justify-center"
                style={{
                  width: 54,
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div
                  key={statIdx}
                  style={{
                    animation: "irdai-fadein 0.4s ease forwards",
                    textAlign: "center",
                  }}
                >
                  <p style={{ fontSize: 14, fontWeight: 700, color: WHITE, lineHeight: 1 }}>
                    {STATS[statIdx].value}
                  </p>
                  <p style={{ fontSize: 4.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.3, marginTop: 2, maxWidth: 48 }}>
                    {STATS[statIdx].label}
                  </p>
                </div>
                {/* Dot indicators */}
                <div className="flex items-center gap-0.5 mt-2">
                  {STATS.map((_, i) => (
                    <span
                      key={i}
                      className="rounded-full"
                      style={{
                        width: i === statIdx ? 8 : 4,
                        height: 3,
                        background: i === statIdx ? WHITE : "rgba(255,255,255,0.35)",
                        transition: "all 0.3s ease",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick-access cards row */}
          <div className="flex gap-1.5 px-2 pt-1.5 pb-0 shrink-0">
            {[
              { icon: "📋", label: "Register Complaint", color: ACCENT    },
              { icon: "🔍", label: "Policy Finder",       color: BRAND     },
              { icon: "♿", label: "Accessibility",        color: "#2e7d32" },
              { icon: "📢", label: "Circulars",            color: "#6a1b9a" },
            ].map((card) => (
              <div
                key={card.label}
                className="flex-1 rounded-lg p-1.5 flex flex-col items-center gap-0.5"
                style={{
                  background: WHITE,
                  border: "1px solid rgba(0,0,0,0.07)",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                }}
              >
                <span style={{ fontSize: 9 }}>{card.icon}</span>
                <span style={{ fontSize: 4.5, fontWeight: 600, color: card.color, textAlign: "center", lineHeight: 1.3 }}>
                  {card.label}
                </span>
              </div>
            ))}
          </div>

          {/* Ticker / notice bar */}
          <div
            className="flex items-center gap-2 px-2 py-1 mt-auto shrink-0"
            style={{ background: "#fff8e1", borderTop: "1px solid #ffe082" }}
          >
            <span
              className="px-1 py-0.5 rounded shrink-0"
              style={{ background: ACCENT, fontSize: 4.5, fontWeight: 700, color: WHITE }}
            >
              NOTICE
            </span>
            <div className="overflow-hidden flex-1">
              <span
                style={{
                  fontSize: 5,
                  color: "#555",
                  display: "block",
                  whiteSpace: "nowrap",
                  animation: "irdai-ticker 12s linear infinite",
                }}
              >
                New circular: Master Circular on Health Insurance Products (June 2021) · Public Notice: Protection of Policyholders' Interests &nbsp;&nbsp;&nbsp;&nbsp;
                New circular: Master Circular on Health Insurance Products (June 2021) · Public Notice: Protection of Policyholders' Interests
              </span>
            </div>
            {/* Live pulse */}
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{
                background: "#4caf50",
                opacity: tick % 2 === 0 ? 1 : 0.3,
                transition: "opacity 0.5s",
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes irdai-fadein {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        @keyframes irdai-ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
