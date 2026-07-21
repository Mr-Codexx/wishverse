"use client";

import { useEffect, useState } from "react";
import type { BlockProps } from "@/types/experience";

function parts(target: number) {
  const diff = Math.max(0, target - Date.now());
  const s = Math.floor(diff / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    mins: Math.floor((s % 3600) / 60),
    secs: s % 60,
    done: diff === 0,
  };
}

export function CountdownBlock({ props }: { props: BlockProps }) {
  const target = props.targetDate ? new Date(props.targetDate).getTime() : 0;
  const [t, setT] = useState(() => parts(target));

  useEffect(() => {
    if (!target) return;
    const id = setInterval(() => setT(parts(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (!target) {
    return (
      <p className="text-sm text-[var(--wv-muted)]">
        Set a date in the inspector to start the countdown.
      </p>
    );
  }

  const cells = [
    { label: "Days", value: t.days },
    { label: "Hours", value: t.hours },
    { label: "Minutes", value: t.mins },
    { label: "Seconds", value: t.secs },
  ];

  return (
    <div className="text-center">
      {props.text && (
        <p className="mb-4 text-[var(--wv-muted)]">{props.text}</p>
      )}
      {t.done ? (
        <p className="text-gradient text-3xl font-bold">It&apos;s time! 🎉</p>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {cells.map((c) => (
            <div
              key={c.label}
              className="glass-strong min-w-[76px] rounded-2xl px-4 py-3"
            >
              <div className="text-3xl font-bold tabular-nums">
                {String(c.value).padStart(2, "0")}
              </div>
              <div className="text-xs uppercase tracking-wide text-[var(--wv-muted)]">
                {c.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
