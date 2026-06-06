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
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string; }) {
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
function BrowserFrame({ children, url }: { children: React.ReactNode; url: string }) {
  return (
    <motion.div
      className="rounded-xl overflow-hidden"
      style={{ border: `1px solid ${BORDER}`, boxShadow: "0 4px 24px rgba(50,64,79,0.08)" }}
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center gap-1.5 px-4 py-2.5" style={{ background: "#1e2433" }}>
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ffbd2e" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#28c840" }} />
        <div className="ml-3 rounded px-3 py-0.5 max-w-xs" style={{ background: "#2a3245" }}>
          <span style={{ fontFamily: MONO, fontSize: 10, color: "#6b7799" }}>{url}</span>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

/* ─── Genea nav sidebar — Dashboard active ─────────── */
function GeneaDashSidebar() {
  const nav = [
    "Dashboard","Users Management","Alarms Management","Physical Inspections",
    "Keys","Control Center","Access Control","Emergency Plans",
    "Floor Plans","Hardware","Automations","Reports",
    "Badges","Email Templates","Integrations","Settings",
  ];
  return (
    <div className="shrink-0 flex flex-col" style={{ width: 130, background: "#fff", borderRight: "1px solid #e8eaed" }}>
      <div className="px-3 py-2.5 flex items-center gap-1.5" style={{ borderBottom: "1px solid #f0f0f0" }}>
        <span style={{ fontSize: 9, fontWeight: 600, color: "#1a1a2e" }}>Global Overview</span>
        <span style={{ fontSize: 8, color: "#9ca3af" }}>▾</span>
      </div>
      <div className="flex flex-col py-1">
        {nav.map((item) => (
          <div
            key={item}
            className="px-3 py-1 flex items-center gap-1.5"
            style={{
              background: item === "Dashboard" ? "#eff6ff" : "transparent",
              borderLeft: item === "Dashboard" ? "2px solid #1677ff" : "2px solid transparent",
            }}
          >
            <span style={{
              fontSize: 9,
              color: item === "Dashboard" ? "#1677ff" : "#4b5563",
              fontWeight: item === "Dashboard" ? 500 : 400,
            }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                     */
/* ═══════════════════════════════════════════════════ */
export default function CustomDashboardCaseStudy() {
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

  /* ─── SCREENS DATA ──────────────────────────────── */
  const SCREENS = [
    {
      label:    "Custom Dashboard",
      num:      "01",
      subtitle: "Drag-and-Drop Widget Grid",
      before:   "Fixed layout — hardcoded widgets, no reordering, no live feeds. Users navigated 4–5 separate modules to handle a single security incident.",
      after:    "Fully customizable drag-and-drop grid. Up to 5 named dashboards per user. Access Logs Live Feed updates in real time. Alarm Console, Door Monitor, Floor Plan all available as widgets.",
      decision: "Widgets dragged from the Add Widget side drawer directly onto the dashboard grid. Dashboard tabs in the top bar for one-click context switching. 'Customize' mode gates drag to prevent accidental moves.",
      screen: (
        <motion.div
          className="relative mx-auto overflow-hidden w-full"
          style={{ borderRadius: 10, boxShadow: "0 16px 48px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)", lineHeight: 0, overflow: "hidden" }}
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-5%" }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/case-studies/custom-dashboard/screen-01-custom-dashboard.png" alt="Genea custom analytics dashboard — drag-and-drop widget grid" style={{ width: "100%", display: "block" }} />
        </motion.div>
      )
    },
    {
      label:    "Add Widget",
      num:      "02",
      subtitle: "Side Drawer · Search + Category Sections",
      before:   "Add Widget via a plain dropdown list of widget names — no preview, no category grouping, no search. Users had to know the exact widget name to find what they needed.",
      after:    "Side drawer with a search bar ('Search by widget or category') and 6 category sections. Widgets display as icon cards in a 3-col grid. Drag directly from the drawer onto the dashboard.",
      decision: "AntD Drawer slides from the right. No filter pills — categories rendered as labelled section headers so all widgets are visible at a glance while still grouped logically. Drag-and-drop interaction: grab a card, drop on the grid.",
      screen: (
        <motion.div
          className="relative mx-auto overflow-hidden w-full"
          style={{ borderRadius: 10, boxShadow: "0 16px 48px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)", lineHeight: 0, overflow: "hidden" }}
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-5%" }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/case-studies/custom-dashboard/screen-02-add-widget.png" alt="Genea — Add Widget drawer with categorised widget library" style={{ width: "100%", display: "block" }} />
        </motion.div>
      )
    },
    {
      label:    "Configure Widget",
      num:      "03",
      subtitle: "Per-Widget Config Modal",
      before:   "No per-widget configuration. All widgets showed all events and all doors regardless of user scope. Multi-site admins saw data they had no jurisdiction over mixed with their critical feeds.",
      after:    "\"Configure widget\" modal: Name field, Events filter (e.g. Access Granted +35), Location dropdown, Doors multi-select, and a Placed Doors checklist with Door Name + Location columns.",
      decision: "Triggered from widget ⋮ menu. Name is editable so users can rename widgets for their context. Events dropdown filters the log type. Location + Doors cascade — selecting a location refreshes the doors list. Placed Doors table with checkboxes for granular door-level scope. Save and Close.",
      screen: (
        <motion.div
          className="relative mx-auto overflow-hidden w-full"
          style={{ borderRadius: 10, boxShadow: "0 16px 48px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)", lineHeight: 0, overflow: "hidden" }}
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-5%" }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/case-studies/custom-dashboard/screen-03-configure-widget.png" alt="Genea — Configure Widget drawer for Access Logs Live Feed" style={{ width: "100%", display: "block" }} />
        </motion.div>
      )
    },
    {
      label:    "Empty Dashboard",
      num:      "04",
      subtitle: "First-run onboarding",
      before:   '"No data yet." A blank page with zero guidance. 100% drop-off on first visit. New users had no entry point and no understanding of what the dashboard could do.',
      after:    "Purposeful empty state: headline explains value, two-tier CTA offers quick-start templates or manual build. Role-based starter packs. 71% of first-time users chose a template.",
      decision: "AntD Empty with custom SVG icon. Template quick-start cards use role labels (Security Ops, Visitor Hub, Analytics Suite). Template-first CTA mirrors the I/O Rules empty state approach validated in that project.",
      screen: (
        <motion.div
          className="relative mx-auto overflow-hidden w-full"
          style={{ borderRadius: 10, boxShadow: "0 16px 48px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)", lineHeight: 0, overflow: "hidden" }}
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-5%" }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/case-studies/custom-dashboard/screen-04-empty-dashboard.png" alt="Genea custom dashboard — empty state with Add Widget CTA" style={{ width: "100%", display: "block" }} />
        </motion.div>
      )
    },
  ];

  /* ══════════════════════════════════════════════════ */
  return (
    <div style={{ background: "#ffffff", minHeight: "100vh" }}>

      <div className="px-6 md:px-10 pt-8">
      <div className="flex gap-10 xl:gap-16">

        <Sidebar active={activeSection} />

        <div className="flex-1 min-w-0 pb-32">

          {/* ── Hero ────────────────────────────────── */}
          <div className="pt-6 pb-10">
            <div style={{ marginBottom: 20 }}>
              <CaseStudyBreadcrumb title="Analytics Dashboard" minRead={10} />
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              style={{ fontFamily: SERIF, fontSize: "clamp(2rem,4.5vw,3.25rem)", fontWeight: 400, color: BODY_COLOR, lineHeight: 1.1, marginBottom: "1.5rem" }}
            >
              Custom Analytics Dashboard<br />for Enterprise Facility Managers
            </motion.h1>

            {/* Hero cover */}
            <motion.div
              initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="w-full rounded-xl overflow-hidden mb-8"
              style={{ background: "#0e1b2e", aspectRatio: "16/7", minHeight: 260, position: "relative" }}
            >
              <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
                backgroundSize: "48px 48px",
              }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center gap-5">
                <p style={{ fontFamily: MONO, fontSize: 12, color: "rgba(255,255,255,0.25)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                  Genea Security × AntD 5.10
                </p>
                <p style={{ fontFamily: SERIF, fontSize: "clamp(1.4rem,2.5vw,2rem)", color: "rgba(255,255,255,0.88)", fontWeight: 400 }}>
                  Custom Dashboard — Single Pane of Glass
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    { v: "+25%",  l: "Operational Efficiency" },
                    { v: "-20%",  l: "Support Queries" },
                    { v: "18+",   l: "Widget Types" },
                    { v: "5",     l: "Dashboards per User" },
                    { v: "<2s",   l: "Widget Load Time" },
                    { v: "4.2×",  l: "Faster Incident Response" },
                  ].map((o, i) => (
                    <motion.div
                      key={o.l}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 + i * 0.06, duration: 0.4 }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                      style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}
                    >
                      <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.88)" }}>{o.v}</span>
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{o.l}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Meta */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-y-6 pt-6"
              style={{ borderTop: `1px solid ${BORDER}` }}
            >
              {[
                { label: "Role",     value: "Senior Product Designer"                  },
                { label: "Tools",    value: "Figma · AntD 5.10 · Claude Code"         },
                { label: "Timeline", value: "8 Weeks · Oct – Nov 2024"                },
                { label: "Output",   value: "18 widget types · 4 dashboard templates" },
              ].map((m) => (
                <div key={m.label}>
                  <p className="uppercase mb-1" style={{ fontFamily: MONO, fontSize: 12, color: FADED, letterSpacing: "0.07em" }}>{m.label}</p>
                  <p style={{ fontSize: 14, color: BODY_COLOR }}>{m.value}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Overview ──────────────────────────── */}
          <section id="overview" className="scroll-mt-[72px] pt-12" style={{ borderTop: `1px solid ${BORDER}` }}>
            <FadeUp>
              <SectionLabel>Overview</SectionLabel>
              <H2>What does a security operations centre see when everything matters at once?</H2>
              <Body className="mb-4">
                Enterprise security admins managing physical access need real-time visibility, quick-action controls, and historical analytics — all from one screen. Genea&apos;s original dashboard showed six hardcoded widgets in a fixed layout, offered no live feeds, and forced users to navigate across four separate modules to handle a single security incident.
              </Body>
              <Body className="mb-10">
                The cost wasn&apos;t a poor experience. It was a 4-minute average incident response time when the industry target is under 60 seconds.
              </Body>
            </FadeUp>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { title: "Customisation Architecture",  body: "Design a widget system — Surveillance, Occupancy Analytics, Emergency Control, Device Health, User Management, Visitor Management — flexible enough for a 10-person fintech and a 500-door enterprise without exposing complexity to either." },
                { title: "Real-time Integration",       body: "Live feeds change the information hierarchy of every widget. Static design patterns don't apply — the Access Logs Live Feed widget needed its own visual language distinct from the static Occupancy Analytics widgets." },
                { title: "Operational Efficiency",      body: "Reduce the number of module navigations required for a single incident. The goal: see the Access Log, check the Alarm Console, and trigger an Emergency Plan — all without leaving the dashboard." },
              ].map((c, i) => (
                <FadeUp key={c.title} delay={i * 0.08}>
                  <p style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 400, color: BODY_COLOR, marginBottom: 8 }}>{c.title}</p>
                  <Body>{c.body}</Body>
                </FadeUp>
              ))}
            </div>
          </section>

          {/* ── Problem ───────────────────────────── */}
          <section id="problem" className="scroll-mt-[72px] pt-16 mt-16" style={{ borderTop: `1px solid ${BORDER}` }}>
            <FadeUp>
              <SectionLabel>Problem</SectionLabel>
              <H2>Four tabs to handle one alarm. That&apos;s the product.</H2>
              <Body className="mb-4">
                James is Head of Security at a fintech firm in Chicago, managing 8 floors, 340 doors, and a 24/7 security team. When an alarm fires at 3&nbsp;AM, he needs to see the door, see who accessed it, check the camera feed, and trigger an emergency plan — all in under 60 seconds.
              </Body>
              <Body className="mb-4">
                Genea&apos;s dashboard was fixed: six static widgets, no live feed, no quick-action buttons. James opened the Alarms tab, navigated to Hardware to identify the door, opened Reports to check recent access, then went to Emergency Plans to escalate. Four tabs. One incident.
              </Body>
              <Body className="mb-10">
                The response time wasn&apos;t a James problem. The product made it structurally impossible to do it any faster.
              </Body>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className="rounded-xl p-8" style={{ background: "rgba(50,64,79,0.03)", border: `1px solid ${BORDER}` }}>
                <p className="uppercase mb-6" style={{ fontFamily: MONO, fontSize: 12, color: FADED, letterSpacing: "0.08em" }}>The Incident Response Chain — Before</p>
                <div className="flex flex-col gap-0">
                  {[
                    { step: "Alarm fires on Floor 6 – Server Room",         note: ""                  },
                    { step: "Opens Alarms Management tab",                   note: ""                  },
                    { step: "Navigates to Hardware → identifies door",       note: "2nd module"        },
                    { step: "Opens Reports → checks last 10 access events",  note: "3rd module"        },
                    { step: "Opens Emergency Plans → escalates to team",     note: "4th module"        },
                    { step: "Response time: 4 minutes 12 seconds",           note: "target: 60 seconds" },
                  ].map((s, i, arr) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center shrink-0">
                        <motion.div
                          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[9px] mt-0.5"
                          style={{ background: i === arr.length - 1 ? BODY_COLOR : "rgba(50,64,79,0.12)", color: i === arr.length - 1 ? "#fff" : FADED }}
                          whileHover={{ scale: 1.15 }}
                        >
                          {i + 1}
                        </motion.div>
                        {i < arr.length - 1 && <div className="w-px my-1" style={{ flex: 1, background: BORDER, minHeight: 20 }} />}
                      </div>
                      <div className="pb-4 flex items-start justify-between flex-1">
                        <span style={{ fontSize: 14, color: BODY_COLOR, lineHeight: 1.5 }}>{s.step}</span>
                        {s.note && (
                          <span className="shrink-0 ml-3 px-2 py-0.5 rounded" style={{ fontSize: 10, background: "rgba(50,64,79,0.07)", color: FADED }}>{s.note}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.15} className="mt-6">
              <Body>
                Six additional problems surfaced in interviews: no widget reordering, no multi-location comparison, no historical trend data, no export or sharing, no role enforcement for security teams, and no way to add widgets beyond the fixed six. The dashboard was a viewer, not a workspace.
              </Body>
            </FadeUp>
          </section>

          {/* ── Process ───────────────────────────── */}
          <section id="process" className="scroll-mt-[72px] pt-16 mt-16" style={{ borderTop: `1px solid ${BORDER}` }}>
            <FadeUp>
              <SectionLabel>Process</SectionLabel>
              <H2>13 stages, end to end.</H2>
              <Body className="mb-10">From PRD analysis to post-launch impact measurement. Each stage fed the next.</Body>
            </FadeUp>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {[
                { n:"01", t:"PRD Intelligence",        d:"Decode 'customizable' from 8 customer interviews"  },
                { n:"02", t:"Current State Audit",      d:"23 UX gaps across 4 dashboard use cases"          },
                { n:"03", t:"Stakeholder Alignment",    d:"3 PM/Eng sessions, feasibility constraints locked" },
                { n:"04", t:"Competitor Analysis",      d:"5 enterprise security platforms benchmarked"      },
                { n:"05", t:"Research Synthesis",       d:"6 affinity clusters from interview transcripts"   },
                { n:"06", t:"Widget Taxonomy",          d:"6 categories, 18+ types, priority matrix"         },
                { n:"07", t:"User Flow Mapping",        d:"4 journeys: Setup, Daily Ops, Incident, Reporting"},
                { n:"08", t:"Low-Fi Wireframes",        d:"3 layout systems × 4 states each"                 },
                { n:"09", t:"High-Fi Production",       d:"15 widget designs + gallery + drag system"        },
                { n:"10", t:"Customer Preview",         d:"2 enterprise customer feedback sessions"          },
                { n:"11", t:"Iteration",                d:"2 rounds: widget density + gallery preview UX"    },
                { n:"12", t:"Handoff Spec",             d:"Drag-and-drop, real-time, responsive, a11y"       },
                { n:"13", t:"Impact Measurement",       d:"3-month post-launch tracking + ticket analysis"   },
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

          {/* ── Research ──────────────────────────── */}
          <section id="research" className="scroll-mt-[72px] pt-16 mt-16" style={{ borderTop: `1px solid ${BORDER}` }}>
            <FadeUp>
              <SectionLabel>Research</SectionLabel>
              <H2>Eight customers. Six use cases. One product gap that cut across all of them.</H2>
              <Body className="mb-10">
                Interview enterprise customers to understand what &ldquo;customizable&rdquo; really means for their operational context — and map exactly where the fixed dashboard broke down.
              </Body>
            </FadeUp>

            <FadeUp delay={0.08}>
              <div className="rounded-xl p-10 mb-10" style={{ background: "rgba(50,64,79,0.03)", border: `1px solid ${BORDER}` }}>
                <p className="uppercase mb-8" style={{ fontFamily: MONO, fontSize: 12, color: FADED, letterSpacing: "0.08em" }}>Research at a glance</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  {[
                    { raw: "8",    label: "Enterprise customers\ninterviewed" },
                    { raw: "23",   label: "Dashboard gaps\ndocumented" },
                    { raw: "5",    label: "Competitor platforms\nbenchmarked" },
                    { raw: "4",    label: "Primary use cases\nmapped" },
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
                "How might we let security admins configure dashboards to match their specific operational workflow — without exposing unnecessary complexity?",
                "How might we surface live security feeds without overwhelming the interface or degrading trust in static data?",
                "How might we reduce incident response time by consolidating cross-module actions into a single dashboard context?",
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

            {/* Customer feedback */}
            <FadeUp delay={0.1}>
              <SectionLabel>Key Customer Feedback</SectionLabel>
              <div className="rounded-xl overflow-hidden mb-10" style={{ border: `1px solid ${BORDER}` }}>
                <div className="hidden md:grid grid-cols-[160px_1fr_140px] px-5 py-3" style={{ background: "rgba(50,64,79,0.03)", borderBottom: `1px solid ${BORDER}` }}>
                  {["Customer","Request","Priority"].map(h => (
                    <p key={h} style={{ fontFamily: MONO, fontSize: 12, color: FADED, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</p>
                  ))}
                </div>
                {[
                  { name: "Customer A · Fintech",        req: "Better filtering on the Access Logs Live Feed — hundreds of doors generate too much noise. The Alarm Console widget needs dismiss + escalate actions inline rather than navigating to the full Alarms module.", pri: "Critical",  pC: "rgba(220,38,38,0.07)",  pT: "#dc2626" },
                  { name: "Customer B · Trading Firm",   req: "Exclude weekends from Occupancy Analytics — office operates Mon–Fri. Daily Arrival Insights and Global/Building Utilization charts are distorted by zero-activity weekend data.", pri: "High",     pC: "rgba(234,88,12,0.08)",  pT: "#ea580c" },
                  { name: "Customer C · Property Mgmt",  req: "Multi-location comparison on one dashboard — manages offices globally, needs side-by-side Global/Building Daily Insights without switching location contexts.", pri: "High",     pC: "rgba(234,88,12,0.08)",  pT: "#ea580c" },
                  { name: "Customer D · Enterprise",     req: "Role-enforced dashboard for security guards — admin-set layout guards can view but not modify. Also requested an office usage policy compliance widget under Occupancy Analytics.", pri: "Medium",   pC: "rgba(22,163,74,0.08)",  pT: "#16a34a" },
                ].map((c, i, arr) => (
                  <motion.div
                    key={c.name}
                    className="grid grid-cols-1 md:grid-cols-[160px_1fr_140px] gap-2 items-start px-5 py-4 cursor-default"
                    style={{ borderBottom: i < arr.length - 1 ? `1px solid rgba(50,64,79,0.05)` : "none" }}
                    whileHover={{ background: "rgba(50,64,79,0.02)" }}
                    transition={{ duration: 0.15 }}
                  >
                    <p style={{ fontSize: 13, fontWeight: 500, color: BODY_COLOR }}>{c.name}</p>
                    <p style={{ fontSize: 12, color: FADED, lineHeight: 1.5 }}>{c.req}</p>
                    <span className="self-start inline-block text-[10px] px-2 py-0.5 rounded" style={{ background: c.pC, color: c.pT, fontFamily: MONO }}>{c.pri}</span>
                  </motion.div>
                ))}
              </div>
            </FadeUp>

            {/* Competitor analysis */}
            <FadeUp delay={0.1}>
              <SectionLabel>Competitor Analysis — 5 Platforms</SectionLabel>
              <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
                <div className="hidden md:grid grid-cols-[180px_1fr_110px] px-5 py-3" style={{ background: "rgba(50,64,79,0.03)", borderBottom: `1px solid ${BORDER}` }}>
                  {["Platform","Key Pattern","Verdict"].map(h => (
                    <p key={h} style={{ fontFamily: MONO, fontSize: 12, color: FADED, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</p>
                  ))}
                </div>
                {[
                  { name: "Genetec Security Center",  pattern: "Fully customizable tile-based dashboards, supports live camera feeds natively. Expert-heavy initial setup — most admins rely on IT to configure.",                verdict: "Adopt: layout model", adopt: true  },
                  { name: "Lenel S2 OnGuard",         pattern: "Multiple dashboard profiles per user role. Role-based enforcement built in. Configuration is complex but the model is correct.",                              verdict: "Adopt: role model",   adopt: true  },
                  { name: "Avigilon Unity",           pattern: "Camera-first layout. Strong video integration but no access log or analytics widgets. Surveillance in isolation.",                                             verdict: "Avoid: siloed",       adopt: false },
                  { name: "Honeywell Pro-Watch",      pattern: "Rich widget library (40+ types). No drag-and-drop — grid preset only. Widget taxonomy is the best-in-class reference.",                                      verdict: "Adopt: taxonomy",     adopt: true  },
                  { name: "Brivo Access",             pattern: "Clean, consumer-friendly dashboard. Fixed layout — no customization at all. Excellent empty state and onboarding, terrible enterprise depth.",                verdict: "Adopt: empty state",  adopt: true  },
                ].map((c, i, arr) => (
                  <motion.div
                    key={c.name}
                    className="grid grid-cols-1 md:grid-cols-[180px_1fr_110px] gap-2 items-start px-5 py-4 cursor-default"
                    style={{ borderBottom: i < arr.length - 1 ? `1px solid rgba(50,64,79,0.05)` : "none" }}
                    whileHover={{ background: "rgba(50,64,79,0.02)" }}
                    transition={{ duration: 0.15 }}
                  >
                    <p style={{ fontSize: 13, fontWeight: 500, color: BODY_COLOR }}>{c.name}</p>
                    <p style={{ fontSize: 12, color: FADED, lineHeight: 1.5 }}>{c.pattern}</p>
                    <span className="self-start inline-block text-[10px] px-2 py-0.5 rounded" style={{ background: c.adopt ? "rgba(22,163,74,0.08)" : "rgba(220,38,38,0.07)", color: c.adopt ? "#16a34a" : "#dc2626", fontFamily: MONO }}>
                      {c.verdict}
                    </span>
                  </motion.div>
                ))}
              </div>
            </FadeUp>
          </section>

          {/* ── Iterations ────────────────────────── */}
          <section id="iterations" className="scroll-mt-[72px] pt-16 mt-16" style={{ borderTop: `1px solid ${BORDER}` }}>
            <FadeUp>
              <SectionLabel>Iterations</SectionLabel>
              <H2>Three versions. Two failures. One that worked.</H2>
              <Body className="mb-10">What was tried, why it failed, what replaced it, and why that worked.</Body>
            </FadeUp>

            <div className="space-y-4">
              {[
                {
                  v: "v1", title: "Fixed-Width Widget Cards + Tab Navigation", status: "Failed",
                  why: "Predefined widget sizes caused an information density mismatch. Large customers (200+ doors) needed dense data tables; small customers needed visual summary cards. One size fit neither. Tab navigation for switching between dashboards added 2+ clicks to every context switch. The empty state was a dead end — zero guidance on what to add or why.",
                  what: "Moved to a fluid grid system where widgets resize to their content. Replaced tab navigation with named dashboard tabs in the top bar — one click to switch. Redesigned the empty state as an active entry point with template quick-starts derived from the three most common customer profiles (Security Ops, Visitor Hub, Analytics Suite). Widget names aligned to actual module names: Access Logs Live Feed, Alarm Console, Door Monitor, Floor Plan.",
                },
                {
                  v: "v2", title: "Fluid Grid + Slide-In Widget Gallery", status: "Partial",
                  why: "Fluid grid solved widget density — widgets now resized correctly. The gallery slide-in worked well for discovery. BUT: the Add Widget flow required 3 clicks minimum (open gallery → select category → click add) and users couldn&apos;t preview widget behaviour before adding. 6/10 users added the wrong widget type. The gallery showed widget names and icons with no context of what data they contained.",
                  what: "Side drawer with a search bar and category sections (Surveillance, Occupancy Analytics, Emergency Control, Device Health, User Management, Visitor Management) — all widgets visible at a glance, no filter clicks required. Drag a widget card directly from the drawer onto the dashboard grid. Add Widget path reduced from 3 clicks to a single drag. Task completion improved by +22pp. 71% of first-time users chose a template over building from scratch.",
                },
              ].map((v, i) => (
                <FadeUp key={v.v} delay={i * 0.08}>
                  <HoverCard>
                    <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
                      <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: `1px solid rgba(50,64,79,0.05)`, background: "rgba(50,64,79,0.02)" }}>
                        <p style={{ fontSize: 13, fontWeight: 500, color: BODY_COLOR }}>{v.v} · {v.title}</p>
                        <span style={{ fontFamily: MONO, fontSize: 10, padding: "2px 8px", borderRadius: 4, background: v.status === "Failed" ? "rgba(220,38,38,0.08)" : "rgba(217,119,6,0.08)", color: v.status === "Failed" ? "#dc2626" : "#d97706" }}>
                          {v.status}
                        </span>
                      </div>
                      <div className="grid md:grid-cols-2" style={{ borderColor: "rgba(50,64,79,0.06)" }}>
                        <div className="p-5" style={{ borderRight: "1px solid rgba(50,64,79,0.06)" }}>
                          <p style={{ fontFamily: MONO, fontSize: 12, color: FADED, textTransform: "uppercase", marginBottom: 8 }}>Why it didn&apos;t work</p>
                          <p style={{ fontSize: 13, color: FADED, lineHeight: 1.65 }}>{v.why}</p>
                        </div>
                        <div className="p-5">
                          <p style={{ fontFamily: MONO, fontSize: 12, color: FADED, textTransform: "uppercase", marginBottom: 8 }}>What changed</p>
                          <p style={{ fontSize: 13, color: FADED, lineHeight: 1.65 }}>{v.what}</p>
                        </div>
                      </div>
                    </div>
                  </HoverCard>
                </FadeUp>
              ))}
            </div>
          </section>

          {/* ── Solution Screens — TABBED ─────────── */}
          <section id="solutions" className="scroll-mt-[72px] pt-16 mt-16" style={{ borderTop: `1px solid ${BORDER}` }}>
            <FadeUp>
              <SectionLabel>Solution Screens</SectionLabel>
              <H2>Four screens that show the thinking.</H2>
              <Body className="mb-10">
                Each screen solves a specific failure mode. Annotated with before, after, and the design decision that drove the change.
              </Body>
            </FadeUp>

            <FadeUp delay={0.08}>
              <div className="flex gap-0 mb-6 rounded-lg overflow-hidden" style={{ border: `1px solid ${BORDER}`, width: "fit-content" }}>
                {SCREENS.map((s, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setActiveScreen(i)}
                    className="px-5 py-2.5 transition-all cursor-pointer"
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
                <p style={{ fontSize: 12, color: FADED, marginBottom: 12, fontFamily: MONO }}>
                  {SCREENS[activeScreen].num} — {SCREENS[activeScreen].label} · {SCREENS[activeScreen].subtitle}
                </p>

                <BrowserFrame url={["app.genea.com / dashboard","app.genea.com / dashboard / add-widget","app.genea.com / dashboard / configure-widget","app.genea.com / dashboard"][activeScreen] ?? "app.genea.com / dashboard"}>
                  {SCREENS[activeScreen].screen}
                </BrowserFrame>

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

          {/* ── Before & After ────────────────────── */}
          <section id="beforeafter" className="scroll-mt-[72px] pt-16 mt-16" style={{ borderTop: `1px solid ${BORDER}` }}>
            <FadeUp>
              <SectionLabel>Before &amp; After</SectionLabel>
              <H2>Two screens. The same product — before and after the shift from fixed to flexible.</H2>
              <Body className="mb-10">
                Side-by-side comparison of the highest-impact changes: the dashboard layout system and the widget discovery flow.
              </Body>
            </FadeUp>

            {/* Dashboard Layout */}
            <FadeUp delay={0.05}>
              <div className="rounded-xl overflow-hidden mb-8" style={{ border: `1px solid ${BORDER}` }}>
                <div className="px-6 py-4" style={{ borderBottom: `1px solid rgba(50,64,79,0.06)`, background: "rgba(50,64,79,0.02)" }}>
                  <p style={{ fontFamily: MONO, fontSize: 12, color: FADED, textTransform: "uppercase", marginBottom: 3 }}>Screen 01</p>
                  <p style={{ fontSize: 15, fontWeight: 500, color: BODY_COLOR }}>Dashboard Layout</p>
                  <p style={{ fontSize: 13, color: FADED, marginTop: 2 }}>From a fixed, non-configurable view to a personalised drag-and-drop workspace.</p>
                </div>
                <div className="grid md:grid-cols-2">
                  <div className="p-6" style={{ borderRight: `1px solid rgba(50,64,79,0.06)` }}>
                    <div className="flex items-center gap-2 mb-5">
                      <span className="w-2 h-2 rounded-full" style={{ background: "#dc2626" }} />
                      <p style={{ fontFamily: MONO, fontSize: 12, color: FADED, textTransform: "uppercase", letterSpacing: "0.06em" }}>Before</p>
                    </div>
                    {[
                      { code: "D01", title: "Fixed, non-configurable",  body: "Six hardcoded widgets in a predetermined layout. No reordering, no removal, no addition. Every user saw the same dashboard regardless of role or use case." },
                      { code: "D03", title: "No live data",             body: "All widgets showed static data refreshed on page load. No live access log feed, no real-time alarm state. Users had no way to monitor an ongoing incident without manually refreshing." },
                      { code: "D05", title: "Single context",           body: "One dashboard view for all contexts — Security Ops, Visitor Management, Analytics, and Executive Reporting all shared the same 6-widget layout." },
                    ].map((p) => (
                      <div key={p.code} className="mb-5">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span style={{ fontFamily: MONO, fontSize: 9, color: "#dc2626", background: "rgba(220,38,38,0.07)", padding: "2px 6px", borderRadius: 4 }}>{p.code}</span>
                          <span style={{ fontSize: 13, fontWeight: 500, color: BODY_COLOR }}>{p.title}</span>
                        </div>
                        <p style={{ fontSize: 13, color: FADED, lineHeight: 1.65 }}>{p.body}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-5">
                      <span className="w-2 h-2 rounded-full" style={{ background: "#16a34a" }} />
                      <p style={{ fontFamily: MONO, fontSize: 12, color: FADED, textTransform: "uppercase", letterSpacing: "0.06em" }}>After</p>
                    </div>
                    {[
                      { title: "Drag-and-drop widget grid", body: "Widgets dragged from the Add Widget side drawer directly onto the dashboard grid. 'Customize' mode gates drag interactions to prevent accidental moves (reduced misclicks from 34% to 3%). Up to 5 named dashboards per user." },
                      { title: "Access Logs Live Feed under 1 second", body: "The Access Logs Live Feed widget is the centrepiece — real-time polling with a LIVE badge and pulse indicator. Users who saw live log data within 5 s had 4× higher 30-day retention." },
                      { title: "Multiple named dashboards", body: "Security Ops, Visitor Hub, Analytics Suite — each with its own layout and widget set chosen from 6 categories: Surveillance, Occupancy Analytics, Emergency Control, Device Health, User Management, Visitor Management." },
                    ].map((s) => (
                      <div key={s.title} className="mb-5">
                        <p style={{ fontSize: 13, fontWeight: 500, color: BODY_COLOR, marginBottom: 4 }}>{s.title}</p>
                        <p style={{ fontSize: 13, color: FADED, lineHeight: 1.65 }}>{s.body}</p>
                      </div>
                    ))}
                    <p style={{ fontSize: 11, color: FADED, fontFamily: MONO, marginTop: 8 }}>Gaps resolved: D01 · D02 · D03 · D05 · D08 · D11</p>
                  </div>
                </div>
              </div>
            </FadeUp>

            {/* Widget Discovery */}
            <FadeUp delay={0.1}>
              <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
                <div className="px-6 py-4" style={{ borderBottom: `1px solid rgba(50,64,79,0.06)`, background: "rgba(50,64,79,0.02)" }}>
                  <p style={{ fontFamily: MONO, fontSize: 12, color: FADED, textTransform: "uppercase", marginBottom: 3 }}>Screen 02</p>
                  <p style={{ fontSize: 15, fontWeight: 500, color: BODY_COLOR }}>Add Widget — Side Drawer</p>
                  <p style={{ fontSize: 13, color: FADED, marginTop: 2 }}>From an opaque dropdown list to a searchable side drawer with category sections and drag-and-drop.</p>
                </div>
                <div className="grid md:grid-cols-2">
                  <div className="p-6" style={{ borderRight: `1px solid rgba(50,64,79,0.06)` }}>
                    <div className="flex items-center gap-2 mb-5">
                      <span className="w-2 h-2 rounded-full" style={{ background: "#dc2626" }} />
                      <p style={{ fontFamily: MONO, fontSize: 12, color: FADED, textTransform: "uppercase", letterSpacing: "0.06em" }}>Before</p>
                    </div>
                    {[
                      { code: "D06", title: "Dropdown list, no search",     body: "Widget names in a plain dropdown with no category grouping, no icons, no description. Users had to already know the widget name. 6/10 users added the wrong widget type in usability sessions." },
                      { code: "D07", title: "No category organisation",    body: "Surveillance, Occupancy Analytics, Emergency Control, Device Health, User Management, and Visitor Management widgets listed as a flat alphabetical list — no mental model to navigate." },
                      { code: "D09", title: "Multi-click + no drag path",  body: "Open modal → find widget → click add → confirm. Entirely click-based with no drag affordance. High removal rate post-add because users couldn't preview widget content before committing." },
                    ].map((p) => (
                      <div key={p.code} className="mb-5">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span style={{ fontFamily: MONO, fontSize: 9, color: "#dc2626", background: "rgba(220,38,38,0.07)", padding: "2px 6px", borderRadius: 4 }}>{p.code}</span>
                          <span style={{ fontSize: 13, fontWeight: 500, color: BODY_COLOR }}>{p.title}</span>
                        </div>
                        <p style={{ fontSize: 13, color: FADED, lineHeight: 1.65 }}>{p.body}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-5">
                      <span className="w-2 h-2 rounded-full" style={{ background: "#16a34a" }} />
                      <p style={{ fontFamily: MONO, fontSize: 12, color: FADED, textTransform: "uppercase", letterSpacing: "0.06em" }}>After</p>
                    </div>
                    {[
                      { title: "Side drawer with search + category sections", body: "\"Add Widget\" drawer slides from the right with a search bar ('Search by widget or category') and labelled sections for all 6 categories. All widgets visible without clicking a filter — category headers do the grouping." },
                      { title: "6 categories, 17 widget types",  body: "Surveillance (5) · Occupancy Analytics (6) · Emergency Control (1) · Device Health (1) · User Management (3) · Visitor Management (1). Section headers maintain context without hiding options." },
                      { title: "Drag directly onto the grid",   body: "Users grab a widget card from the drawer and drop it on the dashboard. No confirmation step. Drag interaction matches the 'drag and drop the widgets' instruction in the drawer subtitle — zero mismatch between instruction and affordance." },
                    ].map((s) => (
                      <div key={s.title} className="mb-5">
                        <p style={{ fontSize: 13, fontWeight: 500, color: BODY_COLOR, marginBottom: 4 }}>{s.title}</p>
                        <p style={{ fontSize: 13, color: FADED, lineHeight: 1.65 }}>{s.body}</p>
                      </div>
                    ))}
                    <p style={{ fontSize: 11, color: FADED, fontFamily: MONO, marginTop: 8 }}>Gaps resolved: D06 · D07 · D09 · D12 · D14 · D17</p>
                  </div>
                </div>
              </div>
            </FadeUp>
          </section>

          {/* ── Future Scope ──────────────────────── */}
          <section id="future" className="scroll-mt-[72px] pt-16 mt-16" style={{ borderTop: `1px solid ${BORDER}` }}>
            <FadeUp>
              <SectionLabel>Future Scope</SectionLabel>
              <H2>What comes next.</H2>
              <Body className="mb-10">
                Sequenced as a product backlog. Cross-location dashboard templates and role-enforced layouts are the two highest-priority items — both were top-3 enterprise requests in post-launch feedback.
              </Body>
            </FadeUp>

            <div className="space-y-0">
              {[
                { m: "Milestone 1 · Immediate", t: "Cross-Location Dashboard Templates",    b: "Allow org admins to create and push a standard dashboard layout to all users in a specific location. The template defines which widgets appear and in what order — users can add to it but not remove the admin-set widgets. Multiple enterprise customers requested this as a compliance requirement for security guard team workflows." },
                { m: "Milestone 1",             t: "Role-Enforced Dashboard",               b: "Admins configure a 'base dashboard' for security roles that cannot be removed — only extended by the user. Security guards see a locked layout tuned for incident response; executives see an analytics-heavy read-only view. The most-requested enterprise feature post-launch (23 Canny upvotes)." },
                { m: "Milestone 2",             t: "Widget-Level Alerting",                 b: "Surface threshold-based alerts directly on dashboard widgets (e.g. 'Show banner when a door is held open >60s') without requiring Automations configuration. Users who want passive monitoring today must configure a full automation rule — the widget alert is a lighter-weight trigger for the 80% case." },
                { m: "Milestone 2",             t: "Weekend Exclusion + Custom Schedules",  b: "Allow Occupancy Analytics widgets (Daily Arrival Insights, Global/Building Utilization, Weekly Average Traffic) to exclude specific days or define custom business hours. Several Mon–Fri enterprises have distorted utilization data due to zero-activity weekends. A date-range mask would fix this without backend data transformation." },
                { m: "Milestone 3",             t: "Cross-Dashboard Export",                b: "Export any dashboard view as a styled PDF or CSV for compliance and executive briefings. Security operations teams today copy-paste from the dashboard into Word documents. A one-click export in brand template would save an estimated 2 hours per week per site manager." },
                { m: "Milestone 3",             t: "Multi-Location Comparison Widget",      b: "A single widget showing two or more locations side-by-side — occupancy, access events, alarm frequency. Multi-site enterprises currently export data to Excel for cross-location comparison. This closes the last gap between the dashboard and a dedicated analytics tool." },
              ].map((f, i) => (
                <FadeUp key={f.t} delay={i * 0.06}>
                  <motion.div
                    className="grid md:grid-cols-[200px_1fr] gap-6 py-5 cursor-default"
                    style={{ borderBottom: `1px solid rgba(50,64,79,0.06)` }}
                    whileHover={{ paddingLeft: 6, background: "rgba(50,64,79,0.015)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <div>
                      <p style={{ fontFamily: MONO, fontSize: 11, color: FADED, marginBottom: 4 }}>{f.m}</p>
                      <p style={{ fontSize: 15, fontWeight: 500, color: BODY_COLOR }}>{f.t}</p>
                    </div>
                    <Body>{f.b}</Body>
                  </motion.div>
                </FadeUp>
              ))}
            </div>
          </section>

          {/* ── Tradeoffs ─────────────────────────── */}
          <section id="tradeoffs" className="scroll-mt-[72px] pt-16 mt-16" style={{ borderTop: `1px solid ${BORDER}` }}>
            <FadeUp>
              <SectionLabel>Tradeoffs</SectionLabel>
              <H2>Every decision cost something.</H2>
              <Body className="mb-10">
                These are the decisions where we chose one value over another — consciously. Each tradeoff is still live; some will be revisited in future milestones.
              </Body>
            </FadeUp>

            <div className="space-y-0">
              {[
                {
                  decision: "Category sections over filter pills in the Add Widget drawer",
                  chose:    "Discoverability for new users",
                  traded:   "Speed for power users",
                  why:      "Section headers keep all 17 widgets visible without a filter click — new users can browse and stumble onto widgets they didn't know existed. The cost: the drawer is long and requires scrolling if you already know what you want. Power users expected a filter pill. We accepted this because first-run discovery matters more than expert retrieval — and search is available for the expert path.",
                },
                {
                  decision: "'Edit Layout' mode gating drag interactions",
                  chose:    "Safety against accidental moves",
                  traded:   "Immediate, frictionless customisation",
                  why:      "Free drag-at-any-time felt fluid in prototypes but caused 34% accidental widget moves in testing. Gating behind a mode adds one deliberate click before every layout edit. Enterprise users managing shared dashboards accepted this — they valued predictability over fluency. But it means the dashboard feels less 'live' and more 'configured', which is the right tone for a security operations tool.",
                },
                {
                  decision: "5 dashboard cap per user",
                  chose:    "UI clarity and a manageable tab bar",
                  traded:   "Unlimited flexibility for power users",
                  why:      "Beyond 5 tabs the top bar wraps or truncates — both states are worse than the cap. Most users in testing created 2–3 dashboards; power users hit the ceiling occasionally and requested more. The cap can be lifted in a future release, but shipping without a limit would have deferred the tab overflow problem to users rather than solving it in design.",
                },
                {
                  decision: "Phase I scoped to Global Overview only — no per-location dashboards",
                  chose:    "Shipping speed and backend simplicity",
                  traded:   "Full multi-site dashboard isolation",
                  why:      "Per-location dashboards require the backend to enforce data isolation — each widget must respect a location scope set at the dashboard level, not just the widget level. That logic wasn't ready. Global Overview validated the core widget system with real customers. The limitation was felt most by multi-site admins who wanted a 'Toronto only' dashboard — acknowledged as a Phase II requirement.",
                },
                {
                  decision: "Only Access Logs Live Feed polls at 1 s; all other widgets refresh at 30 s",
                  chose:    "Dashboard performance and server load",
                  traded:   "Real-time parity across all widgets",
                  why:      "A dashboard with six 1 s polling widgets would generate ~360 requests/minute per user. For enterprise customers with concurrent dashboards open across a security team, this becomes a backend scaling problem before the widget system is proven. Live polling was scoped to the one widget where sub-second latency has direct operational impact — the access log feed. Alarm Console users asked why it wasn't live; it's the primary Phase II live expansion.",
                },
                {
                  decision: "Allowing users to rename widgets in Configure Widget",
                  chose:    "Personal context and operational clarity",
                  traded:   "Org-wide template shareability",
                  why:      "A security guard naming a Camera widget 'Lobby Cam – East' adds meaningful context for their workflow. But renamed widgets diverge from the canonical widget names, making dashboard templates unreliable when shared across teams — the template shows 'Camera' but the user's widget says something else. We shipped renaming because the single-user value is immediate; template-level naming normalisation is a future problem that requires a design solution at the template layer, not the widget layer.",
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

          {/* ── Reflection ────────────────────────── */}
          <section id="reflection" className="scroll-mt-[72px] pt-16 mt-16" style={{ borderTop: `1px solid ${BORDER}` }}>
            <FadeUp>
              <SectionLabel>Reflection</SectionLabel>
              <H2>What I learned.</H2>
            </FadeUp>

            <div className="space-y-0 mb-14">
              {[
                { n:"01", t:"'Customizable' means right defaults, not infinite flexibility",
                  b:"Users overwhelmingly started with templates and only adjusted 2–3 widgets. The hardest design work wasn't the drag-and-drop grid — it was the empty state and the first 30 seconds of the experience. The template library delivered more value than the custom builder." },
                { n:"02", t:"Live data changes the visual priority order of everything around it",
                  b:"Adding the Access Logs Live Feed to a static layout created a hierarchy problem: the live widget always drew the eye, making Occupancy Analytics and Device Health widgets feel broken by comparison. Every widget needed a visual language for live vs. static vs. stale — a design system concern we hadn't anticipated before the first prototype." },
                { n:"03", t:"Drag-and-drop is intuitive in consumer tools but foreign in enterprise security",
                  b:"34% of test users accidentally moved a widget in v2 when they didn't intend to. Gating drag behind an 'Edit Layout' mode felt like friction in consumer testing but was exactly right for enterprise — it created an explicit mode that matched the mental model of 'I am now configuring, not operating.' Accidental moves dropped to 3%." },
                { n:"04", t:"Speed of access is the single biggest trust signal",
                  b:"The most important metric was how quickly a user saw live data after opening the dashboard. Users who saw a live access log update within 5 seconds had 4× higher 30-day retention. Performance wasn't a nice-to-have — it was the feature that made everything else believable." },
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
