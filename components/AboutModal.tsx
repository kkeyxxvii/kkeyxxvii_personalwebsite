"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useChatContext } from "./ChatContext";

/* ── Tokens (mirror isabelshic.com exactly) ─────────────── */
const MONO    = "var(--font-ibm-mono,'IBM Plex Mono',monospace)";
const DISPLAY = "var(--font-nunito,'Nunito',sans-serif)";
const SERIF   = "'Source Serif 4',Georgia,serif";
const BODY    = "var(--font-inter,'Inter',sans-serif)";

const C = {
  black:  "#181617",
  gray1:  "#606060",
  gray2:  "#888888",
  gray3:  "#ededed",
  gray4:  "#f6f6f6",
  white:  "#ffffff",
};

/* ── Experience timeline ────────────────────────────────── */
const TIMELINE = [
  { date: "2022 — Now",  org: "Genea",                       role: "Senior Product Designer"  },
  { date: "2020 — 2022", org: "Ripple Design",               role: "Senior UI/UX Designer"    },
  { date: "2018 — 2020", org: "TriCore InfoTech",            role: "UI / UX Designer"         },
  { date: "2017 — 2018", org: "DesignNBuy",                  role: "Graphic Designer"         },
  { date: "2016 — 2017", org: "Mangalam IT",                 role: "Associate"                },
  { date: "2012 — 2015", org: "Gujarat Technological Uni.", role: "Computer Engineering",    edu: true },
];

/* ── Bio — level+years, then companies, then what the work proves,
      then what's next. Four lines, in the order reviewers read them. ── */
const BIO = [
  "Senior Product Designer, 9 years in enterprise SaaS and security.",
  "At Genea since 2022, designing access control software trusted by enterprise teams across North America. Previously Ripple Design, TriCore InfoTech, DesignNBuy.",
  "I take high-stakes operational workflows — access control, compliance, analytics — and make them safe to run at speed. Recent work cut misconfiguration errors 62% and support tickets 34%.",
  "Looking for senior and staff product design roles at AI-forward product companies.",
];

/* ── Capability areas ───────────────────────────────────── */
const CAPABILITIES: { label: string; sub: string }[] = [
  { label: "UX Craft",         sub: "Interaction · Systems · A11y"  },
  { label: "Systems Thinking", sub: "SaaS · IA · Product Strategy"  },
  { label: "Human × AI",       sub: "Prompts · Workflows · Tools"   },
  { label: "Design Ops",       sub: "Process · Collab · Scale"      },
];

/* ── At a Glance ────────────────────────────────────────── */
const GLANCE = [
  { value: "9+", label: "Years"       },
  { value: "5",  label: "Companies"   },
  { value: "3",  label: "Disciplines" },
];

/* ── Known For ──────────────────────────────────────────── */
const KNOWN_FOR = [
  "Simplifying complex enterprise workflows",
  "Building scalable design systems",
  "Bridging design and engineering",
  "Improving design operations",
  "Shipping practical AI-powered solutions",
  "Turning ambiguity into direction",
];

/* ── Icons ──────────────────────────────────────────────── */
const IconClose = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);
const IconExpand = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" />
  </svg>
);
const IconCollapse = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3" />
  </svg>
);
const IconDot = () => (
  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#3ad759", display: "inline-block", flexShrink: 0 }} />
);

/* ── Viewport hook — this modal is styled inline, so breakpoints
      have to come from JS rather than CSS media queries. ─────── */
function useIsNarrow(query = "(max-width: 760px)") {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    setNarrow(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setNarrow(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return narrow;
}

/* ── Ctrl button (circle) ───────────────────────────────── */
function CtrlBtn({ onClick, label, children }: { onClick: () => void; label: string; children: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      aria-label={label}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 48, height: 48, borderRadius: 999, border: "0.5px solid rgba(24,22,23,0.08)",
        background: hov ? "rgba(24,22,23,0.08)" : "rgba(24,22,23,0.04)",
        backdropFilter: "blur(12px) saturate(160%)",
        WebkitBackdropFilter: "blur(12px) saturate(160%)" as any,
        cursor: "pointer", display: "grid", placeItems: "center",
        color: C.black, transition: "background .18s ease",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

/* ── Sidebar ────────────────────────────────────────────── */
function Sidebar({ narrow = false }: { narrow?: boolean }) {
  return (
    <aside
      style={{
        width:         narrow ? "100%" : 101,
        flexShrink:    0,
        display:       "flex",
        flexDirection: "column",
        gap:           narrow ? 16 : 20,
      }}
    >
      {/* Portrait — sits beside the name on narrow screens */}
      <div
        style={{
          display:       "flex",
          flexDirection: narrow ? "row" : "column",
          alignItems:    narrow ? "center" : "stretch",
          gap:           narrow ? 14 : 8,
        }}
      >
        <div style={{ position: "relative", width: narrow ? 72 : 101, height: narrow ? 72 : 101, flexShrink: 0, borderRadius: 12, overflow: "hidden", background: C.gray4 }}>
          <Image src="/about/about1.png" alt="Kartikey Panchal" fill style={{ objectFit: "cover", objectPosition: "center top" }} sizes={narrow ? "72px" : "101px"} />
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ margin: 0, fontFamily: DISPLAY, fontSize: 13, fontWeight: 400, color: C.black, lineHeight: 1.35 }}>
            Kartikey Panchal<br />
            <span style={{ color: C.gray1, fontWeight: 300, fontSize: 12 }}>Senior Product Designer</span><br />
            <span style={{ color: C.gray2, fontWeight: 300, fontSize: 11 }}>Enterprise SaaS · Human × AI</span>
          </p>
        </div>
      </div>

      {/* Capability areas — labels wrap rather than truncate */}
      <div style={{ display: "flex", flexDirection: "column", gap: narrow ? 8 : 10 }}>
        <p style={{ margin: 0, fontFamily: MONO, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: C.gray2 }}>
          Focus
        </p>
        <div style={{ display: "flex", flexDirection: narrow ? "row" : "column", flexWrap: narrow ? "wrap" : "nowrap", gap: narrow ? 6 : 10 }}>
          {CAPABILITIES.map(({ label, sub }) => (
            <div
              key={label}
              style={
                narrow
                  ? {
                      padding:      "4px 10px",
                      borderRadius: 999,
                      border:       `0.5px solid ${C.gray3}`,
                      background:   C.gray4,
                    }
                  : { minWidth: 0 }
              }
            >
              <p style={{ margin: 0, fontFamily: MONO, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", color: C.black, lineHeight: 1.4, whiteSpace: "nowrap" }}>
                {label}
              </p>
              {!narrow && (
                <p style={{ margin: "2px 0 0", fontFamily: BODY, fontSize: 11, fontWeight: 300, color: C.gray2, lineHeight: 1.4 }}>
                  {sub}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

/* ── Body (shared between modal + expanded) ─────────────── */
function AboutBody({ size = "modal", narrow = false }: { size?: "modal" | "expanded"; narrow?: boolean }) {
  const headlineSize = size === "expanded" ? 24 : 20;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: size === "expanded" ? 30 : 24 }}>

      {/* Header: label + headline */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <IconDot />
          <span style={{ fontFamily: MONO, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", color: C.gray1 }}>
            Available for work
          </span>
        </div>
        <h2 style={{
          margin: 0,
          fontFamily: DISPLAY,
          fontSize: headlineSize,
          fontWeight: 400,
          color: C.black,
          lineHeight: 1.2,
        }}>
          I design enterprise software that feels{" "}
          <em style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            textDecoration: "underline",
            textDecorationColor: C.gray2,
            textDecorationThickness: 1,
            textUnderlineOffset: 2,
          }}>
            inevitable
          </em>{" "}
          — Human × AI.
        </h2>

        {/* Supporting statement */}
        <p style={{ margin: 0, fontFamily: MONO, fontSize: 11, letterSpacing: "0.08em", color: C.gray2, textTransform: "uppercase" }}>
          Human judgment. AI acceleration. Better products.
        </p>
      </div>

      {/* Grid: bio copy (left) | timeline (right) */}
      <div style={{
        display: "grid",
        gridTemplateColumns: narrow ? "minmax(0,1fr)" : "minmax(0,1.35fr) minmax(0,.65fr)",
        gap: narrow ? 28 : 16,
      }}>
        {/* Left: bio */}
        <div style={{ fontFamily: DISPLAY, fontSize: 16, fontWeight: 300, color: C.gray1, paddingRight: narrow ? 0 : 16 }}>
          {BIO.map((p, i) => (
            <p key={i} style={{ margin: 0, marginBottom: i < BIO.length - 1 ? 20 : 0, lineHeight: 1.45 }}>{p}</p>
          ))}
        </div>

        {/* Right: timeline + contacts */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0, minHeight: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {TIMELINE.map(({ date, org, role, edu }, i) => (
              <div
                key={i}
                style={{
                  borderBottom: `1px solid ${C.gray3}`,
                  paddingBottom: 14,
                  display: "flex",
                  flexDirection: size === "expanded" || narrow ? "row" : "column",
                  justifyContent: size === "expanded" || narrow ? "space-between" : undefined,
                  alignItems: narrow ? "baseline" : undefined,
                  flexWrap: narrow ? "wrap" : undefined,
                  gap: 4,
                  marginTop: edu ? 32 : 0,
                  minWidth: 0,
                }}
              >
                <span style={{ fontFamily: MONO, fontSize: 12, textTransform: "uppercase", color: C.gray1 }}>{date}</span>
                <p style={{
                  margin: 0,
                  fontFamily: DISPLAY,
                  fontSize: 16,
                  fontWeight: 300,
                  color: C.black,
                  lineHeight: 1.2,
                  whiteSpace: size === "modal" && !narrow ? "nowrap" : undefined,
                  overflow: size === "modal" && !narrow ? "hidden" : undefined,
                  textOverflow: size === "modal" && !narrow ? "ellipsis" : undefined,
                }}>
                  {org}{" "}
                  <span style={{ color: C.gray2, fontFamily: DISPLAY, fontSize: "inherit", fontWeight: "inherit" }}>
                    / {role}
                  </span>
                </p>
              </div>
            ))}
          </div>

          {/* Contacts — location included; 66% of reviewers look for it */}
          <div style={{ marginTop: narrow ? 24 : 32, display: "flex", flexDirection: "column", gap: 2 }}>
            <p style={{ margin: "0 0 6px", fontFamily: DISPLAY, fontSize: 12, fontWeight: 300, color: C.gray1 }}>
              Ahmedabad, India · GMT+5:30 · open to remote
            </p>
            <Link href="mailto:kkeyxxvii@gmail.com"
              style={{ fontFamily: DISPLAY, fontSize: 12, fontWeight: 300, color: C.gray2, textDecorationThickness: "0.5px", textUnderlineOffset: 2 }}>
              kkeyxxvii@gmail.com
            </Link>
            <Link href="https://linkedin.com/in/kkeyxxvii" target="_blank" rel="noreferrer"
              style={{ fontFamily: DISPLAY, fontSize: 12, fontWeight: 300, color: C.gray2, textDecorationThickness: "0.5px", textUnderlineOffset: 2 }}>
              linkedin.com/in/kkeyxxvii
            </Link>
          </div>
        </div>
      </div>

      {/* ── At a Glance ──────────────────────────────── */}
      <div style={{ display: "flex", gap: 24, paddingTop: 4, borderTop: `1px solid ${C.gray3}` }}>
        {GLANCE.map(({ value, label }) => (
          <div key={label}>
            <p style={{ margin: 0, fontFamily: DISPLAY, fontSize: size === "expanded" ? 22 : 18, fontWeight: 300, color: C.black, lineHeight: 1 }}>{value}</p>
            <p style={{ margin: "3px 0 0", fontFamily: MONO, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: C.gray2 }}>{label}</p>
          </div>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
          <span style={{ fontFamily: MONO, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: C.gray2 }}>
            Enterprise SaaS · Security · Fintech
          </span>
        </div>
      </div>

      {/* ── Known For ────────────────────────────────── */}
      <div>
        <p style={{ margin: "0 0 10px", fontFamily: MONO, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: C.gray2 }}>
          Known For
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {KNOWN_FOR.map((item) => (
            <span key={item} style={{
              fontFamily: DISPLAY, fontSize: 12, fontWeight: 300,
              color: C.gray1,
              padding: "4px 10px",
              borderRadius: 999,
              border: `0.5px solid ${C.gray3}`,
              background: C.gray4,
            }}>
              {item}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}

/* ════════════════════════════════════════════════════════════ */
export default function AboutModal() {
  const { aboutOpen, closeAbout } = useChatContext();
  const [expanded, setExpanded] = useState(false);
  const narrow = useIsNarrow();

  /* Lock scroll */
  useEffect(() => {
    document.body.style.overflow = aboutOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [aboutOpen]);

  /* Escape key */
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") { expanded ? setExpanded(false) : closeAbout(); } };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [closeAbout, expanded]);

  /* Reset expanded state when modal closes */
  useEffect(() => { if (!aboutOpen) setExpanded(false); }, [aboutOpen]);

  return (
    <AnimatePresence>
      {aboutOpen && (
        <>
          {expanded ? (
            /* ── EXPANDED — fullscreen ──────────────────── */
            <motion.div
              key="about-expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.26, ease: "easeOut" }}
              style={{
                position: "fixed", inset: 0, background: "#f5f5f7",
                zIndex: 1000, overflowY: "auto",
              }}
            >
              {/* Sticky nav */}
              <div style={{
                position: "sticky", top: 0, zIndex: 2,
                background: "rgba(245,245,247,0.82)",
                backdropFilter: "blur(24px) saturate(180%)",
                WebkitBackdropFilter: "blur(24px) saturate(180%)",
                borderBottom: "0.5px solid rgba(24,22,23,0.08)",
                display: "grid",
                gridTemplateColumns: narrow ? "minmax(0,1fr) auto" : "minmax(0,1fr) auto minmax(0,1fr)",
                alignItems: "center",
                gap: 12,
                padding: narrow ? "10px 18px" : "12px 42px",
              }}>
                <div style={{ fontFamily: MONO, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: C.gray2, display: "flex", alignItems: "center", gap: 8 }}>
                  <button onClick={closeAbout}
                    style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "inherit", letterSpacing: "inherit", textTransform: "inherit", color: C.gray2, padding: 0, transition: "color .22s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = C.black)}
                    onMouseLeave={e => (e.currentTarget.style.color = C.gray2)}
                  >Work</button>
                  <span>/</span>
                  <span style={{ color: C.black }}>About</span>
                </div>
                {!narrow && (
                  <div style={{ justifySelf: "center", fontFamily: MONO, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: C.gray2 }}>
                    Kartikey Panchal
                  </div>
                )}
                <div style={{ justifySelf: "end", display: "flex", gap: 12 }}>
                  <CtrlBtn onClick={() => setExpanded(false)} label="Collapse">
                    <IconCollapse />
                  </CtrlBtn>
                  <CtrlBtn onClick={closeAbout} label="Close about">
                    <IconClose />
                  </CtrlBtn>
                </div>
              </div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.52, ease: [0.2, 0.9, 0.25, 1] }}
                style={{
                  width: narrow ? "100%" : "80%", maxWidth: 1400, margin: "0 auto",
                  padding: narrow ? "20px 18px 56px" : "24px 0 64px",
                  display: "flex", flexDirection: "column", gap: 24,
                }}
              >
                <div style={{
                  display: "grid",
                  gridTemplateColumns: narrow ? "minmax(0,1fr)" : "101px minmax(0,1fr)",
                  gap: narrow ? 28 : 36,
                  minHeight: narrow ? undefined : "calc(100vh - 170px)",
                }}>
                  <Sidebar narrow={narrow} />
                  <AboutBody size="expanded" narrow={narrow} />
                </div>
              </motion.div>
            </motion.div>
          ) : (
            /* ── MODAL — centered dialog ────────────────── */
            <motion.div
              key="about-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.26, ease: "easeOut" }}
              role="presentation"
              onClick={closeAbout}
              style={{
                position: "fixed", inset: 0, zIndex: 999,
                display: "grid", placeItems: "center",
                background: "rgba(0,0,0,0.18)",
                backdropFilter: "blur(24px) saturate(160%)",
                WebkitBackdropFilter: "blur(24px) saturate(160%)",
                padding: 20,
              }}
            >
              <motion.section
                key="about-modal"
                role="dialog"
                aria-modal="true"
                aria-label="About Kartikey Panchal"
                onClick={e => e.stopPropagation()}
                initial={{ opacity: 0, y: 8, scale: 0.995 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.997 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  width: "min(1024px, 96vw)",
                  maxHeight: "92vh",
                  overflowY: "auto",
                  borderRadius: 24,
                  background: "rgba(255,255,255,0.92)",
                  backdropFilter: "blur(48px) saturate(180%)",
                  WebkitBackdropFilter: "blur(48px) saturate(180%)",
                  border: "0.5px solid rgba(255,255,255,0.8)",
                  boxShadow: "0 32px 80px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(24,22,23,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
                  padding: narrow ? "56px 20px 28px" : 56,
                  position: "relative",
                }}
              >
                {/* Controls — absolute top-right */}
                <div style={{ position: "absolute", top: narrow ? 12 : 20, right: narrow ? 14 : 22, display: "flex", gap: narrow ? 8 : 12, zIndex: 3 }}>
                  {!narrow && (
                    <CtrlBtn onClick={() => setExpanded(true)} label="Expand to full screen">
                      <IconExpand />
                    </CtrlBtn>
                  )}
                  <CtrlBtn onClick={closeAbout} label="Close about">
                    <IconClose />
                  </CtrlBtn>
                </div>

                {/* Layout: sidebar | content — stacks on narrow screens */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: narrow ? "minmax(0,1fr)" : "101px minmax(0,1fr)",
                  gap: narrow ? 28 : 36,
                }}>
                  <Sidebar narrow={narrow} />
                  <AboutBody size="modal" narrow={narrow} />
                </div>
              </motion.section>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
