"use client";

import React from "react";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { SUGGESTED_QUESTIONS } from "@/lib/chat";

interface SuggestedQuestionsProps {
  onSelect: (questionText: string) => void;
}

export function SuggestedQuestions({ onSelect }: SuggestedQuestionsProps) {
  return (
    <div className="space-y-3 py-2">
      <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-zinc-500 dark:text-zinc-400">
        <Sparkles className="w-3.5 h-3.5 text-sky-500" />
        <span>Suggested topics to explore:</span>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {SUGGESTED_QUESTIONS.map((q) => (
          <button
            key={q.id}
            onClick={() => onSelect(q.text)}
            className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium bg-zinc-100/80 dark:bg-zinc-800/60 hover:bg-sky-500/10 dark:hover:bg-sky-500/10 text-zinc-700 dark:text-zinc-300 hover:text-sky-600 dark:hover:text-sky-400 border border-zinc-200/80 dark:border-zinc-700/60 hover:border-sky-500/30 transition-all flex items-center justify-between group cursor-pointer"
          >
            <span>{q.text}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-sky-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
          </button>
        ))}
      </div>
    </div>
  );
}
