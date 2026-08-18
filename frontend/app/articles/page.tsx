import { Metadata } from "next";
import { getArticles } from "@/lib/api";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ArticleCard } from "@/components/articles/ArticleCard";

export const metadata: Metadata = {
  title: "Technical Writing & Engineering Insights — Yosef Teshome",
  description:
    "Technical articles on building production RAG systems, FastAPI microservice architecture, pgvector, and cloud-native container deployments.",
};

export default async function ArticlesPage() {
  const pageData = await getArticles(1);
  const articles = pageData?.items || [];

  return (
    <div className="py-16 md:py-24 space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <SectionHeader
          eyebrow="Writing & Architecture"
          title="Technical Articles & Insights"
          description="In-depth articles and engineering breakdowns on production AI platforms, backend microservice design, and cloud-native infrastructure."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
}
