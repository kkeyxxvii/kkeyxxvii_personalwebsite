import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

import CustomCursor  from "@/components/CustomCursor";
import Navbar        from "@/components/Navbar";
import Footer        from "@/components/Footer";
import ChatPanel     from "@/components/ChatPanel";
import ShiftLayout   from "@/components/ShiftLayout";
import AboutModal    from "@/components/AboutModal";
import { ChatProvider } from "@/components/ChatContext";

/* ── BDO Grotesk — display and UI ───────────────
   Self-hosted. Ships the five cuts the site actually sets; BDO has a
   true 600, so no weight has to resolve to a neighbour. */
const bdoGrotesk = localFont({
  variable: "--font-bdo",
  display:  "swap",
  src: [
    { path: "./fonts/BDOGrotesk-Light.woff2",    weight: "300", style: "normal" },
    { path: "./fonts/BDOGrotesk-Regular.woff2",  weight: "400", style: "normal" },
    { path: "./fonts/BDOGrotesk-Medium.woff2",   weight: "500", style: "normal" },
    { path: "./fonts/BDOGrotesk-DemiBold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/BDOGrotesk-Bold.woff2",     weight: "700", style: "normal" },
  ],
});

/* ── Inter stays as the metric-compatible fallback ── */
const inter = Inter({
  variable: "--font-inter",
  subsets:  ["latin"],
  weight:   ["300", "400", "500", "600"],
  display:  "swap",
});

/* ── Mono labels & status text ────────────────── */
const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-mono",
  subsets:  ["latin"],
  weight:   ["400", "500"],
  display:  "swap",
});

/* ── Keep Geist Mono for case-study code blocks ─ */
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title:       "Kartikey Panchal | Product Designer + Designing Human × AI Experiences",
  description: "Senior Product Designer with 9+ years crafting intuitive digital products across SaaS, Fintech, and E-commerce. Designing at the intersection of user needs, business goals, and AI.",
  icons:       { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bdoGrotesk.variable} ${inter.variable} ${ibmPlexMono.variable} ${geistMono.variable} h-full antialiased`}>
      {/* suppressHydrationWarning: browser extensions (e.g. Grammarly) inject body
          attributes before hydration; only attribute-level mismatches are suppressed */}
      <body className="h-full overflow-x-hidden" style={{ background: "#f5f5f7" }} suppressHydrationWarning>

        {/* Skip link — first focusable element, for keyboard users */}
        <a href="#main-content" className="skip-link">Skip to content</a>

        {/* Custom cursor — outside everything so it's never shifted */}
        <CustomCursor />

        {/*
          ChatProvider wraps everything so Navbar, ShiftLayout, and ChatPanel
          all share the same open/close state.

          Structure:
            ChatProvider
            ├── ShiftLayout        ← slides LEFT on desktop when panel opens
            │   ├── Navbar         ← fixed, but re-anchored to ShiftLayout's transform
            │   ├── <main>         ← page content
            │   └── Footer
            └── ChatPanel          ← fixed RIGHT, outside ShiftLayout so it never shifts
        */}
        <ChatProvider>

          {/* Shell — everything that slides LEFT */}
          <ShiftLayout>
            <Navbar />
            <main id="main-content" className="flex-1 pt-14">{children}</main>
            <Footer />
          </ShiftLayout>

          {/* Panel — fixed to the right viewport edge, slides IN independently */}
          <ChatPanel />

          {/* About — full-screen modal overlay */}
          <AboutModal />

        </ChatProvider>

      </body>
    </html>
  );
}
