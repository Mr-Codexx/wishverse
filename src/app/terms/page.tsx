import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <Link href="/"><Logo /></Link>
      <h1 className="mt-10 font-[family-name:var(--font-display)] text-3xl font-bold">
        Terms of Service
      </h1>
      <p className="mt-4 text-[var(--wv-muted)]">
        Replace this placeholder with your organisation&apos;s Terms of Service
        before launch.
      </p>
    </div>
  );
}
