"use client";

import React, { useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Project } from "@/types/portfolio";
import { ProjectCard } from "@/components/projects/ProjectCard";

interface Category {
  id: string;
  label: string;
}

interface ProjectsExplorerProps {
  initialProjects: Project[];
  categories: Category[];
}

export function ProjectsExplorer({
  initialProjects,
  categories,
}: ProjectsExplorerProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedCategory = searchParams.get("category") || "all";

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "all") {
      return initialProjects;
    }
    return initialProjects.filter((project) => project.category === selectedCategory);
  }, [initialProjects, selectedCategory]);

  const handleCategorySelect = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId === "all") {
      params.delete("category");
    } else {
      params.set("category", categoryId);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategorySelect(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-mono font-medium rounded-lg transition-all cursor-pointer ${
                isSelected
                  ? "bg-sky-600 text-white shadow-sm"
                  : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-16 text-zinc-500 font-mono text-sm">
          No projects found in this category.
        </div>
      )}
    </div>
  );
}
