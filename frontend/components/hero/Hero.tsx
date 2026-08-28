import React from "react";
import { ArrowRight, Sparkles, FileText, Code2, Cpu, Database, Cloud } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { ArchitectureDiagram } from "@/components/hero/ArchitectureDiagram";

export function Hero() {
  return (
    <section className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/60">
      {/* Background Subtle Technical Grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-50 dark:opacity-25 pointer-events-none -z-10" />

      {/* Subtle Radial Ambient Depth Accent */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-sky-500/5 dark:bg-sky-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Positioning, Headline & Technical Narrative */}
          <div className="lg:col-span-7 space-y-6">
            {/* Availability Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available for Full-Stack &amp; AI Engineering Opportunities</span>
            </div>

            {/* Primary Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.75rem] xl:text-[3.15rem] font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.12] text-balance">
                Building resilient full-stack platforms and production AI systems.
              </h1>
              <p className="text-sm sm:text-base font-mono font-medium text-sky-600 dark:text-sky-400">
                Full-Stack Engineer &amp; AI Systems Developer
              </p>
            </div>

            {/* Supporting Engineering Narrative */}
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-2xl font-normal">
              Hi, I&apos;m <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">Yosef Teshome</strong>. I design and build production-grade web applications, asynchronous FastAPI &amp; NestJS microservices, hybrid RAG knowledge retrieval platforms with PostgreSQL <code className="px-1.5 py-0.5 rounded bg-zinc-200/80 dark:bg-zinc-800 text-xs font-mono text-sky-600 dark:text-sky-400">pgvector</code>, and autonomous AI agent tools containerized with Docker.
            </p>

            {/* Structured Engineering Capabilities Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
              <div className="p-3 rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/70 shadow-xs space-y-1">
                <div className="flex items-center gap-2 font-mono font-bold text-zinc-900 dark:text-zinc-100">
                  <Code2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  <span>Full-Stack Applications</span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                  Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, SSR/ISR.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/70 shadow-xs space-y-1">
                <div className="flex items-center gap-2 font-mono font-bold text-zinc-900 dark:text-zinc-100">
                  <Cpu className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span>AI &amp; RAG Systems</span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                  Hybrid retrieval (BM25 + Vector), pgvector embeddings &amp; Agent tools.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/70 shadow-xs space-y-1">
                <div className="flex items-center gap-2 font-mono font-bold text-zinc-900 dark:text-zinc-100">
                  <Database className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Backend &amp; Microservices</span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                  FastAPI, Python 3.12, NestJS, Async SQLAlchemy, Redis Caching.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/70 shadow-xs space-y-1">
                <div className="flex items-center gap-2 font-mono font-bold text-zinc-900 dark:text-zinc-100">
                  <Cloud className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                  <span>Containerized Deployment</span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                  Docker multi-stage builds, Linux environments, Git &amp; CI/CD automation.
                </p>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Button
                href="/projects"
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
                className="font-semibold shadow-md shadow-sky-600/20"
              >
                Explore Projects
              </Button>
              <Button
                href="/contact"
                variant="outline"
                size="lg"
                icon={<Sparkles className="w-4 h-4 text-sky-500" />}
                className="font-semibold"
              >
                Get in Touch
              </Button>
              <Button
                href="/resume"
                external
                variant="ghost"
                size="lg"
                icon={<FileText className="w-4 h-4 text-zinc-500" />}
                className="font-mono text-xs font-semibold"
              >
                CV / Resume
              </Button>
            </div>

            {/* Direct Verified Profile Badges */}
            <div className="flex flex-wrap items-center gap-5 pt-2 text-xs text-zinc-500 dark:text-zinc-400 border-t border-zinc-200/80 dark:border-zinc-800/80 pt-4">
              <a
                href="https://github.com/jossieT"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-sky-600 dark:hover:text-sky-400 transition-colors font-mono font-medium"
              >
                <GithubIcon className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                <span>github.com/jossieT</span>
              </a>
              <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">•</span>
              <a
                href="https://www.linkedin.com/in/yosef-teshome-96516b188/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-sky-600 dark:hover:text-sky-400 transition-colors font-mono font-medium"
              >
                <LinkedinIcon className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                <span>linkedin.com/in/yosef-teshome</span>
              </a>
            </div>
          </div>

          {/* Right Column: Unified Interactive Architecture & Telemetry Console */}
          <div className="lg:col-span-5 w-full">
            <ArchitectureDiagram />
          </div>
        </div>
      </div>
    </section>
  );
}
