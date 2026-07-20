import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your universe"
      subtitle="Join WishVerse and start building unforgettable experiences."
    >
      <RegisterForm />
    </AuthShell>
  );
}
