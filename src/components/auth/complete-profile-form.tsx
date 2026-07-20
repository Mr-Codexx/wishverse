"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Cake, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AvatarPicker } from "./avatar-picker";
import { useAuth } from "@/hooks/use-auth";
import { useAuthStore } from "@/store/auth-store";
import { useThemeStore } from "@/store/theme-store";
import { markOnboarded } from "@/lib/firebase/users";
import { toast } from "@/components/providers/toast";
import { friendlyAuthError } from "@/lib/errors";
import { COUNTRIES, THEMES, type ThemeId } from "@/lib/constants";
import { guessTimezone } from "@/lib/utils";

export function CompleteProfileForm() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const patchProfile = useAuthStore((s) => s.patchProfile);
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  const [photoURL, setPhotoURL] = useState<string | null>(profile?.photoURL ?? null);
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [birthday, setBirthday] = useState(profile?.birthday ?? "");
  const [country, setCountry] = useState(profile?.country ?? "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const patch = {
        photoURL,
        bio,
        birthday: birthday || null,
        country: country || null,
        timezone: guessTimezone(),
        theme,
      };
      await markOnboarded(user.uid, patch);
      patchProfile({ ...patch, onboarded: true });
      toast.success("Profile saved");
      router.replace("/dashboard");
    } catch (err) {
      toast.error("Couldn't save", friendlyAuthError(err));
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>Profile photo</Label>
        <AvatarPicker uid={user.uid} value={photoURL} onChange={setPhotoURL} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bio">Bio</Label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value.slice(0, 240))}
          rows={3}
          placeholder="Tell people who you are"
          className="focus-ring w-full resize-none rounded-xl border border-[rgb(var(--glass-tint)/0.14)] bg-[rgb(var(--glass-tint)/0.05)] px-4 py-3 text-sm placeholder:text-[var(--wv-muted)] focus:border-[var(--wv-ring)]"
        />
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

      <div className="space-y-1.5">
        <Label>Theme</Label>
        <div className="grid grid-cols-3 gap-2">
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTheme(t.id as ThemeId)}
              className={`glass rounded-xl px-3 py-2.5 text-sm transition ${
                theme === t.id ? "ring-2 ring-[var(--wv-primary)]" : ""
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <Button className="w-full" size="lg" onClick={save} loading={saving}>
        Save and continue
      </Button>
    </div>
  );
}
