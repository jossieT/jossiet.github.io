export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessageItem {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
}

export interface SuggestedQuestion {
  id: string;
  text: string;
  category: "overview" | "ai" | "projects" | "backend" | "contact";
}
