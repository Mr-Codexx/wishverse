"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "focus-ring flex h-11 w-full rounded-xl border bg-[rgb(var(--glass-tint)/0.05)] px-4 text-sm text-[var(--wv-fg)] transition-colors placeholder:text-[var(--wv-muted)] disabled:opacity-50",
        "border-[rgb(var(--glass-tint)/0.14)] focus:border-[var(--wv-ring)]",
        invalid && "border-[var(--wv-danger)] focus:border-[var(--wv-danger)]",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
