"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FadeUp, ScrollReveal, ScrollStaggerGrid, ScrollStaggerItem } from "@/components/Animate";

const MONO    = "var(--font-ibm-mono, var(--font-geist-mono), monospace)";
const DISPLAY = "var(--font-nunito, var(--font-inter), system-ui, sans-serif)";

type FunProject = {
  title: string;
  subtitle: string;
  url: string;
  color: string;
  tall: boolean;
  media:
    | { type: "image"; src: string }
    | { type: "video"; src: string }
    | { type: "node"; element: React.ReactNode };
};

/* ── Panorama animated thumbnail ─────────────────────────── */
function PanoramaThumb() {
  const COLS  = 26;
  const ROWS  = 9;
  const TOTAL = COLS * ROWS;

  // Specific cells get life-event colors; cells before index 104 = "lived weeks"
  const EVENTS: Record<number, { color: string; glow: string }> = {
    7:   { color: "#4F46E5", glow: "rgba(79,70,229,0.7)"  },
    18:  { color: "#22C55E", glow: "rgba(34,197,94,0.7)"  },
    31:  { color: "#EF4444", glow: "rgba(239,68,68,0.7)"  },
    45:  { color: "#4F46E5", glow: "rgba(79,70,229,0.7)"  },
    52:  { color: "#22C55E", glow: "rgba(34,197,94,0.7)"  },
    67:  { color: "#4F46E5", glow: "rgba(79,70,229,0.7)"  },
    78:  { color: "#EF4444", glow: "rgba(239,68,68,0.7)"  },
    89:  { color: "#22C55E", glow: "rgba(34,197,94,0.7)"  },
    99:  { color: "#4F46E5", glow: "rgba(79,70,229,0.7)"  },
    104: { color: "#22C55E", glow: "rgba(34,197,94,0.7)"  },
    113: { color: "#EF4444", glow: "rgba(239,68,68,0.7)"  },
    128: { color: "#4F46E5", glow: "rgba(79,70,229,0.7)"  },
    145: { color: "#22C55E", glow: "rgba(34,197,94,0.7)"  },
    160: { color: "#EF4444", glow: "rgba(239,68,68,0.7)"  },
    172: { color: "#4F46E5", glow: "rgba(79,70,229,0.7)"  },
    185: { color: "#22C55E", glow: "rgba(34,197,94,0.7)"  },
    198: { color: "#4F46E5", glow: "rgba(79,70,229,0.7)"  },
    210: { color: "#EF4444", glow: "rgba(239,68,68,0.7)"  },
    220: { color: "#22C55E", glow: "rgba(34,197,94,0.7)"  },
    228: { color: "#4F46E5", glow: "rgba(79,70,229,0.7)"  },
  };

  return (
    <div style={{
      width: "100%", height: "100%", background: "#0d1117",
      display: "flex", flexDirection: "column",
      padding: "14px 14px 12px", gap: 10, position: "relative",
      overflow: "hidden",
    }}>

      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <motion.div
          style={{ width: 6, height: 6, borderRadius: "50%", background: "#4F46E5", flexShrink: 0 }}
          animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.35, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <span style={{
          fontFamily: MONO, fontSize: 8, color: "rgba(255,255,255,0.72)",
          letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600,
        }}>
          Panorama
        </span>
        <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 7, color: "rgba(255,255,255,0.22)", letterSpacing: "0.05em" }}>
          Life in Weeks
        </span>
      </div>

      {/* Week grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gap: 2.5,
        flex: 1,
      }}>
        {Array.from({ length: TOTAL }).map((_, i) => {
          const ev     = EVENTS[i];
          const lived  = i < 104;

          if (ev) {
            return (
              <motion.div
                key={i}
                style={{
                  aspectRatio: "1",
                  borderRadius: 2,
                  background: ev.color,
                }}
                animate={{
                  opacity: [0.75, 1, 0.75],
                  boxShadow: [
                    `0 0 3px ${ev.glow}`,
                    `0 0 10px ${ev.glow}`,
                    `0 0 3px ${ev.glow}`,
                  ],
                  scale: [1, 1.08, 1],
                }}
                transition={{
                  duration: 1.6 + (i % 5) * 0.35,
                  repeat: Infinity,
                  delay: (i % 11) * 0.12,
                  ease: "easeInOut",
                }}
              />
            );
          }

          return (
            <div
              key={i}
              style={{
                aspectRatio: "1",
                borderRadius: 2,
                background: lived
                  ? "rgba(99,102,241,0.22)"
                  : "rgba(255,255,255,0.045)",
              }}
            />
          );
        })}
      </div>

      {/* Timeline bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontFamily: MONO, fontSize: 6.5, color: "rgba(255,255,255,0.18)", letterSpacing: "0.04em" }}>2000</span>
        <div style={{
          flex: 1, height: 2.5, background: "rgba(99,102,241,0.12)",
          borderRadius: 2, position: "relative", overflow: "visible",
        }}>
          <motion.div
            style={{ position: "absolute", left: 0, top: 0, bottom: 0, background: "linear-gradient(90deg,#4F46E5,#818cf8)", borderRadius: 2 }}
            initial={{ width: 0 }}
            animate={{ width: "38%" }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            style={{
              position: "absolute", top: -3, bottom: -3, width: 2.5,
              background: "rgba(255,255,255,0.9)", borderRadius: 2,
            }}
            animate={{ left: ["36.5%", "38%", "36.5%"], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <span style={{ fontFamily: MONO, fontSize: 6.5, color: "rgba(255,255,255,0.18)", letterSpacing: "0.04em" }}>2100</span>
      </div>

      {/* Make-a-thon badge */}
      <motion.div
        style={{
          position: "absolute", top: 11, right: 12,
          background: "rgba(79,70,229,0.14)",
          border: "0.5px solid rgba(99,102,241,0.35)",
          borderRadius: 4, padding: "2.5px 7px",
        }}
        animate={{ borderColor: ["rgba(99,102,241,0.25)", "rgba(99,102,241,0.55)", "rgba(99,102,241,0.25)"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <span style={{ fontFamily: MONO, fontSize: 6.5, color: "rgba(129,140,248,0.9)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Make-a-thon
        </span>
      </motion.div>

      {/* Colour legend */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {[
          { color: "#22C55E", label: "Positive" },
          { color: "#EF4444", label: "Challenge" },
          { color: "#4F46E5", label: "Milestone" },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 3.5 }}>
            <div style={{ width: 5, height: 5, borderRadius: 1, background: color, flexShrink: 0 }} />
            <span style={{ fontFamily: MONO, fontSize: 6, color: "rgba(255,255,255,0.28)", letterSpacing: "0.06em" }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Bloom & Bond animated thumbnail ─────────────────────── */
function BloomBondThumb() {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "linear-gradient(155deg, #FDEEF4 0%, #EEE9FB 55%, #E8F6F3 100%)",
      position: "relative", overflow: "hidden",
      display: "flex", flexDirection: "column",
      padding: "16px 14px 14px", gap: 10,
    }}>
      {/* Ambient blurred orbs */}
      <div style={{ position: "absolute", top: -30, right: -20, width: 130, height: 130, borderRadius: "50%", background: "rgba(249,217,226,0.55)", filter: "blur(32px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 10, left: -15, width: 100, height: 100, borderRadius: "50%", background: "rgba(201,194,241,0.45)", filter: "blur(22px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "40%", right: "10%", width: 60, height: 60, borderRadius: "50%", background: "rgba(95,182,166,0.22)", filter: "blur(16px)", pointerEvents: "none" }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, position: "relative" }}>
        {/* Petal logo mark */}
        <motion.div
          style={{ width: 8, height: 8, borderRadius: "50%", background: "linear-gradient(135deg, #F9D9E2, #C9C2F1)", flexShrink: 0 }}
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <span style={{ fontFamily: MONO, fontSize: 7.5, color: "#6b4555", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600 }}>
          Bloom &amp; Bond
        </span>
        <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 6.5, color: "rgba(107,69,85,0.38)", letterSpacing: "0.05em" }}>
          Week 24
        </span>
      </div>

      {/* Breathing garden — centre piece */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>

        {/* Outer expanding rings */}
        {[68, 52, 38].map((size, i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              width: size, height: size,
              borderRadius: "50%",
              border: `1px solid rgba(249,217,226,${0.65 - i * 0.18})`,
            }}
            animate={{ scale: [1, 1.18, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 0.35, ease: "easeInOut" }}
          />
        ))}

        {/* Petals */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              width: 7, height: 11,
              borderRadius: "50%",
              background: i % 3 === 0 ? "#A9D6A5" : i % 3 === 1 ? "#C9C2F1" : "#F9D9E2",
              transformOrigin: "50% 100%",
              transform: `rotate(${angle}deg) translateY(-24px)`,
              opacity: 0.75,
            }}
            animate={{ opacity: [0.45, 0.9, 0.45], scaleY: [0.9, 1.1, 0.9] }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
          />
        ))}

        {/* Core glow */}
        <motion.div
          style={{
            width: 26, height: 26, borderRadius: "50%",
            background: "radial-gradient(circle at 38% 38%, #fff 10%, #F9D9E2 45%, #C9C2F1 100%)",
            boxShadow: "0 0 12px rgba(249,217,226,0.8)",
          }}
          animate={{ scale: [0.88, 1.18, 0.88] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Fireflies */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angle = i * 60;
          const rad   = angle * Math.PI / 180;
          return (
            <motion.div
              key={`ff-${i}`}
              style={{
                position: "absolute",
                width: 3, height: 3,
                borderRadius: "50%",
                background: "#FFD6A5",
                boxShadow: "0 0 5px 1px rgba(255,214,165,0.8)",
              }}
              animate={{
                x: [
                  Math.cos(rad) * 34,
                  Math.cos(rad + 0.55) * 48,
                  Math.cos(rad) * 34,
                ],
                y: [
                  Math.sin(rad) * 30,
                  Math.sin(rad + 0.55) * 42,
                  Math.sin(rad) * 30,
                ],
                opacity: [0.35, 1, 0.35],
              }}
              transition={{ duration: 3.2 + i * 0.45, repeat: Infinity, ease: "easeInOut", delay: i * 0.28 }}
            />
          );
        })}
      </div>

      {/* Health tracking tiles */}
      <div style={{ display: "flex", gap: 5, position: "relative" }}>
        {[
          { emoji: "💧", label: "Hydration", value: "6 / 8",  accent: "#5FB6A6" },
          { emoji: "💊", label: "Vitamins",  value: "✓ Done", accent: "#A9D6A5" },
          { emoji: "🌙", label: "Mood",      value: "😊",      accent: "#C9C2F1" },
          { emoji: "🌿", label: "Mindful",   value: "5 min",  accent: "#F9D9E2" },
        ].map((tile) => (
          <div key={tile.label} style={{
            flex: 1, borderRadius: 8, padding: "5px 4px 6px",
            background: "rgba(255,255,255,0.72)",
            backdropFilter: "blur(8px)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 2.5,
            border: "0.5px solid rgba(249,217,226,0.6)",
          }}>
            <span style={{ fontSize: 9 }}>{tile.emoji}</span>
            <span style={{ fontFamily: MONO, fontSize: 5.5, color: "#6b4555", letterSpacing: "0.04em", textAlign: "center", lineHeight: 1.3 }}>{tile.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Uplabs animated thumbnail ────────────────────────────── */
function UpLabsThumb() {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "#eeeff2",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      {/* Subtle radial glow */}
      <div style={{
        position: "absolute",
        width: 160, height: 160,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(91,79,233,0.10) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Logo */}
      <motion.div
        style={{ display: "flex", alignItems: "baseline", gap: 0 }}
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* "up" — gradient blue-purple */}
        <span style={{
          fontSize: 38, fontWeight: 800, lineHeight: 1,
          background: "linear-gradient(135deg, #5B4FE9 0%, #3B82F6 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          fontFamily: "system-ui, -apple-system, sans-serif",
          letterSpacing: "-0.02em",
        }}>
          up
        </span>
        {/* "labs" — dark charcoal */}
        <span style={{
          fontSize: 38, fontWeight: 800, lineHeight: 1,
          color: "#2d2d35",
          fontFamily: "system-ui, -apple-system, sans-serif",
          letterSpacing: "-0.02em",
        }}>
          labs
        </span>
      </motion.div>

      {/* Underline accent under "up" */}
      <motion.div
        style={{
          position: "absolute",
          bottom: "calc(50% - 26px)",
          left: "calc(50% - 44px)",
          width: 38,
          height: 3,
          borderRadius: 999,
          background: "linear-gradient(135deg, #5B4FE9, #3B82F6)",
          opacity: 0.5,
        }}
        animate={{ opacity: [0.35, 0.7, 0.35] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/* ── Project data ─────────────────────────────────────────── */
const funProjects: FunProject[] = [
  {
    title: "Panorama — Life Visualization App",
    subtitle: "Figma Make-a-thon 2026 · Contra Contest",
    url: "https://www.notion.so/Panorama-Life-Visualization-App-35c95e81b1a48016963df5c75585ccfe?source=copy_link",
    color: "#0d1117",
    tall: true,
    media: { type: "node", element: <PanoramaThumb /> },
  },
  {
    title: "Bloom & Bond — Pregnancy Wellness App",
    subtitle: "In Development · React PWA · 2026",
    url: "#",
    color: "#fdeef4",
    tall: true,
    media: { type: "node", element: <BloomBondThumb /> },
  },
  {
    title: "Mentoring designers at Uplabs",
    subtitle: "Uplabs Community · Volunteering 2022",
    url: "https://www.uplabs.com",
    color: "#eeeff2",
    tall: false,
    media: { type: "node", element: <UpLabsThumb /> },
  },
];

/* ── Card ─────────────────────────────────────────────────── */
function FunCard({ project }: { project: FunProject }) {
  return (
    <>
      <div
        className="relative w-full rounded-lg overflow-hidden"
        style={{
          backgroundColor: project.color,
          aspectRatio: project.tall ? "3/4" : "4/3",
        }}
      >
        {project.media.type === "node" ? (
          <div className="absolute inset-0">{project.media.element}</div>
        ) : project.media.type === "video" && project.media.src ? (
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src={project.media.src} type="video/mp4" />
          </video>
        ) : project.media.type === "image" && project.media.src ? (
          <Image
            src={project.media.src}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : null}
      </div>
      <h3 className="text-base font-normal text-[#181617] mt-2">{project.title}</h3>
      <p className="text-[11px] tracking-[0.15em] uppercase text-[#9ca3af] mb-1">{project.subtitle}</p>
    </>
  );
}

/* ── Page ─────────────────────────────────────────────────── */
export default function FunContent() {
  return (
    <div>

      {/* ── Hero ────────────────────────────────────── */}
      <div className="px-5 md:px-[42px] pt-[88px] pb-12">
        <FadeUp delay={0} className="flex flex-col items-center text-center">
          <h1
            className="leading-[1.15] mb-6"
            style={{
              fontFamily: DISPLAY,
              fontSize:   "1.75rem",
              fontWeight: 300,
              color:      "#181617",
              maxWidth:   "min(820px, 100%)",
            }}
          >
            I lose sleep to{" "}
            <em className="not-italic" style={{ fontWeight: 600 }}>design systems</em>
            {", product thinking, & side projects."}
          </h1>
          <p
            style={{
              fontFamily:    MONO,
              fontSize:      11,
              color:         "#9ca3af",
              maxWidth:      "min(540px, 100%)",
              lineHeight:    1.7,
              letterSpacing: "0.03em",
            }}
          >
            Design is my craft, but I make time to explore new tools, mentor designers, and build
            things that push creative boundaries. Currently shaping enterprise access control at Genea.
          </p>
        </FadeUp>
      </div>

      {/* ── Masonry grid — scroll-triggered stagger ── */}
      <div className="px-6 md:px-10">
        <ScrollReveal delay={0}>
          <div className="masonry-grid pb-16">
            {funProjects.map((project, i) => (
              <Link
                key={i}
                href={project.url}
                target={project.url === "#" ? undefined : "_blank"}
                rel={project.url !== "#" ? "noreferrer" : undefined}
                className="block group hover:opacity-90 transition-opacity"
              >
                <FunCard project={project} />
              </Link>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
