import React from "react";
import Link from "next/link";
import { ArrowRight, BrainCircuit, Bot, Server, Container } from "lucide-react";
import { getServices } from "@/lib/api";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export async function ServicesSection() {
  const services = await getServices();
  
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "BrainCircuit":
        return <BrainCircuit className="w-6 h-6 text-sky-500" />;
      case "Bot":
        return <Bot className="w-6 h-6 text-emerald-500" />;
      case "Server":
        return <Server className="w-6 h-6 text-indigo-500" />;
      case "CloudContainer":
        return <Container className="w-6 h-6 text-cyan-500" />;
      default:
        return <Server className="w-6 h-6 text-sky-500" />;
    }
  };

  return (
    <section className="py-20 border-b border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          eyebrow="Technical Solutions"
          title="What I Build"
          description="Outcome-driven AI and cloud backend solutions engineered for reliability, security, and scalability."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => (
            <Card key={service.slug} className="flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  {getIcon(service.iconName)}
                </div>

                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  {service.title}
                </h3>

                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {service.description}
                </p>

                <div className="space-y-2 pt-2">
                  <span className="text-xs font-mono font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block">
                    Core Deliverables
                  </span>
                  <ul className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                    {service.deliverables.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-sky-500 font-bold shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-1.5">
                  {service.technologies.slice(0, 5).map((tech) => (
                    <Badge key={tech} variant="subtle" size="sm">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <Link
                  href="/contact"
                  className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                >
                  Inquire
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
