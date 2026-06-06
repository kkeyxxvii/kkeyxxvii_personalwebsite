import type { Metadata } from "next";
import SchlageIPCaseStudy from "@/components/SchlageIPCaseStudy";

export const metadata: Metadata = {
  title: "Schlage ENGAGE IP Integration | Kartikey Panchal",
  description:
    "End-to-end UX design for direct IP wireless lock support in Genea — enabling Schlage NDEB/LEB locks without Mercury controllers via the ENGAGE Gateway.",
};

export default function SchlageIPPage() {
  return <SchlageIPCaseStudy />;
}
