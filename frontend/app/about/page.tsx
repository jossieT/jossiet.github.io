import { Metadata } from "next";
import { ArrowRight, Terminal, Server, Cloud, Cpu, ShieldCheck, CheckCircle2 } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About Yosef Teshome — AI Backend & Platform Engineer",
  description:
    "Learn about Yosef Teshome's background in infrastructure, backend systems, cloud platforms, and production AI engineering.",
};

const PILLARS = [
  {
    stage: "01. Infrastructure Foundation",
    title: "Linux & Network Systems",
    icon: <Terminal className="w-5 h-5 text-sky-500" />,
    description:
      "Gained deep understanding of kernel tuning, networking fundamentals, memory management, Linux firewalls, and server operating systems.",
  },
  {
    stage: "02. Backend Systems",
    title: "FastAPI & Async Data Pools",
    icon: <Server className="w-5 h-5 text-indigo-500" />,
    description:
      "Designed high-concurrency Python REST APIs, asynchronous database connection handling, Redis caching layers, and transaction isolation.",
  },
  {
    stage: "03. Cloud & DevOps",
    title: "Containers & Orchestration",
    icon: <Cloud className="w-5 h-5 text-cyan-500" />,
    description:
      "Automated application packaging with Docker, Kubernetes, and Red Hat OpenShift manifests, setting up CI/CD test and deployment automation.",
  },
  {
    stage: "04. AI & RAG Platforms",
    title: "Production RAG & Agents",
    icon: <Cpu className="w-5 h-5 text-emerald-500" />,
    description:
      "Combined database and infrastructure knowledge to build production vector search platforms (pgvector), hybrid BM25 search, and AI agent tools.",
  },
];

export default function AboutPage() {
  return (
    <div className="py-16 md:py-24 space-y-16">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Profile & Philosophy"
          title="About Yosef Teshome"
          description="AI Backend & Platform Engineer bridging low-level infrastructure understanding with production AI system development."
        />
      </section>

      {/* Main Story Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Bio Story Text */}
          <div className="lg:col-span-7 space-y-6 text-zinc-600 dark:text-zinc-300 leading-relaxed text-base">
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              &quot;I build systems that work under real production constraints.&quot;
            </h3>

            <p>
              My path in engineering began in Linux system administration and cloud infrastructure. Managing physical servers, network topology, firewalls, and containerized deployment pipelines provided me with a fundamental perspective: <strong className="text-zinc-900 dark:text-zinc-100">software applications never live in isolation from the operating platform.</strong>
            </p>

            <p>
              Transitioning into senior backend engineering, I applied this systems perspective to Python microservices. I built high-concurrency RESTful APIs using <strong className="text-zinc-900 dark:text-zinc-100">FastAPI, SQLAlchemy 2.0 async sessions, Pydantic v2 schemas, and PostgreSQL</strong>. Rather than relying on fragile workarounds, I focus on solving performance bottlenecks at the database and memory layer.
            </p>

            <p>
              Today, as an <strong className="text-zinc-900 dark:text-zinc-100">AI Backend & Platform Engineer</strong>, I specialize in bringing AI capabilities out of research sandboxes into enterprise environments. I build production Retrieval-Augmented Generation (RAG) platforms using PostgreSQL <code className="font-mono text-sky-600 dark:text-sky-400">pgvector</code>, hybrid lexical/semantic search, and agentic workflows with strict schema validation.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Button href="/projects" icon={<ArrowRight className="w-4 h-4" />}>
                Explore Case Studies
              </Button>
              <Button href="/contact" variant="outline">
                Get in Touch
              </Button>
            </div>
          </div>

          {/* Core Highlights Card */}
          <div className="lg:col-span-5 w-full">
            <Card className="space-y-6 bg-zinc-900 text-zinc-100 border-zinc-800 p-8 shadow-xl">
              <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
                <ShieldCheck className="w-6 h-6 text-sky-400" />
                <h4 className="font-bold text-lg text-white">Engineering Values</h4>
              </div>

              <ul className="space-y-4 text-xs font-mono text-zinc-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Security-First Access:</strong> Document RBAC security filters integrated directly into PostgreSQL queries.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Deterministic Agent Tools:</strong> Strict Pydantic JSON schema validation prior to tool execution.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Zero Operational Bloat:</strong> Leveraging native pgvector & PostgreSQL features before spinning up extraneous clusters.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Asynchronous Concurrency:</strong> Non-blocking asyncio execution pipelines with sub-50ms cache hits.
                  </span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Trajectory Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-zinc-200 dark:border-zinc-800/80">
        <SectionHeader
          eyebrow="Progression"
          title="Engineering Evolution"
          description="How hands-on infrastructure experience informs my approach to AI and backend platform development."
          className="mb-12"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS.map((p) => (
            <Card key={p.stage} className="space-y-3">
              <span className="text-[11px] font-mono font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider block">
                {p.stage}
              </span>
              <div className="flex items-center gap-2">
                {p.icon}
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-base">
                  {p.title}
                </h4>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {p.description}
              </p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
