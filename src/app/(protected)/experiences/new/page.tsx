"use client";

import { LiquidBackground } from "@/components/brand/liquid-background";
import { LoadingOverlay } from "@/components/auth/loading-overlay";
import { Logo } from "@/components/brand/logo";
import { CreateWizard } from "@/components/experiences/create-wizard";
import { useRequireAuth } from "@/hooks/use-require-auth";

export default function NewExperiencePage() {
  const { loading, isAuthenticated } = useRequireAuth({ requireOnboarded: true });

  if (loading || !isAuthenticated) {
    return <LoadingOverlay show label="Loading…" />;
  }

  return (
    <div className="relative min-h-dvh">
      <LiquidBackground droplets />
      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-4xl flex-col px-5 py-8 sm:py-12">
        <header className="mb-10 flex justify-center">
          <Logo size={36} />
        </header>
        <CreateWizard />
      </div>
    </div>
  );
}
