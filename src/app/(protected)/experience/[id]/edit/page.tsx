"use client";

import { useParams, useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

import { EditorWorkspace } from "@/components/editor/editor-workspace";
import { LoadingOverlay } from "@/components/auth/loading-overlay";
import { Button } from "@/components/ui/button";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { useExperience } from "@/hooks/use-experience";
import { useAuth } from "@/hooks/use-auth";

export default function EditExperiencePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id ?? null;

  const { loading: authLoading, isAuthenticated } = useRequireAuth({
    requireOnboarded: true,
  });
  const { user } = useAuth();
  const { experience, loading, notFound } = useExperience(id);

  if (authLoading || !isAuthenticated || loading) {
    return <LoadingOverlay show label="Opening the editor…" />;
  }

  if (notFound || !experience) {
    return (
      <Notice
        title="Experience not found"
        body="It may have been deleted or the link is incorrect."
        onBack={() => router.push("/experiences")}
      />
    );
  }

  if (user && experience.ownerUid !== user.uid) {
    return (
      <Notice
        title="You don't have access"
        body="Only the creator can edit this experience."
        onBack={() => router.push("/home")}
      />
    );
  }

  return <EditorWorkspace initial={experience} />;
}

function Notice({
  title,
  body,
  onBack,
}: {
  title: string;
  body: string;
  onBack: () => void;
}) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="droplet flex size-16 items-center justify-center">
        <AlertCircle className="size-7" />
      </div>
      <div>
        <h1 className="text-xl font-semibold">{title}</h1>
        <p className="mt-1 text-sm text-[var(--wv-muted)]">{body}</p>
      </div>
      <Button onClick={onBack}>Back to experiences</Button>
    </div>
  );
}
