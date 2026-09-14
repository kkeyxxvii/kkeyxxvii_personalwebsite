"use client";

import Link from "next/link";
import { useState } from "react";

const MONO = "var(--font-ibm-mono, var(--font-geist-mono), monospace)";

export default function Footer() {
  const [liked, setLiked] = useState(false);

  return (
    <footer
      className="px-6 py-8 md:px-10 mt-auto"
      style={{
        borderTop:             "0.5px solid rgba(24,22,23,0.07)",
        background:            "rgba(255,255,255,0.72)",
        backdropFilter:        "blur(16px) saturate(160%)",
        WebkitBackdropFilter:  "blur(16px) saturate(160%)" as string,
      }}
    >
      {/* Contact CTA — clear next step for visitors who reached the end */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 mb-6"
        style={{ borderBottom: "0.5px solid rgba(24,22,23,0.07)" }}
      >
        <p
          style={{
            margin:     0,
            fontFamily: "var(--font-nunito, var(--font-inter), sans-serif)",
            fontSize:   16,
            fontWeight: 300,
            color:      "#181617",
          }}
        >
          Have a project in mind, or just want to talk design?
        </p>
        <Link
          href="mailto:kkeyxxvii@gmail.com"
          aria-label="Email kkeyxxvii@gmail.com"
          style={{
            fontFamily:    MONO,
            fontSize:      12,
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
            color:         "#181617",
            textDecoration: "none",
            padding:       "10px 18px",
            borderRadius:  999,
            background:    "rgba(24,22,23,0.05)",
            border:        "0.5px solid rgba(24,22,23,0.08)",
            boxShadow:     "0 1px 4px rgba(0,0,0,0.04)",
            whiteSpace:    "nowrap" as const,
            transition:    "background .22s ease",
            alignSelf:     "flex-start",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(24,22,23,0.09)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(24,22,23,0.05)")}
        >
          kkeyxxvii@gmail.com ↗
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

        {/* Left: Credit */}
        <div
          className="flex items-center gap-1"
          style={{
            fontFamily:    MONO,
            fontSize:      12,
            letterSpacing: "0.15em",
            textTransform: "uppercase" as const,
            color:         "#888888",
          }}
        >
          <span>Designed + Coded with</span>
          <button onClick={() => setLiked(!liked)} className="cursor-pointer transition-colors">
            {liked ? (
              <span style={{ background: "linear-gradient(135deg, #FF2929, #FFD029)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>♥</span>
            ) : (
              <span style={{ color: "#888888" }}>♡</span>
            )}
          </button>
          <span>by Kartikey</span>
        </div>

        {/* Right: Social Links */}
        <nav
          aria-label="Social links"
          className="flex items-center flex-wrap gap-x-6 gap-y-2"
          style={{
            fontFamily:    MONO,
            fontSize:      12,
            letterSpacing: "0.15em",
            textTransform: "uppercase" as const,
            color:         "#888888",
          }}
        >
          {[
            { label: "LinkedIn",  href: "https://www.linkedin.com/in/kkeyxxvii"   },
            { label: "Instagram", href: "https://www.instagram.com/kkeyxxvii.uiux/"     },
            { label: "Layers",    href: "https://layers.to/kkeyxxvii"                   },
            { label: "Dribbble",  href: "https://dribbble.com/kkeyxxvii"                },
            { label: "Medium",    href: "https://medium.com/@kkeyxxvii_40050"           },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#888888", textDecoration: "none", transition: "color .25s ease" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, #FF2929, #FFD029)";
                (e.currentTarget.style as any).webkitBackgroundClip = "text";
                (e.currentTarget.style as any).webkitTextFillColor = "transparent";
                e.currentTarget.style.backgroundClip = "text";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "none";
                (e.currentTarget.style as any).webkitBackgroundClip = "";
                (e.currentTarget.style as any).webkitTextFillColor = "";
                e.currentTarget.style.backgroundClip = "";
                e.currentTarget.style.color = "#888888";
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

      </div>
    </footer>
  );
}
