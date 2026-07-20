"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { LiquidBackground } from "@/components/brand/liquid-background";
import { Logo, LogoMark } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { APP_TAGLINE } from "@/lib/constants";

const HIGHLIGHTS = [
  "Craft wishes and moments into shared universes",
  "Invite anyone with a single starlit link",
  "Real-time presence, everywhere your people are",
];

export function AuthShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from("[data-anim='brand']", { opacity: 0, x: -30, duration: 0.7 })
        .from(
          "[data-anim='highlight']",
          { opacity: 0, y: 16, stagger: 0.08, duration: 0.5 },
          "-=0.3",
        )
        .from(
          "[data-anim='card']",
          { opacity: 0, y: 28, scale: 0.98, duration: 0.7 },
          "-=0.5",
        )
        .from(
          "[data-anim='field']",
          { opacity: 0, y: 12, stagger: 0.06, duration: 0.4 },
          "-=0.4",
        );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="relative min-h-dvh w-full">
      <LiquidBackground />

      <div className="absolute right-4 top-4 z-20">
        <ThemeToggle />
      </div>

      <div className="mx-auto grid min-h-dvh w-full max-w-6xl grid-cols-1 items-center gap-8 px-5 py-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-8">
        {/* Brand / narrative panel */}
        <aside className="hidden flex-col justify-center lg:flex" data-anim="brand">
          <Link href="/" className="mb-10 inline-flex">
            <Logo size={44} />
          </Link>
          <h2 className="font-[family-name:var(--font-display)] text-5xl font-bold leading-[1.05] tracking-tight">
            Where wishes become
            <br />
            <span className="text-gradient">worlds.</span>
          </h2>
          <p className="mt-4 max-w-md text-[var(--wv-muted)]">{APP_TAGLINE}.</p>

          <ul className="mt-10 space-y-4">
            {HIGHLIGHTS.map((h) => (
              <li
                key={h}
                data-anim="highlight"
                className="glass flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm"
              >
                <span className="droplet flex size-8 shrink-0 items-center justify-center">
                  <LogoMark size={18} />
                </span>
                {h}
              </li>
            ))}
          </ul>
        </aside>

        {/* Form column */}
        <main className="flex w-full items-center justify-center">
          <div
            data-anim="card"
            className="glass-strong liquid-sheen w-full max-w-md rounded-3xl p-7 sm:p-9"
          >
            <div className="mb-7 flex flex-col items-center text-center lg:hidden">
              <LogoMark size={48} />
            </div>
            <div className="mb-7">
              <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-1.5 text-sm text-[var(--wv-muted)]">{subtitle}</p>
              )}
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
