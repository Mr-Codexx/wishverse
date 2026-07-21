"use client";

import {
  Plus,
  Trash2,
  Palette,
  Wand2,
  Settings2,
  Link2,
} from "lucide-react";

import { useEditorStore } from "@/store/editor-store";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/providers/toast";
import { EVENT_TYPE_MAP } from "@/lib/experiences/event-types";
import { nid } from "@/lib/experiences/factory";
import type {
  AnimationType,
  Block,
  QuizQuestion,
  TimelineItem,
} from "@/types/experience";
import { cn } from "@/lib/utils";

const ANIMATIONS: { id: AnimationType; label: string }[] = [
  { id: "none", label: "None" },
  { id: "fade", label: "Fade" },
  { id: "slideUp", label: "Slide up" },
  { id: "slideLeft", label: "Slide in" },
  { id: "zoom", label: "Zoom" },
  { id: "float", label: "Float" },
];

export function EditorInspector() {
  const experience = useEditorStore((s) => s.experience);
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId);

  if (!experience) return null;
  const block = experience.pages
    .flatMap((p) => p.blocks)
    .find((b) => b.id === selectedBlockId);

  return (
    <div className="flex h-full flex-col overflow-y-auto p-4">
      {block ? <BlockInspector block={block} /> : <ExperienceInspector />}
    </div>
  );
}

/* ---------------- shared field primitives ---------------- */

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          placeholder={placeholder}
          className="focus-ring w-full resize-none rounded-xl border border-[rgb(var(--glass-tint)/0.14)] bg-[rgb(var(--glass-tint)/0.05)] px-3 py-2 text-sm outline-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="focus-ring w-full rounded-xl border border-[rgb(var(--glass-tint)/0.14)] bg-[rgb(var(--glass-tint)/0.05)] px-3 py-2 text-sm outline-none"
        />
      )}
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="space-y-1.5">
      <Label>
        {label} <span className="text-[var(--wv-muted)]">{value}</span>
      </Label>
      <input
        type="range"
        min={min ?? 0}
        max={max ?? 100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--wv-primary)]"
      />
    </div>
  );
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex gap-1 rounded-xl bg-[rgb(var(--glass-tint)/0.08)] p-1">
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className={cn(
              "flex-1 rounded-lg px-2 py-1.5 text-xs transition",
              value === o.id
                ? "bg-[var(--wv-primary)] text-[var(--wv-primary-fg)]"
                : "text-[var(--wv-muted)]",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || "#ffffff"}
          onChange={(e) => onChange(e.target.value)}
          className="size-9 shrink-0 cursor-pointer rounded-lg border border-[rgb(var(--glass-tint)/0.14)] bg-transparent"
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="inherit"
          className="focus-ring w-full rounded-xl border border-[rgb(var(--glass-tint)/0.14)] bg-[rgb(var(--glass-tint)/0.05)] px-3 py-2 text-sm outline-none"
        />
      </div>
    </div>
  );
}

/* ---------------- block inspector ---------------- */

function BlockInspector({ block }: { block: Block }) {
  const update = useEditorStore((s) => s.updateBlockProps);
  const anim = useEditorStore((s) => s.updateBlockAnimation);
  const { props, type, id } = block;

  const align = { label: "Align", value: props.align ?? "center", options: [
    { id: "left" as const, label: "Left" },
    { id: "center" as const, label: "Center" },
    { id: "right" as const, label: "Right" },
  ]};

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Wand2 className="size-4 text-[var(--wv-accent)]" />
        <h3 className="text-sm font-semibold capitalize">{type} block</h3>
      </div>

      {(type === "heading" || type === "text" || type === "button") && (
        <TextField
          label="Text"
          value={props.text ?? ""}
          onChange={(v) => update(id, { text: v })}
          textarea={type === "text"}
        />
      )}

      {type === "heading" && (
        <>
          <Segmented
            label="Level"
            value={String(props.level ?? 1)}
            options={[
              { id: "1", label: "H1" },
              { id: "2", label: "H2" },
              { id: "3", label: "H3" },
            ]}
            onChange={(v) => update(id, { level: Number(v) as 1 | 2 | 3 })}
          />
          <NumberField label="Size" value={props.size ?? 44} min={20} max={96} onChange={(v) => update(id, { size: v })} />
        </>
      )}

      {type === "text" && (
        <NumberField label="Size" value={props.size ?? 18} min={12} max={40} onChange={(v) => update(id, { size: v })} />
      )}

      {(type === "heading" || type === "text" || type === "button") && (
        <Segmented {...align} onChange={(v) => update(id, { align: v })} />
      )}

      {(type === "heading" || type === "text") && (
        <ColorField label="Color" value={props.color ?? ""} onChange={(v) => update(id, { color: v })} />
      )}

      {type === "button" && (
        <TextField label="Link URL" value={props.href ?? ""} onChange={(v) => update(id, { href: v })} placeholder="https://" />
      )}

      {type === "image" && (
        <>
          <TextField label="Image URL" value={props.url ?? ""} onChange={(v) => update(id, { url: v })} placeholder="https://" />
          <TextField label="Caption" value={props.caption ?? ""} onChange={(v) => update(id, { caption: v })} />
          <NumberField label="Corner radius" value={props.radius ?? 24} min={0} max={48} onChange={(v) => update(id, { radius: v })} />
        </>
      )}

      {type === "emoji" && (
        <>
          <TextField label="Emoji" value={props.emoji ?? ""} onChange={(v) => update(id, { emoji: v })} />
          <NumberField label="Size" value={props.size ?? 72} min={32} max={160} onChange={(v) => update(id, { size: v })} />
        </>
      )}

      {type === "spacer" && (
        <NumberField label="Height" value={props.height ?? 48} min={8} max={200} onChange={(v) => update(id, { height: v })} />
      )}

      {type === "countdown" && (
        <>
          <TextField label="Label" value={props.text ?? ""} onChange={(v) => update(id, { text: v })} />
          <TextField label="Target date" type="datetime-local" value={props.targetDate ?? ""} onChange={(v) => update(id, { targetDate: v })} />
        </>
      )}

      {type === "guestbook" && (
        <TextField label="Prompt" value={props.prompt ?? ""} onChange={(v) => update(id, { prompt: v })} />
      )}

      {type === "gallery" && <GalleryEditor block={block} />}
      {type === "timeline" && <TimelineEditor block={block} />}
      {type === "quiz" && <QuizEditor block={block} />}
      {type === "spinwheel" && <SpinEditor block={block} />}

      {/* animation */}
      <div className="space-y-3 border-t border-[rgb(var(--glass-tint)/0.1)] pt-4">
        <Segmented
          label="Animation"
          value={block.animation.type}
          options={ANIMATIONS}
          onChange={(v) => anim(id, { type: v })}
        />
        <NumberField
          label="Delay (s)"
          value={block.animation.delay}
          min={0}
          max={3}
          onChange={(v) => anim(id, { delay: v })}
        />
      </div>
    </div>
  );
}

/* ---------------- list editors ---------------- */

function GalleryEditor({ block }: { block: Block }) {
  const update = useEditorStore((s) => s.updateBlockProps);
  const images = block.props.images ?? [];
  return (
    <div className="space-y-2">
      <Label>Images</Label>
      {images.map((src, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={src}
            onChange={(e) => {
              const next = [...images];
              next[i] = e.target.value;
              update(block.id, { images: next });
            }}
            placeholder="Image URL"
            className="focus-ring w-full rounded-xl border border-[rgb(var(--glass-tint)/0.14)] bg-[rgb(var(--glass-tint)/0.05)] px-3 py-2 text-sm outline-none"
          />
          <RemoveBtn onClick={() => update(block.id, { images: images.filter((_, j) => j !== i) })} />
        </div>
      ))}
      <AddBtn label="Add image" onClick={() => update(block.id, { images: [...images, ""] })} />
    </div>
  );
}

function TimelineEditor({ block }: { block: Block }) {
  const update = useEditorStore((s) => s.updateBlockProps);
  const items = block.props.items ?? [];
  const set = (next: TimelineItem[]) => update(block.id, { items: next });
  return (
    <div className="space-y-3">
      <Label>Moments</Label>
      {items.map((it, i) => (
        <div key={it.id} className="glass space-y-2 rounded-xl p-2.5">
          <div className="flex gap-2">
            <input
              value={it.date}
              onChange={(e) => set(items.map((x, j) => (j === i ? { ...x, date: e.target.value } : x)))}
              placeholder="Date"
              className="focus-ring w-24 shrink-0 rounded-lg border border-[rgb(var(--glass-tint)/0.14)] bg-[rgb(var(--glass-tint)/0.05)] px-2 py-1.5 text-xs outline-none"
            />
            <input
              value={it.title}
              onChange={(e) => set(items.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))}
              placeholder="Title"
              className="focus-ring w-full rounded-lg border border-[rgb(var(--glass-tint)/0.14)] bg-[rgb(var(--glass-tint)/0.05)] px-2 py-1.5 text-xs outline-none"
            />
            <RemoveBtn onClick={() => set(items.filter((_, j) => j !== i))} />
          </div>
          <input
            value={it.body}
            onChange={(e) => set(items.map((x, j) => (j === i ? { ...x, body: e.target.value } : x)))}
            placeholder="Description"
            className="focus-ring w-full rounded-lg border border-[rgb(var(--glass-tint)/0.14)] bg-[rgb(var(--glass-tint)/0.05)] px-2 py-1.5 text-xs outline-none"
          />
        </div>
      ))}
      <AddBtn
        label="Add moment"
        onClick={() => set([...items, { id: nid(), date: "", title: "New moment", body: "" }])}
      />
    </div>
  );
}

function QuizEditor({ block }: { block: Block }) {
  const update = useEditorStore((s) => s.updateBlockProps);
  const questions = block.props.questions ?? [];
  const set = (next: QuizQuestion[]) => update(block.id, { questions: next });
  return (
    <div className="space-y-3">
      <TextField label="Quiz title" value={block.props.text ?? ""} onChange={(v) => update(block.id, { text: v })} />
      {questions.map((q, qi) => (
        <div key={q.id} className="glass space-y-2 rounded-xl p-2.5">
          <div className="flex gap-2">
            <input
              value={q.question}
              onChange={(e) => set(questions.map((x, j) => (j === qi ? { ...x, question: e.target.value } : x)))}
              placeholder="Question"
              className="focus-ring w-full rounded-lg border border-[rgb(var(--glass-tint)/0.14)] bg-[rgb(var(--glass-tint)/0.05)] px-2 py-1.5 text-xs outline-none"
            />
            <RemoveBtn onClick={() => set(questions.filter((_, j) => j !== qi))} />
          </div>
          {q.options.map((opt, oi) => (
            <div key={oi} className="flex items-center gap-2">
              <button
                onClick={() => set(questions.map((x, j) => (j === qi ? { ...x, answerIndex: oi } : x)))}
                className={cn(
                  "size-4 shrink-0 rounded-full border",
                  q.answerIndex === oi
                    ? "border-[var(--wv-success)] bg-[var(--wv-success)]"
                    : "border-[rgb(var(--glass-tint)/0.3)]",
                )}
                aria-label="Mark correct"
              />
              <input
                value={opt}
                onChange={(e) =>
                  set(questions.map((x, j) => (j === qi ? { ...x, options: x.options.map((o, k) => (k === oi ? e.target.value : o)) } : x)))
                }
                className="focus-ring w-full rounded-lg border border-[rgb(var(--glass-tint)/0.14)] bg-[rgb(var(--glass-tint)/0.05)] px-2 py-1.5 text-xs outline-none"
              />
            </div>
          ))}
        </div>
      ))}
      <AddBtn
        label="Add question"
        onClick={() =>
          set([
            ...questions,
            { id: nid(), question: "New question", options: ["Option 1", "Option 2"], answerIndex: 0 },
          ])
        }
      />
    </div>
  );
}

function SpinEditor({ block }: { block: Block }) {
  const update = useEditorStore((s) => s.updateBlockProps);
  const segments = block.props.segments ?? [];
  return (
    <div className="space-y-2">
      <TextField label="Prompt" value={block.props.text ?? ""} onChange={(v) => update(block.id, { text: v })} />
      <Label>Segments</Label>
      {segments.map((s, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={s}
            onChange={(e) => update(block.id, { segments: segments.map((x, j) => (j === i ? e.target.value : x)) })}
            className="focus-ring w-full rounded-xl border border-[rgb(var(--glass-tint)/0.14)] bg-[rgb(var(--glass-tint)/0.05)] px-3 py-2 text-sm outline-none"
          />
          <RemoveBtn onClick={() => update(block.id, { segments: segments.filter((_, j) => j !== i) })} />
        </div>
      ))}
      <AddBtn label="Add segment" onClick={() => update(block.id, { segments: [...segments, "New"] })} />
    </div>
  );
}

function AddBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="glass flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-xs transition hover:brightness-110"
    >
      <Plus className="size-3.5" /> {label}
    </button>
  );
}

function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex size-9 shrink-0 items-center justify-center rounded-xl text-[var(--wv-muted)] transition hover:text-[var(--wv-danger)]"
      aria-label="Remove"
    >
      <Trash2 className="size-4" />
    </button>
  );
}

/* ---------------- experience inspector (no block selected) ---------------- */

function ExperienceInspector() {
  const experience = useEditorStore((s) => s.experience)!;
  const patch = useEditorStore((s) => s.patchExperience);
  const activePageId = useEditorStore((s) => s.activePageId);
  const setPageBackground = useEditorStore((s) => s.setPageBackground);
  const page = experience.pages.find((p) => p.id === activePageId);
  const meta = EVENT_TYPE_MAP[experience.eventType];

  const copyLink = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/e/${experience.slug}`);
    toast.success("Share link copied");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Settings2 className="size-4 text-[var(--wv-accent)]" />
        <h3 className="text-sm font-semibold">Experience</h3>
      </div>

      <div className="glass flex items-center gap-3 rounded-2xl p-3">
        <div className={cn("flex size-10 items-center justify-center rounded-xl bg-gradient-to-br text-xl", meta.gradient)}>
          {meta.emoji}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{meta.label}</p>
          <p className="truncate text-xs text-[var(--wv-muted)]">
            {experience.pages.length} page{experience.pages.length > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <TextField
        label="Recipient"
        value={experience.recipient.name}
        onChange={(v) => patch({ recipient: { ...experience.recipient, name: v } })}
      />
      <TextField
        label="Relationship"
        value={experience.recipient.relationship}
        onChange={(v) => patch({ recipient: { ...experience.recipient, relationship: v } })}
      />

      <div className="space-y-1.5">
        <Label>Countdown date</Label>
        <input
          type="datetime-local"
          value={experience.countdown.targetDate ?? ""}
          onChange={(e) =>
            patch({
              countdown: {
                ...experience.countdown,
                targetDate: e.target.value || null,
                enabled: Boolean(e.target.value),
              },
            })
          }
          className="focus-ring w-full rounded-xl border border-[rgb(var(--glass-tint)/0.14)] bg-[rgb(var(--glass-tint)/0.05)] px-3 py-2 text-sm outline-none"
        />
      </div>

      <Segmented
        label="Privacy"
        value={experience.privacy}
        options={[
          { id: "public", label: "Public" },
          { id: "unlisted", label: "Unlisted" },
          { id: "private", label: "Private" },
        ]}
        onChange={(v) => patch({ privacy: v })}
      />

      {page && (
        <div className="space-y-1.5 border-t border-[rgb(var(--glass-tint)/0.1)] pt-4">
          <div className="flex items-center gap-2">
            <Palette className="size-4 text-[var(--wv-accent)]" />
            <Label>Page background</Label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={page.background !== "transparent" ? page.background : "#0b1030"}
              onChange={(e) => setPageBackground(page.id, e.target.value)}
              className="size-9 shrink-0 cursor-pointer rounded-lg border border-[rgb(var(--glass-tint)/0.14)] bg-transparent"
            />
            <button
              onClick={() => setPageBackground(page.id, "transparent")}
              className="glass flex-1 rounded-xl py-2 text-xs"
            >
              Reset to theme
            </button>
          </div>
        </div>
      )}

      <button
        onClick={copyLink}
        className="glass flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm transition hover:brightness-110"
      >
        <Link2 className="size-4" /> Copy share link
      </button>
    </div>
  );
}
