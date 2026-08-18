import React from "react";
import Link from "next/link";
import { Mail, Terminal } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Bio */}
          <div className="md:col-span-2 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold text-lg"
            >
              <div className="w-7 h-7 rounded-md bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-600 dark:text-sky-400">
                <Terminal className="w-4 h-4" />
              </div>
              Yosef Teshome
            </Link>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 max-w-md">
              AI Backend & Platform Engineer building production-ready AI systems, RAG knowledge retrieval platforms, FastAPI backends, and cloud-native containerized platforms.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com/jossieTand"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 hover:bg-sky-500/10 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/yosef-teshome-96516b188/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 hover:bg-sky-500/10 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <Link
                href="/contact"
                aria-label="Email Contact"
                className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 hover:bg-sky-500/10 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
              >
                <Mail className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h3 className="text-xs font-mono font-semibold tracking-wider text-zinc-900 dark:text-zinc-200 uppercase mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/experience" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  Experience
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/articles" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  Articles
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Engineering Stack */}
          <div>
            <h3 className="text-xs font-mono font-semibold tracking-wider text-zinc-900 dark:text-zinc-200 uppercase mb-4">
              Primary Stack
            </h3>
            <ul className="space-y-2 text-xs font-mono text-zinc-500 dark:text-zinc-400">
              <li>• Python / FastAPI</li>
              <li>• AI / RAG / LLM Applications</li>
              <li>• TypeScript / NestJS</li>
              <li>• PostgreSQL / Redis</li>
              <li>• Next.js / React / Flutter</li>
              <li>• Docker / Kubernetes / AWS</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} Yosef Teshome. All rights reserved.</p>
          <p className="font-mono">
            Positioning: <span className="text-sky-600 dark:text-sky-400 font-semibold">AI Backend & Platform Engineer</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
