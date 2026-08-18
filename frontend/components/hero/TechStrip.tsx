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
  accentColor: string;
  badgeStyle: string;
  iconStyle: string;
  items: string[];
}

const STACK_CATEGORIES: StackCategory[] = [
  {
    title: "Languages",
    icon: Code2,
    accentColor: "text-amber-600 dark:text-amber-400",
    iconStyle: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    badgeStyle:
      "bg-amber-500/5 text-amber-900 dark:text-amber-200 border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/10",
    items: ["Python", "TypeScript", "JavaScript", "SQL"],
  },
  {
    title: "Backend & APIs",
    icon: Server,
    accentColor: "text-sky-600 dark:text-sky-400",
    iconStyle: "text-sky-500 bg-sky-500/10 border-sky-500/20",
    badgeStyle:
      "bg-sky-500/5 text-sky-900 dark:text-sky-200 border-sky-500/20 hover:border-sky-500/40 hover:bg-sky-500/10",
    items: [
      "FastAPI",
      "NestJS",
      "Node.js",
      "REST APIs",
      "Pydantic",
      "SQLAlchemy",
      "Prisma",
    ],
  },
  {
    title: "Frontend & Mobile",
    icon: Layout,
    accentColor: "text-violet-600 dark:text-violet-400",
    iconStyle: "text-violet-500 bg-violet-500/10 border-violet-500/20",
    badgeStyle:
      "bg-violet-500/5 text-violet-900 dark:text-violet-200 border-violet-500/20 hover:border-violet-500/40 hover:bg-violet-500/10",
    items: ["Next.js", "React", "Tailwind CSS", "Flutter / Dart"],
  },
  {
    title: "Data & AI Engineering",
    icon: Database,
    accentColor: "text-emerald-600 dark:text-emerald-400",
    iconStyle: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    badgeStyle:
      "bg-emerald-500/5 text-emerald-900 dark:text-emerald-200 border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/10",
    items: [
      "PostgreSQL",
      "Redis",
      "pgvector",
      "RAG Systems",
      "LLM Applications",
      "AI Agents",
      "Embeddings",
      "Vector Search",
    ],
  },
  {
    title: "Cloud & Infrastructure",
    icon: Cloud,
    accentColor: "text-cyan-600 dark:text-cyan-400",
    iconStyle: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
    badgeStyle:
      "bg-cyan-500/5 text-cyan-900 dark:text-cyan-200 border-cyan-500/20 hover:border-cyan-500/40 hover:bg-cyan-500/10",
    items: [
      "Docker",
      "Kubernetes",
      "OpenShift",
      "AWS",
      "Linux",
      "Nginx",
    ],
  },
  {
    title: "DevOps",
    icon: GitBranch,
    accentColor: "text-rose-600 dark:text-rose-400",
    iconStyle: "text-rose-500 bg-rose-500/10 border-rose-500/20",
    badgeStyle:
      "bg-rose-500/5 text-rose-900 dark:text-rose-200 border-rose-500/20 hover:border-rose-500/40 hover:bg-rose-500/10",
    items: ["Git", "GitHub Actions", "CI/CD"],
  },
];

export function TechStrip() {
  return (
    <section
      aria-labelledby="core-engineering-stack-title"
      className="py-12 border-y border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-950/40 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2
                id="core-engineering-stack-title"
                className="text-xs font-mono font-bold tracking-widest text-zinc-900 dark:text-zinc-100 uppercase"
              >
                Core Engineering Stack
              </h2>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Categorized production tools, frameworks, languages, and infrastructure
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 sm:self-center">
            6 Specialized Domains
          </span>
        </div>

        {/* 6 Structured Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {STACK_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.title}
                className="p-5 rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/60 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700/80 transition-colors flex flex-col justify-between space-y-4"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-lg border flex items-center justify-center ${cat.iconStyle}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <h3
                      className={`text-xs font-mono font-bold uppercase tracking-wider ${cat.accentColor}`}
                    >
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
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-medium border transition-colors cursor-default ${cat.badgeStyle}`}
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
