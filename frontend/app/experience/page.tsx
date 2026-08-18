import { Metadata } from "next";
import { Calendar, MapPin, CheckCircle2, Download } from "lucide-react";
import { getExperience } from "@/lib/api";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Professional Experience — Yosef Teshome",
  description:
    "Explore Yosef Teshome's engineering trajectory across AI systems, backend microservices, and cloud infrastructure.",
};

export default async function ExperiencePage() {
  const experiences = await getExperience();
  
  return (
    <div className="py-16 md:py-24 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeader
            eyebrow="Career Trajectory"
            title="Professional Experience"
            description="Detailed record of engineering roles, system outcomes, technical responsibilities, and infrastructure achievements."
          />
          <Button
            href="/resume.pdf"
            external
            variant="outline"
            size="md"
            icon={<Download className="w-4 h-4" />}
          >
            Download PDF Resume
          </Button>
        </div>

        <div className="relative pl-6 md:pl-8 border-l border-zinc-200 dark:border-zinc-800 space-y-12">
          {experiences.map((exp) => (
            <div key={exp.slug} className="relative group">
              <div
                className={`absolute -left-[31px] md:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 bg-white dark:bg-zinc-900 transition-colors ${
                  exp.isCurrent
                    ? "border-sky-500 bg-sky-500 shadow-md shadow-sky-500/50"
                    : "border-zinc-300 dark:border-zinc-700"
                }`}
              />

              <div className="bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                        {exp.role}
                      </h2>
                      {exp.isCurrent && (
                        <Badge variant="emerald" size="sm">
                          Current Role
                        </Badge>
                      )}
                    </div>
                    <p className="text-base font-semibold text-sky-600 dark:text-sky-400 mt-1">
                      {exp.company}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {exp.period}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {exp.location}
                    </span>
                  </div>
                </div>

                <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
                  {exp.summary}
                </p>

                <div className="space-y-3">
                  <h3 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider">
                    Key Responsibilities & System Outcomes
                  </h3>
                  <ul className="space-y-2.5 text-sm text-zinc-700 dark:text-zinc-300">
                    {exp.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 flex flex-wrap gap-2">
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
    </div>
  );
}
