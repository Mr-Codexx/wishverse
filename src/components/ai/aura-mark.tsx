"use client";

import { cn } from "@/lib/utils";

/** Aura's visual mark — a glowing liquid orb, distinct from the WishVerse star. */
export function AuraMark({
  size = 32,
  className,
  pulse = false,
}: {
  size?: number;
  className?: string;
  pulse?: boolean;
}) {
  return (
    <span
      className={cn("relative inline-flex", className)}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 48 48" width={size} height={size} fill="none">
        <defs>
          <radialGradient id="aura-core" cx="0.4" cy="0.35" r="0.7">
            <stop offset="0" stopColor="#EAF2FF" />
            <stop offset="0.4" stopColor="#74E6FF" />
            <stop offset="0.75" stopColor="#6D8BFF" />
            <stop offset="1" stopColor="#9D7BFF" />
          </radialGradient>
          <linearGradient id="aura-ring" x1="4" y1="10" x2="44" y2="40">
            <stop offset="0" stopColor="#74E6FF" />
            <stop offset="1" stopColor="#9D7BFF" />
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="14" fill="url(#aura-core)" />
        <circle
          cx="24"
          cy="24"
          r="19"
          stroke="url(#aura-ring)"
          strokeWidth="1.5"
          opacity="0.6"
          fill="none"
        />
        <ellipse cx="19" cy="18" rx="5" ry="3.5" fill="#fff" opacity="0.55" />
      </svg>
      {pulse && (
        <span
          className="absolute inset-0 animate-ping rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(116,230,255,0.5), transparent 70%)",
          }}
        />
      )}
    </span>
  );
}
