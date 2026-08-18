import React from "react";
import { Layers, ArrowRight, Database, Server, Cpu, ShieldCheck, Terminal } from "lucide-react";
import { ProjectArchitectureStep } from "@/types/portfolio";

interface ArchitectureVisualizerProps {
  steps?: ProjectArchitectureStep[];
  mermaidCode?: string | null;
}

export function ArchitectureVisualizer({ steps, mermaidCode }: ArchitectureVisualizerProps) {
  const getStepIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Terminal className="w-4 h-4 text-sky-500" />;
      case 1:
        return <Server className="w-4 h-4 text-indigo-500" />;
      case 2:
        return <Database className="w-4 h-4 text-cyan-500" />;
      case 3:
        return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
      default:
        return <Cpu className="w-4 h-4 text-sky-500" />;
    }
  };

  return (
    <section id="architecture" className="space-y-8 scroll-mt-24">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-sky-500/10 dark:bg-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
            System Architecture & Data Flow
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
            Component boundaries, async pipeline execution, and transaction lifecycle
          </p>
        </div>
      </div>

      {/* Step-by-Step Flow Pipeline */}
      {steps && steps.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 shadow-xs flex flex-col justify-between space-y-3 group hover:border-sky-500/50 dark:hover:border-sky-500/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-xs font-bold flex items-center justify-center">
                    0{index + 1}
                  </span>
                  <div className="p-1.5 rounded-md bg-zinc-50 dark:bg-zinc-800/80">
                    {getStepIcon(index)}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-zinc-400 dark:text-zinc-600">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Architecture Definition Box */}
      {mermaidCode && (
        <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950 text-zinc-100 border border-zinc-800/90 shadow-xl space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3 text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold uppercase tracking-wider text-[11px] text-zinc-300">
                System Topology Flowchart
              </span>
            </div>
            <span className="text-[10px] text-zinc-500">Mermaid DSL</span>
          </div>

          <pre className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800/60 overflow-x-auto text-sky-300 leading-relaxed text-[11px] sm:text-xs">
            <code>{mermaidCode}</code>
          </pre>
        </div>
      )}
    </section>
  );
}
