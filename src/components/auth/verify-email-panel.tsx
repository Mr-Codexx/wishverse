"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MailCheck, RefreshCw, LogOut, BadgeCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { auth, sendVerification } from "@/lib/firebase/auth";
import { setVerified } from "@/lib/firebase/users";
import { logout } from "@/lib/auth-actions";
import { useAuth } from "@/hooks/use-auth";
import { useAuthStore } from "@/store/auth-store";
import { friendlyAuthError } from "@/lib/errors";
import { toast } from "@/components/providers/toast";
import { RESEND_COOLDOWN_SECONDS } from "@/lib/constants";

export function VerifyEmailPanel() {
  const router = useRouter();
  const { user } = useAuth();
  const patchProfile = useAuthStore((s) => s.patchProfile);
  const [cooldown, setCooldown] = useState(0);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const checkVerified = useCallback(async () => {
    if (!auth.currentUser) return;
    await auth.currentUser.reload();
    if (auth.currentUser.emailVerified) {
      await setVerified(auth.currentUser.uid, true);
      patchProfile({ verified: true });
      toast.success("Email verified", "Welcome aboard!");
      router.replace("/onboarding");
    }
  }, [patchProfile, router]);

  // Poll for verification while the user is on this page.
  useEffect(() => {
    const id = setInterval(() => void checkVerified(), 5000);
    return () => clearInterval(id);
  }, [checkVerified]);

  const resend = async () => {
    if (!auth.currentUser || cooldown > 0) return;
    try {
      await sendVerification(auth.currentUser);
      setCooldown(RESEND_COOLDOWN_SECONDS);
      toast.success("Verification sent", "Check your inbox and spam folder.");
    } catch (err) {
      toast.error("Couldn't send email", friendlyAuthError(err));
    }
  };

  const manualCheck = async () => {
    setChecking(true);
    await checkVerified();
    setTimeout(() => setChecking(false), 600);
    if (auth.currentUser && !auth.currentUser.emailVerified) {
      toast.info("Not verified yet", "Click the link in your email first.");
    }
  };

  return (
    <div className="space-y-6 text-center">
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="droplet mx-auto flex size-20 items-center justify-center"
      >
        <MailCheck className="size-9 text-[var(--wv-accent)]" />
      </motion.div>

      <div>
        <p className="text-sm text-[var(--wv-muted)]">
          We sent a verification link to
        </p>
        <p className="font-medium">{user?.email ?? "your email"}</p>
      </div>

      <div className="glass flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm text-[var(--wv-muted)]">
        <BadgeCheck className="size-4 text-[var(--wv-warning)]" />
        Waiting for verification…
      </div>

      <div className="space-y-3">
        <Button className="w-full" onClick={manualCheck} loading={checking}>
          I've verified my email
        </Button>
        <Button
          variant="glass"
          className="w-full"
          onClick={resend}
          disabled={cooldown > 0}
        >
          <RefreshCw className="size-4" />
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend verification email"}
        </Button>
        <Button
          variant="ghost"
          className="w-full text-[var(--wv-muted)]"
          onClick={async () => {
            await logout();
            router.replace("/login");
          }}
        >
          <LogOut className="size-4" /> Use a different account
        </Button>
      </div>
    </div>
  );
}
