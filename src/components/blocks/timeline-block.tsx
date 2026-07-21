"use client";

import type { BlockProps } from "@/types/experience";

export function TimelineBlock({ props }: { props: BlockProps }) {
  const items = props.items ?? [];
  if (items.length === 0) {
    return <p className="text-sm text-[var(--wv-muted)]">Add timeline moments in the inspector.</p>;
  }
  return (
    <div className="mx-auto max-w-xl text-left">
      <ol className="relative border-l border-[rgb(var(--glass-tint)/0.25)] pl-6">
        {items.map((it) => (
          <li key={it.id} className="mb-7 last:mb-0">
            <span className="absolute -left-[7px] mt-1.5 size-3.5 rounded-full bg-[var(--wv-primary)] ring-4 ring-[rgb(var(--glass-tint)/0.12)]" />
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--wv-accent)]">
              {it.date}
            </p>
            <h4 className="mt-0.5 font-semibold">{it.title}</h4>
            {it.body && (
              <p className="mt-1 text-sm text-[var(--wv-muted)]">{it.body}</p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
