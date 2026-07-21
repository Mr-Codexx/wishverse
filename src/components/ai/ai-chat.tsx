"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Square, Sparkles, Gift, Heart, Wand2, Cake, Stars } from "lucide-react";

import { AiMessage } from "./ai-message";
import { AuraMark } from "./aura-mark";
import { Button } from "@/components/ui/button";
import { useAiChat } from "@/hooks/use-ai-chat";
import { useAuth } from "@/hooks/use-auth";
import { AI_NAME, AI_TAGLINE, AI_SUGGESTIONS } from "@/lib/ai/prompts";
import type { AiSuggestion } from "@/lib/ai/types";
import { cn } from "@/lib/utils";

const ICONS = {
  sparkles: Sparkles,
  gift: Gift,
  heart: Heart,
  wand: Wand2,
  cake: Cake,
  stars: Stars,
};

export function AiChat({ className }: { className?: string }) {
  const { profile } = useAuth();
  const { messages, streaming, error, send, stop } = useAiChat({
    context: { displayName: profile?.displayName ?? null },
  });
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const submit = () => {
    if (!input.trim() || streaming) return;
    void send(input);
    setInput("");
    if (taRef.current) taRef.current.style.height = "auto";
  };

  const onSuggestion = (s: AiSuggestion) => {
    if (streaming) return;
    void send(s.prompt);
  };

  const empty = messages.length === 0;

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
      {/* messages */}
      <div ref={scrollRef} className="min-h-0 flex-1 space-y-5 overflow-y-auto px-1 py-4">
        {empty ? (
          <div className="flex h-full flex-col items-center justify-center px-4 text-center">
            <span className="droplet mb-4 flex size-16 items-center justify-center">
              <AuraMark size={40} />
            </span>
            <h3 className="font-[family-name:var(--font-display)] text-xl font-bold">
              Hi{profile?.displayName ? `, ${profile.displayName.split(" ")[0]}` : ""}. I&apos;m {AI_NAME}.
            </h3>
            <p className="mt-1 max-w-xs text-sm text-[var(--wv-muted)]">
              {AI_TAGLINE}. Tell me who it&apos;s for and the occasion — I&apos;ll help you
              craft something unforgettable.
            </p>
            <div className="mt-6 grid w-full max-w-md gap-2 sm:grid-cols-2">
              {AI_SUGGESTIONS.map((s) => {
                const Icon = ICONS[s.icon];
                return (
                  <button
                    key={s.label}
                    onClick={() => onSuggestion(s)}
                    className="glass focus-ring flex items-center gap-2.5 rounded-2xl px-3.5 py-3 text-left text-sm transition hover:brightness-110"
                  >
                    <Icon className="size-4 shrink-0 text-[var(--wv-accent)]" />
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <AiMessage
              key={m.id}
              message={m}
              streaming={streaming && i === messages.length - 1 && m.role === "assistant"}
              authorInitials={profile?.displayName ?? "You"}
              authorPhoto={profile?.photoURL ?? null}
            />
          ))
        )}
      </div>

      {error && (
        <p className="px-2 pb-2 text-xs text-[var(--wv-danger)]">{error}</p>
      )}

      {/* composer */}
      <div className="glass flex items-end gap-2 rounded-2xl p-2">
        <textarea
          ref={taRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          rows={1}
          placeholder={`Ask ${AI_NAME} to create something…`}
          className="max-h-40 min-h-[40px] flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-[var(--wv-muted)]"
        />
        {streaming ? (
          <Button size="icon" variant="glass" onClick={stop} aria-label="Stop">
            <Square className="size-4" />
          </Button>
        ) : (
          <Button
            size="icon"
            onClick={submit}
            disabled={!input.trim()}
            aria-label="Send"
          >
            <Send className="size-4" />
          </Button>
        )}
      </div>
      <p className="px-2 pt-1.5 text-center text-[11px] text-[var(--wv-muted)]">
        {AI_NAME} can make mistakes. Review important details.
      </p>
    </div>
  );
}
