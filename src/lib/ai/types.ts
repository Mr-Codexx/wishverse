export type AiRole = "user" | "assistant";

export interface AiMessage {
  id: string;
  role: AiRole;
  content: string;
  createdAt: number;
}

export interface AiChatRequest {
  messages: { role: AiRole; content: string }[];
  context?: {
    displayName?: string | null;
    occasion?: string | null;
  };
}

/** Curated starter prompts surfaced in the empty state. */
export interface AiSuggestion {
  label: string;
  prompt: string;
  icon: "sparkles" | "gift" | "heart" | "wand" | "cake" | "stars";
}
