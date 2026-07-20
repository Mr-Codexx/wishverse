"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ShieldCheck, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/field-error";
import { PasswordInput } from "./password-input";
import { PasswordStrength } from "./password-strength";
import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from "@/lib/validations/auth";
import { verifyResetCode, confirmReset } from "@/lib/firebase/auth";
import { friendlyAuthError } from "@/lib/errors";
import { toast } from "@/components/providers/toast";

export function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const oobCode = params.get("oobCode") ?? "";

  const [state, setState] = useState<"checking" | "valid" | "invalid" | "done">(
    "checking",
  );
  const [email, setEmail] = useState<string>("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });
  const password = watch("password");

  useEffect(() => {
    if (!oobCode) {
      setState("invalid");
      return;
    }
    verifyResetCode(oobCode)
      .then((mail) => {
        setEmail(mail);
        setState("valid");
      })
      .catch(() => setState("invalid"));
  }, [oobCode]);

  const onSubmit = async ({ password }: ResetPasswordValues) => {
    try {
      await confirmReset(oobCode, password);
      setState("done");
      toast.success("Password updated", "You can sign in now.");
      setTimeout(() => router.replace("/login"), 1600);
    } catch (err) {
      toast.error("Couldn't reset password", friendlyAuthError(err));
    }
  };

  if (state === "checking") {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-[var(--wv-muted)]">
        <Loader2 className="size-6 animate-spin" />
        <p className="text-sm">Verifying your reset link…</p>
      </div>
    );
  }

  if (state === "invalid") {
    return (
      <div className="space-y-5 text-center">
        <p className="text-sm text-[var(--wv-muted)]">
          This reset link is invalid or has expired.
        </p>
        <Button asChild variant="glass" className="w-full">
          <Link href="/forgot-password">Request a new link</Link>
        </Button>
      </div>
    );
  }

  if (state === "done") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-4 py-6 text-center"
      >
        <div className="droplet mx-auto flex size-16 items-center justify-center">
          <ShieldCheck className="size-7 text-[var(--wv-success)]" />
        </div>
        <p className="text-sm text-[var(--wv-muted)]">
          Password updated. Redirecting to sign in…
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {email && (
        <p className="text-sm text-[var(--wv-muted)]">
          Resetting password for <span className="text-[var(--wv-fg)]">{email}</span>
        </p>
      )}
      <div className="space-y-1.5">
        <Label htmlFor="password">New password</Label>
        <PasswordInput
          id="password"
          placeholder="Create a new password"
          autoComplete="new-password"
          invalid={!!errors.password}
          {...register("password")}
        />
        <FieldError message={errors.password?.message} />
        <PasswordStrength password={password} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <PasswordInput
          id="confirmPassword"
          placeholder="Re-enter new password"
          autoComplete="new-password"
          invalid={!!errors.confirmPassword}
          {...register("confirmPassword")}
        />
        <FieldError message={errors.confirmPassword?.message} />
      </div>
      <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
        Update password
      </Button>
    </form>
  );
}
