import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import ShowcaseExperience from "./_components/ShowcaseExperience";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display-sc",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mira Solène — Product Designer",
  description:
    "An immersive portfolio for Mira Solène, a fictional product designer working at the intersection of motion, systems & emotion. Built with Three.js, GSAP & Lenis.",
};

export default function ShowcasePage() {
  return (
    <div className={spaceGrotesk.variable}>
      <ShowcaseExperience />
    </div>
  );
}
