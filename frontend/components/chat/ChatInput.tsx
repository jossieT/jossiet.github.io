"use client";

import React, { useRef, useEffect } from "react";
import { Send, Square } from "lucide-react";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: () => void;
  onStop?: () => void;
  isLoading: boolean;
  maxLength?: number;
}

export function ChatInput({
  input,
  setInput,
  onSubmit,
  onStop,
  isLoading,
  maxLength = 2000,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim()) {
        onSubmit();
      }
    }
  };

  const remaining = maxLength - input.length;
  const isOverLimit = remaining < 0;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (isLoading && onStop) {
          onStop();
        } else if (!isLoading && input.trim()) {
          onSubmit();
        }
      }}
      className="p-3 bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800"
    >
      <div className="relative flex items-end gap-2 bg-slate-100 dark:bg-zinc-800/80 rounded-2xl border border-slate-300 dark:border-zinc-700/80 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20 transition-all p-1.5">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isLoading ? "Generating response..." : "Ask a question about Yosef's work..."}
          disabled={isLoading}
          rows={1}
          maxLength={maxLength}
          className="w-full resize-none bg-transparent px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none max-h-32 disabled:opacity-60"
          aria-label="Chat input"
        />

        <div className="flex items-center gap-1 shrink-0 pb-1 pr-1">
          {isLoading ? (
            <button
              type="button"
              onClick={onStop}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white dark:bg-zinc-700 dark:hover:bg-zinc-600 transition-colors cursor-pointer"
              title="Stop generating"
              aria-label="Stop generating"
            >
              <Square className="w-4 h-4 fill-current text-sky-400" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim() || isOverLimit}
              className="p-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm shadow-sky-600/20 cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 px-1 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
        <span>Press Enter to send, Shift+Enter for new line</span>
        <span className={remaining < 100 ? "text-amber-500 font-bold" : ""}>
          {input.length}/{maxLength}
        </span>
      </div>
    </form>
  );
}
