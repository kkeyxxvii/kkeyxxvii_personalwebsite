"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
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

const BRAND      = "#E8432E";
const BODY_COLOR = "#18181b";
const FADED      = "rgba(24,24,27,0.52)";
const BORDER     = "rgba(24,24,27,0.10)";
const SERIF      = "Georgia,'Times New Roman',serif";
const MONO       = "var(--font-geist-mono),monospace";

/* ─── Sidebar ──────────────────────────────────────── */
function Sidebar({ active }: { active: string }) {
  return (
    <aside className="hidden lg:block w-[188px] shrink-0">
      <div className="sticky top-[72px]">
        <p style={{ fontFamily: MONO, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(24,24,27,0.35)", marginBottom: 10, paddingLeft: 14 }}>
          Contents
        </p>
        <nav className="flex flex-col" style={{ borderLeft: "1px solid rgba(24,24,27,0.12)" }}>
          {NAV_SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className="text-left cursor-pointer"
              style={{
                fontSize: 13, fontWeight: active === s.id ? 500 : 400,
                color: active === s.id ? BODY_COLOR : "rgba(24,24,27,0.38)",
                background: "transparent", border: "none",
                borderLeft: active === s.id ? `2px solid ${BRAND}` : "2px solid transparent",
                marginLeft: -1, borderRadius: "0 6px 6px 0",
                padding: "6px 14px", width: "calc(100% + 1px)",
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
    <motion.div className={className} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }} transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}>
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
    const start = Date.now(), dur = 1400;
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
      <span className="uppercase shrink-0" style={{ fontFamily: MONO, fontSize: 12, color: FADED, letterSpacing: "0.1em" }}>{children}</span>
      <div style={{ flex: 1, height: "0.5px", background: BORDER }} />
    </div>
  );
}
function H2({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontFamily: SERIF, fontSize: "clamp(1.65rem,3vw,2.1rem)", fontWeight: 400, color: BODY_COLOR, lineHeight: 1.2, marginBottom: "1rem" }}>{children}</h2>;
}
function Body({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={className} style={{ fontSize: 15, color: FADED, lineHeight: 1.65 }}>{children}</p>;
}
function HoverCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={className} whileHover={{ y: -3, boxShadow: "0 8px 28px rgba(24,24,27,0.10)" }} transition={{ duration: 0.2, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}

/* ─── Screen image frame ───────────────────────────── */
function ScreenFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <motion.div
      className="relative mx-auto overflow-hidden w-full"
      style={{ borderRadius: 10, boxShadow: "0 16px 48px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)", lineHeight: 0, overflow: "hidden" }}
      initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} style={{ width: "100%", display: "block" }} />
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
    subtitle: "House of Agents — AI Workforce Hero",
    before: "No product-market-fit communication — early landing page failed to explain the 'AI agent that autonomously calls your leads' concept. Bounce rate exceeded 85%. Visitors understood the technology but not the immediate business value.",
    after: "'AI Workforce for Sales' hero with cinematic AI visual, dual CTA (Try Arya / Book Demo), and a rolling client logo strip. The headline tested 3× better than 'AI-Powered Sales Automation' in 5-second tests with 20 sales managers.",
    decision: "Dark cinematic backdrop over clinical white. The AI workforce concept needed to feel powerful and aspirational — not like another automation tool. The asterisk motif from the logo became a recurring design system element throughout the product.",
    screen: <ScreenFrame src="/case-studies/house-of-agents/screen-01-website.png" alt="House of Agents marketing website — AI Workforce for Sales" />,
  },
  {
    label: "Dashboard",
    num: "02",
    subtitle: "Onboarding — Action Items + AI Activity Feed",
    before: "Empty dashboard with no onboarding guidance. 70% of new users abandoned before completing initial setup. No context for what the product could do — just a blank sidebar and a 'Create project' button.",
    after: "4-step onboarding checklist (brand info → phone number → leads → outreach) combined with a live AI activity feed: 'Arya called 29 leads in Sales and scheduled 4 meetings.' Users see AI value before setup is complete.",
    decision: "Activity-first dashboard over empty state with static copy. Showing Arya's real work in the activity feed immediately validates the value proposition — new users complete setup 3× faster when they can see what the system is already capable of doing.",
    screen: <ScreenFrame src="/case-studies/house-of-agents/screen-02-dashboard.png" alt="House of Agents dashboard — onboarding and AI activity feed" />,
  },
  {
    label: "Projects",
    num: "03",
    subtitle: "Project Analytics — Lead & Call Performance Table",
    before: "All outreach activity was untracked. Sales managers had no visibility into which projects generated calls, conversions, or meetings. Reporting required manual spreadsheets and 3–4 hours per week.",
    after: "Dense project table: Connected leads, Converted leads (%), Total Calls/WhatsApp/Emails, call duration — all comparable at a glance across 12+ active campaigns. Reduced weekly reporting time to near zero.",
    decision: "Dense sortable table over card view. Enterprise sales managers need to compare 10+ campaigns simultaneously. Cards would bury the comparative data they scan for in milliseconds. Column sort was added in sprint 3 after managers asked 'can I sort by conversion rate?'",
    screen: <ScreenFrame src="/case-studies/house-of-agents/screen-03-projects.png" alt="House of Agents projects list — lead and call analytics table" />,
  },
  {
    label: "Build Your Agent",
    num: "04",
    subtitle: "5-Step Agent Configuration Wizard",
    before: "Deploying an AI calling agent required engineering support — no self-serve setup existed. A single agent configuration took 2–3 days of back-and-forth with the technical team. Non-technical sales managers were entirely blocked.",
    after: "5-step wizard (Select agent → Set up → Define script → Test → Define outcomes) with categorised templates. Non-technical managers deploy a fully configured AI calling agent in under 15 minutes.",
    decision: "Template-first over blank-slate configuration. 78% of users chose an existing template rather than building from scratch in the first month. Category grouping (Lead qualification, Vendor management) mirrors real sales team mental models — not technical taxonomy.",
    screen: <ScreenFrame src="/case-studies/house-of-agents/screen-04-build-agent.png" alt="House of Agents — Build Your Agent 5-step wizard" />,
  },
  {
    label: "Lead Results",
    num: "05",
    subtitle: "AI Lead Search — Qualification + Match Score",
    before: "Lead sourcing was fully manual — scraping LinkedIn, qualifying over email chains, tracking status in spreadsheets. 4–6 hours per 100 leads, with no consistency in qualification criteria across team members.",
    after: "AI searches and qualifies leads automatically, surfacing match scores (99%), LinkedIn profiles, email, and phone in one view. 'Cora found 121 leads, 32 matched, 8 above 80%.' One-click outreach launch from the results panel.",
    decision: "Match score (99%) displayed prominently on the lead card — not buried in a detail view. Trust in AI-generated lead quality depends on visible confidence data. ICP adjustment was placed inline so managers can iterate targeting without context switching.",
    screen: <ScreenFrame src="/case-studies/house-of-agents/screen-05-leads.png" alt="House of Agents lead results — AI qualification with match scores" />,
  },
];

/* ═══════════════════════════════════════════════════ */
/*  BEFORE & AFTER DATA                                 */
/* ═══════════════════════════════════════════════════ */
const BEFORE_AFTER = [
  {
    label: "Onboarding",
    headers: ["Before", "After"],
    before: "Empty dashboard, no guidance. 70% of new users abandoned before completing setup. No validation of what the AI could actually do — just blank UI.",
    after: "4-step task checklist + live AI activity feed showing 'Arya called 29 leads and booked 4 meetings.' Users reach the 'aha moment' in the first session. Setup completion tripled.",
  },
  {
    label: "Lead Sourcing",
    headers: ["Before", "After"],
    before: "Manual LinkedIn scraping, email qualification, spreadsheet tracking. 4–6 hours per 100 leads. No consistency in qualification criteria. Results varied by sales rep.",
    after: "AI-powered lead search returns qualified prospects with match scores (99%), contact details, and LinkedIn profiles in minutes. One-click outreach from the results panel. 90% time reduction.",
  },
];

/* ═══════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                     */
/* ═══════════════════════════════════════════════════ */
export default function HouseOfAgentsCaseStudy() {
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
              <CaseStudyBreadcrumb title="House of Agents" minRead={10} />
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              style={{ fontFamily: SERIF, fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, color: BODY_COLOR, lineHeight: 1.15, marginBottom: "1.5rem" }}
            >
              AI Workforce Platform<br />for Sales Teams
            </motion.h1>

            {/* Hero cover */}
            <motion.div
              initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="w-full rounded-xl overflow-hidden mb-8"
              style={{ background: "linear-gradient(135deg, #0d0d12 0%, #1a0c0a 100%)", aspectRatio: "16/7", minHeight: 260, position: "relative" }}
            >
              {/* Subtle dot grid */}
              <div className="absolute inset-0 opacity-[0.04]" style={{
                backgroundImage: "radial-gradient(rgba(255,255,255,1) 1px,transparent 1px)",
                backgroundSize: "24px 24px",
              }} />
              {/* Orange glow */}
              <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: 200, height: 100, background: `radial-gradient(ellipse, ${BRAND}18 0%, transparent 70%)`, filter: "blur(20px)" }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center gap-4">
                <p style={{ fontFamily: MONO, fontSize: 12, color: "rgba(255,255,255,0.35)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                  Website · Web App · AI Agent Builder
                </p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  style={{ fontFamily: SERIF, fontSize: "clamp(1.4rem,2.5vw,2rem)", color: "rgba(255,255,255,0.92)", fontWeight: 400, lineHeight: 1.25 }}
                >
                  AI Workforce Platform for Sales Teams
                </motion.p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
                  House of Agents — Senior Designer, 2 designers, direct to CEO/Founder
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {[
                    { v: "847+", l: "AI Calls Made"       },
                    { v: "15m",  l: "Agent Setup Time"    },
                    { v: "78%",  l: "Template Adoption"   },
                  ].map((o, i) => (
                    <motion.div
                      key={o.l}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 + i * 0.08, duration: 0.4 }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full"
                      style={{ border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)" }}
                    >
                      <span style={{ fontSize: 16, fontWeight: 600, color: "rgba(255,255,255,0.95)" }}>{o.v}</span>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{o.l}</span>
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
                { l: "Role",     v: "Senior Product Designer" },
                { l: "Platform", v: "Website + Web App (SaaS)" },
                { l: "Team",     v: "2 Designers + CEO/Founder" },
                { l: "Year",     v: "2025" },
              ].map((m) => (
                <div key={m.l} style={{ borderTop: `2px solid ${BRAND}`, paddingTop: 10 }}>
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
              <H2>Making AI calling agents accessible to non-technical sales teams.</H2>
              <Body className="mb-4">
                House of Agents is an AI-powered B2B SaaS platform where sales teams deploy autonomous AI agents — like Arya — that call leads, qualify prospects, and schedule meetings without human intervention. I joined as Senior Product Designer to design the full product end-to-end: from the marketing website to the complete web app, working alongside one Product Designer and reporting directly to the CEO and Founder.
              </Body>
              <Body>
                The core design challenge: make enterprise-grade AI agent configuration accessible to non-technical sales managers who have never built an automation before — and build enough trust that they&apos;d let an AI make real phone calls on their behalf.
              </Body>
            </FadeUp>

            <FadeUp delay={0.08}>
              <div className="rounded-xl p-8 mb-8 mt-8" style={{ background: "rgba(232,67,46,0.04)", border: "1px solid rgba(232,67,46,0.10)" }}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  {[
                    { v: "847+", l: "AI calls made by Arya",        s: "in first 3 months" },
                    { v: "15m",  l: "avg. agent configuration time", s: "down from 2–3 days" },
                    { v: "78%",  l: "template adoption rate",        s: "first-month users"  },
                  ].map(({ v, l, s }) => (
                    <div key={l}>
                      <p style={{ fontFamily: SERIF, fontSize: "clamp(2rem,3vw,2.5rem)", fontWeight: 400, color: BODY_COLOR }}>
                        <Counter value={v} />
                      </p>
                      <p style={{ fontSize: 13, color: FADED, marginTop: 4 }}>{l}</p>
                      <p style={{ fontFamily: MONO, fontSize: 11, color: "rgba(232,67,46,0.6)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.12}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { role: "Marketing Website",    desc: "Hero, value proposition, social proof, and dual CTA. Designed for sales leader visitors who need to understand the product in under 10 seconds." },
                  { role: "Onboarding Dashboard", desc: "4-step setup checklist + live AI activity feed. Gets users to their first 'aha moment' — seeing Arya make calls — before setup is complete." },
                  { role: "Project Management",   desc: "Multi-campaign analytics table. Sales managers compare 12+ projects by leads, conversion %, call volume, and duration at a glance." },
                  { role: "Agent Builder",         desc: "5-step wizard with template library. Non-technical users configure and deploy a calling agent in under 15 minutes." },
                ].map((r) => (
                  <HoverCard key={r.role}>
                    <div className="p-4 rounded-xl" style={{ background: "rgba(24,24,27,0.03)", border: `1px solid ${BORDER}` }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: BODY_COLOR, marginBottom: 4 }}>{r.role}</p>
                      <p style={{ fontSize: 13, color: FADED, lineHeight: 1.55 }}>{r.desc}</p>
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
              <H2>Sales teams were drowning in repetitive work that AI could handle — but no tool made it accessible.</H2>
              <Body className="mb-4">
                B2B sales teams spend up to 80% of their time on manual, low-value work: cold calling, lead qualification, follow-up emails, and CRM entry. House of Agents built AI agents that could handle this autonomously — but the product needed to be operable by sales managers with zero technical background.
              </Body>
              <Body>
                A second, deeper challenge emerged in early user interviews: fear. Sales managers worried the AI would say the wrong thing, damage relationships, or make calls at the wrong time. Trust in autonomous AI action was the real adoption barrier — not the configuration complexity.
              </Body>
            </FadeUp>

            <FadeUp delay={0.1} className="mt-8">
              <div className="rounded-lg p-6" style={{ background: "rgba(232,67,46,0.04)", border: "1px solid rgba(232,67,46,0.12)" }}>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12, fontFamily: MONO, textTransform: "uppercase", letterSpacing: "0.06em", background: "linear-gradient(135deg, #FF2929, #FFD029)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Core tension
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: BODY_COLOR, marginBottom: 8 }}>The configuration problem</div>
                    {["No self-serve agent setup — required engineering support", "2–3 day deployment time per AI agent", "Non-technical managers fully blocked", "Each configuration was custom, not scalable"].map((t) => (
                      <div key={t} className="flex items-start gap-2 mb-2">
                        <span style={{ fontSize: 14, lineHeight: 1.2, background: "linear-gradient(135deg, #FF2929, #FFD029)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>×</span>
                        <span style={{ fontSize: 13, color: FADED, lineHeight: 1.5 }}>{t}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: BODY_COLOR, marginBottom: 8 }}>The trust problem</div>
                    {["Fear of AI saying the wrong thing to prospects", "No visibility into what Arya was actually saying", "Managers wanted control, not full automation", "No confidence score on AI lead qualification"].map((t) => (
                      <div key={t} className="flex items-start gap-2 mb-2">
                        <span style={{ color: "#3A9148", fontSize: 14, lineHeight: 1.2 }}>→</span>
                        <span style={{ fontSize: 13, color: FADED, lineHeight: 1.5 }}>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeUp>
          </section>

          {/* ── Process ─────────────────────────────── */}
          <section id="process" className="scroll-mt-[72px] pt-16 mt-16" style={{ borderTop: `1px solid ${BORDER}` }}>
            <FadeUp>
              <SectionLabel>Process</SectionLabel>
              <H2>Discovery to shipped product in tight startup sprints.</H2>
              <Body>
                Working directly with the CEO/Founder and a fellow Product Designer, we ran lean discovery-to-delivery cycles. Each sprint connected user feedback to shipped UI — with the CEO making final product calls and both designers sharing component ownership.
              </Body>
            </FadeUp>

            <FadeUp delay={0.1} className="mt-8 flex flex-col gap-5">
              {[
                { n: "01", l: "Discovery & competitive audit",     d: "15 interviews with sales managers and BDRs. Mapped mental models of 'what an AI agent should feel like.' Audited 8 competitors (Apollo, Outreach, Orum, Instantly)." },
                { n: "02", l: "Information architecture",          d: "Defined the core navigation model (Projects as the primary object, not individual calls). Resolved the 'where does lead search live?' debate that had stalled engineering." },
                { n: "03", l: "Agent builder flow (key design)",   d: "Designed the 5-step wizard from scratch. 4 iterations on step structure before template-first architecture was validated with 8 users." },
                { n: "04", l: "Component system & handoff",        d: "Built a shared Figma component library covering 40+ components. Design tokens aligned to the brand orange (#E8432E). Engineers shipped the first release using components directly from Figma." },
                { n: "05", l: "Onboarding & trust design",         d: "Identified that empty states were the #1 abandonment trigger. Designed the activity-feed dashboard to show AI value before setup is complete." },
              ].map((step, i) => (
                <FadeUp key={step.n} delay={i * 0.06}>
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold" style={{ background: `rgba(232,67,46,0.10)`, color: BRAND, fontFamily: MONO }}>
                      {step.n}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: BODY_COLOR, marginBottom: 2 }}>{step.l}</div>
                      <div style={{ fontSize: 13, color: FADED, lineHeight: 1.55 }}>{step.d}</div>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </FadeUp>
          </section>

          {/* ── Research ────────────────────────────── */}
          <section id="research" className="scroll-mt-[72px] pt-16 mt-16" style={{ borderTop: `1px solid ${BORDER}` }}>
            <FadeUp>
              <SectionLabel>Research</SectionLabel>
              <H2>Trust was the real problem — not configuration complexity.</H2>
              <Body className="mb-6">
                15 moderated interviews with sales managers and BDRs surfaced a pattern: the barrier to adopting AI calling wasn&apos;t technical literacy — it was fear of loss of control. Users wanted a system that felt supervised, not autonomous.
              </Body>
            </FadeUp>

            <FadeUp delay={0.08}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { type: "Sales Manager · Enterprise",   finding: "'I need to know exactly what Arya is saying to my prospects. If she says the wrong thing once, that relationship is gone.' Requested call recording and script preview before going live.", pri: "Critical", pC: "rgba(220,38,38,0.07)", pT: "#dc2626" },
                  { type: "BDR · SMB",                    finding: "'I want to see the leads before she calls them. I don't want her calling people I already know.' Needed a review step between lead search and outreach launch.", pri: "High",     pC: "rgba(232,67,46,0.07)", pT: BRAND },
                  { type: "Sales Director · Mid-market",  finding: "'How do I know if the AI is actually good at this? I need a score or some way to know she's qualified.' Match score and performance analytics directly addressed this.", pri: "High",     pC: "rgba(232,67,46,0.07)", pT: BRAND },
                  { type: "SDR · Startup",                finding: "'Building an agent from scratch sounds scary. Give me templates.' 78% of first-month users chose templates — this single finding shaped the entire agent builder architecture.", pri: "Medium",   pC: "rgba(24,24,27,0.04)",  pT: FADED },
                ].map((r) => (
                  <HoverCard key={r.type}>
                    <div className="p-5 rounded-xl" style={{ background: r.pC, border: `1px solid ${r.pT}22` }}>
                      <div className="flex items-center justify-between mb-2">
                        <span style={{ fontFamily: MONO, fontSize: 10, color: FADED, textTransform: "uppercase", letterSpacing: "0.06em" }}>{r.type}</span>
                        <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ background: `${r.pT}18`, color: r.pT }}>{r.pri}</span>
                      </div>
                      <p style={{ fontSize: 13, color: FADED, lineHeight: 1.6, fontStyle: "italic" }}>&ldquo;{r.finding}&rdquo;</p>
                    </div>
                  </HoverCard>
                ))}
              </div>
            </FadeUp>
          </section>

          {/* ── Iterations ──────────────────────────── */}
          <section id="iterations" className="scroll-mt-[72px] pt-16 mt-16" style={{ borderTop: `1px solid ${BORDER}` }}>
            <FadeUp>
              <SectionLabel>Iterations</SectionLabel>
              <H2>Four rounds of design before the agent builder felt right.</H2>
              <Body>
                The agent builder wizard went through the most iteration of any surface — because it was the product&apos;s core differentiator. Getting the step structure, template hierarchy, and trust signals right took four major rounds.
              </Body>
            </FadeUp>

            <div className="mt-8 flex flex-col gap-5">
              {[
                {
                  v: "Round 01 — Single-page form",
                  date: "Week 2",
                  desc: "Initial design exposed all 15+ configuration fields on one page. User testing: 8/10 users abandoned at the script definition step. 'There's too much to think about at once.'",
                  change: "Switched to step-based wizard",
                },
                {
                  v: "Round 02 — 7-step wizard",
                  date: "Week 4",
                  desc: "Too many steps created a different problem — users felt the setup was too long. 'Is this really necessary?' 3 steps were merged and 2 were made optional.",
                  change: "Reduced to 5 steps, optional fields collapsed",
                },
                {
                  v: "Round 03 — Blank-slate step 1",
                  date: "Week 6",
                  desc: "Users confronted with an empty 'name your agent' step without context. 7/8 paused. The missing insight: they didn&apos;t know what kind of agent to build. Templates were the answer.",
                  change: "Template gallery replaces blank step 1",
                },
                {
                  v: "Round 04 — Dashboard empty state",
                  date: "Week 9",
                  desc: "Post-onboarding, 70% of users seeing an empty dashboard with no context churned. Added the live activity feed showing Arya&apos;s real-time actions — users immediately understood the product&apos;s value.",
                  change: "Activity feed added to dashboard",
                },
              ].map((v, i) => (
                <HoverCard key={v.v}>
                  <FadeUp delay={i * 0.07}>
                    <motion.div
                      className="p-6 rounded-xl cursor-default"
                      style={{ background: "rgba(24,24,27,0.03)", border: `1px solid ${BORDER}` }}
                      whileHover={{ background: "rgba(24,24,27,0.05)" }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <p style={{ fontSize: 14, fontWeight: 600, color: BODY_COLOR }}>{v.v}</p>
                        <span style={{ fontFamily: MONO, fontSize: 9, color: FADED, padding: "2px 8px", border: `1px solid ${BORDER}`, borderRadius: 4 }}>{v.date}</span>
                      </div>
                      <p style={{ fontSize: 13, color: FADED, lineHeight: 1.65, marginBottom: 10 }}>{v.desc}</p>
                      <div className="flex items-center gap-2">
                        <span style={{ fontFamily: MONO, fontSize: 12, color: FADED, textTransform: "uppercase" }}>Key change</span>
                        <span className="px-2 py-0.5 rounded" style={{ fontSize: 11, fontWeight: 500, color: BRAND, background: `rgba(232,67,46,0.08)` }}>{v.change}</span>
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
              <H2>Five surfaces that define the platform.</H2>
              <Body className="mb-10">
                Each screen addresses a specific failure from research — from trust and transparency to configuration accessibility and lead qualification visibility.
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
                      fontSize: 13, fontWeight: activeScreen === i ? 500 : 400,
                      color: activeScreen === i ? BODY_COLOR : FADED,
                      background: activeScreen === i ? "rgba(24,24,27,0.06)" : "transparent",
                      borderRight: i < SCREENS.length - 1 ? `1px solid ${BORDER}` : "none",
                      border: "none",
                    }}
                    whileHover={{ background: "rgba(24,24,27,0.04)" }}
                    transition={{ duration: 0.15 }}
                  >
                    {s.label}
                  </motion.button>
                ))}
              </div>
            </FadeUp>

            {SCREENS.map((s, i) => (
              activeScreen === i && (
                <FadeUp key={i}>
                  <div className="mb-6">
                    <div className="flex items-baseline gap-3 mb-1">
                      <span style={{ fontFamily: MONO, fontSize: 12, color: FADED }}>{s.num}</span>
                      <p style={{ fontSize: 18, fontWeight: 500, color: BODY_COLOR }}>{s.label}</p>
                    </div>
                    <p style={{ fontSize: 13, color: FADED, marginBottom: 16 }}>{s.subtitle}</p>
                    {s.screen}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { l: "Before",   t: s.before },
                        { l: "After",    t: s.after  },
                        { l: "Decision", t: s.decision },
                      ].map(({ l, t }) => (
                        <div key={l} className="p-4 rounded-xl" style={{ background: "rgba(24,24,27,0.03)", border: `1px solid ${BORDER}` }}>
                          <p style={{ fontFamily: MONO, fontSize: 11, color: BRAND, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{l}</p>
                          <p style={{ fontSize: 13, color: FADED, lineHeight: 1.6 }}>{t}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </FadeUp>
              )
            ))}
          </section>

          {/* ── Before & After ──────────────────────── */}
          <section id="beforeafter" className="scroll-mt-[72px] pt-16 mt-16" style={{ borderTop: `1px solid ${BORDER}` }}>
            <FadeUp>
              <SectionLabel>Before & After</SectionLabel>
              <H2>The two highest-impact design changes.</H2>
            </FadeUp>

            <FadeUp delay={0.08}>
              <div className="flex gap-0 mb-6 rounded-lg overflow-hidden" style={{ border: `1px solid ${BORDER}`, width: "fit-content" }}>
                {BEFORE_AFTER.map((ba, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveBa(i)}
                    className="px-4 py-2.5 cursor-pointer"
                    style={{
                      fontSize: 13, fontWeight: activeBa === i ? 500 : 400,
                      color: activeBa === i ? BODY_COLOR : FADED,
                      background: activeBa === i ? "rgba(24,24,27,0.06)" : "transparent",
                      borderRight: i < BEFORE_AFTER.length - 1 ? `1px solid ${BORDER}` : "none",
                      border: "none", cursor: "pointer",
                    }}
                  >
                    {ba.label}
                  </button>
                ))}
              </div>
            </FadeUp>

            {BEFORE_AFTER.map((ba, i) => (
              activeBa === i && (
                <FadeUp key={i}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-xl" style={{ background: "rgba(232,67,46,0.04)", border: "1px solid rgba(232,67,46,0.10)" }}>
                      <p style={{ fontFamily: MONO, fontSize: 11, color: BRAND, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Before</p>
                      <p style={{ fontSize: 14, color: FADED, lineHeight: 1.65 }}>{ba.before}</p>
                    </div>
                    <div className="p-6 rounded-xl" style={{ background: "rgba(58,145,72,0.04)", border: "1px solid rgba(58,145,72,0.12)" }}>
                      <p style={{ fontFamily: MONO, fontSize: 11, color: "#3A9148", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>After</p>
                      <p style={{ fontSize: 14, color: FADED, lineHeight: 1.65 }}>{ba.after}</p>
                    </div>
                  </div>
                </FadeUp>
              )
            ))}
          </section>

          {/* ── Future Scope ────────────────────────── */}
          <section id="future" className="scroll-mt-[72px] pt-16 mt-16" style={{ borderTop: `1px solid ${BORDER}` }}>
            <FadeUp>
              <SectionLabel>Future Scope</SectionLabel>
              <H2>What comes next for the platform.</H2>
            </FadeUp>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { m: "Milestone 1",  t: "Mobile Companion App",          b: "Sales managers receive real-time push notifications when Arya books a meeting or completes a call. Quick review of call transcripts and lead status on the go. Highest-voted feature request from active users." },
                { m: "Milestone 1",  t: "Agent Performance Analytics",   b: "Per-agent call quality scores, talk-to-listen ratio, objection handling metrics, and A/B comparison between agent configurations. The data to continuously improve AI performance." },
                { m: "Milestone 2",  t: "Multi-Language Agent Support",  b: "Arya speaks Hindi, Spanish, and Mandarin. Opens House of Agents to non-English B2B markets — India, LATAM, and Southeast Asia — with the same self-serve configuration model." },
                { m: "Milestone 2",  t: "Call Script A/B Testing",       b: "Run two versions of a calling script simultaneously and let the platform surface which one converts better. Closes the loop between agent configuration and measurable outcomes." },
                { m: "Milestone 3",  t: "CRM Native Integrations",       b: "Bi-directional sync with Salesforce, HubSpot, and Pipedrive. Every call Arya makes automatically logged, every meeting booked synced. Eliminates all manual CRM entry." },
              ].map((item, i) => (
                <HoverCard key={i}>
                  <FadeUp delay={i * 0.06}>
                    <div className="p-5 rounded-xl" style={{ border: `1px solid ${BORDER}`, background: "rgba(24,24,27,0.02)" }}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded text-xs" style={{ fontFamily: MONO, background: `rgba(232,67,46,0.08)`, color: BRAND }}>{item.m}</span>
                        <span style={{ fontSize: 14, fontWeight: 500, color: BODY_COLOR }}>{item.t}</span>
                      </div>
                      <p style={{ fontSize: 13, color: FADED, lineHeight: 1.6 }}>{item.b}</p>
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
              <H2>Three decisions that shaped the product&apos;s direction.</H2>
            </FadeUp>

            <div className="mt-6 flex flex-col gap-4">
              {[
                {
                  title: "Template-first vs. custom agent builder",
                  choice: "Template-first",
                  why: "78% of users chose templates in month one. The blank-slate builder caused paralysis — users didn't know what 'kind' of agent they wanted. Templates set context before configuration begins. Tradeoff: advanced users occasionally felt constrained by template structure.",
                },
                {
                  title: "Full autonomy vs. human review step",
                  choice: "Human review step",
                  why: "Research surfaced deep fear about AI making calls without preview. Added a lead review step between search and outreach — users can remove contacts before Arya calls. Reduced trust barrier significantly. Tradeoff: adds one step to the outreach flow.",
                },
                {
                  title: "Showing AI metrics vs. hiding behind simplicity",
                  choice: "Show metrics prominently",
                  why: "Match scores (99%), call counts, and conversion rates are visible throughout. Hiding AI performance data felt like obscuring something. Sales managers need the numbers to justify AI adoption internally. Tradeoff: metrics-heavy UI can feel overwhelming for first-time users.",
                },
              ].map((tr) => (
                <FadeUp key={tr.title}>
                  <div className="p-6 rounded-xl" style={{ border: `1px solid ${BORDER}`, background: "rgba(24,24,27,0.02)" }}>
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                      <p style={{ fontSize: 15, fontWeight: 500, color: BODY_COLOR }}>{tr.title}</p>
                      <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: `rgba(232,67,46,0.08)`, color: BRAND, whiteSpace: "nowrap" }}>
                        Chose: {tr.choice}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: FADED, lineHeight: 1.65 }}>{tr.why}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </section>

          {/* ── Reflection ──────────────────────────── */}
          <section id="reflection" className="scroll-mt-[72px] pt-16 mt-16" style={{ borderTop: `1px solid ${BORDER}` }}>
            <FadeUp>
              <SectionLabel>Reflection</SectionLabel>
              <H2>Designing for AI trust is a new craft.</H2>
              <Body className="mt-4 mb-4">
                Working on House of Agents taught me that designing for AI-first products requires a fundamentally different design language than traditional SaaS. The central question isn&apos;t &quot;how do I make this easy to use?&quot; — it&apos;s &quot;how do I make the user trust that the AI won&apos;t make a mistake that costs them a deal?&quot;
              </Body>
              <Body className="mb-4">
                The activity feed on the dashboard was the single highest-impact design decision I made on this project. It transformed onboarding from an empty form-filling exercise into a moment of genuine excitement — users watching Arya call leads and book meetings before they&apos;d even finished setup. That&apos;s what makes an AI product feel real.
              </Body>
              <Body>
                Working directly with the CEO/Founder — rather than through layers of product management — compressed decision cycles significantly. Feedback came the same day. This required me to be a stronger design communicator: presenting rationale clearly, standing behind decisions when challenged, and knowing when to defer to founder intuition about market fit.
              </Body>
            </FadeUp>
          </section>

          {/* ── CTA ─────────────────────────────────── */}
          <FadeUp delay={0.1} className="mt-16">
            <Link href="https://www.linkedin.com/in/kartikeypanchal" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <motion.div
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 rounded-xl"
                style={{ background: "#f3f4f6" }}
                whileHover={{ background: "#eceef2" }}
                transition={{ duration: 0.2 }}
              >
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#181617", marginBottom: 4 }}>Schedule a case study walkthrough</p>
                  <p style={{ fontSize: 13, color: "rgba(24,22,23,0.45)" }}>Reach out on LinkedIn to book a call — I&apos;ll walk you through every screen and share the Figma file.</p>
                </div>
                <motion.div
                  className="shrink-0 flex items-center gap-1.5 px-5 py-2.5 rounded-full"
                  style={{ background: "linear-gradient(135deg, #FF2929, #FFD029)", whiteSpace: "nowrap" }}
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.15 }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600, color: "white" }}>Reach out on LinkedIn</span>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
                </motion.div>
              </motion.div>
            </Link>
          </FadeUp>

        </div>
      </div>
      </div>
    </div>
  );
}
