"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { ContactFormData } from "@/types/portfolio";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    company: "",
    projectType: "ai-rag",
    message: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ContactFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required.";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate Phase 2 client-side submission validation delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  if (isSubmitted) {
    return (
      <div className="p-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Message Received!
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 max-w-md mx-auto leading-relaxed">
          Thank you for reaching out, <strong className="text-zinc-900 dark:text-zinc-100">{formData.name}</strong>. I have received your message regarding <span className="font-semibold text-sky-600 dark:text-sky-400">{formData.projectType}</span> and will get back to you within 24 hours.
        </p>
        <Button
          onClick={() => {
            setIsSubmitted(false);
            setFormData({ name: "", email: "", company: "", projectType: "ai-rag", message: "" });
          }}
          variant="outline"
          size="sm"
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Name Field */}
        <div className="space-y-2">
          <label htmlFor="name" className="block text-xs font-mono font-semibold text-zinc-700 dark:text-zinc-300">
            YOUR NAME <span className="text-sky-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            placeholder="e.g. Alex Mercer"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-colors ${
              errors.name
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : "border-zinc-300 dark:border-zinc-700 focus:border-sky-500"
            }`}
          />
          {errors.name && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-xs font-mono font-semibold text-zinc-700 dark:text-zinc-300">
            EMAIL ADDRESS <span className="text-sky-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            placeholder="e.g. alex@company.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-colors ${
              errors.email
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : "border-zinc-300 dark:border-zinc-700 focus:border-sky-500"
            }`}
          />
          {errors.email && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Company Field (Optional) */}
        <div className="space-y-2">
          <label htmlFor="company" className="block text-xs font-mono font-semibold text-zinc-700 dark:text-zinc-300">
            COMPANY / ORGANIZATION <span className="text-zinc-400 font-normal">(Optional)</span>
          </label>
          <input
            id="company"
            type="text"
            placeholder="e.g. Acme Tech"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-colors"
          />
        </div>

        {/* Project Type Select */}
        <div className="space-y-2">
          <label htmlFor="projectType" className="block text-xs font-mono font-semibold text-zinc-700 dark:text-zinc-300">
            PROJECT CATEGORY
          </label>
          <select
            id="projectType"
            value={formData.projectType}
            onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-colors cursor-pointer"
          >
            <option value="AI & RAG Platforms">AI & RAG Knowledge Platforms</option>
            <option value="AI Agents & Automation">AI Agents & Workflow Automation</option>
            <option value="Backend Architecture">FastAPI & Backend Systems</option>
            <option value="Cloud & Infrastructure">Docker / Kubernetes Infrastructure</option>
            <option value="Recruiting / Role Opportunity">Recruiting / Full-time Role</option>
            <option value="Other Inquiry">Other Inquiry</option>
          </select>
        </div>
      </div>

      {/* Message Field */}
      <div className="space-y-2">
        <label htmlFor="message" className="block text-xs font-mono font-semibold text-zinc-700 dark:text-zinc-300">
          PROJECT DETAILS / MESSAGE <span className="text-sky-500">*</span>
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder="Describe your project goals, timelines, tech stack, or engineering requirements..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className={`w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-colors ${
            errors.message
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
              : "border-zinc-300 dark:border-zinc-700 focus:border-sky-500"
          }`}
        />
        {errors.message && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        size="lg"
        className="w-full sm:w-auto"
        icon={
          isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )
        }
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
