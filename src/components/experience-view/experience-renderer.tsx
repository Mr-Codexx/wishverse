"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Lock } from "lucide-react";

import { Starfield } from "@/components/brand/starfield";
import { LogoMark } from "@/components/brand/logo";
import { BlockView } from "@/components/blocks/block-view";
import { incrementViews } from "@/lib/firebase/experiences";
import type { Experience } from "@/types/experience";

export function ExperienceRenderer({ experience }: { experience: Experience }) {
  const [activePage, setActivePage] = useState(0);

  useEffect(() => {
    // present the experience in its authored theme (view-only, not persisted)
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", experience.theme);
    }
    incrementViews(experience.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experience.id]);

  const page = experience.pages[Math.min(activePage, experience.pages.length - 1)];

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[var(--wv-bg)] text-[var(--wv-fg)]">
      <Starfield />
      <div className="aurora-bg pointer-events-none fixed inset-0 -z-10 opacity-70" />

      {/* page dots */}
      {experience.pages.length > 1 && (
        <div className="fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-2 sm:flex">
          {experience.pages.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActivePage(i)}
              aria-label={p.name}
              className={`size-2.5 rounded-full transition ${
                i === activePage
                  ? "scale-125 bg-[var(--wv-primary)]"
                  : "bg-[rgb(var(--glass-tint)/0.3)]"
              }`}
            />
          ))}
        </div>
      )}

      <motion.section
        key={page.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mx-auto flex min-h-dvh w-full max-w-3xl flex-col items-center justify-center gap-6 px-5 py-20"
        style={{
          background:
            page.background && page.background !== "transparent"
              ? page.background
              : undefined,
        }}
      >
        {page.blocks.map((block) => (
          <div key={block.id} className="w-full">
            <BlockView block={block} interactive animate experienceId={experience.id} />
          </div>
        ))}

        {activePage < experience.pages.length - 1 && (
          <button
            onClick={() => setActivePage((p) => p + 1)}
            className="glass mt-6 flex items-center gap-2 rounded-full px-5 py-2.5 text-sm"
          >
            {experience.pages[activePage + 1]?.name ?? "Next"}
            <ChevronDown className="size-4" />
          </button>
        )}
      </motion.section>

      <footer className="relative z-10 flex items-center justify-center gap-2 pb-8 text-xs text-[var(--wv-muted)]">
        <LogoMark size={16} /> Made with WishVerse
      </footer>
    </div>
  );
}

export function PrivateNotice() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center gap-4 bg-[var(--wv-bg)] px-6 text-center text-[var(--wv-fg)]">
      <Starfield />
      <div className="droplet relative z-10 flex size-16 items-center justify-center">
        <Lock className="size-7" />
      </div>
      <div className="relative z-10">
        <h1 className="text-xl font-semibold">This experience is private</h1>
        <p className="mt-1 text-sm text-[var(--wv-muted)]">
          The creator hasn&apos;t shared this one publicly.
        </p>
      </div>
    </div>
  );
}
