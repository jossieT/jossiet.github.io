"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, FileText } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/experience" },
  { label: "Services", href: "/services" },
  { label: "Articles", href: "/articles" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`theme-header ${scrolled ? "theme-header-scrolled" : ""} ${mobileMenuOpen ? "theme-header-open !bg-slate-50 dark:!bg-[#090d16]" : ""} sticky top-0 z-[100] transition-all duration-200 border-b ${mobileMenuOpen
          ? "bg-slate-50 dark:bg-[#090d16] border-slate-200 dark:border-zinc-800 shadow-md"
          : scrolled
            ? "bg-white dark:bg-[#090d16] border-slate-200/90 dark:border-zinc-800 shadow-sm"
            : "bg-white dark:bg-[#090d16] border-slate-200/80 dark:border-zinc-800/80 shadow-xs"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand logo / position */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group text-zinc-900 dark:text-zinc-100 font-bold tracking-tight hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 shrink-0 rounded-md bg-emerald-500/[0.08] dark:bg-emerald-500/[0.12] border border-emerald-600/20 dark:border-emerald-500/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-mono text-xs font-bold tracking-tight leading-none group-hover:border-emerald-600/40 dark:group-hover:border-emerald-400/50 group-hover:bg-emerald-500/[0.14] dark:group-hover:bg-emerald-500/20 transition-all duration-200 select-none">
            YT
          </div>
          <div className="flex flex-col">
            <span className="text-sm sm:text-base leading-none font-bold">
              Yosef Teshome
            </span>
            <span className="text-[10px] font-mono font-medium text-sky-600 dark:text-sky-400 leading-tight">
              Full-Stack Engineer
            </span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${isActive
                    ? "text-sky-600 dark:text-sky-400 bg-sky-500/10"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                  }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Right Actions */}
        <div className="hidden lg:flex items-center gap-2">
          <a
            href="https://github.com/jossieT"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
          <a
            href="https://www.linkedin.com/in/yosef-teshome-96516b188/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <LinkedinIcon className="w-4 h-4" />
          </a>
          <a
            href="/resume"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-2.5 py-1.5 rounded-md border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-sky-500 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            CV
          </a>
          <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-800 mx-1" />
          <ThemeToggle />
        </div>

        {/* Mobile controls */}
        <div className="flex lg:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="p-2 text-slate-800 dark:text-zinc-300 hover:text-sky-600 dark:hover:text-sky-400 rounded-lg bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 shadow-xs hover:bg-slate-50 dark:hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/70 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="theme-mobile-menu lg:hidden fixed inset-0 top-16 bg-slate-50 dark:bg-[#090d16] z-[99] flex flex-col justify-between p-6 animate-in fade-in duration-200 border-t border-slate-200 dark:border-zinc-800 shadow-2xl overflow-y-auto">
          <nav className="flex flex-col gap-2.5">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`px-4 py-3 text-base font-semibold rounded-xl transition-all border ${isActive
                      ? "text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/20 border-sky-300 dark:border-sky-500/40 shadow-xs font-bold"
                      : "text-slate-800 dark:text-zinc-200 bg-white dark:bg-[#111827] border-slate-200/90 dark:border-zinc-800/80 shadow-xs hover:bg-slate-100 dark:hover:bg-[#1e293b] hover:text-sky-600 dark:hover:text-white"
                    }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-6 mt-6 border-t border-slate-200 dark:border-zinc-800 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <a
                href="https://github.com/jossieT"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 text-sm font-semibold text-slate-800 dark:text-zinc-200 bg-white dark:bg-[#111827] border border-slate-200 dark:border-zinc-800 rounded-lg shadow-xs hover:border-sky-500 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
              >
                <GithubIcon className="w-4 h-4" />
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/yosef-teshome-96516b188/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 text-sm font-semibold text-slate-800 dark:text-zinc-200 bg-white dark:bg-[#111827] border border-slate-200 dark:border-zinc-800 rounded-lg shadow-xs hover:border-sky-500 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
              >
                <LinkedinIcon className="w-4 h-4" />
                LinkedIn
              </a>
            </div>

            <a
              href="/resume"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-3 text-sm font-mono font-bold rounded-lg bg-sky-600 text-white hover:bg-sky-500 shadow-md shadow-sky-600/20 transition-all"
            >
              Download Resume / CV
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
