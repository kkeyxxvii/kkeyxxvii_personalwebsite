"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CAPABILITIES, MARQUEE } from "./data";

gsap.registerPlugin(ScrollTrigger);

export default function Capabilities() {
  const rootRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      gsap.from(".sc-cap__row", {
        y: 28, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.08,
        scrollTrigger: { trigger: ".sc-cap__list", start: "top 82%" },
      });
      gsap.from(".sc-cap__lead", {
        y: 30, opacity: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".sc-cap__lead", start: "top 85%" },
      });

      // Seamless marquee (track holds two copies; move by -50%).
      if (!reduced && marqueeRef.current) {
        gsap.to(marqueeRef.current, {
          xPercent: -50,
          duration: 22,
          ease: "none",
          repeat: -1,
        });
      }
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const items = [...MARQUEE, ...MARQUEE];

  return (
    <section className="sc-section" ref={rootRef} id="capabilities">
      <div className="sc-wrap" style={{ marginBottom: "clamp(56px,9vh,110px)" }}>
        <div className="sc-cap__grid">
          <div>
            <span className="sc-eyebrow" style={{ marginBottom: 24, display: "inline-flex" }}>Capabilities</span>
            <p className="sc-cap__lead">
              A full-stack design practice — from the first whiteboard sketch to the
              last line of shipped interface code.
            </p>
          </div>

          <div className="sc-cap__list">
            {CAPABILITIES.map((c) => (
              <div className="sc-cap__row" key={c.num} data-hoverable>
                <span className="sc-cap__num">{c.num}</span>
                <div>
                  <div className="sc-cap__rowtitle">{c.title}</div>
                  <div className="sc-cap__rowdesc">{c.desc}</div>
                </div>
                <span className="sc-cap__arrow" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sc-marquee">
        <div className="sc-marquee__track" ref={marqueeRef}>
          {items.map((m, i) => (
            <span className="sc-marquee__item" key={i}>{m}<span>✦</span></span>
          ))}
        </div>
      </div>
    </section>
  );
}
