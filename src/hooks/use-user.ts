"use client";

import { useAuthStore } from "@/store/auth-store";

/** Convenience hook for the current user's profile document. */
export function useUser() {
  const profile = useAuthStore((s) => s.profile);
  const patchProfile = useAuthStore((s) => s.patchProfile);
  return { profile, patchProfile };
}
