// The only server code on the site: one endpoint that turns the enquiry form
// into an email. Every other request is answered from the static export.
//
// Configuration (never hard-coded):
//   RESEND_API_KEY  secret, Resend API key
//   ENQUIRY_TO      where enquiries are delivered
//   ENQUIRY_FROM    verified sender, e.g. "Crystal Kizor site <hello@example.com>"

interface AssetFetcher {
  fetch(request: Request): Promise<Response>;
}

interface Env {
  ASSETS: AssetFetcher;
  RESEND_API_KEY?: string;
  ENQUIRY_TO?: string;
  ENQUIRY_FROM?: string;
}

const TOPICS: Record<string, string> = {
  studio_project: "A project with Studio COKA",
  speaking: "Speaking or media",
  ako_partner: "Partnering with AKO Alliance",
  tea: "The Effective Architect",
  elevated: "ELEvated furniture",
  general: "Something else",
};

const LIMITS = { name: 120, email: 200, message: 4000, body: 16_000 };
// A person needs a few seconds to fill the form; scripts usually do not wait.
const MIN_FILL_MS = 3000;
const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/;

// Best effort per-isolate throttle. Cloudflare may run several isolates, so
// this slows down a single sender rather than guaranteeing a global limit.
const recent = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function throttled(ip: string, now: number) {
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > MAX_PER_WINDOW;
}

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

function clean(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  // Strip control characters (keeping line breaks) so nothing odd reaches the inbox.
  return value.replace(/[\u0000-\u0009\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max);
}

async function handleEnquiry(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") return json(405, { ok: false, error: "Method not allowed." });

  // Only accept submissions made from this site.
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return json(403, { ok: false, error: "Not allowed." });

  const length = Number(request.headers.get("content-length") ?? "0");
  if (length > LIMITS.body) return json(413, { ok: false, error: "That message is too long." });

  let data: Record<string, unknown>;
  try {
    const type = request.headers.get("content-type") ?? "";
    if (type.includes("application/json")) {
      data = (await request.json()) as Record<string, unknown>;
    } else {
      data = Object.fromEntries((await request.formData()).entries());
    }
  } catch {
    return json(400, { ok: false, error: "Please check the form and try again." });
  }

  // Honeypot and fill time: answer as if it worked so bots learn nothing.
  const started = Number(data.started);
  if (clean(data.website, 200) || !Number.isFinite(started) || Date.now() - started < MIN_FILL_MS) {
    return json(200, { ok: true });
  }

  const name = clean(data.name, LIMITS.name);
  const email = clean(data.email, LIMITS.email);
  const message = clean(data.message, LIMITS.message);
  const topicKey = clean(data.topic, 40);
  const topic = TOPICS[topicKey];

  if (!name || !topic || !EMAIL_RE.test(email) || message.length < 10) {
    return json(422, { ok: false, error: "Please add your name, a valid email and a short message." });
  }

  const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
  if (throttled(ip, Date.now())) {
    return json(429, { ok: false, error: "Too many messages in a short time. Please try again later." });
  }

  if (!env.RESEND_API_KEY || !env.ENQUIRY_TO || !env.ENQUIRY_FROM) {
    return json(503, { ok: false, error: "The form is not available right now. Please use the email address instead." });
  }

  const text = [`Topic: ${topic}`, `Name: ${name}`, `Email: ${email}`, "", message].join("\n");
  const sent = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: env.ENQUIRY_FROM,
      to: [env.ENQUIRY_TO],
      reply_to: email,
      subject: `Enquiry: ${topic} (${name})`,
      text,
    }),
  });

  if (!sent.ok) {
    // Logged for the owner in Cloudflare; the visitor only sees a generic message.
    console.error("enquiry delivery failed", sent.status);
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
