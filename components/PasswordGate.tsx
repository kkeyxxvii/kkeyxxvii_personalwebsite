"use client";

/**
 * PasswordGate — NDA-protected case study gate.
 * Shows a lock screen with password entry and a "Connect for a walkthrough" CTA.
 * Remembers the unlocked state in sessionStorage for the current tab session.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const MONO  = "var(--font-geist-mono),monospace";
const SERIF = "Georgia,'Times New Roman',serif";

interface PasswordGateProps {
  password:     string;
  title:        string;
  subtitle:     string;
  storageKey:   string;
  children:     React.ReactNode;
  contactHref?: string;
}

export default function PasswordGate({
  password,
  title,
  subtitle,
  storageKey,
  children,
  contactHref = "https://www.linkedin.com/in/kartikeypanchal",
}: PasswordGateProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [input,    setInput]    = useState("");
  const [error,    setError]    = useState(false);
  const [shake,    setShake]    = useState(false);
  const [ready,    setReady]    = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Check sessionStorage on mount */
  useEffect(() => {
    try {
      if (sessionStorage.getItem(storageKey) === "1") setUnlocked(true);
    } catch { /* noop */ }
    setReady(true);
  }, [storageKey]);

  /* Focus input when gate is visible */
  useEffect(() => {
    if (ready && !unlocked) setTimeout(() => inputRef.current?.focus(), 300);
  }, [ready, unlocked]);

  function attempt() {
    if (input.trim().toLowerCase() === password.toLowerCase()) {
      try { sessionStorage.setItem(storageKey, "1"); } catch { /* noop */ }
      setError(false);
      setUnlocked(true);
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setInput("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  if (!ready) return null;
  if (unlocked) return <>{children}</>;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5"
      style={{ background: "#f5f5f7" }}
    >
      {/* Back link */}
      <div className="absolute top-6 left-8">
        <Link
          href="/"
          className="flex items-center gap-2 transition-all hover:opacity-100"
          style={{ color: "rgba(24,22,23,0.35)", fontSize: 13, opacity: 0.5,
            fontFamily: MONO, letterSpacing: "0.04em" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#181617")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(24,22,23,0.35)")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm"
      >
        {/* Lock icon */}
        <div className="flex justify-center mb-7">
          <motion.div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              background:           "rgba(255,255,255,0.92)",
              backdropFilter:       "blur(12px) saturate(160%)",
              WebkitBackdropFilter: "blur(12px) saturate(160%)",
              border:               "0.5px solid rgba(24,22,23,0.07)",
              boxShadow:            "0 4px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
            }}
            animate={{
              boxShadow: [
                "0 4px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
                "0 6px 24px rgba(0,0,0,0.09), inset 0 1px 0 rgba(255,255,255,0.9)",
                "0 4px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
              ],
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="rgba(24,22,23,0.4)" strokeWidth="1.5" strokeLinecap="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </motion.div>
        </div>

        {/* NDA label */}
        <p
          className="text-center uppercase mb-4"
          style={{ fontFamily: MONO, fontSize: 12, color: "rgba(24,22,23,0.3)", letterSpacing: "0.2em" }}
        >
          NDA Protected
        </p>

        {/* Title */}
        <h1
          className="text-center mb-3"
          style={{
            fontFamily: SERIF,
            fontSize:   "clamp(1.4rem,3vw,1.75rem)",
            fontWeight: 400,
            color:      "#181617",
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        <p
          className="text-center mb-10"
          style={{ fontSize: 13, color: "rgba(24,22,23,0.4)", lineHeight: 1.65 }}
        >
          {subtitle}
        </p>

        {/* Password field */}
        <motion.div
          animate={shake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : { x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="flex items-center gap-2 rounded-xl px-4 py-3 mb-2"
            style={{
              background:           "rgba(255,255,255,0.92)",
              backdropFilter:       "blur(12px) saturate(160%)",
              WebkitBackdropFilter: "blur(12px) saturate(160%)",
              border:               `0.5px solid ${error ? "rgba(239,68,68,0.4)" : "rgba(24,22,23,0.08)"}`,
              boxShadow:            "0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)",
              transition:           "border-color 0.2s",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="rgba(24,22,23,0.28)" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <input
              ref={inputRef}
              type="password"
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(false); }}
              onKeyDown={(e) => e.key === "Enter" && attempt()}
              placeholder="Enter password"
              className="flex-1 bg-transparent outline-none placeholder:text-[rgba(24,22,23,0.28)]"
              style={{
                fontSize:      14,
                color:         "#181617",
                letterSpacing: input ? "0.15em" : "0",
              }}
            />
            {input && (
              <button
                onClick={attempt}
                className="shrink-0 transition-opacity hover:opacity-60 cursor-pointer"
                style={{ color: "rgba(24,22,23,0.4)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            )}
          </div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-center mb-2"
                style={{ fontSize: 11, color: "rgba(239,68,68,0.8)", fontFamily: MONO }}
              >
                Incorrect password. Try again or connect below.
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Submit button */}
        <motion.button
          onClick={attempt}
          disabled={!input.trim()}
          className="w-full py-3 rounded-xl mb-6 cursor-pointer disabled:opacity-40"
          style={{
            background: "#181617",
            border:     "none",
            color:      "rgba(255,255,255,0.9)",
            fontSize:   13,
            fontWeight: 500,
            boxShadow:  "0 2px 8px rgba(24,22,23,0.14), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
          whileHover={{ background: "#2e2a2b" }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15 }}
        >
          View Case Study
        </motion.button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px" style={{ background: "rgba(24,22,23,0.07)" }} />
          <span style={{ fontSize: 11, color: "rgba(24,22,23,0.25)", fontFamily: MONO }}>or</span>
          <div className="flex-1 h-px" style={{ background: "rgba(24,22,23,0.07)" }} />
        </div>

        {/* LinkedIn CTA — card style matching "View the full Figma file" banner */}
        <Link
          href={contactHref}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full"
        >
          <motion.div
            className="w-full flex items-center justify-between gap-4 cursor-pointer"
            style={{
              background:   "#f3f4f6",
              borderRadius: 16,
              padding:      "20px 24px",
            }}
            whileHover={{ background: "#eceef2" }}
            transition={{ duration: 0.15 }}
          >
            {/* Left — text */}
            <div className="flex flex-col gap-1 min-w-0">
              <span style={{ fontSize: 14, fontWeight: 600, color: "#181617", lineHeight: 1.3 }}>
                Request a case study walkthrough
              </span>
              <span style={{ fontSize: 12, color: "rgba(24,22,23,0.45)", lineHeight: 1.5 }}>
                I&apos;ll share the full Figma file and walk you through every screen personally.
              </span>
            </div>

            {/* Right — gradient pill button */}
            <motion.div
              className="shrink-0 flex items-center gap-1.5 px-4 py-2.5"
              style={{
                background:   "linear-gradient(135deg, #FF2929, #FFD029)",
                borderRadius: 999,
              }}
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.15 }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: "white", whiteSpace: "nowrap" }}>
                Reach out on LinkedIn
              </span>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </motion.div>
          </motion.div>
        </Link>

        {/* Footer note */}
        <p
          className="text-center mt-8"
          style={{ fontSize: 11, color: "rgba(24,22,23,0.2)", lineHeight: 1.6 }}
        >
          This case study contains proprietary design work shared under NDA.<br />
          Password available on request.
        </p>
      </motion.div>
    </div>
  );
}
