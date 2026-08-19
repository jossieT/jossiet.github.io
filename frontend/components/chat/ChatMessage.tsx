"use client";

import React, { useState } from "react";
import { Bot, User, Copy, Check, Database } from "lucide-react";
import { ChatMessageItem } from "@/types/chat";

interface ChatMessageProps {
  message: ChatMessageItem;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard error
    }
  };

  // Basic safe markdown parser for formatting bold, code, lists, and links
  const renderFormattedContent = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, lineIdx) => {
      // Bullet list item
      if (line.trim().startsWith("•") || line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        const itemText = line.trim().replace(/^([•*-]\s*)/, "");
        return (
          <li key={lineIdx} className="ml-4 list-disc text-sm leading-relaxed my-0.5">
            {renderInlineStyles(itemText)}
          </li>
        );
      }

      // Numbered list item
      const numMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        return (
          <li key={lineIdx} className="ml-4 list-decimal text-sm leading-relaxed my-0.5">
            {renderInlineStyles(numMatch[2])}
          </li>
        );
      }

      // Empty line
      if (!line.trim()) {
        return <div key={lineIdx} className="h-2" />;
      }

      // Standard paragraph
      return (
        <p key={lineIdx} className="text-sm leading-relaxed my-1">
          {renderInlineStyles(line)}
        </p>
      );
    });
  };

  const renderInlineStyles = (text: string): React.ReactNode[] => {
    // Split by bold (**text**) or inline code (`code`)
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|https?:\/\/[^\s)]+)/g);

    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-semibold text-zinc-900 dark:text-zinc-100">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 rounded bg-zinc-200/80 dark:bg-zinc-800 text-[13px] font-mono text-sky-600 dark:text-sky-400"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith("http://") || part.startsWith("https://")) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-600 dark:text-sky-400 hover:underline font-medium break-all"
          >
            {part}
          </a>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div
      className={`flex gap-3 text-sm transition-opacity duration-200 ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-semibold shadow-sm ${
          isUser
            ? "bg-sky-600 text-white"
            : "bg-zinc-200 dark:bg-zinc-800 text-sky-700 dark:text-sky-400 border border-zinc-300 dark:border-zinc-700"
        }`}
        aria-label={isUser ? "You" : "AI Assistant"}
      >
        {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
      </div>

      {/* Message Bubble */}
      <div className={`relative group max-w-[84%] sm:max-w-[78%] ${isUser ? "text-right" : "text-left"}`}>
        <div
          className={`px-4 py-3 rounded-2xl shadow-sm border ${
            isUser
              ? "bg-sky-600 text-white border-sky-600 rounded-tr-xs"
              : "bg-zinc-100 dark:bg-zinc-800/90 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 rounded-tl-xs"
          }`}
        >
          <div className="space-y-0.5 text-left">{renderFormattedContent(message.content)}</div>
        </div>

        {/* Copy + timestamp row */}
        {!isUser && (
          <div className="flex items-center gap-1.5 mt-1 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 inline-flex items-center gap-1 cursor-pointer"
              title="Copy message"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span className="text-emerald-500">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
            <span className="text-[10px] text-zinc-400 font-mono">
              • {message.timestamp}
            </span>
          </div>
        )}

        {/* RAG source badges */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-2 ml-1 flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 text-[10px] text-zinc-500 dark:text-zinc-400 font-mono shrink-0">
              <Database className="w-2.5 h-2.5" />
              Sources:
            </span>
            {message.sources.map((src, idx) => {
              const label = src.source_title || src.source_type;
              const badge = (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700 hover:border-sky-400 dark:hover:border-sky-500 transition-colors"
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      src.source_type === "project"
                        ? "bg-sky-500"
                        : src.source_type === "experience"
                        ? "bg-violet-500"
                        : src.source_type === "skill"
                        ? "bg-emerald-500"
                        : src.source_type === "service"
                        ? "bg-amber-500"
                        : src.source_type === "article"
                        ? "bg-rose-500"
                        : "bg-zinc-400"
                    }`}
                  />
                  {label}
                </span>
              );
              return src.source_url ? (
                <a
                  key={idx}
                  href={src.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={src.section || src.source_title}
                >
                  {badge}
                </a>
              ) : (
                badge
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
