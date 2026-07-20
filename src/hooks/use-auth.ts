"use client";

import { useAuthStore } from "@/store/auth-store";

/** Access the current auth session (user, profile, status). */
export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const status = useAuthStore((s) => s.status);
  const loading = useAuthStore((s) => s.loading);
  const provider = useAuthStore((s) => s.provider);
  const token = useAuthStore((s) => s.token);

  return {
    user,
    profile,
    provider,
    token,
    status,
    loading,
    isAuthenticated: status === "authenticated",
    isAdmin: profile?.role === "admin",
    isVerified: Boolean(user?.emailVerified),
    needsOnboarding: Boolean(profile && !profile.onboarded),
  };
}
