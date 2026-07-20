"use client";

import { useEffect } from "react";
import { onAuthStateChanged, onIdTokenChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/auth";
import { getUserProfile, setVerified } from "@/lib/firebase/users";
import { useAuthStore } from "@/store/auth-store";
import { SESSION_COOKIE, ONBOARDED_COOKIE } from "@/lib/constants";

function writeCookie(name: string, value: string, maxAgeSeconds: number) {
  if (typeof document === "undefined") return;
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${value}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}
function clearCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setProfile, setToken, setStatus, reset } = useAuthStore();

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        clearCookie(SESSION_COOKIE);
        clearCookie(ONBOARDED_COOKIE);
        reset();
        return;
      }

      setUser(fbUser);
      setStatus("loading");

      try {
        const token = await fbUser.getIdToken();
        setToken(token);
        writeCookie(SESSION_COOKIE, token, 60 * 60 * 24 * 7);

        const profile = await getUserProfile(fbUser.uid);
        if (profile) {
          if (fbUser.emailVerified && !profile.verified) {
            void setVerified(fbUser.uid, true);
            profile.verified = true;
          }
          setProfile(profile);
          writeCookie(
            ONBOARDED_COOKIE,
            profile.onboarded ? "1" : "0",
            60 * 60 * 24 * 7,
          );
        } else {
          setProfile(null);
        }
      } catch {
        setProfile(null);
      } finally {
        setStatus("authenticated");
      }
    });

    // Keep the session cookie fresh as Firebase rotates the ID token.
    const unsubToken = onIdTokenChanged(auth, async (fbUser) => {
      if (!fbUser) return;
      const token = await fbUser.getIdToken();
      setToken(token);
      writeCookie(SESSION_COOKIE, token, 60 * 60 * 24 * 7);
    });

    // Belt-and-braces periodic refresh (~ every 50 minutes).
    const interval = setInterval(
      () => {
        if (auth.currentUser) void auth.currentUser.getIdToken(true);
      },
      50 * 60 * 1000,
    );

    return () => {
      unsubAuth();
      unsubToken();
      clearInterval(interval);
    };
  }, [setUser, setProfile, setToken, setStatus, reset]);

  return <>{children}</>;
}
