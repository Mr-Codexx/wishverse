import "server-only";

/**
 * Lightweight in-memory rate limiter (sliding window) for the AI endpoint.
 * Good enough for a single instance / dev. For multi-instance production,
 * swap the Map for Upstash Redis (INCR + EXPIRE) — same interface.
 */

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 20; // per IP per window

const hits = new Map<string, number[]>();

export interface RateResult {
  ok: boolean;
  remaining: number;
  resetInMs: number;
}

export function rateLimit(key: string): RateResult {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  const timestamps = (hits.get(key) ?? []).filter((t) => t > windowStart);

  if (timestamps.length >= MAX_REQUESTS) {
    const oldest = timestamps[0];
    return { ok: false, remaining: 0, resetInMs: WINDOW_MS - (now - oldest) };
  }

  timestamps.push(now);
  hits.set(key, timestamps);

  // opportunistic cleanup to bound memory
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      const live = v.filter((t) => t > windowStart);
      if (live.length === 0) hits.delete(k);
      else hits.set(k, live);
    }
  }

  return {
    ok: true,
    remaining: MAX_REQUESTS - timestamps.length,
    resetInMs: WINDOW_MS,
  };
}

export function clientKeyFromHeaders(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  const ip = fwd?.split(",")[0]?.trim() || headers.get("x-real-ip") || "anon";
  return ip;
}
