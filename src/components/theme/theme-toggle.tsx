"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Palette, Check } from "lucide-react";
import { useThemeStore } from "@/store/theme-store";
import { THEMES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            "glass focus-ring flex size-11 items-center justify-center rounded-xl transition hover:brightness-110",
            className,
          )}
          aria-label="Change theme"
        >
          <Palette className="size-5" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={10}
          className="glass-strong z-[110] w-56 rounded-2xl p-1.5"
        >
          <p className="px-3 py-2 text-xs font-medium text-[var(--wv-muted)]">
            Theme
          </p>
          {THEMES.map((t) => (
            <DropdownMenu.Item
              key={t.id}
              onSelect={() => setTheme(t.id)}
              className="focus-ring flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm outline-none transition data-[highlighted]:bg-[rgb(var(--glass-tint)/0.1)]"
            >
              <span className="flex flex-col">
                <span className="font-medium">{t.label}</span>
                <span className="text-xs text-[var(--wv-muted)]">{t.hint}</span>
              </span>
              {theme === t.id && (
                <Check className="size-4 text-[var(--wv-accent)]" />
              )}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
