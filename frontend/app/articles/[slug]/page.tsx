import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { getArticle, getArticles } from "@/lib/api";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const pageData = await getArticles(1);
    return pageData.items.map((article) => ({
      slug: article.slug,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) {
    return {
      title: "Article Not Found",
    };
  }
  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          href="/articles"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-zinc-500 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Articles
        </Link>

        {/* Article Meta Header */}
        <div className="space-y-4 border-b border-zinc-200 dark:border-zinc-800 pb-8">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="accent" size="md">
              {article.category}
            </Badge>
            <span className="flex items-center gap-1 text-xs font-mono text-zinc-600 dark:text-zinc-400">
              <Calendar className="w-3.5 h-3.5" />
              {article.publishedAt}
            </span>
            <span className="flex items-center gap-1 text-xs font-mono text-zinc-600 dark:text-zinc-400">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
            {article.title}
          </h1>

          <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
            {article.excerpt}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-2">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="subtle" size="sm">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Article Content Render */}
        <div className="prose dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300 space-y-6 leading-relaxed">
          {article.content.split("\n\n").map((paragraph, index) => {
            if (paragraph.startsWith("# ")) {
              return null; // Skip main title as it's rendered above
            }
            if (paragraph.startsWith("## ")) {
              return (
                <h2
                  key={index}
                  className="text-xl font-bold text-zinc-900 dark:text-zinc-100 pt-4 border-t border-zinc-200 dark:border-zinc-800/80"
                >
                  {paragraph.replace("## ", "")}
                </h2>
              );
            }
            if (paragraph.startsWith("```")) {
              const lines = paragraph.split("\n");
              const code = lines.slice(1, -1).join("\n");
              return (
                <pre
                  key={index}
                  className="p-4 rounded-xl bg-zinc-900 text-zinc-100 font-mono text-xs overflow-x-auto border border-zinc-800"
                >
                  <code>{code}</code>
                </pre>
              );
            }
            return (
              <p key={index} className="text-sm sm:text-base leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <Link
            href="/articles"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-sky-600 dark:text-sky-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> All Articles
          </Link>
          <Button href="/contact" size="sm">
            Contact Yosef
          </Button>
        </div>
      </div>
    </article>
  );
}
