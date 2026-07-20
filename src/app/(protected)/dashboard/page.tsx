"use client";

import { AppShell } from "@/components/app/app-shell";
import { LogoMark } from "@/components/brand/logo";
import { useAuth } from "@/hooks/use-auth";
import { Sparkles, Users, Link2, Activity } from "lucide-react";

const STATS = [
  { label: "Wishes created", value: "0", icon: Sparkles },
  { label: "Collaborators", value: "0", icon: Users },
  { label: "Invites sent", value: "0", icon: Link2 },
  { label: "Active now", value: "0", icon: Activity },
];

export default function DashboardPage() {
  const { profile } = useAuth();
  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
          Welcome{profile?.displayName ? `, ${profile.displayName.split(" ")[0]}` : ""}.
        </h1>
        <p className="mt-1.5 text-[var(--wv-muted)]">
          This is your universe. Everything starts here.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="glass-strong rounded-3xl p-5">
            <div className="droplet mb-4 flex size-10 items-center justify-center">
              <s.icon className="size-5 text-[var(--wv-accent)]" />
            </div>
            <p className="text-3xl font-bold">{s.value}</p>
            <p className="text-sm text-[var(--wv-muted)]">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="glass-strong mt-6 flex flex-col items-center justify-center gap-4 rounded-3xl p-12 text-center">
        <div className="droplet flex size-16 items-center justify-center">
          <LogoMark size={40} />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Create your first wish</h2>
          <p className="mt-1 max-w-sm text-sm text-[var(--wv-muted)]">
            Wishes are the worlds you build in WishVerse. This is a placeholder
            surface — wire it to your product modules next.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
