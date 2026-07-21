import "server-only";
import Groq from "groq-sdk";

/**
 * Internal inference client. Kept server-only so the credential and provider
 * identity never reach the browser — the product surface is "Aura", WishVerse's
 * own AI. Swap this module to change providers without touching the UI.
 */

export const AI_MODEL = process.env.AI_MODEL || "llama-3.3-70b-versatile";

let client: Groq | null = null;

export function getAiClient(): Groq {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("AI_NOT_CONFIGURED");
  }
  if (!client) {
    client = new Groq({ apiKey });
  }
  return client;
}

export function isAiConfigured(): boolean {
  return Boolean(process.env.GROQ_API_KEY);
}
