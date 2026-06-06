import type { Metadata } from "next";
import FunContent from "@/components/FunContent";

export const metadata: Metadata = {
  title: "Fun | Kartikey Panchal",
  description: "Side projects, explorations, and experiments by Kartikey Panchal.",
};

export default function FunPage() {
  return <FunContent />;
}
