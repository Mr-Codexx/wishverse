"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { listExperiences } from "@/lib/firebase/experiences";
import type { Experience, ExperienceFilter } from "@/types/experience";

export function useExperiences(filter: ExperienceFilter) {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      setExperiences(await listExperiences(user.uid, filter));
    } catch {
      setError("Couldn't load your experiences.");
    } finally {
      setLoading(false);
    }
  }, [user, filter]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { experiences, loading, error, refetch, setExperiences };
}
