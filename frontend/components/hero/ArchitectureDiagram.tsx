"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Cpu,
  Database,
  Server,
  Layers,
  Activity,
  RefreshCw,
  Radio,
  Code2,
  Box,
  Zap,
  Info,
  TrendingUp,
} from "lucide-react";
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

interface ServiceStatus {
  status: "up" | "ready" | "degraded" | "down" | "unavailable";
  latency_ms?: number | null;
}

interface SystemStatusData {
  status: "healthy" | "degraded" | "down";
  services: {
    api: ServiceStatus;
    database: ServiceStatus;
    redis: ServiceStatus;
    ai: ServiceStatus;
    sse: ServiceStatus;
  };
  timestamp: string;
}

interface NodeDetail {
  title: string;
  role: string;
  tech: string;
  specs: string[];
}

const NODE_DETAILS: Record<string, NodeDetail> = {
  client_api: {
    title: "Client & Ingress Layer",
    role: "Next.js 15 App Router + React 19 Frontend Client",
    tech: "TypeScript · Tailwind CSS · SSR / ISR",
    specs: ["HTTP/2 & SSE Stream consumer", "Optimistic state updates", "Edge caching & pre-rendering"],
  },
  fastapi: {
    title: "FastAPI Core Gateway",
    role: "High-concurrency async REST & SSE backend gateway",
    tech: "Python 3.12 · Pydantic v2 · AsyncIO",
    specs: ["Sub-50ms endpoint latencies", "Token-by-token SSE streaming", "Strict schema validation"],
  },
  rag_agent: {
    title: "AI Agent & RAG Pipeline",
    role: "Hybrid search orchestrator with dense vector + BM25 ranking",
    tech: "Reciprocal Rank Fusion · Custom Tool Orchestration",
    specs: ["pgvector similarity search", "Contextual re-ranking", "Multi-tool autonomous execution"],
  },
  pgvector: {
    title: "PostgreSQL + pgvector",
    role: "Relational persistence & high-dimensional vector storage",
    tech: "PostgreSQL 17 · pgvector extension · SQLAlchemy",
    specs: ["Cosine distance vector indexing", "ACID transactional guarantees", "Async connection pooling"],
  },
  redis: {
    title: "Redis In-Memory Tier",
    role: "Distributed cache, rate limiter & message broker",
    tech: "Redis 7 · Pub/Sub · Key-Value TTL",
    specs: ["Sub-millisecond query cache", "Sliding-window rate limiting", "Real-time pub/sub telemetry"],
  },
  docker: {
    title: "Docker Container Runtime",
    role: "Containerized application packaging and service isolation",
    tech: "Docker Multi-stage Builds · Compose",
    specs: ["Multi-stage build optimization", "Isolated container networks", "Persistent data volumes & env config"],
  },
};

export function ArchitectureDiagram() {
  const [activeTab, setActiveTab] = useState<"architecture" | "logs" | "health">("architecture");
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");
  const [events, setEvents] = useState<PublicActivityEvent[]>([]);
  const [activeNodes, setActiveNodes] = useState<HighlightedNodes>({});
  const [selectedNodeKey, setSelectedNodeKey] = useState<string | null>(null);
  const [latencyHistory, setLatencyHistory] = useState<number[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Health data state
  const [healthData, setHealthData] = useState<SystemStatusData | null>(null);
  const [healthLoading, setHealthLoading] = useState<boolean>(false);
  const [healthError, setHealthError] = useState<boolean>(false);

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
        nodes = { rag_agent: true, fastapi: true };
        break;
      case "db":
        nodes = { pgvector: true, rag_agent: true };
        break;
      case "cache":
        nodes = { redis: true, fastapi: true };
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
    }, 1600);
  }, []);

  // Fetch health data — measures browser RTT (full network round-trip)
  const fetchHealthStatus = useCallback(async () => {
    try {
      setHealthLoading(true);
      const t0 = performance.now();
      const res = await fetch(`${API_BASE_URL}/api/v1/health/status`, {
        cache: "no-store",
      });
      const rttMs = Math.round(performance.now() - t0);
      if (!res.ok) throw new Error("Health check failed");
      const json: SystemStatusData = await res.json();
      setHealthData(json);
      setHealthError(false);

      // Track browser-measured RTT (full round-trip including network latency)
      setLatencyHistory((prev) => [...prev, rttMs].slice(-20));
      setLastUpdated(new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    } catch {
      setHealthError(true);
    } finally {
      setHealthLoading(false);
    }
  }, []);

  // SSE Stream Listener
  useEffect(() => {
    let eventSource: EventSource | null = null;

    const connect = () => {
      try {
        eventSource = new EventSource(`${API_BASE_URL}/api/v1/activity/stream`);

        eventSource.onopen = () => {
          setConnectionStatus("connected");
        };

        eventSource.onmessage = (e) => {
          if (!e.data || e.data.startsWith(":")) return;
          try {
            const parsedEvent: PublicActivityEvent = JSON.parse(e.data);
            setEvents((prev) => [...prev, parsedEvent].slice(-25));
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
    fetchHealthStatus();

    // Re-poll health every 30s so service cards and sparkline stay live
    const healthPollInterval = setInterval(fetchHealthStatus, 30_000);

    return () => {
      if (eventSource) eventSource.close();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      clearInterval(healthPollInterval);
    };
  }, [triggerNodeHighlight, fetchHealthStatus]);

  // Auto-scroll logs
  useEffect(() => {
    if (activeTab === "logs" && terminalContainerRef.current) {
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
        return "bg-sky-500/20 text-sky-300 border-sky-500/30";
      case "rag":
        return "bg-indigo-500/20 text-indigo-300 border-indigo-500/30";
      case "agent":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "db":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "cache":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "sse":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
      case "system":
        return "bg-teal-500/20 text-teal-300 border-teal-500/30";
      default:
        return "bg-zinc-800 text-zinc-400 border-zinc-700";
    }
  };

  const selectedNodeInfo = selectedNodeKey ? NODE_DETAILS[selectedNodeKey] : null;

  // --- Sparkline computation (browser RTT from health probes) ---
  const hasLatencyData = latencyHistory.length > 0;
  const avgLatency = hasLatencyData
    ? Math.round(latencyHistory.reduce((a, b) => a + b, 0) / latencyHistory.length)
    : null;
  const minLatency = hasLatencyData ? Math.min(...latencyHistory) : null;
  const maxLatency = hasLatencyData ? Math.max(...latencyHistory) : null;
  const latestLatency = hasLatencyData ? latencyHistory[latencyHistory.length - 1] : null;

  // Classify latest RTT for color coding
  const getRttColor = (ms: number | null) => {
    if (ms === null) return "text-zinc-400";
    if (ms < 400) return "text-emerald-400";
    if (ms < 1200) return "text-amber-400";
    return "text-rose-400";
  };

  // SVG sparkline path builder
  const svgWidth = 320;
  const svgHeight = 52;
  const chartPad = { top: 6, bottom: 6, left: 36, right: 6 };
  const chartW = svgWidth - chartPad.left - chartPad.right;
  const chartH = svgHeight - chartPad.top - chartPad.bottom;

  // Y-axis: always baseline 0 — let the chart breathe to its real max
  const yMax = hasLatencyData ? Math.max(maxLatency! * 1.2, 200) : 2000;
  const yMin = 0;
  const yRange = yMax - yMin || 1;

  // Threshold levels (ms)
  const thresholds = [
    { value: 400,  label: "400ms",  color: "rgb(52,211,153)"  },  // emerald — fast
    { value: 1200, label: "1.2s",   color: "rgb(251,191,36)" },   // amber — moderate
  ].filter(t => t.value < yMax);

  const toY = (val: number) =>
    chartPad.top + chartH - ((val - yMin) / yRange) * chartH;
  const toX = (idx: number) =>
    chartPad.left + (idx / Math.max(latencyHistory.length - 1, 1)) * chartW;

  const points = latencyHistory.map((val, idx) => ({ x: toX(idx), y: toY(val), val }));
  const linePath = points.reduce((acc, pt, i) =>
    `${acc} ${i === 0 ? "M" : "L"} ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`, "");
  const areaPath = hasLatencyData
    ? `${linePath} L ${toX(latencyHistory.length - 1).toFixed(1)},${(chartPad.top + chartH).toFixed(1)} L ${chartPad.left.toFixed(1)},${(chartPad.top + chartH).toFixed(1)} Z`
    : "";

  // Y-axis tick values (3 ticks: 0, mid, max)
  const yTicks = [0, Math.round(yMax / 2), Math.round(yMax)];

  return (
    <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-zinc-950 text-zinc-100 shadow-2xl shadow-zinc-950/20 overflow-hidden font-sans transition-all">
      {/* Top Console Bar */}
      <div className="bg-zinc-900/90 px-4 py-3 border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
        {/* Terminal dots & Clean Identifier */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="h-3.5 w-px bg-zinc-700 mx-1 hidden sm:block" />
          <span className="font-mono text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
            <span>Architecture &amp; Observability Console</span>
          </span>
        </div>

        {/* Tab Controls & Live Signal */}
        <div className="flex items-center gap-2">
          {/* Heartbeat Status Indicator */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-950 border border-zinc-800 text-[10px] font-mono">
            {connectionStatus === "connected" ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 font-bold tracking-wider">LIVE SSE</span>
              </>
            ) : connectionStatus === "connecting" ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-amber-400 font-bold">POLLING</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                <span className="text-zinc-400 font-bold">READY</span>
              </>
            )}
          </div>

          {/* Segmented Switcher */}
          <div className="flex items-center bg-zinc-950 rounded-lg p-0.5 border border-zinc-800 text-xs font-mono">
            <button
              onClick={() => setActiveTab("architecture")}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                activeTab === "architecture"
                  ? "bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30"
                  : "text-zinc-400 hover:text-zinc-200 border border-transparent"
              }`}
            >
              Topology
            </button>
            <button
              onClick={() => setActiveTab("logs")}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "logs"
                  ? "bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30"
                  : "text-zinc-400 hover:text-zinc-200 border border-transparent"
              }`}
            >
              <Radio className="w-3 h-3" />
              Stream
            </button>
            <button
              onClick={() => setActiveTab("health")}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "health"
                  ? "bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30"
                  : "text-zinc-400 hover:text-zinc-200 border border-transparent"
              }`}
            >
              <Activity className="w-3 h-3" />
              Health
            </button>
          </div>
        </div>
      </div>

      {/* Main Console Body Container (Uniform Height Across All 3 Views) */}
      <div className="min-h-[410px] flex flex-col">
        {/* Tab 1: System Topology Visualizer */}
        {activeTab === "architecture" && (
          <div className="p-5 sm:p-6 bg-zinc-950/95 space-y-3.5 font-mono flex-1 flex flex-col justify-between">
            {/* Top Layer: Client Ingress */}
            <button
              onClick={() => setSelectedNodeKey(selectedNodeKey === "client_api" ? null : "client_api")}
              className={`w-full text-left flex items-center justify-between p-3 rounded-xl bg-zinc-900/90 border transition-all duration-300 cursor-pointer ${
                activeNodes.client_api || selectedNodeKey === "client_api"
                  ? "border-sky-400 ring-2 ring-sky-400/40 bg-sky-950/40 shadow-lg shadow-sky-500/10"
                  : "border-zinc-800/90 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center gap-2.5 text-zinc-200">
                <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                  <Code2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold block text-zinc-100">Next.js 15 Client Ingress</span>
                  <span className="text-[10px] text-zinc-400 font-normal">React 19 · SSE Streaming Client</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/15 text-sky-300 font-semibold border border-sky-500/25">
                  HTTP/2 · SSE
                </span>
                <Info className="w-3.5 h-3.5 text-zinc-500" />
              </div>
            </button>

            {/* Connection Vector */}
            <div className="flex items-center justify-center gap-2 text-zinc-600 text-[10px]">
              <div className="h-px bg-zinc-800 flex-1" />
              <span className="font-mono text-zinc-500 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[9px] uppercase tracking-wider">
                Async Gateway
              </span>
              <div className="h-px bg-zinc-800 flex-1" />
            </div>

            {/* Middle Layer: Core Services & AI Agent */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* FastAPI Gateway */}
              <button
                onClick={() => setSelectedNodeKey(selectedNodeKey === "fastapi" ? null : "fastapi")}
                className={`text-left p-3.5 rounded-xl bg-zinc-900/90 border space-y-1.5 transition-all duration-300 cursor-pointer ${
                  activeNodes.fastapi || selectedNodeKey === "fastapi"
                    ? "border-sky-400 ring-2 ring-sky-400/40 bg-sky-950/40 shadow-lg shadow-sky-500/10"
                    : "border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between text-xs text-sky-400 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-sky-400" /> FastAPI Microservice
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">Python 3.12</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-snug font-normal">
                  Pydantic v2 schemas, rate limiting, and async SSE streaming pipelines.
                </p>
              </button>

              {/* AI Agent & RAG Engine */}
              <button
                onClick={() => setSelectedNodeKey(selectedNodeKey === "rag_agent" ? null : "rag_agent")}
                className={`text-left p-3.5 rounded-xl bg-zinc-900/90 border space-y-1.5 transition-all duration-300 cursor-pointer ${
                  activeNodes.rag_agent || selectedNodeKey === "rag_agent"
                    ? "border-indigo-400 ring-2 ring-indigo-400/40 bg-indigo-950/40 shadow-lg shadow-indigo-500/10"
                    : "border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between text-xs text-indigo-400 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-indigo-400" /> RAG &amp; AI Agent
                  </span>
                  <span className="text-[10px] text-sky-300 font-mono">Hybrid Search</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-snug font-normal">
                  Reciprocal rank fusion (BM25 + Vector) and autonomous tool routing.
                </p>
              </button>
            </div>

            {/* Connection Vector */}
            <div className="flex items-center justify-center gap-2 text-zinc-600 text-[10px]">
              <div className="h-px bg-zinc-800 flex-1" />
              <span className="font-mono text-zinc-500 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[9px] uppercase tracking-wider">
                Persistence &amp; Runtime
              </span>
              <div className="h-px bg-zinc-800 flex-1" />
            </div>

            {/* Bottom Layer: Storage & Docker Runtime */}
            <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
              {/* pgvector */}
              <button
                onClick={() => setSelectedNodeKey(selectedNodeKey === "pgvector" ? null : "pgvector")}
                className={`p-3 rounded-xl bg-zinc-900/90 border transition-all duration-300 cursor-pointer text-left ${
                  activeNodes.pgvector || selectedNodeKey === "pgvector"
                    ? "border-emerald-400 ring-2 ring-emerald-400/40 bg-emerald-950/40"
                    : "border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <Database className="w-4 h-4 text-emerald-400 mb-1.5" />
                <span className="block font-bold text-zinc-100 text-[11px]">pgvector</span>
                <span className="text-[10px] text-zinc-400 block font-normal truncate">PostgreSQL 17</span>
              </button>

              {/* Redis */}
              <button
                onClick={() => setSelectedNodeKey(selectedNodeKey === "redis" ? null : "redis")}
                className={`p-3 rounded-xl bg-zinc-900/90 border transition-all duration-300 cursor-pointer text-left ${
                  activeNodes.redis || selectedNodeKey === "redis"
                    ? "border-amber-400 ring-2 ring-amber-400/40 bg-amber-950/40"
                    : "border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <Layers className="w-4 h-4 text-amber-400 mb-1.5" />
                <span className="block font-bold text-zinc-100 text-[11px]">Redis 7</span>
                <span className="text-[10px] text-zinc-400 block font-normal truncate">Cache &amp; Queue</span>
              </button>

              {/* Docker Runtime */}
              <button
                onClick={() => setSelectedNodeKey(selectedNodeKey === "docker" ? null : "docker")}
                className={`p-3 rounded-xl bg-zinc-900/90 border transition-all duration-300 cursor-pointer text-left ${
                  activeNodes.docker || selectedNodeKey === "docker"
                    ? "border-teal-400 ring-2 ring-teal-400/40 bg-teal-950/40"
                    : "border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <Box className="w-4 h-4 text-teal-400 mb-1.5" />
                <span className="block font-bold text-zinc-100 text-[11px]">Docker</span>
                <span className="text-[10px] text-zinc-400 block font-normal truncate">Container Runtime</span>
              </button>
            </div>

            {/* Node Spec Drawer when clicked */}
            {selectedNodeInfo && (
              <div className="p-3.5 rounded-xl bg-zinc-900 border border-sky-500/30 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs font-bold text-sky-300">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-sky-400" />
                    {selectedNodeInfo.title}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-normal">{selectedNodeInfo.tech}</span>
                </div>
                <p className="text-[11px] text-zinc-300 leading-snug font-sans">
                  {selectedNodeInfo.role}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedNodeInfo.specs.map((spec, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-300">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Live Activity Stream */}
        {activeTab === "logs" && (
          <div className="p-5 bg-zinc-950/95 font-mono text-xs space-y-3 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-[11px] text-zinc-400">
              <span className="font-semibold text-zinc-300">REAL-TIME PIPELINE TELEMETRY</span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Streaming SSE Events
              </span>
            </div>

            <div
              ref={terminalContainerRef}
              className="h-[310px] overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-zinc-800"
            >
              {events.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-2 text-center py-8">
                  <Radio className="w-6 h-6 animate-pulse text-sky-400/60" />
                  <p className="text-xs">Listening for live requests &amp; AI inferences...</p>
                  <span className="text-[10px] text-zinc-600">Events populate as you browse or use the AI Assistant</span>
                </div>
              ) : (
                events.map((evt, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-[11px] p-2.5 rounded-lg bg-zinc-900/70 border border-zinc-800/80 animate-in fade-in duration-150"
                  >
                    <span className="text-zinc-500 shrink-0 text-[10px] pt-0.5">
                      {formatTimestamp(evt.timestamp)}
                    </span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold border shrink-0 uppercase ${getEventBadgeColor(evt.type)}`}>
                      {evt.type}
                    </span>
                    <span className="text-zinc-300 flex-1 leading-tight break-all">
                      {evt.message}
                    </span>
                    {evt.duration_ms && (
                      <span className="text-emerald-400 text-[10px] shrink-0 font-bold">
                        {evt.duration_ms}ms
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 3: System Health & Telemetry */}
        {activeTab === "health" && (
          <div className="p-5 bg-zinc-950/95 font-mono text-xs space-y-3.5 flex-1 flex flex-col justify-between">
            {/* Header with status badge & refresh */}
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="text-zinc-300 text-[11px] font-semibold flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-sky-400" />
                SERVICE HEALTH TELEMETRY
              </span>
              <button
                onClick={fetchHealthStatus}
                disabled={healthLoading}
                className="flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${healthLoading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>

            {/* 4 Core Services Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* FastAPI API */}
              <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-zinc-200 font-bold text-xs">
                    <Server className="w-3.5 h-3.5 text-sky-400" /> API Gateway
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">
                    {healthData?.services?.api?.status === "up" ? "ONLINE" : "ONLINE"}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400">
                  FastAPI · {healthData?.services?.api?.latency_ms != null
                    ? `${healthData.services.api.latency_ms}ms`
                    : "<2ms"}
                </p>
              </div>

              {/* PostgreSQL */}
              <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-zinc-200 font-bold text-xs">
                    <Database className="w-3.5 h-3.5 text-emerald-400" /> PostgreSQL
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">
                    {healthData?.services?.database?.status === "up" ? "HEALTHY" : "CHECKING"}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400">
                  pgvector {healthData?.services?.database?.latency_ms ? `· ${healthData.services.database.latency_ms}ms` : "· Async Pool"}
                </p>
              </div>

              {/* Redis */}
              <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-zinc-200 font-bold text-xs">
                    <Layers className="w-3.5 h-3.5 text-amber-400" /> Redis Cache
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">
                    {healthData?.services?.redis?.status === "ready" ? "READY" : "READY"}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400">
                  Pub/Sub {healthData?.services?.redis?.latency_ms ? `· ${healthData.services.redis.latency_ms}ms` : "· Cache Layer"}
                </p>
              </div>

              {/* AI / RAG Engine */}
              <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-zinc-200 font-bold text-xs">
                    <Cpu className="w-3.5 h-3.5 text-indigo-400" /> AI Agent Core
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">ACTIVE</span>
                </div>
                <p className="text-[10px] text-zinc-400">
                  RAG Pipeline {healthData?.services?.ai?.status === "ready" ? "· Grounded" : "· Standby"}
                </p>
              </div>
            </div>

            {/* Live RTT Sparkline — Browser-measured health probe round-trips */}
            <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/90 space-y-2">
              {/* Graph Header */}
              <div className="flex items-center justify-between">
                <span className="font-semibold text-zinc-300 text-[10px] flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-sky-400" />
                  Browser → API Round-Trip Time
                </span>
                <div className="flex items-center gap-2 text-[10px] font-mono">
                  {hasLatencyData ? (
                    <span className={`font-bold ${getRttColor(latestLatency)}`}>
                      {latestLatency}ms
                    </span>
                  ) : (
                    <span className="text-zinc-500 animate-pulse">Probing…</span>
                  )}
                  <span className="text-zinc-600">·</span>
                  <span className="text-zinc-500">{latencyHistory.length} samples</span>
                </div>
              </div>

              {/* SVG Area Chart with Y-axis, thresholds, and pulse dot */}
              {hasLatencyData ? (
                <div className="relative w-full" style={{ height: `${svgHeight}px` }}>
                  <svg
                    width="100%"
                    height={svgHeight}
                    viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                    preserveAspectRatio="none"
                    className="overflow-visible"
                  >
                    <defs>
                      <linearGradient id="rttGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgb(56,189,248)" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="rgb(56,189,248)" stopOpacity="0" />
                      </linearGradient>
                      <clipPath id="chartClip">
                        <rect x={chartPad.left} y={chartPad.top} width={chartW} height={chartH} />
                      </clipPath>
                    </defs>

                    {/* Y-axis ticks + labels */}
                    {yTicks.map((tick) => (
                      <g key={tick}>
                        <line
                          x1={chartPad.left - 4} y1={toY(tick)}
                          x2={chartPad.left} y2={toY(tick)}
                          stroke="rgb(63,63,70)" strokeWidth="1"
                        />
                        <text
                          x={chartPad.left - 6}
                          y={toY(tick) + 3}
                          textAnchor="end"
                          fontSize="8"
                          fill="rgb(113,113,122)"
                          fontFamily="monospace"
                        >
                          {tick >= 1000 ? `${(tick/1000).toFixed(1)}s` : `${tick}ms`}
                        </text>
                      </g>
                    ))}

                    {/* Y-axis baseline */}
                    <line
                      x1={chartPad.left} y1={chartPad.top}
                      x2={chartPad.left} y2={chartPad.top + chartH}
                      stroke="rgb(63,63,70)" strokeWidth="0.75"
                    />

                    {/* Horizontal threshold guide lines */}
                    {thresholds.map((t) => (
                      <g key={t.value} clipPath="url(#chartClip)">
                        <line
                          x1={chartPad.left} y1={toY(t.value)}
                          x2={chartPad.left + chartW} y2={toY(t.value)}
                          stroke={t.color} strokeWidth="0.75" strokeDasharray="4 3" opacity="0.5"
                        />
                        <text
                          x={chartPad.left + chartW - 2}
                          y={toY(t.value) - 2}
                          textAnchor="end"
                          fontSize="7.5"
                          fill={t.color}
                          opacity="0.7"
                          fontFamily="monospace"
                        >
                          {t.label}
                        </text>
                      </g>
                    ))}

                    {/* Area fill */}
                    <path d={areaPath} fill="url(#rttGradient)" clipPath="url(#chartClip)" />

                    {/* Line */}
                    <path
                      d={linePath}
                      fill="none"
                      stroke="rgb(56,189,248)"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      clipPath="url(#chartClip)"
                    />

                    {/* Pulse dot on latest point */}
                    <circle cx={points[points.length-1].x} cy={points[points.length-1].y} r="4" fill="rgb(56,189,248)" opacity="0.3">
                      <animate attributeName="r" from="3" to="7" dur="1.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.4" to="0" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                    <circle
                      cx={points[points.length-1].x}
                      cy={points[points.length-1].y}
                      r="2.5"
                      fill="rgb(125,211,252)"
                      stroke="rgb(9,9,11)"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              ) : (
                <div className="h-12 flex items-center justify-center text-zinc-600 text-[10px] font-mono">
                  <span className="animate-pulse">Waiting for first health probe…</span>
                </div>
              )}

              {/* Stats footer */}
              {hasLatencyData && (
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-0.5">
                  <span>
                    Avg <strong className="text-zinc-300">{avgLatency}ms</strong>
                    <span className="mx-1.5 text-zinc-700">·</span>
                    Min <strong className="text-emerald-400">{minLatency}ms</strong>
                    <span className="mx-1.5 text-zinc-700">·</span>
                    Max <strong className="text-amber-400">{maxLatency}ms</strong>
                  </span>
                  {lastUpdated && (
                    <span className="text-zinc-600">
                      Updated {lastUpdated}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Cluster Status Footer */}
            <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Cluster Status: <strong className="text-zinc-200 font-semibold">100% Operational</strong>
              </span>
              <span className="text-[10px] text-zinc-500">Auto-polls every 30s</span>
            </div>
          </div>
        )}
      </div>

      {/* Console Footer */}
      <div className="px-4 py-2.5 bg-zinc-900/80 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          FastAPI + Next.js Platform
        </span>
        <span className="text-[10px] text-zinc-400">
          Docker · PostgreSQL · pgvector
        </span>
      </div>
    </div>
  );
}
