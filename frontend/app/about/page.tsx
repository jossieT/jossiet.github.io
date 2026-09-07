import type { Metadata } from "next";
import { ArrowRight, Cloud, Cpu, Server, Terminal } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About Yosef Teshome — AI Backend & Platform Engineer",
  description: "The engineering story, principles, and perspective of Yosef Teshome.",
};

const PRINCIPLES = [
  ["Security before convenience", "Security should be part of the architecture, not something added after the system works."],
  ["Simplicity before infrastructure", "I prefer solving a problem with the simplest reliable architecture before adding another service, cluster, or dependency."],
  ["Understand before optimizing", "I want to understand where complexity and bottlenecks actually come from before optimizing them."],
  ["AI needs engineering discipline", "AI systems need boundaries, validation, observability, and predictable interfaces just like any other production system."],
  ["Build for reality", "A system is not finished because it works in development. It is finished when it can survive real users, failures, changing requirements, and operational constraints."],
];

const EXPERIENCE = [
  ["Infrastructure & Systems", "Experience working close to infrastructure, production environments, system administration, servers, networking, access control, and operational reliability."],
  ["Backend Engineering", "A transition toward building backend services, APIs, databases, asynchronous systems, and production applications."],
  ["AI Systems", "A current focus on integrating AI into real software systems, particularly backend platforms, retrieval systems, and intelligent application workflows."],
];

const PILLARS = [
  {
    stage: "01. Infrastructure Foundation",
    title: "Linux & Network Systems",
    icon: <Terminal className="w-5 h-5 text-sky-500" />,
    description: "Gained deep understanding of kernel tuning, networking fundamentals, memory management, Linux firewalls, and server operating systems.",
  },
  {
    stage: "02. Backend Systems",
    title: "FastAPI & Async Data Pools",
    icon: <Server className="w-5 h-5 text-indigo-500" />,
    description: "Designed high-concurrency Python REST APIs, asynchronous database connection handling, Redis caching layers, and transaction isolation.",
  },
  {
    stage: "03. Cloud & DevOps",
    title: "Containers & Orchestration",
    icon: <Cloud className="w-5 h-5 text-cyan-500" />,
    description: "Automated application packaging with Docker, Kubernetes, and Red Hat OpenShift manifests, setting up CI/CD test and deployment automation.",
  },
  {
    stage: "04. AI & RAG Platforms",
    title: "Production RAG & Agents",
    icon: <Cpu className="w-5 h-5 text-emerald-500" />,
    description: "Combined database and infrastructure knowledge to build production vector search platforms (pgvector), hybrid BM25 search, and AI agent tools.",
  },
];

export default function AboutPage() {
  return (
    <div className="overflow-hidden py-16 md:py-24">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 border-b border-zinc-200 pb-20 dark:border-zinc-800 md:grid-cols-12 md:gap-8 md:pb-28">
          <div className="md:col-span-8 lg:col-span-7">
            <p className="mb-6 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-sky-600 dark:text-sky-400">About / Engineering Profile</p>
            <h1 className="max-w-4xl font-serif text-3xl font-semibold leading-[1.08] tracking-tight text-zinc-950 dark:text-white sm:text-4xl lg:text-6xl">About Me</h1>
            <p className="mt-8 max-w-2xl font-serif text-2xl leading-tight text-zinc-700 dark:text-zinc-300 sm:text-3xl">I build systems that work under real production constraints.</p>
          </div>
          <div className="flex items-end md:col-span-4 lg:col-span-4 lg:col-start-9">
            <p className="max-w-sm border-l-2 border-sky-500 pl-5 text-base leading-7 text-zinc-600 dark:text-zinc-400">I&apos;m a software engineer interested in building reliable software systems and solving problems that exist beyond the code itself.</p>
          </div>
        </div>
        <div className="grid gap-8 py-16 md:grid-cols-12 md:gap-8 md:py-24">
          <div className="mx-auto max-w-3xl space-y-6 text-center text-lg leading-8 text-zinc-600 dark:text-zinc-300 md:col-span-8 md:col-start-3">
            <p>My engineering path has taken me from infrastructure and systems work into backend engineering and, more recently, production AI systems. Each stage changed the way I think about software - from how systems run, to how applications scale, to how intelligent systems can be made useful and dependable.</p>
            <div className="flex flex-wrap justify-center gap-3 pt-3">
              <Button href="/projects" variant="outline" icon={<ArrowRight className="h-4 w-4" />}>Explore My Work</Button>
              <Button href="/contact" variant="ghost">Get in Touch</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl border-t border-zinc-200 px-4 py-16 sm:px-6 md:py-24 lg:px-8 dark:border-zinc-800">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <SectionHeader title="My Journey" className="md:col-span-4" />
          <div className="max-w-2xl space-y-6 text-lg leading-8 text-zinc-600 dark:text-zinc-300 md:col-span-7 md:col-start-6">
            <p className="font-serif text-2xl leading-tight text-zinc-900 dark:text-zinc-100">My path into software engineering didn&apos;t begin with AI. It began much closer to the infrastructure that makes software possible.</p>
            <p>Working with servers, operating systems, networks, access control, deployment environments, production incidents, and reliability constraints taught me that software never exists in isolation.</p>
            <p>I became increasingly interested in building the applications and services running on top of that infrastructure. Eventually, that curiosity led me toward AI - not simply because models were becoming powerful, but because I became interested in the engineering problem around them.</p>
            <p>The question became how to take AI beyond demonstrations and integrate it into reliable software systems: systems with clear boundaries, useful behavior, and a way to earn trust over time.</p>
          </div>
        </div>
      </section>

      <section className="bg-zinc-100/70 py-16 dark:bg-zinc-900/30 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 md:grid-cols-12 md:gap-8 lg:px-8">
          <div className="md:col-span-4"><SectionHeader title="What I Believe" description="I build systems that work under real production constraints." /></div>
          <div className="md:col-span-7 md:col-start-6">
            {PRINCIPLES.map(([title, description], index) => (
              <div key={title} className="grid gap-3 border-t border-zinc-300 py-6 dark:border-zinc-700 sm:grid-cols-[2rem_1fr] sm:gap-5">
                <span className="font-mono text-xs text-sky-600 dark:text-sky-400">0{index + 1}</span>
                <div><h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3><p className="mt-2 max-w-xl leading-7 text-zinc-600 dark:text-zinc-400">{description}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 border-b border-zinc-200 px-4 py-16 sm:px-6 md:grid-cols-12 md:gap-8 md:py-24 lg:px-8 dark:border-zinc-800">
        <SectionHeader title="Education" className="md:col-span-4" />
        <div className="border-t border-zinc-300 pt-5 dark:border-zinc-700 md:col-span-5 md:col-start-6"><h3 className="font-serif text-2xl text-zinc-900 dark:text-zinc-100">BSc in Computer Science</h3><p className="mt-2 text-zinc-600 dark:text-zinc-400">Hawassa University</p></div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <SectionHeader title="Professional Experience" description="A progression from understanding the environment to shaping what runs inside it." className="md:col-span-4" />
          <div className="md:col-span-7 md:col-start-6">
            {EXPERIENCE.map(([title, description]) => <article key={title} className="border-t border-zinc-300 py-7 first:border-t-0 first:pt-0 dark:border-zinc-700"><h3 className="font-serif text-2xl text-zinc-900 dark:text-zinc-100">{title}</h3><p className="mt-3 max-w-xl leading-7 text-zinc-600 dark:text-zinc-400">{description}</p></article>)}
          </div>
        </div>
      </section>

      {/* Engineering Evolution: intentionally preserved unchanged. */}
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

      <section className="mx-auto max-w-7xl border-t border-zinc-200 px-4 py-16 sm:px-6 md:py-24 lg:px-8 dark:border-zinc-800">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <SectionHeader title="A Different Perspective" className="md:col-span-4" />
          <div className="max-w-2xl space-y-6 text-lg leading-8 text-zinc-600 dark:text-zinc-300 md:col-span-7 md:col-start-6">
            <p className="border-l-2 border-sky-500 pl-5 text-base leading-7">After working through technical problems, projects, architecture decisions, and career questions with ChatGPT, I eventually asked a different question:<br /><span className="font-serif text-xl text-zinc-900 dark:text-zinc-100">What kind of engineer do you think I am?</span></p>
            <h3 className="font-serif text-3xl text-zinc-900 dark:text-zinc-100">What I&apos;ve noticed about myself</h3>
            <p>I don&apos;t seem particularly interested in technology for the sake of technology. I&apos;m usually trying to understand how things actually work, how they fail, and how they can be made reliable enough to use in the real world.</p>
            <p>My path has also been somewhat unconventional. I came from an infrastructure and systems background, where servers, networks, operating systems, access control, deployment environments, and production problems are impossible to ignore. That experience shaped the way I think about software.</p>
            <p>I tend to look beyond the code itself.</p>
            <p>When I build a backend, I think about the database, concurrency, failure modes, deployment, security, observability, and what happens when the system has to serve real users. When I work with AI, I don&apos;t want the model to simply produce an impressive response. I want to understand how the surrounding system makes that response useful, controlled, reproducible, and safe.</p>
            <div className="border-y border-zinc-300 py-8 dark:border-zinc-700"><p className="mb-4 font-mono text-xs uppercase tracking-[0.16em] text-sky-600 dark:text-sky-400">The part that stands out</p><p className="font-serif text-2xl leading-tight text-zinc-900 dark:text-zinc-100">If I had to describe one characteristic that consistently appears in the way I work, it would be restlessness.</p><div className="mt-5 space-y-2 text-base leading-7"><p>I&apos;m rarely satisfied with simply making something work.</p><p>I want to know why it works.</p><p>Then I want to know what happens when it doesn&apos;t.</p><p>Then I usually want to rebuild it better.</p></div></div>
            <p>That mindset can sometimes make the journey slower than it needs to be. I can spend a lot of time questioning architecture, comparing approaches, refining a project, or trying to understand a concept deeply instead of accepting the first solution that works.</p>
            <p>But I also think that is becoming one of my strengths.</p>
            <p>I&apos;m learning to turn that curiosity into engineering discipline: choosing the simplest architecture that solves the problem, understanding the trade-offs, and knowing when something is good enough to ship.</p>
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-200 py-16 text-zinc-900 dark:border-zinc-800 dark:text-zinc-100 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-12 md:gap-8 lg:px-8">
          <SectionHeader title="Where I Am Today" className="md:col-span-4" />
          <div className="max-w-2xl space-y-5 border-t border-zinc-200 pt-8 text-lg leading-8 text-zinc-600 dark:border-zinc-800 dark:text-zinc-300 md:col-span-7 md:col-start-6 md:border-t-0 md:py-0"><p>I&apos;m still developing as an engineer, and I don&apos;t pretend to know everything.</p><p>What I do know is the direction I want to take.</p><p>I want to build software that is useful beyond a demonstration - backend platforms, AI systems, developer tools, and products that have to operate under real constraints.</p><p>I&apos;m particularly interested in the space where backend engineering, infrastructure, and AI systems meet.</p><p>That&apos;s the kind of engineering I want to keep getting better at.</p><p className="pt-4 font-serif text-4xl leading-tight text-zinc-950 dark:text-white sm:text-5xl">Building something I can trust.</p></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8"><div className="flex flex-col justify-between gap-8 border-b border-zinc-200 pb-10 dark:border-zinc-800 md:flex-row md:items-end"><div><p className="mb-4 font-mono text-xs uppercase tracking-[0.16em] text-sky-600 dark:text-sky-400">A next step</p><h2 className="font-serif text-4xl text-zinc-900 dark:text-zinc-100 sm:text-5xl">Let&apos;s Build Something Useful</h2><p className="mt-4 max-w-xl text-lg leading-7 text-zinc-600 dark:text-zinc-400">I&apos;m interested in working with people who care about building useful, reliable software - not just impressive demos.</p></div><div className="flex shrink-0 flex-wrap gap-3"><Button href="/contact" icon={<ArrowRight className="h-4 w-4" />}>Get in Touch</Button><Button href="/projects" variant="outline">Explore My Work</Button></div></div></section>
    </div>
  );
}