"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/layout/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="relative p-2 text-zinc-600 dark:text-zinc-400 hover:text-sky-600 dark:hover:text-sky-400 rounded-lg hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-sky-400" aria-hidden="true" />
      ) : (
        <Moon className="w-5 h-5 text-zinc-700" aria-hidden="true" />
      )}
    </button>
  );
}
