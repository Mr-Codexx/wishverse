"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { LiquidBackground } from "@/components/brand/liquid-background";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { LoadingOverlay } from "@/components/auth/loading-overlay";

export function OnboardingShell({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const { loading, isAuthenticated } = useRequireAuth();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-anim='onboard']", {
        opacity: 0,
        y: 30,
        scale: 0.98,
        duration: 0.8,
        ease: "power3.out",
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="relative flex min-h-dvh flex-col">
      <LiquidBackground />
      <LoadingOverlay show={loading} label="Preparing your universe…" />

      <header className="relative z-20 flex items-center justify-between px-5 py-5 sm:px-8">
        <Logo size={36} />
        <ThemeToggle />
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-5 pb-12">
        <div data-anim="onboard" className="w-full max-w-lg">
          {isAuthenticated && children}
        </div>
      </main>
    </div>
  );
}
