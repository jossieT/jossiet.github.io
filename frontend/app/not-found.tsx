import React from "react";
import { FileQuestion, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center border border-zinc-200 dark:border-zinc-800">
        <FileQuestion className="w-10 h-10 text-zinc-400" />
      </div>

      <div className="space-y-3 max-w-md">
        <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Page Not Found
        </h2>
        <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
          The project, article, or page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>

      <Button
        href="/"
        variant="primary"
        size="md"
        icon={<Home className="w-4 h-4" />}
      >
        Return Home
      </Button>
    </div>
  );
}
