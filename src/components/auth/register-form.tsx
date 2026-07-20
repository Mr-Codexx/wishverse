"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useAnimationControls } from "framer-motion";
import { UserRound, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldError } from "@/components/ui/field-error";
import { PasswordInput } from "./password-input";
import { PasswordStrength } from "./password-strength";
import { UsernameChecker } from "./username-checker";
import { GoogleButton } from "./google-button";
import { registerSchema, type RegisterValues } from "@/lib/validations/auth";
import { registerUser, loginWithGoogle } from "@/lib/auth-actions";
import { friendlyAuthError } from "@/lib/errors";
import { toast } from "@/components/providers/toast";

export function RegisterForm() {
  const router = useRouter();
  const shake = useAnimationControls();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [usernameFree, setUsernameFree] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: {
      displayName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
      acceptPrivacy: false,
    },
  });

  const password = watch("password");

  const onSubmit = async (values: RegisterValues) => {
    if (!usernameFree) {
      shake.start({ x: [0, -8, 8, -4, 4, 0], transition: { duration: 0.4 } });
      toast.error("Pick another username", "That handle isn't available.");
      return;
    }
    try {
      await registerUser(values);
      toast.success("Account created", "Check your inbox to verify your email.");
      router.replace("/verify-email");
    } catch (err) {
      shake.start({ x: [0, -10, 10, -6, 6, 0], transition: { duration: 0.4 } });
      toast.error("Couldn't create account", friendlyAuthError(err));
    }
  };

  const onGoogle = async () => {
    setGoogleLoading(true);
    try {
      const { isNew } = await loginWithGoogle();
      router.replace(isNew ? "/onboarding" : "/dashboard");
    } catch (err) {
      toast.error("Google sign-up failed", friendlyAuthError(err));
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
        <Label htmlFor="displayName">Display name</Label>
        <div className="relative">
          <UserRound className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--wv-muted)]" />
          <Input
            id="displayName"
            placeholder="Ada Lovelace"
            className="px-10"
            invalid={!!errors.displayName}
            {...register("displayName")}
          />
        </div>
        <FieldError message={errors.displayName?.message} />
      </div>

      <div className="space-y-1.5" data-anim="field">
        <Label htmlFor="username">Username</Label>
        <Controller
          control={control}
          name="username"
          render={({ field }) => (
            <UsernameChecker
              id="username"
              placeholder="adalove"
              value={field.value}
              onChange={(e) =>
                field.onChange(e.target.value.toLowerCase().replace(/\s/g, ""))
              }
              onBlur={field.onBlur}
              onAvailabilityChange={setUsernameFree}
            />
          )}
        />
        <FieldError message={errors.username?.message} />
      </div>

      <div className="space-y-1.5" data-anim="field">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--wv-muted)]" />
          <Input
            id="email"
            type="email"
            placeholder="you@wishverse.app"
            autoComplete="email"
            className="px-10"
            invalid={!!errors.email}
            {...register("email")}
          />
        </div>
        <FieldError message={errors.email?.message} />
      </div>

      <div className="space-y-1.5" data-anim="field">
        <Label htmlFor="password">Password</Label>
        <PasswordInput
          id="password"
          placeholder="Create a strong password"
          autoComplete="new-password"
          invalid={!!errors.password}
          {...register("password")}
        />
        <FieldError message={errors.password?.message} />
        <PasswordStrength password={password} />
      </div>

      <div className="space-y-1.5" data-anim="field">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <PasswordInput
          id="confirmPassword"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          invalid={!!errors.confirmPassword}
          {...register("confirmPassword")}
        />
        <FieldError message={errors.confirmPassword?.message} />
      </div>

      <div className="space-y-2.5 pt-1" data-anim="field">
        <Controller
          control={control}
          name="acceptTerms"
          render={({ field }) => (
            <label className="flex cursor-pointer items-start gap-2.5 text-sm text-[var(--wv-muted)]">
              <Checkbox
                checked={field.value}
                onCheckedChange={(v) => field.onChange(Boolean(v))}
                className="mt-0.5"
              />
              <span>
                I agree to the{" "}
                <Link href="/terms" className="text-[var(--wv-accent)] hover:underline">
                  Terms of Service
                </Link>
              </span>
            </label>
          )}
        />
        <FieldError message={errors.acceptTerms?.message} />
        <Controller
          control={control}
          name="acceptPrivacy"
          render={({ field }) => (
            <label className="flex cursor-pointer items-start gap-2.5 text-sm text-[var(--wv-muted)]">
              <Checkbox
                checked={field.value}
                onCheckedChange={(v) => field.onChange(Boolean(v))}
                className="mt-0.5"
              />
              <span>
                I accept the{" "}
                <Link href="/privacy" className="text-[var(--wv-accent)] hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>
          )}
        />
        <FieldError message={errors.acceptPrivacy?.message} />
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        loading={isSubmitting}
        data-anim="field"
      >
        Create account
      </Button>

      <div className="flex items-center gap-3 py-1" data-anim="field">
        <span className="h-px flex-1 bg-[rgb(var(--glass-tint)/0.14)]" />
        <span className="text-xs text-[var(--wv-muted)]">or</span>
        <span className="h-px flex-1 bg-[rgb(var(--glass-tint)/0.14)]" />
      </div>

      <div data-anim="field">
        <GoogleButton onClick={onGoogle} loading={googleLoading} label="Sign up with Google" />
      </div>

      <p className="pt-2 text-center text-sm text-[var(--wv-muted)]" data-anim="field">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-[var(--wv-accent)] hover:underline">
          Sign in
        </Link>
      </p>
    </motion.form>
  );
}
