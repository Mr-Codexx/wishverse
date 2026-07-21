"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { ExperienceCard } from "./experience-card";
import { LogoMark } from "@/components/brand/logo";
import type { Experience } from "@/types/experience";

export function ExperienceGrid({
  experiences,
  loading,
  onChange,
  shared = false,
  emptyTitle = "No experiences yet",
  emptyHint = "Create your first experience to get started.",
}: {
  experiences: Experience[];
  loading: boolean;
  onChange: () => void;
  shared?: boolean;
  emptyTitle?: string;
  emptyHint?: string;
}) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="glass h-64 animate-pulse rounded-3xl"
            style={{ animationDelay: `${i * 60}ms` }}
          />
        ))}
      </div>
    );
  }

  if (experiences.length === 0) {
    return (
      <div className="glass-strong flex flex-col items-center gap-4 rounded-3xl p-14 text-center">
        <div className="droplet flex size-16 items-center justify-center">
          <LogoMark size={40} />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{emptyTitle}</h3>
          <p className="mt-1 max-w-sm text-sm text-[var(--wv-muted)]">{emptyHint}</p>
        </div>
        {!shared && (
          <Link
            href="/experiences/new"
            className="bg-[var(--wv-primary)] text-[var(--wv-primary-fg)] mt-1 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium"
          >
            <Plus className="size-4" /> Create Experience
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {experiences.map((exp) => (
        <ExperienceCard
          key={exp.id}
          experience={exp}
          onChange={onChange}
          shared={shared}
        />
      ))}
    </div>
  );
}
