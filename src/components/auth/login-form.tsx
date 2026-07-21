"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useAnimationControls } from "framer-motion";
import { User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldError } from "@/components/ui/field-error";
import { PasswordInput } from "./password-input";
import { GoogleButton } from "./google-button";
import { loginSchema, type LoginValues } from "@/lib/validations/auth";
import { loginWithIdentifier, loginWithGoogle } from "@/lib/auth-actions";
import { friendlyAuthError } from "@/lib/errors";
import { toast } from "@/components/providers/toast";

export function LoginForm() {
  const router = useRouter();
  const shake = useAnimationControls();
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "", remember: true },
  });

  const remember = watch("remember");

  const onSubmit = async (values: LoginValues) => {
    try {
      const user = await loginWithIdentifier(
        values.identifier,
        values.password,
        values.remember,
      );
      toast.success("Welcome back", "You're signed in.");
      router.replace(user.emailVerified ? "/home" : "/verify-email");
    } catch (err) {
      shake.start({ x: [0, -10, 10, -6, 6, 0], transition: { duration: 0.4 } });
      toast.error("Couldn't sign in", friendlyAuthError(err));
    }
  };

  const onGoogle = async () => {
    setGoogleLoading(true);
    try {
      const { isNew } = await loginWithGoogle();
      toast.success("Signed in", "Google account connected.");
      router.replace(isNew ? "/onboarding" : "/home");
    } catch (err) {
      toast.error("Google sign-in failed", friendlyAuthError(err));
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <motion.form
      animate={shake}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
      noValidate
    >
      <div className="space-y-1.5" data-anim="field">
        <Label htmlFor="identifier">Email or username</Label>
        <div className="relative">
          <User className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--wv-muted)]" />
          <Input
            id="identifier"
            placeholder="you@wishverse.app"
            autoComplete="username"
            className="px-10"
            invalid={!!errors.identifier}
            {...register("identifier")}
          />
        </div>
        <FieldError message={errors.identifier?.message} />
      </div>

      <div className="space-y-1.5" data-anim="field">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/forgot-password"
            className="text-xs text-[var(--wv-accent)] transition hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <PasswordInput
          id="password"
          placeholder="••••••••"
          autoComplete="current-password"
          invalid={!!errors.password}
          {...register("password")}
        />
        <FieldError message={errors.password?.message} />
      </div>

      <label
        className="flex cursor-pointer items-center gap-2.5 text-sm text-[var(--wv-muted)]"
        data-anim="field"
      >
        <Checkbox
          checked={remember}
          onCheckedChange={(v) => setValue("remember", Boolean(v))}
        />
        Keep me signed in
      </label>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        loading={isSubmitting}
        data-anim="field"
      >
        Sign in
      </Button>

      <div className="flex items-center gap-3 py-1" data-anim="field">
        <span className="h-px flex-1 bg-[rgb(var(--glass-tint)/0.14)]" />
        <span className="text-xs text-[var(--wv-muted)]">or</span>
        <span className="h-px flex-1 bg-[rgb(var(--glass-tint)/0.14)]" />
      </div>

      <div data-anim="field">
        <GoogleButton onClick={onGoogle} loading={googleLoading} />
      </div>

      <p className="pt-2 text-center text-sm text-[var(--wv-muted)]" data-anim="field">
        New to WishVerse?{" "}
        <Link href="/register" className="font-medium text-[var(--wv-accent)] hover:underline">
          Create an account
        </Link>
      </p>
    </motion.form>
  );
}
