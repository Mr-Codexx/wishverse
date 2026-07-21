"use client";

import { useEffect, useState } from "react";
import { getExperience } from "@/lib/firebase/experiences";
import type { Experience } from "@/types/experience";

export function useExperience(id: string | null) {
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let alive = true;
    if (!id) return;
    setLoading(true);
    getExperience(id)
      .then((exp) => {
        if (!alive) return;
        if (!exp) setNotFound(true);
        else setExperience(exp);
      })
      .catch(() => alive && setNotFound(true))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [id]);

  return { experience, loading, notFound };
}
