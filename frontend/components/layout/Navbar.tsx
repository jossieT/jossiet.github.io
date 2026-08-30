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
          <div className="w-8 h-8 shrink-0 rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent flex items-center justify-center text-zinc-900 dark:text-zinc-100 font-mono text-xs font-bold tracking-tight leading-none group-hover:border-zinc-500 dark:group-hover:border-zinc-400 transition-colors select-none">
            YT
          </div>
          <div className="flex flex-col">
            <span className="text-sm sm:text-base leading-none font-bold">
              Yosef Teshome
            </span>
            <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 leading-tight mt-0.5">
              Full-Stack &amp; AI Systems
            </span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1 text-sm transition-colors ${
                  isActive
                    ? "text-sky-600 dark:text-sky-400 font-semibold border-b-2 border-sky-500 pb-0.5"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 font-normal"
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
            className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
          <a
            href="https://www.linkedin.com/in/yosef-teshome-96516b188/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <LinkedinIcon className="w-4 h-4" />
          </a>
          <a
            href="/resume"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-2.5 py-1.5 rounded-md border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
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
          <nav className="flex flex-col gap-2">
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
                  className={`px-4 py-2.5 text-base rounded-lg transition-colors border ${
                    isActive
                      ? "text-zinc-900 dark:text-zinc-50 bg-zinc-100 dark:bg-zinc-800/80 border-zinc-300 dark:border-zinc-700 font-semibold"
                      : "text-zinc-600 dark:text-zinc-300 bg-transparent border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-900"
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
                className="flex items-center justify-center gap-2 py-2.5 px-3 text-sm font-medium text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
              >
                <GithubIcon className="w-4 h-4" />
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/yosef-teshome-96516b188/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 text-sm font-medium text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
              >
                <LinkedinIcon className="w-4 h-4" />
                LinkedIn
              </a>
            </div>

            <a
              href="/resume"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-2.5 text-sm font-mono font-medium rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white transition-colors"
            >
              Download Resume / CV
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
