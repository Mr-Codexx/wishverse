"use client";

import { AnimatePresence, motion } from "framer-motion";
import { LogoMark } from "@/components/brand/logo";

export function LoadingOverlay({
  show,
  label = "Just a moment…",
}: {
  show: boolean;
  label?: string;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex flex-col items-center justify-center gap-5 bg-[var(--wv-bg)]/70 backdrop-blur-xl"
        >
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.08, 1] }}
            transition={{
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <LogoMark size={64} />
          </motion.div>
          <p className="text-sm text-[var(--wv-muted)]">{label}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
