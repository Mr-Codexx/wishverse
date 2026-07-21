"use client";

import { motion, type Variants } from "framer-motion";
import type { Block } from "@/types/experience";
import { cn } from "@/lib/utils";

import { CountdownBlock } from "./countdown-block";
import { TimelineBlock } from "./timeline-block";
import { QuizBlock } from "./quiz-block";
import { SpinWheelBlock } from "./spinwheel-block";
import { GalleryBlock } from "./gallery-block";
import { GuestbookBlock } from "./guestbook-block";

const VARIANTS: Record<string, Variants> = {
  none: { hidden: {}, show: {} },
  fade: { hidden: { opacity: 0 }, show: { opacity: 1 } },
  slideUp: { hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0 } },
  slideLeft: { hidden: { opacity: 0, x: 40 }, show: { opacity: 1, x: 0 } },
  zoom: { hidden: { opacity: 0, scale: 0.85 }, show: { opacity: 1, scale: 1 } },
  float: { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } },
};

export function BlockView({
  block,
  interactive = true,
  animate = true,
  experienceId,
}: {
  block: Block;
  interactive?: boolean;
  animate?: boolean;
  experienceId?: string;
}) {
  const { type, props, animation } = block;

  const inner = (() => {
    switch (type) {
      case "heading": {
        const Tag = (`h${props.level ?? 1}`) as "h1" | "h2" | "h3";
        return (
          <Tag
            className="font-[family-name:var(--font-display)] font-bold leading-tight"
            style={{
              fontSize: props.size ?? 44,
              fontWeight: props.weight ?? 700,
              textAlign: props.align ?? "center",
              color: props.color || undefined,
            }}
          >
            {props.text}
          </Tag>
        );
      }
      case "text":
        return (
          <p
            className="mx-auto leading-relaxed text-[var(--wv-muted)]"
            style={{
              fontSize: props.size ?? 18,
              textAlign: props.align ?? "center",
              color: props.color || undefined,
              maxWidth: props.maxWidth ?? 640,
            }}
          >
            {props.text}
          </p>
        );
      case "image":
        return props.url ? (
          <figure className="mx-auto" style={{ maxWidth: props.maxWidth ?? 720 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={props.url}
              alt={props.caption ?? ""}
              className="w-full object-cover"
              style={{ borderRadius: props.radius ?? 24 }}
            />
            {props.caption && (
              <figcaption className="mt-2 text-center text-sm text-[var(--wv-muted)]">
                {props.caption}
              </figcaption>
            )}
          </figure>
        ) : (
          <div className="glass mx-auto flex aspect-video max-w-md items-center justify-center rounded-2xl text-sm text-[var(--wv-muted)]">
            Add an image URL in the inspector
          </div>
        );
      case "button":
        return (
          <div style={{ textAlign: props.align ?? "center" }}>
            <a
              href={interactive ? props.href || "#" : undefined}
              className="bg-[var(--wv-primary)] text-[var(--wv-primary-fg)] inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium shadow-lg transition hover:brightness-110"
            >
              {props.text || "Button"}
            </a>
          </div>
        );
      case "countdown":
        return <CountdownBlock props={props} />;
      case "divider":
        return (
          <hr className="mx-auto w-24 border-0 border-t border-[rgb(var(--glass-tint)/0.25)]" />
        );
      case "spacer":
        return <div style={{ height: props.height ?? 48 }} />;
      case "emoji":
        return (
          <div
            className="text-center leading-none"
            style={{ fontSize: props.size ?? 72 }}
          >
            {props.emoji}
          </div>
        );
      case "gallery":
        return <GalleryBlock props={props} />;
      case "timeline":
        return <TimelineBlock props={props} />;
      case "quiz":
        return <QuizBlock props={props} interactive={interactive} />;
      case "spinwheel":
        return <SpinWheelBlock props={props} interactive={interactive} />;
      case "guestbook":
        return (
          <GuestbookBlock
            props={props}
            experienceId={experienceId}
            interactive={interactive}
          />
        );
      default:
        return null;
    }
  })();

  if (!animate || animation.type === "none") {
    return <div className={cn(type === "spacer" && "pointer-events-none")}>{inner}</div>;
  }

  const floaty = animation.type === "float";

  return (
    <motion.div
      variants={VARIANTS[animation.type] ?? VARIANTS.slideUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: animation.delay ?? 0, ease: "easeOut" }}
    >
      {floaty ? (
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {inner}
        </motion.div>
      ) : (
        inner
      )}
    </motion.div>
  );
}
