"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useChatContext } from "./ChatContext";
import { PANEL_WIDTH, EASE, DURATION } from "@/lib/panelConstants";

const navLinks = [
  { label: "Work",   path: "/",                            external: false },
  { label: "Fun",    path: "/fun",                         external: false },
  { label: "Resume", path: "/Kartikey_Panchal_Resume.pdf", external: true  },
];

const MONO = "var(--font-ibm-mono, var(--font-geist-mono), monospace)";
const EASE_NAV = "cubic-bezier(0.12,0.9,0.2,1)";

/* Diagonal arrow — same vibe as isabelshic */
const ArrowIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
    <path d="M7 17L17 7M17 7H7M17 7v10" />
  </svg>
);

const StarIcon = ({ size = 11 }: { size?: number }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24" fill="none"
    aria-hidden="true"
    style={{ animation: "starSpin 5s linear infinite", display: "block", flexShrink: 0 }}
  >
    <path d="M6.5 13L7.28 14.57C7.55 15.1 7.68 15.37 7.86 15.6C8.02 15.8 8.2 15.98 8.4 16.14C8.63 16.32 8.9 16.45 9.43 16.72L11 17.5L9.43 18.28C8.9 18.55 8.63 18.68 8.4 18.86C8.2 19.02 8.02 19.2 7.86 19.4C7.68 19.63 7.55 19.9 7.28 20.43L6.5 22L5.72 20.43C5.45 19.9 5.32 19.63 5.14 19.4C4.98 19.2 4.8 19.02 4.6 18.86C4.36 18.68 4.1 18.55 3.57 18.28L2 17.5L3.57 16.72C4.1 16.45 4.36 16.32 4.6 16.14C4.8 15.98 4.98 15.8 5.14 15.6C5.32 15.37 5.45 15.1 5.72 14.57L6.5 13Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 2L16.18 5.06C16.46 5.8 16.6 6.16 16.82 6.47C17.02 6.75 17.25 6.98 17.53 7.18C17.84 7.4 18.2 7.54 18.94 7.82L22 9L18.94 10.18C18.2 10.46 17.84 10.6 17.53 10.82C17.25 11.02 17.01 11.25 16.82 11.53C16.6 11.84 16.46 12.2 16.18 12.94L15 16L13.82 12.94C13.54 12.2 13.4 11.84 13.18 11.53C12.98 11.25 12.75 11.02 12.47 10.82C12.16 10.6 11.8 10.46 11.06 10.18L8 9L11.06 7.82C11.8 7.54 12.16 7.4 12.47 7.18C12.75 6.98 12.98 6.75 13.18 6.47C13.4 6.16 13.54 5.8 13.82 5.06L15 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* Pin / location icon */
const PinIcon = () => (
  <svg width="9" height="11" viewBox="0 0 24 28" fill="none" stroke="currentColor"
    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true" style={{ display: "block", flexShrink: 0 }}
  >
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

/* Rotating status pill — cycles between "Status Available" and "Based In Ahmedabad, India" */
const STATUS_ITEMS = [
  { type: "dot", parts: [{ text: "Status  ", hi: false }, { text: "Available", hi: true  }] },
  { type: "pin", parts: [{ text: "Based In ", hi: false }, { text: "Ahmedabad, India", hi: true }] },
] as const;

function StatusPill() {
  const [idx,     setIdx]     = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % STATUS_ITEMS.length);
        setVisible(true);
      }, 280);
    }, 3600);
    return () => clearInterval(id);
  }, []);

  const item = STATUS_ITEMS[idx];

  return (
    <div
      style={{
        display:               "inline-flex",
        alignItems:            "center",
        gap:                   6,
        padding:               "8px 14px",
        borderRadius:          999,
        background:            "rgba(24,22,23,0.05)",
        backdropFilter:        "blur(12px) saturate(160%)",
        WebkitBackdropFilter:  "blur(12px) saturate(160%)",
        border:                "0.5px solid rgba(24,22,23,0.07)",
        boxShadow:             "0 1px 4px rgba(0,0,0,0.04)",
        fontFamily:            MONO,
        fontSize:              12,
        letterSpacing:         "0.12em",
        textTransform:         "uppercase" as const,
        whiteSpace:            "nowrap" as const,
        overflow:              "hidden",
        minWidth:              0,
      }}
    >
      {/* Icon — fades with content */}
      <span
        style={{
          display:    "flex",
          alignItems: "center",
          flexShrink: 0,
          opacity:    visible ? 1 : 0,
          transition: "opacity .24s ease",
          color:      item.type === "dot" ? "#3ad759" : "#606060",
        }}
      >
        {item.type === "dot" ? (
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3ad759", display: "block" }} />
        ) : (
          <PinIcon />
        )}
      </span>

      {/* Label — fades + slides vertically; highlighted word in #181617 */}
      <span
        style={{
          opacity:    visible ? 1 : 0,
          transform:  visible ? "translateY(0)" : "translateY(-5px)",
          transition: visible
            ? "opacity .3s ease .05s, transform .32s cubic-bezier(.12,.9,.2,1) .05s"
            : "opacity .22s ease, transform .24s cubic-bezier(.45,0,.2,1)",
        }}
      >
        {item.parts.map((p, i) => (
          <span key={i} style={{ color: p.hi ? "#181617" : "#606060" }}>{p.text}</span>
        ))}
      </span>
    </div>
  );
}

/* NavBtn — each nav link with the isabelshic arrow slide-in effect */
function NavBtn({
  href, external, active, children, onClick,
}: {
  href: string; external?: boolean; active?: boolean;
  children: React.ReactNode; onClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const showBg    = hovered || active;   // pill bg + dark text on hover OR active
  const showArrow = hovered;             // arrow only on hover, never on active-only

  const inner = (
    <span
      style={{
        display:      "inline-flex",
        alignItems:   "center",
        gap:          showArrow ? 8 : 0,
        padding:      showBg ? (showArrow ? "8px 14px 8px 10px" : "8px 14px") : "5px 2px",
        borderRadius:          999,
        background:            showBg ? "rgba(24,22,23,0.05)" : "transparent",
        backdropFilter:        showBg ? "blur(12px) saturate(160%)" : "none",
        WebkitBackdropFilter:  showBg ? "blur(12px) saturate(160%)" : "none",
        border:                showBg ? "0.5px solid rgba(24,22,23,0.07)" : "0.5px solid transparent",
        boxShadow:             showBg ? "0 1px 4px rgba(0,0,0,0.04)" : "none",
        transition:   `background .55s ${EASE_NAV}, padding .55s ${EASE_NAV}, gap .55s ${EASE_NAV}`,
      }}
    >
      {/* Arrow — hidden at rest, slides in on hover only */}
      <span
        style={{
          display:    "flex",
          alignItems: "center",
          overflow:   "hidden",
          width:      showArrow ? 22 : 0,
          opacity:    showArrow ? 1 : 0,
          transform:  showArrow ? "translateX(0)" : "translateX(-3px)",
          transition: `width .55s ${EASE_NAV}, opacity .48s cubic-bezier(.2,.85,.3,1) .06s, transform .55s ${EASE_NAV}`,
          flexShrink: 0,
          color:      "#888888",
        }}
      >
        <ArrowIcon />
      </span>

      {/* Label */}
      <span
        style={{
          fontFamily:    MONO,
          fontSize:      12,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          whiteSpace:    "nowrap",
          color:         showBg ? "#181617" : "#888888",
          transition:    `color .42s ${EASE_NAV}`,
        }}
      >
        {children}
      </span>
    </span>
  );

  if (href.startsWith("mailto") || href === "#") {
    return (
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ border: 0, background: "transparent", padding: 0, cursor: "pointer" }}
      >
        {inner}
      </button>
    );
  }

  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ textDecoration: "none" }}
    >
      {inner}
    </Link>
  );
}

/* Close × icon */
const CloseIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
    style={{ display: "block", flexShrink: 0 }}
    aria-hidden="true"
  >
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

/* KkeyBtn — AI-agent chip
   – closed (idle)  : gradient-ring pill · ★ spinning · "KKEYXXVIIAI" · pulsing glow
   – closed (hover) : gradient-ring pill · → + ★      · "KKEYXXVIIAI"
   – open           : red-ring pill      · ✕           · "Close"
*/
function KkeyBtn({ chatOpen, onClick }: { chatOpen: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  const showArrow = hovered && !chatOpen;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={chatOpen ? "Close panel" : "Open KKEYXXVIIAI"}
      style={{ border: 0, background: "transparent", padding: 0, cursor: "pointer" }}
    >
      {/* ── Gradient ring ─────────────────────────────── */}
      <span
        className={chatOpen ? "kkey-ring-open" : "kkey-ring"}
        style={{
          display:      "inline-flex",
          borderRadius: 999,
          padding:      "1px",
        }}
      >
        {/* ── Inner frosted pill ────────────────────── */}
        <span
          style={{
            display:               "inline-flex",
            alignItems:            "center",
            gap:                   showArrow ? 8 : 5,
            padding:               "7px 13px 7px 9px",
            borderRadius:          999,
            background:            hovered
              ? "rgba(255,255,255,0.96)"
              : "rgba(255,255,255,0.90)",
            backdropFilter:        "blur(14px) saturate(180%)",
            WebkitBackdropFilter:  "blur(14px) saturate(180%)",
            transition:            `gap .55s ${EASE_NAV}, background .25s ease`,
          }}
        >
          {/* Arrow — slides in on hover */}
          <span
            style={{
              display:    "flex",
              alignItems: "center",
              overflow:   "hidden",
              width:      showArrow ? 22 : 0,
              opacity:    showArrow ? 1 : 0,
              transform:  showArrow ? "translateX(0)" : "translateX(-3px)",
              transition: `width .55s ${EASE_NAV}, opacity .48s cubic-bezier(.2,.85,.3,1) .06s, transform .55s ${EASE_NAV}`,
              flexShrink: 0,
              color:      "#888888",
            }}
          >
            <ArrowIcon />
          </span>

          {/* Icon + label */}
          <span
            style={{
              display:       "inline-flex",
              alignItems:    "center",
              gap:           5,
              fontFamily:    MONO,
              fontSize:      12,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              whiteSpace:    "nowrap",
              color:         "#181617",
            }}
          >
            {/* Icon — always visible, star or × */}
            <span style={{ display: "flex", alignItems: "center", flexShrink: 0, width: 11 }}>
              {chatOpen ? <CloseIcon /> : <StarIcon />}
            </span>

            {/* Label — fades between KKEYXXVIIAI ↔ Close */}
            <span style={{ position: "relative", display: "inline-block" }}>
              <span
                style={{
                  display:       "block",
                  opacity:       chatOpen ? 0 : 1,
                  transform:     chatOpen ? "translateY(-4px)" : "translateY(0)",
                  transition:    `opacity .22s ease, transform .28s ${EASE_NAV}`,
                  pointerEvents: "none",
                }}
              >
                KKEYXXVIIAI
              </span>
              <span
                style={{
                  position:      "absolute",
                  inset:         0,
                  display:       "flex",
                  alignItems:    "center",
                  opacity:       chatOpen ? 1 : 0,
                  transform:     chatOpen ? "translateY(0)" : "translateY(4px)",
                  transition:    `opacity .22s ease .1s, transform .28s ${EASE_NAV} .1s`,
                  pointerEvents: "none",
                }}
              >
                Close
              </span>
            </span>
          </span>
        </span>
      </span>
    </button>
  );
}

export default function Navbar() {
  const pathname    = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const { open: chatOpen, openChat, closeChat, aboutOpen, openAbout, closeAbout } = useChatContext();

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" || pathname.startsWith("/projects") : pathname === path;

  const handleOpenChat  = () => { openChat();  setMenuOpen(false); };
  const handleOpenAbout = () => { openAbout(); setMenuOpen(false); };

  return (
    <>
      <nav
        className="fixed top-0 left-0 z-50 glass-nav"
        style={{ right: chatOpen && isDesktop ? `${PANEL_WIDTH}px` : 0, transition: `right ${DURATION} ${EASE}` }}
      >

        {/* ── Desktop ──────────────────────────────── */}
        <div
          className="hidden md:grid items-center px-[42px] py-[10px]"
          style={{ gridTemplateColumns: "minmax(0,1fr) auto minmax(0,1fr)" }}
        >
          {/* LEFT — brand + inline subtitle */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <NavBtn href="https://www.linkedin.com/in/kartikeypanchal" external={true}>
              <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: "0.12em", color: "#181617", fontWeight: 500 }}>
                Kartikey Panchal
              </span>
            </NavBtn>
            <span style={{
              fontFamily:    MONO,
              fontSize:      12,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color:         "#888888",
              whiteSpace:    "nowrap",
            }}>
              Product Designer · Human × AI
            </span>
          </div>

          {/* CENTER — nav links */}
          <div className="flex items-center gap-3">
            {navLinks.map((l) => (
              <NavBtn key={l.path} href={l.path} external={l.external} active={isActive(l.path)}>
                {l.label}
              </NavBtn>
            ))}
            {/* About — opens fullscreen modal */}
            <NavBtn href="#" onClick={handleOpenAbout} active={aboutOpen}>
              About
            </NavBtn>
          </div>

          {/* RIGHT — Available pill + KKEYXXVIIAI */}
          <div className="flex items-center justify-end gap-2">

            {/* Rotating status pill */}
            <StatusPill />

            {/* KKEYXXVIIAI — icon only on hover / active */}
            <KkeyBtn
              chatOpen={chatOpen}
              onClick={chatOpen ? closeChat : handleOpenChat}
            />
          </div>
        </div>

        {/* ── Mobile header ────────────────────────── */}
        <div className="flex md:hidden items-center justify-between px-5 py-[13px]">
          <Link href="https://www.linkedin.com/in/kartikeypanchal" target="_blank" rel="noopener noreferrer">
            <span style={{
              fontFamily: MONO, fontSize: 12, letterSpacing: "0.12em",
              color: "#181617", fontWeight: 500,
              textTransform: "uppercase",
            }}>
              Kartikey Panchal
            </span>
          </Link>

          {/* Hamburger → ✕ icon */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
            style={{
              width: 32, height: 32, padding: 6,
              display: "flex", flexDirection: "column", justifyContent: "center", gap: 5,
              background: "none", border: "none", cursor: "pointer",
            }}
          >
            <span style={{
              display: "block", width: 20, height: 1.5,
              background: "#181617", borderRadius: 1,
              transformOrigin: "center",
              transition: "transform 0.24s cubic-bezier(0.4,0,0.2,1)",
              transform: menuOpen ? "translateY(6.5px) rotate(45deg)" : "translateY(0) rotate(0deg)",
            }} />
            <span style={{
              display: "block", width: 20, height: 1.5,
              background: "#181617", borderRadius: 1,
              transition: "opacity 0.2s ease, transform 0.24s ease",
              opacity: menuOpen ? 0 : 1,
              transform: menuOpen ? "scaleX(0)" : "scaleX(1)",
            }} />
            <span style={{
              display: "block", width: 20, height: 1.5,
              background: "#181617", borderRadius: 1,
              transformOrigin: "center",
              transition: "transform 0.24s cubic-bezier(0.4,0,0.2,1)",
              transform: menuOpen ? "translateY(-6.5px) rotate(-45deg)" : "translateY(0) rotate(0deg)",
            }} />
          </button>
        </div>

        {/* ── Mobile drawer ────────────────────────── */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
          <div
            className="px-5 pb-8 pt-3 flex flex-col gap-4 border-t border-[rgba(24,22,23,0.08)]"
            style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(24px) saturate(180%)", WebkitBackdropFilter: "blur(24px) saturate(180%)" } as React.CSSProperties}
          >
            {/* Nav links — left-aligned */}
            <nav className="flex flex-col gap-1 pt-1">
              {[...navLinks.map(l => ({ ...l, label: l.label })), { label: "About", path: "#", external: false }].map((l) => {
                const active = l.path === "#" ? aboutOpen : isActive(l.path);
                const handleClick = () => {
                  setMenuOpen(false);
                  if (l.path === "#") handleOpenAbout();
                };
                return (
                  l.path === "#" ? (
                    <button
                      key="about"
                      onClick={handleClick}
                      style={{
                        display: "block", width: "100%", textAlign: "left",
                        padding: "10px 0",
                        fontFamily: MONO, fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase" as const,
                        color: active ? "#181617" : "rgba(24,22,23,0.45)",
                        fontWeight: active ? 500 : 400,
                        background: "none", border: "none", cursor: "pointer",
                        borderBottom: "0.5px solid rgba(24,22,23,0.06)",
                      }}
                    >
                      {l.label}
                    </button>
                  ) : (
                    <Link
                      key={l.path}
                      href={l.path}
                      target={l.external ? "_blank" : undefined}
                      rel={l.external ? "noopener noreferrer" : undefined}
                      onClick={handleClick}
                      style={{
                        display: "block",
                        padding: "10px 0",
                        fontFamily: MONO, fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase",
                        color: active ? "#181617" : "rgba(24,22,23,0.45)",
                        fontWeight: active ? 500 : 400,
                        textDecoration: "none",
                        borderBottom: "0.5px solid rgba(24,22,23,0.06)",
                      }}
                    >
                      {l.label}
                    </Link>
                  )
                );
              })}
            </nav>

            {/* Status pill only */}
            <div className="pt-1">
              <StatusPill />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile FAB */}
      <button
        onClick={handleOpenChat}
        aria-label="Open KKEYXXVIIAI"
        className={`fab-kkeyxxviiai flex md:hidden items-center justify-center transition-all duration-300 ${chatOpen ? "opacity-0 scale-75 pointer-events-none" : "opacity-100 scale-100"}`}
        style={{ color: "white" }}
      >
        <span className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: "var(--gradient)" }} />
        <StarIcon size={18} />
      </button>
    </>
  );
}
