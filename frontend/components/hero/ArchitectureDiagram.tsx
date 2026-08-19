"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Cpu, Database, Server, Terminal, ShieldCheck, ArrowRight, Layers } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import type { PublicActivityEvent, ActivityType } from "@/types/activity";

type HighlightedNodes = {
  client_api?: boolean;
  fastapi?: boolean;
  rag_agent?: boolean;
  pgvector?: boolean;
  redis?: boolean;
  docker?: boolean;
};

export function ArchitectureDiagram() {
  const [activeTab, setActiveTab] = useState<"architecture" | "terminal">("architecture");
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");
  const [events, setEvents] = useState<PublicActivityEvent[]>([]);
  const [activeNodes, setActiveNodes] = useState<HighlightedNodes>({});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const terminalContainerRef = useRef<HTMLDivElement | null>(null);

  const triggerNodeHighlight = useCallback((type: ActivityType) => {
    let nodes: HighlightedNodes = {};

    switch (type) {
      case "api":
      case "sse":
        nodes = { client_api: true, fastapi: true };
        break;
      case "rag":
      case "agent":
        nodes = { rag_agent: true };
        break;
      case "db":
        nodes = { pgvector: true };
        break;
      case "cache":
        nodes = { redis: true };
        break;
      case "system":
        nodes = { docker: true, fastapi: true };
        break;
    }

    setActiveNodes(nodes);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setActiveNodes({});
    }, 1500);
  }, []);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    const connect = () => {
      try {
        eventSource = new EventSource(`${API_BASE_URL}/api/v1/activity/stream`);

        eventSource.onopen = () => {
          setConnectionStatus("connected");
        };

        eventSource.onmessage = (e) => {
          if (!e.data || e.data.startsWith(":")) return; // ignore comments / keepalives
          try {
            const parsedEvent: PublicActivityEvent = JSON.parse(e.data);
            
            // Append to rolling log buffer (keep last 30 items)
            setEvents((prev) => [...prev, parsedEvent].slice(-30));

            // Trigger node highlight based on event type
            triggerNodeHighlight(parsedEvent.type);
          } catch (err) {
            console.error("Failed to parse activity event:", err);
          }
        };

        eventSource.onerror = () => {
          setConnectionStatus("connecting");
        };
      } catch (err) {
        console.error("Failed to connect to activity stream:", err);
        setConnectionStatus("disconnected");
      }
    };

    connect();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [triggerNodeHighlight]);

  // Auto-scroll inside terminal log container only (prevent triggering window/page scroll)
  useEffect(() => {
    if (activeTab === "terminal" && terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [events, activeTab]);

  const formatTimestamp = (tsString: string) => {
    try {
      const date = new Date(tsString);
      return date.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return "00:00:00";
    }
  };

  const getEventBadgeColor = (type: ActivityType) => {
    switch (type) {
      case "api":
        return "bg-sky-500/20 text-sky-400 border-sky-500/30";
      case "rag":
        return "bg-indigo-500/20 text-indigo-400 border-indigo-500/30";
      case "agent":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "db":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "cache":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "sse":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "system":
        return "bg-teal-500/20 text-teal-400 border-teal-500/30";
      default:
        return "bg-zinc-800 text-zinc-400 border-zinc-700";
    }
  };

  return (
    <div className="theme-dark-surface rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 text-zinc-100 shadow-2xl overflow-hidden font-sans">
      {/* Top Window Bar */}
      <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-2 font-mono text-xs text-zinc-400 hidden sm:inline">
            platform_architecture.py — yosef-platform
          </span>
          <span className="ml-2 font-mono text-xs text-zinc-400 sm:hidden">
            system_topology
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Connection Status Badge */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-mono">
            {connectionStatus === "connected" ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-400 font-bold">LIVE</span>
              </>
            ) : connectionStatus === "connecting" ? (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-amber-400 font-bold">RECONNECTING...</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-red-400 font-bold">OFFLINE</span>
              </>
            )}
          </div>

          <div className="flex items-center bg-zinc-900 rounded-md p-1 border border-zinc-800 text-xs font-mono">
            <button
              onClick={() => setActiveTab("architecture")}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                activeTab === "architecture"
                  ? "bg-sky-500/20 text-sky-400 font-semibold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              System Topology
            </button>
            <button
              onClick={() => setActiveTab("terminal")}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                activeTab === "terminal"
                  ? "bg-sky-500/20 text-sky-400 font-semibold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Live Logs
            </button>
          </div>
        </div>
      </div>

      {/* Main Container Content */}
      {activeTab === "architecture" ? (
        <div className="p-6 bg-zinc-950/90 space-y-5 font-mono">
          {/* Top Layer: Client Request */}
          <div
            className={`flex items-center justify-between p-3 rounded-lg bg-zinc-900/80 border text-xs transition-all duration-300 ${
              activeNodes.client_api
                ? "border-sky-400 ring-2 ring-sky-400/50 bg-sky-950/40 shadow-lg shadow-sky-500/10 scale-[1.01]"
                : "border-zinc-800"
            }`}
          >
            <div className="flex items-center gap-2 text-zinc-300">
              <Terminal className={`w-4 h-4 transition-colors ${activeNodes.client_api ? "text-sky-300" : "text-sky-400"}`} />
              <span>Client Query / API Request</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 font-bold">
              HTTP / SSE
            </span>
          </div>

          <div className="flex justify-center">
            <ArrowRight className="w-4 h-4 text-zinc-600 rotate-90" />
          </div>

          {/* Core Engine Layer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* FastAPI Service Node */}
            <div
              className={`p-3.5 rounded-lg bg-zinc-900 border space-y-2 transition-all duration-300 ${
                activeNodes.fastapi
                  ? "border-sky-400 ring-2 ring-sky-400/50 bg-sky-950/40 shadow-lg shadow-sky-500/10 scale-[1.01]"
                  : "border-sky-500/30"
              }`}
            >
              <div className="flex items-center justify-between text-xs text-sky-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5" /> FastAPI Service
                </span>
                <span className="text-[10px] text-emerald-400">Python 3.12</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-tight">
                Pydantic v2 validation, SSE token streaming &amp; RBAC scopes
              </p>
            </div>

            {/* RAG & AI Agent Node */}
            <div
              className={`p-3.5 rounded-lg bg-zinc-900 border space-y-2 transition-all duration-300 ${
                activeNodes.rag_agent
                  ? "border-indigo-400 ring-2 ring-indigo-400/50 bg-indigo-950/40 shadow-lg shadow-indigo-500/10 scale-[1.01]"
                  : "border-indigo-500/30"
              }`}
            >
              <div className="flex items-center justify-between text-xs text-indigo-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" /> RAG &amp; AI Agent
                </span>
                <span className="text-[10px] text-sky-400">Hybrid Search</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-tight">
                Reciprocal rank fusion (BM25 + Vector) &amp; Tool Orchestration
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowRight className="w-4 h-4 text-zinc-600 rotate-90" />
          </div>

          {/* Bottom Storage Layer */}
          <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
            {/* pgvector Node */}
            <div
              className={`p-2.5 rounded-lg bg-zinc-900/90 border transition-all duration-300 ${
                activeNodes.pgvector
                  ? "border-emerald-400 ring-2 ring-emerald-400/50 bg-emerald-950/40 shadow-lg shadow-emerald-500/10 scale-[1.02]"
                  : "border-zinc-800"
              }`}
            >
              <Database className="w-4 h-4 text-sky-400 mx-auto mb-1" />
              <span className="block font-bold text-zinc-200">pgvector</span>
              <span className="text-[10px] text-zinc-500">PostgreSQL 17</span>
            </div>

            {/* Redis Node */}
            <div
              className={`p-2.5 rounded-lg bg-zinc-900/90 border transition-all duration-300 ${
                activeNodes.redis
                  ? "border-red-400 ring-2 ring-red-400/50 bg-red-950/40 shadow-lg shadow-red-500/10 scale-[1.02]"
                  : "border-zinc-800"
              }`}
            >
              <Layers className="w-4 h-4 text-red-400 mx-auto mb-1" />
              <span className="block font-bold text-zinc-200">Redis 7</span>
              <span className="text-[10px] text-zinc-500">Cache / Queue</span>
            </div>

            {/* Docker Node */}
            <div
              className={`p-2.5 rounded-lg bg-zinc-900/90 border transition-all duration-300 ${
                activeNodes.docker
                  ? "border-teal-400 ring-2 ring-teal-400/50 bg-teal-950/40 shadow-lg shadow-teal-500/10 scale-[1.02]"
                  : "border-zinc-800"
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <span className="block font-bold text-zinc-200">Docker</span>
              <span className="text-[10px] text-zinc-500">Containers</span>
            </div>
          </div>
        </div>
      ) : (
        <div
          ref={terminalContainerRef}
          className="p-5 bg-zinc-950 font-mono text-xs space-y-2 text-zinc-300 min-h-[260px] max-h-[360px] overflow-y-auto"
        >
          {events.length > 0 ? (
            events.map((evt, idx) => (
              <div
                key={`${evt.timestamp}-${idx}`}
                className="flex flex-wrap items-center gap-2 py-1 border-b border-zinc-900/60 last:border-0 animate-fadeIn"
              >
                <span className="text-zinc-500 text-[11px]">
                  [{formatTimestamp(evt.timestamp)}]
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded border font-bold uppercase tracking-wider ${getEventBadgeColor(
                    evt.type
                  )}`}
                >
                  {evt.type}
                </span>
                <span className="text-zinc-200 flex-1 truncate">{evt.message}</span>
                {evt.duration_ms !== null && evt.duration_ms !== undefined && (
                  <span className="text-[10px] text-zinc-400">
                    {evt.duration_ms}ms
                  </span>
                )}
                <span
                  className={`text-[10px] font-bold ${
                    evt.status === "error"
                      ? "text-red-400"
                      : evt.status === "info"
                      ? "text-amber-400"
                      : "text-emerald-400"
                  }`}
                >
                  {evt.status}
                </span>
              </div>
            ))
          ) : connectionStatus === "connecting" ? (
            <div className="py-8 text-center space-y-2">
              <p className="text-amber-400 animate-pulse font-bold">RECONNECTING...</p>
              <p className="text-zinc-500 text-[11px]">Establishing SSE event stream connection</p>
            </div>
          ) : (
            <div className="py-8 text-center space-y-2">
              <p className="text-emerald-400 font-bold">SYSTEM READY</p>
              <p className="text-zinc-500 text-[11px]">Waiting for real application activity...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
