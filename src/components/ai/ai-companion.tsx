"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X, Maximize2 } from "lucide-react";
import Link from "next/link";

import { AiChat } from "./ai-chat";
import { AuraMark } from "./aura-mark";
import { AI_NAME } from "@/lib/ai/prompts";

export function AiCompanion() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // The dedicated studio page already hosts Aura full-screen.
  if (pathname?.startsWith("/dashboard/aura")) return null;

  return (
    <>
      {/* launcher */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setOpen(true)}
            aria-label={`Open ${AI_NAME}`}
            className="glass-strong focus-ring fixed bottom-6 right-6 z-[90] flex items-center gap-2.5 rounded-full py-2.5 pl-2.5 pr-4 shadow-2xl"
          >
            <span className="droplet flex size-9 items-center justify-center">
              <AuraMark size={24} />
            </span>
            <span className="hidden text-sm font-medium sm:block">Ask {AI_NAME}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* panel */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[95] bg-black/30 backdrop-blur-sm sm:bg-transparent sm:backdrop-blur-0"
            />
            <motion.div
              initial={{ x: "100%", opacity: 0.6 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.6 }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="glass-strong fixed inset-y-0 right-0 z-[100] flex w-full flex-col p-4 sm:inset-y-4 sm:right-4 sm:w-[420px] sm:rounded-3xl"
            >
              <header className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="droplet flex size-9 items-center justify-center">
                    <AuraMark size={24} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold leading-tight">{AI_NAME}</p>
                    <p className="text-xs text-[var(--wv-muted)]">WishVerse AI</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Link
                    href="/dashboard/aura"
                    onClick={() => setOpen(false)}
                    aria-label="Open full studio"
                    className="focus-ring flex size-9 items-center justify-center rounded-xl text-[var(--wv-muted)] transition hover:bg-[rgb(var(--glass-tint)/0.1)]"
                  >
                    <Maximize2 className="size-4" />
                  </Link>
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="focus-ring flex size-9 items-center justify-center rounded-xl text-[var(--wv-muted)] transition hover:bg-[rgb(var(--glass-tint)/0.1)]"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </header>
              <AiChat />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
