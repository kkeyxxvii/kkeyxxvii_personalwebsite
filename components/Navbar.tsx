"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useChatContext } from "./ChatContext";
import { PANEL_WIDTH, EASE, DURATION } from "@/lib/panelConstants";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowUpRight01Icon,
  SparklesIcon,
  Location01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";

const navLinks = [
  { label: "Work",   path: "/",                            external: false },
  { label: "Fun",    path: "/fun",                         external: false },
  { label: "Resume", path: "/Kartikey_Panchal_Resume.pdf", external: true  },
];

const MONO = "var(--font-ibm-mono, var(--font-geist-mono), monospace)";
const EASE_NAV = "cubic-bezier(0.12,0.9,0.2,1)";

/* Diagonal arrow — same vibe as isabelshic */
const ArrowIcon = () => (
  <HugeiconsIcon
    icon={ArrowUpRight01Icon}
    size={11}
    strokeWidth={2.2}
    aria-hidden="true"
    style={{ display: "block", flexShrink: 0 }}
  />
);

const StarIcon = ({ size = 11 }: { size?: number }) => (
  <HugeiconsIcon
    icon={SparklesIcon}
    size={size}
    strokeWidth={1.8}
    aria-hidden="true"
    style={{ animation: "starSpin 5s linear infinite", display: "block", flexShrink: 0 }}
  />
);

/* Pin / location icon */
const PinIcon = () => (
  <HugeiconsIcon
    icon={Location01Icon}
    size={11}
    strokeWidth={2}
    aria-hidden="true"
    style={{ display: "block", flexShrink: 0 }}
  />
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
      aria-current={active ? "page" : undefined}
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
  <HugeiconsIcon
    icon={Cancel01Icon}
    size={11}
    strokeWidth={2.2}
    aria-hidden="true"
    style={{ display: "block", flexShrink: 0 }}
  />
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
    /* Matches the lg: breakpoint the nav and FAB switch at, so the
       push layout only engages once there is room beside a 420px panel. */
    const mq = window.matchMedia("(min-width: 1024px)");
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
          className="hidden lg:grid items-center px-6 xl:px-[42px] py-[10px]"
          style={{ gridTemplateColumns: "minmax(0,1fr) auto minmax(0,1fr)" }}
        >
          {/* LEFT — brand + inline subtitle. Brand goes home (convention). */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <NavBtn href="/">
              <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: "0.12em", color: "#181617", fontWeight: 500 }}>
                Kartikey Panchal
              </span>
            </NavBtn>
            {/* Secondary to the name and the nav; shown only once the row is
                wide enough to hold it without crowding the links. */}
            <span
              className="hidden xl:inline"
              style={{
                fontFamily:    MONO,
                fontSize:      12,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color:         "#888888",
                whiteSpace:    "nowrap",
              }}
            >
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
        <div className="flex lg:hidden items-center justify-between px-5 py-[13px]">
          <Link href="/" onClick={() => setMenuOpen(false)}>
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
            aria-expanded={menuOpen}
            style={{
              width: 44, height: 44, padding: 12,
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
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
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
        className={`fab-kkeyxxviiai flex lg:hidden items-center justify-center transition-all duration-300 ${chatOpen ? "opacity-0 scale-75 pointer-events-none" : "opacity-100 scale-100"}`}
        style={{ color: "white" }}
      >
        <span className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: "var(--gradient)" }} />
        <StarIcon size={18} />
      </button>
    </>
  );
}
