"use client";

import React, { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global boundary caught error:", error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
      </div>
      
      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Something went wrong
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          We encountered an unexpected error while loading this page. 
          The backend service might be temporarily unavailable.
        </p>
      </div>

      <Button
        onClick={() => reset()}
        variant="primary"
        size="md"
        icon={<RefreshCw className="w-4 h-4" />}
      >
        Try Again
      </Button>
    </div>
  );
}
