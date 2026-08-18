import React from "react";
import { Cpu, Server, Database, Cloud, Bot, Terminal, Layout } from "lucide-react";
import { TechStackGrouped } from "@/types/portfolio";

interface TechStackBreakdownProps {
  grouped?: TechStackGrouped;
  flatTechnologies?: string[];
}

export function TechStackBreakdown({ grouped, flatTechnologies }: TechStackBreakdownProps) {
  const categories = [
    {
      key: "backend" as const,
      label: "Backend & Systems",
      icon: <Server className="w-4 h-4 text-indigo-500" />,
      items: grouped?.backend,
    },
    {
      key: "database" as const,
      label: "Database & Caching",
      icon: <Database className="w-4 h-4 text-emerald-500" />,
      items: grouped?.database,
    },
    {
      key: "ai" as const,
      label: "AI & Model Pipelines",
      icon: <Bot className="w-4 h-4 text-sky-500" />,
      items: grouped?.ai,
    },
    {
      key: "infrastructure" as const,
      label: "Infrastructure & Security",
      icon: <Cloud className="w-4 h-4 text-cyan-500" />,
      items: grouped?.infrastructure,
    },
    {
      key: "frontend" as const,
      label: "Frontend & Client",
      icon: <Layout className="w-4 h-4 text-amber-500" />,
      items: grouped?.frontend,
    },
    {
      key: "deployment" as const,
      label: "Deployment & Runtime",
      icon: <Terminal className="w-4 h-4 text-purple-500" />,
      items: grouped?.deployment,
    },
  ].filter((cat) => cat.items && cat.items.length > 0);

  return (
    <section id="tech-stack" className="space-y-6 scroll-mt-24">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <Cpu className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Technology Stack Breakdown
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
            Explicit technical responsibilities and tooling justification per layer
          </p>
        </div>
      </div>

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.key}
              className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs space-y-4"
            >
              <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
                <div className="p-1 rounded-md bg-zinc-100 dark:bg-zinc-800">
                  {cat.icon}
                </div>
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  {cat.label}
                </h3>
              </div>

              <div className="space-y-2.5">
                {cat.items?.map((item, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                      {item.name}
                    </span>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 pl-3 leading-relaxed">
                      {item.purpose}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {flatTechnologies?.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-mono text-zinc-800 dark:text-zinc-200"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
