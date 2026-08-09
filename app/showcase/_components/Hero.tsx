"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import HeroScene from "./HeroScene";

export default function Hero({ start }: { start: boolean }) {
  const rootRef = useRef<HTMLElement>(null);
  const done = useRef(false);

  useEffect(() => {
    if (!start || done.current) return;
    done.current = true;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set("[data-hero-anim]", { opacity: 1, y: 0 });
        gsap.set(".sc-hero__name .sc-line > span", { yPercent: 0 });
        return;
      }
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(".sc-hero__name .sc-line > span", {
        yPercent: 115,
        duration: 1.1,
        stagger: 0.08,
      });
      tl.from(".sc-hero__topline [data-hero-anim]", { y: 20, opacity: 0, duration: 0.7, stagger: 0.1 }, "-=0.7");
      tl.from(".sc-hero__meta [data-hero-anim]", { y: 24, opacity: 0, duration: 0.8, stagger: 0.12 }, "-=0.5");
      tl.from(".sc-hero__canvas", { opacity: 0, duration: 1.4, ease: "power2.out" }, 0);
    }, rootRef);

    return () => ctx.revert();
  }, [start]);

  return (
    <section className="sc-hero" ref={rootRef}>
      <HeroScene className="sc-hero__canvas" />

      <div className="sc-wrap sc-hero__inner">
        <div className="sc-hero__topline">
          <span className="sc-eyebrow" data-hero-anim>Product Designer — Portfolio ’25</span>
          <span className="sc-eyebrow" data-hero-anim style={{ textAlign: "right" }}>
            Available for select work
          </span>
        </div>

        <h1 className="sc-hero__name">
          <span className="sc-line"><span>Mira</span></span>
          <span className="sc-line"><span><em>Solène</em></span></span>
        </h1>

        <div className="sc-hero__meta">
          <p className="sc-hero__role" data-hero-anim>
            Designing at the intersection of <strong style={{ color: "var(--sc-text)" }}>motion,
            systems &amp; emotion</strong> — crafting digital products that feel inevitable.
          </p>
          <span className="sc-scrollcue" data-hero-anim>
            <span className="sc-scrollcue__dot" />
            Scroll to explore
          </span>
        </div>
      </div>
    </section>
  );
}
