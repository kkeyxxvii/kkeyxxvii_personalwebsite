"use client";

import Link from "next/link";

const MONO = "var(--font-ibm-mono, var(--font-geist-mono), monospace)";

interface Props {
  title: string;
  minRead: number;
}

export default function CaseStudyBreadcrumb({ title, minRead }: Props) {
  return (
    <div
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
        style={{ color: "#888888", textDecoration: "none", transition: "color .25s ease" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#181617")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#888888")}
      >
        Selected work
      </Link>

      <span style={{ color: "#d6d6d6" }}>/</span>

      <span style={{ color: "#606060" }}>{title}</span>

      <span style={{ color: "#d6d6d6" }}>·</span>

      <span>{minRead} min read</span>
    </div>
  );
}
