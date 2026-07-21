"use client";

import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import type { BlockProps, GuestbookEntry } from "@/types/experience";
import {
  addGuestbookEntry,
  listGuestbook,
} from "@/lib/firebase/experiences";
import { relativeTime } from "@/lib/utils";

export function GuestbookBlock({
  props,
  experienceId,
  interactive = true,
}: {
  props: BlockProps;
  experienceId?: string;
  interactive?: boolean;
}) {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!experienceId || !interactive) return;
    listGuestbook(experienceId).then(setEntries).catch(() => void 0);
  }, [experienceId, interactive]);

  const submit = async () => {
    if (!experienceId || !message.trim() || busy) return;
    setBusy(true);
    try {
      await addGuestbookEntry(experienceId, name, message);
      setEntries((prev) => [
        {
          id: Math.random().toString(36).slice(2),
          name: name.trim() || "Anonymous",
          message: message.trim(),
          createdAt: null,
        },
        ...prev,
      ]);
      setName("");
      setMessage("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md text-left">
      {props.prompt && (
        <p className="mb-3 text-center text-[var(--wv-muted)]">{props.prompt}</p>
      )}
      <div className="glass-strong rounded-3xl p-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          disabled={!interactive}
          className="focus-ring mb-2 w-full rounded-xl border border-[rgb(var(--glass-tint)/0.14)] bg-[rgb(var(--glass-tint)/0.05)] px-3 py-2 text-sm outline-none"
        />
        <div className="flex items-end gap-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Leave a message…"
            rows={2}
            disabled={!interactive}
            className="focus-ring w-full resize-none rounded-xl border border-[rgb(var(--glass-tint)/0.14)] bg-[rgb(var(--glass-tint)/0.05)] px-3 py-2 text-sm outline-none"
          />
          <button
            onClick={submit}
            disabled={!interactive || !message.trim() || busy}
            className="bg-[var(--wv-primary)] text-[var(--wv-primary-fg)] flex size-10 shrink-0 items-center justify-center rounded-xl disabled:opacity-50"
            aria-label="Sign guestbook"
          >
            <Send className="size-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-2.5">
        {entries.map((e) => (
          <div key={e.id} className="glass rounded-2xl px-4 py-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{e.name}</p>
              <p className="text-xs text-[var(--wv-muted)]">
                {relativeTime(e.createdAt)}
              </p>
            </div>
            <p className="mt-1 text-sm text-[var(--wv-muted)]">{e.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
