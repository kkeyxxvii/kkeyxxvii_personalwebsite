"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMagnetic } from "./hooks";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const rootRef = useRef<HTMLElement>(null);
  const ctaRef = useMagnetic<HTMLAnchorElement>(0.4);
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("en-US", {
        hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris", hour12: false,
      }).format(new Date());
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".sc-contact__cta", {
        y: 60, opacity: 0, duration: 1, ease: "power4.out",
        scrollTrigger: { trigger: ".sc-contact__cta", start: "top 88%" },
      });
      gsap.from(".sc-contact__row > *", {
        y: 24, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.12,
        scrollTrigger: { trigger: ".sc-contact__row", start: "top 90%" },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="sc-section sc-contact" ref={rootRef} id="contact">
      <div className="sc-wrap">
        <span className="sc-eyebrow" style={{ marginBottom: 28, display: "inline-flex" }}>
          Have a project in mind?
        </span>
        <div>
          <a
            className="sc-contact__cta sc-mag"
            href="mailto:hello@mirasolene.design"
            ref={ctaRef}
            data-cursor="Say hi"
            data-hoverable
          >
            Let’s talk →
          </a>
        </div>

        <div className="sc-contact__row">
          <div>
            <div className="sc-eyebrow" style={{ marginBottom: 14 }}>Email</div>
            <a className="sc-contact__cta" style={{ fontSize: "clamp(18px,2.4vw,28px)" }} href="mailto:hello@mirasolene.design">
              hello@mirasolene.design
            </a>
          </div>
          <div className="sc-contact__links">
            <a href="#" data-hoverable>Twitter / X</a>
            <a href="#" data-hoverable>LinkedIn</a>
            <a href="#" data-hoverable>Dribbble</a>
            <a href="#" data-hoverable>Read.cv</a>
          </div>
        </div>

        <div className="sc-contact__foot">
          <span>© 2025 Mira Solène — Fictional portfolio</span>
          <span>Paris, FR {time && `· ${time} CET`}</span>
          <span>Built with Three.js · GSAP · Lenis</span>
        </div>
      </div>
    </section>
  );
}
