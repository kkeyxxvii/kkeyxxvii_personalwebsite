"use client";

/**
 * ShiftLayout — responsive push layout for the KKEYXXVIIAI panel.
 *
 * Desktop (≥768 px):
 *   Uses margin-right instead of translateX so the content area actually
 *   SHRINKS and reflows as the panel opens — not just shifts off-screen.
 *   The navbar's right edge is synced via a CSS custom property
 *   (--nav-right) so it also shrinks to match.
 *
 * Mobile (<768 px):
 *   No shift — the panel overlays full-screen with a backdrop.
 */

import { useEffect, useState, type ReactNode } from "react";
import { useChatContext } from "./ChatContext";
import { PANEL_WIDTH, EASE, DURATION } from "@/lib/panelConstants";

export { PANEL_WIDTH, EASE, DURATION };

export default function ShiftLayout({ children }: { children: ReactNode }) {
  const { open } = useChatContext();
  const [isDesktop, setIsDesktop] = useState(false);

  /* ── Detect desktop breakpoint ─────────────────── */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* ── Sync CSS custom property → Navbar reads it ── */
  useEffect(() => {
    const target = open && isDesktop ? `${PANEL_WIDTH}px` : "0px";
    document.documentElement.style.setProperty("--panel-inset", target);
  }, [open, isDesktop]);

  /* ── Lock scroll on mobile while panel is open ─── */
  useEffect(() => {
    document.body.style.overflow = (!isDesktop && open) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open, isDesktop]);

  /* margin-right shrinks the shell → content reflows */
  const marginRight = open && isDesktop ? PANEL_WIDTH : 0;

  return (
    <div
      style={{
        marginRight:    `${marginRight}px`,
        transition:     `margin-right ${DURATION} ${EASE}`,
        willChange:     "margin-right",
        minHeight:      "100vh",
        display:        "flex",
        flexDirection:  "column",
        background:     "#ffffff",
      }}
    >
      {children}
    </div>
  );
}
