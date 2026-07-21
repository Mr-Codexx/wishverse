import { NextResponse } from "next/server";
import { getAiClient, isAiConfigured, AI_MODEL } from "@/lib/ai/groq";
import { buildSystemPrompt } from "@/lib/ai/prompts";
import { rateLimit, clientKeyFromHeaders } from "@/lib/ai/rate-limit";
import type { AiChatRequest } from "@/lib/ai/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGES = 30;
const MAX_CHARS = 6000;

export async function POST(req: Request) {
  if (!isAiConfigured()) {
    return NextResponse.json(
      { error: "Aura isn't configured yet. Add your AI key to enable it." },
      { status: 503 },
    );
  }

  const key = clientKeyFromHeaders(req.headers);
  const limit = rateLimit(key);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "You're going a little fast. Give Aura a moment and try again." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(limit.resetInMs / 1000)) } },
    );
  }

  let body: AiChatRequest;
  try {
    body = (await req.json()) as AiChatRequest;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const incoming = Array.isArray(body?.messages) ? body.messages : [];
  if (incoming.length === 0) {
    return NextResponse.json({ error: "No message provided." }, { status: 400 });
  }

  // Sanitize + clamp history.
  const trimmed = incoming
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));

  const messages = [
    { role: "system" as const, content: buildSystemPrompt(body.context) },
    ...trimmed,
  ];

  const encoder = new TextEncoder();

  try {
    const client = getAiClient();
    const completion = await client.chat.completions.create({
      model: AI_MODEL,
      messages,
      temperature: 0.8,
      max_tokens: 1200,
      top_p: 0.95,
      stream: true,
    });

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const delta = chunk.choices?.[0]?.delta?.content;
            if (delta) controller.enqueue(encoder.encode(delta));
          }
        } catch {
          controller.enqueue(
            encoder.encode("\n\n_Aura lost her train of thought. Please try again._"),
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (err) {
    const message =
      err instanceof Error && err.message === "AI_NOT_CONFIGURED"
        ? "Aura isn't configured yet."
        : "Aura is unavailable right now. Please try again shortly.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
