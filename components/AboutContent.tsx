"use client";

import Link from "next/link";
import Image from "next/image";
import { FadeUp, StaggerList, StaggerItem, ScrollReveal } from "@/components/Animate";

/* ─── Data ──────────────────────────────────────────────── */
const aboutImages = [
  { src: "/about/about1.png", alt: "About image 1" },
  { src: "/about/about2.png", alt: "About image 2" },
  { src: "/about/about3.png", alt: "About image 3" },
  { src: "/about/about4.png", alt: "About image 4" },
  { src: "/about/about6.png", alt: "About image 5" },
  { src: "/about/about7.png", alt: "About image 6" },
];

const GLANCE_BADGES = [
  "9+ Years Experience",
  "Senior Product Designer @ Genea",
  "Enterprise SaaS · Security · Fintech",
  "Design Systems Advocate",
  "Human × AI Explorer",
  "Builder of Internal Design Tools",
];

const INVENTORY = [
  {
    label: "UX Craft",
    pct:   94,
    sub:   "Interaction Design · Design Systems · Accessibility",
  },
  {
    label: "Systems Thinking",
    pct:   90,
    sub:   "Enterprise SaaS · Information Architecture · Product Strategy",
  },
  {
    label: "Human × AI",
    pct:   88,
    sub:   "Prompt Design · AI Workflows · Internal Tools",
  },
  {
    label: "Design Operations",
    pct:   84,
    sub:   "Process Improvement · Collaboration · Scalability",
  },
  {
    label: "Built with Curiosity",
    pct:   100,
    sub:   "Coffee · Side Projects · Continuous Learning",
  },
];

const KNOWN_FOR = [
  "Simplifying complex enterprise workflows",
  "Building scalable design systems",
  "Bridging design and engineering",
  "Improving design operations",
  "Shipping practical AI-powered solutions",
  "Turning ambiguity into direction",
];

const EXPLORING = [
  "AI-assisted UX workflows and prototyping",
  "Design system evolution for enterprise scale",
  "Design operations automation",
  "Enterprise workflow simplification through AI",
];

const SIDE_PROJECTS = [
  { name: "Panorama",                desc: "Life visualization — Figma Make-a-thon 2026"      },
  { name: "Bloom & Bond",            desc: "Pregnancy wellness PWA — React + Tailwind"         },
  { name: "AI Design Experiments",   desc: "Prototyping AI-native interfaces with Claude"      },
  { name: "Internal Workflow Tools", desc: "Design operations & team productivity"             },
];

/* ─── Style constants ───────────────────────────────────── */
const MONO = "font-[family-name:var(--font-ibm-mono,var(--font-geist-mono),monospace)]";

/** Thin hairline between sections */
const DIVIDER = "border-t border-[rgba(24,22,23,0.07)]";

/* ─── Section label ─────────────────────────────────────── */
function SectionLabel({ children }: { children: string }) {
  return (
    <p className={`text-[11px] tracking-[0.14em] uppercase text-[#888888] mb-6 ${MONO}`}>
      {children}
    </p>
  );
}

/* ══════════════════════════════════════════════════════════ */
export default function AboutContent() {
  return (
    /** Outer page wrapper — sets horizontal rhythm */
    <div className="px-6 md:px-10">

      {/** ── Max-width container — centres all content ── */}
      <div className="max-w-2xl">

        {/* ════════════════════════════════════════════
            § HERO
        ════════════════════════════════════════════ */}
        <section aria-labelledby="about-headline">
          <FadeUp className="pt-24 pb-3" delay={0}>
            <h1
              id="about-headline"
              className="text-[clamp(1.75rem,3.5vw,3.25rem)] leading-[1.15] font-normal text-[#181617] font-[family-name:var(--font-geist-sans)]"
            >
              I design enterprise software that feels <em className="italic">inevitable.</em>
            </h1>
          </FadeUp>

          <FadeUp className="pb-14" delay={0.12}>
            <p className={`text-xs tracking-[0.14em] uppercase text-[#888888] ${MONO}`}>
              Human judgment.&nbsp;&nbsp;AI acceleration.&nbsp;&nbsp;Better products.
            </p>
          </FadeUp>
        </section>

        {/* ════════════════════════════════════════════
            § ABOUT
        ════════════════════════════════════════════ */}
        <section aria-label="About Kartikey" className={`${DIVIDER} py-14`}>
          <SectionLabel>About</SectionLabel>
          <StaggerList className="space-y-4" delayChildren={0.1} staggerChildren={0.08}>

            <StaggerItem>
              <p className="text-sm text-[#4a4a5a] leading-relaxed">
                Senior Product Designer at{" "}
                <strong className="font-medium text-[#181617]">Genea</strong>,
                building access control and security products trusted by enterprise teams across North America.
              </p>
            </StaggerItem>

            <StaggerItem>
              <p className="text-sm text-[#4a4a5a] leading-relaxed">
                Over the last 9+ years, I&apos;ve evolved from graphic design to UX, product design, and systems
                thinking — helping transform complex workflows into experiences that feel simple, intuitive, and scalable.
              </p>
            </StaggerItem>

            <StaggerItem>
              <p className="text-sm text-[#4a4a5a] leading-relaxed">
                My work sits at the intersection of design craft, business impact, and emerging technology. Whether
                I&apos;m building design systems, improving operational workflows, or exploring AI-assisted experiences,
                I&apos;m focused on reducing complexity without sacrificing capability.
              </p>
            </StaggerItem>

            <StaggerItem>
              <p className="text-sm text-[#4a4a5a] leading-relaxed">
                I believe AI should augment human thinking, not replace it. It helps us move faster, explore further,
                and challenge assumptions — but great products still require human judgment, empathy, and taste.
              </p>
            </StaggerItem>

            <StaggerItem>
              <p className="text-sm text-[#4a4a5a] leading-relaxed">
                Today, I focus on enterprise SaaS, security platforms, design operations, and Human × AI
                collaboration — exploring how intelligent tools can help teams build better products while keeping
                humans at the center of every decision.
              </p>
            </StaggerItem>

          </StaggerList>
        </section>

        {/* ════════════════════════════════════════════
            § HUMAN × AI PHILOSOPHY
        ════════════════════════════════════════════ */}
        <ScrollReveal>
          <section aria-label="Human × AI Philosophy" className={`${DIVIDER} py-14`}>
            <SectionLabel>Human × AI Philosophy</SectionLabel>
            <blockquote
              className="text-[15px] text-[#181617] leading-[1.7] font-light"
              style={{ borderLeft: "2px solid #FF2929", paddingLeft: 20 }}
            >
              I believe the future of product design isn&apos;t Human <em>or</em> AI — it&apos;s Human{" "}
              <strong className="font-medium">×</strong> AI. The most meaningful products emerge when machine
              intelligence amplifies human creativity, judgment, and empathy.
            </blockquote>
          </section>
        </ScrollReveal>

        {/* ════════════════════════════════════════════
            § AT A GLANCE
        ════════════════════════════════════════════ */}
        <ScrollReveal>
          <section aria-label="At a Glance" className={`${DIVIDER} py-14`}>
            <SectionLabel>At a Glance</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {GLANCE_BADGES.map((badge) => (
                <span
                  key={badge}
                  className={`text-[12px] text-[#4a4a5a] font-light px-3 py-1.5 rounded-full ${MONO}`}
                  style={{
                    border:     "0.5px solid rgba(24,22,23,0.12)",
                    background: "#f6f6f6",
                    letterSpacing: "0.01em",
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* ════════════════════════════════════════════
            § INVENTORY
        ════════════════════════════════════════════ */}
        <ScrollReveal>
          <section aria-label="Inventory" className={`${DIVIDER} py-14`}>
            <SectionLabel>Inventory</SectionLabel>
            <div className="flex flex-col gap-7">
              {INVENTORY.map(({ label, pct, sub }) => (
                <div key={label}>
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className={`text-[11px] tracking-[0.1em] uppercase text-[#181617] font-medium shrink-0 ${MONO}`}>
                      {label}
                    </span>
                    <div className="flex-1 h-[2px] bg-[#ededed] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#181617] rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-[12px] text-[#888888] font-light leading-relaxed">{sub}</p>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* ════════════════════════════════════════════
            § KNOWN FOR
        ════════════════════════════════════════════ */}
        <ScrollReveal>
          <section aria-label="Known For" className={`${DIVIDER} py-14`}>
            <SectionLabel>Known For</SectionLabel>
            <div className="flex flex-col gap-3">
              {KNOWN_FOR.map((item, i) => (
                <div key={item} className="flex items-start gap-3">
                  <span className={`text-[10px] text-[#aaaaaa] pt-[3px] shrink-0 tabular-nums ${MONO}`}>
                    0{i + 1}
                  </span>
                  <span className="text-[14px] text-[#4a4a5a] font-light leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* ════════════════════════════════════════════
            § CURRENTLY EXPLORING
        ════════════════════════════════════════════ */}
        <ScrollReveal>
          <section aria-label="Currently Exploring" className={`${DIVIDER} py-14`}>
            <SectionLabel>Currently Exploring</SectionLabel>
            <ul className="flex flex-col gap-2.5">
              {EXPLORING.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-[#4a4a5a] font-light leading-relaxed">
                  <span className="text-[#FF2929] shrink-0 mt-[2px]">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </ScrollReveal>

        {/* ════════════════════════════════════════════
            § SIDE PROJECTS
        ════════════════════════════════════════════ */}
        <ScrollReveal>
          <section aria-label="Side Projects" className={`${DIVIDER} py-14`}>
            <SectionLabel>Side Projects</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SIDE_PROJECTS.map(({ name, desc }) => (
                <div
                  key={name}
                  className="px-4 py-3.5 rounded-xl"
                  style={{ border: "0.5px solid rgba(24,22,23,0.10)", background: "#f9f9f9" }}
                >
                  <p className="text-[13px] font-medium text-[#181617] mb-1">{name}</p>
                  <p className="text-[12px] text-[#888888] font-light leading-snug">{desc}</p>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

      </div>{/* /max-w container */}

      {/* ════════════════════════════════════════════
          § PHOTO GALLERY  (full-bleed, outside container)
      ════════════════════════════════════════════ */}
      <ScrollReveal>
        <section aria-label="Photos" className={`${DIVIDER} py-14`}>
          <div className="max-w-2xl mb-6">
            <SectionLabel>Photos</SectionLabel>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 md:-mx-10 md:px-10">
            {aboutImages.map((img, i) => (
              <div
                key={i}
                className="relative shrink-0 w-[200px] h-[240px] rounded-lg overflow-hidden bg-[#e8e8e8]"
              >
                <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="200px" />
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* ════════════════════════════════════════════
          § CONTACT
      ════════════════════════════════════════════ */}
      <div className="max-w-2xl">
        <ScrollReveal>
          <section aria-label="Contact" className={`${DIVIDER} py-14 pb-24`}>
            <SectionLabel>Contact</SectionLabel>
            <p className="text-sm text-[#4a4a5a] leading-relaxed mb-1">
              Open to senior and staff design roles at product-led, AI-forward companies.
            </p>
            <p className="text-sm text-[#4a4a5a] leading-relaxed">
              <Link
                href="https://www.linkedin.com/in/kartikeypanchal"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 font-medium text-[#181617] hover:text-[#FF2929] transition-colors"
              >
                Reach out on LinkedIn
              </Link>
              {" "}or{" "}
              <Link
                href="mailto:kkeyxxvii@gmail.com"
                className="underline underline-offset-2 font-medium text-[#181617] hover:text-[#FF2929] transition-colors"
              >
                send a note
              </Link>
              .
            </p>
          </section>
        </ScrollReveal>
      </div>

    </div>
  );
}
