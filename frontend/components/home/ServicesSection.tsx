import React from "react";
import Link from "next/link";
import { ArrowRight, BrainCircuit, Bot, Server, Container } from "lucide-react";
import { getServices } from "@/lib/api";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  BrainCircuit,
  Bot,
  Server,
  CloudContainer: Container,
};

const ICON_COLORS: Record<string, string> = {
  BrainCircuit: "text-sky-500 bg-sky-500/8 dark:bg-sky-500/10 border-sky-500/20",
  Bot:           "text-emerald-500 bg-emerald-500/8 dark:bg-emerald-500/10 border-emerald-500/20",
  Server:        "text-indigo-500 bg-indigo-500/8 dark:bg-indigo-500/10 border-indigo-500/20",
  CloudContainer:"text-cyan-500 bg-cyan-500/8 dark:bg-cyan-500/10 border-cyan-500/20",
};

export async function ServicesSection() {
  const services = await getServices();

  return (
    <section className="py-14 border-b border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <SectionHeader
          eyebrow="Technical Solutions"
          title="What I Build"
          description="Outcome-driven AI and cloud backend solutions engineered for reliability, security, and scalability."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service) => {
            const iconColor = ICON_COLORS[service.iconName] ?? "text-sky-500 bg-sky-500/8 dark:bg-sky-500/10 border-sky-500/20";
            const IconComponent = ICON_MAP[service.iconName] ?? Server;

            return (
              <div
                key={service.slug}
                className="flex flex-col p-4 rounded-xl border border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/60 dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-white dark:hover:bg-zinc-900/60 transition-all duration-200 group"
              >
                {/* Icon */}
                <div className={`w-9 h-9 rounded-lg border flex items-center justify-center mb-3 shrink-0 ${iconColor}`}>
                  <IconComponent className="w-4.5 h-4.5" />
                </div>

                {/* Title */}
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-snug mb-1.5">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-3">
                  {service.description}
                </p>

                {/* Deliverables */}
                <ul className="space-y-1 mb-4 flex-1">
                  {service.deliverables.slice(0, 4).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-[11px] text-zinc-600 dark:text-zinc-300">
                      <span className="text-sky-500 shrink-0 mt-px">·</span>
                      <span className="leading-tight">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Footer */}
                <div className="mt-auto pt-3 border-t border-zinc-100 dark:border-zinc-800/60 space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {service.technologies.slice(0, 3).map((tech) => (
                      <Badge key={tech} variant="subtle" size="sm">
                        {tech}
                      </Badge>
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
