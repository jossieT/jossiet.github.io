import React from "react";
import {
  Code2,
  Server,
  Layout,
  Database,
  Cloud,
  GitBranch,
  Terminal,
} from "lucide-react";

interface StackCategory {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: string[];
}

const STACK_CATEGORIES: StackCategory[] = [
  {
    title: "Languages",
    icon: Code2,
    items: ["Python 3.12", "TypeScript", "JavaScript", "SQL"],
  },
  {
    title: "Backend & APIs",
    icon: Server,
    items: [
      "FastAPI",
      "NestJS",
      "Node.js",
      "REST APIs",
      "Pydantic v2",
      "Async SQLAlchemy",
      "Prisma",
    ],
  },
  {
    title: "Data & AI Engineering",
    icon: Database,
    items: [
      "PostgreSQL 17",
      "pgvector",
      "Redis 7",
      "RAG Systems",
      "Hybrid Search (BM25)",
      "FAISS",
      "Embeddings",
    ],
  },
  {
    title: "Frontend & Web",
    icon: Layout,
    items: ["Next.js (App Router)", "React 19", "Tailwind CSS", "TypeScript"],
  },
  {
    title: "Cloud & Runtime",
    icon: Cloud,
    items: [
      "Docker Multi-stage",
      "Kubernetes",
      "OpenShift",
      "Linux Admin",
      "Nginx",
      "Render",
    ],
  },
  {
    title: "Testing & DevOps",
    icon: GitBranch,
    items: ["pytest", "mypy", "Git", "GitHub Actions", "CI/CD Pipelines"],
  },
];

export function TechStrip() {
  return (
    <section
      aria-labelledby="core-engineering-stack-title"
      className="py-12 border-y border-zinc-200/80 dark:border-zinc-800/80 bg-slate-100/80 dark:bg-zinc-950/40 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
              <Terminal className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2
                id="core-engineering-stack-title"
                className="text-xs font-mono font-bold tracking-widest text-zinc-900 dark:text-zinc-100 uppercase"
              >
                Core Engineering Stack
              </h2>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Production tools, frameworks, and infrastructure domains
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 sm:self-center">
            6 Specialized Areas
          </span>
        </div>

        {/* 6 Structured Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {STACK_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.title}
                className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 flex flex-col justify-between space-y-3"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
                      <Icon className="w-3 h-3" />
                    </div>
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                      {cat.title}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                    {cat.items.length}
                  </span>
                </div>

                {/* Technology Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cat.items.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 cursor-default"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
