"use client";

import { motion } from "framer-motion";
import { Starfield } from "./starfield";

/** Floating water droplets — real liquid lens elements with refraction. */
function Droplets() {
  const drops = [
    { top: "14%", left: "10%", size: 90, delay: 0 },
    { top: "68%", left: "16%", size: 56, delay: 1.2 },
    { top: "24%", left: "82%", size: 120, delay: 0.6 },
    { top: "76%", left: "78%", size: 72, delay: 2 },
    { top: "48%", left: "48%", size: 40, delay: 1.6 },
    { top: "8%", left: "58%", size: 34, delay: 0.3 },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {drops.map((d, i) => (
        <motion.div
          key={i}
          className="droplet absolute"
          style={{ top: d.top, left: d.left, width: d.size, height: d.size }}
          animate={{ y: [0, -18, 0], x: [0, 8, 0] }}
          transition={{
            duration: 7 + i,
            delay: d.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function LiquidBackground({ droplets = true }: { droplets?: boolean }) {
  return (
    <div className="aurora-bg" aria-hidden>
      {/* SVG refraction filter available app-wide */}
      <svg className="absolute h-0 w-0">
        <filter id="wv-liquid">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="2" seed="7" result="noise">
            <animate
              attributeName="baseFrequency"
              dur="26s"
              values="0.012 0.02;0.016 0.014;0.012 0.02"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="14" />
        </filter>
      </svg>

      {/* animated gradient blobs */}
      <motion.div
        className="blob"
        style={{ width: 520, height: 520, top: "-8%", left: "-6%", background: "var(--glow-1)" }}
        animate={{ scale: [1, 1.15, 1], x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="blob"
        style={{ width: 460, height: 460, bottom: "-10%", right: "-4%", background: "var(--glow-2)" }}
        animate={{ scale: [1, 1.2, 1], x: [0, -30, 0], y: [0, 30, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="blob"
        style={{ width: 380, height: 380, top: "40%", left: "55%", background: "var(--glow-3)" }}
        animate={{ scale: [1, 1.1, 1], x: [0, 20, 0], y: [0, -20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <Starfield />
      {droplets && <Droplets />}
    </div>
  );
}
