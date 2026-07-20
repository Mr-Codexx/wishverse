"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Loader2, ShieldCheck, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { listAllUsers, adminUpdateUser } from "@/lib/firebase/users";
import type { UserProfile, UserRole, UserPlan, UserStatus } from "@/types/user";
import { toast } from "@/components/providers/toast";
import { initials, cn } from "@/lib/utils";

const ROLES: UserRole[] = ["user", "moderator", "admin"];
const PLANS: UserPlan[] = ["free", "pro", "studio"];
const STATUSES: UserStatus[] = ["active", "suspended", "pending"];

const STATUS_STYLE: Record<UserStatus, string> = {
  active: "text-[var(--wv-success)]",
  suspended: "text-[var(--wv-danger)]",
  pending: "text-[var(--wv-warning)]",
};

export function AdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [savingUid, setSavingUid] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setUsers(await listAllUsers());
    } catch {
      toast.error("Couldn't load users", "Check your admin permissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return users;
    return users.filter(
      (u) =>
        u.username.toLowerCase().includes(term) ||
        u.displayName.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term),
    );
  }, [users, q]);

  const update = async (
    uid: string,
    patch: Partial<Pick<UserProfile, "role" | "plan" | "status">>,
  ) => {
    setSavingUid(uid);
    setUsers((prev) => prev.map((u) => (u.uid === uid ? { ...u, ...patch } : u)));
    try {
      await adminUpdateUser(uid, patch);
      toast.success("User updated");
    } catch {
      toast.error("Update failed", "Reverting change.");
      void load();
    } finally {
      setSavingUid(null);
    }
  };

  return (
    <div className="glass-strong rounded-3xl p-5 sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-5 text-[var(--wv-violet)]" />
          <h2 className="text-lg font-semibold">Users</h2>
          <span className="glass rounded-full px-2.5 py-0.5 text-xs text-[var(--wv-muted)]">
            {filtered.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--wv-muted)]" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search users…"
              className="h-10 w-56 pl-9"
            />
          </div>
          <button
            onClick={load}
            className="glass focus-ring flex size-10 items-center justify-center rounded-xl transition hover:brightness-110"
            aria-label="Refresh"
          >
            <RefreshCw className="size-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-[var(--wv-muted)]">
          <Loader2 className="size-5 animate-spin" /> Loading users…
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-sm text-[var(--wv-muted)]">
          No users found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="text-left text-xs text-[var(--wv-muted)]">
                <th className="px-3 py-2 font-medium">User</th>
                <th className="px-3 py-2 font-medium">Role</th>
                <th className="px-3 py-2 font-medium">Plan</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Verified</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr
                  key={u.uid}
                  className="border-t border-[rgb(var(--glass-tint)/0.08)]"
                >
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <span className="droplet flex size-9 items-center justify-center overflow-hidden text-xs font-bold">
                        {u.photoURL ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={u.photoURL} alt="" className="size-full object-cover" />
                        ) : (
                          initials(u.displayName)
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{u.displayName}</p>
                        <p className="truncate text-xs text-[var(--wv-muted)]">
                          @{u.username} · {u.email}
                        </p>
                      </div>
                      {savingUid === u.uid && (
                        <Loader2 className="size-4 animate-spin text-[var(--wv-muted)]" />
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <SelectCell
                      value={u.role}
                      options={ROLES}
                      onChange={(v) => update(u.uid, { role: v as UserRole })}
                    />
                  </td>
                  <td className="px-3 py-3">
                    <SelectCell
                      value={u.plan}
                      options={PLANS}
                      onChange={(v) => update(u.uid, { plan: v as UserPlan })}
                    />
                  </td>
                  <td className="px-3 py-3">
                    <SelectCell
                      value={u.status}
                      className={STATUS_STYLE[u.status]}
                      options={STATUSES}
                      onChange={(v) => update(u.uid, { status: v as UserStatus })}
                    />
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={cn(
                        "text-xs",
                        u.verified ? "text-[var(--wv-success)]" : "text-[var(--wv-muted)]",
                      )}
                    >
                      {u.verified ? "Verified" : "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SelectCell({
  value,
  options,
  onChange,
  className,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "focus-ring rounded-lg border border-[rgb(var(--glass-tint)/0.14)] bg-[rgb(var(--glass-tint)/0.05)] px-2.5 py-1.5 text-xs capitalize outline-none",
        className,
      )}
    >
      {options.map((o) => (
        <option key={o} value={o} className="bg-[var(--wv-bg-soft)] capitalize">
          {o}
        </option>
      ))}
    </select>
  );
}
