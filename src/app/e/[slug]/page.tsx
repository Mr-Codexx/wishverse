"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AlertCircle } from "lucide-react";

import {
  ExperienceRenderer,
  PrivateNotice,
} from "@/components/experience-view/experience-renderer";
import { LoadingOverlay } from "@/components/auth/loading-overlay";
import { Starfield } from "@/components/brand/starfield";
import { getExperienceBySlug } from "@/lib/firebase/experiences";
import type { Experience } from "@/types/experience";

type State =
  | { kind: "loading" }
  | { kind: "ok"; experience: Experience }
  | { kind: "private" }
  | { kind: "missing" };

export default function PublicExperiencePage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? null;
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    if (!slug) return;
    let alive = true;
    getExperienceBySlug(slug)
      .then((exp) => {
        if (!alive) return;
        if (!exp) return setState({ kind: "missing" });
        if (exp.privacy === "private") return setState({ kind: "private" });
        setState({ kind: "ok", experience: exp });
      })
      .catch(() => alive && setState({ kind: "missing" }));
    return () => {
      alive = false;
    };
  }, [slug]);

  if (state.kind === "loading") return <LoadingOverlay show label="Loading experience…" />;
  if (state.kind === "private") return <PrivateNotice />;
  if (state.kind === "missing") {
    return (
      <div className="relative flex min-h-dvh flex-col items-center justify-center gap-4 bg-[var(--wv-bg)] px-6 text-center text-[var(--wv-fg)]">
        <Starfield />
        <div className="droplet relative z-10 flex size-16 items-center justify-center">
          <AlertCircle className="size-7" />
        </div>
        <div className="relative z-10">
          <h1 className="text-xl font-semibold">Experience not found</h1>
          <p className="mt-1 text-sm text-[var(--wv-muted)]">
            This link may have expired or been removed.
          </p>
        </div>
      </div>
    );
  }

  return <ExperienceRenderer experience={state.experience} />;
}
