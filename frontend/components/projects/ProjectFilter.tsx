import React from "react";
import Link from "next/link";

interface ProjectFilterProps {
  selectedCategory: string;
  categories: { id: string; label: string }[];
}

export function ProjectFilter({
  selectedCategory,
  categories,
}: ProjectFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        const href = cat.id === "all" ? "/projects" : `/projects?category=${cat.id}`;
        return (
          <Link
            key={cat.id}
            href={href}
            className={`px-3.5 py-1.5 text-xs font-mono font-medium rounded-lg transition-all cursor-pointer ${
              isSelected
                ? "bg-sky-600 text-white shadow-sm"
                : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            {cat.label}
          </Link>
        );
      })}
    </div>
  );
}
