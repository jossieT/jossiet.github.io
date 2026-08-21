"use client";

import React, { useEffect, useState } from "react";
import { Activity, RefreshCw, Server, Database, Layers, Cpu, Radio } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

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

export function SystemStatusCard() {
  const [data, setData] = useState<SystemStatusData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [lastCheckedTime, setLastCheckedTime] = useState<Date | null>(null);
  const [relativeTimeString, setRelativeTimeString] = useState<string>("just now");

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/v1/health/status`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`Health status endpoint returned ${res.status}`);
      }

      const json: SystemStatusData = await res.json();
      setData(json);
      setError(false);
      setLastCheckedTime(new Date());
    } catch (err) {
      console.warn("System status check failed:", err);
      setError(true);
      setLastCheckedTime(new Date());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadStatus = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/health/status`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Health status endpoint returned ${res.status}`);
        }

        const json: SystemStatusData = await res.json();
        if (isMounted) {
          setData(json);
          setError(false);
          setLastCheckedTime(new Date());
          setLoading(false);
        }
      } catch (err) {
        console.warn("System status check failed:", err);
        if (isMounted) {
          setError(true);
          setLastCheckedTime(new Date());
          setLoading(false);
        }
      }
    };

    loadStatus();
    const interval = setInterval(loadStatus, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Update relative timestamp string every 5 seconds
  useEffect(() => {
    const updateRelativeTime = () => {
      if (!lastCheckedTime) {
        setRelativeTimeString("never");
        return;
      }
      const secondsAgo = Math.floor((new Date().getTime() - lastCheckedTime.getTime()) / 1000);
      if (secondsAgo < 10) {
        setRelativeTimeString("just now");
      } else if (secondsAgo < 60) {
        setRelativeTimeString(`${secondsAgo}s ago`);
      } else {
        const minsAgo = Math.floor(secondsAgo / 60);
        setRelativeTimeString(`${minsAgo}m ago`);
      }
    };

    updateRelativeTime();
    const timer = setInterval(updateRelativeTime, 5000);
    return () => clearInterval(timer);
  }, [lastCheckedTime]);

  const getOverallBadge = () => {
    if (error || !data) {
      return {
        label: "OFFLINE",
        colorClass: "text-red-400 bg-red-500/10 border-red-500/30",
        dotClass: "bg-red-500",
      };
    }
    if (data.status === "healthy") {
      return {
        label: "LIVE",
        colorClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
        dotClass: "bg-emerald-500 animate-pulse",
      };
    }
    if (data.status === "degraded") {
      return {
        label: "DEGRADED",
        colorClass: "text-amber-400 bg-amber-500/10 border-amber-500/30",
        dotClass: "bg-amber-500 animate-pulse",
      };
    }
    return {
      label: "DOWN",
      colorClass: "text-red-400 bg-red-500/10 border-red-500/30",
      dotClass: "bg-red-500",
    };
  };

  const getServiceStatusDisplay = (
    serviceKey: "api" | "database" | "redis" | "ai" | "sse"
  ) => {
    if (error || !data) {
      return {
        label: "OFFLINE",
        textColor: "text-red-400",
        dotColor: "bg-red-500",
      };
    }
    const item = data.services[serviceKey];
    if (!item) {
      return {
        label: "UNKNOWN",
        textColor: "text-zinc-400",
        dotColor: "bg-zinc-500",
      };
    }

    switch (item.status) {
      case "up":
        return {
          label: serviceKey === "api" ? "ONLINE" : serviceKey === "sse" ? "ACTIVE" : "HEALTHY",
          textColor: "text-emerald-400",
          dotColor: "bg-emerald-500",
        };
      case "ready":
        return {
          label: "READY",
          textColor: "text-emerald-400",
          dotColor: "bg-emerald-500",
        };
      case "degraded":
        return {
          label: "DEGRADED",
          textColor: "text-amber-400",
          dotColor: "bg-amber-500",
        };
      case "down":
      case "unavailable":
        return {
          label: "UNAVAILABLE",
          textColor: "text-red-400",
          dotColor: "bg-red-500",
        };
      default:
        return {
          label: "UNKNOWN",
          textColor: "text-zinc-400",
          dotColor: "bg-zinc-500",
        };
    }
  };

  const overallBadge = getOverallBadge();

  return (
    <div className="theme-dark-surface rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 text-zinc-100 shadow-xl overflow-hidden font-sans p-4 space-y-3">
      {/* Top Bar Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-zinc-200">
          <Activity className="w-4 h-4 text-sky-400" />
          <span>SYSTEM STATUS</span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px]">
          <div
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${overallBadge.colorClass}`}
          >
            <span className={`w-2 h-2 rounded-full ${overallBadge.dotClass}`} />
            <span className="font-bold">{overallBadge.label}</span>
          </div>

          <button
            onClick={fetchStatus}
            disabled={loading}
            suppressHydrationWarning
            title="Refresh status"
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs">
        {/* Backend API */}
        {(() => {
          const statusInfo = getServiceStatusDisplay("api");
          const latency = data?.services?.api?.latency_ms;
          return (
            <div className="p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-zinc-300 font-semibold text-[11px]">
                  <Server className="w-3.5 h-3.5 text-sky-400" /> API
                </span>
                <span className="flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotColor}`} />
                  <span className={`text-[10px] font-bold ${statusInfo.textColor}`}>
                    {statusInfo.label}
                  </span>
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 truncate">
                FastAPI {latency !== undefined && latency !== null ? `· ${latency}ms` : ""}
              </p>
            </div>
          );
        })()}

        {/* PostgreSQL */}
        {(() => {
          const statusInfo = getServiceStatusDisplay("database");
          return (
            <div className="p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-zinc-300 font-semibold text-[11px]">
                  <Database className="w-3.5 h-3.5 text-emerald-400" /> PostgreSQL
                </span>
                <span className="flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotColor}`} />
                  <span className={`text-[10px] font-bold ${statusInfo.textColor}`}>
                    {statusInfo.label}
                  </span>
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 truncate">pgvector DB</p>
            </div>
          );
        })()}

        {/* Redis */}
        {(() => {
          const statusInfo = getServiceStatusDisplay("redis");
          return (
            <div className="p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-zinc-300 font-semibold text-[11px]">
                  <Layers className="w-3.5 h-3.5 text-red-400" /> Redis
                </span>
                <span className="flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotColor}`} />
                  <span className={`text-[10px] font-bold ${statusInfo.textColor}`}>
                    {statusInfo.label}
                  </span>
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 truncate">Cache / Queue</p>
            </div>
          );
        })()}

        {/* AI / RAG */}
        {(() => {
          const statusInfo = getServiceStatusDisplay("ai");
          return (
            <div className="p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-zinc-300 font-semibold text-[11px]">
                  <Cpu className="w-3.5 h-3.5 text-indigo-400" /> AI / RAG
                </span>
                <span className="flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotColor}`} />
                  <span className={`text-[10px] font-bold ${statusInfo.textColor}`}>
                    {statusInfo.label}
                  </span>
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 truncate">AI Services</p>
            </div>
          );
        })()}

        {/* SSE */}
        {(() => {
          const statusInfo = getServiceStatusDisplay("sse");
          return (
            <div className="p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800/80 space-y-1 col-span-2 sm:col-span-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-zinc-300 font-semibold text-[11px]">
                  <Radio className="w-3.5 h-3.5 text-amber-400" /> SSE Stream
                </span>
                <span className="flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotColor}`} />
                  <span className={`text-[10px] font-bold ${statusInfo.textColor}`}>
                    {statusInfo.label}
                  </span>
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 truncate">Real-time Events</p>
            </div>
          );
        })()}
      </div>

      {/* Footer Timestamp */}
      <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60 font-mono text-[10px] text-zinc-500">
        <span>Last checked: {relativeTimeString}</span>
        <span>Auto-refreshes every 30s</span>
      </div>
    </div>
  );
}
