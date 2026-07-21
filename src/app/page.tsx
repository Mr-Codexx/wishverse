"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowRight, Sparkles } from "lucide-react";
import { LiquidBackground } from "@/components/brand/liquid-background";
import { Logo, LogoMark } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { APP_TAGLINE } from "@/lib/constants";

const FEATURES = [
  { title: "Shared universes", body: "Turn any wish into a living, collaborative world." },
  { title: "Starlit invites", body: "Bring people in with a single link — no friction." },
  { title: "Live presence", body: "See everyone in real time, wherever they are." },
];

export default function Home() {
  const root = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from("[data-h='mark']", { opacity: 0, scale: 0.8, duration: 0.8 })
        .from("[data-h='title']", { opacity: 0, y: 30, duration: 0.7 }, "-=0.4")
        .from("[data-h='sub']", { opacity: 0, y: 20, duration: 0.6 }, "-=0.4")
        .from("[data-h='cta']", { opacity: 0, y: 16, duration: 0.5 }, "-=0.4")
        .from("[data-h='feat']", { opacity: 0, y: 24, stagger: 0.1, duration: 0.5 }, "-=0.2");
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="relative min-h-dvh">
      <LiquidBackground />

      <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Logo size={36} />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button asChild variant="glass" size="sm">
            <Link href={isAuthenticated ? "/home" : "/login"}>
              {isAuthenticated ? "Dashboard" : "Sign in"}
            </Link>
          </Button>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-5 pb-20 pt-16 text-center sm:pt-24">
        <div data-h="mark" className="mb-8">
          <div className="droplet flex size-24 items-center justify-center">
            <LogoMark size={72} />
          </div>
        </div>

        <span
          data-h="sub"
          className="glass mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-[var(--wv-muted)]"
        >
          <Sparkles className="size-3.5 text-[var(--wv-accent)]" /> {APP_TAGLINE}
        </span>

        <h1
          data-h="title"
          className="font-[family-name:var(--font-display)] text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl"
        >
          Where wishes
          <br />
          become <span className="text-gradient">worlds</span>.
        </h1>

        <p data-h="sub" className="mt-6 max-w-xl text-lg text-[var(--wv-muted)]">
          WishVerse is the place to gather people around what matters and turn
          fleeting moments into experiences no one forgets.
        </p>

        <div data-h="cta" className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/register">
              Create your universe <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="glass" size="lg">
            <Link href="/login">I already have an account</Link>
          </Button>
        </div>

        <div className="mt-20 grid w-full gap-4 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              data-h="feat"
              className="glass liquid-sheen rounded-3xl p-6 text-left"
            >
              <div className="droplet mb-4 flex size-10 items-center justify-center">
                <LogoMark size={22} />
              </div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-[var(--wv-muted)]">{f.body}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
