import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://yosefteshome.dev"),
  title: {
    default: "Yosef Teshome — AI Backend & Platform Engineer",
    template: "%s | Yosef Teshome — AI Backend & Platform Engineer",
  },
  description:
    "Engineering portfolio of Yosef Teshome, AI Backend & Platform Engineer specializing in production RAG systems, FastAPI, pgvector, Python 3.12, Docker, and Kubernetes.",
  keywords: [
    "AI Backend Engineer",
    "Platform Engineer",
    "RAG Systems",
    "FastAPI",
    "pgvector",
    "PostgreSQL",
    "Python",
    "Docker",
    "Kubernetes",
    "OpenShift",
    "AWS",
    "Addis Ababa",
  ],
  authors: [{ name: "Yosef Teshome", url: "https://yosefteshome.dev" }],
  creator: "Yosef Teshome",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yosefteshome.dev",
    title: "Yosef Teshome — AI Backend & Platform Engineer",
    description:
      "I build production-ready AI systems and cloud-native backend platforms.",
    siteName: "Yosef Teshome Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yosef Teshome — AI Backend & Platform Engineer",
    description:
      "Production RAG systems, FastAPI microservices, pgvector vector search, and cloud-native containerized platforms.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-zinc-50 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
