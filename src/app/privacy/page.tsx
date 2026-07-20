import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <Link href="/"><Logo /></Link>
      <h1 className="mt-10 font-[family-name:var(--font-display)] text-3xl font-bold">
        Privacy Policy
      </h1>
      <p className="mt-4 text-[var(--wv-muted)]">
        Replace this placeholder with your organisation&apos;s Privacy Policy
        before launch.
      </p>
    </div>
  );
}
