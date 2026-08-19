import React from "react";
import { AlertCircle, CheckCircle, TrendingUp, Wrench } from "lucide-react";
import { ProjectChallenge } from "@/types/portfolio";

interface ChallengesAndSolutionsProps {
  challenges?: ProjectChallenge[];
}

export function ChallengesAndSolutions({ challenges }: ChallengesAndSolutionsProps) {
  if (!challenges || challenges.length === 0) return null;

  return (
    <section id="challenges" className="space-y-6 scroll-mt-24">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
          <Wrench className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Engineering Challenges & Solutions
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
            Real architectural bottlenecks encountered and the engineering rationale behind their resolution
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.map((item, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-sm space-y-5 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-50 flex items-start gap-2">
                <span className="font-mono text-xs text-amber-500 font-bold px-2 py-0.5 rounded-md bg-amber-500/10 shrink-0 mt-0.5">
                  #{idx + 1}
                </span>
                <span>{item.title}</span>
              </h3>

              {/* Challenge / Bottleneck */}
              <div className="p-3.5 rounded-xl bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>The Challenge</span>
                </div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {item.challenge}
                </p>
              </div>

              {/* Solution */}
              <div className="p-3.5 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>The Engineering Solution</span>
                </div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {item.solution}
                </p>
              </div>
            </div>

            {/* Impact */}
            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800/80 flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400">
              <TrendingUp className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-zinc-800 dark:text-zinc-200">Outcome: </strong>
                <span>{item.impact}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
