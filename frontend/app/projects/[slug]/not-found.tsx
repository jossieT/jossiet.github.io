import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ProjectNotFound() {
  return (
    <div className="py-24 max-w-md mx-auto px-4 text-center space-y-6">
      <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Project Case Study Not Found
      </h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        The requested project case study does not exist or may have been updated.
      </p>
      <Button href="/projects" icon={<ArrowLeft className="w-4 h-4" />}>
        Back to Case Studies
      </Button>
    </div>
  );
}
