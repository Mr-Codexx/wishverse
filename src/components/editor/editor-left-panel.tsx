"use client";

import { useState } from "react";
import { Reorder } from "framer-motion";
import {
  Plus,
  Trash2,
  GripVertical,
  Type,
  Heading,
  Image as ImageIcon,
  MousePointerClick,
  Timer,
  Minus,
  MoveVertical,
  Smile,
  Images,
  ListOrdered,
  HelpCircle,
  Disc3,
  MessageSquareHeart,
  Layers,
  Shapes,
} from "lucide-react";

import { useEditorStore } from "@/store/editor-store";
import type { BlockType } from "@/types/experience";
import { cn } from "@/lib/utils";

const ELEMENTS: { type: BlockType; label: string; icon: typeof Type }[] = [
  { type: "heading", label: "Heading", icon: Heading },
  { type: "text", label: "Text", icon: Type },
  { type: "image", label: "Image", icon: ImageIcon },
  { type: "button", label: "Button", icon: MousePointerClick },
  { type: "countdown", label: "Countdown", icon: Timer },
  { type: "emoji", label: "Emoji", icon: Smile },
  { type: "gallery", label: "Gallery", icon: Images },
  { type: "timeline", label: "Timeline", icon: ListOrdered },
  { type: "quiz", label: "Quiz", icon: HelpCircle },
  { type: "spinwheel", label: "Spin Wheel", icon: Disc3 },
  { type: "guestbook", label: "Guestbook", icon: MessageSquareHeart },
  { type: "divider", label: "Divider", icon: Minus },
  { type: "spacer", label: "Spacer", icon: MoveVertical },
];

export function EditorLeftPanel() {
  const [tab, setTab] = useState<"pages" | "elements">("elements");
  const experience = useEditorStore((s) => s.experience);
  const activePageId = useEditorStore((s) => s.activePageId);
  const setActivePage = useEditorStore((s) => s.setActivePage);
  const addPage = useEditorStore((s) => s.addPage);
  const removePage = useEditorStore((s) => s.removePage);
  const renamePage = useEditorStore((s) => s.renamePage);
  const reorderPages = useEditorStore((s) => s.reorderPages);
  const addBlock = useEditorStore((s) => s.addBlock);

  if (!experience) return null;
  const activePage = experience.pages.find((p) => p.id === activePageId);

  return (
    <div className="flex h-full flex-col p-3">
      <div className="mb-3 flex gap-1 rounded-xl bg-[rgb(var(--glass-tint)/0.08)] p-1">
        {(["elements", "pages"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-medium capitalize transition",
              tab === t
                ? "bg-[var(--wv-primary)] text-[var(--wv-primary-fg)]"
                : "text-[var(--wv-muted)]",
            )}
          >
            {t === "elements" ? <Shapes className="size-3.5" /> : <Layers className="size-3.5" />}
            {t}
          </button>
        ))}
      </div>

      {tab === "elements" ? (
        <div className="grid grid-cols-2 gap-2 overflow-y-auto pr-1">
          {ELEMENTS.map((el) => (
            <button
              key={el.type}
              onClick={() => addBlock(el.type)}
              className="glass flex flex-col items-center gap-1.5 rounded-xl p-3 text-xs transition hover:brightness-110"
            >
              <el.icon className="size-5 text-[var(--wv-accent)]" />
              {el.label}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col">
          {activePage && (
            <input
              value={activePage.name}
              onChange={(e) => renamePage(activePage.id, e.target.value)}
              className="focus-ring mb-2 w-full rounded-lg border border-[rgb(var(--glass-tint)/0.14)] bg-[rgb(var(--glass-tint)/0.05)] px-3 py-2 text-sm outline-none"
              placeholder="Page name"
            />
          )}
          <Reorder.Group
            axis="y"
            values={experience.pages}
            onReorder={reorderPages}
            className="flex-1 space-y-1.5 overflow-y-auto pr-1"
          >
            {experience.pages.map((page) => (
              <Reorder.Item
                key={page.id}
                value={page}
                className={cn(
                  "glass flex items-center gap-2 rounded-xl px-2.5 py-2 text-sm",
                  page.id === activePageId && "ring-2 ring-[var(--wv-primary)]",
                )}
              >
                <GripVertical className="size-3.5 shrink-0 cursor-grab text-[var(--wv-muted)]" />
                <button
                  onClick={() => setActivePage(page.id)}
                  className="min-w-0 flex-1 truncate text-left"
                >
                  {page.name}
                  <span className="ml-1.5 text-xs text-[var(--wv-muted)]">
                    {page.blocks.length}
                  </span>
                </button>
                {experience.pages.length > 1 && (
                  <button
                    onClick={() => removePage(page.id)}
                    className="shrink-0 text-[var(--wv-muted)] transition hover:text-[var(--wv-danger)]"
                    aria-label="Delete page"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                )}
              </Reorder.Item>
            ))}
          </Reorder.Group>
          <button
            onClick={addPage}
            className="glass mt-2 flex items-center justify-center gap-1.5 rounded-xl py-2 text-sm transition hover:brightness-110"
          >
            <Plus className="size-4" /> Add page
          </button>
        </div>
      )}
    </div>
  );
}
