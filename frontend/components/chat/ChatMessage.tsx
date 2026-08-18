"use client";

import React, { useState } from "react";
import { Bot, User, Copy, Check } from "lucide-react";
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
            : "bg-zinc-900 dark:bg-zinc-800 text-sky-400 border border-zinc-200 dark:border-zinc-700"
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
              : "bg-white dark:bg-zinc-900/90 text-zinc-800 dark:text-zinc-200 border-zinc-200/80 dark:border-zinc-800 rounded-tl-xs"
          }`}
        >
          <div className="space-y-0.5 text-left">{renderFormattedContent(message.content)}</div>
        </div>

        {/* Copy button on hover for assistant messages */}
        {!isUser && (
          <div className="flex items-center gap-1.5 mt-1 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              className="text-[11px] font-mono text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 inline-flex items-center gap-1 cursor-pointer"
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
      </div>
    </div>
  );
}
