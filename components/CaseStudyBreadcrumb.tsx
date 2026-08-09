"use client";

import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";

const MONO = "var(--font-ibm-mono, var(--font-geist-mono), monospace)";

interface Props {
  title: string;
  minRead: number;
}

/* Reading progress — thin bar pinned to the very top of the viewport,
   above the glass nav. Gives readers a sense of place in long case studies. */
function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        transformOrigin: "0% 50%",
        scaleX,
        background: "linear-gradient(90deg, #FF2929, #FFD029)",
        zIndex: 60,
        pointerEvents: "none",
      }}
    />
  );
}

export default function CaseStudyBreadcrumb({ title, minRead }: Props) {
  return (
    <>
      <ReadingProgress />

      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 flex-wrap"
        style={{
          fontFamily:    MONO,
          fontSize:      12,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color:         "#888888",
        }}
      >
        <Link
          href="/"
          style={{ color: "#888888", textDecoration: "none", transition: "color .25s ease", padding: "6px 0" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#181617")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#888888")}
        >
          Selected work
        </Link>

        <span aria-hidden="true" style={{ color: "#d6d6d6" }}>/</span>

        <span aria-current="page" style={{ color: "#606060" }}>{title}</span>

        <span aria-hidden="true" style={{ color: "#d6d6d6" }}>·</span>

        <span>{minRead} min read</span>
      </nav>
    </>
  );
}
