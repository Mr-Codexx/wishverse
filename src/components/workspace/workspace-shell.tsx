"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

import { LiquidBackground } from "@/components/brand/liquid-background";
import { Logo } from "@/components/brand/logo";
import { LoadingOverlay } from "@/components/auth/loading-overlay";
import { AiCompanion } from "@/components/ai/ai-companion";
import { useRequireAuth } from "@/hooks/use-require-auth";
import {
  WorkspaceSidebar,
  type WorkspaceKey,
} from "./workspace-sidebar";

export function WorkspaceShell({
  children,
  activeKey,
}: {
  children: React.ReactNode;
  activeKey?: WorkspaceKey;
}) {
  const { loading, isAuthenticated } = useRequireAuth({ requireOnboarded: true });
  const [drawer, setDrawer] = useState(false);

  if (loading || !isAuthenticated) {
    return <LoadingOverlay show label="Loading your studio…" />;
  }

  return (
    <div className="relative min-h-dvh">
      <LiquidBackground droplets={false} />

      <div className="relative z-10 flex min-h-dvh">
        {/* desktop sidebar — permanently expanded, fixed 320px */}
        <aside className="glass sticky top-0 hidden h-dvh w-80 shrink-0 lg:block">
          <WorkspaceSidebar activeKey={activeKey} />
        </aside>

        {/* mobile drawer */}
        <AnimatePresence>
          {drawer && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setDrawer(false)}
                className="fixed inset-0 z-[115] bg-black/40 backdrop-blur-sm lg:hidden"
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 280, damping: 30 }}
                className="glass-strong fixed inset-y-0 left-0 z-[120] w-[300px] lg:hidden"
              >
                <WorkspaceSidebar
                  activeKey={activeKey}
                  onNavigate={() => setDrawer(false)}
                />
                <button
                  onClick={() => setDrawer(false)}
                  aria-label="Close menu"
                  className="focus-ring absolute right-3 top-5 flex size-9 items-center justify-center rounded-xl text-[var(--wv-muted)]"
                >
                  <X className="size-5" />
                </button>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* mobile top bar */}
          <header className="glass sticky top-0 z-20 flex items-center justify-between px-4 py-3 lg:hidden">
            <button
              onClick={() => setDrawer(true)}
              aria-label="Open menu"
              className="focus-ring flex size-10 items-center justify-center rounded-xl"
            >
              <Menu className="size-5" />
            </button>
            <Logo size={30} showWordmark={false} />
            <div className="size-10" />
          </header>

          <main className="flex-1">{children}</main>
        </div>
      </div>

      <AiCompanion />
    </div>
  );
}
