"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { scorePassword } from "@/lib/validations/auth";
import { cn } from "@/lib/utils";

const BAR_COLORS = [
  "bg-[rgb(var(--glass-tint)/0.15)]",
  "bg-[var(--wv-danger)]",
  "bg-[var(--wv-warning)]",
  "bg-[#7cc4ff]",
  "bg-[var(--wv-success)]",
];

export function PasswordStrength({ password }: { password: string }) {
  const { score, label, checks } = scorePassword(password);
  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-1.5 flex-1 overflow-hidden rounded-full bg-[rgb(var(--glass-tint)/0.12)]"
          >
            <motion.div
              className={cn("h-full rounded-full", BAR_COLORS[score])}
              initial={{ width: 0 }}
              animate={{ width: i < score ? "100%" : "0%" }}
              transition={{ duration: 0.3 }}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-[var(--wv-muted)]">Strength</span>
        <span
          className={cn(
            "text-xs font-medium",
            score <= 1 && "text-[var(--wv-danger)]",
            score === 2 && "text-[var(--wv-warning)]",
            score >= 3 && "text-[var(--wv-success)]",
          )}
        >
          {label}
        </span>
      </div>
      <ul className="grid grid-cols-2 gap-1">
        {checks.map((c) => (
          <li
            key={c.label}
            className={cn(
              "flex items-center gap-1.5 text-[11px]",
              c.ok ? "text-[var(--wv-success)]" : "text-[var(--wv-muted)]",
            )}
          >
            {c.ok ? <Check className="size-3" /> : <X className="size-3" />}
            {c.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
