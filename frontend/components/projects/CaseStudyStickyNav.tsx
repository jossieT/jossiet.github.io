"use client";

import React, { useState, useEffect } from "react";
import {
  Layers,
  Cpu,
  Shield,
  Lightbulb,
  CheckCircle2,
  Wrench,
  HelpCircle,
  BarChart3,
} from "lucide-react";

interface NavSection {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const SECTIONS: NavSection[] = [
  { id: "overview", label: "Overview", icon: <HelpCircle className="w-3.5 h-3.5" /> },
  { id: "architecture", label: "Architecture", icon: <Layers className="w-3.5 h-3.5" /> },
  { id: "tech-stack", label: "Tech Stack", icon: <Cpu className="w-3.5 h-3.5" /> },
  { id: "features", label: "Features", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  { id: "decisions", label: "Trade-offs", icon: <Wrench className="w-3.5 h-3.5" /> },
  { id: "challenges", label: "Challenges", icon: <Shield className="w-3.5 h-3.5" /> },
  { id: "security", label: "Security", icon: <Shield className="w-3.5 h-3.5" /> },
  { id: "outcomes", label: "Outcomes", icon: <BarChart3 className="w-3.5 h-3.5" /> },
  { id: "lessons", label: "Lessons", icon: <Lightbulb className="w-3.5 h-3.5" /> },
];

export function CaseStudyStickyNav() {
  const [activeSection, setActiveSection] = useState<string>("overview");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const section of SECTIONS) {
        const element = document.getElementById(section.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <nav
      aria-label="Case study section navigation"
      className="sticky top-20 z-30 hidden lg:block bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-y border-zinc-200 dark:border-zinc-800/80 py-2.5 my-8 shadow-sm transition-all"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between overflow-x-auto scrollbar-none gap-2">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 shrink-0 mr-2">
          Case Study Nav:
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          {SECTIONS.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => scrollToSection(sec.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30 font-semibold shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                }`}
              >
                {sec.icon}
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
