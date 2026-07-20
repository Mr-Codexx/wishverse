import type { Metadata } from "next";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";

export const metadata: Metadata = { title: "Get started" };

export default function OnboardingPage() {
  return (
    <OnboardingShell>
      <OnboardingFlow />
    </OnboardingShell>
  );
}
