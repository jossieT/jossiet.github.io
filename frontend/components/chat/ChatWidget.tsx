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
      <div className="fixed bottom-6 right-6 z-40">
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
        <div className="fixed z-50 bottom-6 right-6 w-[calc(100vw-3rem)] max-w-[350px] flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* This wrapper's classes never change after mount — the open
              animation plays exactly once and the widget width is identical
              in both states, so toggling can never flash a screen-wide
              layout. Only the height differs between expanded/minimized. */}
          <div
            className={
              isMinimized
                ? "flex flex-col"
                : "flex flex-col h-[100dvh] sm:h-[550px] sm:max-h-[calc(100dvh-3rem)]"
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
