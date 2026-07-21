"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { BlockProps } from "@/types/experience";

const COLORS = ["#6d8bff", "#9d7bff", "#74e6ff", "#ff8fb1", "#ffb36b", "#5b8def"];

export function SpinWheelBlock({
  props,
  interactive = true,
}: {
  props: BlockProps;
  interactive?: boolean;
}) {
  const segments = (props.segments ?? []).filter(Boolean);
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  if (segments.length < 2) {
    return <p className="text-sm text-[var(--wv-muted)]">Add at least two segments in the inspector.</p>;
  }

  const seg = 360 / segments.length;
  const R = 120;
  const C = 130;

  const spin = () => {
    if (!interactive || spinning) return;
    setSpinning(true);
    setResult(null);
    const winner = Math.floor(Math.random() * segments.length);
    const turns = 5 * 360;
    const target = turns + (360 - (winner * seg + seg / 2));
    const next = angle - (angle % 360) + target;
    setAngle(next);
    setTimeout(() => {
      setSpinning(false);
      setResult(segments[winner]);
    }, 4200);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {props.text && <p className="text-[var(--wv-muted)]">{props.text}</p>}
      <div className="relative">
        <div className="absolute -top-1 left-1/2 z-10 -translate-x-1/2 border-x-8 border-t-[16px] border-x-transparent border-t-[var(--wv-fg)]" />
        <motion.svg
          width={C * 2}
          height={C * 2}
          animate={{ rotate: angle }}
          transition={{ duration: 4, ease: [0.16, 1, 0.3, 1] }}
        >
          {segments.map((s, i) => {
            const start = (i * seg - 90) * (Math.PI / 180);
            const end = ((i + 1) * seg - 90) * (Math.PI / 180);
            const x1 = C + R * Math.cos(start);
            const y1 = C + R * Math.sin(start);
            const x2 = C + R * Math.cos(end);
            const y2 = C + R * Math.sin(end);
            const mid = (i * seg + seg / 2 - 90) * (Math.PI / 180);
            const tx = C + R * 0.62 * Math.cos(mid);
            const ty = C + R * 0.62 * Math.sin(mid);
            return (
              <g key={i}>
                <path
                  d={`M${C},${C} L${x1},${y1} A${R},${R} 0 0,1 ${x2},${y2} Z`}
                  fill={COLORS[i % COLORS.length]}
                  opacity={0.9}
                />
                <text
                  x={tx}
                  y={ty}
                  fill="#fff"
                  fontSize="11"
                  fontWeight="600"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${i * seg + seg / 2}, ${tx}, ${ty})`}
                >
                  {s.length > 12 ? s.slice(0, 11) + "…" : s}
                </text>
              </g>
            );
          })}
          <circle cx={C} cy={C} r={R} fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="2" />
          <circle cx={C} cy={C} r="16" fill="#fff" opacity=".9" />
        </motion.svg>
      </div>
      <button
        onClick={spin}
        disabled={spinning}
        className="glass-strong rounded-xl px-6 py-2.5 text-sm font-medium disabled:opacity-50"
      >
        {spinning ? "Spinning…" : "Spin"}
      </button>
      {result && (
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-lg font-semibold"
        >
          🎉 {result}
        </motion.p>
      )}
    </div>
  );
}
