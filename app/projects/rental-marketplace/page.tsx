import type { Metadata } from "next";
import RentalMarketplaceCaseStudy from "@/components/RentalMarketplaceCaseStudy";
import PasswordGate from "@/components/PasswordGate";

export const metadata: Metadata = {
  title: "Next-Gen B2B Rental Marketplace Platform | Kartikey Panchal",
  description:
    "Case study: End-to-end design of Workorbits — a Next-Gen B2B marketplace platform for on-demand temporary staff and venue bookings. Website, webapp, mobile app, and design system.",
};

const CASE_STUDY_PASSWORD = "Kkeyxxvii270897";

export default function RentalMarketplacePage() {
  return (
    <PasswordGate
      password={CASE_STUDY_PASSWORD}
      storageKey="rental-marketplace-unlocked"
      title="Next-Gen B2B Rental Marketplace Platform"
      subtitle="End-to-end design for Workorbits — field-ops webapp, mobile app, marketing website, and design system. Enter the password to read, or connect with me directly."
      contactHref="https://www.linkedin.com/in/kartikeypanchal"
    >
      <RentalMarketplaceCaseStudy />
    </PasswordGate>
  );
}
