"use client";

import { AppShell } from "@/components/app/app-shell";
import { AdminUsers } from "@/components/admin/admin-users";

export default function AdminUsersPage() {
  return (
    <AppShell requireAdmin>
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
          Members
        </h1>
        <p className="mt-1.5 text-[var(--wv-muted)]">
          Full directory with role, plan, and status controls.
        </p>
      </div>
      <AdminUsers />
    </AppShell>
  );
}
