"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  LayoutDashboard,
  Sparkles,
  Settings,
  Shield,
  LogOut,
  User,
  Wand2,
} from "lucide-react";

import { LiquidBackground } from "@/components/brand/liquid-background";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { LoadingOverlay } from "@/components/auth/loading-overlay";
import { AiCompanion } from "@/components/ai/ai-companion";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { logout } from "@/lib/auth-actions";
import { initials, cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/wishes", label: "Wishes", icon: Sparkles },
  { href: "/dashboard/aura", label: "Aura AI", icon: Wand2 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function AppShell({
  children,
  requireAdmin = false,
}: {
  children: React.ReactNode;
  requireAdmin?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { loading, isAuthenticated, isAdmin, profile } = useRequireAuth({
    requireAdmin,
    requireOnboarded: !requireAdmin,
  });

  if (loading || !isAuthenticated) {
    return <LoadingOverlay show label="Loading your universe…" />;
  }

  return (
    <div className="relative min-h-dvh">
      <LiquidBackground droplets={false} />

      <div className="relative z-10 flex min-h-dvh w-full">
        {/* sidebar */}
        <aside className="glass sticky top-0 hidden h-dvh w-64 shrink-0 flex-col gap-2 rounded-r-3xl p-5 xl:w-72 lg:flex">
          <div className="mb-6 px-2">
            <Logo size={34} />
          </div>
          <nav className="flex flex-1 flex-col gap-1">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
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
            {isAdmin && (
              <Link
                href="/admin"
                className={cn(
                  "mt-1 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition",
                  pathname.startsWith("/admin")
                    ? "bg-[var(--wv-violet)] text-white"
                    : "text-[var(--wv-muted)] hover:bg-[rgb(var(--glass-tint)/0.08)] hover:text-[var(--wv-fg)]",
                )}
              >
                <Shield className="size-[18px]" />
                Admin
              </Link>
            )}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* header */}
          <header className="glass sticky top-0 z-20 flex items-center justify-between gap-3 rounded-b-3xl px-5 py-3.5">
            <div className="lg:hidden">
              <Logo size={30} showWordmark={false} />
            </div>
            <div className="ml-auto flex items-center gap-2.5">
              <ThemeToggle />
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="focus-ring flex items-center gap-2.5 rounded-xl p-1 pr-3 transition hover:bg-[rgb(var(--glass-tint)/0.08)]">
                    <span className="droplet flex size-9 items-center justify-center overflow-hidden text-sm font-bold">
                      {profile?.photoURL ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={profile.photoURL} alt="" className="size-full object-cover" />
                      ) : (
                        initials(profile?.displayName ?? "★")
                      )}
                    </span>
                    <span className="hidden text-left sm:block">
                      <span className="block text-sm font-medium leading-tight">
                        {profile?.displayName}
                      </span>
                      <span className="block text-xs text-[var(--wv-muted)]">
                        @{profile?.username}
                      </span>
                    </span>
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    align="end"
                    sideOffset={10}
                    className="glass-strong z-[110] w-56 rounded-2xl p-1.5"
                  >
                    <DropdownMenu.Item
                      onSelect={() => router.push("/dashboard/settings")}
                      className="focus-ring flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm outline-none data-[highlighted]:bg-[rgb(var(--glass-tint)/0.1)]"
                    >
                      <User className="size-4" /> Profile & settings
                    </DropdownMenu.Item>
                    {isAdmin && (
                      <DropdownMenu.Item
                        onSelect={() => router.push("/admin")}
                        className="focus-ring flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm outline-none data-[highlighted]:bg-[rgb(var(--glass-tint)/0.1)]"
                      >
                        <Shield className="size-4" /> Admin panel
                      </DropdownMenu.Item>
                    )}
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
            </div>
          </header>

          <main className="flex-1 p-5 sm:p-8 xl:px-10">{children}</main>
        </div>
      </div>

      <AiCompanion />
    </div>
  );
}
