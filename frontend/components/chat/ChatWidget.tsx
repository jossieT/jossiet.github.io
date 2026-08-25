"use client";

import React, { useState, useEffect } from "react";
import { Bot, Sparkles } from "lucide-react";
import { ChatPanel } from "./ChatPanel";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  // Owned here (not inside ChatPanel) so the floating container can shrink
  // to a compact header-only card while the conversation stays mounted.
  const [isMinimized, setIsMinimized] = useState(false);

  // Close with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-sky-600 via-sky-500 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white shadow-xl shadow-sky-600/30 hover:shadow-sky-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
            aria-label="Open AI Portfolio Assistant"
          >
            <div className="relative">
              <Bot className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400" />
            </div>

            <span className="text-xs font-semibold tracking-wide hidden sm:inline-block">
              Yosef&apos;s Assistant
            </span>

            <Sparkles className="w-3.5 h-3.5 text-sky-200 group-hover:rotate-12 transition-transform" />
          </button>
        )}
      </div>

      {/* Floating Chat Modal / Panel */}
      {isOpen && (
        <div className="fixed z-50 inset-x-3 bottom-3 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[400px] flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div
            className={
              isMinimized
                ? "flex flex-col w-full"
                : "flex flex-col w-full h-[calc(100dvh-5rem)] max-h-[620px] sm:h-[600px]"
            }
          >
            <ChatPanel
              onClose={() => setIsOpen(false)}
              isMinimized={isMinimized}
              onToggleMinimize={() => setIsMinimized((prev) => !prev)}
            />
          </div>
        </div>
      )}
    </>
  );
}
