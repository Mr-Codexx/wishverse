"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./use-auth";

interface Options {
  redirectTo?: string;
  requireVerified?: boolean;
  requireOnboarded?: boolean;
  requireAdmin?: boolean;
}

/** Guard a client route: redirect guests (or unqualified users) away. */
export function useRequireAuth(options: Options = {}) {
  const {
    redirectTo = "/login",
    requireVerified = false,
    requireOnboarded = false,
    requireAdmin = false,
  } = options;
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (auth.loading) return;
    if (!auth.isAuthenticated) {
      router.replace(redirectTo);
      return;
    }
    if (requireAdmin && !auth.isAdmin) {
      router.replace("/dashboard");
      return;
    }
    if (requireVerified && !auth.isVerified) {
      router.replace("/verify-email");
      return;
    }
    if (requireOnboarded && auth.needsOnboarding) {
      router.replace("/onboarding");
    }
  }, [auth, requireAdmin, requireVerified, requireOnboarded, redirectTo, router]);

  return auth;
}
