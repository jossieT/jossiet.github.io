import React from "react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  centered = false,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`max-w-3xl ${centered ? "mx-auto text-center" : ""} ${className}`}>
      {eyebrow && (
        <span className="inline-block font-mono text-xs font-semibold tracking-wider text-sky-600 dark:text-sky-400 uppercase mb-2">
          {eyebrow}
        </span>
      )}
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
