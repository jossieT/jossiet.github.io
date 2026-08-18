import React from "react";
import { ArrowRight } from "lucide-react";
import { getFeaturedProjects } from "@/lib/api";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/Button";

export async function SelectedProjects() {
  const featuredProjects = await getFeaturedProjects();

  return (
    <section className="py-20 border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeader
            eyebrow="Case Studies"
            title="Selected Engineering Projects"
            description="Production-grade AI systems, RAG knowledge retrieval platforms, high-concurrency backend services, and automated workflow orchestrators."
          />
          <Button
            href="/projects"
            variant="outline"
            size="md"
            icon={<ArrowRight className="w-4 h-4" />}
            className="shrink-0 self-start md:self-auto"
          >
            All Projects
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
