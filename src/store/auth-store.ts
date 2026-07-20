import { create } from "zustand";
import type { FirebaseUser } from "@/lib/firebase/auth";
import type { UserProfile, AuthProviderId } from "@/types/user";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthState {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  token: string | null;
  provider: AuthProviderId | null;
  status: AuthStatus;
  loading: boolean;

  setUser: (user: FirebaseUser | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setToken: (token: string | null) => void;
  setStatus: (status: AuthStatus) => void;
  setLoading: (loading: boolean) => void;
  patchProfile: (patch: Partial<UserProfile>) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  token: null,
  provider: null,
  status: "loading",
  loading: true,

  setUser: (user) =>
    set({
      user,
      provider: (user?.providerData[0]?.providerId as AuthProviderId) ?? null,
    }),
  setProfile: (profile) => set({ profile }),
  setToken: (token) => set({ token }),
  setStatus: (status) => set({ status, loading: status === "loading" }),
  setLoading: (loading) => set({ loading }),
  patchProfile: (patch) =>
    set((s) => ({ profile: s.profile ? { ...s.profile, ...patch } : s.profile })),
  reset: () =>
    set({
      user: null,
      profile: null,
      token: null,
      provider: null,
      status: "unauthenticated",
      loading: false,
    }),
}));
