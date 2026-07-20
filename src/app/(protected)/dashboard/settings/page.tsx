"use client";

import { AppShell } from "@/components/app/app-shell";
import { CompleteProfileForm } from "@/components/auth/complete-profile-form";

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
          Settings
        </h1>
        <p className="mt-1.5 text-[var(--wv-muted)]">
          Update your profile, avatar, and theme.
        </p>
      </div>
      <div className="glass-strong max-w-xl rounded-3xl p-6 sm:p-7">
        <CompleteProfileForm />
      </div>
    </AppShell>
  );
}
