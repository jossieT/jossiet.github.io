export type ChatRole = "user" | "assistant" | "system";

export interface SourceRef {
  source_type: string;
  source_title: string;
  source_url: string;
  section: string;
  similarity: number;
}

export interface ChatMessageItem {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
  sources?: SourceRef[];
}

export interface SuggestedQuestion {
  id: string;
  text: string;
  category: "overview" | "ai" | "projects" | "backend" | "contact";
}
