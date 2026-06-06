import type { Metadata } from "next";
import AboutContent from "@/components/AboutContent";

export const metadata: Metadata = {
  title: "About | Kartikey Panchal",
  description: "Senior Product Designer based in Ahmedabad, India. Crafting seamless digital products at scale.",
};

export default function AboutPage() {
  return <AboutContent />;
}
