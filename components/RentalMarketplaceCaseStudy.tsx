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

const BRAND      = "#0d1b4b";
const ACCENT     = "#e84c3d";
const BODY_COLOR = "#1a2535";
const FADED      = "rgba(26,37,53,0.55)";
const BORDER     = "rgba(26,37,53,0.10)";
const SERIF      = "Georgia,'Times New Roman',serif";
const MONO       = "var(--font-geist-mono),monospace";

/* ─── Sidebar ──────────────────────────────────────── */
function Sidebar({ active }: { active: string }) {
  return (
    <aside className="hidden lg:block w-[188px] shrink-0">
      <div className="sticky top-[72px]">
        <p style={{
          fontFamily: MONO, fontSize: 12, textTransform: "uppercase",
          letterSpacing: "0.12em", color: "rgba(26,37,53,0.35)",
          marginBottom: 10, paddingLeft: 14,
        }}>
          Contents
        </p>
        <nav className="flex flex-col" style={{ borderLeft: "1px solid rgba(26,37,53,0.12)" }}>
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
                color: active === s.id ? BODY_COLOR : "rgba(26,37,53,0.38)",
                background: "transparent",
                border: "none",
                borderLeft: active === s.id ? `2px solid ${ACCENT}` : "2px solid transparent",
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
      whileHover={{ y: -3, boxShadow: "0 8px 28px rgba(26,37,53,0.10)" }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Browser Frame ────────────────────────────────── */
function BrowserFrame({ children, url = "workorbits.com", title = "" }: { children: React.ReactNode; url?: string; title?: string }) {
  return (
    <motion.div
      className="relative mx-auto overflow-hidden w-full"
      style={{
        borderRadius: 10,
        boxShadow: "0 16px 48px rgba(0,0,0,0.14), 0 4px 12px rgba(0,0,0,0.08)",
        background: "white",
      }}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Browser chrome */}
      <div style={{ height: 32, background: "#f1f3f4", borderBottom: "1px solid #dadce0", display: "flex", alignItems: "center", gap: 8, padding: "0 10px", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 4 }}>
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#febc2e" }} />
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#28c840" }} />
        </div>
        <div style={{ flex: 1, height: 20, background: "white", borderRadius: 4, border: "1px solid #dadce0", display: "flex", alignItems: "center", gap: 5, padding: "0 8px", fontSize: 9, color: "#5f6368" }}>
          <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <span style={{ color: "#202124", fontWeight: 500 }}>{url}</span>
          {title && <span style={{ color: "#5f6368" }}>/ {title}</span>}
        </div>
      </div>
      {children}
    </motion.div>
  );
}

/* ─── Phone Frame ──────────────────────────────────── */
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
        <span style={{ fontSize: 10.5, fontWeight: 700, color: dark ? "white" : "#1a1a2e" }}>9:41</span>
        <div className="flex items-center gap-1">
          <svg width="11" height="8" viewBox="0 0 22 16" fill={dark ? "white" : "#1a1a2e"}>
            <rect x="0" y="8"  width="4" height="8"  rx="1"/>
            <rect x="6" y="5"  width="4" height="11" rx="1"/>
            <rect x="12" y="2" width="4" height="14" rx="1"/>
            <rect x="18" y="0" width="4" height="16" rx="1"/>
          </svg>
          <svg width="12" height="9" viewBox="0 0 24 18" fill="none" stroke={dark ? "white" : "#1a1a2e"} strokeWidth="2.2" strokeLinecap="round">
            <path d="M1 5C7 -1 17 -1 23 5"/><path d="M5 9c4-4 10-4 14 0"/><path d="M9 13c2-2 6-2 8 0"/><circle cx="13" cy="17" r="1" fill={dark ? "white" : "#1a1a2e"} stroke="none"/>
          </svg>
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

/* ═══════════════════════════════════════════════════ */
/*  SCREENS DATA                                        */
/* ═══════════════════════════════════════════════════ */
const SCREENS = [
  {
    label: "Marketing Website",
    num: "01",
    subtitle: "Workorbits — Hero + CTA + Client Logos",
    before: "No digital presence — all client acquisition happened over phone and email. Businesses had no way to discover Workorbits, understand the product, or self-serve a booking. The entire top-of-funnel was word-of-mouth.",
    after: "Dark navy marketing site with two clear CTAs splitting staff and venue bookings, enterprise client logo social proof, and a value proposition legible in under 10 seconds. Became the primary lead-gen surface post-launch.",
    decision: "Split CTA architecture (Staff vs. Venue) over a unified homepage. Early testing showed visitors arrived with a specific intent — they either needed staff or needed a venue. A single CTA confused 7/10 users. Splitting into two distinct paths reduced decision paralysis and improved lead quality.",
    screen: (
      <motion.div
        className="relative mx-auto overflow-hidden w-full"
        style={{
          maxWidth: 620,
          borderRadius: 10,
          border: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 16px 48px rgba(0,0,0,0.14), 0 4px 12px rgba(0,0,0,0.08)",
          lineHeight: 0,
        }}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-5%" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/case-studies/rental-marketplace/screen-01-marketing-website.png"
          alt="Workorbits Marketing Website"
          style={{ width: "100%", display: "block" }}
        />
      </motion.div>
    ),
  },
  {
    label: "Workorbits Dashboard",
    num: "02",
    subtitle: "Field Operations Webapp — Live Dashboard",
    before: "Field managers tracked workers via WhatsApp group chats — no centralized view, no real-time location, no task assignment. Managers had to call each worker individually to get status updates, taking 30–45 minutes per shift check.",
    after: "Workorbits web dashboard with live work-order table, status tags (Pending/Approved/In Progress), worker count, and task summary visible at a glance. Field managers went from 45-minute status calls to a 10-second dashboard scan.",
    decision: "Status-table as primary surface over a Kanban board. Enterprise clients were managing 20–80 workers per day — a Kanban was too spatial and worked poorly on laptop screens. A dense table with colour-coded status tags let managers process 50+ rows in one scroll. The sidebar geo-fence alert rail was added in round 3 of iterations.",
    screen: (
      <motion.div
        className="relative mx-auto overflow-hidden w-full"
        style={{
          maxWidth: 620,
          borderRadius: 10,
          border: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 16px 48px rgba(0,0,0,0.14), 0 4px 12px rgba(0,0,0,0.08)",
          lineHeight: 0,
        }}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-5%" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/case-studies/rental-marketplace/screen-02-workorbits-dashboard.png"
          alt="Workorbits Dashboard — Onboarding"
          style={{ width: "100%", display: "block" }}
        />
      </motion.div>
    ),
  },
  {
    label: "Mobile App",
    num: "03",
    subtitle: "Workorbits — Worker & Client Booking App",
    before: "Workers and business clients had no mobile touchpoint — all coordination happened via phone calls and WhatsApp. There was no way to accept bookings, confirm attendance, or receive proof-of-work on the go.",
    after: "Native mobile app for workers: browse available jobs, track status (Upcoming / Completed / Pending), negotiate hourly rates with a slider, and withdraw earnings — all without a single phone call.",
    decision: "Single app for two user types (worker and client) over two separate apps. Early interviews showed 60% of event managers also moonlighted as occasional workers. A role-switcher in settings saved development time and reduced onboarding friction for dual users.",
    screen: (
      <motion.div
        className="relative mx-auto overflow-hidden w-full"
        style={{
          maxWidth: 620,
          borderRadius: 10,
          border: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 16px 48px rgba(0,0,0,0.14), 0 4px 12px rgba(0,0,0,0.08)",
          lineHeight: 0,
        }}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-5%" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/case-studies/rental-marketplace/screen-03-mobile-app.png"
          alt="Mobile App — Available Jobs & Active Jobs"
          style={{ width: "100%", display: "block" }}
        />
      </motion.div>
    ),
  },
  {
    label: "Design System",
    num: "04",
    subtitle: "Workorbits — Figma Component Library",
    before: "No shared component library — each product (website, webapp, mobile) was built independently with duplicated styles. Colors, buttons, and type scales drifted across surfaces, creating an inconsistent brand experience.",
    after: "A unified Figma design system with Foundations (colors, typography, icons, shadows) and full Component library (buttons, badges, inputs, tabs). Shared across all surfaces — consistent UI shipped 40% faster in later sprints.",
    decision: "One design system across two distinct brands over separate per-product libraries. The tradeoff was harder to differentiate brand voice per product, but the consistency and speed gains were critical for a solo designer shipping across four surfaces simultaneously.",
    screen: (
      <BrowserFrame url="figma.com" title="Workorbits Design System">
        <div style={{ background: "#e8e9eb", display: "flex", minHeight: 380 }}>

          {/* ── Left sidebar (Figma layers-panel style) ── */}
          <div style={{ width: 128, background: "#fafafa", borderRight: "1px solid #e4e4e4", flexShrink: 0, display: "flex", flexDirection: "column" }}>
            {/* "Thumbnail" header */}
            <div style={{ padding: "7px 10px", background: "#f0f0f0", borderBottom: "1px solid #e4e4e4" }}>
              <span style={{ fontSize: 8.5, fontWeight: 600, color: "#333" }}>Thumbnail</span>
            </div>
            <div style={{ height: "0.5px", background: "#e4e4e4", margin: "6px 10px" }} />
            {/* Foundations */}
            <div style={{ padding: "2px 10px 4px" }}>
              <span style={{ fontSize: 8, fontWeight: 600, color: "#555" }}>Foundations</span>
            </div>
            {["Colors", "Typography", "Logos", "Icons", "Shadows and blurs", "Spacing and containers", "Layout Grids", "Illustration and Vector", "Prototype"].map(item => (
              <div key={item} style={{ padding: "3px 18px", fontSize: 7.5, color: "#666" }}>{item}</div>
            ))}
            <div style={{ height: "0.5px", background: "#e4e4e4", margin: "6px 10px" }} />
            {/* Components */}
            <div style={{ padding: "2px 10px 4px" }}>
              <span style={{ fontSize: 8, fontWeight: 600, color: "#555" }}>Components</span>
            </div>
            {[
              { label: "Buttons",                   active: true  },
              { label: "Button groups",             active: false },
              { label: "Badges",                    active: false },
              { label: "Checkbox and Radio button", active: false },
              { label: "Dropdowns",                 active: false },
              { label: "Inputs",                    active: false },
              { label: "Tabs",                      active: false },
            ].map(item => (
              <div key={item.label} style={{
                padding: "3px 18px",
                fontSize: 7.5,
                color: item.active ? BRAND : "#666",
                fontWeight: item.active ? 600 : 400,
                background: item.active ? "rgba(13,27,75,0.07)" : "transparent",
              }}>
                {item.label}
              </div>
            ))}
          </div>

          {/* ── Canvas area ── */}
          <div style={{ flex: 1, padding: "10px", overflow: "hidden" }}>
            {/* White artboard */}
            <div style={{ background: "white", borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.14)", overflow: "hidden" }}>

              {/* Artboard header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 12px", borderBottom: "1px solid #f0f0f0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  {/* Grid logo */}
                  <svg width="11" height="11" viewBox="0 0 20 20" fill="none">
                    <rect x="1" y="1" width="7" height="7" rx="1.5" fill={BRAND} opacity="0.9"/>
                    <rect x="12" y="1" width="7" height="7" rx="1.5" fill={BRAND} opacity="0.35"/>
                    <rect x="1" y="12" width="7" height="7" rx="1.5" fill={BRAND} opacity="0.35"/>
                    <rect x="12" y="12" width="7" height="7" rx="1.5" fill={BRAND} opacity="0.9"/>
                  </svg>
                  <span style={{ fontSize: 7.5, color: "#aaa" }}>workorbits</span>
                  <span style={{ fontSize: 7.5, color: "#ddd" }}>|</span>
                  <span style={{ fontSize: 7.5, color: "#888" }}>Components</span>
                  <span style={{ fontSize: 7.5, color: "#ddd" }}>/</span>
                  <span style={{ fontSize: 7.5, fontWeight: 700, color: "#222" }}>Buttons</span>
                </div>
                <span style={{ fontSize: 7, color: "#bbb" }}>www.workorbits.com</span>
              </div>

              {/* Artboard body */}
              <div style={{ padding: "10px 12px" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#111", marginBottom: 2 }}>Buttons</p>
                <p style={{ fontSize: 7.5, color: "#999", marginBottom: 10 }}>Buttons communicate actions that users can take.</p>

                {/* Button matrix */}
                <div style={{ background: "#f6f7f8", borderRadius: 5, border: "1.5px dashed #d4d6dc", padding: "8px 10px" }}>
                  {/* Column headers */}
                  <div style={{ display: "grid", gridTemplateColumns: "52px 1fr 1fr 1fr 1fr", marginBottom: 6 }}>
                    <div />
                    {["DEFAULT", "HOVER", "DISABLED", "LOADING"].map(h => (
                      <span key={h} style={{ fontSize: 6, fontWeight: 700, color: "#bbb", letterSpacing: "0.08em", textAlign: "center" }}>{h}</span>
                    ))}
                  </div>

                  {/* PRIMARY rows (navy) */}
                  {[
                    { label: "PRIMARY",  bg: BRAND,        color: "white", border: BRAND        },
                    { label: "",         bg: "white",       color: BRAND,  border: BRAND        },
                    { label: "TERITARY", bg: "transparent", color: BRAND,  border: "transparent"},
                    { label: "LINK",     bg: "transparent", color: BRAND,  border: "transparent", link: true },
                  ].map((row, ri) => (
                    <div key={ri} style={{ display: "grid", gridTemplateColumns: "52px 1fr 1fr 1fr 1fr", alignItems: "center", marginBottom: 5 }}>
                      <span style={{ fontSize: 5.5, color: "#bbb", letterSpacing: "0.05em" }}>{row.label}</span>
                      {[false, false, true, false].map((isDisabled, ci) => (
                        <div key={ci} style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2.5 }}>
                          {/* 3 sizes */}
                          {[{ p: "3px 7px", fs: 6.5 }, { p: "2px 5px", fs: 5.5 }, { p: "1.5px 4px", fs: 5 }].map((sz, si) => (
                            <div key={si} style={{
                              padding: sz.p, borderRadius: 3,
                              background: isDisabled ? "transparent" : row.bg,
                              border: `1px solid ${isDisabled ? "#ddd" : row.border === "transparent" ? "transparent" : row.border}`,
                              opacity: isDisabled ? 0.45 : ci === 1 ? 0.82 : 1,
                            }}>
                              <span style={{ fontSize: sz.fs, color: isDisabled ? "#bbb" : row.color, textDecoration: row.link ? "underline" : "none", whiteSpace: "nowrap" }}>
                                {si === 2 ? "H" : "CTA Label"}
                              </span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}

                  {/* Divider */}
                  <div style={{ height: "0.5px", background: "#dddde4", margin: "4px 0 6px" }} />

                  {/* DESTRUCTIVE rows (coral) */}
                  {[
                    { label: "DESTRUCTIVE", bg: ACCENT,        color: "white", border: ACCENT        },
                    { label: "SECONDARY",   bg: "white",        color: ACCENT, border: ACCENT        },
                    { label: "TERITARY",    bg: "transparent",  color: ACCENT, border: "transparent" },
                    { label: "LINK",        bg: "transparent",  color: ACCENT, border: "transparent", link: true },
                  ].map((row, ri) => (
                    <div key={ri} style={{ display: "grid", gridTemplateColumns: "52px 1fr 1fr 1fr 1fr", alignItems: "center", marginBottom: ri < 3 ? 5 : 0 }}>
                      <span style={{ fontSize: 5.5, color: "#bbb", letterSpacing: "0.05em" }}>{row.label}</span>
                      {[false, false, true, false].map((isDisabled, ci) => (
                        <div key={ci} style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2.5 }}>
                          {[{ p: "3px 7px", fs: 6.5 }, { p: "2px 5px", fs: 5.5 }, { p: "1.5px 4px", fs: 5 }].map((sz, si) => (
                            <div key={si} style={{
                              padding: sz.p, borderRadius: 3,
                              background: isDisabled ? "transparent" : row.bg,
                              border: `1px solid ${isDisabled ? "#f0d0cc" : row.border === "transparent" ? "transparent" : row.border}`,
                              opacity: isDisabled ? 0.45 : ci === 1 ? 0.82 : 1,
                            }}>
                              <span style={{ fontSize: sz.fs, color: isDisabled ? "#e0a0a0" : row.color, textDecoration: row.link ? "underline" : "none", whiteSpace: "nowrap" }}>
                                {si === 2 ? "H" : "CTA Label"}
                              </span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, paddingTop: 7, borderTop: "1px solid #f0f0f0" }}>
                  <div>
                    <p style={{ fontSize: 7.5, fontWeight: 600, color: "#333" }}>Workorbits – Design System</p>
                    <p style={{ fontSize: 6.5, color: "#bbb" }}>www.workorbits.com</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <svg width="11" height="11" viewBox="0 0 20 20" fill="none">
                      <rect x="1" y="1" width="7" height="7" rx="1.5" fill={BRAND} opacity="0.9"/>
                      <rect x="12" y="1" width="7" height="7" rx="1.5" fill={BRAND} opacity="0.35"/>
                      <rect x="1" y="12" width="7" height="7" rx="1.5" fill={BRAND} opacity="0.35"/>
                      <rect x="12" y="12" width="7" height="7" rx="1.5" fill={BRAND} opacity="0.9"/>
                    </svg>
                    <span style={{ fontSize: 8, fontWeight: 700, color: BRAND }}>workorbits</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BrowserFrame>
    ),
  },
];

/* ═══════════════════════════════════════════════════ */
/*  BEFORE & AFTER DATA                                 */
/* ═══════════════════════════════════════════════════ */
const BEFORE_AFTER = [
  {
    label: "Screen 01",
    headers: ["Before", "After"],
    before: "Booking via WhatsApp/phone — 48–72hr response, no confirmation, no accountability. Event managers called 10+ workers individually, received no-shows with no recourse.",
    after: "In-app booking with real-time availability — confirmed in under 10 minutes. Worker profiles with ratings, past bookings, and proof-of-work visible before confirmation.",
  },
  {
    label: "Screen 02",
    headers: ["Before", "After"],
    before: "Field managers tracked workers via group chats — no geo visibility, frequent no-shows, no way to verify attendance. Resolving disputes took days.",
    after: "Workorbits geo-fencing dashboard — real-time location, auto clock-in/out, proof-of-work generated automatically at shift end. Disputes dropped to near zero.",
  },
];

/* ═══════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                     */
/* ═══════════════════════════════════════════════════ */
export default function RentalMarketplaceCaseStudy() {
  const [activeSection, setActiveSection] = useState("overview");
  const [activeScreen,  setActiveScreen]  = useState(0);
  const [activeBa,      setActiveBa]      = useState(0);
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
              <CaseStudyBreadcrumb title="B2B Rental Marketplace" minRead={14} />
            </div>

            {/* Standalone H1 — matches other case study pages */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              style={{ fontFamily: SERIF, fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, color: BODY_COLOR, lineHeight: 1.15, marginBottom: "1.5rem" }}
            >
              Next-Gen B2B Rental<br />Marketplace Platform
            </motion.h1>

            {/* Hero cover */}
            <motion.div
              initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="w-full rounded-xl overflow-hidden mb-8"
              style={{ background: "linear-gradient(135deg, #0d1b4b 0%, #1a3470 100%)", aspectRatio: "16/7", minHeight: 260, position: "relative" }}
            >
              <div className="absolute inset-0 opacity-[0.05]" style={{
                backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
                backgroundSize: "48px 48px",
              }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center gap-4">
                <p style={{ fontFamily: MONO, fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                  Website · Webapp · Mobile App · Design System
                </p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  style={{ fontFamily: SERIF, fontSize: "clamp(1.4rem,2.5vw,2rem)", color: "rgba(255,255,255,0.92)", fontWeight: 400, lineHeight: 1.25 }}
                >
                  Next-Gen B2B Rental Marketplace Platform
                </motion.p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>
                  Workorbits — sole designer, 0→1 product, $300K funding post-launch
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {[
                    { v: "$300K", l: "Seed funding raised" },
                    { v: "6",     l: "Enterprise clients"  },
                    { v: "3",     l: "Products shipped"    },
                  ].map((o, i) => (
                    <motion.div
                      key={o.l}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 + i * 0.08, duration: 0.4 }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full"
                      style={{ border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.08)" }}
                    >
                      <span style={{ fontSize: 16, fontWeight: 600, color: "rgba(255,255,255,0.95)" }}>{o.v}</span>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{o.l}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Meta row */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.32 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {[
                { l: "Role",     v: "Sole Product Designer, Lead Designer" },
                { l: "Platform", v: "Web + Mobile + Design System"         },
                { l: "Year",     v: "2020–2022"                            },
                { l: "Type",     v: "0→1 Product"                         },
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
              <H2>A marketplace that brought temporary staffing and venue booking online for the first time.</H2>
              <Body className="mb-5">
                Workorbits is a B2B marketplace for on-demand temporary staff and venue bookings — connecting businesses to workers and spaces in real time. I designed the complete product suite end-to-end: the Workorbits marketing website, the Workorbits field-operations web app, a mobile client, and the underlying design system. The platform went from zero to $300K in seed funding with 6 enterprise clients.
              </Body>
            </FadeUp>

            <FadeUp delay={0.08}>
              <div className="rounded-xl p-8 mb-8" style={{ background: `rgba(13,27,75,0.04)`, border: `1px solid rgba(13,27,75,0.10)` }}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  {[
                    { raw: "$300K", label: "Seed funding\nraised"                                              },
                    { raw: "6",     label: "Enterprise clients\n(Paytm Insider, Zomato, BlinkIt…)"            },
                    { raw: "3",     label: "Products shipped\n(Website · Webapp · Mobile)"                    },
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
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { role: "Workorbits Website",     desc: "Marketing and lead-gen surface for the B2B marketplace. Communicated the dual value proposition (staff + venues) and drove enterprise inbound." },
                  { role: "Workorbits Webapp",   desc: "Field operations dashboard for enterprise clients. Real-time work-order management, worker assignment, geo-fencing, and proof-of-work tracking." },
                  { role: "Mobile App + DS",     desc: "Native client app for workers to accept bookings and clock in via GPS. Backed by a shared design system enabling consistent UI across all surfaces." },
                ].map((r) => (
                  <HoverCard key={r.role}>
                    <div className="p-5 rounded-lg h-full" style={{ background: "rgba(26,37,53,0.03)", border: `1px solid ${BORDER}` }}>
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
              <H2>The temporary-staffing market was fragmented, opaque, and entirely offline.</H2>
              <Body className="mb-10">
                Businesses running events, warehouse peaks, or promotional activations had no reliable way to book vetted temporary staff on short notice. Venue discovery was equally broken — event organizers called venues individually and got stale availability information.
              </Body>
            </FadeUp>

            <div className="grid md:grid-cols-2 gap-4 mb-10">
              {[
                { n:"01", t:"No unified marketplace for temp staff + venues",         b:"Businesses used separate channels for staff and venue bookings — often calling different agencies, with no single source of truth for availability or pricing." },
                { n:"02", t:"Manual phone/email booking — 48–72hr turnaround",        b:"Every booking required multiple calls and follow-ups. By the time confirmation came, requirements had often changed or another vendor had been engaged." },
                { n:"03", t:"Zero visibility into worker availability or history",     b:"Businesses had no way to see a worker's past bookings, attendance record, or ratings before hiring them. Every hire was a leap of faith." },
                { n:"04", t:"No digital proof-of-work or attendance",                  b:"Disputes over attendance and hours worked were resolved informally — by memory or WhatsApp messages. No audit trail existed for either party." },
                { n:"05", t:"Businesses had no way to rate or review workers",         b:"There was no accountability mechanism. Repeat no-shows faced no consequence; exceptional workers received no recognition or preferential access to bookings." },
                { n:"06", t:"Venue calendars were siloed across 10+ WhatsApp groups",  b:"Venue availability was managed in group chats. Overbookings were common; organizers had to call to check availability for every date change." },
                { n:"07", t:"Field managers had no real-time operations view",         b:"Managing 20–80 workers at a live event required constant phone calls. There was no dashboard for shift status, location, or task completion." },
                { n:"08", t:"Zero standardised worker onboarding or compliance",       b:"New temp workers were onboarded ad hoc — no digital ID verification, no skills tagging, no standardised profile that followed them across bookings." },
              ].map((p, i) => (
                <HoverCard key={p.n}>
                  <FadeUp delay={i * 0.05}>
                    <motion.div
                      className="p-5 rounded-lg h-full cursor-default"
                      style={{ background: "rgba(26,37,53,0.03)", border: `1px solid ${BORDER}` }}
                      whileHover={{ background: "rgba(26,37,53,0.05)" }}
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
          </section>

          {/* ── Process ─────────────────────────────── */}
          <section id="process" className="scroll-mt-[72px] pt-16 mt-16" style={{ borderTop: `1px solid ${BORDER}` }}>
            <FadeUp>
              <SectionLabel>Process</SectionLabel>
              <H2>Four phases, four surfaces, one designer.</H2>
              <Body className="mb-10">
                As the sole designer on a 0→1 product, I ran every phase end-to-end — from competitive research and user interviews through information architecture, visual design, and developer handoff across all four surfaces.
              </Body>
            </FadeUp>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { n:"01", t:"Discovery & Competitive Research", d:"3 weeks",  desc:"Benchmarked UrbanClap, LinkedIn Jobs, Sulekha. Interviewed event managers, venue ops, and temp workers to map pain points across 4 user roles." },
                { n:"02", t:"Information Architecture + User Flows", d:"2 weeks", desc:"Mapped IA for website, webapp, and mobile separately. Defined 3 top-level user flows: business booking, worker onboarding, and field-ops dashboard." },
                { n:"03", t:"Visual Design — Website + Webapp + Mobile", d:"6 weeks", desc:"High-fidelity screens across all surfaces. 3 rounds of iteration on booking flow, worker profile, and dashboard hierarchy." },
                { n:"04", t:"Design System + Developer Handoff", d:"2 weeks", desc:"Built shared component library covering tokens, type scale, and UI components. Handed off to engineering with annotated specs and Zeplin exports." },
              ].map((s, i) => (
                <HoverCard key={s.n}>
                  <motion.div
                    className="p-5 rounded-lg h-full cursor-default"
                    style={{ background: "rgba(26,37,53,0.03)", border: `1px solid ${BORDER}` }}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-5%" }}
                    transition={{ duration: 0.4, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p style={{ fontFamily: MONO, fontSize: 10, color: FADED, marginBottom: 4 }}>{s.n}</p>
                    <p style={{ fontSize: 13, fontWeight: 500, color: BODY_COLOR, lineHeight: 1.3, marginBottom: 4 }}>{s.t}</p>
                    <p style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, marginBottom: 6 }}>{s.d}</p>
                    <p style={{ fontSize: 11, color: FADED, lineHeight: 1.4 }}>{s.desc}</p>
                  </motion.div>
                </HoverCard>
              ))}
            </div>
          </section>

          {/* ── Research ────────────────────────────── */}
          <section id="research" className="scroll-mt-[72px] pt-16 mt-16" style={{ borderTop: `1px solid ${BORDER}` }}>
            <FadeUp>
              <SectionLabel>Research</SectionLabel>
              <H2>Twelve interviews. One shared frustration: nothing works.</H2>
              <Body className="mb-10">
                I ran primary research with event managers, venue operators, and temp workers before touching a wireframe. The goal was to validate whether the problem was real enough to build a marketplace around — and to surface the design constraints that mattered most.
              </Body>
            </FadeUp>

            <FadeUp delay={0.08}>
              <div className="rounded-xl p-6 mb-6" style={{ background: `rgba(13,27,75,0.04)`, border: `1px solid rgba(13,27,75,0.10)` }}>
                <p style={{ fontFamily: MONO, fontSize: 12, color: FADED, textTransform: "uppercase", marginBottom: 10 }}>Core Design Question</p>
                <p style={{ fontFamily: SERIF, fontSize: "clamp(1.1rem,2vw,1.4rem)", color: BODY_COLOR, lineHeight: 1.5 }}>
                  How do we reduce the time-to-booking from 48 hours to under 10 minutes while giving enterprise clients real-time visibility into their workforce?
                </p>
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className="rounded-xl p-10 mb-10" style={{ background: "rgba(26,37,53,0.03)", border: `1px solid ${BORDER}` }}>
                <p className="uppercase mb-8" style={{ fontFamily: MONO, fontSize: 12, color: FADED, letterSpacing: "0.08em" }}>Research at a glance</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  {[
                    { raw: "12", label: "User interviews\n(event managers, venue ops, workers)" },
                    { raw: "3",  label: "Competitor audits\n(UrbanClap, LinkedIn Jobs, Sulekha)"  },
                    { raw: "8",  label: "Pain points mapped\nacross 4 user roles"                 },
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

            <FadeUp delay={0.12}>
              <Body className="mb-6">Three HMW questions drove the design work:</Body>
            </FadeUp>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {[
                "How might we make temp-staff availability visible and bookable in under 2 minutes?",
                "How might we give field managers real-time geo-fenced workforce tracking without a native app?",
                "How might we build trust between businesses and first-time temp workers through transparent profiles and ratings?",
              ].map((q, i) => (
                <HoverCard key={i}>
                  <FadeUp delay={i * 0.07}>
                    <div className="p-5 rounded-lg h-full" style={{ background: "rgba(26,37,53,0.03)", border: `1px solid ${BORDER}` }}>
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
                <div className="hidden md:grid grid-cols-[180px_1fr_120px] px-5 py-3" style={{ background: "rgba(26,37,53,0.03)", borderBottom: `1px solid ${BORDER}` }}>
                  {["User Type","Finding","Priority"].map(h => (
                    <p key={h} style={{ fontFamily: MONO, fontSize: 12, color: FADED, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</p>
                  ))}
                </div>
                {[
                  { type: "Event Manager",      finding: "Books 5–20 temp staff per event, 3–4 events/month. 'I spend 2 days making calls before every event. Half the time someone doesn't show up and I find out 30 minutes before start.'",       pri: "Critical", pC: "rgba(220,38,38,0.07)",  pT: "#dc2626" },
                  { type: "Temp Worker",         finding: "67% of bookings fell through due to last-minute no-shows with no accountability. 'I want proof of work — something I can show to the next client. Right now I have nothing.'",              pri: "Critical", pC: "rgba(220,38,38,0.07)",  pT: "#dc2626" },
                  { type: "Venue Manager",       finding: "Venue managers wanted a self-serve calendar, not inbound calls. 'I get 10 calls a day asking about availability for dates that are already booked. It's a waste of everyone's time.'",     pri: "High",     pC: "rgba(234,88,12,0.08)",  pT: "#ea580c" },
                  { type: "Field Ops Manager",   finding: "Real-time geo tracking was the single most-requested feature. 'I have 60 workers across 4 sites. I'm on the phone constantly. If I could see everyone on a map, I'd save 3 hours a day.'", pri: "High",     pC: "rgba(234,88,12,0.08)",  pT: "#ea580c" },
                ].map((c, i, arr) => (
                  <motion.div
                    key={c.type}
                    className="grid grid-cols-1 md:grid-cols-[180px_1fr_120px] gap-2 items-start px-5 py-4 cursor-default"
                    style={{ borderBottom: i < arr.length - 1 ? `1px solid rgba(26,37,53,0.05)` : "none" }}
                    whileHover={{ background: "rgba(26,37,53,0.02)" }}
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
              <H2>Three rounds to earn enterprise trust.</H2>
              <Body className="mb-10">
                Each iteration round surfaced a different failure mode — from information architecture to booking confirmation flow to dashboard hierarchy.
              </Body>
            </FadeUp>

            <div className="space-y-4">
              {[
                {
                  v: "Round 01 — Navigation & booking flow architecture",
                  date: "Week 4",
                  desc: "Tested 3 IA structures with event managers; settled on Staff / Venue split as top-level tabs. Key change: moved filters above the listing grid (not in a sidebar) for mobile-first context. 8/10 users found the right category in under 20 seconds after the change vs. 4/10 before.",
                  change: "Filters above grid, Staff/Venue top-level split",
                },
                {
                  v: "Round 02 — Booking confirmation + worker profile design",
                  date: "Week 7",
                  desc: "Initial design had too many confirmation steps — 6 screens from search to confirmed booking. Reduced to 3. Key change: combined availability and pricing on one screen with an inline calendar widget. Booking completion rate improved from 54% to 81% in moderated testing.",
                  change: "6 → 3 steps, inline availability + pricing",
                },
                {
                  v: "Round 03 — Workorbits dashboard hierarchy",
                  date: "Week 10",
                  desc: "Enterprise clients needed an at-a-glance ops view. Initial design buried the daily-task summary below a stats panel. Moved the task summary to the top of the dashboard and added a geo-fencing alert rail in the left sidebar. Field managers reported completing their morning status check in under 60 seconds.",
                  change: "Task summary first, geo-fence alert rail added",
                },
              ].map((v, i) => (
                <HoverCard key={v.v}>
                  <FadeUp delay={i * 0.07}>
                    <motion.div
                      className="p-6 rounded-xl cursor-default"
                      style={{ background: "rgba(26,37,53,0.03)", border: `1px solid ${BORDER}` }}
                      whileHover={{ background: "rgba(26,37,53,0.05)" }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <p style={{ fontSize: 14, fontWeight: 600, color: BODY_COLOR }}>{v.v}</p>
                        <span style={{ fontFamily: MONO, fontSize: 9, color: FADED, padding: "2px 8px", border: `1px solid ${BORDER}`, borderRadius: 4 }}>{v.date}</span>
                      </div>
                      <p style={{ fontSize: 13, color: FADED, lineHeight: 1.65, marginBottom: 10 }}>{v.desc}</p>
                      <div className="flex items-center gap-2">
                        <span style={{ fontFamily: MONO, fontSize: 12, color: FADED, textTransform: "uppercase" }}>Key change</span>
                        <span className="px-2 py-0.5 rounded" style={{ fontSize: 11, fontWeight: 500, color: BRAND, background: "rgba(13,27,75,0.08)" }}>{v.change}</span>
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
              <H2>Four surfaces that define the platform.</H2>
              <Body className="mb-10">
                Each screen solves a specific failure from the research — annotated with the design decisions behind each choice.
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
                      background: activeScreen === i ? "rgba(26,37,53,0.06)" : "transparent",
                      borderRight: i < SCREENS.length - 1 ? `1px solid ${BORDER}` : "none",
                      border: "none",
                    }}
                    whileHover={{ background: "rgba(26,37,53,0.04)" }}
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

                <div className="flex justify-center py-8 rounded-xl" style={{ background: "rgba(26,37,53,0.03)", border: `1px solid ${BORDER}` }}>
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
              <H2>From 48-hour phone tag to 10-minute confirmed bookings.</H2>
              <Body className="mb-10">
                The most fundamental shift wasn&rsquo;t visual — it was operational. Replacing manual phone and WhatsApp coordination with a structured digital platform changed what it felt like to manage a workforce.
              </Body>
            </FadeUp>

            <FadeUp delay={0.08}>
              <div className="flex flex-wrap gap-0 mb-6 rounded-lg overflow-hidden" style={{ border: `1px solid ${BORDER}`, width: "fit-content" }}>
                {BEFORE_AFTER.map((s, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setActiveBa(i)}
                    className="px-4 py-2.5 cursor-pointer"
                    style={{
                      fontSize: 13,
                      fontWeight: activeBa === i ? 500 : 400,
                      color: activeBa === i ? BODY_COLOR : FADED,
                      background: activeBa === i ? "rgba(26,37,53,0.06)" : "transparent",
                      borderRight: i < BEFORE_AFTER.length - 1 ? `1px solid ${BORDER}` : "none",
                      border: "none",
                    }}
                    whileHover={{ background: "rgba(26,37,53,0.04)" }}
                    transition={{ duration: 0.15 }}
                  >
                    {s.label}
                  </motion.button>
                ))}
              </div>
            </FadeUp>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeBa}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="grid md:grid-cols-2 gap-4 mb-10">
                  {BEFORE_AFTER[activeBa].headers.map((h, i) => (
                    <div key={h} className="p-6 rounded-xl" style={{ background: i === 0 ? "rgba(26,37,53,0.04)" : "rgba(13,27,75,0.04)", border: i === 0 ? `1px solid ${BORDER}` : `1px solid rgba(13,27,75,0.12)` }}>
                      <p style={{ fontFamily: MONO, fontSize: 11, color: i === 0 ? FADED : BRAND, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>{h}</p>
                      <p style={{ fontSize: 14, color: i === 0 ? FADED : BODY_COLOR, lineHeight: 1.65 }}>
                        {i === 0 ? BEFORE_AFTER[activeBa].before : BEFORE_AFTER[activeBa].after}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Summary comparison table */}
            <FadeUp delay={0.1}>
              <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
                <div className="grid md:grid-cols-[1fr_1fr_1fr] px-5 py-3" style={{ background: "rgba(26,37,53,0.03)", borderBottom: `1px solid ${BORDER}` }}>
                  {["Dimension", "Before — Offline & Manual", "After — Workorbits"].map(h => (
                    <p key={h} style={{ fontFamily: MONO, fontSize: 12, color: FADED, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</p>
                  ))}
                </div>
                {[
                  { dim: "Time to booking",      before: "48–72 hours via phone/email",        after: "Under 10 minutes via in-app flow"         },
                  { dim: "Worker accountability", before: "None — no-shows with no recourse",   after: "Ratings, history, GPS clock-in"           },
                  { dim: "Ops visibility",        before: "WhatsApp groups + phone calls",      after: "Real-time dashboard with geo-fencing"     },
                  { dim: "Proof-of-work",         before: "None — disputes resolved informally",after: "Auto-generated certificate at shift end"  },
                  { dim: "Venue discovery",        before: "Individual calls, stale availability",after: "Self-serve calendar with live availability"},
                  { dim: "Enterprise reporting",   before: "Manual spreadsheets after the fact", after: "Live work-order table with status tags"  },
                ].map((row, i, arr) => (
                  <motion.div
                    key={row.dim}
                    className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr] gap-2 items-start px-5 py-3.5 cursor-default"
                    style={{ borderBottom: i < arr.length - 1 ? `1px solid rgba(26,37,53,0.05)` : "none" }}
                    whileHover={{ background: "rgba(26,37,53,0.02)" }}
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
              <H2>Four things scoped out of v1.</H2>
              <Body className="mb-10">
                Deliberately deferred — not because they weren&rsquo;t important, but because validating the core booking marketplace came first.
              </Body>
            </FadeUp>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                { n:"01", t:"AI-powered staff-job matching",         d:"Match workers to bookings based on past performance, ratings, skills tags, and location proximity. Early algorithm concept prototyped but deferred — requires sufficient booking history data to train on." },
                { n:"02", t:"Real-time worker GPS tracking in mobile app", d:"Live map view for field managers showing all active workers on a single screen. Geo-fencing alerts for workers entering or leaving a site. Designed in Figma; deferred pending native app build completion." },
                { n:"03", t:"Automated payroll + GST invoice generation", d:"Auto-generate worker payment slips and GST-compliant invoices at shift completion. Removes manual finance workflow for enterprise clients. Requires integration with an accounting API (Zoho Books or Tally)." },
                { n:"04", t:"Vernacular language support",            d:"Hindi and Gujarati language versions of the worker-facing mobile app for onboarding and shift management. Research showed 70% of temp workers in target markets were more comfortable in their native language." },
              ].map((f, i) => (
                <HoverCard key={f.n}>
                  <FadeUp delay={i * 0.06}>
                    <div className="p-5 rounded-lg h-full" style={{ background: "rgba(26,37,53,0.03)", border: `1px solid ${BORDER}` }}>
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
                Three design decisions where I chose one value over another — consciously. Each tradeoff is documented.
              </Body>
            </FadeUp>

            <div className="space-y-0">
              {[
                {
                  decision: "Web-first over native mobile for Workorbits",
                  chose:    "Faster time-to-market for enterprise clients on desktop",
                  traded:   "Richer mobile UX for workers in the field",
                  why:      "Enterprise clients — the buyers of the platform — primarily accessed it from office laptops during planning. Building a PWA-first dashboard got us to enterprise-ready faster than a native app build would have allowed. The cost was a compromised mobile experience for field workers, which we partially offset with the separate worker-facing mobile app and native gesture design in the mobile UI.",
                },
                {
                  decision: "Single design system across both Workorbits brands",
                  chose:    "Consistency and faster iteration across surfaces",
                  traded:   "Unique brand voice per product",
                  why:      "As the sole designer shipping four surfaces simultaneously, a shared component library was the only way to maintain quality across everything. The tradeoff was that Workorbits and Workorbits shared the same button shapes, card styles, and type scale — which made them feel like siblings rather than distinct products. For a bootstrapped startup targeting a single enterprise segment, consistency beat differentiation.",
                },
                {
                  decision: "Separate Workorbits brands and domains",
                  chose:    "Clearer value proposition per audience segment",
                  traded:   "Split marketing effort and two domains to maintain",
                  why:      "Workorbits spoke to businesses booking staff; Workorbits spoke to field operations managers tracking workforce. Combining them under one brand risked a confusing value prop for each. The founders agreed the audiences were distinct enough to justify the split. The cost — two websites, two domain costs, two onboarding flows — was real but acceptable at the early traction stage.",
                },
              ].map((t, i) => (
                <FadeUp key={t.decision} delay={i * 0.05}>
                  <motion.div
                    className="py-6 cursor-default"
                    style={{ borderBottom: `1px solid rgba(26,37,53,0.06)` }}
                    whileHover={{ background: "rgba(26,37,53,0.012)", paddingLeft: 6 }}
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
              <H2>What I learned building a marketplace from scratch.</H2>
            </FadeUp>

            <div className="space-y-0 mb-14">
              <FadeUp>
                <motion.div
                  className="grid md:grid-cols-[48px_1fr] gap-4 py-7 cursor-default"
                  style={{ borderBottom: `1px solid rgba(26,37,53,0.06)` }}
                  whileHover={{ background: "rgba(26,37,53,0.015)", paddingLeft: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <p style={{ fontFamily: MONO, fontSize: 13, color: FADED }}>01</p>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 500, color: BODY_COLOR, marginBottom: 6, lineHeight: 1.4 }}>Marketplace design is fundamentally about trust</p>
                    <Body>
                      Building Workorbits from zero taught me that marketplace design is fundamentally about trust — between buyers, sellers, and the platform itself. The biggest design challenge wasn&rsquo;t the UI; it was reducing the perceived risk of hiring someone you&rsquo;ve never met. The worker profile card, review system, and proof-of-work certificate became the most iterated components in the entire product.
                    </Body>
                  </div>
                </motion.div>
              </FadeUp>

              <FadeUp delay={0.06}>
                <motion.div
                  className="grid md:grid-cols-[48px_1fr] gap-4 py-7 cursor-default"
                  style={{ borderBottom: `1px solid rgba(26,37,53,0.06)` }}
                  whileHover={{ background: "rgba(26,37,53,0.015)", paddingLeft: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <p style={{ fontFamily: MONO, fontSize: 13, color: FADED }}>02</p>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 500, color: BODY_COLOR, marginBottom: 6, lineHeight: 1.4 }}>Shipping across four surfaces solo requires ruthless prioritisation</p>
                    <Body>
                      Shipping across four surfaces — website, webapp, mobile, design system — solo meant ruthless prioritisation. Every component needed to earn its place twice: once for the business-facing product, once for the worker-facing product. The design system wasn&rsquo;t a nice-to-have; it was the only way to ship consistently without burning out.
                    </Body>
                  </div>
                </motion.div>
              </FadeUp>

              <FadeUp delay={0.09}>
                <motion.div
                  className="grid md:grid-cols-[48px_1fr] gap-4 py-7 cursor-default"
                  style={{ borderBottom: `1px solid rgba(26,37,53,0.06)` }}
                  whileHover={{ background: "rgba(26,37,53,0.015)", paddingLeft: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <p style={{ fontFamily: MONO, fontSize: 13, color: FADED }}>03</p>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 500, color: BODY_COLOR, marginBottom: 6, lineHeight: 1.4 }}>Enterprise UX is ops UX — density and speed beat visual delight</p>
                    <Body>
                      The Workorbits dashboard taught me that enterprise UX is really operations UX. Field managers checking on 60 workers at 7am don&rsquo;t want beautiful empty states — they want dense, scannable tables with clear status tags. Every animation I removed and every row of data I surfaced earlier made the product more useful. Design for the task, not the portfolio screenshot.
                    </Body>
                  </div>
                </motion.div>
              </FadeUp>

              <FadeUp delay={0.12}>
                <motion.div
                  className="grid md:grid-cols-[48px_1fr] gap-4 py-7 cursor-default"
                  style={{ borderBottom: `1px solid rgba(26,37,53,0.06)` }}
                  whileHover={{ background: "rgba(26,37,53,0.015)", paddingLeft: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <p style={{ fontFamily: MONO, fontSize: 13, color: FADED }}>04</p>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 500, color: BODY_COLOR, marginBottom: 6, lineHeight: 1.4 }}>0→1 means designing the product and the pitch simultaneously</p>
                    <Body>
                      At the early stage, the design is also the fundraising material. The Workorbits marketing site and the Workorbits dashboard weren&rsquo;t just products — they were investor demos. Every pixel was doing double duty: convincing a field manager to try it, and convincing a seed investor to back it. Learning to hold both audiences in mind simultaneously was the most unexpected skill this project required.
                    </Body>
                  </div>
                </motion.div>
              </FadeUp>
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
