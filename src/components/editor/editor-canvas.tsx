"use client";

import { Reorder } from "framer-motion";
import { Copy, Trash2, ChevronUp, ChevronDown, Plus } from "lucide-react";

import { useEditorStore } from "@/store/editor-store";
import { BlockView } from "@/components/blocks/block-view";
import type { Block } from "@/types/experience";
import { cn } from "@/lib/utils";

export function EditorCanvas() {
  const experience = useEditorStore((s) => s.experience);
  const activePageId = useEditorStore((s) => s.activePageId);
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId);
  const selectBlock = useEditorStore((s) => s.selectBlock);
  const reorderBlocks = useEditorStore((s) => s.reorderBlocks);
  const duplicateBlock = useEditorStore((s) => s.duplicateBlock);
  const removeBlock = useEditorStore((s) => s.removeBlock);

  if (!experience) return null;
  const page = experience.pages.find((p) => p.id === activePageId);
  if (!page) return null;

  const move = (block: Block, dir: -1 | 1) => {
    const idx = page.blocks.findIndex((b) => b.id === block.id);
    const next = idx + dir;
    if (next < 0 || next >= page.blocks.length) return;
    const blocks = [...page.blocks];
    [blocks[idx], blocks[next]] = [blocks[next], blocks[idx]];
    reorderBlocks(page.id, blocks);
  };

  return (
    <div
      className="flex min-h-full justify-center overflow-y-auto p-4 sm:p-8"
      onClick={() => selectBlock(null)}
    >
      <div
        className="glass-strong w-full max-w-3xl rounded-[2rem] p-6 sm:p-10"
        style={{
          background:
            page.background && page.background !== "transparent"
              ? page.background
              : undefined,
        }}
      >
        {page.blocks.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-24 text-center text-[var(--wv-muted)]">
            <Plus className="size-8" />
            <p className="text-sm">
              This page is empty. Add elements from the left panel.
            </p>
          </div>
        ) : (
          <Reorder.Group
            axis="y"
            values={page.blocks}
            onReorder={(blocks) => reorderBlocks(page.id, blocks)}
            className="space-y-2"
          >
            {page.blocks.map((block) => {
              const selected = block.id === selectedBlockId;
              return (
                <Reorder.Item
                  key={block.id}
                  value={block}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    selectBlock(block.id);
                  }}
                  className={cn(
                    "group relative cursor-pointer rounded-2xl px-3 py-3 transition",
                    selected
                      ? "ring-2 ring-[var(--wv-primary)]"
                      : "hover:ring-1 hover:ring-[rgb(var(--glass-tint)/0.3)]",
                  )}
                >
                  {selected && (
                    <div className="absolute -top-3 right-3 z-10 flex items-center gap-0.5 rounded-full bg-[var(--wv-bg-soft)] p-1 shadow-lg ring-1 ring-[rgb(var(--glass-tint)/0.2)]">
                      <Ctrl onClick={() => move(block, -1)} label="Up">
                        <ChevronUp className="size-3.5" />
                      </Ctrl>
                      <Ctrl onClick={() => move(block, 1)} label="Down">
                        <ChevronDown className="size-3.5" />
                      </Ctrl>
                      <Ctrl onClick={() => duplicateBlock(block.id)} label="Duplicate">
                        <Copy className="size-3.5" />
                      </Ctrl>
                      <Ctrl onClick={() => removeBlock(block.id)} label="Delete" danger>
                        <Trash2 className="size-3.5" />
                      </Ctrl>
                    </div>
                  )}
                  <div className="pointer-events-none">
                    <BlockView block={block} animate={false} interactive={false} />
                  </div>
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        )}
      </div>
    </div>
  );
}

function Ctrl({
  children,
  onClick,
  label,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  danger?: boolean;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={label}
      className={cn(
        "flex size-7 items-center justify-center rounded-full transition hover:bg-[rgb(var(--glass-tint)/0.15)]",
        danger && "text-[var(--wv-danger)]",
      )}
    >
      {children}
    </button>
  );
}
