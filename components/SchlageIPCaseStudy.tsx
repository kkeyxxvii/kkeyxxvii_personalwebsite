"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import CaseStudyBreadcrumb from "@/components/CaseStudyBreadcrumb";

/* ─── Constants ─────────────────────────────────────── */
const NAV_SECTIONS = [
  { id: "overview",    label: "Overview"    },
  { id: "problem",     label: "Problem"     },
  { id: "process",     label: "Process"     },
  { id: "prototype",   label: "Prototype"   },
  { id: "reflection",  label: "Reflection"  },
];

const BODY_COLOR = "#32404f";
const FADED      = "rgba(50,64,79,0.55)";
const BORDER     = "rgba(50,64,79,0.1)";
const SERIF      = "Georgia,'Times New Roman',serif";
const MONO       = "var(--font-geist-mono),monospace";
const SCHLAGE_RED = "#C8102E";

/* ─── Sidebar ───────────────────────────────────────── */
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

/* ─── Scroll reveal ─────────────────────────────────── */
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

/* ─── Helpers ───────────────────────────────────────── */
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

function Divider() {
  return <div style={{ height: 1, background: BORDER, margin: "56px 0" }} />;
}

/* ─── Flow step pill ────────────────────────────────── */
function FlowStep({ num, label, desc }: { num: string; label: string; desc: string }) {
  return (
    <div className="flex gap-4 items-start">
      <div
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
        style={{ background: "rgba(34,113,234,0.08)", color: "#2271EA", fontFamily: MONO }}
      >
        {num}
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, color: BODY_COLOR, marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 13, color: FADED, lineHeight: 1.55 }}>{desc}</div>
      </div>
    </div>
  );
}

/* ─── Stat card ─────────────────────────────────────── */
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ padding: "20px 24px", border: `1px solid ${BORDER}`, borderRadius: 8 }}>
      <div style={{ fontSize: "clamp(1.4rem,2.5vw,2rem)", fontWeight: 600, color: BODY_COLOR, fontFamily: SERIF }}>{value}</div>
      <div style={{ fontSize: 13, color: FADED, marginTop: 4 }}>{label}</div>
    </div>
  );
}

/* ─── Prototype hint bar ────────────────────────────── */
function HintBar({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex items-center gap-3 rounded-lg px-4 py-3"
      style={{ background: "rgba(34,113,234,0.05)", border: "1px solid rgba(34,113,234,0.12)", fontSize: 13, color: FADED }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                         */
/* ═══════════════════════════════════════════════════════ */
export default function SchlageIPCaseStudy() {
  const [activeSection, setActiveSection] = useState("overview");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const ids = NAV_SECTIONS.map((s) => s.id);
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh" }}>

      <div className="px-6 md:px-10 pt-8">
      <div className="flex gap-10 xl:gap-16">
        <Sidebar active={activeSection} />

        <div className="flex-1 min-w-0 pb-32">

          <div className="pt-6 pb-6">
            <CaseStudyBreadcrumb title="Schlage IP Integration" minRead={4} />
          </div>

          {/* ══ OVERVIEW ════════════════════════════════ */}
          <section id="overview" className="scroll-mt-[72px] mb-16">
            <FadeUp>
              <SectionLabel>Overview</SectionLabel>
              <h1 style={{ fontFamily: SERIF, fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, color: BODY_COLOR, lineHeight: 1.15, marginBottom: "1.25rem" }}>
                Schlage ENGAGE<br />IP Integration
              </h1>
              <Body>
                A full end-to-end UX design for adding direct IP wireless lock support to Genea&apos;s access control platform — closing a competitive gap against Genetec and Avigilon Alta by enabling Schlage NDEB/LEB locks to connect without Mercury controllers.
              </Body>
            </FadeUp>

            <FadeUp delay={0.1} className="mt-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Role",     value: "Lead Product Designer" },
                  { label: "Platform", value: "Genea Web App"         },
                  { label: "Year",     value: "2026"                  },
                  { label: "Type",     value: "Feature Design"        },
                ].map((m) => (
                  <div key={m.label} style={{ borderTop: "2px solid #FF2929", paddingTop: 12 }}>
                    <div style={{ fontSize: 12, color: FADED, marginBottom: 4, fontFamily: MONO, textTransform: "uppercase", letterSpacing: "0.06em" }}>{m.label}</div>
                    <div style={{ fontSize: 14, color: BODY_COLOR, fontWeight: 500 }}>{m.value}</div>
                  </div>
                ))}
              </div>
            </FadeUp>

            <FadeUp delay={0.15} className="mt-10">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Stat value="9" label="User flow steps designed" />
                <Stat value="2" label="Connection paths (IP + RS-485)" />
                <Stat value="16" label="Locks per ENGAGE gateway" />
              </div>
            </FadeUp>
          </section>

          <Divider />

          {/* ══ PROBLEM ═════════════════════════════════ */}
          <section id="problem" className="scroll-mt-[72px] mb-16">
            <FadeUp>
              <SectionLabel>Problem</SectionLabel>
              <H2>Mercury-only lock support was a competitive liability</H2>
              <Body>
                Genea only supported Schlage NDE/LEB locks via Mercury controllers using RS-485 — legacy hardware that added cost and complexity. Competitors like Genetec and Avigilon Alta offered a direct IP path via Allegion&apos;s ENGAGE Gateway, which routes lock events over the network without any intermediate controller.
              </Body>
              <Body className="mt-3">
                Customers deploying new Schlage hardware were choosing competitors or adding unnecessary Mercury panels. The goal was a first-class IP integration flow that matched the ENGAGE platform&apos;s capabilities while fitting naturally into Genea&apos;s existing hardware provisioning model.
              </Body>
            </FadeUp>

            <FadeUp delay={0.1} className="mt-8">
              <div
                className="rounded-lg p-6"
                style={{ background: "rgba(200,16,46,0.04)", border: "1px solid rgba(200,16,46,0.12)" }}
              >
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12, fontFamily: MONO, textTransform: "uppercase", letterSpacing: "0.06em", background: "linear-gradient(135deg, #FF2929, #FFD029)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  The gap
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: BODY_COLOR, marginBottom: 8 }}>Before — RS-485 only</div>
                    {["Mercury controller required ($800–$2,400/unit)", "RS-485 daisy-chain wiring", "No real-time IP events", "Separate legacy provisioning flow"].map((t) => (
                      <div key={t} className="flex items-start gap-2 mb-2">
                        <span style={{ fontSize: 14, lineHeight: 1.2, background: "linear-gradient(135deg, #FF2929, #FFD029)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>×</span>
                        <span style={{ fontSize: 13, color: FADED, lineHeight: 1.5 }}>{t}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: BODY_COLOR, marginBottom: 8 }}>After — ENGAGE IP path</div>
                    {["Direct IP via ENGAGE Gateway", "No Mercury controller needed", "Real-time events over IP", "Up to 16 locks per gateway"].map((t) => (
                      <div key={t} className="flex items-start gap-2 mb-2">
                        <span style={{ color: "#3A9148", fontSize: 14, lineHeight: 1.2 }}>✓</span>
                        <span style={{ fontSize: 13, color: FADED, lineHeight: 1.5 }}>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeUp>
          </section>

          <Divider />

          {/* ══ PROCESS ══════════════════════════════════ */}
          <section id="process" className="scroll-mt-[72px] mb-16">
            <FadeUp>
              <SectionLabel>Process</SectionLabel>
              <H2>From PRD to clickable prototype in one sprint</H2>
              <Body>
                Starting from a PRD that defined 9 user-facing steps, I mapped every decision point, edge case, and integration detail before touching Figma. The prototype was built as a hi-fi click-through inside the actual Genea portal chrome — not a static mockup — so the engineering team could evaluate the flow interactively.
              </Body>
            </FadeUp>

            <FadeUp delay={0.1} className="mt-8 flex flex-col gap-5">
              <FlowStep num="01" label="Integrations page — Schlage card"
                desc="Side-by-side IP vs RS-485 paths on a single card. Install button triggers the ENGAGE auth flow." />
              <FlowStep num="02" label="ENGAGE partner authentication"
                desc="Credential modal with error states, 'no account' help flow, and a link to portal.allegionengage.com." />
              <FlowStep num="03" label="Location selection"
                desc="Multi-select list of Genea locations with search, Select All, and 'already enabled' badges." />
              <FlowStep num="04" label="Schlage integration list view"
                desc="Stats strip (locations, gateways, linked, orphaned) + location table. View ENGAGE Sites spike drawer." />
              <FlowStep num="05" label="Location detail — Locks & Gateways tabs"
                desc="Locks table with orphan highlighting, bulk selection for link-to-gateway. Gateway cards navigate to detail." />
              <FlowStep num="06" label="Add ENGAGE gateway"
                desc="Modal with Name, Description, MAC Address, Serial Number, and exclusive 'Schlage Engage Gateway' application." />
              <FlowStep num="07" label="Gateway detail — Scan Nearby Locks"
                desc="Gateway meta card + Linked Locks table. Scan Nearby Locks opens a centered modal with progress bar, RSSI signal strength, and selectable discovered locks." />
              <FlowStep num="08" label="Create door"
                desc="Create Door modal in the Hardware section with optional 'attach lock right after' checkbox." />
              <FlowStep num="09" label="Attach lock to door"
                desc="IP vs Mercury toggle, identify by serial number or select from gateway. Full door detail with feature matrix." />
            </FadeUp>
          </section>

          <Divider />

          {/* ══ PROTOTYPE ════════════════════════════════ */}
          <section id="prototype" className="scroll-mt-[72px] mb-16">
            <FadeUp>
              <SectionLabel>Interactive Prototype</SectionLabel>
              <H2>Try the full 9-step flow</H2>
              <Body>
                The prototype runs inside the real Genea portal chrome — sidebar, header, dark mode toggle, and all. Use the <strong style={{ color: BODY_COLOR }}>Tweaks</strong> panel (bottom-right corner) to jump to any step or seed realistic demo data.
              </Body>
            </FadeUp>

            <FadeUp delay={0.1} className="mt-6">
              <div className="flex flex-col gap-3 mb-5">
                <HintBar>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2271EA" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                  <span>Start at <strong style={{ color: BODY_COLOR }}>Step 1 · Card</strong> and click <strong style={{ color: BODY_COLOR }}>Install</strong> to walk through the full flow — or use <strong style={{ color: BODY_COLOR }}>Seed demo data</strong> in Tweaks to jump straight into a live integration.</span>
                </HintBar>
                <HintBar>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2271EA" strokeWidth="2" strokeLinecap="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 8v4l3 3"/></svg>
                  <span>Try the avatar → <strong style={{ color: BODY_COLOR }}>Theme → Dark</strong> to see the full dark mode implementation.</span>
                </HintBar>
              </div>
            </FadeUp>

            <FadeUp delay={0.15}>
              {/* Browser chrome */}
              <motion.div
                className="rounded-xl overflow-hidden"
                style={{ border: `1px solid ${BORDER}`, boxShadow: "0 4px 32px rgba(50,64,79,0.10)" }}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-5%" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Fake browser bar */}
                <div className="flex items-center gap-1.5 px-4 py-2.5" style={{ background: "#1e2433" }}>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ffbd2e" }} />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#28c840" }} />
                  <div className="ml-3 rounded px-3 py-0.5" style={{ background: "#2a3245" }}>
                    <span style={{ fontFamily: MONO, fontSize: 10, color: "#6b7799" }}>
                      genea.com/integrations/schlage
                    </span>
                  </div>
                </div>
                {/* Prototype iframe */}
                <iframe
                  src="/prototypes/schlage-ip/index.html"
                  title="Schlage ENGAGE IP Integration — Interactive Prototype"
                  style={{
                    width: "100%",
                    height: 680,
                    border: "none",
                    display: "block",
                  }}
                  allow="same-origin"
                />
              </motion.div>
              <p style={{ fontSize: 12, color: FADED, marginTop: 10, fontFamily: MONO }}>
                Hi-fi prototype · Genea portal chrome · Light + Dark themes · All 9 steps interactive
              </p>
            </FadeUp>
          </section>

          <Divider />

          {/* ══ REFLECTION ══════════════════════════════ */}
          <section id="reflection" className="scroll-mt-[72px] mb-16">
            <FadeUp>
              <SectionLabel>Reflection</SectionLabel>
              <H2>Designing for two audiences at once</H2>
              <Body>
                The hardest part wasn&apos;t the 9-step flow — it was the dual-path framing on the Integrations card. I needed to honestly communicate &quot;use this if ENGAGE Gateway, use Hardware if Mercury&quot; without making either path feel second-class. The side-by-side layout with the RECOMMENDED pill on the IP path tested well internally.
              </Body>
              <Body className="mt-3">
                Building the prototype in the actual Genea portal chrome (sidebar, header, real tokens, dark mode) compressed the engineering handoff significantly. The team could QA interactions directly rather than decoding static specs — a pattern I&apos;ll carry into future features.
              </Body>
              <Body className="mt-3">
                The ENGAGE Sites spike drawer — originally just a view for location-to-site mappings — evolved into a full implementation spike artifact with data-flow diagrams and open questions. That pivot happened mid-sprint and ended up being the most useful deliverable for the backend team.
              </Body>
            </FadeUp>

            {/* LinkedIn CTA */}
            <FadeUp delay={0.1} className="mt-10">
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
                <a
                  href="https://www.linkedin.com/in/kartikeypanchal"
                  target="_blank" rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full transition-opacity hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #FF2929, #FFD029)", color: "white", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", textDecoration: "none" }}
                >
                  Reach out on LinkedIn
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
                </a>
              </motion.div>
            </FadeUp>
          </section>

        </div>
      </div>
    </div>
    </div>
  );
}
