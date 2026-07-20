"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "focus-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none",
  {
    variants: {
      variant: {
        primary:
          "liquid-sheen bg-[var(--wv-primary)] text-[var(--wv-primary-fg)] shadow-[0_10px_30px_-8px_var(--wv-primary)] hover:brightness-110",
        glass:
          "glass text-[var(--wv-fg)] hover:bg-[rgb(var(--glass-tint)/0.12)]",
        ghost:
          "text-[var(--wv-fg)] hover:bg-[rgb(var(--glass-tint)/0.08)]",
        outline:
          "border border-[rgb(var(--glass-tint)/0.2)] text-[var(--wv-fg)] hover:bg-[rgb(var(--glass-tint)/0.08)]",
        danger:
          "bg-[var(--wv-danger)] text-white hover:brightness-110",
        link: "text-[var(--wv-accent)] underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-11 px-5",
        lg: "h-12 px-6 text-base",
        icon: "size-11",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={asChild ? undefined : disabled || loading}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {loading && <Loader2 className="size-4 animate-spin" />}
            {children}
          </>
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
