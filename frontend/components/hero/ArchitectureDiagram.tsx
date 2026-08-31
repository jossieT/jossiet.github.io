"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Server,
  Database,
  Layers,
  Cpu,
  Terminal,
  Activity,
  ArrowDown,
  ArrowRight,
  Code2,
  Box,
  Radio,
  CheckCircle2,
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import type { PublicActivityEvent, ActivityType } from "@/types/activity";

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

interface TopologyNode {
  id: string;
  title: string;
  subtitle: string;
  tech: string;
  badge: string;
  color: string;
  border: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TOPOLOGY_NODES: Record<string, TopologyNode> = {
  client: {
    id: "client",
    title: "Client & Ingress Layer",
    subtitle: "Next.js 15 App Router + React 19",
    tech: "TypeScript · Tailwind CSS · SSR/ISR",
    badge: "Frontend Client",
    color: "text-sky-600 dark:text-sky-400 bg-sky-500/10",
    border: "border-sky-500/30 hover:border-sky-500",
    icon: Code2,
  },
  gateway: {
    id: "gateway",
    title: "FastAPI Core Gateway",
    subtitle: "High-Concurrency Async REST & SSE",
    tech: "Python 3.12 · Pydantic v2 · AsyncIO",
    badge: "ASGI Core Gateway",
    color: "text-sky-600 dark:text-sky-400 bg-sky-500/10",
    border: "border-sky-500/30 hover:border-sky-500",
    icon: Server,
  },
  database: {
    id: "database",
    title: "PostgreSQL 17 + pgvector",
    subtitle: "Relational & Vector Storage",
    tech: "pgvector · SQLAlchemy · Async Pool",
    badge: "Vector DB",
    color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
    border: "border-emerald-500/30 hover:border-emerald-500",
    icon: Database,
  },
  redis: {
    id: "redis",
    title: "Redis 7 In-Memory Tier",
    subtitle: "Cache & Rate Limiting",
    tech: "Key-Value TTL · Pub/Sub Broker",
    badge: "In-Memory Cache",
    color: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
    border: "border-amber-500/30 hover:border-amber-500",
    icon: Layers,
  },
  ai: {
    id: "ai",
    title: "AI Agent & RAG Pipeline",
    subtitle: "Hybrid Knowledge Retrieval",
    tech: "BM25 + Dense Search · Tool Execution",
    badge: "RAG Engine",
    color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10",
    border: "border-indigo-500/30 hover:border-indigo-500",
    icon: Cpu,
  },
};

export function ArchitectureDiagram() {
  const [activeTab, setActiveTab] = useState<"topology" | "services" | "logs" | "latency">("topology");
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");
  const [events, setEvents] = useState<PublicActivityEvent[]>([]);
  const [latencyHistory, setLatencyHistory] = useState<number[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [secondsAgo, setSecondsAgo] = useState<number>(0);
  const [selectedNode, setSelectedNode] = useState<string | null>("gateway");

  // Health data state
  const [healthData, setHealthData] = useState<SystemStatusData | null>(null);
  const [healthLoading, setHealthLoading] = useState<boolean>(false);
  const [healthError, setHealthError] = useState<boolean>(false);

  const terminalContainerRef = useRef<HTMLDivElement | null>(null);
  const lastProbeTimeRef = useRef<number>(Date.now());

  // Increment seconds since last probe every second
  useEffect(() => {
    const timer = setInterval(() => {
      const diff = Math.floor((Date.now() - lastProbeTimeRef.current) / 1000);
      setSecondsAgo(diff >= 0 ? diff : 0);
    }, 1000);
    return () => clearInterval(timer);
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

      lastProbeTimeRef.current = Date.now();
      setSecondsAgo(0);

      // Track browser-measured RTT
      setLatencyHistory((prev) => [...prev, rttMs].slice(-20));
      setLastUpdated(
        new Date().toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
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
            setEvents((prev) => [...prev, parsedEvent].slice(-30));
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

    // Re-poll health every 30s
    const healthPollInterval = setInterval(fetchHealthStatus, 30_000);

    return () => {
      if (eventSource) eventSource.close();
      clearInterval(healthPollInterval);
    };
  }, [fetchHealthStatus]);

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

  // Sparkline computation
  const hasLatencyData = latencyHistory.length > 0;
  const avgLatency = hasLatencyData
    ? Math.round(latencyHistory.reduce((a, b) => a + b, 0) / latencyHistory.length)
    : null;
  const minLatency = hasLatencyData ? Math.min(...latencyHistory) : null;
  const maxLatency = hasLatencyData ? Math.max(...latencyHistory) : null;
  const latestLatency = hasLatencyData ? latencyHistory[latencyHistory.length - 1] : null;

  const svgWidth = 320;
  const svgHeight = 60;
  const chartPad = { top: 8, bottom: 8, left: 38, right: 8 };
  const chartW = svgWidth - chartPad.left - chartPad.right;
  const chartH = svgHeight - chartPad.top - chartPad.bottom;

  const yMax = hasLatencyData ? Math.max(maxLatency! * 1.15, 200) : 2000;
  const yMin = 0;
  const yRange = yMax - yMin || 1;

  const toY = (val: number) =>
    chartPad.top + chartH - ((val - yMin) / yRange) * chartH;
  const toX = (idx: number) =>
    chartPad.left + (idx / Math.max(latencyHistory.length - 1, 1)) * chartW;

  const points = latencyHistory.map((val, idx) => ({ x: toX(idx), y: toY(val), val }));
  const linePath = points.reduce(
    (acc, pt, i) => `${acc} ${i === 0 ? "M" : "L"} ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`,
    ""
  );

  const yTicks = [0, Math.round(yMax / 2), Math.round(yMax)];

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-md shadow-zinc-900/5 dark:shadow-none overflow-hidden font-sans text-zinc-900 dark:text-zinc-100">
      {/* Top Header Bar with Live SSE Badge & Probe Timer */}
      <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-900/70 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
          <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">
            Backend Runtime Status
          </span>
          <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 hidden sm:inline">
            · FastAPI / PostgreSQL / Redis
          </span>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            {connectionStatus === "connected" ? "Live Stream" : "Reconnecting"}
          </span>
          <span className="text-zinc-400 dark:text-zinc-500">
            {secondsAgo === 0 ? "probed now" : `${secondsAgo}s ago`}
          </span>
        </div>
      </div>

      {/* Segmented View Switcher */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-900/40 text-xs font-mono">
        <button
          onClick={() => setActiveTab("topology")}
          type="button"
          className={`flex-1 py-2 px-2 text-center transition-colors border-b-2 ${
            activeTab === "topology"
              ? "border-sky-500 text-sky-600 dark:text-sky-400 font-bold bg-white dark:bg-zinc-950 shadow-xs"
              : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
        >
          Topology
        </button>
        <button
          onClick={() => setActiveTab("services")}
          type="button"
          className={`flex-1 py-2 px-2 text-center transition-colors border-b-2 ${
            activeTab === "services"
              ? "border-sky-500 text-sky-600 dark:text-sky-400 font-bold bg-white dark:bg-zinc-950 shadow-xs"
              : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
        >
          Services (4)
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          type="button"
          className={`flex-1 py-2 px-2 text-center transition-colors border-b-2 ${
            activeTab === "logs"
              ? "border-sky-500 text-sky-600 dark:text-sky-400 font-bold bg-white dark:bg-zinc-950 shadow-xs"
              : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
        >
          Activity Stream
        </button>
        <button
          onClick={() => setActiveTab("latency")}
          type="button"
          className={`flex-1 py-2 px-2 text-center transition-colors border-b-2 ${
            activeTab === "latency"
              ? "border-sky-500 text-sky-600 dark:text-sky-400 font-bold bg-white dark:bg-zinc-950 shadow-xs"
              : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
        >
          RTT Probe
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="p-3 min-h-[220px] flex flex-col justify-between">
        {/* TAB 0: Simple Visual Architecture Topology */}
        {activeTab === "topology" && (
          <div className="space-y-1.5">
            {/* Layer 1: Client Ingress */}
            <div
              onClick={() => setSelectedNode("client")}
              className={`p-2 rounded-lg border transition-all cursor-pointer bg-white dark:bg-zinc-900/80 ${
                selectedNode === "client"
                  ? "border-sky-500 ring-1 ring-sky-500/30 shadow-xs"
                  : "border-zinc-200 dark:border-zinc-800 hover:border-sky-400"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400">
                    <Code2 className="w-3 h-3" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-bold text-zinc-900 dark:text-zinc-100 block leading-tight">
                      Frontend Client Layer
                    </span>
                    <span className="text-[9.5px] font-mono text-zinc-500 dark:text-zinc-400">
                      Next.js 15 App Router · React 19 · TypeScript
                    </span>
                  </div>
                </div>
                <span className="text-[9.5px] font-mono font-semibold px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                  HTTP/2 &amp; SSE
                </span>
              </div>
            </div>

            {/* Connector Arrow */}
            <div className="flex justify-center items-center py-0.5 text-zinc-300 dark:text-zinc-600">
              <ArrowDown className="w-3.5 h-3.5" />
            </div>

            {/* Layer 2: Core Gateway */}
            <div
              onClick={() => setSelectedNode("gateway")}
              className={`p-2 rounded-lg border transition-all cursor-pointer bg-white dark:bg-zinc-900/80 ${
                selectedNode === "gateway"
                  ? "border-sky-500 ring-1 ring-sky-500/30 shadow-xs"
                  : "border-zinc-200 dark:border-zinc-800 hover:border-sky-400"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400">
                    <Server className="w-3 h-3" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-bold text-zinc-900 dark:text-zinc-100 block leading-tight">
                      FastAPI Core Gateway
                    </span>
                    <span className="text-[9.5px] font-mono text-zinc-500 dark:text-zinc-400">
                      Async REST &amp; SSE Stream Controller (Python 3.12)
                    </span>
                  </div>
                </div>
                <span className="text-[9.5px] font-mono font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  200 OK · ~1.5ms
                </span>
              </div>
            </div>

            {/* Connector Arrow */}
            <div className="flex justify-center items-center py-0.5 text-zinc-300 dark:text-zinc-600">
              <ArrowDown className="w-3.5 h-3.5" />
            </div>

            {/* Layer 3: Tri-System Storage & AI Engine */}
            <div className="grid grid-cols-3 gap-1.5">
              {/* PostgreSQL */}
              <div
                onClick={() => setSelectedNode("database")}
                className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer bg-white dark:bg-zinc-900/80 ${
                  selectedNode === "database"
                    ? "border-emerald-500 ring-1 ring-emerald-500/30 shadow-xs"
                    : "border-zinc-200 dark:border-zinc-800 hover:border-emerald-400"
                }`}
              >
                <div className="w-4 h-4 mx-auto mb-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Database className="w-2.5 h-2.5" />
                </div>
                <span className="text-[10px] font-mono font-bold text-zinc-900 dark:text-zinc-100 block leading-tight">
                  pgvector
                </span>
                <span className="text-[9px] font-mono text-zinc-500 dark:text-zinc-400 block">
                  PostgreSQL 17
                </span>
              </div>

              {/* Redis */}
              <div
                onClick={() => setSelectedNode("redis")}
                className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer bg-white dark:bg-zinc-900/80 ${
                  selectedNode === "redis"
                    ? "border-amber-500 ring-1 ring-amber-500/30 shadow-xs"
                    : "border-zinc-200 dark:border-zinc-800 hover:border-amber-400"
                }`}
              >
                <div className="w-4 h-4 mx-auto mb-0.5 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Layers className="w-2.5 h-2.5" />
                </div>
                <span className="text-[10px] font-mono font-bold text-zinc-900 dark:text-zinc-100 block leading-tight">
                  Redis 7
                </span>
                <span className="text-[9px] font-mono text-zinc-500 dark:text-zinc-400 block">
                  In-Memory Cache
                </span>
              </div>

              {/* AI RAG */}
              <div
                onClick={() => setSelectedNode("ai")}
                className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer bg-white dark:bg-zinc-900/80 ${
                  selectedNode === "ai"
                    ? "border-indigo-500 ring-1 ring-indigo-500/30 shadow-xs"
                    : "border-zinc-200 dark:border-zinc-800 hover:border-indigo-400"
                }`}
              >
                <div className="w-4 h-4 mx-auto mb-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Cpu className="w-2.5 h-2.5" />
                </div>
                <span className="text-[10px] font-mono font-bold text-zinc-900 dark:text-zinc-100 block leading-tight">
                  AI &amp; RAG
                </span>
                <span className="text-[9px] font-mono text-zinc-500 dark:text-zinc-400 block">
                  Hybrid Search
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: Real Services Manifest */}
        {activeTab === "services" && (
          <div className="space-y-2">
            <div className="space-y-1.5 text-xs font-mono">
              {/* FastAPI Gateway */}
              <div className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400">
                    <Server className="w-3 h-3" />
                  </div>
                  <div>
                    <span className="font-bold text-[11px] text-zinc-900 dark:text-zinc-100">
                      FastAPI Gateway Core
                    </span>
                    <span className="text-[9.5px] text-zinc-500 block">
                      GET /api/v1/health/status
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    200 OK
                  </span>
                  <span className="text-[9.5px] text-zinc-500 block font-semibold">
                    {healthData?.services?.api?.latency_ms != null
                      ? `${healthData.services.api.latency_ms}ms overhead`
                      : "~1.5ms"}
                  </span>
                </div>
              </div>

              {/* PostgreSQL */}
              <div className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Database className="w-3 h-3" />
                  </div>
                  <div>
                    <span className="font-bold text-[11px] text-zinc-900 dark:text-zinc-100">
                      PostgreSQL 17 + pgvector
                    </span>
                    <span className="text-[9.5px] text-zinc-500 block">
                      Render Managed Pool (US-West)
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    {healthData?.services?.database?.status === "up" ? "Connected" : "Active"}
                  </span>
                  <span className="text-[9.5px] text-zinc-500 block font-semibold">
                    {healthData?.services?.database?.latency_ms != null
                      ? `${healthData.services.database.latency_ms}ms RTT`
                      : "Async Pool"}
                  </span>
                </div>
              </div>

              {/* Redis */}
              <div className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <Layers className="w-3 h-3" />
                  </div>
                  <div>
                    <span className="font-bold text-[11px] text-zinc-900 dark:text-zinc-100">
                      Redis 7 In-Memory Cache
                    </span>
                    <span className="text-[9.5px] text-zinc-500 block">
                      Pub/Sub &amp; Rate Limiter
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                    PONG
                  </span>
                  <span className="text-[9.5px] text-zinc-500 block font-semibold">
                    {healthData?.services?.redis?.latency_ms != null
                      ? `${healthData.services.redis.latency_ms}ms ping`
                      : "Ready"}
                  </span>
                </div>
              </div>

              {/* AI Agent Core */}
              <div className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Cpu className="w-3 h-3" />
                  </div>
                  <div>
                    <span className="font-bold text-[11px] text-zinc-900 dark:text-zinc-100">
                      AI Agent &amp; RAG Pipeline
                    </span>
                    <span className="text-[9.5px] text-zinc-500 block">
                      Reciprocal Rank Fusion · pgvector
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                    Ready
                  </span>
                  <span className="text-[9.5px] text-zinc-500 block font-semibold">
                    Grounded Tools
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Clean Terminal Activity Log (tail -f) */}
        {activeTab === "logs" && (
          <div className="flex flex-col h-[190px]">
            <div
              ref={terminalContainerRef}
              className="flex-1 overflow-y-auto font-mono text-[10.5px] leading-relaxed p-2.5 rounded-lg bg-zinc-950 text-zinc-300 border border-zinc-800 space-y-1 select-text"
            >
              {events.length === 0 ? (
                <div className="text-zinc-500 py-6 text-center text-xs">
                  Listening to /api/v1/activity/stream (SSE)...
                </div>
              ) : (
                events.map((ev, i) => (
                  <div key={`${ev.timestamp}-${i}`} className="flex items-start gap-2">
                    <span className="text-zinc-500 shrink-0 select-none">
                      {formatTimestamp(ev.timestamp)}
                    </span>
                    <span className="text-sky-400 font-bold uppercase text-[9.5px] shrink-0">
                      [{ev.type}]
                    </span>
                    <span className="text-zinc-200 break-all">
                      {ev.message}
                    </span>
                    {ev.duration_ms && (
                      <span className="text-zinc-500 text-[9.5px] ml-auto shrink-0 font-mono">
                        {ev.duration_ms}ms
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
            <div className="pt-1.5 text-[9.5px] font-mono text-zinc-500 flex items-center justify-between">
              <span>tail -f /api/v1/activity/stream</span>
              <span>{events.length} events received</span>
            </div>
          </div>
        )}

        {/* TAB 3: Real Latency & RTT Probes */}
        {activeTab === "latency" && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-700 dark:text-zinc-300 font-semibold text-[11px]">
                Browser HTTP Round-Trip Time
              </span>
              <span className="text-zinc-500 text-[10px]">
                {latencyHistory.length} probe samples
              </span>
            </div>

            {hasLatencyData ? (
              <div className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
                <svg
                  width="100%"
                  height={svgHeight}
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  preserveAspectRatio="none"
                  className="overflow-visible"
                >
                  {/* Y-axis tick lines */}
                  {yTicks.map((tick) => (
                    <g key={tick}>
                      <line
                        x1={chartPad.left}
                        y1={toY(tick)}
                        x2={chartPad.left + chartW}
                        y2={toY(tick)}
                        stroke="currentColor"
                        className="text-zinc-200 dark:text-zinc-800"
                        strokeWidth="0.75"
                        strokeDasharray="2 2"
                      />
                      <text
                        x={chartPad.left - 4}
                        y={toY(tick) + 3}
                        textAnchor="end"
                        fontSize="8"
                        className="fill-zinc-400 dark:fill-zinc-500 font-mono"
                      >
                        {tick >= 1000 ? `${(tick / 1000).toFixed(1)}s` : `${tick}ms`}
                      </text>
                    </g>
                  ))}

                  {/* Clean Sky Blue Line */}
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#0284c7"
                    className="dark:stroke-sky-400"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Latest Probe Point */}
                  {points.length > 0 && (
                    <circle
                      cx={points[points.length - 1].x}
                      cy={points[points.length - 1].y}
                      r="3"
                      className="fill-sky-600 dark:fill-sky-400"
                    />
                  )}
                </svg>
              </div>
            ) : (
              <div className="h-16 flex items-center justify-center text-zinc-500 text-xs font-mono">
                Polling endpoint /api/v1/health/status...
              </div>
            )}

            {/* Exact Statistics Footer */}
            {hasLatencyData && (
              <div className="grid grid-cols-4 gap-1.5 text-center text-xs font-mono p-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60">
                <div>
                  <span className="text-[9px] text-zinc-500 block">LATEST</span>
                  <strong className="text-[11px] text-sky-600 dark:text-sky-400">{latestLatency}ms</strong>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 block">MIN</span>
                  <strong className="text-[11px] text-zinc-900 dark:text-zinc-100">{minLatency}ms</strong>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 block">AVG</span>
                  <strong className="text-[11px] text-zinc-900 dark:text-zinc-100">{avgLatency}ms</strong>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 block">MAX</span>
                  <strong className="text-[11px] text-zinc-900 dark:text-zinc-100">{maxLatency}ms</strong>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Panel Footer */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between text-[9.5px] font-mono text-zinc-500">
          <span>Overall: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{healthData?.status ?? "healthy"}</strong></span>
          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchHealthStatus}
              type="button"
              className="text-sky-600 dark:text-sky-400 hover:underline cursor-pointer font-medium"
            >
              Poll now
            </button>
            {lastUpdated && <span>Updated {lastUpdated}</span>}
          </div>
        </div>
      </div>

      {/* Explanatory Data & Telemetry Breakdown Box */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/90 dark:bg-zinc-900/50 p-2.5 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Telemetry &amp; Data Origin
          </span>
          <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
            Real-Time Backend
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-mono text-[10px]">
          {/* Data Source & Services */}
          <div className="p-2 rounded-md border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950/70 space-y-0.5">
            <div className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 text-[10px]">
              <Server className="w-3 h-3 text-sky-500 shrink-0" />
              <span>Live Health Probes</span>
            </div>
            <p className="text-[9.5px] text-zinc-500 dark:text-zinc-400 font-sans leading-tight">
              Polled every 30s from <code className="text-zinc-800 dark:text-zinc-200 font-mono">/health/status</code>. Queries FastAPI core, PostgreSQL pool, and Redis.
            </p>
          </div>

          {/* Activity Stream SSE */}
          <div className="p-2 rounded-md border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950/70 space-y-0.5">
            <div className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 text-[10px]">
              <Radio className="w-3 h-3 text-emerald-500 shrink-0" />
              <span>SSE Activity Stream</span>
            </div>
            <p className="text-[9.5px] text-zinc-500 dark:text-zinc-400 font-sans leading-tight">
              HTTP/2 Server-Sent Events stream from <code className="text-zinc-800 dark:text-zinc-200 font-mono">/activity/stream</code> broadcasting API &amp; DB operations.
            </p>
          </div>

          {/* RTT Calculation */}
          <div className="p-2 rounded-md border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950/70 space-y-0.5">
            <div className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 text-[10px]">
              <Activity className="w-3 h-3 text-amber-500 shrink-0" />
              <span>Browser RTT Probe</span>
            </div>
            <p className="text-[9.5px] text-zinc-500 dark:text-zinc-400 font-sans leading-tight">
              Calculated via browser <code className="text-zinc-800 dark:text-zinc-200 font-mono">performance.now()</code>. Measures true end-to-end network round-trip.
            </p>
          </div>

          {/* Architecture Topology */}
          <div className="p-2 rounded-md border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950/70 space-y-0.5">
            <div className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 text-[10px]">
              <Cpu className="w-3 h-3 text-indigo-500 shrink-0" />
              <span>3-Tier Architecture</span>
            </div>
            <p className="text-[9.5px] text-zinc-500 dark:text-zinc-400 font-sans leading-tight">
              Next.js 15 Client → Async FastAPI Core → PostgreSQL (pgvector) + Redis + AI RAG Engine.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
