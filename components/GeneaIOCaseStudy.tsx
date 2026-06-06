"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import CaseStudyBreadcrumb from "@/components/CaseStudyBreadcrumb";

/* ─── Constants ────────────────────────────────────── */
const NAV_SECTIONS = [
  { id: "overview",   label: "Overview"        },
  { id: "problem",    label: "Problem"          },
  { id: "process",    label: "Process"          },
  { id: "research",   label: "Research"         },
  { id: "iterations", label: "Iterations"       },
  { id: "solutions",  label: "Solution Screens" },
  { id: "beforeafter",label: "Before & After"   },
  { id: "future",     label: "Future Scope"     },
  { id: "reflection", label: "Reflection"       },
];

const BODY_COLOR  = "#32404f";
const FADED       = "rgba(50,64,79,0.55)";
const BORDER      = "rgba(50,64,79,0.1)";
const SERIF       = "Georgia,'Times New Roman',serif";
const MONO        = "var(--font-geist-mono),monospace";

/* ─── Sidebar ──────────────────────────────────────── */
function Sidebar({ active }: { active: string }) {
  return (
    <aside className="hidden lg:block w-[188px] shrink-0">
      <div className="sticky top-[72px]">
        {/* "Contents" label */}
        <p style={{
          fontFamily: MONO, fontSize: 12, textTransform: "uppercase",
          letterSpacing: "0.12em", color: "rgba(50,64,79,0.35)",
          marginBottom: 10, paddingLeft: 14,
        }}>
          Contents
        </p>
        {/* Nav track */}
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
function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
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
  const ref  = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const numeric = parseFloat(value.replace(/[^0-9.]/g, ""));
    if (isNaN(numeric)) { setDisplay(value); return; }
    const start = Date.now();
    const dur   = 1400;
    const prefix = value.match(/^[^0-9]*/)?.[0] ?? "";
    const suf    = value.match(/[^0-9.]+$/)?.[0] ?? suffix;
    const isInt  = !value.includes(".");
    const raf = () => {
      const p = Math.min((Date.now() - start) / dur, 1);
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

/* browser chrome wrapper */
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

/* Genea full sidebar for app mockups */
function GeneaSidebar() {
  const nav = [
    "Dashboard","Users Management","Keys","Alarms Management",
    "Control Center","Emergency Plans","Floor Plan","Hardware",
    "Automations","Reports","Badges","Email Templates",
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
              background: item === "Automations" ? "#eff6ff" : "transparent",
              borderLeft: item === "Automations" ? "2px solid #1677ff" : "2px solid transparent",
            }}
          >
            <span style={{
              fontSize: 9,
              color: item === "Automations" ? "#1677ff" : "#4b5563",
              fontWeight: item === "Automations" ? 500 : 400,
            }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* mini sidebar for app mockups */
function AppSidebar({ active = 2 }: { active?: number }) {
  return (
    <div className="w-11 shrink-0 flex flex-col items-center pt-4 gap-3" style={{ background: "#020b17" }}>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="w-7 h-7 rounded-lg" style={{ background: i === active ? "rgba(255,255,255,0.08)" : "transparent" }} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                     */
/* ═══════════════════════════════════════════════════ */
export default function GeneaIOCaseStudy() {
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
      label: "Automations",
      num: "01",
      subtitle: "Multi-State Table",
      before:   "No status chips on rule names. No Execution Status column. Delete and Edit as adjacent red/blue text links with no confirmation.",
      after:    "Status chips on rule names (Active, Configuring, Configuration Error, Deleting). Execution Status column added. 7 interaction states designed.",
      decision: "AntD Table size='middle'. Status as Tag on Automation Name. Execution Status as separate column. Enable/Disable as AntD Switch. Actions: Edit link + Delete link (gated by Popconfirm).",
      screen: (
        <div
          className="w-full overflow-hidden rounded-xl"
          style={{
            boxShadow: "0 8px 40px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.06)",
            lineHeight: 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/case-studies/genea-io/screen-01-automations-list.png"
            alt="Automations List — Multi-State Table"
            style={{ width: "100%", display: "block" }}
          />
        </div>
      ),
    },
    {
      label: "Add Automation",
      num: "02",
      subtitle: "Two-Column Drawer · 3 Steps",
      before:   "Single-column layout. All 15+ fields exposed at once. No step grouping. Revert as checkbox side-effect with only 2 of 5 required fields visible.",
      after:    "Two-column drawer. Left: Automation Details. Right: 3 progressive steps — Where It Applies, When It Happens, Then Do This. Save disabled until form is valid.",
      decision: "Left 280px: colorBgLayout (Name, Description, Enable Automation, Use Variable). Right: step-based AntD Form with validateTrigger='onBlur'. Summary bar at bottom.",
      screen: (
        <div
          className="w-full overflow-hidden rounded-xl"
          style={{
            boxShadow: "0 8px 40px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.06)",
            lineHeight: 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/case-studies/genea-io/screen-02-add-automation.png"
            alt="Add Automation — Two-Column Drawer"
            style={{ width: "100%", display: "block" }}
          />
        </div>
      ),
    },
    {
      label: "View Automation",
      num: "03",
      subtitle: "Read-only + Revert Automation",
      before:   "No read-only view existed. Users had to open the Edit form to see a rule's configuration, risking accidental changes.",
      after:    "Dedicated View Automation drawer shows full config read-only — Name, Description, Execution Status, Last Execution Time, and Automation Preferences including Revert Automation state.",
      decision: "AntD Drawer in view mode. Automation Preferences (Enable Automation, Use Variable, Revert Automation) shown as status tags. Edit button in header opens the Add Automation drawer pre-filled.",
      screen: (
        <div
          className="w-full overflow-hidden rounded-xl"
          style={{
            boxShadow: "0 8px 40px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.06)",
            lineHeight: 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/case-studies/genea-io/screen-03-view-automation.png"
            alt="View Automation — Read-only"
            style={{ width: "100%", display: "block" }}
          />
        </div>
      ),
    },
    {
      label: "Variables",
      num: "04",
      subtitle: "Variables Tab",
      before:   "No Variables tab existed. Variable state was invisible — users had no way to see which rules shared a variable or what its current status was.",
      after:    "Dedicated Variables tab with Variable Name, Status (Set/Reset), Location, Controller, and Automation Linked To columns. Add Variable centre modal.",
      decision: "AntD Tabs component. Variables as a sibling tab to Automations. Status as AntD Tag (Set=blue, Reset=default). Automation Linked To as clickable links.",
      screen: (
        <div
          className="w-full overflow-hidden rounded-xl"
          style={{
            boxShadow: "0 8px 40px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.06)",
            lineHeight: 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/case-studies/genea-io/screen-04-variables.png"
            alt="Variables Tab"
            style={{ width: "100%", display: "block" }}
          />
        </div>
      ),
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
              <CaseStudyBreadcrumb title="Automations" minRead={12} />
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              style={{ fontFamily: SERIF, fontSize: "clamp(2rem,4.5vw,3.25rem)", fontWeight: 400, color: BODY_COLOR, lineHeight: 1.1, marginBottom: "1.5rem" }}
            >
              Preventing Silent Misconfiguration<br />in Physical Access Control
            </motion.h1>

            {/* Hero cover */}
            <motion.div
              initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="w-full rounded-xl overflow-hidden mb-8"
              style={{ background: "#020b17", aspectRatio: "16/7", minHeight: 260, position: "relative" }}
            >
              {/* subtle grid */}
              <div className="absolute inset-0 opacity-[0.035]" style={{
                backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
                backgroundSize: "48px 48px",
              }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center gap-5">
                <p style={{ fontFamily: MONO, fontSize: 12, color: "rgba(255,255,255,0.25)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                  Genea Security × AntD 5.10
                </p>
                <p style={{ fontFamily: SERIF, fontSize: "clamp(1.4rem,2.5vw,2rem)", color: "rgba(255,255,255,0.88)", fontWeight: 400 }}>
                  Automations Module Redesign
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    { v: "+18pp", l: "Task Completion" },
                    { v: "-62%",  l: "Error Rate" },
                    { v: "+12pts",l: "SUS Score" },
                    { v: "-34%",  l: "Support Tickets" },
                    { v: "-90%",  l: "Delete Misclicks" },
                    { v: "+492%", l: "Revert Awareness" },
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
                { label: "Role",     value: "Senior Product Designer"               },
                { label: "Tools",    value: "Figma · Claude Code · AntD 5.10"      },
                { label: "Timeline", value: "6 Weeks · March – April 2026"          },
                { label: "Output",   value: "7 interaction states · 47 audit items" },
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
              <H2>What happens when a form looks complete — but isn&apos;t?</H2>
              <Body className="mb-4">
                Security Administrators managing physical access control need to configure
                event-driven automation rules. Genea&apos;s Automations module exposed Mercury hardware
                API vocabulary directly to non-technical users, accepted silently misconfigured
                forms without any error feedback, and provided zero operational visibility into
                whether rules ran correctly.
              </Body>
              <Body className="mb-10">
                The cost wasn&apos;t a bad user experience. It was a server room that stayed unlocked when it shouldn&apos;t.
              </Body>
            </FadeUp>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { title: "Product Strategy",        body: "Understand the real user — Security Admins with no hardware API literacy — and reframe the brief away from a visual redesign." },
                { title: "Structural Correctness",  body: "Make the form's architecture match the system's logic. Structural parity over cosmetic polish." },
                { title: "Iterating with Evidence", body: "Three design versions, twelve user sessions, forty-seven support tickets analysed. Each round grounded in data." },
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
              <H2>The form accepted a broken rule — and said nothing.</H2>
              <Body className="mb-4">
                Priya is a Senior Security Administrator for a fintech firm in Toronto, managing
                access for 340 employees across three floors. She needs to configure a rule: arm
                the intrusion system when the last employee badges out at night.
              </Body>
              <Body className="mb-4">
                She opens Automations. She fills in the form. She notices a section at the bottom
                called &ldquo;Revert Automation.&rdquo; It looks like what she just filled in — she assumes it&apos;s a
                summary. She clicks Save. The form accepts everything without complaint.
              </Body>
              <Body className="mb-10">
                Six weeks later, a confused employee triggers a false alarm at 7&nbsp;AM because the
                system never disarmed. The Revert Automation section needed its own trigger — but only
                showed two of the five required fields.
              </Body>
            </FadeUp>

            {/* failure chain */}
            <FadeUp delay={0.1}>
              <div className="rounded-xl p-8" style={{ background: "rgba(50,64,79,0.03)", border: `1px solid ${BORDER}` }}>
                <p className="uppercase mb-6" style={{ fontFamily: MONO, fontSize: 12, color: FADED, letterSpacing: "0.08em" }}>The Failure Chain</p>
                <div className="flex flex-col gap-0">
                  {[
                    { step: "Opens Automations form",         note: "" },
                    { step: "Fills Trigger fields",         note: "" },
                    { step: "Sees Revert Automation section",     note: "assumed summary" },
                    { step: "Clicks Save",                  note: "zero error feedback" },
                    { step: "Six weeks later — false alarm",note: "root cause: 2 of 5 fields" },
                  ].map((s, i, arr) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center shrink-0">
                        <motion.div
                          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[9px] mt-0.5"
                          style={{
                            background: i === arr.length - 1 ? BODY_COLOR : "rgba(50,64,79,0.12)",
                            color: i === arr.length - 1 ? "#fff" : FADED,
                          }}
                          whileHover={{ scale: 1.15 }}
                        >
                          {i + 1}
                        </motion.div>
                        {i < arr.length - 1 && <div className="w-px my-1" style={{ flex: 1, background: BORDER, minHeight: 20 }} />}
                      </div>
                      <div className="pb-4 flex items-start justify-between flex-1">
                        <span style={{ fontSize: 14, color: BODY_COLOR, lineHeight: 1.5 }}>{s.step}</span>
                        {s.note && (
                          <span className="shrink-0 ml-3 px-2 py-0.5 rounded" style={{ fontSize: 10, background: "rgba(50,64,79,0.07)", color: FADED }}>
                            {s.note}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.15} className="mt-6">
              <Body>
                This wasn&apos;t Priya&apos;s mistake. The form was structurally broken — it accepted a
                misconfigured rule silently and provided no mechanism for detecting the failure
                until an incident occurred.
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
                { n:"01", t:"PRD Intelligence",   d:"Extract actual brief from stated brief"    },
                { n:"02", t:"UX Audit",           d:"47 violations across Figma Iter 5"         },
                { n:"03", t:"Competitor Analysis", d:"7 platforms benchmarked"                  },
                { n:"04", t:"Research Synthesis",  d:"8 affinity clusters built"                },
                { n:"05", t:"User Flow Mapping",   d:"Happy paths + 23 missing states"          },
                { n:"06", t:"Visual Direction",    d:"3 directions evaluated"                   },
                { n:"07", t:"Low-Fi Wireframes",   d:"6 screens × 4 states each"               },
                { n:"08", t:"High-Fi Production",  d:"7 interaction states per screen"          },
                { n:"09", t:"Design Review",       d:"Feedback capture + conflict flags"        },
                { n:"10", t:"Iteration",           d:"3 rounds of form structure revision"      },
                { n:"11", t:"Handoff Spec",        d:"API + a11y + responsive + interactions"  },
                { n:"12", t:"Design Audit",        d:"Pre-handoff compliance check"             },
                { n:"13", t:"Impact Dashboard",    d:"12-user test + 30-day ticket analysis"    },
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
              <H2>Understanding the real user — and where the form fails them.</H2>
              <Body className="mb-10">
                Map where users fail and what they believe happened when they do. Discover what
                feedback is needed to trust the outcome of a configured rule.
              </Body>
            </FadeUp>

            {/* Animated stats */}
            <FadeUp delay={0.08}>
              <div className="rounded-xl p-10 mb-10" style={{ background: "rgba(50,64,79,0.03)", border: `1px solid ${BORDER}` }}>
                <p className="uppercase mb-8" style={{ fontFamily: MONO, fontSize: 12, color: FADED, letterSpacing: "0.08em" }}>Research at a glance</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  {[
                    { raw: "12",   label: "Moderated user\ninterviews" },
                    { raw: "60m",  label: "Think-aloud\nprotocol" },
                    { raw: "47",   label: "Support tickets\n30-day pre-launch" },
                    { raw: "7/12", label: "Users reaching\nStep 3 baseline" },
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

            {/* HMW */}
            <FadeUp delay={0.1}>
              <Body className="mb-6">Three research questions drove the work:</Body>
            </FadeUp>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {[
                "Who is the real user persona behind the Security Administrator title?",
                "Where does the form fail silently — and what does the user believe happened?",
                "What structural feedback is needed to trust that a rule is correctly configured?",
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

            {/* Competitor table */}
            <FadeUp delay={0.1}>
              <SectionLabel>Competitor Analysis — 7 Platforms</SectionLabel>
              <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
                <div className="hidden md:grid grid-cols-[180px_1fr_110px] px-5 py-3" style={{ background: "rgba(50,64,79,0.03)", borderBottom: `1px solid ${BORDER}` }}>
                  {["Platform","Key Pattern","Verdict"].map(h => (
                    <p key={h} style={{ fontFamily: MONO, fontSize: 12, color: FADED, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</p>
                  ))}
                </div>
                {[
                  { name:"Genetec Security Center", pattern:"Mercury vocabulary throughout. Expert-only, powerful, opaque for non-technical admins.", verdict:"Adopt: structure", adopt:true },
                  { name:"Openpath",                pattern:'Scenario-based entry. Hides API layer. "When someone badges in after hours…"',           verdict:"Adopt: language", adopt:true },
                  { name:"Brivo",                   pattern:"Card-based display. Good at-a-glance for small sets. Breaks down at enterprise volume.",   verdict:"Avoid: scale",   adopt:false },
                  { name:"Honeywell Winpak",         pattern:"Dense form builder. All required fields shown but minimal visual hierarchy.",              verdict:"Adopt: parity",  adopt:true },
                  { name:"Avigilon ACM",             pattern:"Full field parity for trigger/action pairs. No revert concept — one-directional.",         verdict:"Adopt: fields",  adopt:true },
                  { name:"Zapier",                   pattern:"Best non-security analogy: Trigger → Action. Intent-first. Hides API complexity.",         verdict:"Adopt: model",   adopt:true },
                  { name:"Kantech EntraPass",         pattern:"Raw hardware exposure, steep learning curve. Serves integrators not end-users.",           verdict:"Avoid: vocab",   adopt:false },
                ].map((c, i, arr) => (
                  <motion.div
                    key={c.name}
                    className="grid grid-cols-1 md:grid-cols-[180px_1fr_110px] gap-2 items-start px-5 py-4 cursor-default"
                    style={{ borderBottom: i < arr.length-1 ? `1px solid rgba(50,64,79,0.05)` : "none" }}
                    whileHover={{ background: "rgba(50,64,79,0.02)" }}
                    transition={{ duration: 0.15 }}
                  >
                    <p style={{ fontSize: 13, fontWeight: 500, color: BODY_COLOR }}>{c.name}</p>
                    <p style={{ fontSize: 12, color: FADED, lineHeight: 1.5 }}>{c.pattern}</p>
                    <span className="self-start inline-block text-[10px] px-2 py-0.5 rounded" style={{
                      background: c.adopt ? "rgba(22,163,74,0.08)" : "rgba(220,38,38,0.07)",
                      color: c.adopt ? "#16a34a" : "#dc2626",
                      fontFamily: MONO,
                    }}>
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
                  v:"v1", title:"Full-Width Screen + Centre Modal", status:"Failed",
                  why:"A single-column screen exposed all 15+ fields at once with no step separation. No way to tell which fields belonged to which logical step. Revert appeared indistinguishable from a summary. A Browse Templates centre modal was designed in parallel — users couldn't distinguish step ownership in the rule builder but the modal structure was well-validated.",
                  what:"Moved Add Automation into a two-column drawer: left 280px for metadata; right 480px for rule logic. Spatial separation reduced cross-panel confusion. Metadata-first completion emerged in 10/12 sessions. The Browse Templates centre modal was preserved intact into v3 — its WHEN/Source/Schedule/Action card structure was already correct.",
                },
                {
                  v:"v2", title:"Two-Column Drawer + Step-Based Flow (Slide-Over)", status:"Partial",
                  why:"The right panel still presented all trigger and action fields as a flat, undifferentiated list — Trigger Type, Device Type, Devices, Event Type, Action Type — with no step grouping. Users understood left/right but couldn't distinguish where the trigger ended and the action began. Revert used identical visual treatment to forward trigger fields and showed only 2 of 5 required fields.",
                  what:"Step-based progressive disclosure via a slide-over drawer (side sheet): Step 1 Where It Applies, Step 2 When It Happens, Step 3 Then Do This. Each step reveals its fields only after preceding required inputs are valid — reducing visible fields from 15+ to 3–5. The slide-over kept the rules list visible in the background. Amber Revert zone with full 5-field parity drove 492% awareness improvement. Task completion +18pp.",
                },
              ].map((v, i) => (
                <FadeUp key={v.v} delay={i * 0.08}>
                  <HoverCard>
                    <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
                      <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: `1px solid rgba(50,64,79,0.05)`, background: "rgba(50,64,79,0.02)" }}>
                        <p style={{ fontSize: 13, fontWeight: 500, color: BODY_COLOR }}>{v.v} · {v.title}</p>
                        <span style={{
                          fontFamily: MONO, fontSize: 10, padding: "2px 8px", borderRadius: 4,
                          background: v.status==="Failed" ? "rgba(220,38,38,0.08)" : "rgba(217,119,6,0.08)",
                          color: v.status==="Failed" ? "#dc2626" : "#d97706",
                        }}>
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
              <H2>Three screens that show the thinking.</H2>
              <Body className="mb-10">
                Each screen solves a specific failure mode. Annotated with before, after, and the design decision that drove the change.
              </Body>
            </FadeUp>

            {/* Tab bar */}
            <FadeUp delay={0.08}>
              <div className="flex gap-0 mb-6 rounded-lg overflow-hidden" style={{ border: `1px solid ${BORDER}`, width: "fit-content" }}>
                {SCREENS.map((s, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setActiveScreen(i)}
                    className="px-5 py-2.5 text-sm transition-all cursor-pointer relative"
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

            {/* Active screen */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeScreen}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Screen number + label */}
                <p style={{ fontSize: 12, color: FADED, marginBottom: 12, fontFamily: MONO }}>
                  {SCREENS[activeScreen].num} — {SCREENS[activeScreen].label} · {SCREENS[activeScreen].subtitle}
                </p>

                {/* Mockup */}
                <BrowserFrame url={["app.genea.com / io-rules","app.genea.com / io-rules / new","app.genea.com / io-rules / view","app.genea.com / io-rules / variables","app.genea.com / io-rules"][activeScreen] ?? "app.genea.com / io-rules"}>
                  {SCREENS[activeScreen].screen}
                </BrowserFrame>

                {/* Annotations */}
                <div className="grid md:grid-cols-3 gap-5 mt-6">
                  {[
                    { l: "Before",   t: SCREENS[activeScreen].before },
                    { l: "After",    t: SCREENS[activeScreen].after },
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
              <H2>Two screens. Eleven audit violations resolved.</H2>
              <Body className="mb-10">
                Side-by-side comparison of the highest-impact changes — the Automation Listing and the Add Automation Drawer — with the specific audit violations each solution addressed.
              </Body>
            </FadeUp>

            {/* ── Automations ── */}
            <FadeUp delay={0.05}>
              <div className="rounded-xl overflow-hidden mb-8" style={{ border: `1px solid ${BORDER}` }}>
                <div className="px-6 py-4" style={{ borderBottom: `1px solid rgba(50,64,79,0.06)`, background: "rgba(50,64,79,0.02)" }}>
                  <p style={{ fontFamily: MONO, fontSize: 12, color: FADED, textTransform: "uppercase", marginBottom: 3 }}>Screen 01</p>
                  <p style={{ fontSize: 15, fontWeight: 500, color: BODY_COLOR }}>Automation Listing</p>
                  <p style={{ fontSize: 13, color: FADED, marginTop: 2 }}>The rules table — from a flat list with dangerous inline actions to a structured, safe, multi-state table.</p>
                </div>
                <div className="grid md:grid-cols-2">
                  <div className="p-6" style={{ borderRight: `1px solid rgba(50,64,79,0.06)` }}>
                    <div className="flex items-center gap-2 mb-5">
                      <span className="w-2 h-2 rounded-full" style={{ background: "#dc2626" }} />
                      <p style={{ fontFamily: MONO, fontSize: 12, color: FADED, textTransform: "uppercase", letterSpacing: "0.06em" }}>Before</p>
                    </div>
                    {[
                      { code: "V01 · V03", title: "Delete safety", body: "Delete and Edit rendered as adjacent red/blue text links. One misclick permanently destroys a live access rule with no confirmation, no undo." },
                      { code: "V09 · V14", title: "State coverage", body: "No loading state, no error state, no empty state. Disabled rules had no visual treatment. Filter button had no active indicator." },
                      { code: "V13",       title: "Colour-only distinction", body: "Delete vs Edit distinguished only by red colour — fails WCAG 1.4.1 for users with protanopia / deuteranopia (8% of male users)." },
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
                      { title: "Delete gated + confirmed", body: "Delete moved to \u22EE overflow Dropdown (danger item). Popconfirm shows the rule name before destructive action. 30s undo toast." },
                      { title: "7 interaction states", body: "DEFAULT \xb7 HOVER \xb7 SELECTED \xb7 DISABLED \xb7 ERROR \xb7 LOADING \xb7 EMPTY — all designed and token-bound. Filter badge shows active count." },
                      { title: "Icon + colour redundant coding", body: "Trash icon on Delete, pencil on Edit. WCAG 1.4.1 compliant. Actions moved to overflow for visual cleanliness and safety." },
                    ].map((s) => (
                      <div key={s.title} className="mb-5">
                        <p style={{ fontSize: 13, fontWeight: 500, color: BODY_COLOR, marginBottom: 4 }}>{s.title}</p>
                        <p style={{ fontSize: 13, color: FADED, lineHeight: 1.65 }}>{s.body}</p>
                      </div>
                    ))}
                    <p style={{ fontSize: 11, color: FADED, fontFamily: MONO, marginTop: 8 }}>Violations resolved: V01 \xb7 V03 \xb7 V05 \xb7 V09 \xb7 V13 \xb7 V14 \xb7 V17</p>
                  </div>
                </div>
              </div>
            </FadeUp>

            {/* ── Add Automation Drawer ── */}
            <FadeUp delay={0.1}>
              <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
                <div className="px-6 py-4" style={{ borderBottom: `1px solid rgba(50,64,79,0.06)`, background: "rgba(50,64,79,0.02)" }}>
                  <p style={{ fontFamily: MONO, fontSize: 12, color: FADED, textTransform: "uppercase", marginBottom: 3 }}>Screen 02</p>
                  <p style={{ fontSize: 15, fontWeight: 500, color: BODY_COLOR }}>Add Automation Drawer</p>
                  <p style={{ fontSize: 13, color: FADED, marginTop: 2 }}>From a flat, unconstrained form to a structured two-column progressive-disclosure drawer.</p>
                </div>
                <div className="grid md:grid-cols-2">
                  <div className="p-6" style={{ borderRight: `1px solid rgba(50,64,79,0.06)` }}>
                    <div className="flex items-center gap-2 mb-5">
                      <span className="w-2 h-2 rounded-full" style={{ background: "#dc2626" }} />
                      <p style={{ fontFamily: MONO, fontSize: 12, color: FADED, textTransform: "uppercase", letterSpacing: "0.06em" }}>Before</p>
                    </div>
                    {[
                      { code: "V02",       title: "Flat form, wrong order", body: "Controller field appeared before Name. All 15+ fields exposed simultaneously. 4 of 6 users filled fields out of sequence in testing." },
                      { code: "V09",       title: "No field validation", body: "Save button appeared enabled regardless of required field state. No inline validation on blur. Error only surfaced after submit attempt." },
                      { code: "V05 · V06", title: "Variable logic invisible", body: "4 dimmed variable rows visible even when Use Variable was off. AND/OR boolean logic shown as plain text with no visual grouping." },
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
                      { title: "Two-column step-based drawer", body: "Left panel: Automation Details (Name \u2192 Description \u2192 Preferences). Right panel: 3 steps — Where It Applies \xb7 When It Happens \xb7 Then Do This." },
                      { title: "Form validation + correct field order", body: "Name field first. Save disabled until Name + Controller are valid. AntD Form validateTrigger='onBlur'. Inline error on each field." },
                      { title: "Progressive variable disclosure", body: "Variable section collapses when Use Variable is off. AND/OR shown as visual group containers with divider pill. Revert Automation activates mirror step pairs when toggled." },
                    ].map((s) => (
                      <div key={s.title} className="mb-5">
                        <p style={{ fontSize: 13, fontWeight: 500, color: BODY_COLOR, marginBottom: 4 }}>{s.title}</p>
                        <p style={{ fontSize: 13, color: FADED, lineHeight: 1.65 }}>{s.body}</p>
                      </div>
                    ))}
                    <p style={{ fontSize: 11, color: FADED, fontFamily: MONO, marginTop: 8 }}>Violations resolved: V02 \xb7 V05 \xb7 V06 \xb7 V07 \xb7 V09 \xb7 V10</p>
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
                Sequenced as a product backlog. Browse Templates (Automation Templates Library) and Revert Automation Engine are the two highest-priority items — template usage was 41% of post-launch sessions; Revert Automation is the 2nd most-requested Canny feature.
              </Body>
            </FadeUp>

            <div className="space-y-0">
              {[
                { m:"Milestone 1 · Immediate", t:"Browse Templates — Automation Templates Library",  b:"The centre modal first designed in v1 becomes a full Automation Template Library: expanded scenario categories, template preview with full configuration visible before applying, and one-click apply that pre-fills the drawer at Step 1. 41% of post-launch sessions used templates as the primary entry point even with an incomplete catalogue." },
                { m:"Milestone 2",             t:"Revert Automation Engine",                         b:"Exposes Revert — When + Revert — Then step pairs in the Add Automation drawer. A counter-event triggers the inverse action automatically. Amber accent strip + Revert chip separate it from primary logic. 2nd most-requested post-launch (18 Canny upvotes). Currently requires two linked automations — the top config error." },
                { m:"Milestone 2",             t:"Automation Execution Status Layer",                b:"Add a Last Run status chip on every rule row — Success, Failed, Never, Queued. Click opens Audit Log filtered to that rule. Zero operational visibility post-configuration is the root cause of the largest remaining support ticket category." },
                { m:"Milestone 2",             t:"Faceted Filter & Search",                    b:"Replace single search box with faceted filters: Location (multiselect), Automation Type, Status, Last Updated (date range). Enterprise accounts manage 200+ rules across 50+ locations. Flat search becomes unusable at scale." },
                { m:"Milestone 3",             t:"Scenario-First Automation Creation",               b:'A \u201cWhat do you want to happen when\u2026?\u201d intent-matching flow that pattern-matches to a template before the form opens. Could close the remaining task-completion gap and eliminate Mercury vocabulary barriers without requiring API literacy.' },
                { m:"Milestone 3",             t:"User-Level Access Logic",                    b:"Allow rules to trigger based on specific users, user groups, or access levels \u2014 not only device events. Aurora Arm/Disarm and First-Person-In enterprise configurations are currently impossible without this. The largest enterprise feature gap in the module." },
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

          {/* ── Reflection ────────────────────────── */}
          <section id="reflection" className="scroll-mt-[72px] pt-16 mt-16" style={{ borderTop: `1px solid ${BORDER}` }}>
            <FadeUp>
              <SectionLabel>Reflection</SectionLabel>
              <H2>What I learned.</H2>
            </FadeUp>

            <div className="space-y-0 mb-14">
              {[
                { n:"01", t:"Structural parity eliminates misconfiguration more reliably than copy",
                  b:"When a form's architecture matches the user's mental model, they complete it correctly without instructions. Five-field Revert parity drove 71% awareness where two-field drove 9%." },
                { n:"02", t:"Empty states are onboarding moments, not failure states",
                  b:"Treating the zero-state as an active entry point turned the module's dead end into its most-used first path for new users, over-delivering click-through by 16 percentage points." },
                { n:"03", t:"Colour zones communicate structural differences more effectively than labels alone",
                  b:"The amber Revert zone drove a 492% awareness improvement because users associated the colour with 'something different is happening here' before reading a word." },
                { n:"04", t:"Vocabulary barriers cannot be solved by structural redesign alone",
                  b:"Time-on-task missed its target because users spent 82 seconds on the Trigger Type field reading Mercury API terminology. Structural correctness is a prerequisite; vocabulary translation is the next layer." },
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
