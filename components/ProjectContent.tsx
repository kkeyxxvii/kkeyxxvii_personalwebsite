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
          className="text-sm text-[#9ca3af] hover:text-[#FF2929] transition-colors mb-8 inline-block hover-underline"
        >
          ← Back to work
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
          <p className="text-sm text-[#9ca3af] leading-relaxed">
            Full case study coming soon. Check back later for detailed visuals and process.
          </p>
        </StaggerItem>
      </StaggerList>
    </div>
  );
}
