import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  Lightbulb,
  BarChart3,
  Wrench,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getProject, getProjects } from "@/lib/api";
import { CaseStudyStickyNav } from "@/components/projects/CaseStudyStickyNav";
import { ArchitectureVisualizer } from "@/components/projects/ArchitectureVisualizer";
import { TechStackBreakdown } from "@/components/projects/TechStackBreakdown";
import { ChallengesAndSolutions } from "@/components/projects/ChallengesAndSolutions";
import { SecurityReliabilitySection } from "@/components/projects/SecurityReliabilitySection";
import { ProjectNavigationFooter } from "@/components/projects/ProjectNavigationFooter";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const pageData = await getProjects(undefined, 1);
    return pageData.items.map((project) => ({
      slug: project.slug,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {
      title: "Case Study Not Found",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yosefteshome.dev";
  const canonicalUrl = `${siteUrl}/projects/${project.slug}`;

  return {
    title: `${project.title} — Case Study`,
    description: project.summary,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${project.title} — Engineering Case Study`,
      description: project.summary,
      url: canonicalUrl,
      type: "article",
      siteName: "Yosef Teshome Portfolio",
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — Engineering Case Study`,
      description: project.summary,
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Production":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "Active Development":
        return "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20";
      case "Completed":
        return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20";
    }
  };

  // Structured Data Schema for SEO (TechArticle)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: project.title,
    description: project.summary,
    author: {
      "@type": "Person",
      name: "Yosef Teshome",
      jobTitle: "AI Backend & Platform Engineer",
      url: "https://yosefteshome.dev",
    },
    proficiencyLevel: "Expert",
    keywords: project.technologies.join(", "),
    articleBody: `${project.overview} ${project.problem} ${project.solution}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Top Breadcrumb & Hero */}
          <div className="space-y-6">
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-zinc-500 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to All Case Studies
            </Link>

            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="accent" size="md">
                  {project.categoryLabel}
                </Badge>

                {project.status && (
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${getStatusColor(
                      project.status
                    )}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    {project.status}
                  </span>
                )}

                <span className="text-xs font-mono text-zinc-500">
                  Role: <strong className="text-zinc-800 dark:text-zinc-200">{project.role}</strong>
                </span>

                <span className="text-xs font-mono text-zinc-500">
                  Duration: <strong className="text-zinc-800 dark:text-zinc-200">{project.timeline}</strong>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
                {project.title}
              </h1>

              <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
                {project.tagline}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                {project.githubUrl && (
                  <Button
                    href={project.githubUrl}
                    external
                    variant="secondary"
                    size="sm"
                    icon={<GithubIcon className="w-4 h-4" />}
                  >
                    View Source Repository
                  </Button>
                )}
                {project.liveUrl && (
                  <Button
                    href={project.liveUrl}
                    external
                    variant="primary"
                    size="sm"
                    icon={<ExternalLink className="w-4 h-4" />}
                  >
                    Live Demo / Service
                  </Button>
                )}
              </div>
            </div>

            {/* Impact Metrics Strip */}
            {project.impactMetrics && project.impactMetrics.length > 0 && (
              <div className="p-4 sm:p-5 rounded-2xl bg-sky-500/5 dark:bg-sky-500/10 border border-sky-500/20 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {project.impactMetrics.map((metric, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                    <span className="text-xs font-mono text-zinc-800 dark:text-zinc-200 leading-snug">
                      {metric}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sticky Jump Navigation */}
        <CaseStudyStickyNav />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 mt-8">
          {/* SECTION 1: Problem, Solution & Overview */}
          <section id="overview" className="space-y-8 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sky-500/10 dark:bg-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                  Problem & Architectural Solution
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
                  Core business challenges, domain requirements, and technical strategy
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* The Problem */}
              <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/5 dark:bg-red-500/10 space-y-3">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                  The Problem & Bottlenecks
                </h3>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {project.problem}
                </p>
              </div>

              {/* The Solution */}
              <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 space-y-3">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  The Implemented Solution
                </h3>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {project.solution}
                </p>
              </div>
            </div>

            {/* In-depth Overview */}
            <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-3 shadow-xs">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
                Detailed Scope & Objectives
              </h3>
              <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {project.overview}
              </p>
            </div>
          </section>

          {/* SECTION 2: Architecture Visualizer */}
          <ArchitectureVisualizer
            steps={project.architectureSteps}
            mermaidCode={project.architectureMermaid}
          />

          {/* SECTION 3: Technology Stack Breakdown */}
          <TechStackBreakdown
            grouped={project.techStackGrouped}
            flatTechnologies={project.technologies}
          />

          {/* SECTION 4: Key Features & Deliverables */}
          <section id="features" className="space-y-6 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                  Key Technical Capabilities
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
                  Production-grade features, system subsystems, and upcoming roadmap items
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {project.keyFeatures.map((feature, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                        {feature.title}
                      </h3>
                      {feature.status && (
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                            feature.status === "Completed"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {feature.status}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pl-6">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 5: Architectural Decisions & Trade-Offs */}
          <section id="decisions" className="space-y-6 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                  Architecture Decisions & Trade-Offs
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
                  Technical context, decision rationales, and verified system outcomes
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {project.engineeringDecisions.map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs space-y-4"
                >
                  <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    {item.title}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 text-xs">
                    <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 space-y-1">
                      <span className="font-mono font-bold text-zinc-500 uppercase tracking-wider text-[10px]">
                        Context & Need
                      </span>
                      <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                        {item.context}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-sky-500/5 dark:bg-sky-500/10 border border-sky-500/20 space-y-1">
                      <span className="font-mono font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider text-[10px]">
                        Technical Decision
                      </span>
                      <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed">
                        {item.decision}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider text-[10px]">
                        Engineering Outcome
                      </span>
                      <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed">
                        {item.outcome}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 6: Engineering Challenges & Solutions */}
          <ChallengesAndSolutions challenges={project.challenges} />

          {/* SECTION 7: Security & Reliability */}
          <SecurityReliabilitySection items={project.securityReliability} />

          {/* SECTION 8: Results & Outcomes */}
          <section id="outcomes" className="space-y-6 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sky-500/10 dark:bg-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                  Verified Results & Status
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
                  Factual metrics, operational milestones, and current production state
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs space-y-3">
              <ul className="space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
                {project.results.map((res, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                    <span className="leading-relaxed">{res}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* SECTION 9: Lessons Learned */}
          <section id="lessons" className="space-y-6 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                  Lessons Learned & Retrospective
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
                  Key technical takeaways that inform future platform architecture decisions
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.lessonsLearned.map((lesson, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10 space-y-2"
                >
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                    <Lightbulb className="w-4 h-4" />
                    <span>Takeaway #{idx + 1}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {lesson}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 10: Previous / Next & Related Projects */}
          <ProjectNavigationFooter
            navigation={project.navigation}
            currentSlug={project.slug}
          />
        </div>
      </article>
    </>
  );
}
