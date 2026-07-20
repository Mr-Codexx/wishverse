"use client";

import { useEffect } from "react";
import { AtSign, Loader2, Check, X, AlertCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  useUsernameAvailability,
  type UsernameState,
} from "@/hooks/use-username-availability";
import { cn } from "@/lib/utils";

const CONFIG: Record<
  UsernameState,
  { icon: React.ReactNode; color: string } | null
> = {
  idle: null,
  checking: {
    icon: <Loader2 className="size-4 animate-spin" />,
    color: "text-[var(--wv-muted)]",
  },
  available: {
    icon: <Check className="size-4" />,
    color: "text-[var(--wv-success)]",
  },
  taken: { icon: <X className="size-4" />, color: "text-[var(--wv-danger)]" },
  invalid: {
    icon: <AlertCircle className="size-4" />,
    color: "text-[var(--wv-warning)]",
  },
  error: {
    icon: <AlertCircle className="size-4" />,
    color: "text-[var(--wv-warning)]",
  },
};

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onAvailabilityChange?: (available: boolean) => void;
}

export function UsernameChecker({ value, onAvailabilityChange, ...props }: Props) {
  const { state, message, isAvailable } = useUsernameAvailability(value);
  const cfg = CONFIG[state];

  // report availability up (used to gate submit) — after render, not during
  useEffect(() => {
    onAvailabilityChange?.(isAvailable);
  }, [isAvailable, onAvailabilityChange]);

  return (
    <div className="space-y-1.5">
      <div className="relative">
        <AtSign className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--wv-muted)]" />
        <Input
          value={value}
          autoCapitalize="none"
          autoComplete="username"
          spellCheck={false}
          className="px-10 lowercase"
          invalid={state === "taken" || state === "invalid"}
          {...props}
        />
        {cfg && (
          <span className={cn("absolute right-3.5 top-1/2 -translate-y-1/2", cfg.color)}>
            {cfg.icon}
          </span>
        )}
      </div>
      <AnimatePresence>
        {message && (
          <motion.p
            initial={{ opacity: 0, y: -3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            className={cn(
              "text-xs",
              state === "available" && "text-[var(--wv-success)]",
              state === "taken" && "text-[var(--wv-danger)]",
              (state === "invalid" || state === "error") && "text-[var(--wv-warning)]",
              state === "checking" && "text-[var(--wv-muted)]",
            )}
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
