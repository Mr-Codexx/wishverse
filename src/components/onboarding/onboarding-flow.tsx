"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Globe,
  Cake,
  MapPin,
  Palette,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AvatarPicker } from "@/components/auth/avatar-picker";
import { LogoMark } from "@/components/brand/logo";
import { useAuth } from "@/hooks/use-auth";
import { useAuthStore } from "@/store/auth-store";
import { useThemeStore } from "@/store/theme-store";
import { markOnboarded } from "@/lib/firebase/users";
import { setDisplayName as fbSetDisplayName, auth } from "@/lib/firebase/auth";
import { toast } from "@/components/providers/toast";
import { friendlyAuthError } from "@/lib/errors";
import { THEMES, COUNTRIES, PLANS, type ThemeId } from "@/lib/constants";
import { guessTimezone, initials } from "@/lib/utils";
import { cn } from "@/lib/utils";

const STEPS = ["Welcome", "Avatar", "About you", "Theme", "Plan", "Ready"] as const;

export function OnboardingFlow() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const patchProfile = useAuthStore((s) => s.patchProfile);
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [saving, setSaving] = useState(false);

  const [photoURL, setPhotoURL] = useState<string | null>(
    profile?.photoURL ?? user?.photoURL ?? null,
  );
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [birthday, setBirthday] = useState(profile?.birthday ?? "");
  const [country, setCountry] = useState(profile?.country ?? "");
  const [timezone] = useState(profile?.timezone ?? guessTimezone());
  const [plan, setPlan] = useState<(typeof PLANS)[number]["id"]>(
    profile?.plan ?? "free",
  );

  const progress = useMemo(() => ((step + 1) / STEPS.length) * 100, [step]);
  const go = (n: number) => {
    setDir(n > step ? 1 : -1);
    setStep(Math.max(0, Math.min(STEPS.length - 1, n)));
  };

  const finish = async () => {
    if (!user) return;
    setSaving(true);
    try {
      if (photoURL && auth.currentUser) {
        await fbSetDisplayName(
          auth.currentUser,
          auth.currentUser.displayName ?? profile?.displayName ?? "",
          photoURL,
        );
      }
      await markOnboarded(user.uid, {
        photoURL,
        bio,
        birthday: birthday || null,
        country: country || null,
        timezone,
        theme,
        plan,
      });
      patchProfile({
        photoURL,
        bio,
        birthday: birthday || null,
        country: country || null,
        timezone,
        theme,
        plan,
        onboarded: true,
      });
      document.cookie = `wishverse_onboarded=1; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      toast.success("You're all set", "Welcome to WishVerse.");
      router.replace("/dashboard");
    } catch (err) {
      toast.error("Couldn't save profile", friendlyAuthError(err));
      setSaving(false);
    }
  };

  return (
    <div className="glass-strong liquid-sheen w-full max-w-lg overflow-hidden rounded-3xl p-7 sm:p-9">
      {/* progress */}
      <div className="mb-7">
        <div className="mb-2 flex items-center justify-between text-xs text-[var(--wv-muted)]">
          <span>{STEPS[step]}</span>
          <span>
            {step + 1} / {STEPS.length}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[rgb(var(--glass-tint)/0.12)]">
          <motion.div
            className="h-full rounded-full bg-[var(--wv-primary)]"
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 26 }}
          />
        </div>
      </div>

      <div className="relative min-h-[280px]">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.3 }}
          >
            {step === 0 && (
              <div className="space-y-4 py-4 text-center">
                <motion.div
                  animate={{ rotate: [0, 8, -8, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                  className="mx-auto w-fit"
                >
                  <LogoMark size={72} />
                </motion.div>
                <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold">
                  Welcome{profile?.displayName ? `, ${profile.displayName.split(" ")[0]}` : ""}!
                </h2>
                <p className="mx-auto max-w-sm text-sm text-[var(--wv-muted)]">
                  Let&apos;s make WishVerse yours. A few quick steps and you&apos;ll be
                  ready to create unforgettable experiences.
                </p>
              </div>
            )}

            {step === 1 && user && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="size-5 text-[var(--wv-accent)]" />
                  <h2 className="text-lg font-semibold">Choose your look</h2>
                </div>
                <div className="flex items-center gap-4">
                  <div className="droplet flex size-20 items-center justify-center overflow-hidden text-xl font-bold">
                    {photoURL ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photoURL} alt="" className="size-full object-cover" />
                    ) : (
                      initials(profile?.displayName ?? "★")
                    )}
                  </div>
                  <p className="text-sm text-[var(--wv-muted)]">
                    This is how you&apos;ll appear across WishVerse.
                  </p>
                </div>
                <AvatarPicker uid={user.uid} value={photoURL} onChange={setPhotoURL} />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Globe className="size-5 text-[var(--wv-accent)]" />
                  <h2 className="text-lg font-semibold">A little about you</h2>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value.slice(0, 240))}
                    placeholder="Dreamer, builder, star-chaser…"
                    rows={3}
                    className="focus-ring w-full resize-none rounded-xl border border-[rgb(var(--glass-tint)/0.14)] bg-[rgb(var(--glass-tint)/0.05)] px-4 py-3 text-sm placeholder:text-[var(--wv-muted)] focus:border-[var(--wv-ring)]"
                  />
                  <p className="text-right text-xs text-[var(--wv-muted)]">{bio.length}/240</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="birthday" className="flex items-center gap-1.5">
                      <Cake className="size-3.5" /> Birthday
                    </Label>
                    <Input
                      id="birthday"
                      type="date"
                      value={birthday}
                      onChange={(e) => setBirthday(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="country" className="flex items-center gap-1.5">
                      <MapPin className="size-3.5" /> Country
                    </Label>
                    <select
                      id="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="focus-ring h-11 w-full rounded-xl border border-[rgb(var(--glass-tint)/0.14)] bg-[rgb(var(--glass-tint)/0.05)] px-3 text-sm focus:border-[var(--wv-ring)]"
                    >
                      <option value="">Select…</option>
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c} className="bg-[var(--wv-bg-soft)]">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <p className="text-xs text-[var(--wv-muted)]">
                  Timezone detected: {timezone}
                </p>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Palette className="size-5 text-[var(--wv-accent)]" />
                  <h2 className="text-lg font-semibold">Pick your universe</h2>
                </div>
                <div className="grid gap-3">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTheme(t.id as ThemeId)}
                      className={cn(
                        "glass flex items-center justify-between rounded-2xl p-4 text-left transition",
                        theme === t.id && "ring-2 ring-[var(--wv-primary)]",
                      )}
                    >
                      <span>
                        <span className="block font-medium">{t.label}</span>
                        <span className="text-xs text-[var(--wv-muted)]">{t.hint}</span>
                      </span>
                      {theme === t.id && (
                        <Check className="size-5 text-[var(--wv-accent)]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="size-5 text-[var(--wv-accent)]" />
                  <h2 className="text-lg font-semibold">Choose a plan</h2>
                </div>
                <div className="grid gap-3">
                  {PLANS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPlan(p.id)}
                      className={cn(
                        "glass flex items-center justify-between rounded-2xl p-4 text-left transition",
                        plan === p.id && "ring-2 ring-[var(--wv-primary)]",
                      )}
                    >
                      <span>
                        <span className="block font-medium">{p.label}</span>
                        <span className="text-xs text-[var(--wv-muted)]">{p.tagline}</span>
                      </span>
                      {plan === p.id && <Check className="size-5 text-[var(--wv-accent)]" />}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-[var(--wv-muted)]">
                  You can change this anytime in settings.
                </p>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4 py-4 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 14 }}
                  className="droplet mx-auto flex size-20 items-center justify-center"
                >
                  <Check className="size-9 text-[var(--wv-success)]" strokeWidth={3} />
                </motion.div>
                <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold">
                  You&apos;re ready
                </h2>
                <p className="mx-auto max-w-sm text-sm text-[var(--wv-muted)]">
                  Your WishVerse is set up. Let&apos;s start creating.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* nav */}
      <div className="mt-8 flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          onClick={() => go(step - 1)}
          disabled={step === 0}
          className={cn(step === 0 && "invisible")}
        >
          <ArrowLeft className="size-4" /> Back
        </Button>

        {step < STEPS.length - 1 ? (
          <div className="flex items-center gap-2">
            {step > 0 && step < 5 && (
              <Button variant="link" onClick={() => go(STEPS.length - 1)}>
                Skip
              </Button>
            )}
            <Button onClick={() => go(step + 1)}>
              Continue <ArrowRight className="size-4" />
            </Button>
          </div>
        ) : (
          <Button onClick={finish} loading={saving}>
            Enter WishVerse <ArrowRight className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
