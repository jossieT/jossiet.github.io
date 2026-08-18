"use client";

import React, { useState, useRef } from "react";
import { Bot, RotateCcw, X, Sparkles } from "lucide-react";
import { ChatMessageItem, SourceRef } from "@/types/chat";
import { streamChat } from "@/lib/api";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";

interface ChatPanelProps {
  onClose: () => void;
}

export function ChatPanel({ onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agentStatus, setAgentStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const handleClear = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages([]);
    setInput("");
    setError(null);
    setAgentStatus(null);
    setIsLoading(false);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    setError(null);
    setAgentStatus(null);
    setInput("");

    // Create user message
    const userMsg: ChatMessageItem = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    // Placeholder for streaming assistant response
    const assistantId = `asst-${Date.now()}`;
    const assistantMsg: ChatMessageItem = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages([...newMessages, assistantMsg]);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      // Map messages for backend API
      const apiMessages = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      let accumulatedText = "";
      let capturedSources: SourceRef[] | undefined;
      const stream = streamChat(apiMessages, controller.signal);

      for await (const event of stream) {
        // Status event from agent tool execution
        if (typeof event === "object" && "status" in event) {
          setAgentStatus(event.status);
          continue;
        }

        // Sources metadata
        if (typeof event === "object" && "sources" in event) {
          capturedSources = event.sources;
          // Clear tool execution status once sources/tokens begin
          setAgentStatus(null);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, sources: capturedSources } : m
            )
          );
          continue;
        }

        // Plain string token
        const token = event as string;
        accumulatedText += token;
        setAgentStatus(null);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: accumulatedText } : m
          )
        );
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        // User aborted generation — keep accumulated tokens
        return;
      }
      const errMsg = err instanceof Error ? err.message : "Failed to generate AI response.";
      setError(errMsg);
      // Remove empty assistant placeholder on immediate error
      setMessages((prev) => prev.filter((m) => m.id !== assistantId || m.content.length > 0));
    } finally {
      setIsLoading(false);
      setAgentStatus(null);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="px-4 py-3.5 bg-zinc-50/90 dark:bg-zinc-900/90 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Bot className="w-4 h-4" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                AI Portfolio Concierge
              </h3>
              <Sparkles className="w-3 h-3 text-sky-500" />
            </div>
            <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 block">
              Controlled AI Agent • Tool-Grounded
            </span>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              onClick={handleClear}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Reset conversation"
              aria-label="Reset conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Close chat"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <ChatMessages
        messages={messages}
        isLoading={isLoading}
        error={error}
        agentStatus={agentStatus}
        onSelectSuggestion={(qText) => handleSendMessage(qText)}
      />

      {/* Input Area */}
      <ChatInput
        input={input}
        setInput={setInput}
        onSubmit={() => handleSendMessage()}
        onStop={handleStop}
        isLoading={isLoading}
      />
    </div>
  );
}
