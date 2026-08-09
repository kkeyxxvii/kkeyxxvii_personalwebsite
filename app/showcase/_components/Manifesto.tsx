"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LINES = [
  [{ t: "Great products", c: "" }],
  [{ t: "don’t announce", c: "sc-dim" }],
  [{ t: "themselves —", c: "sc-dim" }],
  [{ t: "they ", c: "" }, { t: "feel", c: "sc-hl" }, { t: " inevitable.", c: "" }],
];

export default function Manifesto() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      const spans = gsap.utils.toArray<HTMLElement>(".sc-manifesto__text .sc-line > span");
      if (reduced) { gsap.set(spans, { yPercent: 0, opacity: 1 }); return; }
      gsap.from(spans, {
        yPercent: 110,
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.09,
        scrollTrigger: { trigger: ".sc-manifesto__text", start: "top 78%" },
      });
      gsap.from(".sc-manifesto__foot > *", {
        y: 30, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.12,
        scrollTrigger: { trigger: ".sc-manifesto__foot", start: "top 88%" },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="sc-section sc-manifesto" ref={rootRef} id="about-mini">
      <div className="sc-wrap">
        <p className="sc-manifesto__text">
          {LINES.map((line, i) => (
            <span className="sc-line" key={i}>
              <span>
                {line.map((seg, j) => (
                  <span key={j} className={seg.c}>{seg.t}</span>
                ))}
              </span>
            </span>
          ))}
        </p>

        <div className="sc-manifesto__foot">
          <span className="sc-eyebrow">The approach</span>
          <p>
            I work across strategy, interaction and code — pairing rigorous systems
            thinking with motion that gives interfaces a pulse. The result is software
            people don’t just use, but remember.
          </p>
        </div>
      </div>
    </section>
  );
}
