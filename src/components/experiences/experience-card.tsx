"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { motion } from "framer-motion";
import {
  MoreHorizontal,
  Star,
  Copy,
  Pencil,
  Eye,
  Link2,
  Globe,
  Archive,
  Trash2,
  RotateCcw,
} from "lucide-react";

import type { Experience } from "@/types/experience";
import { EVENT_TYPE_MAP } from "@/lib/experiences/event-types";
import {
  setFavorite,
  setStatus,
  duplicateExperience,
  deleteExperience,
} from "@/lib/firebase/experiences";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/components/providers/toast";
import { relativeTime, cn } from "@/lib/utils";

const STATUS_BADGE: Record<Experience["status"], string> = {
  draft: "text-[var(--wv-warning)]",
  published: "text-[var(--wv-success)]",
  archived: "text-[var(--wv-muted)]",
};

export function ExperienceCard({
  experience,
  onChange,
  shared = false,
}: {
  experience: Experience;
  onChange: () => void;
  shared?: boolean;
}) {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [busy, setBusy] = useState(false);
  const meta = EVENT_TYPE_MAP[experience.eventType];

  const open = () => router.push(`/experience/${experience.id}/edit`);
  const preview = () =>
    window.open(`/e/${experience.slug}`, "_blank", "noopener");

  const run = async (fn: () => Promise<unknown>, ok: string) => {
    setBusy(true);
    try {
      await fn();
      toast.success(ok);
      onChange();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(
      `${window.location.origin}/e/${experience.slug}`,
    );
    toast.success("Share link copied");
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong group flex flex-col overflow-hidden rounded-3xl"
    >
      {/* cover */}
      <button
        onClick={open}
        className={cn(
          "relative flex h-36 items-center justify-center bg-gradient-to-br text-5xl",
          meta.gradient,
        )}
      >
        <span className="drop-shadow-lg">{meta.emoji}</span>
        {!shared && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              void run(
                () => setFavorite(experience.id, !experience.favorite),
                experience.favorite ? "Removed from favorites" : "Added to favorites",
              );
            }}
            className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-black/25 backdrop-blur transition hover:bg-black/40"
          >
            <Star
              className={cn(
                "size-4",
                experience.favorite
                  ? "fill-[#ffd76b] text-[#ffd76b]"
                  : "text-white",
              )}
            />
          </span>
        )}
      </button>

      {/* body */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <button onClick={open} className="min-w-0 text-left">
            <h3 className="truncate font-semibold">{experience.title}</h3>
            <p className="mt-0.5 truncate text-xs text-[var(--wv-muted)]">
              {meta.label}
              {experience.recipient.name ? ` · for ${experience.recipient.name}` : ""}
            </p>
          </button>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                disabled={busy}
                className="focus-ring flex size-8 shrink-0 items-center justify-center rounded-lg text-[var(--wv-muted)] transition hover:bg-[rgb(var(--glass-tint)/0.1)]"
                aria-label="Actions"
              >
                <MoreHorizontal className="size-4" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={6}
                className="glass-strong z-[130] w-48 rounded-2xl p-1.5 text-sm"
              >
                <Item icon={Pencil} label="Edit" onSelect={open} />
                <Item icon={Eye} label="Preview" onSelect={preview} />
                <Item icon={Link2} label="Copy share link" onSelect={copyLink} />
                {!shared && (
                  <>
                    <Item
                      icon={Copy}
                      label="Duplicate"
                      onSelect={() =>
                        user &&
                        run(
                          () =>
                            duplicateExperience(
                              experience,
                              user.uid,
                              profile?.displayName ?? "",
                            ),
                          "Duplicated",
                        )
                      }
                    />
                    {experience.status !== "published" ? (
                      <Item
                        icon={Globe}
                        label="Publish"
                        onSelect={() =>
                          run(() => setStatus(experience.id, "published"), "Published")
                        }
                      />
                    ) : (
                      <Item
                        icon={RotateCcw}
                        label="Unpublish"
                        onSelect={() =>
                          run(() => setStatus(experience.id, "draft"), "Moved to drafts")
                        }
                      />
                    )}
                    {experience.status !== "archived" ? (
                      <Item
                        icon={Archive}
                        label="Archive"
                        onSelect={() =>
                          run(() => setStatus(experience.id, "archived"), "Archived")
                        }
                      />
                    ) : (
                      <Item
                        icon={RotateCcw}
                        label="Restore"
                        onSelect={() =>
                          run(() => setStatus(experience.id, "draft"), "Restored")
                        }
                      />
                    )}
                    <div className="my-1 h-px bg-[rgb(var(--glass-tint)/0.12)]" />
                    <Item
                      icon={Trash2}
                      label="Delete"
                      danger
                      onSelect={() =>
                        run(() => deleteExperience(experience.id), "Deleted")
                      }
                    />
                  </>
                )}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs">
          <span className={cn("font-medium capitalize", STATUS_BADGE[experience.status])}>
            {shared ? "Shared" : experience.status}
          </span>
          <span className="text-[var(--wv-muted)]">
            {relativeTime(experience.updatedAt)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function Item({
  icon: Icon,
  label,
  onSelect,
  danger,
}: {
  icon: typeof Star;
  label: string;
  onSelect: () => void;
  danger?: boolean;
}) {
  return (
    <DropdownMenu.Item
      onSelect={onSelect}
      className={cn(
        "focus-ring flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 outline-none data-[highlighted]:bg-[rgb(var(--glass-tint)/0.1)]",
        danger && "text-[var(--wv-danger)]",
      )}
    >
      <Icon className="size-4" /> {label}
    </DropdownMenu.Item>
  );
}
