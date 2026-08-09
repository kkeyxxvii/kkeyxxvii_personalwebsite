"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import "./showcase.css";
import Preloader from "./Preloader";
import Hero from "./Hero";
import Manifesto from "./Manifesto";
import SelectedWork from "./SelectedWork";
import Capabilities from "./Capabilities";
import About from "./About";
import Contact from "./Contact";

gsap.registerPlugin(ScrollTrigger);

export default function ShowcaseExperience() {
  const [loaded, setLoaded] = useState(false);
  const handleLoaded = useCallback(() => setLoaded(true), []);
  const progressRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  /* Mark the route so globals.css hides the portfolio chrome. */
  useEffect(() => {
    const el = document.documentElement;
    el.dataset.showcase = "";
    return () => { delete el.dataset.showcase; };
  }, []);

  /* Lenis smooth scroll wired into the GSAP ticker + ScrollTrigger. */
  useEffect(() => {
    const touch = !window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let lenis: Lenis | null = null;
    if (!touch && !reduced) {
      lenis = new Lenis({ duration: 1.1, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      if (process.env.NODE_ENV !== "production") {
        (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
      }
      const raf = (time: number) => lenis!.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      return () => {
        gsap.ticker.remove(raf);
        lenis!.destroy();
      };
    }
  }, []);

  /* Top scroll-progress bar. */
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? h.scrollTop / max : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Custom cursor (fine-pointer only) with lerp + hover growth. */
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    let raf = 0;

    const move = (e: PointerEvent) => { mx = e.clientX; my = e.clientY; };
    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    const over = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("[data-hoverable], a, button")) ring.classList.add("is-hover");
    };
    const out = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("[data-hoverable], a, button")) ring.classList.remove("is-hover");
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("mouseover", over, { passive: true });
    document.addEventListener("mouseout", out, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
    };
  }, []);

  /* Refresh ScrollTrigger once everything is mounted + loaded. */
  useEffect(() => {
    if (loaded) ScrollTrigger.refresh();
  }, [loaded]);

  return (
    <div className="sc-root">
      <div className="sc-progress" ref={progressRef} />
      <div className="sc-cursor-ring" ref={ringRef} />
      <div className="sc-cursor-dot" ref={dotRef} />

      <Preloader onDone={handleLoaded} />

      <Hero start={loaded} />
      <Manifesto />
      <SelectedWork />
      <Capabilities />
      <About />
      <Contact />
    </div>
  );
}
