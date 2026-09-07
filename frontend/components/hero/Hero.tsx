import React from "react";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
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
        <div className="relative grid items-end gap-14 lg:grid-cols-12 lg:gap-8">
          {/* Editorial hero composition: the runtime panel is intentionally hidden for now. */}
          <div className="space-y-9 text-center lg:col-span-8 lg:text-left">
            <div className="flex items-center justify-center gap-3 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-sky-600 dark:text-sky-400 lg:justify-start">
              <span className="h-px w-8 bg-sky-500" />
              <span>Full-Stack Engineer / AI Systems Developer</span>
            </div>

            <div className="space-y-5">
              <h1 className="max-w-4xl font-serif text-3xl font-semibold leading-[1.08] tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl md:text-5xl lg:text-6xl">
                Building resilient full-stack platforms and production AI systems.
              </h1>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
                Available for Full-Stack Engineering &amp; Applied AI roles · Addis Ababa
              </p>
            </div>

            <p className="mx-auto max-w-2xl text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg lg:mx-0">
              Hi, I&apos;m <strong className="font-semibold text-zinc-900 dark:text-zinc-100">Yosef Teshome</strong>. I design and build production-grade web applications, asynchronous FastAPI &amp; NestJS microservices, hybrid RAG knowledge retrieval platforms with PostgreSQL pgvector, and autonomous AI agent tools containerized with Docker.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/20 active:translate-y-0.5 transition-all"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

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

          </div>

          <div className="relative min-h-[18rem] border-l border-zinc-300 pl-7 dark:border-zinc-700 lg:col-span-4 lg:mb-2 lg:pl-9">
            <div className="absolute left-[-1px] top-10 h-24 w-px bg-sky-500" />
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-500">A working principle</p>
            <p className="mt-7 font-serif text-5xl font-semibold leading-[0.9] tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-6xl">Systems<br />that<br /><span className="text-sky-600 dark:text-sky-400">hold.</span></p>
            <div className="absolute bottom-0 left-7 right-0 border-t border-zinc-200 pt-4 dark:border-zinc-800 lg:left-9">
              <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
                <span className="text-sky-600 dark:text-sky-400">01</span><span>Understand the system</span>
                <span className="text-sky-600 dark:text-sky-400">02</span><span>Design for failure</span>
                <span className="text-sky-600 dark:text-sky-400">03</span><span>Make it useful</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 border-t border-zinc-200 pt-4 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400 lg:col-span-8 lg:justify-start">
            <a href="https://github.com/jossieT" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-mono transition-colors hover:text-zinc-900 dark:hover:text-zinc-100">
              <GithubIcon className="h-3.5 w-3.5" /><span>github.com/jossieT</span>
            </a>
            <span className="hidden text-zinc-300 dark:text-zinc-700 sm:inline">•</span>
            <a href="https://www.linkedin.com/in/yosef-teshome-96516b188/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-mono transition-colors hover:text-zinc-900 dark:hover:text-zinc-100">
              <LinkedinIcon className="h-3.5 w-3.5" /><span>linkedin.com/in/yosef-teshome</span>
            </a>
          </div>

          {/* Keep the runtime component and its API/SSE behavior available for a future home. */}
          <div className="hidden" aria-hidden="true">
            <ArchitectureDiagram />
          </div>
        </div>
      </div>
    </section>
  );
}
