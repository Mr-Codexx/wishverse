"use client";

import { memo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check } from "lucide-react";
import { motion } from "framer-motion";

import { AuraMark } from "./aura-mark";
import type { AiMessage as AiMessageType } from "@/lib/ai/types";
import { cn, initials } from "@/lib/utils";

function AiMessageBase({
  message,
  streaming,
  authorInitials,
  authorPhoto,
}: {
  message: AiMessageType;
  streaming?: boolean;
  authorInitials?: string;
  authorPhoto?: string | null;
}) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const copy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex gap-3", isUser && "flex-row-reverse")}
    >
      <div className="mt-0.5 shrink-0">
        {isUser ? (
          <span className="droplet flex size-8 items-center justify-center overflow-hidden text-xs font-bold">
            {authorPhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={authorPhoto} alt="" className="size-full object-cover" />
            ) : (
              initials(authorInitials ?? "You")
            )}
          </span>
        ) : (
          <span className="droplet flex size-8 items-center justify-center">
            <AuraMark size={22} pulse={streaming} />
          </span>
        )}
      </div>

      <div className={cn("group min-w-0 max-w-[86%]", isUser && "flex flex-col items-end")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
            isUser
              ? "bg-[var(--wv-primary)] text-[var(--wv-primary-fg)]"
              : "glass text-[var(--wv-fg)]",
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="ai-prose">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content || "…"}
              </ReactMarkdown>
              {streaming && (
                <span className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 animate-pulse rounded-full bg-[var(--wv-accent)]" />
              )}
            </div>
          )}
        </div>

        {!isUser && message.content && !streaming && (
          <button
            onClick={copy}
            className="mt-1 flex items-center gap-1 text-xs text-[var(--wv-muted)] opacity-0 transition group-hover:opacity-100"
          >
            {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>
    </motion.div>
  );
}

export const AiMessage = memo(AiMessageBase);
