import React from "react";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 space-y-4">
      <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
      <p className="text-sm font-mono font-medium text-zinc-500 animate-pulse">
        Fetching data...
      </p>
    </div>
  );
}
