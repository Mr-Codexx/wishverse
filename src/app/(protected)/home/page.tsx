"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, ArrowRight, Sparkles } from "lucide-react";

import { WorkspaceShell } from "@/components/workspace/workspace-shell";
import { ExperienceGrid } from "@/components/experiences/experience-grid";
import { EVENT_TYPES } from "@/lib/experiences/event-types";
import { useExperiences } from "@/hooks/use-experiences";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const router = useRouter();
  const { profile } = useAuth();
  const { experiences, loading, refetch } = useExperiences("all");

  const firstName = (profile?.displayName ?? "there").split(" ")[0];

  return (
    <WorkspaceShell activeKey="home">
      <div className="mx-auto w-full max-w-7xl space-y-10 px-5 py-8 sm:px-8 sm:py-10">
        {/* hero */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong liquid-sheen relative overflow-hidden rounded-[2rem] p-8 sm:p-12"
        >
          <div className="aurora-bg pointer-events-none absolute inset-0 -z-10 opacity-60" />
          <p className="mb-2 flex items-center gap-2 text-sm text-[var(--wv-accent)]">
            <Sparkles className="size-4" /> Welcome back, {firstName}
          </p>
          <h1 className="max-w-2xl font-[family-name:var(--font-display)] text-3xl font-bold leading-tight sm:text-5xl">
            Turn a moment into an <span className="text-gradient">experience</span>.
          </h1>
          <p className="mt-3 max-w-xl text-[var(--wv-muted)]">
            Craft immersive, interactive celebrations — countdowns, games, timelines
            and guestbooks — and share them with a single link.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/experiences/new"
              className="bg-[var(--wv-primary)] text-[var(--wv-primary-fg)] inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium shadow-lg transition hover:brightness-110"
            >
              <Plus className="size-5" /> Create Experience
            </Link>
            <Link
              href="/experiences"
              className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium transition hover:brightness-110"
            >
              My Experiences <ArrowRight className="size-4" />
            </Link>
          </div>
        </motion.section>

        {/* start from an occasion */}
        <section>
          <h2 className="mb-4 text-lg font-semibold">Start from an occasion</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {EVENT_TYPES.slice(0, 6).map((e) => (
              <button
                key={e.id}
                onClick={() => router.push("/experiences/new")}
                className="glass group flex flex-col items-center gap-2 rounded-2xl p-4 text-center transition hover:brightness-110"
              >
                <span
                  className={cn(
                    "flex size-12 items-center justify-center rounded-xl bg-gradient-to-br text-2xl transition group-hover:scale-105",
                    e.gradient,
                  )}
                >
                  {e.emoji}
                </span>
                <span className="text-xs font-medium">{e.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* recent */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent experiences</h2>
            <Link
              href="/experiences"
              className="text-sm text-[var(--wv-accent)] hover:underline"
            >
              View all
            </Link>
          </div>
          <ExperienceGrid
            experiences={experiences.slice(0, 8)}
            loading={loading}
            onChange={refetch}
            emptyTitle="Your canvas awaits"
            emptyHint="Create your first experience and it will show up here."
          />
        </section>
      </div>
    </WorkspaceShell>
  );
}
