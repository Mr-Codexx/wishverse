"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Home,
  LayoutGrid,
  FileText,
  Globe,
  Star,
  Archive,
  Users,
  Plus,
  LogOut,
  Settings,
  Sparkles,
} from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth-actions";
import { useAuth } from "@/hooks/use-auth";
import { initials, cn } from "@/lib/utils";

export type WorkspaceKey =
  | "home"
  | "all"
  | "drafts"
  | "published"
  | "favorites"
  | "archived"
  | "shared";

const NAV: { key: WorkspaceKey; label: string; href: string; icon: typeof Home }[] = [
  { key: "home", label: "Home", href: "/home", icon: Home },
  { key: "all", label: "My Experiences", href: "/experiences", icon: LayoutGrid },
  { key: "drafts", label: "Drafts", href: "/experiences?filter=drafts", icon: FileText },
  { key: "published", label: "Published", href: "/experiences?filter=published", icon: Globe },
  { key: "favorites", label: "Favorites", href: "/experiences?filter=favorites", icon: Star },
  { key: "archived", label: "Archived", href: "/experiences?filter=archived", icon: Archive },
  { key: "shared", label: "Shared With Me", href: "/experiences?filter=shared", icon: Users },
];

export function WorkspaceSidebar({
  activeKey,
  onNavigate,
}: {
  activeKey?: WorkspaceKey;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const { profile } = useAuth();

  return (
    <div className="flex h-full flex-col p-5">
      <div className="mb-6 px-1">
        <Logo size={34} />
      </div>

      <Button
        className="mb-5 w-full justify-center"
        size="lg"
        onClick={() => {
          onNavigate?.();
          router.push("/experiences/new");
        }}
      >
        <Plus className="size-4" /> Create Experience
      </Button>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {NAV.map((item) => {
          const active = item.key === activeKey;
          return (
            <Link
              key={item.key}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition",
                active
                  ? "bg-[var(--wv-primary)] text-[var(--wv-primary-fg)]"
                  : "text-[var(--wv-muted)] hover:bg-[rgb(var(--glass-tint)/0.08)] hover:text-[var(--wv-fg)]",
              )}
            >
              <item.icon className="size-[18px]" />
              {item.label}
            </Link>
          );
        })}

        <Link
          href="/dashboard/aura"
          onClick={onNavigate}
          className="mt-1 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-[var(--wv-muted)] transition hover:bg-[rgb(var(--glass-tint)/0.08)] hover:text-[var(--wv-fg)]"
        >
          <Sparkles className="size-[18px] text-[var(--wv-accent)]" />
          Ask Aura
        </Link>
      </nav>

      {/* user footer */}
      <div className="mt-4 flex items-center gap-2 border-t border-[rgb(var(--glass-tint)/0.1)] pt-4">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="focus-ring flex min-w-0 flex-1 items-center gap-2.5 rounded-xl p-1.5 transition hover:bg-[rgb(var(--glass-tint)/0.08)]">
              <span className="droplet flex size-9 shrink-0 items-center justify-center overflow-hidden text-sm font-bold">
                {profile?.photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.photoURL} alt="" className="size-full object-cover" />
                ) : (
                  initials(profile?.displayName ?? "★")
                )}
              </span>
              <span className="min-w-0 text-left">
                <span className="block truncate text-sm font-medium leading-tight">
                  {profile?.displayName}
                </span>
                <span className="block truncate text-xs text-[var(--wv-muted)]">
                  @{profile?.username}
                </span>
              </span>
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="start"
              sideOffset={8}
              className="glass-strong z-[130] w-52 rounded-2xl p-1.5"
            >
              <DropdownMenu.Item
                onSelect={() => router.push("/dashboard/settings")}
                className="focus-ring flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm outline-none data-[highlighted]:bg-[rgb(var(--glass-tint)/0.1)]"
              >
                <Settings className="size-4" /> Settings
              </DropdownMenu.Item>
              <div className="my-1 h-px bg-[rgb(var(--glass-tint)/0.12)]" />
              <DropdownMenu.Item
                onSelect={async () => {
                  await logout();
                  router.replace("/login");
                }}
                className="focus-ring flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-[var(--wv-danger)] outline-none data-[highlighted]:bg-[rgb(var(--glass-tint)/0.1)]"
              >
                <LogOut className="size-4" /> Sign out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
        <ThemeToggle />
      </div>
    </div>
  );
}
