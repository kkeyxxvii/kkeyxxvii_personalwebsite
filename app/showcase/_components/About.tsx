"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { STATS } from "./data";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      gsap.from(".sc-about__portrait", {
        y: 50, opacity: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: ".sc-about__grid", start: "top 80%" },
      });
      gsap.from(".sc-about__bio", {
        y: 30, opacity: 0, duration: 0.9, ease: "power3.out", delay: 0.1,
        scrollTrigger: { trigger: ".sc-about__grid", start: "top 80%" },
      });

      // Count-up stats
      gsap.utils.toArray<HTMLElement>(".sc-stat__num em").forEach((el) => {
        const end = Number(el.dataset.to || "0");
        const obj = { v: 0 };
        if (reduced) { el.textContent = String(end); return; }
        gsap.to(obj, {
          v: end,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: ".sc-about__stats", start: "top 85%" },
          onUpdate: () => { el.textContent = String(Math.round(obj.v)); },
        });
      });
      gsap.from(".sc-about__stats > div", {
        y: 24, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.12,
        scrollTrigger: { trigger: ".sc-about__stats", start: "top 85%" },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="sc-section" ref={rootRef} id="about">
      <div className="sc-wrap">
        <span className="sc-eyebrow" style={{ marginBottom: 40, display: "inline-flex" }}>About</span>
        <div className="sc-about__grid">
          <div className="sc-about__portrait" aria-label="Portrait of Mira Solène" />
          <div>
            <p className="sc-about__bio">
              I’m Mira — a product designer with a decade spent turning ambitious ideas
              into products people love. I’ve led design at <strong>seed-stage startups</strong> and
              <strong> public companies</strong>, shaping everything from zero-to-one concepts to
              mature design systems. I believe the best interfaces are the ones you stop noticing.
            </p>

            <div className="sc-about__stats">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="sc-stat__num">
                    <em data-to={s.num}>0</em>{s.suffix}
                  </div>
                  <div className="sc-stat__label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
