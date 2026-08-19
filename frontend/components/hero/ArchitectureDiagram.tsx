"use client";

import React, { useState } from "react";
import { Cpu, Database, Server, Terminal, ShieldCheck, ArrowRight, Layers } from "lucide-react";

export function ArchitectureDiagram() {
  const [activeTab, setActiveTab] = useState<"architecture" | "terminal">("architecture");

  return (
    <div className="theme-dark-surface rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 text-zinc-100 shadow-2xl overflow-hidden font-sans">
      {/* Top Window Bar */}
      <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-2 font-mono text-xs text-zinc-400">
            system_architecture.py — yosef-platform
          </span>
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

      {/* Main Container Content */}
      {activeTab === "architecture" ? (
        <div className="p-6 bg-zinc-950/90 space-y-5 font-mono">
          {/* Top Layer: Client Request */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 text-xs">
            <div className="flex items-center gap-2 text-zinc-300">
              <Terminal className="w-4 h-4 text-sky-400" />
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
            <div className="p-3.5 rounded-lg bg-zinc-900 border border-sky-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs text-sky-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5" /> FastAPI Service
                </span>
                <span className="text-[10px] text-emerald-400">Python 3.12</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-tight">
                Pydantic v2 validation, SSE token streaming & RBAC scopes
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-zinc-900 border border-indigo-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs text-indigo-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" /> RAG & AI Agent
                </span>
                <span className="text-[10px] text-sky-400">Hybrid Search</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-tight">
                Reciprocal rank fusion (BM25 + Vector) & Tool Orchestration
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowRight className="w-4 h-4 text-zinc-600 rotate-90" />
          </div>

          {/* Bottom Storage Layer */}
          <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
            <div className="p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800">
              <Database className="w-4 h-4 text-sky-400 mx-auto mb-1" />
              <span className="block font-bold text-zinc-200">pgvector</span>
              <span className="text-[10px] text-zinc-500">PostgreSQL 17</span>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800">
              <Layers className="w-4 h-4 text-red-400 mx-auto mb-1" />
              <span className="block font-bold text-zinc-200">Redis 7</span>
              <span className="text-[10px] text-zinc-500">Cache / Queue</span>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <span className="block font-bold text-zinc-200">OpenShift</span>
              <span className="text-[10px] text-zinc-500">K8s Pods</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-5 bg-zinc-950 font-mono text-xs space-y-2 text-zinc-300">
          <p className="text-zinc-500">[2026-08-17 22:20:00] INFO: Application startup complete.</p>
          <p className="text-emerald-400">
            [2026-08-17 22:20:01] INFO: Connected to PostgreSQL (pgvector HNSW index initialized).
          </p>
          <p className="text-emerald-400">
            [2026-08-17 22:20:01] INFO: Connected to Redis cluster at localhost:6379.
          </p>
          <p className="text-sky-400">
            [2026-08-17 22:20:05] POST /api/v1/rag/query - status=200 latency=348ms (hybrid_score=0.942)
          </p>
          <p className="text-sky-400">
            [2026-08-17 22:20:12] POST /api/v1/agents/execute - tool=query_internal_db status=200
          </p>
          <div className="flex items-center gap-1 text-sky-400 font-bold pt-2">
            <span className="animate-pulse">❯</span>
            <span className="text-zinc-400">ready for production workload...</span>
          </div>
        </div>
      )}
    </div>
  );
}
