import React from "react";
import { ArrowRight, Calendar, MapPin, CheckCircle2 } from "lucide-react";
import { getExperience } from "@/lib/api";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export async function ExperienceTimeline() {
  const experiences = await getExperience();

  return (
    <section className="py-20 border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeader
            eyebrow="Career Journey"
            title="Professional Experience"
            description="Proven engineering trajectory progressing from Cloud Infrastructure and Linux Systems to High-Concurrency FastAPI Backends and Production AI Systems."
          />
          <Button
            href="/experience"
            variant="outline"
            size="md"
            icon={<ArrowRight className="w-4 h-4" />}
            className="shrink-0 self-start md:self-auto"
          >
            Full Resume & Detail
          </Button>
        </div>

        {/* Timeline List */}
        <div className="relative pl-6 md:pl-8 border-l border-zinc-200 dark:border-zinc-800 space-y-12">
          {experiences.map((exp) => (
            <div key={exp.slug} className="relative group">
              {/* Dot */}
              <div
                className={`absolute -left-[31px] md:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 bg-white dark:bg-zinc-900 transition-colors ${
                  exp.isCurrent
                    ? "border-sky-500 bg-sky-500 shadow-md shadow-sky-500/50"
                    : "border-zinc-300 dark:border-zinc-700"
                }`}
              />

              <div className="bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                        {exp.role}
                      </h3>
                      {exp.isCurrent && (
                        <Badge variant="emerald" size="sm">
                          Current
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-sky-600 dark:text-sky-400 mt-0.5">
                      {exp.company}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {exp.period}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {exp.location}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {exp.summary}
                </p>

                <ul className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
                  {exp.highlights.slice(0, 3).map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2 flex flex-wrap gap-1.5">
                  {exp.technologies.map((tech) => (
                    <Badge key={tech} variant="subtle" size="sm">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
