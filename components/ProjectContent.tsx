"use client";

import Link from "next/link";
import { FadeUp, StaggerList, StaggerItem } from "@/components/Animate";

interface ProjectContentProps {
  title: string;
  subtitle: string;
  description: string;
}

export default function ProjectContent({ title, subtitle, description }: ProjectContentProps) {
  return (
    <div className="px-6 md:px-10 pt-24 pb-16">

      {/* Back link */}
      <FadeUp delay={0}>
        <Link
          href="/"
          className="mb-8 inline-block hover-underline transition-colors"
          style={{
            fontFamily:    "var(--font-ibm-mono, var(--font-geist-mono), monospace)",
            fontSize:      12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color:         "#888888",
            textDecoration: "none",
          }}
        >
          ← Selected work
        </Link>
      </FadeUp>

      {/* Title */}
      <FadeUp delay={0.08}>
        <h1 className="text-[clamp(1.5rem,3vw,3.25rem)] leading-[1.15] font-normal text-[#181617] mb-4 font-[family-name:var(--font-geist-sans)]">
          {title}
        </h1>
      </FadeUp>

      {/* Subtitle badge */}
      <FadeUp delay={0.14}>
        <p className="text-xs tracking-[0.15em] uppercase text-[#9ca3af] mb-12">
          {subtitle}
        </p>
      </FadeUp>

      {/* Description + coming soon */}
      <StaggerList
        className="max-w-3xl space-y-6"
        delayChildren={0.22}
        staggerChildren={0.1}
      >
        <StaggerItem>
          <p className="text-sm text-[#4a4a5a] leading-relaxed">{description}</p>
        </StaggerItem>
        <StaggerItem>
          <p className="text-sm text-[#4a4a5a] leading-relaxed">
            This one is covered as a summary. The written-up case studies —
            with decisions, trade-offs, and measured results — are on the{" "}
            <Link href="/" className="hover-underline" style={{ color: "#181617" }}>
              work page
            </Link>.
          </p>
        </StaggerItem>
      </StaggerList>
    </div>
  );
}
