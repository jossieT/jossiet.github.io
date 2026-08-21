"use client";

import React, { useRef, useEffect } from "react";
import { Bot, AlertCircle } from "lucide-react";
import { ChatMessageItem } from "@/types/chat";
import { ChatMessage } from "./ChatMessage";
import { SuggestedQuestions } from "./SuggestedQuestions";

interface ChatMessagesProps {
  messages: ChatMessageItem[];
  isLoading: boolean;
  error: string | null;
  agentStatus?: string | null;
  onSelectSuggestion: (text: string) => void;
}

export function ChatMessages({
  messages,
  isLoading,
  error,
  agentStatus,
  onSelectSuggestion,
}: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message / token
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, error, agentStatus]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
      {/* Welcome state when no messages */}
      {messages.length === 0 && (
        <div className="space-y-4 py-2">
          <div className="p-4 rounded-2xl bg-sky-500/5 dark:bg-sky-500/10 border border-sky-500/20 text-zinc-800 dark:text-zinc-200 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-sky-600 dark:text-sky-400">
              <Bot className="w-5 h-5" />
              <span>Ask Yosef AI</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Hi! I&apos;m Yosef&apos;s AI assistant. Ask me about my projects, AI/RAG systems, engineering experience, technical expertise, or how I can help with your next project.
            </p>
          </div>

          {/* Suggested Questions */}
          <SuggestedQuestions onSelect={onSelectSuggestion} />
        </div>
      )}

      {/* Message List */}
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}

      {/* Generating indicator / Agent Tool Status */}
      {isLoading && (
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 pl-10">
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse delay-75" />
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse delay-150" />
          <span className="ml-1 text-[11px] text-sky-600 dark:text-sky-400 font-medium">
            {agentStatus || "Synthesizing portfolio response..."}
          </span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 text-rose-700 dark:text-rose-300 flex items-start gap-2.5 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">Unable to complete response</p>
            <p className="text-zinc-600 dark:text-zinc-400">{error}</p>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
