"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  const applyTheme = useCallback((t: Theme) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (t === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("yosef-portfolio-theme") as Theme | null;
    let initial: Theme = "dark";
    if (stored === "light" || stored === "dark") {
      initial = stored;
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      initial = "dark";
    } else {
      initial = "light";
    }
    
    // Use requestAnimationFrame to avoid synchronous setState warning during initial effect execution
    requestAnimationFrame(() => {
      setThemeState(initial);
      applyTheme(initial);
    });
  }, [applyTheme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("yosef-portfolio-theme", newTheme);
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
