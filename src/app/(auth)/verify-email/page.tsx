import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { VerifyEmailPanel } from "@/components/auth/verify-email-panel";

export const metadata: Metadata = { title: "Verify email" };

export default function VerifyEmailPage() {
  return (
    <AuthShell title="Verify your email" subtitle="One quick step to secure your account.">
      <VerifyEmailPanel />
    </AuthShell>
  );
}
