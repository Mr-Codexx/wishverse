"use client";

import { AppShell } from "@/components/app/app-shell";
import { LogoMark } from "@/components/brand/logo";

export default function WishesPage() {
  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
          Wishes
        </h1>
        <p className="mt-1.5 text-[var(--wv-muted)]">
          The worlds you&apos;re building. Wire this to your product next.
        </p>
      </div>
      <div className="glass-strong flex flex-col items-center gap-4 rounded-3xl p-12 text-center">
        <div className="droplet flex size-16 items-center justify-center">
          <LogoMark size={40} />
        </div>
        <p className="text-sm text-[var(--wv-muted)]">No wishes yet.</p>
      </div>
    </AppShell>
  );
}
