import React from "react";
import Link from "next/link";
import { Clock, Calendar, ArrowUpRight } from "lucide-react";
import { Article } from "@/types/portfolio";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card className="flex flex-col justify-between h-full group">
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-600 dark:text-zinc-400">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {article.publishedAt}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {article.readTime}
          </span>
        </div>

        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
          <Link href={`/articles/${article.slug}`}>{article.title}</Link>
        </h3>

        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
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

      <div className="pt-4 mt-6 border-t border-zinc-200 dark:border-zinc-800/80">
        <Link
          href={`/articles/${article.slug}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
        >
          Read Article
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </Card>
  );
}
