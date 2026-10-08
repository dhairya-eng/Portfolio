// Simple in-memory, fixed-window rate limiter keyed by client IP.
//
// CAVEATS (by design, this is a speed bump, not a wall):
// - State lives in the memory of a single serverless instance. It resets on
//   every cold start, and parallel instances (and the separate /api/chat and
//   /api/match functions) each keep their own counters.
// - The real backstop against abuse is the monthly spend limit configured on
//   the Anthropic API key. Always keep that set.

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 20; // per IP per window
const MAX_TRACKED_IPS = 5000; // keep memory bounded

const hits = new Map(); // ip -> { count, resetAt }

export function getClientIp(req) {
  // On Vercel, x-forwarded-for is set by the platform; the first entry is the client.
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress || "unknown";
}

function prune(now) {
  for (const [ip, entry] of hits) {
    if (entry.resetAt <= now) hits.delete(ip);
  }
}

// Returns { ok, remaining, retryAfterSec }.
export function rateLimit(req) {
  const now = Date.now();
  if (hits.size > MAX_TRACKED_IPS) prune(now);

  const ip = getClientIp(req);
  let entry = hits.get(ip);
  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + WINDOW_MS };
    hits.set(ip, entry);
  }

  entry.count += 1;
  const ok = entry.count <= MAX_REQUESTS;
  return {
    ok,
    remaining: Math.max(0, MAX_REQUESTS - entry.count),
    retryAfterSec: Math.ceil((entry.resetAt - now) / 1000),
  };
}

// Convenience: applies the limit and writes a 429 if exceeded. Returns true if blocked.
export function rejectIfLimited(req, res) {
  const result = rateLimit(req);
  res.setHeader("X-RateLimit-Remaining", String(result.remaining));
  if (!result.ok) {
    res.setHeader("Retry-After", String(result.retryAfterSec));
    res.status(429).json({ error: "Rate limit reached. Please try again later." });
    return true;
  }
  return false;
}
