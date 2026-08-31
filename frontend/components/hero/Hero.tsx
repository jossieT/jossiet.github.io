import React from "react";
import { ArrowRight, ArrowDown, Code2, Database, FileText } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import { ArchitectureDiagram } from "@/components/hero/ArchitectureDiagram";

export function Hero() {
  return (
    <section className="relative pt-8 pb-8 md:pt-10 md:pb-12 overflow-hidden border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/60">
      {/* Background Subtle Technical Grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-60 dark:opacity-30 pointer-events-none -z-10" />

      {/* Subtle Radial Ambient Depth Accent */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-sky-500/5 dark:bg-sky-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Positioning, Headline & Technical Narrative */}
          <div className="lg:col-span-7 space-y-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Status Line */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 text-zinc-700 dark:text-zinc-300 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span>Available for Full-Stack Engineering &amp; Applied AI roles</span>
            </div>

            {/* Primary Headline in Editorial Serif */}
            <div className="space-y-2 text-center lg:text-left">
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.14] text-balance">
                Building reliable web platforms, async backends, and AI retrieval systems.
              </h1>
              <p className="text-sm font-mono font-medium text-sky-600 dark:text-sky-400">
                Full-Stack &amp; AI Systems Engineer · Addis Ababa
              </p>
            </div>

            {/* Supporting Engineering Narrative */}
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-2xl font-normal text-center lg:text-left mx-auto lg:mx-0">
              Hi, I&apos;m <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">Yosef Teshome</strong>. I design and build full-stack web platforms and AI-powered systems - Next.js on the frontend, Python (FastAPI) and Node.js (NestJS) on the backend, with pgvector hybrid retrieval pipelines and containerized distributed architectures.
            </p>

            {/* Grounded Engineering Proof Points (2 Defensible Metrics) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-left w-full">
              <div className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 space-y-1">
                <div className="font-mono text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  10+ Projects
                </div>
                <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  Shipped &amp; In Development
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-tight">
                  Production platforms, hybrid RAG knowledge systems, and containerized backend services.
                </p>
              </div>

              <div className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 space-y-1">
                <div className="font-mono text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  ~1.5ms
                </div>
                <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  Internal Gateway Overhead
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-tight">
                  FastAPI async ASGI core latency on health and telemetry probes.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 w-full">
              <a
                href="/projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/20 active:translate-y-0.5 transition-all"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="/contact"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold border border-zinc-300 dark:border-zinc-700 hover:border-sky-500 text-zinc-800 dark:text-zinc-200 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
              >
                <span>Get in touch</span>
                <ArrowRight className="w-3.5 h-3.5 text-sky-500" />
              </a>

              <a
                href="/resume"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-zinc-600 dark:text-zinc-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors lg:ml-auto"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Resume / CV</span>
              </a>
            </div>

            {/* Direct Verified Links */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-zinc-500 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-800 pt-4 w-full">
              <a
                href="https://github.com/jossieT"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors font-mono"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>github.com/jossieT</span>
              </a>
              <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">•</span>
              <a
                href="https://www.linkedin.com/in/yosef-teshome-96516b188/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors font-mono"
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
                <span>linkedin.com/in/yosef-teshome</span>
              </a>
            </div>
          </div>

          {/* Right Column: Real-Time Runtime Telemetry Panel */}
          <div className="lg:col-span-5 w-full">
            <ArchitectureDiagram />
          </div>
        </div>
      </div>
    </section>
  );
}
