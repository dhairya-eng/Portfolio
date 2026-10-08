// Minimal Anthropic Messages API client (raw fetch, no SDK dependency).
// The API key is read from process.env on the server only and is never logged.

// Note: "claude-haiku-5-5" does not exist; Claude Haiku 4.5 is the current Haiku model.
export const MODEL = "claude-haiku-4-5";

const API_URL = "https://api.anthropic.com/v1/messages";
const TIMEOUT_MS = 25000;

export class UpstreamError extends Error {}

// Sends one Messages API request and returns the concatenated text output.
// Throws UpstreamError on any failure; details go to server logs only.
export async function callClaude({ system, messages, maxTokens }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("[anthropic] ANTHROPIC_API_KEY is not set");
    throw new UpstreamError("missing api key");
  }

  let response;
  try {
    response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, system, messages }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (err) {
    console.error("[anthropic] network error:", err?.name, err?.message);
    throw new UpstreamError("network");
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    console.error(`[anthropic] HTTP ${response.status}:`, body.slice(0, 500));
    throw new UpstreamError(`http ${response.status}`);
  }

  const data = await response.json();
  const text = (data.content || [])
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("")
    .trim();

  if (!text) {
    console.error("[anthropic] empty response, stop_reason:", data.stop_reason);
    throw new UpstreamError("empty");
  }
  return { text, stopReason: data.stop_reason };
}

// Vercel's Node runtime parses JSON bodies, but fall back to manual parsing just in case.
export function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }
  return null;
}
