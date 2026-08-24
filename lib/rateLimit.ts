// In-memory only — resets on server restart and doesn't share state across
// serverless instances. Fine for a v1 single-instance deploy; swap for a real
// store (e.g. Upstash Redis) if this needs to hold up under real traffic.
const WINDOW_MS = 5 * 60 * 1000;
const MAX_REQUESTS = 8;

const requestLog = new Map<string, number[]>();

export function checkRateLimit(key: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const timestamps = (requestLog.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= MAX_REQUESTS) {
    const retryAfterMs = WINDOW_MS - (now - timestamps[0]);
    requestLog.set(key, timestamps);
    return { allowed: false, retryAfterSeconds: Math.ceil(retryAfterMs / 1000) };
  }

  timestamps.push(now);
  requestLog.set(key, timestamps);
  return { allowed: true };
}
