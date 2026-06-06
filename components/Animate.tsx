"use client";

/**
 * Animate.tsx — Framer Motion primitives
 * Matching the exact animation language from rachelchen.tech:
 *  - Custom ease-out curve [0.22, 1, 0.36, 1]
 *  - Page entry: fade + slide up 16 px, 0.5 s
 *  - Section FadeUp: 20 px, 0.6 s, optional delay
 *  - Scroll reveal: whileInView, once, -50 px margin
 *  - Stagger list/grid: children cascade with 0.06–0.07 s intervals
 */

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/* ── Shared easing ─────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ══════════════════════════════════════════════════════════════════
   PAGE TRANSITION
   Wraps the full page content — fades & slides up on route mount
══════════════════════════════════════════════════════════════════ */
export function PageTransition({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   FADE UP  (mount-triggered, no scroll)
   Use for hero text and lead sections
══════════════════════════════════════════════════════════════════ */
export function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   SCROLL REVEAL
   Triggers once when the element enters the viewport
══════════════════════════════════════════════════════════════════ */
export function ScrollReveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.65, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   STAGGER LIST  (mount-triggered)
   Parent: staggers children on entry (experience rows, bullet lists)
══════════════════════════════════════════════════════════════════ */
const listItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE },
  },
};

export function StaggerList({
  children,
  className,
  delayChildren = 0.25,
  staggerChildren = 0.06,
}: {
  children: ReactNode;
  className?: string;
  delayChildren?: number;
  staggerChildren?: number;
}) {
  const containerVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren, delayChildren } },
  };
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={listItemVariants}>
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   STAGGER GRID  (mount-triggered)
   For project card grids and masonry — slightly slower stagger
══════════════════════════════════════════════════════════════════ */
const gridItemVariants: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: EASE },
  },
};

export function StaggerGrid({
  children,
  className,
  delayChildren = 0.3,
  staggerChildren = 0.07,
}: {
  children: ReactNode;
  className?: string;
  delayChildren?: number;
  staggerChildren?: number;
}) {
  const containerVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren, delayChildren } },
  };
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  );
}

export function StaggerGridItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={gridItemVariants}>
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   SCROLL STAGGER  (scroll-triggered stagger grid for Fun page)
══════════════════════════════════════════════════════════════════ */
export function ScrollStaggerGrid({
  children,
  className,
  staggerChildren = 0.07,
}: {
  children: ReactNode;
  className?: string;
  staggerChildren?: number;
}) {
  const containerVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren } },
  };
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
    >
      {children}
    </motion.div>
  );
}

export function ScrollStaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={gridItemVariants}>
      {children}
    </motion.div>
  );
}
