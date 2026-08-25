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
import type { SourceRef } from "@/types/chat";

/**
 * Backend base URL resolution.
 *
 * - Production (Vercel): NEXT_PUBLIC_API_URL MUST be set to the Render FastAPI
 *   URL. A missing value falls back to localhost, which can never work in a
 *   Vercel build — so we warn loudly at build time instead of failing silently.
 * - Local development: falls back to the local FastAPI server.
 */
const CONFIGURED_API_URL = process.env.NEXT_PUBLIC_API_URL?.trim();

if (!CONFIGURED_API_URL && process.env.NODE_ENV === "production") {
  console.warn(
    "[api] NEXT_PUBLIC_API_URL is not set — falling back to localhost. " +
      "Set it in Vercel → Settings → Environment Variables to your Render FastAPI URL."
  );
}

export const API_BASE_URL = (
  CONFIGURED_API_URL && CONFIGURED_API_URL.length > 0
    ? CONFIGURED_API_URL
    : typeof window !== "undefined"
      ? `http://${window.location.hostname}:8000`
      : "http://127.0.0.1:8000"
).replace(/\/+$/, "");



// --- Tunables ------------------------------------------------------------
const FETCH_TIMEOUT_MS = 6000;
const ISR_REVALIDATE_SECONDS = 10;
const DEFAULT_PAGE_SIZE = 12;

/** Result of a low-level JSON request. HTTP errors never throw here. */
type JsonResult<T> = { ok: true; data: T } | { ok: false; status: number };

/**
 * Single low-level JSON request used by every API helper.
 *
 * Transport failures (network down, timeout, abort) and HTTP error statuses
 * are returned as `{ ok: false }` so callers can log context and degrade
 * gracefully instead of crashing prerendering.
 */
async function requestJson<T>(
  path: string,
  options?: RequestInit,
): Promise<JsonResult<T>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: ISR_REVALIDATE_SECONDS },
      signal: options?.signal ?? controller.signal,
      ...options,
    });

    if (!response.ok) {
      return { ok: false, status: response.status };
    }
    return { ok: true, data: (await response.json()) as T };
  } catch (error) {
    console.warn(`[api] GET ${path} transport error.`, error);
    return { ok: false, status: 0 };
  } finally {
    clearTimeout(timeoutId);
  }
}

function describeValue(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

/**
 * Runtime guard: collection endpoints must always yield an array.
 * Protects against a backend returning `null`, an object, or any other
 * malformed body with a 200 status.
 */
function asArray<T>(value: unknown, path: string): T[] {
  if (Array.isArray(value)) return value;
  console.warn(
    `[api] GET ${path}: expected a JSON array but received ${describeValue(value)} — normalizing to [].`
  );
  return [];
}

function emptyPage<T>(page: number): Page<T> {
  return { items: [], total: 0, page, page_size: DEFAULT_PAGE_SIZE, pages: 0 };
}

/**
 * Runtime guard: paginated endpoints must always yield `{ items: [...] }`.
 * Mirrors the FastAPI Page[T] envelope shape.
 */
function asPage<T>(value: unknown, path: string, page: number): Page<T> {
  const items = (value as { items?: unknown } | null)?.items;
  if (Array.isArray(items)) return value as Page<T>;
  console.warn(
    `[api] GET ${path}: expected a paginated object with an items array but received ${describeValue(value)} — using an empty page.`
  );
  return emptyPage<T>(page);
}

/** Collection endpoints: ALWAYS resolve to an array — never null, never throws. */
async function fetchCollection<T>(path: string): Promise<T[]> {
  const result = await requestJson<unknown>(path);
  if (!result.ok) {
    console.warn(
      `[api] GET ${path} failed (status ${result.status}) — rendering fallback content.`
    );
    return [];
  }
  return asArray<T>(result.data, path);
}

/** Paginated endpoints: ALWAYS resolve to a valid Page<T> — never null, never throws. */
async function fetchPage<T>(path: string, page: number): Promise<Page<T>> {
  const result = await requestJson<unknown>(path);
  if (!result.ok) {
    console.warn(
      `[api] GET ${path} failed (status ${result.status}) — rendering fallback content.`
    );
    return emptyPage<T>(page);
  }
  return asPage<T>(result.data, path, page);
}

/**
 * Detail endpoints: HTTP 404 → null (drives the existing notFound() flow).
 * Any other failure → null with a warning so builds never crash on metadata.
 */
async function fetchDetail<T>(path: string): Promise<T | null> {
  const result = await requestJson<T>(path);
  if (result.ok) return result.data;
  if (result.status !== 404) {
    console.warn(`[api] GET ${path} failed (status ${result.status}) — treating as not found.`);
  }
  return null;
}

export async function getHealth(): Promise<HealthResponse> {
  const result = await requestJson<HealthResponse>("/api/v1/health");
  if (!result.ok) {
    throw new Error(`Health check failed with status ${result.status}`);
  }
  return result.data;
}

// Projects
export async function getProjects(category?: string, page: number = 1): Promise<Page<Project>> {
  const query = new URLSearchParams();
  if (category && category !== "all") query.set("category", category);
  query.set("page", page.toString());
  return fetchPage<Project>(`/api/v1/projects?${query.toString()}`, page);
}

export function getFeaturedProjects(): Promise<Project[]> {
  return fetchCollection<Project>("/api/v1/projects/featured");
}

export function getProject(slug: string): Promise<Project | null> {
  return fetchDetail<Project>(`/api/v1/projects/${slug}`);
}

// Experience
export function getExperience(): Promise<ExperienceItem[]> {
  return fetchCollection<ExperienceItem>("/api/v1/experience");
}

// Skills
export function getSkillCategories(): Promise<SkillCategory[]> {
  return fetchCollection<SkillCategory>("/api/v1/skills");
}

// Services
export function getServices(): Promise<ServiceItem[]> {
  return fetchCollection<ServiceItem>("/api/v1/services");
}

// Articles
export async function getArticles(page: number = 1): Promise<Page<Article>> {
  return fetchPage<Article>(`/api/v1/articles?page=${page}`, page);
}

export function getFeaturedArticles(): Promise<Article[]> {
  return fetchCollection<Article>("/api/v1/articles/featured");
}

export function getArticle(slug: string): Promise<Article | null> {
  return fetchDetail<Article>(`/api/v1/articles/${slug}`);
}

// AI Chat Streaming
// Yields either a plain string token, an object `{ sources: SourceRef[] }`, or `{ status: string }`.
export async function* streamChat(
  messages: Array<{ role: string; content: string }>,
  signal?: AbortSignal,
): AsyncGenerator<string | { sources: SourceRef[] } | { status: string }, void, unknown> {
  const response = await fetch(`${API_BASE_URL}/api/v1/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify({ messages }),
    signal,
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Rate limit reached. Please wait a moment before sending more messages.");
    }
    const errBody = await response.json().catch(() => null);
    const detail = errBody?.detail || `Chat request failed (${response.status})`;
    throw new Error(typeof detail === "string" ? detail : JSON.stringify(detail));
  }

  if (!response.body) {
    throw new Error("ReadableStream is not supported by the browser or response body was empty.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data:")) continue;

        const dataStr = trimmed.replace(/^data:\s*/, "");
        if (dataStr === "[DONE]") {
          return;
        }

        try {
          const parsed = JSON.parse(dataStr);
          if (parsed.error) {
            throw new Error(parsed.error);
          }
          // Agent status event — e.g. "Searching projects..."
          if (parsed.status) {
            yield { status: parsed.status as string };
            continue;
          }
          // RAG source attribution event — yield as structured object
          if (parsed.sources) {
            yield { sources: parsed.sources as SourceRef[] };
            continue;
          }
          if (parsed.token) {
            yield parsed.token;
          }
        } catch (e) {
          if (e instanceof Error && e.message !== "Unexpected end of JSON input") {
            if (!dataStr.startsWith("{")) continue;
            throw e;
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

