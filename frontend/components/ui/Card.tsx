import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export function Card({
  children,
  className = "",
  hoverEffect = true,
}: CardProps) {
  return (
    <div
      className={`theme-card rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 p-6 shadow-sm ${
        hoverEffect
          ? "hover:border-sky-500/50 hover:shadow-md hover:shadow-sky-500/5 transition-all duration-200"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
