/** Frontend API client.
 *
 * The backend base URL is read from NEXT_PUBLIC_API_URL, which defaults to the
 * local development backend. This is the single place frontend code talks to
 * the FastAPI backend.
 */

import type { HealthResponse, Page } from "@/types/api";
import type {
  Project,
  ExperienceItem,
  SkillCategory,
  ServiceItem,
  Article,
} from "@/types/portfolio";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 10 },
      signal: options?.signal ?? controller.signal,
      ...options,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 404) return null as T;
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export function getHealth(): Promise<HealthResponse> {
  return fetchJson<HealthResponse>("/api/v1/health");
}

// Projects
export function getProjects(category?: string, page: number = 1): Promise<Page<Project>> {
  const query = new URLSearchParams();
  if (category && category !== "all") query.set("category", category);
  query.set("page", page.toString());
  return fetchJson<Page<Project>>(`/api/v1/projects?${query.toString()}`);
}

export function getFeaturedProjects(): Promise<Project[]> {
  return fetchJson<Project[]>("/api/v1/projects/featured");
}

export function getProject(slug: string): Promise<Project | null> {
  return fetchJson<Project | null>(`/api/v1/projects/${slug}`);
}

// Experience
export function getExperience(): Promise<ExperienceItem[]> {
  return fetchJson<ExperienceItem[]>("/api/v1/experience");
}

// Skills
export function getSkillCategories(): Promise<SkillCategory[]> {
  return fetchJson<SkillCategory[]>("/api/v1/skills");
}

// Services
export function getServices(): Promise<ServiceItem[]> {
  return fetchJson<ServiceItem[]>("/api/v1/services");
}

// Articles
export function getArticles(page: number = 1): Promise<Page<Article>> {
  return fetchJson<Page<Article>>(`/api/v1/articles?page=${page}`);
}

export function getFeaturedArticles(): Promise<Article[]> {
  return fetchJson<Article[]>("/api/v1/articles/featured");
}

export function getArticle(slug: string): Promise<Article | null> {
  return fetchJson<Article | null>(`/api/v1/articles/${slug}`);
}
