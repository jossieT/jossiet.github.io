import React from "react";
import Link from "next/link";
import { ArrowRight, BrainCircuit, Layers, Server, Container } from "lucide-react";
import { getServices } from "@/lib/api";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { ServiceItem } from "@/types/portfolio";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  BrainCircuit,
  Layers,
  Server,
  CloudContainer: Container,
  Container,
};

const ICON_COLORS: Record<string, string> = {
  BrainCircuit: "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-500/20",
  Layers: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20",
  Server: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20",
  CloudContainer: "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/20",
  Container: "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/20",
};

const FALLBACK_SERVICES: ServiceItem[] = [
  {
    slug: "ai-rag-knowledge-platforms",
    title: "AI & RAG Knowledge Platforms",
    category: "ai-systems",
    description: "Build grounded AI knowledge systems that combine semantic and lexical retrieval for accurate, citation-aware answers.",
    deliverables: [
      "RAG & pgvector",
      "Hybrid BM25 + semantic search",
      "Citations & access control",
    ],
    technologies: ["Python", "FastAPI", "PostgreSQL"],
    iconName: "BrainCircuit",
  },
  {
    slug: "full-stack-software-development",
    title: "Full-Stack Software Development",
    category: "full-stack",
    description: "Build complete web applications from responsive interfaces and APIs to databases, authentication, and deployment.",
    deliverables: [
      "Next.js / React applications",
      "FastAPI / NestJS / Node.js APIs",
      "PostgreSQL / MongoDB & authentication",
    ],
    technologies: ["Next.js", "React", "FastAPI", "NestJS"],
    iconName: "Layers",
  },
  {
    slug: "backend-engineering",
    title: "Backend Engineering",
    category: "backend-engineering",
    description: "Design robust asynchronous APIs and backend services built for concurrency, security, and maintainability.",
    deliverables: [
      "FastAPI & asynchronous Python",
      "PostgreSQL & SQLAlchemy",
      "Redis, JWT & RBAC",
    ],
    technologies: ["Python", "FastAPI", "PostgreSQL"],
    iconName: "Server",
  },
  {
    slug: "cloud-native-platforms",
    title: "Cloud-Native Platforms",
    category: "cloud-native",
    description: "Containerize and deploy production backend services with reproducible infrastructure and automated delivery.",
    deliverables: [
      "Docker & multi-stage builds",
      "Kubernetes / OpenShift",
      "GitHub Actions CI/CD",
    ],
    technologies: ["Docker", "Kubernetes", "OpenShift"],
    iconName: "CloudContainer",
  },
];

export async function ServicesSection() {
  const rawServices = await getServices();
  const services = rawServices.length > 0 ? rawServices : FALLBACK_SERVICES;

  return (
    <section className="py-14 border-b border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <SectionHeader
          eyebrow="Technical Solutions"
          title="What I Build"
          description="End-to-end software and AI systems engineered for reliability, security, and scalability."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service) => {
            const iconColor = ICON_COLORS[service.iconName] ?? "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-500/20";
            const IconComponent = ICON_MAP[service.iconName] ?? Server;

            return (
              <div
                key={service.slug}
                className="flex flex-col p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-white dark:hover:bg-zinc-900/70 transition-all duration-200 group"
              >
                {/* Header: Icon & Title */}
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${iconColor}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
                    {service.title}
                  </h3>
                </div>

                {/* Short Description */}
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">
                  {service.description}
                </p>

                {/* Maximum 3 Capability Bullets */}
                <ul className="space-y-1 mb-3.5 flex-1">
                  {service.deliverables.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                      <span className="text-zinc-400 dark:text-zinc-500 font-bold shrink-0 mt-px">·</span>
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Footer: Tech tags & Action */}
                <div className="mt-auto pt-2.5 border-t border-zinc-100 dark:border-zinc-800/60 space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {service.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] font-mono px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:underline group-hover:gap-1.5 transition-all"
                  >
                    Inquire
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
