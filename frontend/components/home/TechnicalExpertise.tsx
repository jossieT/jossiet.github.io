import React from "react";
import { Cpu, Server, Cloud, Database, Layout } from "lucide-react";
import { getSkillCategories } from "@/lib/api";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export async function TechnicalExpertise() {
  const skillCategories = await getSkillCategories();
  
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Cpu":
        return <Cpu className="w-5 h-5 text-sky-500" />;
      case "Server":
        return <Server className="w-5 h-5 text-indigo-500" />;
      case "Cloud":
        return <Cloud className="w-5 h-5 text-cyan-500" />;
      case "Database":
        return <Database className="w-5 h-5 text-emerald-500" />;
      case "Layout":
        return <Layout className="w-5 h-5 text-purple-500" />;
      default:
        return <Server className="w-5 h-5 text-sky-500" />;
    }
  };

  return (
    <section className="py-20 border-b border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          eyebrow="Core Competencies"
          title="Technical Expertise"
          description="Structured grouping of technical capabilities, infrastructure knowledge, data stores, and framework competencies."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((cat) => (
            <Card key={cat.slug} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  {getIcon(cat.iconName)}
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base">
                    {cat.title}
                  </h3>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {cat.skills.length} verified skills
                  </span>
                </div>
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {cat.description}
              </p>

              <div className="pt-2 flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <Badge
                    key={skill.name}
                    variant={skill.isCore ? "accent" : "subtle"}
                    size="sm"
                    className="hover:scale-105 transition-transform"
                  >
                    {skill.name}
                    {skill.isCore && (
                      <span className="ml-1 text-[9px] font-bold text-sky-600 dark:text-sky-400">
                        ★
                      </span>
                    )}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
