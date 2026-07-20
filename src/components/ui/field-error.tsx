"use client";

import { AnimatePresence, motion } from "framer-motion";

export function FieldError({ message }: { message?: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          initial={{ opacity: 0, y: -4, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -4, height: 0 }}
          className="text-xs text-[var(--wv-danger)]"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
