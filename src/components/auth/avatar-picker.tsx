"use client";

import { useRef, useState } from "react";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { motion } from "framer-motion";
import { Upload, Check, Loader2 } from "lucide-react";
import { storage } from "@/lib/firebase/firestore";
import { toast } from "@/components/providers/toast";
import { cn } from "@/lib/utils";

const PALETTES = [
  ["#6d8bff", "#9d7bff"],
  ["#74e6ff", "#4c6bff"],
  ["#b17bff", "#6ff0ff"],
  ["#5b8def", "#46e6a3"],
  ["#ff6f9d", "#9d7bff"],
  ["#ffcf5c", "#ff6f9d"],
];

function orbSvg(seed: number): string {
  const [a, b] = PALETTES[seed % PALETTES.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
    <defs><radialGradient id="g" cx="35%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
      <stop offset="40%" stop-color="${a}"/>
      <stop offset="100%" stop-color="${b}"/>
    </radialGradient></defs>
    <rect width="96" height="96" rx="26" fill="${b}"/>
    <circle cx="48" cy="48" r="34" fill="url(#g)"/>
    <circle cx="36" cy="34" r="8" fill="#ffffff" opacity="0.5"/>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const GENERATED = Array.from({ length: 6 }, (_, i) => orbSvg(i));

export function AvatarPicker({
  uid,
  value,
  onChange,
}: {
  uid: string;
  value: string | null;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image too large", "Please choose an image under 4 MB.");
      return;
    }
    setUploading(true);
    try {
      const path = `avatars/${uid}/${Date.now()}-${file.name}`;
      const r = storageRef(storage, path);
      await uploadBytes(r, file);
      const url = await getDownloadURL(r);
      onChange(url);
      toast.success("Photo uploaded");
    } catch {
      toast.error("Upload failed", "Try again in a moment.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {GENERATED.map((src) => {
          const selected = value === src;
          return (
            <button
              key={src}
              type="button"
              onClick={() => onChange(src)}
              className={cn(
                "relative size-14 overflow-hidden rounded-2xl border-2 transition",
                selected
                  ? "border-[var(--wv-primary)]"
                  : "border-transparent hover:border-[rgb(var(--glass-tint)/0.3)]",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="size-full object-cover" />
              {selected && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/30"
                >
                  <Check className="size-5 text-white" />
                </motion.span>
              )}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="glass flex size-14 items-center justify-center rounded-2xl transition hover:brightness-110"
          aria-label="Upload photo"
        >
          {uploading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <Upload className="size-5" />
          )}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFile}
        />
      </div>
      <p className="text-xs text-[var(--wv-muted)]">
        Pick a starlit avatar or upload your own (max 4 MB).
      </p>
    </div>
  );
}
