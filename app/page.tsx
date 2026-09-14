"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
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
type Category = "all" | "genea" | "personal";

type ProjectMedia =
  | { type: "component"; src: string }
  | { type: "video";     src: string }
  | { type: "image";     src: string };

type Project = {
  title:    string;
  subtitle: string;
  /* One verified outcome from the case study — shown on the thumbnail label so the
     card carries a result before the case study is opened. */
  metric:   string;
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
  { id: "personal", label: "Personal" },
];

/* Titles follow [verb] + [what changed] + [for whom / under what constraint].
   Every metric below is taken verbatim from that project's own case study. */
const projects: Project[] = [
  {
    title:    "Preventing silent misconfiguration in physical access control",
    subtitle: "Genea · I/O Rules · 2026",
    metric:   "−62% config errors",
    slug:     "/projects/genea-io-rules",
    color:    "#f2f1f1",
    category: "genea" as Category,
    media:    { type: "component" as const, src: "" },
    external: false,
  },
  {
    title:    "Making AI sales agents operable by non-technical managers",
    subtitle: "House of Agents · AI SaaS · 2025",
    metric:   "78% template adoption",
    slug:     "/projects/house-of-agents",
    color:    "#0d0d12",
    category: "personal" as Category,
    media:    { type: "video" as const, src: "/videos/ai-workforce-platform.mp4" },
    external: false,
  },
  {
    title:    "Cutting a 6-screen venue booking flow down to 3",
    subtitle: "Workorbits · Side Project · 2020",
    metric:   "54% → 81% booking completion",
    slug:     "/projects/rental-marketplace",
    color:    "#0d1b4b",
    category: "personal" as Category,
    media:    { type: "component" as const, src: "" },
    external: false,
  },
  {
    title:    "Rebuilding a government insurance portal to WCAG 2.1 AA",
    subtitle: "Ripple Design · Gov · 2021",
    metric:   "40% faster complaint filing",
    slug:     "/projects/irdai",
    color:    "#e8ecf5",
    category: "personal" as Category,
    media:    { type: "component" as const, src: "" },
    external: false,
  },
  {
    title:    "Turning a 3-click widget flow into a single drag",
    subtitle: "Genea · Dashboard · 2024",
    metric:   "+25% operational efficiency",
    slug:     "/projects/custom-dashboard",
    color:    "#0e1b2e",
    category: "genea" as Category,
    media:    { type: "component" as const, src: "" },
    external: false,
  },
  {
    title:    "Schlage ENGAGE IP Integration",
    subtitle: "Genea · Hardware · 2026",
    metric:   "",
    slug:     "/projects/schlage-ip-integration",
    color:    "#C8102E",
    category: "genea" as Category,
    media:    { type: "component" as const, src: "" },
    external: false,
    hidden:   true,
  },
  {
    title:    "Cutting a 14-field listing form down to 6",
    subtitle: "Playfora · Startup · 2020",
    metric:   "72% → 83% listing completion",
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

/* ── Lazy video ─────────────────────────────────────────────
   Only fetches once the card is near the viewport, so an off-screen
   thumbnail never competes with first paint. Holds still for anyone
   who has asked for reduced motion. */
function LazyVideo({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      setVisible(true);       // load a still frame, but never animate it
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Autoplay can reject (power-saving, backgrounded tab); the poster frame stays. */
  useEffect(() => {
    const el = ref.current;
    if (el && visible && !reduced) void el.play().catch(() => {});
  }, [visible, reduced]);

  return (
    <video
      ref={ref}
      src={visible ? src : undefined}
      loop={!reduced}
      muted
      playsInline
      preload={reduced ? "metadata" : "none"}
      aria-label={`Product demo — ${title}`}
      className="absolute inset-0 w-full h-full object-cover"
    />
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
        <>
          <LazyVideo src={project.media.src} title={project.title} />
          {/* Cover bottom watermark — gradient fades into the card's own bg color */}
          <div
            className="absolute bottom-0 left-0 right-0 pointer-events-none"
            style={{
              height: "9%",
              background: `linear-gradient(to top, ${project.color} 0%, transparent 100%)`,
              zIndex: 1,
            }}
          />
        </>
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

              {/* Affordance + result — the title already sits below the card */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
                <span
                  style={{
                    fontFamily:  DISPLAY,
                    fontSize:    "clamp(13px, 1.1vw, 15px)",
                    fontWeight:  500,
                    color:       "#181617",
                    lineHeight:  1.3,
                    whiteSpace:  "nowrap",
                  }}
                >
                  Read case study
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
                  {project.metric || project.subtitle}
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
            className="leading-[1.15] mb-5"
            style={{
              fontFamily: DISPLAY,
              fontSize:   "clamp(1.7rem, 2.8vw, 2.4rem)",
              fontWeight: 300,
              color:      "#181617",
              maxWidth:   "min(820px, 100%)",
            }}
          >
            Kartikey Panchal is a Senior Product Designer with 9 years in enterprise SaaS,
            designing{" "}
            <em className="not-italic" style={{ fontWeight: 600 }}>Human × AI</em>
            {" "}access control at{" "}
            <Link
              href="https://genea.com"
              target="_blank"
              className="hover-underline"
              style={{ color: "#606060", fontWeight: 300 }}
            >
              Genea
            </Link>.
          </h1>

          {/* Proof line — answers "are you real?" before the thumbnails do */}
          <p
            className="mb-6"
            style={{
              margin:        "0 0 24px",
              fontFamily:    MONO,
              fontSize:      12,
              letterSpacing: "0.08em",
              color:         "#606060",
              maxWidth:      "min(680px, 100%)",
              lineHeight:    1.6,
            }}
          >
            Security software trusted by enterprise teams across North America.
            Previously Ripple Design, TriCore InfoTech.
          </p>

          {/* Experience pills — compact centered row */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {[
              { year: "2022 — Now",  company: "Genea",          url: "https://genea.com"  },
              { year: "2020 — 2022", company: "Ripple Design",   url: "#"                  },
              { year: "2018 — 2020", company: "TriCore InfoTech", url: "#"                 },
              { year: "2017 — 2018", company: "DesignNBuy",      url: "#"                  },
            ].map((exp, i) => (
              <span key={i} className="flex items-baseline gap-2">
                <span style={{ fontFamily: MONO, fontSize: 11, color: "#aaaaaa", letterSpacing: "0.06em" }}>
                  {exp.year}
                </span>
                <Link
                  href={exp.url}
                  target="_blank"
                  className="hover-underline transition-colors duration-300"
                  style={{ fontFamily: MONO, fontSize: 11, color: "#606060", letterSpacing: "0.06em" }}
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

          {/* Right: filter pill tabs */}
          <div
            role="tablist"
            aria-label="Filter projects by category"
            style={{ display: "flex", alignItems: "center", gap: 4 }}
          >
            {TABS.map((tab) => {
              const count = tab.id === "all"
                ? projects.filter((p) => !p.hidden).length
                : projects.filter((p) => p.category === tab.id && !p.hidden).length;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => switchTab(tab.id)}
                  style={{
                    fontFamily:    MONO,
                    fontSize:      11,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase" as const,
                    color:         isActive ? "#181617" : "#888888",
                    background:    isActive ? "rgba(24,22,23,0.07)" : "transparent",
                    border:        isActive ? "0.5px solid rgba(24,22,23,0.10)" : "0.5px solid transparent",
                    borderRadius:  999,
                    padding:       "6px 12px",
                    cursor:        "pointer",
                    transition:    "color .22s ease, background .22s ease, border .22s ease",
                    display:       "inline-flex",
                    alignItems:    "center",
                    gap:           5,
                    minHeight:     32,
                    whiteSpace:    "nowrap" as const,
                  }}
                >
                  {tab.label}
                  <span style={{
                    fontFamily: MONO,
                    fontSize:   9,
                    color:      isActive ? "#606060" : "#bbbbbb",
                    lineHeight: 1,
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
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
          className="grid grid-cols-2 lg:grid-cols-3 gap-3 pt-3"
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

                  {/* Always-visible label — the thumbnail has to carry the title and
                      the result for a reviewer who never hovers. */}
                  <div style={{ paddingTop: 12, paddingBottom: 4 }}>
                    <h3
                      style={{
                        margin:     0,
                        fontFamily: DISPLAY,
                        fontSize:   "clamp(13px, 1.15vw, 15px)",
                        fontWeight: 400,
                        color:      "#181617",
                        lineHeight: 1.35,
                      }}
                    >
                      {project.title}
                    </h3>
                    <p
                      style={{
                        margin:        "5px 0 0",
                        display:       "flex",
                        flexWrap:      "wrap",
                        alignItems:    "center",
                        gap:           "4px 8px",
                        fontFamily:    MONO,
                        fontSize:      11,
                        letterSpacing: "0.05em",
                        color:         "#888888",
                        lineHeight:    1.4,
                      }}
                    >
                      <span>{project.subtitle}</span>
                      {project.metric && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                          <span aria-hidden="true" style={{ color: "#d6d6d6" }}>·</span>
                          <span style={{ color: "#181617", fontWeight: 500 }}>
                            {project.metric}
                          </span>
                        </span>
                      )}
                    </p>
                  </div>
                </Link>
              </StaggerGridItem>
            );
          })}
        </StaggerGrid>
      </div>

    </div>
  );
}
