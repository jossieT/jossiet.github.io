import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "accent" | "subtle" | "outline" | "emerald";
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
      "bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/20",
    subtle:
      "bg-zinc-100 text-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60",
    outline:
      "bg-transparent text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700",
    emerald:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20",
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
