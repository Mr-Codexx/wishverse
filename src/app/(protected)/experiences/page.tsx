"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";

import { WorkspaceShell } from "@/components/workspace/workspace-shell";
import { ExperienceGrid } from "@/components/experiences/experience-grid";
import { useExperiences } from "@/hooks/use-experiences";
import type { ExperienceFilter } from "@/types/experience";
import type { WorkspaceKey } from "@/components/workspace/workspace-sidebar";
import { cn } from "@/lib/utils";

const TABS: { key: WorkspaceKey; filter: ExperienceFilter; label: string; href: string }[] = [
  { key: "all", filter: "all", label: "All", href: "/experiences" },
  { key: "drafts", filter: "drafts", label: "Drafts", href: "/experiences?filter=drafts" },
  { key: "published", filter: "published", label: "Published", href: "/experiences?filter=published" },
  { key: "favorites", filter: "favorites", label: "Favorites", href: "/experiences?filter=favorites" },
  { key: "archived", filter: "archived", label: "Archived", href: "/experiences?filter=archived" },
  { key: "shared", filter: "shared", label: "Shared With Me", href: "/experiences?filter=shared" },
];

const HEADINGS: Record<ExperienceFilter, string> = {
  all: "My Experiences",
  drafts: "Drafts",
  published: "Published",
  archived: "Archived",
  favorites: "Favorites",
  shared: "Shared With Me",
};

function ExperiencesInner() {
  const params = useSearchParams();
  const raw = (params.get("filter") ?? "all") as ExperienceFilter;
  const filter: ExperienceFilter = TABS.some((t) => t.filter === raw) ? raw : "all";
  const active = TABS.find((t) => t.filter === filter)!;

  const { experiences, loading, refetch } = useExperiences(filter);

  return (
    <WorkspaceShell activeKey={active.key}>
      <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold sm:text-3xl">
            {HEADINGS[filter]}
          </h1>
          <Link
            href="/experiences/new"
            className="bg-[var(--wv-primary)] text-[var(--wv-primary-fg)] inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium"
          >
            <Plus className="size-4" /> Create
          </Link>
        </div>

        {/* filter tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <Link
              key={t.key}
              href={t.href}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm transition",
                t.filter === filter
                  ? "bg-[var(--wv-primary)] text-[var(--wv-primary-fg)]"
                  : "glass text-[var(--wv-muted)] hover:text-[var(--wv-fg)]",
              )}
            >
              {t.label}
            </Link>
          ))}
        </div>

        <ExperienceGrid
          experiences={experiences}
          loading={loading}
          onChange={refetch}
          shared={filter === "shared"}
          emptyTitle={filter === "shared" ? "Nothing shared yet" : `No ${filter === "all" ? "" : filter + " "}experiences`}
          emptyHint={
            filter === "shared"
              ? "Experiences others share with you will appear here."
              : "Create an experience to see it here."
          }
        />
      </div>
    </WorkspaceShell>
  );
}

export default function ExperiencesPage() {
  return (
    <Suspense fallback={null}>
      <ExperiencesInner />
    </Suspense>
  );
}
