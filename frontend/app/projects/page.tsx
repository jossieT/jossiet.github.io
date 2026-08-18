import React from "react";
import { Metadata } from "next";
import { getProjects } from "@/lib/api";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectFilter } from "@/components/projects/ProjectFilter";
import { ProjectCard } from "@/components/projects/ProjectCard";

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

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const selectedCategory = category || "all";

  // Fetch from backend
  const pageData = await getProjects(selectedCategory === "all" ? undefined : selectedCategory, 1);
  const projects = pageData?.items || [];

  return (
    <div className="py-16 md:py-24 space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <SectionHeader
          eyebrow="Technical Case Studies"
          title="Engineering Projects & Systems"
          description="In-depth technical breakdowns of production RAG architectures, high-concurrency transactional backends, and autonomous agent platforms."
        />

        {/* Category Filter */}
        <ProjectFilter
          selectedCategory={selectedCategory}
          categories={CATEGORIES}
        />

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-16 text-zinc-500 font-mono text-sm">
            No projects found in this category.
          </div>
        )}
      </div>
    </div>
  );
}
