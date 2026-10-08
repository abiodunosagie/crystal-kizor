// Answers POST /api/enquiry and turns the enquiry form into an email. Every
// other request is served from the static export (see wrangler.jsonc).
//
// Configuration (never hard-coded):
//   RESEND_API_KEY  secret, Resend API key
//   ENQUIRY_TO      where enquiries are delivered
//   ENQUIRY_FROM    verified sender, e.g. "Crystal Kizor site <hello@example.com>"
//   ENQUIRY_LIMITER optional Workers rate limiting binding (see wrangler.jsonc)

import { enquiryTopics } from "../src/lib/enquiry-topics";

// Minimal shapes of the Cloudflare bindings used here, so the Worker builds
// without pulling in the full workers type package.
interface AssetFetcher {
  fetch(request: Request): Promise<Response>;
}
interface RateLimiter {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

interface Env {
  ASSETS: AssetFetcher;
  ENQUIRY_LIMITER?: RateLimiter;
  RESEND_API_KEY?: string;
  ENQUIRY_TO?: string;
  ENQUIRY_FROM?: string;
}

const TOPICS = new Map<string, string>(enquiryTopics.map((t) => [t.value, t.label]));

const LIMITS = { name: 120, email: 200, message: 4000, body: 16_000 };
// People take a few seconds to fill the form. The client reports how long the
// form was open (its own clock only), so device clock drift cannot matter.
const MIN_FILL_MS = 3000;
// No whitespace, quotes, angle brackets, commas or semicolons: one address only.
const EMAIL_RE = /^[^\s@<>",;]+@[^\s@<>",;]+\.[^\s@<>",;]{2,}$/;
const SEND_TIMEOUT_MS = 10_000;

// Fallback throttle when no rate limiting binding is configured (local
// preview). Per isolate only, so it slows a single sender rather than
// guaranteeing a global limit.
const recent = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function throttledLocally(key: string, now: number) {
  for (const [k, hits] of recent) {
    if (hits.every((t) => now - t >= WINDOW_MS)) recent.delete(k);
  }
  const hits = (recent.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(key, hits);
  return hits.length > MAX_PER_WINDOW;
}

async function throttled(env: Env, key: string) {
  if (env.ENQUIRY_LIMITER) return !(await env.ENQUIRY_LIMITER.limit({ key })).success;
  return throttledLocally(key, Date.now());
}

function json(status: number, body: Record<string, unknown>, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers },
  });
}

// Multi-line text keeps its line breaks; single-line fields (name, email,
// topic) lose every control character so nothing can forge extra lines in
// the email.
function text(value: unknown, max: number, multiline = false) {
  if (typeof value !== "string") return "";
  const controls = multiline ? /[\u0000-\u0009\u000B\u000C\u000E-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g;
  return value.replace(controls, multiline ? "" : " ").trim().slice(0, max);
}

// Reads the body with a hard byte cap. The content-length header can be
// missing (chunked uploads) or wrong, so the stream itself is counted. Past
// the cap the rest is read and discarded rather than cancelled, which keeps
// the connection healthy for the next request; beyond DRAIN_LIMIT it is cut.
const DRAIN_LIMIT = 1_000_000;

async function readCapped(request: Request, cap: number): Promise<string | null> {
  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > cap) return null;
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > DRAIN_LIMIT) {
      await reader.cancel();
      return null;
    }
    if (size <= cap) chunks.push(value);
  }
  if (size > cap) return null;
  const all = new Uint8Array(size);
  let offset = 0;
  for (const c of chunks) {
    all.set(c, offset);
    offset += c.byteLength;
  }
  return new TextDecoder().decode(all);
}

async function handleEnquiry(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") return json(405, { ok: false, error: "Method not allowed." }, { allow: "POST" });

  // Browsers always send Origin on cross-site posts, so this stops other sites
  // submitting on a visitor's behalf. Scripts can omit it; bots are handled below.
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return json(403, { ok: false, error: "Not allowed." });

  if (!(request.headers.get("content-type") ?? "").includes("application/json")) {
    return json(415, { ok: false, error: "Please use the form on the page." });
  }

  const raw = await readCapped(request, LIMITS.body);
  if (raw === null) return json(413, { ok: false, error: "That message is too long." });

  let data: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
    data = parsed as Record<string, unknown>;
  } catch {
    return json(400, { ok: false, error: "Please check the form and try again." });
  }

  // Honeypot and fill time: answer as if it worked so bots learn nothing.
  // Both are heuristics that stop naive scripts; the rate limit is the backstop.
  const elapsed = Number(data.elapsed);
  if (text(data.website, 200) || !Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
    return json(200, { ok: true });
  }

  const name = text(data.name, LIMITS.name);
  const email = text(data.email, LIMITS.email);
  const message = text(data.message, LIMITS.message, true);
  const topic = TOPICS.get(text(data.topic, 40));

  if (!name || !topic || !EMAIL_RE.test(email) || message.length < 10) {
    return json(422, { ok: false, error: "Please add your name, a valid email and a short message." });
  }

  if (!env.RESEND_API_KEY || !env.ENQUIRY_TO || !env.ENQUIRY_FROM) {
    return json(503, { ok: false, error: "The form is not available right now. Please use the email address instead." });
  }

  const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
  if (await throttled(env, ip)) {
    return json(429, { ok: false, error: "Too many messages in a short time. Please try again later." }, { "retry-after": "60" });
  }

  const body = [`Topic: ${topic}`, `Name: ${name}`, `Email: ${email}`, "", message].join("\n");
  try {
    const sent = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: env.ENQUIRY_FROM,
        to: [env.ENQUIRY_TO],
        reply_to: email,
        subject: `Enquiry: ${topic} (${name})`,
        text: body,
      }),
      signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
    });
    if (!sent.ok) throw new Error(`resend ${sent.status}`);
  } catch (error) {
    // Visible to the owner in Cloudflare logs; the visitor gets a generic message.
    console.error("enquiry delivery failed", error instanceof Error ? error.message : "unknown");
    return json(502, { ok: false, error: "We could not send that just now. Please try again or use the email address." });
  }
  return json(200, { ok: true });
}

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === "/api/enquiry") return handleEnquiry(request, env);
    return env.ASSETS.fetch(request);
  },
};

export default worker;
