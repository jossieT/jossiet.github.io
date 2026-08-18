import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ArticleNotFound() {
  return (
    <div className="py-24 max-w-md mx-auto px-4 text-center space-y-6">
      <div className="w-12 h-12 rounded-full bg-sky-500/10 text-sky-500 flex items-center justify-center mx-auto">
        <BookOpen className="w-6 h-6" />
      </div>
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Article Not Found
      </h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        The requested technical article does not exist or may have been renamed.
      </p>
      <Button href="/articles" icon={<ArrowLeft className="w-4 h-4" />}>
        Back to Articles
      </Button>
    </div>
  );
}
