/** Shared API types mirroring the backend response schemas. */

export interface HealthResponse {
  status: "ok";
  service: string;
}

export interface DependencyStatus {
  status: "ok" | "unavailable";
  detail: string | null;
}

export interface ReadinessResponse {
  status: "ok" | "degraded";
  database: DependencyStatus;
  redis: DependencyStatus;
}

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

