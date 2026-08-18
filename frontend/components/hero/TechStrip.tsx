import React from "react";

const STACK_GROUPS = [
  {
    label: "AI & Backend",
    color: "sky",
    items: [
      "Python / FastAPI",
      "AI / RAG / LLM Applications",
      "TypeScript / NestJS",
      "PostgreSQL",
      "Redis",
    ],
  },
  {
    label: "Frontend & Mobile",
    color: "violet",
    items: ["Next.js / React", "Flutter"],
  },
  {
    label: "Cloud & Infrastructure",
    color: "emerald",
    items: ["Docker", "Kubernetes / OpenShift", "AWS"],
  },
];

const colorMap: Record<string, { dot: string; badge: string; label: string }> = {
  sky: {
    dot: "bg-sky-400",
    badge:
      "bg-sky-500/10 border border-sky-500/25 text-sky-700 dark:text-sky-300 hover:bg-sky-500/20 hover:border-sky-500/50",
    label: "text-sky-600 dark:text-sky-400",
  },
  violet: {
    dot: "bg-violet-400",
    badge:
      "bg-violet-500/10 border border-violet-500/25 text-violet-700 dark:text-violet-300 hover:bg-violet-500/20 hover:border-violet-500/50",
    label: "text-violet-600 dark:text-violet-400",
  },
  emerald: {
    dot: "bg-emerald-400",
    badge:
      "bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-500/50",
    label: "text-emerald-600 dark:text-emerald-400",
  },
};

export function TechStrip() {
  return (
    <section className="py-10 border-y border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-mono font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-6">
          Core Engineering Stack
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {STACK_GROUPS.map((group) => {
            const c = colorMap[group.color];
            return (
              <div key={group.label} className="space-y-3">
                {/* Group label */}
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${c.dot} shrink-0`} />
                  <span className={`text-xs font-mono font-semibold uppercase tracking-wider ${c.label}`}>
                    {group.label}
                  </span>
                </div>
                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  {group.items.map((tech) => (
                    <span
                      key={tech}
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-colors cursor-default ${c.badge}`}
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
