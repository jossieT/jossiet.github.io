export type ActivityType = "api" | "rag" | "agent" | "db" | "cache" | "sse" | "system";

export interface PublicActivityEvent {
  type: ActivityType;
  message: string;
  status: "success" | "info" | "error";
  timestamp: string;
  duration_ms?: number | null;
}
