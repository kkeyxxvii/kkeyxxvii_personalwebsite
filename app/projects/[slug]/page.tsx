import Link from "next/link";
import type { Metadata } from "next";
import ProjectContent from "@/components/ProjectContent";

const projectData: Record<string, { title: string; subtitle: string; description: string }> = {
  "genea-mobile": {
    title: "Enterprise access control redesign",
    subtitle: "Genea • Mobile App 2024",
    description:
      "Spearheaded the redesign of Genea's mobile app interface, including seamless integration with Apple Wallet and Google Wallet, contributing to a 32% increase in mobile credential adoption within 6 months.",
  },
  "genea-ds": {
    title: "Scalable design system",
    subtitle: "Genea • Design System 2023",
    description:
      "Led the creation and maintenance of a scalable design system across all Genea products, reducing design-to-development time by 40% and improving UI consistency across platforms.",
  },
  "genea-analytics": {
    title: "Analytics dashboard for facility managers",
    subtitle: "Genea • Dashboard 2024",
    description:
      "Designed and launched a custom analytics dashboard for enterprise facility managers, resulting in a 25% improvement in operational efficiency and a 20% reduction in support queries related to access reporting.",
  },
  "genea-rbac": {
    title: "Role-based access control",
    subtitle: "Genea • User Groups 2023",
    description:
      "Collaborated with cross-functional teams to build User Groups and implement granular role-based access control, which led to a 50% reduction in misconfigured user permissions.",
  },
  irdai: {
    title: "IRDAI government website redesign",
    subtitle: "Ripple Design • Gov 2021",
    description:
      "Redesigned the IRDAI government website, enhancing accessibility by 50% and boosting user retention by 25%.",
  },
  "ripple-saas": {
    title: "SaaS & fintech design solutions",
    subtitle: "Ripple Design • Multi-Client 2022",
    description:
      "Delivered 20+ end-to-end projects for SaaS, fintech, and healthcare startups, improving user engagement by 30% through optimised design solutions.",
  },
  "rental-marketplace": {
    title: "B2B rental marketplace",
    subtitle: "Side Project • 2020",
    description:
      "B2B Rental Marketplace for booking venues & temporary staff. A side project exploring marketplace design patterns.",
  },
  "gamified-raffles": {
    title: "Gamified fundraising raffles",
    subtitle: "Side Project • 2020",
    description:
      "Gamified raffles that raise funds — an exploration of gamification mechanics applied to fundraising.",
  },
};

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projectData[slug];
  return {
    title: project ? `${project.title} | Kartikey Panchal` : "Project | Kartikey Panchal",
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = projectData[slug];

  if (!project) {
    return (
      <div className="px-6 md:px-10 pt-24 pb-16">
        <h1 className="text-2xl font-light text-[#181617] mb-4">Project not found</h1>
        <Link href="/" className="text-sm text-[#9ca3af] hover:text-[#FF2929] underline">
          ← Back to work
        </Link>
      </div>
    );
  }

  return (
    <ProjectContent
      title={project.title}
      subtitle={project.subtitle}
      description={project.description}
    />
  );
}
