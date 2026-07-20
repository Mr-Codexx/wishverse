import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { CompleteProfileForm } from "@/components/auth/complete-profile-form";

export const metadata: Metadata = { title: "Complete profile" };

export default function CompleteProfilePage() {
  return (
    <AuthShell title="Complete your profile" subtitle="Add the finishing touches.">
      <CompleteProfileForm />
    </AuthShell>
  );
}
