"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS, type Project } from "./data";

gsap.registerPlugin(ScrollTrigger);

function Card({ p }: { p: Project }) {
  return (
    <a className="sc-card" href="#contact" data-cursor="View" data-hoverable>
      <div className="sc-card__art" style={{ ["--art-a" as string]: p.hueA, ["--art-b" as string]: p.hueB }} />
      <div className="sc-card__overlay" />
      <div className="sc-card__cta" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M7 17 17 7M17 7H9M17 7v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="sc-card__body">
        <span className="sc-card__idx">{p.idx} — {p.year}</span>
        <h3 className="sc-card__name">{p.name}</h3>
        <p className="sc-card__tag">{p.tag}</p>
        <div className="sc-card__metaline">
          <span className="sc-card__chip">{p.role}</span>
          <span className="sc-card__chip">{p.discipline}</span>
        </div>
      </div>
    </a>
  );
}

export default function SelectedWork() {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    // Desktop / fine-pointer: pin the section and translate the track horizontally.
    mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
      const track = trackRef.current;
      const pin = pinRef.current;
      if (!track || !pin) return;

      const getScroll = () => track.scrollWidth - window.innerWidth + 96;

      const tween = gsap.to(track, {
        x: () => -getScroll(),
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: () => "+=" + getScroll(),
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Header reveal
      gsap.from(".sc-work__head > *", {
        y: 30, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.12,
        scrollTrigger: { trigger: ".sc-work__head", start: "top 85%" },
      });

      return () => { tween.kill(); };
    });

    // Mobile: simple fade-up on the stacked cards.
    mm.add("(max-width: 900px)", () => {
      gsap.from(".sc-work__stack .sc-card", {
        y: 40, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.1,
        scrollTrigger: { trigger: ".sc-work__stack", start: "top 80%" },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="sc-work" ref={rootRef} id="work">
      <div className="sc-wrap" style={{ paddingTop: "clamp(80px,12vh,160px)" }}>
        <div className="sc-work__head">
          <h2 className="sc-work__title">Selected<br />Work</h2>
          <span className="sc-eyebrow">{PROJECTS.length} projects — 2023–2025</span>
        </div>
      </div>

      {/* Desktop pinned horizontal track */}
      <div className="sc-work__pin" ref={pinRef}>
        <div className="sc-work__track" ref={trackRef}>
          {PROJECTS.map((p) => <Card key={p.idx} p={p} />)}
        </div>

        {/* Mobile stacked fallback */}
        <div className="sc-wrap sc-work__stack">
          {PROJECTS.map((p) => <Card key={p.idx} p={p} />)}
        </div>
      </div>
    </section>
  );
}
