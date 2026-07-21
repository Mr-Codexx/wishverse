"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, RotateCcw } from "lucide-react";
import type { BlockProps } from "@/types/experience";
import { cn } from "@/lib/utils";

export function QuizBlock({
  props,
  interactive = true,
}: {
  props: BlockProps;
  interactive?: boolean;
}) {
  const questions = props.questions ?? [];
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  if (questions.length === 0) {
    return <p className="text-sm text-[var(--wv-muted)]">Add quiz questions in the inspector.</p>;
  }

  const q = questions[Math.min(idx, questions.length - 1)];

  const choose = (i: number) => {
    if (!interactive || picked !== null) return;
    setPicked(i);
    if (i === q.answerIndex) setScore((s) => s + 1);
    setTimeout(() => {
      if (idx + 1 >= questions.length) setDone(true);
      else {
        setIdx((v) => v + 1);
        setPicked(null);
      }
    }, 900);
  };

  const reset = () => {
    setIdx(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="glass-strong mx-auto max-w-md rounded-3xl p-8 text-center">
        <p className="text-gradient text-5xl font-bold">{pct}%</p>
        <p className="mt-2 text-[var(--wv-muted)]">
          You got {score} of {questions.length} right.
        </p>
        <button
          onClick={reset}
          className="glass mt-5 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm"
        >
          <RotateCcw className="size-4" /> Play again
        </button>
      </div>
    );
  }

  return (
    <div className="glass-strong mx-auto max-w-md rounded-3xl p-6 text-left">
      {props.text && (
        <p className="mb-1 text-xs uppercase tracking-wide text-[var(--wv-accent)]">
          {props.text}
        </p>
      )}
      <p className="mb-4 text-xs text-[var(--wv-muted)]">
        Question {idx + 1} of {questions.length}
      </p>
      <h4 className="mb-4 text-lg font-semibold">{q.question}</h4>
      <div className="grid gap-2.5">
        {q.options.map((opt, i) => {
          const isAnswer = i === q.answerIndex;
          const isPicked = picked === i;
          const reveal = picked !== null;
          return (
            <motion.button
              key={i}
              whileTap={{ scale: interactive ? 0.98 : 1 }}
              onClick={() => choose(i)}
              className={cn(
                "glass flex items-center justify-between rounded-xl px-4 py-3 text-left text-sm transition",
                reveal && isAnswer && "ring-2 ring-[var(--wv-success)]",
                reveal && isPicked && !isAnswer && "ring-2 ring-[var(--wv-danger)]",
              )}
            >
              {opt}
              {reveal && isAnswer && (
                <Check className="size-4 text-[var(--wv-success)]" />
              )}
              {reveal && isPicked && !isAnswer && (
                <X className="size-4 text-[var(--wv-danger)]" />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
