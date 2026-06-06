"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import {
  FadeUp,
  StaggerGrid,
  StaggerGridItem,
} from "@/components/Animate";
import GeneaIORulesCard      from "@/components/GeneaIORulesCard";
import CustomDashboardCard   from "@/components/CustomDashboardCard";
import GamifiedRafflesCard   from "@/components/GamifiedRafflesCard";
import SchlageIPCard         from "@/components/SchlageIPCard";
import IRDAICard             from "@/components/IRDAICard";
import RentalMarketplaceCard  from "@/components/RentalMarketplaceCard";
import HouseOfAgentsCard     from "@/components/HouseOfAgentsCard";

const MONO    = "var(--font-ibm-mono, var(--font-geist-mono), monospace)";
const DISPLAY = "var(--font-nunito, var(--font-inter), system-ui, sans-serif)";

/* ── Categories for tabs ──────────────────────────────────── */
type Category = "all" | "genea" | "freelance" | "personal";

type ProjectMedia =
  | { type: "component"; src: string }
  | { type: "video";     src: string }
  | { type: "image";     src: string };

type Project = {
  title:    string;
  subtitle: string;
  slug:     string;
  color:    string;
  category: Category;
  media:    ProjectMedia;
  external: boolean;
  nda?:     boolean;
  hidden?:  boolean;
};

const TABS: { id: Category; label: string }[] = [
  { id: "all",      label: "All"      },
  { id: "genea",    label: "Genea"    },
  { id: "freelance",label: "Freelance"},
  { id: "personal", label: "Personal" },
];

const projects: Project[] = [
  {
    title:    "Preventing Silent Misconfiguration in Physical Access Control",
    subtitle: "Genea · I/O Rules · 2026",
    slug:     "/projects/genea-io-rules",
    color:    "#f2f1f1",
    category: "genea" as Category,
    media:    { type: "component" as const, src: "" },
    external: false,
  },
  {
    title:    "AI Workforce Platform for Sales Teams",
    subtitle: "House of Agents · AI SaaS · 2025",
    slug:     "/projects/house-of-agents",
    color:    "#0d0d12",
    category: "freelance" as Category,
    media:    { type: "component" as const, src: "" },
    external: false,
  },
  {
    title:    "B2B rental marketplace",
    subtitle: "Workorbits · Side Project · 2020",
    slug:     "/projects/rental-marketplace",
    color:    "#0d1b4b",
    category: "personal" as Category,
    media:    { type: "component" as const, src: "" },
    external: false,
  },
  {
    title:    "IRDAI government website redesign",
    subtitle: "Ripple Design · Gov · 2021",
    slug:     "/projects/irdai",
    color:    "#e8ecf5",
    category: "freelance" as Category,
    media:    { type: "component" as const, src: "" },
    external: false,
  },
  {
    title:    "Custom analytics dashboard for enterprise facility managers",
    subtitle: "Genea · Dashboard · 2024",
    slug:     "/projects/custom-dashboard",
    color:    "#0e1b2e",
    category: "genea" as Category,
    media:    { type: "component" as const, src: "" },
    external: false,
  },
  {
    title:    "Schlage ENGAGE IP Integration",
    subtitle: "Genea · Hardware · 2026",
    slug:     "/projects/schlage-ip-integration",
    color:    "#C8102E",
    category: "genea" as Category,
    media:    { type: "component" as const, src: "" },
    external: false,
    hidden:   true,
  },
  {
    title:    "Gamified fundraising raffles",
    subtitle: "Playfora · Startup · 2020",
    slug:     "/projects/gamified-raffles",
    color:    "#2D3BFF",
    category: "personal" as Category,
    media:    { type: "component" as const, src: "" },
    external: false,
    nda:      true,
  },
];

/* ── NDA badge ─────────────────────────────────────────────── */
function NdaBadge() {
  return (
    <div
      style={{
        position:       "absolute",
        top:            10,
        left:           10,
        display:        "flex",
        alignItems:     "center",
        gap:            4,
        padding:        "4px 8px",
        borderRadius:   999,
        zIndex:         10,
        background:     "rgba(0,0,0,0.50)",
        backdropFilter: "blur(6px)",
        border:         "1px solid rgba(255,255,255,0.13)",
      }}
    >
      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="11" width="18" height="11" rx="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
      <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.65)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
        NDA
      </span>
    </div>
  );
}

/* ── Diagonal arrow (isabelshic work-card arrow) ───────────── */
function CardArrow() {
  return (
    <svg
      width="32" height="32" viewBox="0 0 24 24"
      fill="none" aria-hidden="true"
      style={{ display: "block", color: "#888888", flexShrink: 0 }}
    >
      <path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── Project card — cursor-follow hover ────────────────────── */
function ProjectCard({ project }: { project: typeof projects[number] }) {
  const [active, setActive] = useState(false);

  /* Spring-tracked mouse position relative to the card */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 500, damping: 50, bounce: 0 });
  const springY = useSpring(mouseY, { stiffness: 500, damping: 50, bounce: 0 });

  function getRelPos(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  return (
    <div
      className="relative w-full overflow-hidden project-card-frame"
      style={{ backgroundColor: project.color, aspectRatio: "1 / 1", cursor: "none" }}
      onMouseEnter={(e) => {
        /* Jump springs to the entry point instantly — no spring lag on first render */
        const { x, y } = getRelPos(e);
        springX.jump(x);
        springY.jump(y);
        setActive(true);
      }}
      onMouseMove={(e) => {
        const { x, y } = getRelPos(e);
        mouseX.set(x);
        mouseY.set(y);
      }}
      onMouseLeave={() => setActive(false)}
    >
      {/* Media */}
      {project.media.type === "video" ? (
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src={project.media.src} type="video/mp4" />
        </video>
      ) : project.media.type === "component" ? (
        project.slug === "/projects/custom-dashboard"
          ? <CustomDashboardCard />
          : project.slug === "/projects/gamified-raffles"
            ? <GamifiedRafflesCard />
            : project.slug === "/projects/schlage-ip-integration"
              ? <SchlageIPCard />
              : project.slug === "/projects/irdai"
                ? <IRDAICard />
                : project.slug === "/projects/rental-marketplace"
                  ? <RentalMarketplaceCard />
                  : project.slug === "/projects/house-of-agents"
                    ? <HouseOfAgentsCard />
                    : <GeneaIORulesCard />
      ) : (
        <Image
          src={(project.media as { type: "image"; src: string }).src}
          alt={`Thumbnail — ${project.title}`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      )}

      {/* NDA badge */}
      {"nda" in project && project.nda && <NdaBadge />}

      {/* ── Cursor-follow pill ────────────────────────────────── */}
      <AnimatePresence>
        {active && (
          <motion.div
            style={{
              position:      "absolute",
              left:          springX,
              top:           springY,
              transform:     "translate(-50%, -50%)",
              pointerEvents: "none",
              zIndex:        20,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{   scale: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.12, 0.9, 0.2, 1] }}
          >
            <div
              style={{
                display:               "inline-flex",
                alignItems:            "center",
                gap:                   14,
                padding:               "14px 24px 14px 16px",
                borderRadius:          999,
                background:            "rgba(255,255,255,0.88)",
                backdropFilter:        "blur(20px) saturate(180%)",
                WebkitBackdropFilter:  "blur(20px) saturate(180%)",
                boxShadow:             "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(24,22,23,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
                border:                "0.5px solid rgba(255,255,255,0.7)",
                maxWidth:              "min(320px, 68vw)",
              } as React.CSSProperties}
            >
              {/* Arrow — vertically centred with the two-line text block */}
              <div style={{ flexShrink: 0, alignSelf: "center" }}>
                <CardArrow />
              </div>

              {/* Title + subtitle */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
                <span
                  style={{
                    fontFamily:  DISPLAY,
                    fontSize:    "clamp(13px, 1.1vw, 15px)",
                    fontWeight:  500,
                    color:       "#181617",
                    lineHeight:  1.3,
                    whiteSpace:  "normal",
                  }}
                >
                  {project.title}
                </span>
                <span
                  style={{
                    fontFamily:    MONO,
                    fontSize:      "clamp(9px, 0.75vw, 11px)",
                    fontWeight:    400,
                    color:         "#888888",
                    letterSpacing: "0.06em",
                    whiteSpace:    "nowrap",
                    overflow:      "hidden",
                    textOverflow:  "ellipsis",
                  }}
                >
                  {project.subtitle}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────── */
export default function Home() {
  const [activeTab, setActiveTab] = useState<Category>("all");
  const [animKey,   setAnimKey]   = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered = (activeTab === "all"
    ? projects
    : projects.filter((p) => p.category === activeTab)
  ).filter((p) => !("hidden" in p && p.hidden));

  function switchTab(id: Category) {
    if (id === activeTab) return;
    setActiveTab(id);
    setAnimKey((k) => k + 1);
  }

  return (
    <div>

      {/* ── Hero ────────────────────────────────────────────── */}
      <div className="px-5 md:px-[42px] pt-[88px] pb-12">
        <FadeUp delay={0} className="flex flex-col items-center text-center">
          {/* Avatar */}
          <div style={{ flexShrink: 0, lineHeight: 0, marginBottom: 20 }}>
            <Image
              src="/images/kkeyxxvii_avatar.svg"
              alt="Kartikey Panchal"
              width={48}
              height={48}
              style={{ width: 48, height: 48, objectFit: "contain", display: "block" }}
              priority
            />
          </div>

          <h1
            className="leading-[1.15] mb-8"
            style={{
              fontFamily: DISPLAY,
              fontSize:   "1.75rem",
              fontWeight: 300,
              color:      "#181617",
              maxWidth:   "min(820px, 100%)",
            }}
          >
            Kartikey Panchal is a Product Designer focused on{" "}
            <em className="not-italic" style={{ fontWeight: 600 }}>Human × AI</em>
            {" "}and inspired by sci-fi, currently at{" "}
            <Link
              href="https://genea.com"
              target="_blank"
              className="hover-underline"
              style={{ color: "#606060", fontWeight: 300 }}
            >
              Genea
            </Link>.
          </h1>

          {/* Experience pills — compact centered row */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {[
              { year: "2022 — Now",  company: "Genea",          url: "https://genea.com"  },
              { year: "2020 — 2022", company: "Ripple Design",   url: "#"                  },
              { year: "2018 — 2020", company: "TriCore InfoTech", url: "#"                 },
              { year: "2017 — 2018", company: "DesignNBuy",      url: "#"                  },
            ].map((exp, i) => (
              <span key={i} className="flex items-baseline gap-2">
                <span style={{ fontFamily: MONO, fontSize: 9, color: "#888888", letterSpacing: "0.08em" }}>
                  {exp.year}
                </span>
                <Link
                  href={exp.url}
                  target="_blank"
                  className="hover-underline transition-colors duration-300"
                  style={{ fontFamily: MONO, fontSize: 9, color: "#606060", letterSpacing: "0.08em" }}
                >
                  {exp.company}
                </Link>
              </span>
            ))}
          </div>
        </FadeUp>
      </div>

      {/* ── Work section ────────────────────────────────────── */}
      <div className="px-5 md:px-[42px]">

        {/* Section heading row: title left · filters right */}
        <div
          style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            borderBottom:   "1px solid rgba(24,22,23,0.08)",
            paddingBottom:  14,
            marginBottom:   0,
          }}
        >
          {/* Left: title */}
          <h2
            style={{
              fontFamily:    DISPLAY,
              fontSize:      "clamp(1rem, 1.8vw, 1.3rem)",
              fontWeight:    300,
              color:         "#181617",
              letterSpacing: "-0.01em",
              margin:        0,
            }}
          >
            Selected Work
          </h2>

          {/* Right: filter dropdown */}
          <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
            <select
              aria-label="Filter by category"
              value={activeTab}
              onChange={(e) => switchTab(e.target.value as Category)}
              style={{
                fontFamily:            MONO,
                fontSize:              12,
                letterSpacing:         "0.12em",
                textTransform:         "uppercase",
                color:                 "#181617",
                background:            "rgba(24,22,23,0.05)",
                backdropFilter:        "blur(12px) saturate(160%)",
                WebkitBackdropFilter:  "blur(12px) saturate(160%)",
                border:                "0.5px solid rgba(24,22,23,0.07)",
                borderRadius:          999,
                padding:               "8px 34px 8px 14px",
                cursor:                "pointer",
                outline:               "none",
                WebkitAppearance:      "none",
                appearance:            "none",
                boxShadow:             "0 1px 4px rgba(0,0,0,0.04)",
              } as React.CSSProperties}
            >
              {TABS.map((tab) => (
                <option key={tab.id} value={tab.id}>{tab.label}</option>
              ))}
            </select>
            {/* Custom chevron icon */}
            <svg
              width="10" height="10" viewBox="0 0 24 24"
              fill="none" stroke="#888888" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true"
              style={{ position: "absolute", right: 12, pointerEvents: "none" }}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Project grid ─────────────────────────────────────── */}
      <div
        key={animKey}
        ref={gridRef}
        className="tab-panel--entering px-5 md:px-[42px] pb-16 mt-0"
        role="tabpanel"
      >
        <StaggerGrid
          className="grid grid-cols-2 lg:grid-cols-3 gap-2 pt-2"
          delayChildren={0.05}
          staggerChildren={0.05}
        >
          {filtered.map((project, i) => {
            const linkProps = project.external
              ? { href: project.slug, target: "_blank" as const }
              : { href: project.slug };

            return (
              <StaggerGridItem key={project.slug + i}>
                <Link
                  {...linkProps}
                  className="group block transition-transform duration-300 hover:scale-[0.995]"
                >
                  <ProjectCard project={project} />
                </Link>
              </StaggerGridItem>
            );
          })}
        </StaggerGrid>
      </div>

    </div>
  );
}
