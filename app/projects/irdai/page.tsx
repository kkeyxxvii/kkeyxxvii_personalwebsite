import type { Metadata } from "next";
import IRDAICaseStudy from "@/components/IRDAICaseStudy";
import PasswordGate from "@/components/PasswordGate";

export const metadata: Metadata = {
  title: "IRDAI Government Website Redesign | Kartikey Panchal",
  description:
    "Case study: Redesigning the Insurance Regulatory and Development Authority of India website with full WCAG 2.1 AA compliance and GIGW guidelines.",
};

/* ─── Change this to your preferred password ────────── */
const CASE_STUDY_PASSWORD = "Kkeyxxvii270897";

export default function IRDAIPage() {
  return (
    <PasswordGate
      password={CASE_STUDY_PASSWORD}
      storageKey="irdai-unlocked"
      title="IRDAI Government Website Redesign"
      subtitle="This case study documents NDA-protected client work completed at Ripple Design. Enter the password to read, or connect with me directly for a personal walkthrough."
      contactHref="https://www.linkedin.com/in/kartikeypanchal"
    >
      <IRDAICaseStudy />
    </PasswordGate>
  );
}
