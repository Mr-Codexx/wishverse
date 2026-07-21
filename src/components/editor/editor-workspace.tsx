"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { EditorTopbar } from "./editor-topbar";
import { EditorLeftPanel } from "./editor-left-panel";
import { EditorCanvas } from "./editor-canvas";
import { EditorInspector } from "./editor-inspector";
import { useEditorStore } from "@/store/editor-store";
import { updateExperience } from "@/lib/firebase/experiences";
import type { Experience } from "@/types/experience";

const AUTOSAVE_MS = 1200;

function persistable(exp: Experience): Partial<Experience> {
  return {
    title: exp.title,
    slug: exp.slug,
    theme: exp.theme,
    eventType: exp.eventType,
    recipient: exp.recipient,
    countdown: exp.countdown,
    status: exp.status,
    privacy: exp.privacy,
    favorite: exp.favorite,
    cover: exp.cover,
    pages: exp.pages,
    sharedWith: exp.sharedWith,
  };
}

export function EditorWorkspace({ initial }: { initial: Experience }) {
  const load = useEditorStore((s) => s.load);
  const setSaving = useEditorStore((s) => s.setSaving);
  const markSaved = useEditorStore((s) => s.markSaved);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    load(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial.id]);

  useEffect(() => {
    const unsub = useEditorStore.subscribe((state) => {
      if (!state.experience || !state.dirty || state.saving) return;
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(async () => {
        const { experience } = useEditorStore.getState();
        if (!experience) return;
        setSaving(true);
        try {
          await updateExperience(experience.id, persistable(experience));
          markSaved();
        } catch {
          setSaving(false);
        }
      }, AUTOSAVE_MS);
    });
    return () => {
      unsub();
      if (timer.current) clearTimeout(timer.current);
    };
  }, [setSaving, markSaved]);

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <EditorTopbar />
      <div className="flex min-h-0 flex-1">
        <aside className="glass hidden w-64 shrink-0 overflow-hidden md:block">
          <EditorLeftPanel />
        </aside>
        <div className="min-w-0 flex-1 overflow-hidden">
          <EditorCanvas />
        </div>
        <aside className="glass hidden w-72 shrink-0 overflow-hidden lg:block">
          <EditorInspector />
        </aside>
      </div>

      <div className="glass flex items-center justify-around gap-2 p-2 md:hidden">
        <MobilePanel label="Elements & Pages">
          <EditorLeftPanel />
        </MobilePanel>
        <MobilePanel label="Inspector">
          <EditorInspector />
        </MobilePanel>
      </div>
    </div>
  );
}

function MobilePanel({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="glass flex-1 rounded-xl py-2 text-xs font-medium"
      >
        {label}
      </button>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[115] bg-black/40 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
              className="glass-strong fixed inset-x-0 bottom-0 z-[120] max-h-[75dvh] overflow-y-auto rounded-t-3xl md:hidden"
            >
              <div className="sticky top-0 flex items-center justify-between p-3">
                <span className="text-sm font-medium">{label}</span>
                <button onClick={() => setOpen(false)} aria-label="Close">
                  <X className="size-5" />
                </button>
              </div>
              {children}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
