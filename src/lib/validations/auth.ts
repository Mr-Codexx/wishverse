import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(3, "At least 3 characters")
  .max(20, "At most 20 characters")
  .regex(/^[a-z0-9_.]+$/, "Only a-z, 0-9, underscore and dot")
  .refine((v) => !v.startsWith(".") && !v.endsWith("."), "Can't start or end with a dot")
  .refine((v) => !v.includes(".."), "No consecutive dots");

export const passwordSchema = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[a-z]/, "Add a lowercase letter")
  .regex(/[A-Z]/, "Add an uppercase letter")
  .regex(/[0-9]/, "Add a number")
  .regex(/[^A-Za-z0-9]/, "Add a special character");

export const loginSchema = z.object({
  identifier: z.string().min(1, "Enter your email or username"),
  password: z.string().min(1, "Enter your password"),
  remember: z.boolean().default(true),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    displayName: z.string().min(2, "Tell us your name").max(60),
    username: usernameSchema,
    email: z.string().email("Enter a valid email"),
    password: passwordSchema,
    confirmPassword: z.string(),
    acceptTerms: z
      .boolean()
      .refine((v) => v === true, { message: "You must accept the Terms" }),
    acceptPrivacy: z
      .boolean()
      .refine((v) => v === true, { message: "You must accept the Privacy Policy" }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export type RegisterValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"),
});
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export const completeProfileSchema = z.object({
  bio: z.string().max(240, "Keep it under 240 characters").optional(),
  birthday: z.string().optional(),
  country: z.string().optional(),
  timezone: z.string().optional(),
  theme: z.string().optional(),
});
export type CompleteProfileValues = z.infer<typeof completeProfileSchema>;

/* ---------- password strength ---------- */
export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  checks: { label: string; ok: boolean }[];
}

export function scorePassword(pw: string): PasswordStrength {
  const checks = [
    { label: "8+ characters", ok: pw.length >= 8 },
    { label: "Uppercase", ok: /[A-Z]/.test(pw) },
    { label: "Lowercase", ok: /[a-z]/.test(pw) },
    { label: "Number", ok: /[0-9]/.test(pw) },
    { label: "Special character", ok: /[^A-Za-z0-9]/.test(pw) },
  ];
  const passed = checks.filter((c) => c.ok).length;
  let score: PasswordStrength["score"] = 0;
  if (pw.length === 0) score = 0;
  else if (passed <= 2) score = 1;
  else if (passed === 3) score = 2;
  else if (passed === 4) score = 3;
  else score = 4;
  const labels = ["Empty", "Weak", "Fair", "Good", "Strong"];
  return { score, label: labels[score], checks };
}
