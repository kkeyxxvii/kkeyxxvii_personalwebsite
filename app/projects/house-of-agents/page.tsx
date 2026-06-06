import type { Metadata } from "next";
import HouseOfAgentsCaseStudy from "@/components/HouseOfAgentsCaseStudy";

export const metadata: Metadata = {
  title: "AI Workforce Platform for Sales Teams | Kartikey Panchal",
  description:
    "Case study: End-to-end design of House of Agents — an AI workforce SaaS where sales teams deploy autonomous AI calling agents that qualify leads and schedule meetings.",
};

export default function HouseOfAgentsPage() {
  return <HouseOfAgentsCaseStudy />;
}
