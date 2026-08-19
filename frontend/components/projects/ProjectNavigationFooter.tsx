import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Compass } from "lucide-react";
import { ProjectNavigation } from "@/types/portfolio";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

interface ProjectNavigationFooterProps {
  navigation?: ProjectNavigation | null;
  currentSlug: string;
}

export function ProjectNavigationFooter({ navigation, currentSlug }: ProjectNavigationFooterProps) {
  const previous = navigation?.previous;
  const next = navigation?.next;
  const related = navigation?.related?.filter((p) => p.slug !== currentSlug) || [];

  return (
    <div className="space-y-16 pt-12 border-t border-zinc-200 dark:border-zinc-800">
      {/* Previous / Next Project Switcher */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {previous ? (
          <Link
            href={`/projects/${previous.slug}`}
            className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-sky-500/50 dark:hover:border-sky-500/50 transition-all group flex flex-col justify-between space-y-3"
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-zinc-600 dark:text-zinc-400 group-hover:text-sky-600 dark:group-hover:text-sky-400">
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              Previous Case Study
            </span>
            <div>
              <h4 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                {previous.title}
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5 font-mono">
                {previous.categoryLabel}
              </p>
            </div>
          </Link>
        ) : (
          <div className="hidden sm:block" />
        )}

        {next ? (
          <Link
            href={`/projects/${next.slug}`}
            className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-sky-500/50 dark:hover:border-sky-500/50 transition-all group flex flex-col justify-between items-end text-right space-y-3"
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-zinc-600 dark:text-zinc-400 group-hover:text-sky-600 dark:group-hover:text-sky-400">
              Next Case Study
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
            <div>
              <h4 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                {next.title}
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5 font-mono">
                {next.categoryLabel}
              </p>
            </div>
          </Link>
        ) : (
          <div className="hidden sm:block" />
        )}
      </div>

      {/* Related Engineering Case Studies */}
      {related.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-sky-500" />
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
              Related Case Studies
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {related.map((rel) => (
              <Card
                key={rel.slug}
                className="p-6 flex flex-col justify-between space-y-4 hover:border-sky-500/50 dark:hover:border-sky-500/50 transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="accent" size="sm">
                      {rel.categoryLabel}
                    </Badge>
                    <span className="text-[11px] font-mono text-zinc-500">
                      {rel.timeline}
                    </span>
                  </div>

                  <Link href={`/projects/${rel.slug}`}>
                    <h4 className="font-bold text-base text-zinc-900 dark:text-zinc-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors leading-snug">
                      {rel.title}
                    </h4>
                  </Link>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {rel.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {rel.technologies.slice(0, 3).map((tech) => (
                      <Badge key={tech} variant="subtle" size="sm">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <Link
                    href={`/projects/${rel.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-mono font-bold text-sky-600 dark:text-sky-400 hover:underline"
                  >
                    <span>Read Study</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
