"use client";

import type { BlockProps } from "@/types/experience";

export function GalleryBlock({ props }: { props: BlockProps }) {
  const images = (props.images ?? []).filter(Boolean);
  if (images.length === 0) {
    return (
      <p className="text-sm text-[var(--wv-muted)]">
        Add image URLs in the inspector to build the gallery.
      </p>
    );
  }
  return (
    <div className="mx-auto grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3">
      {images.map((src, i) => (
        <div
          key={i}
          className="glass aspect-square overflow-hidden rounded-2xl"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" className="size-full object-cover" />
        </div>
      ))}
    </div>
  );
}
