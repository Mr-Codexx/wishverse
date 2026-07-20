"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app/app-shell";
import { AdminUsers } from "@/components/admin/admin-users";
import { listAllUsers } from "@/lib/firebase/users";
import type { UserProfile } from "@/types/user";
import { Users, ShieldCheck, BadgeCheck, Crown } from "lucide-react";

export default function AdminPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    listAllUsers().then(setUsers).catch(() => void 0);
  }, []);

  const stats = [
    { label: "Total users", value: users.length, icon: Users },
    {
      label: "Verified",
      value: users.filter((u) => u.verified).length,
      icon: BadgeCheck,
    },
    {
      label: "Admins",
      value: users.filter((u) => u.role === "admin").length,
      icon: ShieldCheck,
    },
    {
      label: "Paid plans",
      value: users.filter((u) => u.plan !== "free").length,
      icon: Crown,
    },
  ];

  return (
    <AppShell requireAdmin>
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
          Admin
        </h1>
        <p className="mt-1.5 text-[var(--wv-muted)]">
          Manage members, roles, and access across WishVerse.
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="glass-strong rounded-3xl p-5">
            <div className="droplet mb-4 flex size-10 items-center justify-center">
              <s.icon className="size-5 text-[var(--wv-violet)]" />
            </div>
            <p className="text-3xl font-bold">{s.value}</p>
            <p className="text-sm text-[var(--wv-muted)]">{s.label}</p>
          </div>
        ))}
      </div>

      <AdminUsers />
    </AppShell>
  );
}
