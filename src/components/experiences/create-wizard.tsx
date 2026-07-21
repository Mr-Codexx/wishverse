"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2, Globe, Lock, Link2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EVENT_TYPES, EVENT_TYPE_MAP } from "@/lib/experiences/event-types";
import { THEMES, type ThemeId } from "@/lib/constants";
import { createExperience } from "@/lib/firebase/experiences";
import { useAuth } from "@/hooks/use-auth";
import { useThemeStore } from "@/store/theme-store";
import { toast } from "@/components/providers/toast";
import type { EventType, ExperiencePrivacy } from "@/types/experience";
import { cn } from "@/lib/utils";

const PRIVACY: { id: ExperiencePrivacy; label: string; hint: string; icon: typeof Globe }[] = [
  { id: "public", label: "Public", hint: "Anyone can discover and view", icon: Globe },
  { id: "unlisted", label: "Unlisted", hint: "Only people with the link", icon: Link2 },
  { id: "private", label: "Private", hint: "Only you, until you share", icon: Lock },
];

const STEPS = ["Occasion", "Details", "Theme", "Privacy", "Review"];

export function CreateWizard() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const setTheme = useThemeStore((s) => s.setTheme);

  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [creating, setCreating] = useState(false);

  const [eventType, setEventType] = useState<EventType | null>(null);
  const [title, setTitle] = useState("");
  const [recipient, setRecipient] = useState("");
  const [relationship, setRelationship] = useState("");
  const [theme, setThemeChoice] = useState<ThemeId | null>(null);
  const [targetDate, setTargetDate] = useState("");
  const [privacy, setPrivacy] = useState<ExperiencePrivacy>("unlisted");

  const meta = eventType ? EVENT_TYPE_MAP[eventType] : null;
  const go = (n: number) => {
    setDir(n > step ? 1 : -1);
    setStep(Math.max(0, Math.min(STEPS.length - 1, n)));
  };

  const canNext =
    (step === 0 && eventType) ||
    (step === 1 && title.trim().length > 1) ||
    step === 2 ||
    step === 3 ||
    step === 4;

  const pickEvent = (id: EventType) => {
    setEventType(id);
    if (!title) setTitle(`${EVENT_TYPE_MAP[id].label} celebration`);
    setThemeChoice((t) => t ?? EVENT_TYPE_MAP[id].defaultTheme);
    go(1);
  };

  const create = async () => {
    if (!user || !eventType) return;
    setCreating(true);
    try {
      const id = await createExperience({
        ownerUid: user.uid,
        ownerName: profile?.displayName ?? "",
        title,
        eventType,
        recipient: { name: recipient, relationship },
        theme: theme ?? meta?.defaultTheme,
        targetDate: targetDate || null,
        privacy,
      });
      if (theme) setTheme(theme);
      toast.success("Experience created", "Opening the editor…");
      router.replace(`/experience/${id}/edit`);
    } catch {
      toast.error("Couldn't create experience", "Please try again.");
      setCreating(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* progress */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-xs text-[var(--wv-muted)]">
          <span>{STEPS[step]}</span>
          <span>{step + 1} / {STEPS.length}</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[rgb(var(--glass-tint)/0.12)]">
          <motion.div
            className="h-full rounded-full bg-[var(--wv-primary)]"
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 26 }}
          />
        </div>
      </div>

      <div className="relative min-h-[320px]">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.28 }}
          >
            {step === 0 && (
              <div>
                <h2 className="mb-1 font-[family-name:var(--font-display)] text-2xl font-bold">
                  What are we celebrating?
                </h2>
                <p className="mb-5 text-sm text-[var(--wv-muted)]">
                  Pick an occasion to start with a tailored canvas.
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {EVENT_TYPES.map((e) => (
                    <button
                      key={e.id}
                      onClick={() => pickEvent(e.id)}
                      className={cn(
                        "glass group relative overflow-hidden rounded-2xl p-4 text-left transition hover:brightness-110",
                        eventType === e.id && "ring-2 ring-[var(--wv-primary)]",
                      )}
                    >
                      <div
                        className={cn(
                          "mb-3 flex size-11 items-center justify-center rounded-xl bg-gradient-to-br text-2xl",
                          e.gradient,
                        )}
                      >
                        {e.emoji}
                      </div>
                      <p className="font-medium">{e.label}</p>
                      <p className="mt-0.5 text-xs text-[var(--wv-muted)]">{e.tagline}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h2 className="mb-1 font-[family-name:var(--font-display)] text-2xl font-bold">
                    The essentials
                  </h2>
                  <p className="text-sm text-[var(--wv-muted)]">
                    You can change any of this later in the editor.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="title">Experience title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Maya's 25th Birthday"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="recipient">Who is it for?</Label>
                    <Input
                      id="recipient"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder="Recipient's name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="rel">Relationship</Label>
                    <Input
                      id="rel"
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                      placeholder="Friend, partner, mom…"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="mb-1 font-[family-name:var(--font-display)] text-2xl font-bold">
                  Choose a universe
                </h2>
                <p className="mb-5 text-sm text-[var(--wv-muted)]">
                  Set the mood. Themes affect colors and ambient motion.
                </p>
                <div className="grid gap-3">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setThemeChoice(t.id as ThemeId)}
                      className={cn(
                        "glass flex items-center justify-between rounded-2xl p-4 text-left transition",
                        (theme ?? meta?.defaultTheme) === t.id &&
                          "ring-2 ring-[var(--wv-primary)]",
                      )}
                    >
                      <span>
                        <span className="block font-medium">{t.label}</span>
                        <span className="text-xs text-[var(--wv-muted)]">{t.hint}</span>
                      </span>
                      {(theme ?? meta?.defaultTheme) === t.id && (
                        <Check className="size-5 text-[var(--wv-accent)]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h2 className="mb-1 font-[family-name:var(--font-display)] text-2xl font-bold">
                    Date & privacy
                  </h2>
                  <p className="text-sm text-[var(--wv-muted)]">
                    Add a countdown and decide who can see it.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="date">Event date (optional)</Label>
                  <Input
                    id="date"
                    type="datetime-local"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  {PRIVACY.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPrivacy(p.id)}
                      className={cn(
                        "glass flex items-center gap-3 rounded-2xl p-4 text-left transition",
                        privacy === p.id && "ring-2 ring-[var(--wv-primary)]",
                      )}
                    >
                      <p.icon className="size-5 text-[var(--wv-accent)]" />
                      <span>
                        <span className="block font-medium">{p.label}</span>
                        <span className="text-xs text-[var(--wv-muted)]">{p.hint}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && meta && (
              <div>
                <h2 className="mb-1 font-[family-name:var(--font-display)] text-2xl font-bold">
                  Ready to build
                </h2>
                <p className="mb-5 text-sm text-[var(--wv-muted)]">
                  We&apos;ll open the editor with a starter canvas you can shape.
                </p>
                <div className="glass-strong space-y-3 rounded-3xl p-6">
                  <Row label="Occasion" value={`${meta.emoji} ${meta.label}`} />
                  <Row label="Title" value={title} />
                  <Row label="For" value={recipient || "—"} />
                  <Row
                    label="Theme"
                    value={THEMES.find((t) => t.id === (theme ?? meta.defaultTheme))?.label ?? "—"}
                  />
                  <Row
                    label="Countdown"
                    value={targetDate ? new Date(targetDate).toLocaleString() : "None"}
                  />
                  <Row label="Privacy" value={privacy} />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => (step === 0 ? router.push("/home") : go(step - 1))}
        >
          <ArrowLeft className="size-4" /> {step === 0 ? "Cancel" : "Back"}
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={() => go(step + 1)} disabled={!canNext}>
            Continue <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button onClick={create} loading={creating}>
            {creating ? "Creating…" : "Create & open editor"}
            {!creating && <ArrowRight className="size-4" />}
          </Button>
        )}
      </div>

      {creating && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-[var(--wv-muted)]">
          <Loader2 className="size-4 animate-spin" /> Preparing your canvas…
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-[var(--wv-muted)]">{label}</span>
      <span className="truncate font-medium capitalize">{value}</span>
    </div>
  );
}
