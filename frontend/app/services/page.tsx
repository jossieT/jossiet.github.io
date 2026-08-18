import { Metadata } from "next";
import { ArrowRight, BrainCircuit, Bot, Server, Container, CheckCircle2 } from "lucide-react";
import { getServices } from "@/lib/api";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "What I Build — Technical Services & Solutions",
  description:
    "Explore outcome-driven client services across AI & RAG Knowledge Platforms, AI Agents, FastAPI Backends, and Cloud Infrastructure.",
};

export default async function ServicesPage() {
  const services = await getServices();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "BrainCircuit":
        return <BrainCircuit className="w-8 h-8 text-sky-500" />;
      case "Bot":
        return <Bot className="w-8 h-8 text-emerald-500" />;
      case "Server":
        return <Server className="w-8 h-8 text-indigo-500" />;
      case "CloudContainer":
        return <Container className="w-8 h-8 text-cyan-500" />;
      default:
        return <Server className="w-8 h-8 text-sky-500" />;
    }
  };

  return (
    <div className="py-16 md:py-24 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          eyebrow="Solutions & Offerings"
          title="What I Build for Clients & Enterprise Teams"
          description="High-value engineering services delivering scalable AI systems, resilient backend APIs, and production container platforms."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {services.map((service) => (
            <Card key={service.slug} className="p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  {getIcon(service.iconName)}
                </div>

                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {service.title}
                </h2>

                <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {service.description}
                </p>

                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider">
                    Core Technical Deliverables
                  </h3>
                  <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                    {service.deliverables.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-1.5">
                  {service.technologies.map((tech) => (
                    <Badge key={tech} variant="subtle" size="sm">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <Button
                  href="/contact"
                  size="sm"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Inquire Service
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
