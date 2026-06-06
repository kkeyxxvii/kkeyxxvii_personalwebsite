import type { Metadata } from "next";
import GamifiedRafflesCaseStudy from "@/components/GamifiedRafflesCaseStudy";
import PasswordGate from "@/components/PasswordGate";

export const metadata: Metadata = {
  title: "Gamified Fundraising Raffles | Kartikey Panchal",
  description:
    "NDA-protected case study. Connect with Kartikey for a personal walkthrough.",
};

/* ─── Change this to your preferred password ────────── */
const CASE_STUDY_PASSWORD = "Kkeyxxvii270897";

export default function GamifiedRafflesPage() {
  return (
    <PasswordGate
      password={CASE_STUDY_PASSWORD}
      storageKey="playfora-unlocked"
      title="Gamified Fundraising Raffles"
      subtitle="This case study is protected under a non-disclosure agreement. Enter the password to read, or connect with me directly for a personal walkthrough."
      contactHref="https://www.linkedin.com/in/kartikeypanchal"
    >
      <GamifiedRafflesCaseStudy />
    </PasswordGate>
  );
}
