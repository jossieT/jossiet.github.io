import React from "react";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ArchitectureDiagram } from "@/components/hero/ArchitectureDiagram";

export function Hero() {
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-tech-grid">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-sky-500/10 dark:bg-sky-500/15 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline & Messaging */}
          <div className="lg:col-span-7 space-y-6">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2">
              <Badge variant="accent" size="md" className="gap-1.5 py-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Available for Senior Engineering Roles & High-Impact Consulting
              </Badge>
            </div>

            {/* Primary Position Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.15]">
                Building Production-Ready{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-sky-500 to-indigo-600 dark:from-sky-400 dark:via-sky-300 dark:to-indigo-400">
                  AI Systems
                </span>{" "}
                & Cloud-Native Backends.
              </h1>
              <p className="text-lg sm:text-xl font-medium text-sky-600 dark:text-sky-400 font-mono">
                AI Backend & Platform Engineer
              </p>
            </div>

            {/* Supporting Value Proposition */}
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-2xl">
              Hi, I&apos;m <strong className="text-zinc-900 dark:text-zinc-100">Yosef Teshome</strong>. I architect resilient FastAPI microservices, RAG knowledge retrieval platforms using PostgreSQL <code className="font-mono text-sky-600 dark:text-sky-400">pgvector</code>, autonomous AI agent tools, and containerized cloud platforms on Docker and Kubernetes.
            </p>

            {/* Core Pillars Bullet Highlights */}
            <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-300 pt-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                <span>Production RAG & Hybrid Search</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                <span>FastAPI & Async PostgreSQL</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                <span>AI Agent Tool Orchestration</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                <span>Docker & Kubernetes / OpenShift</span>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Button
                href="/projects"
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                View My Work
              </Button>
              <Button
                href="/contact"
                variant="outline"
                size="lg"
                icon={<Sparkles className="w-4 h-4 text-sky-500" />}
              >
                Let&apos;s Work Together
              </Button>
            </div>

            {/* Social Proof & Quick Links */}
            <div className="flex items-center gap-6 pt-4 text-sm text-zinc-500 dark:text-zinc-400">
              <a
                href="https://github.com/jossieT"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
              >
                <GithubIcon className="w-4 h-4" />
                <span className="font-mono">github/jossieT</span>
              </a>
              <a
                href="https://www.linkedin.com/in/yosef-teshome-96516b188/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
              >
                <LinkedinIcon className="w-4 h-4" />
                <span className="font-mono">linkedin/yosef-teshome</span>
              </a>
            </div>
          </div>

          {/* Right Column: Visual Architecture Element */}
          <div className="lg:col-span-5 w-full">
            <ArchitectureDiagram />
          </div>
        </div>
      </div>
    </section>
  );
}
