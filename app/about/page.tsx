import type { Metadata } from "next";
import AboutContent from "@/components/AboutContent";

export const metadata: Metadata = {
  title: "About | Kartikey Panchal",
  description: "Senior Product Designer, 9 years in enterprise SaaS and security. Currently at Genea. Based in Ahmedabad, India.",
};

export default function AboutPage() {
  return <AboutContent />;
}
