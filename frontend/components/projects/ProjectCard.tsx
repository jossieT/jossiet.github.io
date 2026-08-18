import React from "react";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, Cpu, Server, Bot } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { Project } from "@/types/portfolio";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const getCategoryIcon = (category: Project["category"]) => {
    switch (category) {
      case "ai-engineering":
        return <Cpu className="w-4 h-4 text-sky-500" />;
      case "backend-systems":
        return <Server className="w-4 h-4 text-indigo-500" />;
      case "automation":
        return <Bot className="w-4 h-4 text-emerald-500" />;
      default:
        return <Server className="w-4 h-4 text-sky-500" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "In Production":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "Active Development":
        return "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20";
      case "Completed":
        return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20";
    }
  };

  return (
    <Card className="flex flex-col justify-between h-full group hover:border-sky-500/40 dark:hover:border-sky-500/40 transition-all">
      <div className="space-y-4">
        {/* Header: Category & Status */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {getCategoryIcon(project.category)}
            <span className="text-xs font-mono font-semibold text-zinc-600 dark:text-zinc-400">
              {project.categoryLabel}
            </span>
          </div>

          {project.status && (
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${getStatusColor(
                project.status
              )}`}
            >
              {project.status}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors leading-snug">
          <Link href={`/projects/${project.slug}`} className="hover:underline">
            {project.title}
          </Link>
        </h3>

        {/* Tagline / Summary */}
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
          {project.summary}
        </p>

        {/* Impact Metrics (if present) */}
        {project.impactMetrics && project.impactMetrics.length > 0 && (
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">
              Key Metric
            </span>
            <p className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
              • {project.impactMetrics[0]}
            </p>
          </div>
        )}

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {project.technologies.slice(0, 5).map((tech) => (
            <Badge key={tech} variant="subtle" size="sm">
              {tech}
            </Badge>
          ))}
          {project.technologies.length > 5 && (
            <Badge variant="outline" size="sm">
              +{project.technologies.length - 5}
            </Badge>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-5 mt-5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1 font-semibold text-sky-600 dark:text-sky-400 group-hover:translate-x-0.5 transition-transform"
        >
          Read Case Study
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>

        <div className="flex items-center gap-3">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              aria-label={`GitHub for ${project.title}`}
            >
              <GithubIcon className="w-4 h-4" />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-sky-500 transition-colors"
              aria-label={`Live Demo for ${project.title}`}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}
