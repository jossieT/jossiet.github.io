import React from "react";
import { Badge } from "@/components/ui/Badge";

const TECH_ITEMS = [
  { name: "Python 3.12", category: "Core Backend" },
  { name: "FastAPI", category: "Framework" },
  { name: "PostgreSQL 17", category: "Database" },
  { name: "pgvector", category: "Vector Engine" },
  { name: "Redis 7", category: "Cache / Queue" },
  { name: "Docker", category: "Containers" },
  { name: "Kubernetes", category: "Orchestration" },
  { name: "OpenShift", category: "Enterprise Cloud" },
  { name: "AWS", category: "Cloud Infrastructure" },
  { name: "RAG Systems", category: "AI Architecture" },
  { name: "AI Agents", category: "Tool Calling" },
  { name: "Next.js & React", category: "Frontend" },
];

export function TechStrip() {
  return (
    <section className="py-8 border-y border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <span className="text-xs font-mono font-bold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase shrink-0">
            Core Engineering Stack:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {TECH_ITEMS.map((item) => (
              <Badge
                key={item.name}
                variant="subtle"
                size="sm"
                className="hover:border-sky-500/50 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
              >
                {item.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
