import React from "react";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";

const STEPS = [
  {
    step: "01",
    title: "Understand the Problem",
    description: "Analyze core domain constraints, performance requirements, security RBAC boundaries, and data access patterns.",
  },
  {
    step: "02",
    title: "Design Architecture",
    description: "Formulate modular FastAPI backend layouts, SQL schemas, vector search indexing strategies, and caching layers.",
  },
  {
    step: "03",
    title: "Build Incrementally",
    description: "Write clean Python 3.12 code with async SQLAlchemy ORMs, Pydantic schemas, and typed API contracts.",
  },
  {
    step: "04",
    title: "Rigorous Testing",
    description: "Validate endpoints with pytest, mypy static typing, and concurrency benchmarks before container packaging.",
  },
  {
    step: "05",
    title: "Containerize & Package",
    description: "Construct multi-stage Docker builds with non-root security contexts and minimal layer sizes.",
  },
  {
    step: "06",
    title: "Deploy & Monitor",
    description: "Deploy onto Docker Compose, Kubernetes, or OpenShift clusters with live health and readiness probes.",
  },
];

export function EngineeringApproach() {
  return (
    <section className="py-20 border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          eyebrow="Methodology"
          title="Engineering Approach"
          description="Software is not just written to work — it is engineered to be maintained, monitored, and scaled in real production environments."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STEPS.map((s, idx) => (
            <div
              key={s.step}
              className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3 relative group hover:border-sky-500/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded">
                  STEP {s.step}
                </span>
                {idx < STEPS.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-zinc-300 dark:text-zinc-700 hidden lg:block" />
                )}
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-lg">
                {s.title}
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
