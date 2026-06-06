import type { Metadata } from "next";
import GeneaIOCaseStudy from "@/components/GeneaIOCaseStudy";

export const metadata: Metadata = {
  title: "Preventing Silent Misconfiguration | Kartikey Panchal",
  description:
    "How redesigning one form section stopped security hardware from behaving unpredictably — and what the data showed afterward.",
};

export default function GeneaIOPage() {
  return <GeneaIOCaseStudy />;
}
