import React, { Suspense } from "react";
import { Metadata } from "next";
import { getAllProjects } from "@/lib/api";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectsExplorer } from "@/components/projects/ProjectsExplorer";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Engineering Projects & Architectural Case Studies",
  description:
    "Explore deep-dive technical case studies covering production RAG systems, high-concurrency FastAPI microservices, and autonomous AI agents.",
};

const CATEGORIES = [
  { id: "all", label: "All Projects" },
  { id: "ai-engineering", label: "AI & RAG" },
  { id: "backend-systems", label: "Backend Systems" },
  { id: "automation", label: "AI & Automation" },
];

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div className="py-16 md:py-24 space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <SectionHeader
          eyebrow="Technical Case Studies"
          title="Engineering Projects & Systems"
          description="In-depth technical breakdowns of production RAG architectures, high-concurrency transactional backends, and autonomous agent platforms."
        />

        <Suspense fallback={null}>
          <ProjectsExplorer
            initialProjects={projects}
            categories={CATEGORIES}
          />
        </Suspense>
      </div>
    </div>
  );
}
