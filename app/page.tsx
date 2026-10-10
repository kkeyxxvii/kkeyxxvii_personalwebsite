"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Rise, Reveal } from "cube-motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon, SquareLock01Icon } from "@hugeicons/core-free-icons";
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
  /** Fade the card colour over the bottom edge — only for source footage
      that carries a burned-in watermark there. */
  coverWatermark?: boolean;
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
    media:    { type: "video" as const, src: "/videos/automation-promo-43.mp4" },
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
    coverWatermark: true,
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
      <HugeiconsIcon
        icon={SquareLock01Icon}
        size={9}
        strokeWidth={2.2}
        color="rgba(255,255,255,0.65)"
        aria-hidden="true"
      />
      <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.65)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
        NDA
      </span>
    </div>
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
      autoPlay={!reduced}
      loop={!reduced}
      muted
      playsInline
      preload={reduced ? "metadata" : "none"}
      aria-label={`Product demo — ${title}`}
      className="absolute inset-0 w-full h-full object-cover"
    />
  );
}

/* ── Project card ───────────────────────────────────────────
   Hover lives in CSS: the frame lifts, the media drifts, the rule
   darkens and the caption arrow slides in. The site already has one
   custom cursor — a second cursor-tracking element per card would be
   two things competing for the same glance. */
function ProjectCard({ project }: { project: typeof projects[number] }) {
  return (
    <div
      className="relative w-full overflow-hidden project-card-frame"
      style={{ backgroundColor: project.color, aspectRatio: "1 / 1" }}
    >
      {/* Media — wrapped so the whole composition drifts as one plane */}
      <div className="project-card-media">
        {project.media.type === "video" ? (
          <>
            <LazyVideo src={project.media.src} title={project.title} />
            {project.coverWatermark && (
              /* Fades into the card's own bg colour to hide a burned-in watermark */
              <div
                className="absolute bottom-0 left-0 right-0 pointer-events-none"
                style={{
                  height: "9%",
                  background: `linear-gradient(to top, ${project.color} 0%, transparent 100%)`,
                  zIndex: 1,
                }}
              />
            )}
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
      </div>

      {/* NDA badge */}
      {"nda" in project && project.nda && <NdaBadge />}

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
      <div className="px-5 md:px-[42px] pt-14 md:pt-[88px] pb-9 md:pb-12">
        {/* Staggers in scan order: avatar, role line, proof line, history */}
        <Rise targets="children" className="flex flex-col items-center text-center">
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
              fontSize:   "clamp(1.45rem, 4.4vw, 2.4rem)",
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
              margin:        "0 0 20px",
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
            ].map((exp, i) => {
              const meta = { fontFamily: MONO, fontSize: 11, letterSpacing: "0.06em" } as const;
              return (
                <span key={i} className="flex items-baseline gap-2 py-1">
                  <span style={{ ...meta, color: "#aaaaaa" }}>{exp.year}</span>
                  {/* Only Genea has somewhere to go. The rest were links to "#" —
                      focusable, announced as links, and leading nowhere. */}
                  {exp.url === "#" ? (
                    <span style={{ ...meta, color: "#606060" }}>{exp.company}</span>
                  ) : (
                    <Link
                      href={exp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover-underline transition-colors duration-300"
                      style={{ ...meta, color: "#606060", padding: "6px 0" }}
                    >
                      {exp.company}
                    </Link>
                  )}
                </span>
              );
            })}
          </div>
        </Rise>
      </div>

      {/* ── Work section ────────────────────────────────────── */}
      <div className="px-5 md:px-[42px]">

        {/* Section heading row: title left · filters right */}
        <div
          style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            /* Below ~420px the label and the four pills cannot share a
               line; wrapping beats letting them collide. */
            flexWrap:       "wrap",
            gap:            "12px 16px",
            borderBottom:   "1px solid rgba(24,22,23,0.08)",
            paddingBottom:  14,
            marginBottom:   0,
          }}
        >
          {/* Left: section marker — mono eyebrow reads as a system label,
              which keeps the display face reserved for content. */}
          <h2
            style={{
              fontFamily:    MONO,
              fontSize:      11,
              fontWeight:    400,
              color:         "#181617",
              letterSpacing: "0.16em",
              textTransform: "uppercase" as const,
              whiteSpace:    "nowrap" as const,
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
                    color:         isActive ? "#ffffff" : "#8a8a8a",
                    background:    isActive ? "#181617" : "transparent",
                    border:        "1px solid",
                    borderColor:   isActive ? "#181617" : "rgba(24,22,23,0.12)",
                    borderRadius:  999,
                    padding:       "7px 14px",
                    cursor:        "pointer",
                    transition:    "color .35s cubic-bezier(0.2,0,0,1), background .35s cubic-bezier(0.2,0,0,1), border-color .35s cubic-bezier(0.2,0,0,1)",
                    display:       "inline-flex",
                    alignItems:    "center",
                    gap:           7,
                    minHeight:     34,
                    whiteSpace:    "nowrap" as const,
                  }}
                >
                  {tab.label}
                  <span
                    data-metric
                    style={{
                      fontFamily: MONO,
                      fontSize:   9,
                      color:      isActive ? "rgba(255,255,255,0.55)" : "#bbbbbb",
                      lineHeight: 1,
                    }}
                  >
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
        <Reveal
          targets="children"
          className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-12 pt-4"
        >
          {filtered.map((project, i) => {
            const linkProps = project.external
              ? { href: project.slug, target: "_blank" as const }
              : { href: project.slug };

            return (
                <Link
                  key={project.slug + i}
                  {...linkProps}
                  className="group block"
                >
                  <ProjectCard project={project} />

                  {/* Caption — index and arrow bracket the rule, so the eye
                      travels image → number → title → outcome. */}
                  <div style={{ paddingTop: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <span
                        className="card-index"
                        style={{
                          fontFamily:    MONO,
                          fontSize:      10,
                          letterSpacing: "0.14em",
                          lineHeight:    1,
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="card-rule" style={{ flex: 1 }} />
                      <HugeiconsIcon
                        className="card-arrow"
                        icon={ArrowUpRight01Icon}
                        size={13}
                        strokeWidth={2}
                        aria-hidden="true"
                        style={{ display: "block", color: "#181617", flexShrink: 0 }}
                      />
                    </div>

                    <h3
                      style={{
                        margin:        0,
                        fontFamily:    DISPLAY,
                        fontSize:      "clamp(15px, 1.25vw, 18px)",
                        fontWeight:    400,
                        color:         "#181617",
                        lineHeight:    1.3,
                        letterSpacing: "-0.011em",
                        textWrap:      "balance" as const,
                      }}
                    >
                      {project.title}
                    </h3>

                    <div
                      style={{
                        marginTop:  8,
                        display:    "flex",
                        flexWrap:   "wrap",
                        alignItems: "baseline",
                        gap:        "4px 10px",
                      }}
                    >
                      {project.metric && (
                        <span
                          data-metric
                          style={{
                            fontFamily:    DISPLAY,
                            fontSize:      13,
                            fontWeight:    500,
                            color:         "#181617",
                            letterSpacing: "-0.005em",
                          }}
                        >
                          {project.metric}
                        </span>
                      )}
                      <span
                        style={{
                          fontFamily:    MONO,
                          fontSize:      10,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase" as const,
                          color:         "#9a9a9a",
                          lineHeight:    1.5,
                        }}
                      >
                        {project.subtitle}
                      </span>
                    </div>
                  </div>
                </Link>
            );
          })}
        </Reveal>
      </div>

    </div>
  );
}
