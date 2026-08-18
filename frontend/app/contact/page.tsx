import { Metadata } from "next";
import { Mail, MapPin, Clock, Phone } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ContactForm } from "@/components/contact/ContactForm";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Contact Yosef Teshome — AI Backend & Platform Engineer",
  description:
    "Get in touch with Yosef Teshome regarding AI engineering, production RAG systems, FastAPI backends, or cloud-native platform projects.",
};

export default function ContactPage() {
  return (
    <div className="py-16 md:py-24 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          eyebrow="Get In Touch"
          title="Let's Work Together"
          description="Have a production AI system, RAG platform, FastAPI backend, or containerized cloud project in mind? Reach out directly using the form or channels below."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="space-y-4 bg-zinc-900 text-zinc-100 border-zinc-800 p-8 shadow-xl">
              <h3 className="text-xl font-bold text-white">
                Direct Contact Channels
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Whether you represent an enterprise engineering team looking for a senior developer or a client looking to launch an AI platform, I welcome direct inquiries.
              </p>

              <div className="space-y-4 pt-2 text-xs font-mono">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-zinc-500 block">EMAIL</span>
                    <a
                      href="mailto:joseteshe2017@gmail.com"
                      className="text-white hover:text-sky-400 font-bold transition-colors"
                    >
                      joseteshe2017@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-zinc-500 block">PHONE</span>
                    <a
                      href="tel:+251977784658"
                      className="text-white hover:text-sky-400 font-bold transition-colors"
                    >
                      +251 977 784 658
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-zinc-500 block">LOCATION</span>
                    <span className="text-white font-bold">Addis Ababa, Ethiopia</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-zinc-500 block">RESPONSE TIME</span>
                    <span className="text-white font-bold">Within 24 Hours</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex items-center gap-4 text-xs font-mono">
                <a
                  href="https://github.com/jossieTand"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-zinc-400 hover:text-sky-400 transition-colors"
                >
                  <GithubIcon className="w-4 h-4" />
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/yosef-teshome-96516b188/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-zinc-400 hover:text-sky-400 transition-colors"
                >
                  <LinkedinIcon className="w-4 h-4" />
                  LinkedIn
                </a>
              </div>
            </Card>

            <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 space-y-2 text-xs">
              <span className="font-mono font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider block">
                Target Project Scope
              </span>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Accepting inquiries for: Enterprise RAG platforms, FastAPI backend development, AI agent workflow automation, database optimization (PostgreSQL / pgvector), and Kubernetes / OpenShift container setups.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
              Send a Direct Message
            </h3>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
