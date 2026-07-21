"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  Globe,
  Share2,
  Check,
  Loader2,
  RotateCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/store/editor-store";
import { setStatus } from "@/lib/firebase/experiences";
import { toast } from "@/components/providers/toast";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function EditorTopbar() {
  const router = useRouter();
  const experience = useEditorStore((s) => s.experience);
  const dirty = useEditorStore((s) => s.dirty);
  const saving = useEditorStore((s) => s.saving);
  const patch = useEditorStore((s) => s.patchExperience);
  const [publishing, setPublishing] = useState(false);

  if (!experience) return null;
  const published = experience.status === "published";

  const preview = () =>
    window.open(`/e/${experience.slug}`, "_blank", "noopener");

  const share = async () => {
    await navigator.clipboard.writeText(
      `${window.location.origin}/e/${experience.slug}`,
    );
    toast.success("Share link copied");
  };

  const togglePublish = async () => {
    setPublishing(true);
    const next = published ? "draft" : "published";
    try {
      await setStatus(experience.id, next);
      patch({ status: next });
      toast.success(published ? "Unpublished" : "Published", published ? "" : "Your experience is live.");
    } catch {
      toast.error("Couldn't update status");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <header className="glass sticky top-0 z-30 flex items-center gap-3 px-4 py-2.5">
      <button
        onClick={() => router.push("/experiences")}
        aria-label="Back"
        className="focus-ring flex size-9 items-center justify-center rounded-xl text-[var(--wv-muted)] transition hover:bg-[rgb(var(--glass-tint)/0.1)]"
      >
        <ArrowLeft className="size-5" />
      </button>

      <input
        value={experience.title}
        onChange={(e) => patch({ title: e.target.value })}
        className="focus-ring min-w-0 flex-1 truncate rounded-lg bg-transparent px-2 py-1 text-sm font-medium outline-none sm:max-w-xs"
        placeholder="Untitled experience"
      />

      <span className="hidden items-center gap-1.5 text-xs text-[var(--wv-muted)] sm:flex">
        {saving ? (
          <>
            <Loader2 className="size-3.5 animate-spin" /> Saving…
          </>
        ) : dirty ? (
          <>Unsaved</>
        ) : (
          <>
            <Check className="size-3.5 text-[var(--wv-success)]" /> Saved
          </>
        )}
      </span>

      <div className="ml-auto flex items-center gap-1.5">
        <ThemeToggle />
        <Button variant="glass" size="sm" onClick={preview}>
          <Eye className="size-4" /> <span className="hidden sm:inline">Preview</span>
        </Button>
        <Button variant="glass" size="sm" onClick={share}>
          <Share2 className="size-4" /> <span className="hidden sm:inline">Share</span>
        </Button>
        <Button size="sm" onClick={togglePublish} loading={publishing}>
          {published ? (
            <><RotateCcw className="size-4" /> <span className="hidden sm:inline">Unpublish</span></>
          ) : (
            <><Globe className="size-4" /> <span className="hidden sm:inline">Publish</span></>
          )}
        </Button>
      </div>
    </header>
  );
}
