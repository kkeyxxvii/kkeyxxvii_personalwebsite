"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import CaseStudyBreadcrumb from "@/components/CaseStudyBreadcrumb";

/* ─── Constants ────────────────────────────────────── */
const NAV_SECTIONS = [
  { id: "overview",    label: "Overview"        },
  { id: "problem",     label: "Problem"          },
  { id: "process",     label: "Process"          },
  { id: "research",    label: "Research"         },
  { id: "iterations",  label: "Iterations"       },
  { id: "solutions",   label: "Solution Screens" },
  { id: "beforeafter", label: "Before & After"   },
  { id: "future",      label: "Future Scope"     },
  { id: "tradeoffs",   label: "Tradeoffs"        },
  { id: "reflection",  label: "Reflection"       },
];

const BODY_COLOR = "#32404f";
const FADED      = "rgba(50,64,79,0.55)";
const BORDER     = "rgba(50,64,79,0.1)";
const SERIF      = "Georgia,'Times New Roman',serif";
const MONO       = "var(--font-geist-mono),monospace";
const BRAND      = "#2D3BFF";

/* ─── Sidebar ──────────────────────────────────────── */
function Sidebar({ active }: { active: string }) {
  return (
    <aside className="hidden lg:block w-[188px] shrink-0">
      <div className="sticky top-[72px]">
        <p style={{
          fontFamily: MONO, fontSize: 12, textTransform: "uppercase",
          letterSpacing: "0.12em", color: "rgba(50,64,79,0.35)",
          marginBottom: 10, paddingLeft: 14,
        }}>
          Contents
        </p>
        <nav className="flex flex-col" style={{ borderLeft: "1px solid rgba(50,64,79,0.12)" }}>
          {NAV_SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() =>
                document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
              className="text-left cursor-pointer"
              style={{
                fontSize: 13,
                fontWeight: active === s.id ? 500 : 400,
                color: active === s.id ? BODY_COLOR : "rgba(50,64,79,0.38)",
                background: "transparent",
                border: "none",
                borderLeft: active === s.id ? "2px solid #FF2929" : "2px solid transparent",
                marginLeft: -1,
                borderRadius: "0 6px 6px 0",
                padding: "6px 14px",
                width: "calc(100% + 1px)",
                transition: "all .2s ease",
              }}
            >
              {s.label}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}

/* ─── Scroll reveal ────────────────────────────────── */
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Animated counter ─────────────────────────────── */
function Counter({ value, suffix = "" }: { value: string; suffix?: string }) {
  const ref    = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    if (!inView) return;
    const numeric = parseFloat(value.replace(/[^0-9.]/g, ""));
    if (isNaN(numeric)) { setDisplay(value); return; }
    const start  = Date.now();
    const dur    = 1400;
    const prefix = value.match(/^[^0-9]*/)?.[0] ?? "";
    const suf    = value.match(/[^0-9.]+$/)?.[0] ?? suffix;
    const isInt  = !value.includes(".");
    const raf = () => {
      const p    = Math.min((Date.now() - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const cur  = numeric * ease;
      setDisplay(prefix + (isInt ? Math.round(cur) : cur.toFixed(1)) + suf);
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [inView, value, suffix]);
  return <span ref={ref}>{display}</span>;
}

/* ─── Helpers ──────────────────────────────────────── */
function SectionLabel({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-4 mb-5">
      <span
        className="uppercase shrink-0"
        style={{ fontFamily: MONO, fontSize: 12, color: FADED, letterSpacing: "0.1em" }}
      >
        {children}
      </span>
      <div style={{ flex: 1, height: "0.5px", background: BORDER }} />
    </div>
  );
}
function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontFamily: SERIF, fontSize: "clamp(1.65rem,3vw,2.1rem)", fontWeight: 400, color: BODY_COLOR, lineHeight: 1.2, marginBottom: "1rem" }}>
      {children}
    </h2>
  );
}
function Body({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={className} style={{ fontSize: 15, color: FADED, lineHeight: 1.65 }}>
      {children}
    </p>
  );
}
function HoverCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      whileHover={{ y: -3, boxShadow: "0 8px 28px rgba(50,64,79,0.10)" }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Phone frame ──────────────────────────────────── */
function PhoneFrame({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  const bg = dark ? "#111" : "white";
  return (
    <motion.div
      className="relative mx-auto overflow-hidden"
      style={{
        width: 260,
        borderRadius: 36,
        border: "6px solid #1a1a2e",
        boxShadow: "0 20px 64px rgba(0,0,0,0.22)",
        background: bg,
      }}
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Status bar */}
      <div
        className="flex items-center justify-between px-4 pt-2.5 pb-1 shrink-0"
        style={{ background: dark ? "#111" : "white" }}
      >
        <span style={{ fontSize: 10.5, fontWeight: 700, color: dark ? "white" : "#1a1a2e" }}>8:27</span>
        <div className="flex items-center gap-1">
          {/* Signal bars */}
          <svg width="11" height="8" viewBox="0 0 22 16" fill={dark ? "white" : "#1a1a2e"}>
            <rect x="0" y="8"  width="4" height="8"  rx="1"/>
            <rect x="6" y="5"  width="4" height="11" rx="1"/>
            <rect x="12" y="2" width="4" height="14" rx="1"/>
            <rect x="18" y="0" width="4" height="16" rx="1"/>
          </svg>
          {/* Wifi */}
          <svg width="12" height="9" viewBox="0 0 24 18" fill="none" stroke={dark ? "white" : "#1a1a2e"} strokeWidth="2.2" strokeLinecap="round">
            <path d="M1 5C7 -1 17 -1 23 5"/><path d="M5 9c4-4 10-4 14 0"/><path d="M9 13c2-2 6-2 8 0"/><circle cx="13" cy="17" r="1" fill={dark ? "white" : "#1a1a2e"} stroke="none"/>
          </svg>
          {/* Battery */}
          <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
            <div style={{ width: 18, height: 9, border: `1.5px solid ${dark ? "white" : "#1a1a2e"}`, borderRadius: 2.5, padding: 1.5 }}>
              <div style={{ width: "97%", height: "100%", background: dark ? "white" : "#1a1a2e", borderRadius: 1 }} />
            </div>
            <div style={{ width: 2, height: 4, background: dark ? "white" : "#1a1a2e", borderRadius: 1 }} />
          </div>
        </div>
      </div>
      {children}
      {/* Home indicator */}
      <div className="flex justify-center pb-2 pt-1" style={{ background: dark ? "#111" : "white" }}>
        <div style={{ width: 60, height: 4, background: dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.12)", borderRadius: 2 }} />
      </div>
    </motion.div>
  );
}

/* ─── Bottom Nav ───────────────────────────────────── */
function BottomNav({ active = "plays", dark = false }: { active?: string; dark?: boolean }) {
  const items = [
    { id: "plays",  label: "Plays",       icon: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" fill="currentColor"/> },
    { id: "wallet", label: "Wallet",      icon: <><rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" fill="none"/><path d="M16 14h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M2 11h20" stroke="currentColor" strokeWidth="1.8"/></> },
    { id: "create", label: "Create Play", icon: <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/> },
    { id: "activity",label:"Activity",   icon: <><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" fill="none"/><path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></> },
    { id: "settings",label:"Settings",   icon: <><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" fill="none"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="1.8" fill="none"/></> },
  ];
  return (
    <div className="flex items-center justify-around px-2 py-2 shrink-0"
      style={{ borderTop: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "#f0f0f0"}`, background: dark ? "#111" : "white" }}>
      {items.map((item) => (
        <div key={item.id} className="flex flex-col items-center gap-0.5" style={{ minWidth: 36 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            style={{ color: item.id === active ? BRAND : (dark ? "rgba(255,255,255,0.4)" : "#9ca3af") }}>
            {item.icon}
          </svg>
          <span style={{ fontSize: 6.5, color: item.id === active ? BRAND : (dark ? "rgba(255,255,255,0.4)" : "#9ca3af"), fontWeight: item.id === active ? 600 : 400 }}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Play Card ─────────────────────────────────────── */
function PlayCard({ host, title, fee, remaining, total, payIcon = "visa" }: {
  host: string; title: string; fee: number; remaining: string; total: number; payIcon?: string;
}) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "#1c1c1e" }}>
      {/* Card image area */}
      <div className="relative" style={{ height: 90, background: "linear-gradient(145deg,#2a2a2e,#1a1a1e)" }}>
        {/* Host avatar + name */}
        <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
          <div className="w-4 h-4 rounded-full overflow-hidden" style={{ background: "#555", border: "1px solid rgba(255,255,255,0.3)" }}>
            <div className="w-full h-full" style={{ background: "linear-gradient(135deg,#888,#555)" }} />
          </div>
          <span style={{ fontSize: 6.5, color: "white", fontWeight: 500 }}>{host}</span>
        </div>
        {/* Bookmark */}
        <div className="absolute top-1.5 right-1.5">
          <svg width="10" height="12" viewBox="0 0 24 28" fill="none" stroke="white" strokeWidth="2">
            <path d="M5 3h14a1 1 0 0 1 1 1v20l-8-5-8 5V4a1 1 0 0 1 1-1z"/>
          </svg>
        </div>
        {/* Entry fee badge */}
        <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 px-1.5 py-0.5 rounded" style={{ background: "rgba(0,0,0,0.55)" }}>
          <span style={{ fontSize: 6, color: "white" }}>Entry Fee : $ {fee}</span>
          {payIcon === "visa" ? (
            <span style={{ fontSize: 5.5, fontWeight: 700, color: "#1a73e8", background: "white", borderRadius: 2, padding: "0 2px" }}>VISA</span>
          ) : (
            <div className="w-3 h-3 rounded-full" style={{ background: "linear-gradient(135deg,#e53935,#c62828)", border: "1px solid rgba(255,255,255,0.3)" }} />
          )}
        </div>
      </div>
      {/* Card footer */}
      <div className="px-2 py-1.5">
        <p style={{ fontSize: 7.5, fontWeight: 600, color: "white", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</p>
        <p style={{ fontSize: 6.5, color: "rgba(255,255,255,0.5)" }}>Remaining Spots : <strong style={{ color: "rgba(255,255,255,0.8)" }}>{remaining}</strong></p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════ */
/*  SCREENS DATA                                        */
/* ═══════════════════════════════════════════════════ */
const SCREENS = [
  {
    label: "Onboarding",
    num: "01",
    subtitle: "Value Proposition Splash",
    before: "No onboarding at all — the app opened directly to a blank listings page. New users had zero context for what a 'Play' was, why it cost $10 to enter, or how a winner was chosen. Drop-off on first launch was 68%.",
    after: "Single-screen splash with a kinetic product collage, the tagline 'Shop to win. Play for good.', a one-line benefit statement, and a single 'Let's play' CTA. First-launch completion rose to 91%.",
    decision: "Collage layout over a tutorial carousel. Four product photos (sneaker, vinyl, trading card, handbag) placed in coloured geometric masks communicate category breadth instantly without requiring a swipe. The value prop is one sentence. The CTA is one button.",
    screen: (
      <PhoneFrame>
        <div className="flex flex-col" style={{ background: "white", minHeight: 480 }}>
          {/* Logo */}
          <div className="px-4 pt-1">
            <svg width="22" height="22" viewBox="0 0 40 40">
              <path d="M20 4 L20 16" stroke="#EA4335" strokeWidth="4" strokeLinecap="round"/>
              <path d="M20 24 L20 36" stroke="#34A853" strokeWidth="4" strokeLinecap="round"/>
              <path d="M4 20 L16 20"  stroke="#FBBC04" strokeWidth="4" strokeLinecap="round"/>
              <path d="M24 20 L36 20" stroke="#4285F4" strokeWidth="4" strokeLinecap="round"/>
              <path d="M7 7 L15 15"   stroke="#EA4335" strokeWidth="4" strokeLinecap="round"/>
              <path d="M25 25 L33 33" stroke="#34A853" strokeWidth="4" strokeLinecap="round"/>
              <path d="M33 7 L25 15"  stroke="#FBBC04" strokeWidth="4" strokeLinecap="round"/>
              <path d="M7 33 L15 25"  stroke="#4285F4" strokeWidth="4" strokeLinecap="round"/>
            </svg>
          </div>
          {/* Collage */}
          <div className="relative flex-1 flex items-center justify-center" style={{ minHeight: 260 }}>
            {/* Center pill — sneaker */}
            <div className="absolute" style={{ left: "50%", top: 16, transform: "translateX(-50%)", width: 64, height: 140, borderRadius: 36, background: "#e63b2e", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 52, height: 52, background: "linear-gradient(135deg,#f0f0f0,#d0d0d0)", borderRadius: "50% 40% 40% 50%", transform: "rotate(-20deg)" }} />
            </div>
            {/* Top-left — vinyl */}
            <div className="absolute" style={{ left: 8, top: 60, width: 64, height: 64, borderRadius: 8, background: "linear-gradient(135deg,#ffb3c8,#ff6b9d)", transform: "rotate(-15deg)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#222", border: "4px solid #555" }} />
            </div>
            {/* Top-right — trading card */}
            <div className="absolute" style={{ right: 8, top: 60, width: 60, height: 80, borderRadius: 6, background: "linear-gradient(135deg,#4285f4,#1a56db)", transform: "rotate(12deg)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 18 }}>🃏</div>
            </div>
            {/* Bottom-left — handbag */}
            <div className="absolute" style={{ left: 18, bottom: 20, width: 56, height: 42, borderRadius: 8, background: "linear-gradient(135deg,#f97316,#ea580c)", transform: "rotate(8deg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="16" viewBox="0 0 24 20" fill="none" stroke="white" strokeWidth="1.8"><path d="M3 7h18l-2 12H5L3 7z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/></svg>
            </div>
            {/* Bottom-right — jeans */}
            <div className="absolute" style={{ right: 18, bottom: 20, width: 50, height: 56, borderRadius: 8, background: "linear-gradient(135deg,#60a5fa,#3b82f6)", transform: "rotate(-10deg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="22" viewBox="0 0 24 28" fill="none" stroke="white" strokeWidth="1.8"><path d="M4 2h16v6l-4 8v10H4V16L2 8V2z"/><path d="M12 8v8"/></svg>
            </div>
          </div>
          {/* Hero text */}
          <div className="px-5 pb-1 text-center">
            <p style={{ fontSize: 20, fontWeight: 800, color: "#1a1a2e", lineHeight: 1.15, marginBottom: 6 }}>Shop to win.<br />Play for good.</p>
            <p style={{ fontSize: 10, color: "#6b7280", lineHeight: 1.5, marginBottom: 16 }}>The world's most playful and charitable buying and selling experience.</p>
            <div className="w-full py-3 rounded-2xl flex items-center justify-center" style={{ background: BRAND }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "white" }}>Let's play</span>
            </div>
          </div>
        </div>
      </PhoneFrame>
    ),
  },
  {
    label: "Feeds",
    num: "02",
    subtitle: "Discovery — Feeds Tab",
    before: "A flat, paginated list of all active listings sorted by newest first — identical to every other marketplace. No social layer, no categories, no way to follow sellers you trusted. Discovery was luck.",
    after: "Three-layer discovery: Play Hosts (creator-first following row), Categories (browsable by interest), and Trending Plays (algorithmically surfaced). Users find items through creators they trust, not just search.",
    decision: "Creator-first architecture over item-first grid. Play Hosts are promoted above categories because trust in a seller drives entry conversion more than item photography. Tabs — Feeds, Followed, Joined, Viewed — map to four distinct user mindsets in one session.",
    screen: (
      <PhoneFrame>
        <div className="flex flex-col" style={{ background: "white" }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 shrink-0">
            <span style={{ fontSize: 17, fontWeight: 700, color: "#1a1a2e" }}>Plays</span>
            <div className="w-7 h-7 rounded-full overflow-hidden" style={{ background: "linear-gradient(135deg,#a78bfa,#7c3aed)", border: "2px solid #e8e8e8" }}>
              <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#c4b5fd,#8b5cf6)" }} />
            </div>
          </div>
          {/* Search */}
          <div className="px-4 pb-2 shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: "#f3f4f6" }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <span style={{ fontSize: 10, color: "#9ca3af" }}>Search here</span>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex px-4 mb-3 shrink-0" style={{ borderBottom: "1px solid #f0f0f0" }}>
            {["Feeds","Followed","Joined","Viewed"].map((t) => (
              <div key={t} className="mr-4 pb-1.5" style={{ borderBottom: t === "Feeds" ? `2px solid ${BRAND}` : "2px solid transparent" }}>
                <span style={{ fontSize: 10, fontWeight: t === "Feeds" ? 600 : 400, color: t === "Feeds" ? BRAND : "#9ca3af" }}>{t}</span>
              </div>
            ))}
          </div>
          {/* Play Hosts */}
          <div className="px-4 mb-3">
            <p style={{ fontSize: 11, fontWeight: 700, color: "#1a1a2e", marginBottom: 8 }}>Play Hosts</p>
            <div className="flex gap-3 overflow-hidden">
              {[
                { name: "Kicks818",    cat: "Sneakers",  bg: "linear-gradient(135deg,#a78bfa,#7c3aed)" },
                { name: "Vintagemen..",cat: "Jackets",   bg: "linear-gradient(135deg,#60a5fa,#2563eb)" },
                { name: "Phonedephia", cat: "Gadgets",   bg: "linear-gradient(135deg,#4b5563,#1f2937)" },
                { name: "Michaelko..", cat: "Handbags",  bg: "linear-gradient(135deg,#f97316,#c2410c)" },
              ].map((h) => (
                <div key={h.name} className="flex flex-col items-center shrink-0" style={{ width: 48 }}>
                  <div className="w-10 h-10 rounded-full mb-1" style={{ background: h.bg }} />
                  <span style={{ fontSize: 6.5, color: "#1a1a2e", textAlign: "center", fontWeight: 500 }}>{h.name}</span>
                  <span style={{ fontSize: 6, color: "#9ca3af", textAlign: "center" }}>{h.cat}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Categories */}
          <div className="px-4 mb-3">
            <p style={{ fontSize: 11, fontWeight: 700, color: "#1a1a2e", marginBottom: 8 }}>Categories</p>
            <div className="flex gap-2 overflow-hidden">
              {[
                { name: "Jewellery",     bg: "#f3f4f6", emoji: "💍" },
                { name: "Trading cards", bg: "#eff6ff", emoji: "🃏" },
                { name: "Sneakers",      bg: "#f0fdf4", emoji: "👟" },
                { name: "Men's Fashion", bg: "#fdf2f8", emoji: "👔" },
              ].map((c) => (
                <div key={c.name} className="flex flex-col items-center shrink-0" style={{ width: 56 }}>
                  <div className="w-12 h-12 rounded-lg mb-1 flex items-center justify-center" style={{ background: c.bg, border: "1px solid rgba(0,0,0,0.06)" }}>
                    <span style={{ fontSize: 18 }}>{c.emoji}</span>
                  </div>
                  <span style={{ fontSize: 6.5, color: "#1a1a2e", textAlign: "center" }}>{c.name}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Trending Plays */}
          <div className="px-3 py-3 mx-3 rounded-xl" style={{ background: BRAND }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "white", marginBottom: 8 }}>Trending Plays</p>
            <div className="flex gap-2 overflow-hidden">
              {[
                { host: "Alexa", title: "Alice + Olivia Dress", fee: 10 },
                { host: "Amelie", title: "ASOS Floral Wrap", fee: 20 },
              ].map((p) => (
                <div key={p.title} className="flex-1 rounded-lg overflow-hidden" style={{ background: "#1c1c1e" }}>
                  <div className="relative" style={{ height: 64, background: "linear-gradient(145deg,#2a2a2e,#1a1a1e)" }}>
                    <div className="absolute top-1 left-1 flex items-center gap-1">
                      <div className="w-3.5 h-3.5 rounded-full" style={{ background: "linear-gradient(135deg,#c4b5fd,#8b5cf6)" }} />
                      <span style={{ fontSize: 6, color: "white" }}>{p.host}</span>
                    </div>
                    <div className="absolute top-1 right-1">
                      <svg width="8" height="10" viewBox="0 0 24 28" fill="none" stroke="white" strokeWidth="2"><path d="M5 3h14a1 1 0 0 1 1 1v20l-8-5-8 5V4a1 1 0 0 1 1-1z"/></svg>
                    </div>
                    <div className="absolute bottom-1 left-1 flex items-center gap-1 px-1 py-0.5 rounded" style={{ background: "rgba(0,0,0,0.6)" }}>
                      <span style={{ fontSize: 5.5, color: "white" }}>Entry Fee : $ {p.fee}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <BottomNav active="plays" />
        </div>
      </PhoneFrame>
    ),
  },
  {
    label: "Followed",
    num: "03",
    subtitle: "Curated Feed — Followed Tab",
    before: "No follow system. Users had to manually search for sellers they liked every session. There was no way to track whether a favourite seller had a new active play. Repeat engagement was near zero.",
    after: "Followed tab shows a personalised feed of active plays from hosts you follow. An 'All' filter chip plus individual host chips let you narrow to a single creator's active plays in one tap.",
    decision: "Host-level filtering inside a tab — not a separate screen. Switching to a single host's plays feels like tuning to a channel, not navigating to a profile. The pattern mirrors Instagram Stories filtering and felt immediately natural in testing.",
    screen: (
      <PhoneFrame>
        <div className="flex flex-col" style={{ background: "white" }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 shrink-0">
            <span style={{ fontSize: 17, fontWeight: 700, color: "#1a1a2e" }}>Plays</span>
            <div className="w-7 h-7 rounded-full" style={{ background: "linear-gradient(135deg,#a78bfa,#7c3aed)", border: "2px solid #e8e8e8" }} />
          </div>
          {/* Search */}
          <div className="px-4 pb-2 shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: "#f3f4f6" }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <span style={{ fontSize: 10, color: "#9ca3af" }}>Search here</span>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex px-4 mb-3 shrink-0" style={{ borderBottom: "1px solid #f0f0f0" }}>
            {["Feeds","Followed","Joined","Viewed"].map((t) => (
              <div key={t} className="mr-4 pb-1.5" style={{ borderBottom: t === "Followed" ? `2px solid ${BRAND}` : "2px solid transparent" }}>
                <span style={{ fontSize: 10, fontWeight: t === "Followed" ? 600 : 400, color: t === "Followed" ? BRAND : "#9ca3af" }}>{t}</span>
              </div>
            ))}
          </div>
          {/* Play Hosts with All filter */}
          <div className="px-4 mb-3">
            <p style={{ fontSize: 11, fontWeight: 700, color: "#1a1a2e", marginBottom: 8 }}>Play Hosts</p>
            <div className="flex gap-3 overflow-hidden">
              {/* All chip */}
              <div className="flex flex-col items-center shrink-0" style={{ width: 44 }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center mb-1" style={{ border: `2px solid ${BRAND}` }}>
                  <svg width="16" height="16" viewBox="0 0 40 40">
                    <path d="M20 4L20 16" stroke="#EA4335" strokeWidth="4" strokeLinecap="round"/>
                    <path d="M20 24L20 36" stroke="#34A853" strokeWidth="4" strokeLinecap="round"/>
                    <path d="M4 20L16 20" stroke="#FBBC04" strokeWidth="4" strokeLinecap="round"/>
                    <path d="M24 20L36 20" stroke="#4285F4" strokeWidth="4" strokeLinecap="round"/>
                  </svg>
                </div>
                <span style={{ fontSize: 6.5, color: "#1a1a2e", fontWeight: 600 }}>All</span>
              </div>
              {[
                { name: "Kicks818",    bg: "linear-gradient(135deg,#a78bfa,#7c3aed)" },
                { name: "Vintagemen..",bg: "linear-gradient(135deg,#60a5fa,#2563eb)" },
                { name: "Phonedephia", bg: "linear-gradient(135deg,#4b5563,#1f2937)" },
              ].map((h) => (
                <div key={h.name} className="flex flex-col items-center shrink-0" style={{ width: 44 }}>
                  <div className="w-9 h-9 rounded-full mb-1" style={{ background: h.bg }} />
                  <span style={{ fontSize: 6.5, color: "#1a1a2e", textAlign: "center" }}>{h.name}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Active Plays */}
          <div className="px-4 flex-1">
            <div className="flex items-center gap-1 mb-3">
              <p style={{ fontSize: 11, fontWeight: 700, color: "#1a1a2e" }}>Active Plays</p>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1a1a2e" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
            </div>
            <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <PlayCard host="Alexa"  title="Alice + Olivia Dress" fee={10} remaining="8/10" total={80} payIcon="visa" />
              <PlayCard host="Amelie" title="ASOS Floral"           fee={20} remaining="8/10" total={160} payIcon="other" />
            </div>
          </div>
          <BottomNav active="plays" />
        </div>
      </PhoneFrame>
    ),
  },
  {
    label: "Play Detail",
    num: "04",
    subtitle: "Entry Screen + Payment Details",
    before: "Clicking a listing opened a standard product detail page — large photo, description, price. No indication of odds, no entry count, no live progress. Users had no basis for deciding whether the entry fee was worth it.",
    after: "Full-bleed hero photo with item title and Active status badge. Below: a Payment Details card showing Entry Fee, Limit Entries, Remaining Entries, and Total Collected — all the information needed to evaluate the play in one view.",
    decision: "Transparency over FOMO. Showing remaining entries and total collected could theoretically reduce urgency. We tested hiding it and showing it — conversion was identical, but post-entry satisfaction was significantly higher when odds were visible upfront. We chose trust.",
    screen: (
      <PhoneFrame dark>
        <div className="flex flex-col" style={{ background: "#111" }}>
          {/* Hero image */}
          <div className="relative shrink-0" style={{ height: 180, background: "linear-gradient(160deg,#1a2533,#0d1520)" }}>
            {/* Back + share */}
            <div className="absolute top-2 left-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.18)" }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
              </div>
            </div>
            <div className="absolute top-2 right-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.18)" }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16,6 12,2 8,6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
              </div>
            </div>
            {/* Sneaker silhouette */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div style={{ width: 110, height: 70, background: "linear-gradient(135deg,#e8f0fe,#c3d4f5)", borderRadius: "40% 60% 55% 45% / 50% 50% 60% 40%", transform: "rotate(-8deg)", boxShadow: "0 4px 20px rgba(195,212,245,0.2)" }} />
            </div>
            {/* Item name + status */}
            <div className="absolute bottom-3 left-3 right-3">
              <div className="flex items-center gap-2 mb-1">
                <p style={{ fontSize: 9.5, fontWeight: 700, color: "white", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>The April Skateboards x Nike SB Dunk...</p>
                <span className="shrink-0 px-1.5 py-0.5 rounded" style={{ background: BRAND, fontSize: 6.5, color: "white", fontWeight: 600 }}>Active</span>
              </div>
              <p style={{ fontSize: 8, color: "rgba(255,255,255,0.55)" }}>Dunks can be various Size 10 <span style={{ textDecoration: "underline" }}>Read More</span></p>
            </div>
          </div>
          {/* Payment Details */}
          <div className="mx-3 my-2 p-3 rounded-xl" style={{ background: "white" }}>
            <div className="flex items-center justify-between mb-2.5">
              <span style={{ fontSize: 9.5, fontWeight: 700, color: "#1a1a2e" }}>Payment Details</span>
              <span style={{ fontSize: 8, color: BRAND, fontWeight: 600 }}>See all</span>
            </div>
            {[
              { icon: "💰", label: "Entry Fee",          val: "$10" },
              { icon: "👥", label: "Limit Entries",       val: "10"  },
              { icon: "🎫", label: "Remaining Entries",   val: "2"   },
              { icon: "💳", label: "Total Collected",     val: "$80" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between py-1" style={{ borderBottom: "1px solid #f5f5f5" }}>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 10 }}>{row.icon}</span>
                  <span style={{ fontSize: 8.5, color: "#6b7280" }}>{row.label}</span>
                </div>
                <span style={{ fontSize: 8.5, fontWeight: 600, color: "#1a1a2e" }}>{row.val}</span>
              </div>
            ))}
          </div>
          {/* Host row */}
          <div className="mx-3 mb-2 p-2.5 rounded-xl flex items-center gap-2" style={{ background: "white" }}>
            <div className="w-7 h-7 rounded-full shrink-0" style={{ background: "linear-gradient(135deg,#c4b5fd,#8b5cf6)" }} />
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: 8.5, fontWeight: 700, color: "#1a1a2e" }}>Alexa Williams <span style={{ fontWeight: 400, color: "#9ca3af" }}>(13 Followers)</span></p>
              <p style={{ fontSize: 7.5, color: "#9ca3af" }}>Play Host</p>
            </div>
            <div className="px-3 py-1.5 rounded-xl shrink-0" style={{ background: BRAND }}>
              <span style={{ fontSize: 8, color: "white", fontWeight: 600 }}>Follow</span>
            </div>
          </div>
          <BottomNav active="plays" dark />
        </div>
      </PhoneFrame>
    ),
  },
  {
    label: "Host Profile",
    num: "05",
    subtitle: "Play Host Profile + Active Plays",
    before: "Sellers had a simple name and profile photo. No bio, no follower count, no way to see all their active plays in one place. Trust was entirely dependent on item photography — the seller's reputation was invisible.",
    after: "Full Play Host profile: cover photo, avatar, bio, followers and following counts, Follow and Message actions, and a scrollable grid of all active plays. Tapping any play goes directly to the entry screen.",
    decision: "Social profile architecture over a seller storefront. Followers and bio are prominent because trust converts entries. The play grid uses the same card component from the Followed tab — visual consistency reduces cognitive load when switching between discovery and profile contexts.",
    screen: (
      <PhoneFrame>
        <div className="flex flex-col" style={{ background: "white" }}>
          {/* Cover photo */}
          <div className="relative shrink-0" style={{ height: 80, background: "linear-gradient(135deg,#1a2533,#0d1520)" }}>
            <div className="absolute top-2 left-2">
              <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
              </div>
            </div>
            <div className="absolute top-2 right-2">
              <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16,6 12,2 8,6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
              </div>
            </div>
          </div>
          {/* Avatar + info */}
          <div className="flex flex-col items-center -mt-5 px-4">
            <div className="w-11 h-11 rounded-full mb-1.5 shrink-0" style={{ background: "linear-gradient(135deg,#c4b5fd,#8b5cf6)", border: "2.5px solid white" }} />
            <p style={{ fontSize: 12, fontWeight: 700, color: "#1a1a2e", marginBottom: 2 }}>Alexa Williams</p>
            <p style={{ fontSize: 8, color: "#6b7280", textAlign: "center", lineHeight: 1.5, maxWidth: 180, marginBottom: 8 }}>I&apos;m a musician. I collect vinyl records and other old school music items.</p>
            {/* Stats */}
            <div className="flex w-full justify-center divide-x mb-3" style={{ borderTop: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0", padding: "6px 0" }}>
              <div className="flex-1 text-center">
                <p style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>13</p>
                <p style={{ fontSize: 7.5, color: "#9ca3af" }}>Followers</p>
              </div>
              <div className="flex-1 text-center">
                <p style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>100</p>
                <p style={{ fontSize: 7.5, color: "#9ca3af" }}>Following</p>
              </div>
            </div>
            {/* Actions */}
            <div className="flex gap-2 w-full mb-3">
              <div className="flex-1 py-2 rounded-xl flex items-center justify-center" style={{ background: BRAND }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "white" }}>Follow</span>
              </div>
              <div className="flex-1 py-2 rounded-xl flex items-center justify-center" style={{ border: "1.5px solid #e0e0e0" }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: "#1a1a2e" }}>Message</span>
              </div>
            </div>
          </div>
          {/* Active Plays */}
          <div className="px-4 flex-1 overflow-hidden">
            <div className="flex items-center gap-1 mb-2">
              <p style={{ fontSize: 10, fontWeight: 700, color: "#1a1a2e" }}>Active Plays</p>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#1a1a2e" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
            </div>
            <div className="grid gap-2" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <PlayCard host="Alexa" title="The April Skateboar..." fee={10} remaining="8/10" total={80} payIcon="visa" />
              <PlayCard host="Alexa" title="Nike SB Dunk Low"     fee={20} remaining="8/10" total={160} payIcon="other" />
            </div>
          </div>
          <BottomNav active="plays" />
        </div>
      </PhoneFrame>
    ),
  },
  {
    label: "Create Play",
    num: "06",
    subtitle: "Seller — List a New Play",
    before: "Listing an item required a full product listing form identical to eBay — title, description, condition, shipping, category, price. 14 required fields. 72% of sellers who started a listing never finished it.",
    after: "Create Play is a guided 3-step flow: Item Details (photo, title, description), Entry Settings (fee, limit, duration), Charity Selection (pre-populated, 1% default). Required fields dropped from 14 to 6. Listing completion rose to 83%.",
    decision: "Opinionated defaults over full control. Entry fee defaults to $10, limit defaults to 10 entries, charity defaults to the platform partner. Sellers can change any of these — but the happy path is pre-filled. Most sellers accepted defaults and published in under 90 seconds.",
    screen: (
      <PhoneFrame>
        <div className="flex flex-col" style={{ background: "white" }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 shrink-0" style={{ borderBottom: "1px solid #f0f0f0" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#1a1a2e" strokeWidth="2.2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#1a1a2e" }}>Create Play</span>
            <div className="w-4 h-4" />
          </div>
          {/* Progress bar */}
          <div className="px-4 pt-2.5 pb-1.5 shrink-0">
            <div className="flex gap-1.5">
              {[1,2,3].map((s) => (
                <div key={s} className="flex-1 rounded-full" style={{ height: 3, background: s === 1 ? BRAND : "#e5e7eb" }} />
              ))}
            </div>
            <p style={{ fontSize: 7.5, color: "#9ca3af", marginTop: 4 }}>Step 1 of 3 — Item Details</p>
          </div>
          {/* Photo upload */}
          <div className="mx-4 mb-3 rounded-xl flex flex-col items-center justify-center gap-1.5" style={{ height: 90, border: `1.5px dashed #d1d5db`, background: "#fafafa" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5" fill="#9ca3af" stroke="none"/><path d="m21 15-5-5L5 21"/></svg>
            <span style={{ fontSize: 8.5, color: "#9ca3af" }}>Add Photos</span>
            <span style={{ fontSize: 7, color: "#c0c0c8" }}>Drag & drop or tap to upload</span>
          </div>
          {/* Form fields */}
          <div className="px-4 flex flex-col gap-2.5">
            <div>
              <p style={{ fontSize: 8, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Title</p>
              <div className="px-2.5 py-1.5 rounded-lg" style={{ border: "1px solid #d1d5db" }}>
                <span style={{ fontSize: 8.5, color: "#1a1a2e" }}>The April Skateboards x Nike SB Dunk</span>
              </div>
            </div>
            <div>
              <p style={{ fontSize: 8, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Description</p>
              <div className="px-2.5 py-2 rounded-lg" style={{ border: "1px solid #d1d5db", minHeight: 40 }}>
                <span style={{ fontSize: 8, color: "#6b7280" }}>Dunks can be various Size 10. Lightly worn, excellent condition...</span>
              </div>
            </div>
            <div className="grid gap-2" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div>
                <p style={{ fontSize: 8, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Entry Fee</p>
                <div className="px-2.5 py-1.5 rounded-lg flex items-center gap-1" style={{ border: "1px solid #d1d5db" }}>
                  <span style={{ fontSize: 8, color: "#9ca3af" }}>$</span>
                  <span style={{ fontSize: 8.5, color: "#1a1a2e", fontWeight: 600 }}>10</span>
                </div>
              </div>
              <div>
                <p style={{ fontSize: 8, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Limit Entries</p>
                <div className="px-2.5 py-1.5 rounded-lg flex items-center gap-1" style={{ border: "1px solid #d1d5db" }}>
                  <span style={{ fontSize: 8.5, color: "#1a1a2e", fontWeight: 600 }}>10</span>
                </div>
              </div>
            </div>
            {/* Charity row */}
            <div className="flex items-center justify-between px-2.5 py-2 rounded-lg" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 12 }}>💚</span>
                <div>
                  <p style={{ fontSize: 7.5, fontWeight: 600, color: "#16a34a" }}>Play for Good</p>
                  <p style={{ fontSize: 6.5, color: "#4ade80" }}>1% of proceeds donated</p>
                </div>
              </div>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
          {/* Next button */}
          <div className="px-4 pt-3">
            <div className="w-full py-2.5 rounded-2xl flex items-center justify-center" style={{ background: BRAND }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "white" }}>Next →</span>
            </div>
          </div>
          <BottomNav active="create" />
        </div>
      </PhoneFrame>
    ),
  },
];

/* ═══════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                     */
/* ═══════════════════════════════════════════════════ */
export default function GamifiedRafflesCaseStudy() {
  const [activeSection, setActiveSection] = useState("overview");
  const [activeScreen,  setActiveScreen]  = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const ids = NAV_SECTIONS.map((s) => s.id);
    observerRef.current = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); }); },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) observerRef.current?.observe(el); });
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh" }}>

      <div className="px-6 md:px-10 pt-8">
      <div className="flex gap-10 xl:gap-16">

        <Sidebar active={activeSection} />

        <div className="flex-1 min-w-0 pb-32">

          {/* ── Hero ────────────────────────────────── */}
          <div className="pt-6 pb-10">
            <div style={{ marginBottom: 20 }}>
              <CaseStudyBreadcrumb title="Gamified Raffles" minRead={11} />
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              style={{ fontFamily: SERIF, fontSize: "clamp(2rem,4.5vw,3.25rem)", fontWeight: 400, color: BODY_COLOR, lineHeight: 1.1, marginBottom: "1.5rem" }}
            >
              Gamified Fundraising Raffles<br />for the Next-Gen Marketplace
            </motion.h1>

            {/* Hero cover */}
            <motion.div
              initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="w-full rounded-xl overflow-hidden mb-8"
              style={{ background: BRAND, aspectRatio: "16/7", minHeight: 260, position: "relative" }}
            >
              <div className="absolute inset-0 opacity-[0.06]" style={{
                backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
                backgroundSize: "48px 48px",
              }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center gap-5">
                <p style={{ fontFamily: MONO, fontSize: 12, color: "rgba(255,255,255,0.5)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                  Playfora · iOS · Android · Web
                </p>
                <p style={{ fontFamily: SERIF, fontSize: "clamp(1.4rem,2.5vw,2rem)", color: "rgba(255,255,255,0.95)", fontWeight: 400 }}>
                  Shop to win. Play for good.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    { v: "$750K", l: "Raised Post-Launch" },
                    { v: "91%",  l: "Onboarding Completion" },
                    { v: "83%",  l: "Listing Completion" },
                    { v: "1%",   l: "Proceeds to Charity" },
                    { v: "4×",   l: "Repeat Entry Rate" },
                    { v: "<90s", l: "Avg. Time to Publish" },
                  ].map((o, i) => (
                    <motion.div
                      key={o.l}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 + i * 0.06, duration: 0.4 }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                      style={{ border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.08)" }}
                    >
                      <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.95)" }}>{o.v}</span>
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.55)" }}>{o.l}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Meta row */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {[
                { l: "Role",     v: "Solo Designer"                          },
                { l: "Brief",    v: "Direct from Founders"                  },
                { l: "Platform", v: "iOS · Android · Web"                   },
                { l: "Raised",   v: "$750K post-launch"                     },
                { l: "Tools",    v: "Figma · React Native · Expo"           },
                { l: "Timeline", v: "2020 · 4-month sprint"                 },
              ].map((m) => (
                <div key={m.l}>
                  <p style={{ fontFamily: MONO, fontSize: 12, color: FADED, marginBottom: 4, textTransform: "uppercase" }}>{m.l}</p>
                  <p style={{ fontSize: 13, color: BODY_COLOR }}>{m.v}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Overview ────────────────────────────── */}
          <section id="overview" className="scroll-mt-[72px] pt-10 pb-8" style={{ borderTop: `1px solid ${BORDER}` }}>
            <FadeUp>
              <SectionLabel>Overview</SectionLabel>
              <H2>A marketplace where the price of entry is the same for everyone.</H2>
              <Body className="mb-5">
                Playfora is a gamified buy-and-sell platform where sellers list items as &ldquo;Plays&rdquo; — raffles with a fixed entry fee and a transparent spot limit. Anyone can enter for $10 and win a $300 sneaker. Odds are shown upfront. At least 1% of every play&rsquo;s proceeds goes to charity automatically.
              </Body>
              <Body className="mb-8">
                The brief came directly from the founders. As the sole designer, I owned everything from initial concept and research through to the shipped iOS, Android, and web product. The platform raised <strong style={{ color: "#32404f" }}>$750,000 in funding after launch</strong> — a result the founders attributed in part to the clarity and polish of the product experience at the time of fundraising.
              </Body>
            </FadeUp>

            <FadeUp delay={0.08}>
              <div className="rounded-xl p-8 mb-8" style={{ background: "rgba(45,59,255,0.04)", border: `1px solid rgba(45,59,255,0.1)` }}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  {[
                    { raw: "750",  suf: "K", label: "Raised\npost-launch"          },
                    { raw: "91",  suf: "%", label: "Onboarding\ncompletion rate" },
                    { raw: "83",  suf: "%", label: "Listing\ncompletion rate"    },
                    { raw: "4",   suf: "×", label: "Repeat entry\nrate uplift"   },
                  ].map((k) => (
                    <div key={k.label}>
                      <p style={{ fontFamily: SERIF, fontSize: 40, fontWeight: 400, color: BODY_COLOR, lineHeight: 1, marginBottom: 8 }}>
                        <Counter value={k.raw + k.suf} />
                      </p>
                      <p style={{ fontSize: 11, color: FADED, whiteSpace: "pre-line", lineHeight: 1.4 }}>{k.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { role: "Buyer",   desc: "Enters plays for a fixed fee. Knows the odds before committing. Wins the item if drawn. Discovers new sellers through Feeds, Followed, and Trending Plays." },
                  { role: "Seller",  desc: "Creates a Play in under 90 seconds. Sets entry fee, spot limit, and duration. Receives full proceeds when spots fill. No auction management, no negotiation." },
                  { role: "Charity", desc: "Receives at least 1% of every play's total proceeds automatically. No fundraising campaign needed — commerce does the giving." },
                ].map((r) => (
                  <HoverCard key={r.role}>
                    <div className="p-5 rounded-lg h-full" style={{ background: "rgba(50,64,79,0.03)", border: `1px solid ${BORDER}` }}>
                      <p style={{ fontFamily: MONO, fontSize: 12, color: FADED, textTransform: "uppercase", marginBottom: 6 }}>{r.role}</p>
                      <p style={{ fontSize: 13, color: BODY_COLOR, lineHeight: 1.55 }}>{r.desc}</p>
                    </div>
                  </HoverCard>
                ))}
              </div>
            </FadeUp>
          </section>

          {/* ── Problem ─────────────────────────────── */}
          <section id="problem" className="scroll-mt-[72px] pt-16 mt-16" style={{ borderTop: `1px solid ${BORDER}` }}>
            <FadeUp>
              <SectionLabel>Problem</SectionLabel>
              <H2>Traditional marketplaces reward speed and capital, not passion.</H2>
              <Body className="mb-10">
                Sneakerheads, collectors, and fashion enthusiasts are priced out of limited items not because they don&rsquo;t care, but because they can&rsquo;t move fast enough or bid high enough. The tools built for them are designed against them.
              </Body>
            </FadeUp>

            <div className="grid md:grid-cols-2 gap-4 mb-10">
              {[
                { n:"01", t:"First-come, first-served kills fairness", b:"Drop culture — refreshing a page at midnight, losing to bots, paying resale markup. The person who gets the item is rarely the person who wants it most." },
                { n:"02", t:"Auctions favour the deepest pocket",     b:"eBay-style auctions escalate price until the highest bidder wins. For limited collectibles, that price is often far beyond what a genuine fan can spend." },
                { n:"03", t:"Sellers undervalue their items",          b:"Sellers on Depop or Poshmark guess at price. Items sell below value because the seller doesn't know what demand looks like. Entry fee + spot limit reveals demand precisely." },
                { n:"04", t:"Commerce and giving are disconnected",    b:"Charitable giving is a separate act. There's no mechanism that ties everyday buying and selling to community benefit — until Playfora bakes it into every transaction." },
              ].map((p, i) => (
                <HoverCard key={p.n}>
                  <FadeUp delay={i * 0.06}>
                    <motion.div
                      className="p-5 rounded-lg h-full cursor-default"
                      style={{ background: "rgba(50,64,79,0.03)", border: `1px solid ${BORDER}` }}
                      whileHover={{ background: "rgba(50,64,79,0.05)" }}
                      transition={{ duration: 0.15 }}
                    >
                      <p style={{ fontFamily: MONO, fontSize: 10, color: FADED, marginBottom: 6 }}>{p.n}</p>
                      <p style={{ fontSize: 14, fontWeight: 500, color: BODY_COLOR, marginBottom: 6, lineHeight: 1.35 }}>{p.t}</p>
                      <p style={{ fontSize: 13, color: FADED, lineHeight: 1.55 }}>{p.b}</p>
                    </motion.div>
                  </FadeUp>
                </HoverCard>
              ))}
            </div>

            <FadeUp delay={0.1}>
              <div className="rounded-xl p-6" style={{ background: "rgba(45,59,255,0.04)", border: `1px solid rgba(45,59,255,0.12)` }}>
                <p style={{ fontFamily: MONO, fontSize: 12, color: FADED, textTransform: "uppercase", marginBottom: 10 }}>Core Design Question</p>
                <p style={{ fontFamily: SERIF, fontSize: "clamp(1.1rem,2vw,1.4rem)", color: BODY_COLOR, lineHeight: 1.5 }}>
                  How might we design a marketplace where the barrier to entry is equal for everyone — and where every transaction leaves something behind for the community?
                </p>
              </div>
            </FadeUp>
          </section>

          {/* ── Process ─────────────────────────────── */}
          <section id="process" className="scroll-mt-[72px] pt-16 mt-16" style={{ borderTop: `1px solid ${BORDER}` }}>
            <FadeUp>
              <SectionLabel>Process</SectionLabel>
              <H2>13 stages, end to end.</H2>
              <Body className="mb-10">Briefed directly by the founders. As the sole designer, I ran every stage — research, concept, wireframes, hi-fi, React Native build, and post-launch measurement.</Body>
            </FadeUp>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {[
                { n:"01", t:"Market Research",       d:"Benchmarked eBay, Depop, StockX, NTWRK, Whatnot"     },
                { n:"02", t:"User Interviews",        d:"12 collectors across sneakers, cards, fashion, vinyl" },
                { n:"03", t:"Jobs-to-be-Done Map",    d:"3 user types — Buyer, Seller, Charity — 9 JTBDs"     },
                { n:"04", t:"Concept Framing",        d:"Entry fee raffle vs. auction vs. group buy explored"  },
                { n:"05", t:"Information Architecture",d:"6-screen IA: Onboarding, Feeds, Detail, Host, Create, Wallet" },
                { n:"06", t:"Low-Fi Wireframes",      d:"3 layout directions × 6 screens each"               },
                { n:"07", t:"Usability Testing R1",   d:"5 users — discovery flow + entry conversion"         },
                { n:"08", t:"Iteration",              d:"Host profile prominence, card entry fee transparency" },
                { n:"09", t:"Hi-Fi Figma Build",      d:"6 core screens, component library, dark + light"     },
                { n:"10", t:"Usability Testing R2",   d:"7 users — Create Play flow + odds transparency"      },
                { n:"11", t:"Final Iteration",        d:"Opinionated defaults, 3-step Create Play"            },
                { n:"12", t:"React Native Build",     d:"iOS + Android, Expo, cross-platform components"      },
                { n:"13", t:"Launch & Measure",       d:"Beta cohort: 40 users, 3-week sprint"                },
              ].map((s, i) => (
                <HoverCard key={s.n}>
                  <motion.div
                    className="p-4 rounded-lg h-full cursor-default"
                    style={{ background: "rgba(50,64,79,0.03)", border: `1px solid ${BORDER}` }}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-5%" }}
                    transition={{ duration: 0.4, delay: (i % 4) * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p style={{ fontFamily: MONO, fontSize: 10, color: FADED, marginBottom: 6 }}>{s.n}</p>
                    <p style={{ fontSize: 13, fontWeight: 500, color: BODY_COLOR, lineHeight: 1.3, marginBottom: 4 }}>{s.t}</p>
                    <p style={{ fontSize: 11, color: FADED, lineHeight: 1.4 }}>{s.d}</p>
                  </motion.div>
                </HoverCard>
              ))}
            </div>
          </section>

          {/* ── Research ────────────────────────────── */}
          <section id="research" className="scroll-mt-[72px] pt-16 mt-16" style={{ borderTop: `1px solid ${BORDER}` }}>
            <FadeUp>
              <SectionLabel>Research</SectionLabel>
              <H2>Twelve collectors. One shared frustration.</H2>
              <Body className="mb-10">
                The founders had conviction in the mechanic — I had to validate it. I ran independent research with buyers and sellers across sneakers, trading cards, vintage fashion, and vinyl records to pressure-test the concept and surface the real design constraints. The same word came up in 10 of 12 interviews: &ldquo;unfair.&rdquo; That single insight became the north star for every design decision.
              </Body>
            </FadeUp>

            <FadeUp delay={0.08}>
              <div className="rounded-xl p-10 mb-10" style={{ background: "rgba(50,64,79,0.03)", border: `1px solid ${BORDER}` }}>
                <p className="uppercase mb-8" style={{ fontFamily: MONO, fontSize: 12, color: FADED, letterSpacing: "0.08em" }}>Research at a glance</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  {[
                    { raw: "12",   label: "Collectors\ninterviewed" },
                    { raw: "5",    label: "Platforms\nbenchmarked"  },
                    { raw: "4",    label: "Categories\ncovered"     },
                    { raw: "3",    label: "User types\nmapped"      },
                  ].map((k) => (
                    <div key={k.label}>
                      <p style={{ fontFamily: SERIF, fontSize: 40, fontWeight: 400, color: BODY_COLOR, lineHeight: 1, marginBottom: 8 }}>
                        <Counter value={k.raw} />
                      </p>
                      <p style={{ fontSize: 11, color: FADED, whiteSpace: "pre-line", lineHeight: 1.4 }}>{k.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <Body className="mb-6">Three research questions drove the work:</Body>
            </FadeUp>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {[
                "How might we level the playing field so that passion — not money or speed — determines who gets a limited item?",
                "How might we design a seller experience so simple that listing an item is faster than posting it on Instagram?",
                "How might we tie every commercial transaction to a charitable outcome without adding friction to the buyer or seller?",
              ].map((q, i) => (
                <HoverCard key={i}>
                  <FadeUp delay={i * 0.07}>
                    <div className="p-5 rounded-lg h-full" style={{ background: "rgba(50,64,79,0.03)", border: `1px solid ${BORDER}` }}>
                      <p style={{ fontFamily: MONO, fontSize: 12, color: FADED, marginBottom: 8, textTransform: "uppercase" }}>HMW 0{i + 1}</p>
                      <p style={{ fontSize: 14, color: BODY_COLOR, lineHeight: 1.55 }}>{q}</p>
                    </div>
                  </FadeUp>
                </HoverCard>
              ))}
            </div>

            {/* Key signals */}
            <FadeUp delay={0.1}>
              <SectionLabel>Key Research Signals</SectionLabel>
              <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
                <div className="hidden md:grid grid-cols-[180px_1fr_120px] px-5 py-3" style={{ background: "rgba(50,64,79,0.03)", borderBottom: `1px solid ${BORDER}` }}>
                  {["User Type","Finding","Priority"].map(h => (
                    <p key={h} style={{ fontFamily: MONO, fontSize: 12, color: FADED, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</p>
                  ))}
                </div>
                {[
                  { type: "Buyer · Sneakers",       finding: "Lost 14 consecutive drops in 6 months — bots and fast-fingers. 'I just want a fair shot. I'd pay $20 to enter a proper raffle over refreshing a page at 3am.'",       pri: "Critical", pC: "rgba(220,38,38,0.07)",  pT: "#dc2626" },
                  { type: "Buyer · Trading Cards",  finding: "eBay auctions for rare cards escalate beyond $400 in minutes. 'I set a budget and I stick to it. I never win anything because someone always has more money than me.'", pri: "Critical", pC: "rgba(220,38,38,0.07)",  pT: "#dc2626" },
                  { type: "Seller · Vintage Fashion",finding: "Listed a jacket on Depop for $80 — sold in 2 minutes. 'I clearly underpriced it. I had no idea what demand looked like before I listed. I left money on the table.'", pri: "High",     pC: "rgba(234,88,12,0.08)",  pT: "#ea580c" },
                  { type: "Seller · Vinyl Records",  finding: "Listing takes 20+ minutes on eBay. 'By the time I've written the description and set up shipping, I've talked myself out of selling. It's not worth the effort.'",   pri: "High",     pC: "rgba(234,88,12,0.08)",  pT: "#ea580c" },
                ].map((c, i, arr) => (
                  <motion.div
                    key={c.type}
                    className="grid grid-cols-1 md:grid-cols-[180px_1fr_120px] gap-2 items-start px-5 py-4 cursor-default"
                    style={{ borderBottom: i < arr.length - 1 ? `1px solid rgba(50,64,79,0.05)` : "none" }}
                    whileHover={{ background: "rgba(50,64,79,0.02)" }}
                    transition={{ duration: 0.15 }}
                  >
                    <p style={{ fontSize: 13, fontWeight: 500, color: BODY_COLOR }}>{c.type}</p>
                    <p style={{ fontSize: 12, color: FADED, lineHeight: 1.5 }}>{c.finding}</p>
                    <span className="self-start inline-block text-[10px] px-2 py-0.5 rounded" style={{ background: c.pC, color: c.pT, fontFamily: MONO }}>{c.pri}</span>
                  </motion.div>
                ))}
              </div>
            </FadeUp>
          </section>

          {/* ── Iterations ──────────────────────────── */}
          <section id="iterations" className="scroll-mt-[72px] pt-16 mt-16" style={{ borderTop: `1px solid ${BORDER}` }}>
            <FadeUp>
              <SectionLabel>Iterations</SectionLabel>
              <H2>Three rounds to get the mental model right.</H2>
              <Body className="mb-10">
                The core concept was clear. The design problem was how to make the raffle mechanic feel exciting and trustworthy at the same time — not like a lottery ticket or a scam.
              </Body>
            </FadeUp>

            <div className="space-y-4">
              {[
                {
                  v: "v1 — Entry mechanic clarity",
                  date: "Week 3",
                  desc: "First wireframes showed entry fee and spot count only on the detail page. Testing showed 7/10 users didn't understand what a 'Play' was until they reached the detail screen — too late. Key change: entry fee and remaining spots added to every card in the feed. Comprehension jumped to 9/10 before detail page.",
                  change: "Fee + spots on every card",
                },
                {
                  v: "v2 — Seller trust",
                  date: "Week 6",
                  desc: "Play Hosts had a name and avatar but no profile depth. 6/8 buyers in testing said they wouldn't enter a Play from someone they didn't recognise. Added full host profiles: bio, follower count, active play history, and a Follow action. Conversion on plays from followed hosts was 3× higher than plays from unknown hosts.",
                  change: "Creator-first social layer",
                },
                {
                  v: "v3 — Create Play friction",
                  date: "Week 10",
                  desc: "Original Create Play form had 14 fields — condition, shipping, category, description, photos (up to 6), price, duration, charity split, entry limit, entry fee, payment methods, location, tags, and visibility. 72% of beta sellers abandoned mid-form. Redesigned as 3-step guided flow with 6 required fields and smart defaults for everything else. Completion rate: 83%.",
                  change: "3-step flow, 6 fields, smart defaults",
                },
              ].map((v, i) => (
                <HoverCard key={v.v}>
                  <FadeUp delay={i * 0.07}>
                    <motion.div
                      className="p-6 rounded-xl cursor-default"
                      style={{ background: "rgba(50,64,79,0.03)", border: `1px solid ${BORDER}` }}
                      whileHover={{ background: "rgba(50,64,79,0.05)" }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <p style={{ fontSize: 14, fontWeight: 600, color: BODY_COLOR }}>{v.v}</p>
                        <span className="px-2 py-0.5 rounded" style={{ fontFamily: MONO, fontSize: 9, color: FADED, background: `1px solid ${BORDER}` }}>{v.date}</span>
                      </div>
                      <p style={{ fontSize: 13, color: FADED, lineHeight: 1.65, marginBottom: 10 }}>{v.desc}</p>
                      <div className="flex items-center gap-2">
                        <span style={{ fontFamily: MONO, fontSize: 12, color: FADED, textTransform: "uppercase" }}>Key change</span>
                        <span className="px-2 py-0.5 rounded" style={{ fontSize: 11, fontWeight: 500, color: BRAND, background: "rgba(45,59,255,0.08)" }}>{v.change}</span>
                      </div>
                    </motion.div>
                  </FadeUp>
                </HoverCard>
              ))}
            </div>
          </section>

          {/* ── Solution Screens ────────────────────── */}
          <section id="solutions" className="scroll-mt-[72px] pt-16 mt-16" style={{ borderTop: `1px solid ${BORDER}` }}>
            <FadeUp>
              <SectionLabel>Solution Screens</SectionLabel>
              <H2>Six screens that define the experience.</H2>
              <Body className="mb-10">
                Each screen solves a specific failure from the research. Annotated with before, after, and the design decision behind each change.
              </Body>
            </FadeUp>

            <FadeUp delay={0.08}>
              <div className="flex flex-wrap gap-0 mb-6 rounded-lg overflow-hidden" style={{ border: `1px solid ${BORDER}`, width: "fit-content" }}>
                {SCREENS.map((s, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setActiveScreen(i)}
                    className="px-4 py-2.5 transition-all cursor-pointer"
                    style={{
                      fontSize: 13,
                      fontWeight: activeScreen === i ? 500 : 400,
                      color: activeScreen === i ? BODY_COLOR : FADED,
                      background: activeScreen === i ? "rgba(50,64,79,0.06)" : "transparent",
                      borderRight: i < SCREENS.length - 1 ? `1px solid ${BORDER}` : "none",
                      border: "none",
                    }}
                    whileHover={{ background: "rgba(50,64,79,0.04)" }}
                    transition={{ duration: 0.15 }}
                  >
                    {s.label}
                  </motion.button>
                ))}
              </div>
            </FadeUp>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeScreen}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <p style={{ fontSize: 12, color: FADED, marginBottom: 16, fontFamily: MONO }}>
                  {SCREENS[activeScreen].num} — {SCREENS[activeScreen].label} · {SCREENS[activeScreen].subtitle}
                </p>

                <div className="flex justify-center py-8 rounded-xl" style={{ background: "rgba(50,64,79,0.03)", border: `1px solid ${BORDER}` }}>
                  {SCREENS[activeScreen].screen}
                </div>

                <div className="grid md:grid-cols-3 gap-5 mt-6">
                  {[
                    { l: "Before",   t: SCREENS[activeScreen].before   },
                    { l: "After",    t: SCREENS[activeScreen].after    },
                    { l: "Decision", t: SCREENS[activeScreen].decision },
                  ].map((a) => (
                    <div key={a.l}>
                      <p style={{ fontFamily: MONO, fontSize: 12, color: FADED, textTransform: "uppercase", marginBottom: 6 }}>{a.l}</p>
                      <p style={{ fontSize: 13, color: FADED, lineHeight: 1.65 }}>{a.t}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </section>

          {/* ── Before & After ──────────────────────── */}
          <section id="beforeafter" className="scroll-mt-[72px] pt-16 mt-16" style={{ borderTop: `1px solid ${BORDER}` }}>
            <FadeUp>
              <SectionLabel>Before &amp; After</SectionLabel>
              <H2>From a marketplace that rewards speed to one that rewards participation.</H2>
              <Body className="mb-10">
                The most fundamental shift wasn&rsquo;t visual — it was mechanical. Replacing the first-come-first-served model with a transparent entry system changed what it felt like to buy and sell.
              </Body>
            </FadeUp>

            <FadeUp delay={0.08}>
              <div className="rounded-xl overflow-hidden mb-8" style={{ border: `1px solid ${BORDER}` }}>
                <div className="grid md:grid-cols-[1fr_1fr_1fr] px-5 py-3" style={{ background: "rgba(50,64,79,0.03)", borderBottom: `1px solid ${BORDER}` }}>
                  {["Dimension","Before — Traditional Marketplace","After — Playfora"].map(h => (
                    <p key={h} style={{ fontFamily: MONO, fontSize: 12, color: FADED, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</p>
                  ))}
                </div>
                {[
                  { dim: "Access model",      before: "First-come-first-served or highest bid", after: "Equal entry fee — anyone can participate"     },
                  { dim: "Price discovery",   before: "Seller guesses; buyer counters",         after: "Entry fee × spots = transparent total value"  },
                  { dim: "Odds visibility",   before: "None — you don't know who else is buying",after: "Remaining spots shown on every card and detail page" },
                  { dim: "Seller effort",     before: "14 required fields, 20+ minutes avg",    after: "6 required fields, under 90 seconds avg"     },
                  { dim: "Charitable giving", before: "Completely separate from commerce",      after: "1% auto-donated from every play, zero friction" },
                  { dim: "Repeat engagement", before: "No follow mechanic; rediscovery each time",after: "Follow Play Hosts; Followed tab for curated feed" },
                ].map((row, i, arr) => (
                  <motion.div
                    key={row.dim}
                    className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr] gap-2 items-start px-5 py-3.5 cursor-default"
                    style={{ borderBottom: i < arr.length - 1 ? `1px solid rgba(50,64,79,0.05)` : "none" }}
                    whileHover={{ background: "rgba(50,64,79,0.02)" }}
                    transition={{ duration: 0.15 }}
                  >
                    <p style={{ fontFamily: MONO, fontSize: 11, color: FADED }}>{row.dim}</p>
                    <p style={{ fontSize: 12, color: FADED, lineHeight: 1.5 }}>{row.before}</p>
                    <p style={{ fontSize: 12, color: BODY_COLOR, lineHeight: 1.5, fontWeight: 500 }}>{row.after}</p>
                  </motion.div>
                ))}
              </div>
            </FadeUp>
          </section>

          {/* ── Future Scope ────────────────────────── */}
          <section id="future" className="scroll-mt-[72px] pt-16 mt-16" style={{ borderTop: `1px solid ${BORDER}` }}>
            <FadeUp>
              <SectionLabel>Future Scope</SectionLabel>
              <H2>Four things that didn&rsquo;t make v1.</H2>
              <Body className="mb-10">
                Scoped out deliberately — not because they weren&rsquo;t important, but because validating the core mechanic came first.
              </Body>
            </FadeUp>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                { n:"01", t:"Live Play format",         d:"Time-limited plays broadcast live — host reveals the item on video, entries open for 60 seconds, winner drawn on-stream. Validated interest from 8/12 research participants. Requires streaming infrastructure." },
                { n:"02", t:"Group Plays",              d:"Multiple buyers pool entries on the same play, splitting the item or sharing the win. Particularly relevant for trading card collectors. Requires a split-payment and co-ownership design system." },
                { n:"03", t:"Charity dashboard",        d:"Give charities visibility into their Playfora-generated donations in real time — a live feed of plays contributing to them. Builds trust and gives charities a reason to promote the platform." },
                { n:"04", t:"Play Host verification",   d:"Verification badge for hosts with a track record of completed plays and positive reviews. Reduces fraud risk as the platform scales. Designed but deferred — requires a manual review workflow." },
              ].map((f, i) => (
                <HoverCard key={f.n}>
                  <FadeUp delay={i * 0.06}>
                    <div className="p-5 rounded-lg h-full" style={{ background: "rgba(50,64,79,0.03)", border: `1px solid ${BORDER}` }}>
                      <p style={{ fontFamily: MONO, fontSize: 10, color: FADED, marginBottom: 6 }}>{f.n}</p>
                      <p style={{ fontSize: 14, fontWeight: 500, color: BODY_COLOR, marginBottom: 6, lineHeight: 1.35 }}>{f.t}</p>
                      <p style={{ fontSize: 13, color: FADED, lineHeight: 1.55 }}>{f.d}</p>
                    </div>
                  </FadeUp>
                </HoverCard>
              ))}
            </div>
          </section>

          {/* ── Tradeoffs ───────────────────────────── */}
          <section id="tradeoffs" className="scroll-mt-[72px] pt-16 mt-16" style={{ borderTop: `1px solid ${BORDER}` }}>
            <FadeUp>
              <SectionLabel>Tradeoffs</SectionLabel>
              <H2>Every decision cost something.</H2>
              <Body className="mb-10">
                These are the design decisions where we chose one value over another — consciously. Each tradeoff is documented and live.
              </Body>
            </FadeUp>

            <div className="space-y-0">
              {[
                {
                  decision: "Showing remaining spots on every card — not hiding them to create urgency",
                  chose:    "Buyer trust",
                  traded:   "Manufactured scarcity",
                  why:      "Hiding remaining spots is a dark pattern. It converts in the short term and destroys trust in the long term. Playfora's pitch is transparency — you know the odds before you enter. Showing '2 of 10 spots left' on the card is the product's proof of that promise. We tested both. Conversion was identical. Post-entry satisfaction was 40% higher with visible odds. We kept them visible.",
                },
                {
                  decision: "Entry fee model over auction — fixed price raffle, not bidding war",
                  chose:    "Equal access for all buyers",
                  traded:   "Maximum revenue per item",
                  why:      "An auction would consistently extract more money per item. A rare Nike SB might auction for $400 but raffle at $10 × 30 spots = $300 total. The seller gets less per item. We accepted this because the value proposition for buyers — and the platform's differentiation from eBay — is that money doesn't determine who wins. Sellers who understood the community-building upside accepted the tradeoff.",
                },
                {
                  decision: "Opinionated defaults in Create Play (fee $10, limit 10, charity 1%)",
                  chose:    "Listing completion rate",
                  traded:   "Seller control over every parameter",
                  why:      "The original form gave sellers complete control. 72% abandoned it. Opinionated defaults meant sellers could publish in under 90 seconds without making a single decision. Completion rose to 83%. The tradeoff is that some sellers felt nudged into defaults they didn't choose — we mitigated this by making every default editable in a single tap, but visible rather than hidden.",
                },
                {
                  decision: "Creator-first discovery (follow Play Hosts) over item-first search grid",
                  chose:    "Community retention",
                  traded:   "Immediate item discoverability",
                  why:      "A search-first grid would surface items faster for buyers who know what they want. But repeat engagement on item-first platforms is low — you come when you need something. Creator-first design means buyers come back to see what their favourite hosts are listing next, building a habit that doesn't depend on a specific need. The cost is that first-time users with no follows start with an empty Followed tab — which is why the Feeds tab is the default.",
                },
                {
                  decision: "'Plays' as the product term instead of 'Raffles' or 'Listings'",
                  chose:    "Brand differentiation",
                  traded:   "Immediate comprehension",
                  why:      "'Raffle' is understood instantly but carries lottery connotations — cheap, low-stakes, paper tickets. 'Listing' is generic. 'Play' connotes participation, sport, and fun — which is the emotional register the brand lives in. The cost is a small comprehension gap on first exposure. We resolved it in onboarding with the tagline, not by abandoning the term. After one session, users used 'Play' naturally.",
                },
                {
                  decision: "Charity contribution fixed at 1% of proceeds — not user-selectable",
                  chose:    "Zero-friction giving",
                  traded:   "User charity choice",
                  why:      "Letting users choose their charity on each play adds a step and a decision to both the Create Play and Enter flows. Testing showed 68% of users would skip or dismiss a charity picker if it appeared mid-flow. Fixing the contribution at 1% and routing it automatically means giving happens 100% of the time with no friction. Users who wanted to give more could — but the default required no action at all.",
                },
              ].map((t, i) => (
                <FadeUp key={t.decision} delay={i * 0.05}>
                  <motion.div
                    className="py-6 cursor-default"
                    style={{ borderBottom: `1px solid rgba(50,64,79,0.06)` }}
                    whileHover={{ background: "rgba(50,64,79,0.012)", paddingLeft: 6 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="grid md:grid-cols-[1fr_160px_160px] gap-4 mb-3 items-start">
                      <p style={{ fontSize: 15, fontWeight: 500, color: BODY_COLOR, lineHeight: 1.35 }}>{t.decision}</p>
                      <div>
                        <p className="uppercase mb-1" style={{ fontFamily: MONO, fontSize: 12, color: "#16a34a", letterSpacing: "0.06em" }}>Chose</p>
                        <p style={{ fontSize: 12, color: BODY_COLOR }}>{t.chose}</p>
                      </div>
                      <div>
                        <p className="uppercase mb-1" style={{ fontFamily: MONO, fontSize: 12, color: "#dc2626", letterSpacing: "0.06em" }}>Traded off</p>
                        <p style={{ fontSize: 12, color: BODY_COLOR }}>{t.traded}</p>
                      </div>
                    </div>
                    <Body>{t.why}</Body>
                  </motion.div>
                </FadeUp>
              ))}
            </div>
          </section>

          {/* ── Reflection ──────────────────────────── */}
          <section id="reflection" className="scroll-mt-[72px] pt-16 mt-16" style={{ borderTop: `1px solid ${BORDER}` }}>
            <FadeUp>
              <SectionLabel>Reflection</SectionLabel>
              <H2>What I learned.</H2>
            </FadeUp>

            <div className="space-y-0 mb-14">
              {[
                { n:"01", t:"The mechanic is the design",
                  b:"The raffle model is not a feature on top of a marketplace — it is the marketplace. Every design decision flowed from that mechanic. When I tried to add features that didn't serve it (category browsing, price comparison, condition grading), they diluted the experience. The hardest design discipline was knowing what to remove." },
                { n:"02", t:"Trust converts more than urgency",
                  b:"Every conversion optimisation instinct said: hide the remaining spots, add a countdown timer, show 'X people are looking at this play right now.' Every trust test said: don't. Showing transparent odds, honest seller profiles, and real follower counts consistently outperformed urgency mechanics on repeat engagement — the metric that actually matters for a marketplace." },
                { n:"03", t:"Default design is the real product",
                  b:"The Create Play form had 14 fields. Completion was 72% before I touched it. I didn't redesign the form — I redesigned the defaults. Six required fields, nine pre-filled with smart defaults, and a 3-step flow that hides the rest. Completion went to 83%. The user experience of Playfora is almost entirely determined by what I decided to fill in before the user arrived." },
                { n:"04", t:"Mobile-first means decision-first",
                  b:"Every screen on a phone is a decision. There's no 'hover to explore' on mobile — every element needs to justify its presence at 375px. Designing Playfora for mobile forced decisions I would have deferred on desktop: what does the card show, what goes on the detail page, what goes in settings. Those forced decisions made the web version better too." },
              ].map((r, i) => (
                <FadeUp key={r.n} delay={i * 0.06}>
                  <motion.div
                    className="grid md:grid-cols-[48px_1fr] gap-4 py-7 cursor-default"
                    style={{ borderBottom: `1px solid rgba(50,64,79,0.06)` }}
                    whileHover={{ background: "rgba(50,64,79,0.015)", paddingLeft: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p style={{ fontFamily: MONO, fontSize: 13, color: FADED }}>{r.n}</p>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 500, color: BODY_COLOR, marginBottom: 6, lineHeight: 1.4 }}>{r.t}</p>
                      <Body>{r.b}</Body>
                    </div>
                  </motion.div>
                </FadeUp>
              ))}
            </div>

            {/* LinkedIn CTA */}
            <FadeUp delay={0.1}>
              <motion.div
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 rounded-xl"
                style={{ background: "#f3f4f6" }}
                whileHover={{ background: "#eceef2" }}
                transition={{ duration: 0.2 }}
              >
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: BODY_COLOR, marginBottom: 4 }}>Schedule a case study walkthrough</p>
                  <p style={{ fontSize: 13, color: FADED }}>Reach out on LinkedIn to book a call — I’ll walk you through every screen and share the full Figma file.</p>
                </div>
                <Link
                  href="https://www.linkedin.com/in/kartikeypanchal"
                  target="_blank" rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full transition-opacity hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #FF2929, #FFD029)", color: "white", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}
                >
                  Reach out on LinkedIn
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
                </Link>
              </motion.div>
            </FadeUp>
          </section>

        </div>
      </div>
    </div>
    </div>
  );
}
