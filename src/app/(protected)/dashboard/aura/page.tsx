"use client";

import { AppShell } from "@/components/app/app-shell";
import { AiChat } from "@/components/ai/ai-chat";
import { AuraMark } from "@/components/ai/aura-mark";
import { AI_NAME, AI_TAGLINE } from "@/lib/ai/prompts";

export default function AuraStudioPage() {
  return (
    <AppShell>
      <div className="mx-auto flex h-[calc(100dvh-8rem)] max-w-3xl flex-col">
        <div className="mb-4 flex items-center gap-3">
          <span className="droplet flex size-12 items-center justify-center">
            <AuraMark size={30} />
          </span>
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
              {AI_NAME}
            </h1>
            <p className="text-sm text-[var(--wv-muted)]">{AI_TAGLINE}</p>
          </div>
        </div>
        <div className="glass-strong flex min-h-0 flex-1 flex-col rounded-3xl p-4">
          <AiChat />
        </div>
      </div>
    </AppShell>
  );
}
