import React from "react";
import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CallToAction() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-zinc-100 dark:from-zinc-900/40 dark:to-zinc-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <span className="font-mono text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-widest block">
          Let&apos;s Build Together
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight max-w-2xl mx-auto">
          Have an AI, Backend, or Cloud Platform Project in Mind?
        </h2>
        <p className="text-base text-zinc-600 dark:text-zinc-300 max-w-xl mx-auto leading-relaxed">
          Whether you need a production RAG system, high-throughput FastAPI backend microservice, or cloud-native infrastructure, let&apos;s connect.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Button
            href="/contact"
            size="lg"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Start a Conversation
          </Button>
          <Button
            href="mailto:yosefteshome.eng@gmail.com"
            variant="outline"
            size="lg"
            icon={<Mail className="w-4 h-4" />}
          >
            yosefteshome.eng@gmail.com
          </Button>
        </div>
      </div>
    </section>
  );
}
