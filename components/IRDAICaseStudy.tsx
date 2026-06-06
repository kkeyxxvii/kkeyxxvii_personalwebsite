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

const BODY_COLOR = "#1e2d3d";
const FADED      = "rgba(30,45,61,0.55)";
const BORDER     = "rgba(30,45,61,0.1)";
const SERIF      = "Georgia,'Times New Roman',serif";
const MONO       = "var(--font-geist-mono),monospace";
const BRAND      = "#0d3880";   // IRDAI navy blue
const ACCENT     = "#c0392b";   // IRDAI red accent

/* ─── Sidebar ──────────────────────────────────────── */
function Sidebar({ active }: { active: string }) {
  return (
    <aside className="hidden lg:block w-[188px] shrink-0">
      <div className="sticky top-[72px]">
        <p style={{
          fontFamily: MONO, fontSize: 12, textTransform: "uppercase",
          letterSpacing: "0.12em", color: "rgba(30,45,61,0.35)",
          marginBottom: 10, paddingLeft: 14,
        }}>
          Contents
        </p>
        <nav className="flex flex-col" style={{ borderLeft: "1px solid rgba(30,45,61,0.12)" }}>
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
                color: active === s.id ? BODY_COLOR : "rgba(30,45,61,0.38)",
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
      whileHover={{ y: -3, boxShadow: "0 8px 28px rgba(30,45,61,0.10)" }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Browser Frame ────────────────────────────────── */
function BrowserFrame({ children, url = "irdai.gov.in", title = "" }: { children: React.ReactNode; url?: string; title?: string }) {
  return (
    <motion.div
      className="relative mx-auto overflow-hidden w-full"
      style={{
        maxWidth: 580,
        borderRadius: 10,
        border: "1px solid rgba(30,45,61,0.12)",
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

/* ═══════════════════════════════════════════════════ */
/*  SCREENS DATA                                        */
/* ═══════════════════════════════════════════════════ */
const SCREENS = [
  {
    label: "Homepage",
    num: "01",
    subtitle: "Redesigned Hero + Quick Access",
    before: "Wall of text links, government seal in the top-left with no hierarchy, no search bar, three separate scrolling marquees, and flags and logos all competing for attention. A first-time visitor had no clear starting point.",
    after: "Clean hero with the IRDAI emblem, a prominent full-width search bar, and four quick-access cards (File Complaint, Find Insurer, View Circulars, Check License). Search-first architecture replaced 40 individual landing page links.",
    decision: "Search-first architecture over link-heavy homepage. Research showed 78% of citizens arrived with a specific intent — finding a document, filing a complaint, or locating an insurer. A prominent search bar with autocomplete addressed all three without requiring users to know the site's structure.",
    screen: (
      <motion.div
        className="relative mx-auto overflow-hidden w-full"
        style={{
          borderRadius: 10,
          boxShadow: "0 16px 48px rgba(0,0,0,0.14), 0 4px 12px rgba(0,0,0,0.08)",
          lineHeight: 0,
          overflow: "hidden",
        }}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-5%" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/case-studies/irdai/screen-01-homepage.png"
          alt="IRDAI Redesigned Homepage"
          style={{ width: "100%", display: "block" }}
        />
      </motion.div>
    ),
  },
  {
    label: "Accessibility Controls",
    num: "05",
    subtitle: "GIGW Accessibility Toolbar",
    before: "No accessibility controls whatsoever. No way to increase text size, change contrast, or access a site map. The site failed every GIGW accessibility requirement — no skip links, no text resize, no high contrast mode.",
    after: "Persistent accessibility toolbar (skip link + A-/A/A+ text resize + high contrast toggle + screen reader mode + site map) compliant with Government of India GIGW standards. Skip link goes to main content. High contrast mode achieves a verified 7:1 contrast ratio.",
    decision: "Visible by default, not hidden. Government accessibility guidelines require this toolbar to be visible without user interaction. We pushed back on a 'click to reveal' pattern requested by a stakeholder — accessibility tools shouldn't require a hunt to find.",
    screen: (
      <motion.div
        className="relative mx-auto overflow-hidden w-full"
        style={{
          borderRadius: 10,
          boxShadow: "0 16px 48px rgba(0,0,0,0.14), 0 4px 12px rgba(0,0,0,0.08)",
          lineHeight: 0,
          overflow: "hidden",
        }}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-5%" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/case-studies/irdai/screen-05-accessibility-controls.png"
          alt="IRDAI Accessibility Controls Toolbar"
          style={{ width: "100%", display: "block" }}
        />
      </motion.div>
    ),
  },
];

/* ═══════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                     */
/* ═══════════════════════════════════════════════════ */
export default function IRDAICaseStudy() {
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
              <CaseStudyBreadcrumb title="IRDAI Website Redesign" minRead={12} />
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              style={{ fontFamily: SERIF, fontSize: "clamp(2rem,4.5vw,3.25rem)", fontWeight: 400, color: BODY_COLOR, lineHeight: 1.1, marginBottom: "1.5rem" }}
            >
              Redesigning India&rsquo;s Insurance Regulator<br />for 1.4 Billion Citizens
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
                  IRDAI · Web · WCAG 2.1 AA · GIGW v2
                </p>
                <p style={{ fontFamily: SERIF, fontSize: "clamp(1.4rem,2.5vw,2rem)", color: "rgba(255,255,255,0.95)", fontWeight: 400 }}>
                  Accessibility overhaul for a public utility.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    { v: "50%",  l: "Accessibility Improvement" },
                    { v: "25%",  l: "User Retention Boost"      },
                    { v: "40%",  l: "Complaint Filing Time ↓"   },
                    { v: "60%",  l: "Mobile Traffic Increase"   },
                    { v: "847",  l: "Violations Fixed"          },
                    { v: "7.2:1",l: "Final Contrast Ratio"      },
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
                { l: "Role",     v: "Lead Designer — Ripple Design"          },
                { l: "Client",   v: "IRDAI (Govt. of India)"                 },
                { l: "Platform", v: "Web · Desktop · Mobile"                 },
                { l: "Standard", v: "WCAG 2.1 AA · GIGW v2"                 },
                { l: "Tools",    v: "Figma · axe DevTools · WAVE"            },
                { l: "Timeline", v: "2021 · 20-week engagement"              },
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
              <H2>A public utility built in 2008, serving a billion citizens in 2021.</H2>
              <Body className="mb-5">
                IRDAI is India&rsquo;s insurance regulator — the authority responsible for protecting the interests of policyholders and regulating the insurance industry for 1.4 billion citizens. Their website is a public utility: millions depend on it for policy information, consumer complaints, and regulatory circulars. The old site was built in 2008 and never systematically updated for accessibility or modern standards.
              </Body>
              <Body className="mb-8">
                Ripple Design was contracted to lead the end-to-end redesign working directly with IRDAI&rsquo;s IT and communications teams. I led the design effort — conducting the full accessibility audit, designing the new system, and guiding IRDAI&rsquo;s internal developers through implementation. The project delivered a <strong style={{ color: BODY_COLOR }}>50% improvement in accessibility scores</strong> and a measurable 25% increase in user retention within three months of launch.
              </Body>
            </FadeUp>

            <FadeUp delay={0.08}>
              <div className="rounded-xl p-8 mb-8" style={{ background: `rgba(13,56,128,0.04)`, border: `1px solid rgba(13,56,128,0.1)` }}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  {[
                    { raw: "50",  suf: "%", label: "Accessibility\nimprovement"        },
                    { raw: "25",  suf: "%", label: "User retention\nboost"             },
                    { raw: "40",  suf: "%", label: "Complaint filing\ntime reduction"  },
                    { raw: "60",  suf: "%", label: "Mobile traffic\npost-launch"       },
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
                  { role: "Citizens",        desc: "Policy-seekers, complaint filers, and members of the public looking for insurer information, regulatory guidance, or help resolving a dispute. The primary beneficiaries of the accessibility work." },
                  { role: "Insurance Agents",desc: "Agents and brokers who regularly access IRDAI&rsquo;s circulars, regulatory updates, and licensing information to stay compliant and advise their clients." },
                  { role: "IRDAI Staff",     desc: "Internal teams publishing circulars, managing consumer grievances, and maintaining the site. The redesign included a content management guide and HTML circular templates to support their workflow." },
                ].map((r) => (
                  <HoverCard key={r.role}>
                    <div className="p-5 rounded-lg h-full" style={{ background: "rgba(30,45,61,0.03)", border: `1px solid ${BORDER}` }}>
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
              <H2>847 accessibility violations across 40 pages.</H2>
              <Body className="mb-10">
                The initial axe DevTools and WAVE audit was sobering. The old IRDAI website didn&rsquo;t just fail modern accessibility standards — it failed them systematically, across every page, in ways that actively excluded users with disabilities, elderly citizens, and anyone on a mobile device. This wasn&rsquo;t a matter of polish. It was a matter of access.
              </Body>
            </FadeUp>

            <div className="grid md:grid-cols-2 gap-4 mb-10">
              {[
                { n:"01", t:"Critical WCAG failures — contrast as low as 1.8:1", b:"The minimum required contrast ratio is 4.5:1 for normal text. The old site had color combinations with ratios as low as 1.8:1 — effectively unreadable for users with low vision. This was the single most pervasive failure across all 40 page templates." },
                { n:"02", t:"Navigation collapse — 80+ top-level nav items",      b:"Every department had insisted on top-level nav placement. The result was 80+ items in a flat horizontal nav that wrapped onto 3 lines, making it functionally impossible to navigate. No grouping, no hierarchy, no way to find anything without scanning every item." },
                { n:"03", t:"Zero mobile optimisation — desktop-only, broken on phones", b:"The 2008 site was never designed for mobile. On a smartphone, elements overlapped, text was 4px, and navigation was completely non-functional. With 60%+ of Indian internet users accessing the web on mobile, this excluded the majority of the country." },
                { n:"04", t:"Screen reader incompatibility — missing ARIA, no semantic HTML", b:"No alt text on images, no ARIA labels on form fields, no semantic heading structure, and no landmark regions. Screen reader users encountered an undifferentiated wall of text with no navigational entry points." },
                { n:"05", t:"PDF-only regulations — untagged, inaccessible to assistive tech", b:"All regulatory documents were published as untagged PDFs scanned from print originals. No text layer, no reading order, no search indexing. For users relying on screen readers, these documents simply didn't exist." },
                { n:"06", t:"Tiny typography — 10–11px body text, 1.2 line-height throughout", b:"Body text was set at 10–11px — below the 16px minimum recommended for body copy. Combined with a 1.2 line-height and low contrast, reading any paragraph of text on the site required significant effort even for users without vision impairments." },
                { n:"07", t:"No keyboard navigation — tab order broken, no skip links", b:"The tab order was broken on every page. Interactive elements were unreachable via keyboard. There were no skip links to jump to main content, no visible focus indicators, and no way to navigate without a mouse." },
                { n:"08", t:"Dense information architecture — no citizen journey", b:"There was no clear path for a citizen to file a complaint, find their insurer's contact details, or access the regulatory document they needed. Every task required prior knowledge of the site's structure." },
              ].map((p, i) => (
                <HoverCard key={p.n}>
                  <FadeUp delay={i * 0.05}>
                    <motion.div
                      className="p-5 rounded-lg h-full cursor-default"
                      style={{ background: "rgba(30,45,61,0.03)", border: `1px solid ${BORDER}` }}
                      whileHover={{ background: "rgba(30,45,61,0.05)" }}
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
              <div className="rounded-xl p-6" style={{ background: `rgba(13,56,128,0.04)`, border: `1px solid rgba(13,56,128,0.12)` }}>
                <p style={{ fontFamily: MONO, fontSize: 12, color: FADED, textTransform: "uppercase", marginBottom: 10 }}>Core Design Question</p>
                <p style={{ fontFamily: SERIF, fontSize: "clamp(1.1rem,2vw,1.4rem)", color: BODY_COLOR, lineHeight: 1.5 }}>
                  How might we make India&rsquo;s insurance regulatory website fully accessible to every citizen — regardless of disability, device, or digital literacy — without compromising the authority and trust of a government institution?
                </p>
              </div>
            </FadeUp>
          </section>

          {/* ── Process ─────────────────────────────── */}
          <section id="process" className="scroll-mt-[72px] pt-16 mt-16" style={{ borderTop: `1px solid ${BORDER}` }}>
            <FadeUp>
              <SectionLabel>Process</SectionLabel>
              <H2>4 phases over 20 weeks.</H2>
              <Body className="mb-10">Contracted by Ripple Design and embedded with IRDAI&rsquo;s IT and communications teams. The process balanced rigorous accessibility standards with the realities of government procurement — weekly approval cycles, multi-department sign-off, and non-negotiable brand guidelines.</Body>
            </FadeUp>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {[
                {
                  n: "Phase 01", t: "Discovery", dates: "Week 1–2",
                  d: "Full accessibility audit using axe DevTools, WAVE, and manual keyboard testing across all 40 page templates. 847 accessibility violations catalogued by severity, WCAG criterion, and affected user group. Delivered a prioritised remediation roadmap to IRDAI leadership.",
                },
                {
                  n: "Phase 02", t: "Collaboration", dates: "Week 3–6",
                  d: "Weekly sessions with IRDAI IT team and communications department. Established shared design principles, a GIGW compliance checklist, and a sign-off process that reduced approval cycles from 4 weeks to 10 days. Aligned all 8 department stakeholders on the new IA.",
                },
                {
                  n: "Phase 03", t: "Design", dates: "Week 7–16",
                  d: "Component-first design in Figma. Built a fully accessible component library with documented contrast ratios, focus states, ARIA patterns, and responsive breakpoints. 5 responsive breakpoints designed and annotated. All components tested against WCAG 2.1 AA and GIGW v2.",
                },
                {
                  n: "Phase 04", t: "Handoff + Guidance", dates: "Week 17–20",
                  d: "Developer handoff with annotated Figma specs. Guided IRDAI&rsquo;s internal development team through implementation via weekly review sessions, providing written remediation guidance for each accessibility criterion and signing off on each page template after testing.",
                },
              ].map((s, i) => (
                <HoverCard key={s.n}>
                  <motion.div
                    className="p-5 rounded-lg h-full cursor-default"
                    style={{ background: "rgba(30,45,61,0.03)", border: `1px solid ${BORDER}` }}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-5%" }}
                    transition={{ duration: 0.4, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p style={{ fontFamily: MONO, fontSize: 10, color: FADED }}>{s.n}</p>
                      <span className="px-2 py-0.5 rounded" style={{ fontFamily: MONO, fontSize: 9, color: FADED, background: "rgba(30,45,61,0.05)" }}>{s.dates}</span>
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 500, color: BODY_COLOR, lineHeight: 1.3, marginBottom: 8 }}>{s.t}</p>
                    <p style={{ fontSize: 12, color: FADED, lineHeight: 1.55 }}>{s.d}</p>
                  </motion.div>
                </HoverCard>
              ))}
            </div>
          </section>

          {/* ── Research ────────────────────────────── */}
          <section id="research" className="scroll-mt-[72px] pt-16 mt-16" style={{ borderTop: `1px solid ${BORDER}` }}>
            <FadeUp>
              <SectionLabel>Research</SectionLabel>
              <H2>Twelve interviews. One recurring theme: &ldquo;I give up.&rdquo;</H2>
              <Body className="mb-10">
                The accessibility audit told us what was broken technically. User research told us what it felt like to use the site. I conducted 12 interviews with insurance agents, consumers, and regulatory officers — covering desktop, mobile, and assistive technology users. The phrase &ldquo;I give up&rdquo; or its equivalent appeared in 9 of 12 sessions when participants attempted to file a complaint or find a specific circular. That phrase became the brief.
              </Body>
            </FadeUp>

            <FadeUp delay={0.08}>
              <div className="rounded-xl p-10 mb-10" style={{ background: "rgba(30,45,61,0.03)", border: `1px solid ${BORDER}` }}>
                <p className="uppercase mb-8" style={{ fontFamily: MONO, fontSize: 12, color: FADED, letterSpacing: "0.08em" }}>Research at a glance</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  {[
                    { raw: "12",  label: "User interviews\nconducted"   },
                    { raw: "847", label: "Accessibility\nviolations"    },
                    { raw: "40",  label: "Page templates\naudited"      },
                    { raw: "4",   label: "Gov websites\nbenchmarked"    },
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
                "How might we make IRDAI's digital services accessible to every citizen — including those using assistive technology, low-bandwidth mobile connections, or limited digital literacy?",
                "How might we design a navigation system that helps a first-time visitor find what they need without knowing the site's structure or the regulator's departmental organisation?",
                "How might we modernise a government website's visual and interaction design while preserving the institutional trust that citizens expect from a regulatory authority?",
              ].map((q, i) => (
                <HoverCard key={i}>
                  <FadeUp delay={i * 0.07}>
                    <div className="p-5 rounded-lg h-full" style={{ background: "rgba(30,45,61,0.03)", border: `1px solid ${BORDER}` }}>
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
                <div className="hidden md:grid grid-cols-[180px_1fr_120px] px-5 py-3" style={{ background: "rgba(30,45,61,0.03)", borderBottom: `1px solid ${BORDER}` }}>
                  {["User Type","Finding","Priority"].map(h => (
                    <p key={h} style={{ fontFamily: MONO, fontSize: 12, color: FADED, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</p>
                  ))}
                </div>
                {[
                  { type: "Consumer · Mobile",          finding: "Tried to file a complaint on a phone. Nav collapsed, form fields overlapped, submit button unreachable. 'I tried three times and gave up. I called their 1800 number instead.' Task abandonment: 100%.", pri: "Critical", pC: "rgba(220,38,38,0.07)", pT: "#dc2626" },
                  { type: "Consumer · Screen Reader",   finding: "NVDA user attempting to read a regulatory circular PDF. 'It reads like gibberish — just random letters and numbers. There's no structure at all.' Confirmed: PDFs were scanned images with no text layer.", pri: "Critical", pC: "rgba(220,38,38,0.07)", pT: "#dc2626" },
                  { type: "Insurance Agent · Desktop",  finding: "Visits IRDAI 3–4 times per week for circulars. 'I've memorised which menu has what because there's no way to search. If they move a link I'm lost for a week.' Coping behaviour masking discovery failure.", pri: "High",     pC: "rgba(234,88,12,0.08)", pT: "#ea580c" },
                  { type: "Regulatory Officer · Internal",finding: "'We publish PDFs because that's all the CMS supports. We know it's not accessible but we don't have an alternative.' Content publishing constraint revealed — required a process change, not just a design change.", pri: "High",     pC: "rgba(234,88,12,0.08)", pT: "#ea580c" },
                ].map((c, i, arr) => (
                  <motion.div
                    key={c.type}
                    className="grid grid-cols-1 md:grid-cols-[180px_1fr_120px] gap-2 items-start px-5 py-4 cursor-default"
                    style={{ borderBottom: i < arr.length - 1 ? `1px solid rgba(30,45,61,0.05)` : "none" }}
                    whileHover={{ background: "rgba(30,45,61,0.02)" }}
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
              <H2>Five design screens, three rounds of stakeholder feedback.</H2>
              <Body className="mb-10">
                Government design work has a different cadence — stakeholder review cycles are measured in weeks, not days. Each iteration had to be tightly argued, with every change justified against WCAG criteria or GIGW requirements. &ldquo;This fails WCAG 2.1 AA&rdquo; ends a debate faster than &ldquo;this looks better.&rdquo;
              </Body>
            </FadeUp>

            <div className="space-y-4">
              {[
                {
                  v: "v1 — Accessibility-first structure",
                  date: "Week 7",
                  desc: "First designs focused exclusively on WCAG compliance — correcting contrast ratios, adding skip links, fixing heading hierarchy. Stakeholder feedback: 'It looks like a medical form, not a government website.' The lesson: accessibility and visual authority aren't in conflict, but they require deliberate integration. The navy and red palette was brought in to restore institutional character.",
                  change: "Navy/red palette restoring institutional authority",
                },
                {
                  v: "v2 — IA restructure",
                  date: "Week 10",
                  desc: "Card-sorted with 24 users to derive the new information architecture. The original 80+ item flat nav became 6 top-level categories. The IRDAI IT team pushed back: 'Every department needs to be in the top nav.' We presented card sort results showing that users grouped content into 6 natural categories regardless of departmental ownership. Data ended the debate.",
                  change: "Card-sort-validated IA: 80 items → 6 categories",
                },
                {
                  v: "v3 — Consumer complaint flow",
                  date: "Week 14",
                  desc: "First complaint form design was a single-page form with 12 fields. Accessibility testing revealed three critical issues: the form had no visible labels (only placeholders), error messages were colour-only (no icon or text), and the submit button had no ARIA label. Redesigned as a 3-step wizard with explicit labels, inline error messages with text+icon, and full keyboard navigation. Complaint filing time reduced by 40% in usability testing.",
                  change: "3-step wizard, explicit labels, text+icon errors",
                },
              ].map((v, i) => (
                <HoverCard key={v.v}>
                  <FadeUp delay={i * 0.07}>
                    <motion.div
                      className="p-6 rounded-xl cursor-default"
                      style={{ background: "rgba(30,45,61,0.03)", border: `1px solid ${BORDER}` }}
                      whileHover={{ background: "rgba(30,45,61,0.05)" }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <p style={{ fontSize: 14, fontWeight: 600, color: BODY_COLOR }}>{v.v}</p>
                        <span className="px-2 py-0.5 rounded" style={{ fontFamily: MONO, fontSize: 9, color: FADED, background: "rgba(30,45,61,0.05)" }}>{v.date}</span>
                      </div>
                      <p style={{ fontSize: 13, color: FADED, lineHeight: 1.65, marginBottom: 10 }}>{v.desc}</p>
                      <div className="flex items-center gap-2">
                        <span style={{ fontFamily: MONO, fontSize: 12, color: FADED, textTransform: "uppercase" }}>Key change</span>
                        <span className="px-2 py-0.5 rounded" style={{ fontSize: 11, fontWeight: 500, color: BRAND, background: `rgba(13,56,128,0.08)` }}>{v.change}</span>
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
              <H2>Five screens that define the redesign.</H2>
              <Body className="mb-10">
                Each screen solves a specific failure from the audit. Annotated with before, after, and the design decision behind each change.
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
                      background: activeScreen === i ? "rgba(30,45,61,0.06)" : "transparent",
                      borderRight: i < SCREENS.length - 1 ? `1px solid ${BORDER}` : "none",
                      border: "none",
                    }}
                    whileHover={{ background: "rgba(30,45,61,0.04)" }}
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

                <div className="flex justify-center py-8 rounded-xl" style={{ background: "rgba(30,45,61,0.03)", border: `1px solid ${BORDER}` }}>
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
              <H2>From a broken public utility to a WCAG 2.1 AA compliant service.</H2>
              <Body className="mb-10">
                The most significant shifts were measurable. Three dimensions tell the story most clearly: contrast ratios, navigation complexity, and responsive breakpoints. Each represents a category of exclusion that was fully resolved.
              </Body>
            </FadeUp>

            <FadeUp delay={0.08}>
              <div className="rounded-xl overflow-hidden mb-8" style={{ border: `1px solid ${BORDER}` }}>
                <div className="grid md:grid-cols-[1fr_1fr_1fr] px-5 py-3" style={{ background: "rgba(30,45,61,0.03)", borderBottom: `1px solid ${BORDER}` }}>
                  {["Dimension","Before — 2008 Site","After — 2021 Redesign"].map(h => (
                    <p key={h} style={{ fontFamily: MONO, fontSize: 12, color: FADED, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</p>
                  ))}
                </div>
                {[
                  { dim: "Color contrast ratio",   before: "1.8:1 minimum (fails WCAG by 2.5×)",   after: "7.2:1 minimum (exceeds AA; meets AAA body text)" },
                  { dim: "Navigation complexity",  before: "80+ top-level items, flat, 3 rows",     after: "6 top-level categories, mega-menu, ≤8 sub-items each" },
                  { dim: "Mobile breakpoints",     before: "0 — desktop-only, broken on all phones",after: "5 responsive breakpoints: 320px to 1440px+" },
                  { dim: "Keyboard navigation",    before: "Broken tab order, no skip links, no focus indicators", after: "Full keyboard nav, skip link to main, visible 3px focus ring" },
                  { dim: "Document accessibility", before: "Untagged scanned PDFs only",             after: "HTML-first with tagged PDF fallback; full text search" },
                  { dim: "Complaint filing",       before: "PDF form, print, mail or fax — days",   after: "3-step online wizard, WCAG AA, 40% faster" },
                  { dim: "Text size",              before: "10–11px body, 1.2 line-height",          after: "16px body, 1.65 line-height, A-/A/A+ toolbar" },
                  { dim: "ARIA & semantic HTML",   before: "Missing alt text, no ARIA, no landmarks",after: "Full ARIA implementation, semantic HTML5, landmark regions" },
                ].map((row, i, arr) => (
                  <motion.div
                    key={row.dim}
                    className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr] gap-2 items-start px-5 py-3.5 cursor-default"
                    style={{ borderBottom: i < arr.length - 1 ? `1px solid rgba(30,45,61,0.05)` : "none" }}
                    whileHover={{ background: "rgba(30,45,61,0.02)" }}
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
              <H2>Five things designed but not yet shipped.</H2>
              <Body className="mb-10">
                Scoped out of this engagement — not because they weren&rsquo;t important, but because government procurement cycles and IRDAI&rsquo;s internal capacity constrained scope. Each is designed and documented, ready for a future phase.
              </Body>
            </FadeUp>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                { n:"01", t:"PWA for offline access",               d:"A Progressive Web App that caches key documents — regulatory circulars, complaint forms, insurer contact details — for offline access. Critical for users in low-connectivity regions. Architecture is designed; requires IRDAI's infrastructure team to provision a service worker." },
                { n:"02", t:"Vernacular language support",           d:"IRDAI serves 1.4 billion citizens across 22 scheduled languages under the Indian Constitution. Full vernacular support is designed with dynamic font loading for Devanagari, Tamil, Bengali, Telugu, and 18 others. Deferred due to content migration scope." },
                { n:"03", t:"AI-powered complaint categorisation",   d:"Complaint descriptions entered through the new online form are unstructured text. A classifier that routes complaints to the correct insurer department, suggests the relevant IRDAI team, and flags duplicates would reduce resolution time significantly. Backend work required." },
                { n:"04", t:"DigiLocker integration for policy docs",d:"DigiLocker is India's national digital document infrastructure. Integration would allow citizens to retrieve and attach their policy documents directly to complaint submissions — eliminating the need to upload scanned copies. Requires IRDAI IT's API implementation." },
                { n:"05", t:"Live chat with IRDAI helpdesk",         d:"Designed a live chat widget with operator queue, read receipts, and a fallback to email — all keyboard accessible and screen reader compatible. IRDAI's helpdesk team needs staffing and tooling support before this can go live." },
              ].map((f, i) => (
                <HoverCard key={f.n}>
                  <FadeUp delay={i * 0.06}>
                    <div className="p-5 rounded-lg h-full" style={{ background: "rgba(30,45,61,0.03)", border: `1px solid ${BORDER}` }}>
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
                Government accessibility work involves constraints that don&rsquo;t exist in commercial product design. These are the decisions where we chose one value over another — consciously.
              </Body>
            </FadeUp>

            <div className="space-y-0">
              {[
                {
                  decision: "Preserving existing URL structure — not rearchitecting content paths",
                  chose:    "Backwards compatibility",
                  traded:   "Optimal information architecture",
                  why:      "A full IA overhaul would have produced a cleaner site structure. But thousands of existing URLs are referenced in government circulars, court orders, and external links that cannot be changed. We implemented a URL redirect mapping and redesigned navigation on top of the existing structure rather than rebuilding it. The resulting IA is better than before — but constrained by legacy URL patterns.",
                },
                {
                  decision: "Framing every recommendation as a WCAG/GIGW requirement",
                  chose:    "Adoption rate",
                  traded:   "Design autonomy",
                  why:      "In commercial projects, 'this looks better' is a valid argument. In government, it isn't. Every recommendation was framed as a compliance requirement: 'This fails WCAG 2.1 AA criterion 1.4.3 (Contrast Minimum)' rather than 'this is hard to read.' The tradeoff is that design decisions outside WCAG/GIGW scope — spacing, illustration, motion — required significantly more advocacy. We accepted narrower creative latitude in exchange for higher implementation fidelity on accessibility.",
                },
                {
                  decision: "HTML-first for all regulatory documents — not maintaining PDF-only publishing",
                  chose:    "Accessibility and searchability",
                  traded:   "Publishing convenience for IRDAI staff",
                  why:      "IRDAI&rsquo;s publishing workflow was entirely PDF-based. Moving to HTML-first required new templates, an editorial guide, and retraining the communications team. Staff resistance was real — 'this doubles our publishing time.' We provided templates that made HTML publishing close to PDF publishing in effort. The long-term gains (search indexing, screen reader compatibility, text resizing) justified the short-term overhead.",
                },
                {
                  decision: "Maintaining Devanagari Hindi text throughout — not deferring to English-only",
                  chose:    "Citizen inclusivity",
                  traded:   "Typography control",
                  why:      "Hindi in Devanagari script requires specific font loading, line-height adjustments, and character spacing considerations that constrain typographic choices. An English-only redesign would have been simpler. But IRDAI&rsquo;s mandate is to serve all Indian citizens — many of whom engage primarily in Hindi. Devanagari rendering was treated as a core constraint, not a nice-to-have.",
                },
              ].map((t, i) => (
                <FadeUp key={t.decision} delay={i * 0.05}>
                  <motion.div
                    className="py-6 cursor-default"
                    style={{ borderBottom: `1px solid rgba(30,45,61,0.06)` }}
                    whileHover={{ background: "rgba(30,45,61,0.012)", paddingLeft: 6 }}
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
                {
                  n: "01",
                  t: "Compliance is a design constraint, not a checklist",
                  b: "WCAG 2.1 AA is 78 success criteria. It is easy to approach this as a checklist — fix the contrast, add the alt text, done. The real design challenge is building a system where accessibility is structural, not remediated. Components that fail accessibility on first build create compounding problems at scale. The investment was in building accessible components once, correctly, so every page template that used them was accessible by default.",
                },
                {
                  n: "02",
                  t: "Government clients need standards, not opinions",
                  b: "In a commercial project, a designer&rsquo;s aesthetic judgment carries weight. In a government project, it doesn&rsquo;t — and shouldn&rsquo;t. Every recommendation needs an external authority to back it: WCAG, GIGW, GOV.UK patterns, Nielsen&rsquo;s heuristics. The most productive meetings were the ones where I arrived with compliance documentation, not design rationale. This reframed the relationship — I was helping IRDAI meet standards they were obligated to meet, not selling them a redesign.",
                },
                {
                  n: "03",
                  t: "The real stakeholder is the user who can&rsquo;t use the site",
                  b: "In user research, the participants who shape the most design decisions are usually the most representative. In accessibility work, the opposite is true — the most impactful findings come from users at the edges: the screen reader user who couldn&rsquo;t read a single PDF, the mobile user who abandoned a complaint form three times, the elderly insurance agent who couldn&rsquo;t read 10px text. These users are invisible in standard analytics. Making them visible was the case for every significant design change.",
                },
                {
                  n: "04",
                  t: "Design systems accelerate government procurement",
                  b: "Government approval cycles are slow. Every component that required stakeholder sign-off extended the timeline by 3–4 weeks. Components approved once — and built into a shared library — didn&rsquo;t require re-approval when used on a new page. Building the IRDAI component library in Figma with full WCAG annotations meant that implementation sign-off happened at the system level, not the page level. The last eight page templates were approved in 10 days collectively. The first eight took 12 weeks.",
                },
              ].map((r, i) => (
                <FadeUp key={r.n} delay={i * 0.06}>
                  <motion.div
                    className="grid md:grid-cols-[48px_1fr] gap-4 py-7 cursor-default"
                    style={{ borderBottom: `1px solid rgba(30,45,61,0.06)` }}
                    whileHover={{ background: "rgba(30,45,61,0.015)", paddingLeft: 4 }}
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
