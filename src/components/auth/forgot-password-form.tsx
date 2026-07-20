"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail, MailCheck, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/field-error";
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "@/lib/validations/auth";
import { requestPasswordReset } from "@/lib/firebase/auth";
import { friendlyAuthError } from "@/lib/errors";
import { toast } from "@/components/providers/toast";

export function ForgotPasswordForm() {
  const [sent, setSent] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async ({ email }: ForgotPasswordValues) => {
    try {
      await requestPasswordReset(email);
      setSent(email);
    } catch (err) {
      toast.error("Couldn't send reset link", friendlyAuthError(err));
    }
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-5 text-center"
      >
        <div className="droplet mx-auto flex size-16 items-center justify-center">
          <MailCheck className="size-7 text-[var(--wv-accent)]" />
        </div>
        <div>
          <p className="text-sm text-[var(--wv-muted)]">
            If an account exists for
          </p>
          <p className="font-medium">{sent}</p>
          <p className="mt-1 text-sm text-[var(--wv-muted)]">
            we've sent a link to reset your password.
          </p>
        </div>
        <Button asChild variant="glass" className="w-full">
          <Link href="/login">
            <ArrowLeft className="size-4" /> Back to sign in
          </Link>
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5" data-anim="field">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--wv-muted)]" />
          <Input
            id="email"
            type="email"
            placeholder="you@wishverse.app"
            className="px-10"
            invalid={!!errors.email}
            {...register("email")}
          />
        </div>
        <FieldError message={errors.email?.message} />
      </div>

      <Button type="submit" size="lg" className="w-full" loading={isSubmitting} data-anim="field">
        Send reset link
      </Button>

      <p className="pt-1 text-center text-sm text-[var(--wv-muted)]" data-anim="field">
        Remembered it?{" "}
        <Link href="/login" className="font-medium text-[var(--wv-accent)] hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
