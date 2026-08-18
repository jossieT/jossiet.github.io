import React from "react";
import { Shield, Lock, Key, Database, Zap, RefreshCw, Sliders, FileText } from "lucide-react";
import { SecurityReliabilityItem } from "@/types/portfolio";

interface SecurityReliabilitySectionProps {
  items?: SecurityReliabilityItem[];
}

export function SecurityReliabilitySection({ items }: SecurityReliabilitySectionProps) {
  if (!items || items.length === 0) return null;

  const getIcon = (iconName?: string | null) => {
    switch (iconName) {
      case "Lock":
        return <Lock className="w-4 h-4 text-emerald-500" />;
      case "Key":
        return <Key className="w-4 h-4 text-amber-500" />;
      case "Database":
        return <Database className="w-4 h-4 text-indigo-500" />;
      case "Zap":
        return <Zap className="w-4 h-4 text-cyan-500" />;
      case "RefreshCw":
        return <RefreshCw className="w-4 h-4 text-sky-500" />;
      case "Sliders":
        return <Sliders className="w-4 h-4 text-purple-500" />;
      case "FileText":
        return <FileText className="w-4 h-4 text-blue-500" />;
      default:
        return <Shield className="w-4 h-4 text-emerald-500" />;
    }
  };

  return (
    <section id="security" className="space-y-6 scroll-mt-24">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Security, Integrity & Reliability
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
            Production safeguards, boundary enforcement, and fault-tolerance patterns
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {items.map((sec, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs space-y-3"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 shrink-0">
                {getIcon(sec.iconName)}
              </div>
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                {sec.title}
              </h3>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pl-1">
              {sec.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
