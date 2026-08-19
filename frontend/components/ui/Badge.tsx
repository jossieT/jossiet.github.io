import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "accent" | "subtle" | "outline" | "emerald" | "amber" | "indigo";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  children,
  variant = "subtle",
  size = "sm",
  className = "",
}: BadgeProps) {
  const baseStyles = "inline-flex items-center font-mono font-medium rounded-md tracking-tight";

  const variants = {
    accent:
      "bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/30",
    subtle:
      "bg-zinc-100/90 text-zinc-800 dark:bg-zinc-800/90 dark:text-zinc-200 border border-zinc-300/80 dark:border-zinc-700/60",
    outline:
      "bg-transparent text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700",
    emerald:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30",
    amber:
      "bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/30",
    indigo:
      "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30",
  };

  const sizes = {
    sm: "text-xs px-2.5 py-0.5",
    md: "text-sm px-3 py-1",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
}
