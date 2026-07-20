import { cn } from "@/lib/utils";

/** The WishVerse star mark — a crystalline shooting star inside an orbital ring. */
export function LogoMark({
  className,
  size = 40,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="wv-star" x1="16" y1="10" x2="48" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EAF2FF" />
          <stop offset="0.45" stopColor="#8FB4FF" />
          <stop offset="1" stopColor="#6D6BFF" />
        </linearGradient>
        <linearGradient id="wv-ring" x1="6" y1="40" x2="58" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9D7BFF" />
          <stop offset="0.5" stopColor="#5B8DEF" />
          <stop offset="1" stopColor="#74E6FF" />
        </linearGradient>
        <radialGradient id="wv-glow" cx="0.5" cy="0.5" r="0.5">
          <stop stopColor="#6D8BFF" stopOpacity="0.7" />
          <stop offset="1" stopColor="#6D8BFF" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="32" cy="32" r="30" fill="url(#wv-glow)" />

      {/* orbital ring / comet trail */}
      <path
        d="M9 41c9 8 30 9 44-3 5-4 6-9 2-11-3-1.5-7 0-7 0"
        stroke="url(#wv-ring)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />

      {/* star */}
      <path
        d="M32 12l5.4 12.9L51 26.4l-9.8 9.1 2.6 13.4L32 42.6l-11.8 6.3 2.6-13.4L13 26.4l13.6-1.5L32 12z"
        fill="url(#wv-star)"
        stroke="#EAF2FF"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
      {/* specular highlight on star */}
      <path d="M32 17l3 7-7 4 4-11z" fill="#FFFFFF" opacity="0.55" />

      {/* sparkles */}
      <circle cx="52" cy="16" r="1.4" fill="#EAF2FF" />
      <circle cx="14" cy="20" r="1" fill="#EAF2FF" opacity="0.8" />
      <circle cx="48" cy="46" r="1" fill="#74E6FF" opacity="0.8" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-[family-name:var(--font-display)] text-xl font-bold tracking-tight",
        className,
      )}
    >
      Wish<span className="text-gradient">Verse</span>
    </span>
  );
}

export function Logo({
  className,
  size = 36,
  showWordmark = true,
}: {
  className?: string;
  size?: number;
  showWordmark?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark size={size} />
      {showWordmark && <Wordmark />}
    </div>
  );
}
