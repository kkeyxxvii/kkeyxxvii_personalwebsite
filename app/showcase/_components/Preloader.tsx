"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Preloader({ onDone }: { onDone: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);
  const finished = useRef(false);

  useEffect(() => {
    const finish = () => {
      if (finished.current) return;
      finished.current = true;
      setHidden(true); // React-driven removal — independent of rAF
      onDone();
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { finish(); return; }

    // Safety net: if the GSAP/rAF timeline stalls (e.g. the tab is backgrounded
    // and requestAnimationFrame is throttled), still reveal the site.
    const safety = window.setTimeout(finish, 4000);

    const counter = { v: 0 };
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => { window.clearTimeout(safety); finish(); },
      });
      tl.to(counter, {
        v: 100,
        duration: 1.8,
        ease: "power2.inOut",
        onUpdate: () => {
          if (countRef.current) countRef.current.textContent = String(Math.round(counter.v));
        },
      });
      tl.to(barRef.current, { scaleX: 1, duration: 1.8, ease: "power2.inOut" }, 0);
      tl.to([countRef.current, ".sc-preloader__label"], { yPercent: -120, opacity: 0, duration: 0.6, ease: "power3.in" }, ">-0.1");
      tl.to(rootRef.current, { yPercent: -100, duration: 0.8, ease: "power4.inOut" }, ">-0.2");
    }, rootRef);

    return () => { window.clearTimeout(safety); ctx.revert(); };
  }, [onDone]);

  if (hidden) return null;

  return (
    <div className="sc-preloader" ref={rootRef}>
      <span className="sc-preloader__count" ref={countRef}>0</span>
      <span className="sc-preloader__label">Mira Solène<br />Portfolio ’25<br />Loading experience</span>
      <div className="sc-preloader__bar" ref={barRef} />
    </div>
  );
}
