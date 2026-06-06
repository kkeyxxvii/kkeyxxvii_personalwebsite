import type { Metadata } from "next";
import CustomDashboardCaseStudy from "@/components/CustomDashboardCaseStudy";

export const metadata: Metadata = {
  title: "Custom Analytics Dashboard | Kartikey Panchal",
  description:
    "How designing a customisable, real-time dashboard for enterprise facility managers reduced incident response time by 4× and improved operational efficiency by 25%.",
};

export default function CustomDashboardPage() {
  return <CustomDashboardCaseStudy />;
}
