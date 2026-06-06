import type { Metadata } from "next";
import { Inter, Nunito, IBM_Plex_Mono, Geist_Mono } from "next/font/google";
import "./globals.css";

import CustomCursor  from "@/components/CustomCursor";
import Navbar        from "@/components/Navbar";
import Footer        from "@/components/Footer";
import ChatPanel     from "@/components/ChatPanel";
import ShiftLayout   from "@/components/ShiftLayout";
import AboutModal    from "@/components/AboutModal";
import { ChatProvider } from "@/components/ChatContext";

/* ── Primary UI font ──────────────────────────── */
const inter = Inter({
  variable: "--font-inter",
  subsets:  ["latin"],
  weight:   ["300", "400", "500", "600"],
  display:  "swap",
});

/* ── Display / heading font ───────────────────── */
const nunito = Nunito({
  variable: "--font-nunito",
  subsets:  ["latin"],
  weight:   ["300", "400", "600", "700"],
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
    <html lang="en" className={`${inter.variable} ${nunito.variable} ${ibmPlexMono.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="h-full overflow-x-hidden" style={{ background: "#f5f5f7" }}>

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
            <main className="flex-1 pt-14">{children}</main>
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
