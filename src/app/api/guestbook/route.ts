import { addEntry, listEntries } from "@/lib/guestbook-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LIMITS = { name: 40, message: 500 };
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const recent = new Map<string, number[]>(); // best-effort per-instance rate limit

function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "anon";
}

function tooMany(ip: string) {
  const now = Date.now();
  const stamps = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (stamps.length >= MAX_PER_WINDOW) return true;
  stamps.push(now);
  recent.set(ip, stamps);
  return false;
}

/* CORS: lets a static copy of the site (e.g. GitHub Pages) talk to this API.
   Set GUESTBOOK_ALLOWED_ORIGIN to lock it to one origin, e.g. https://dragon5022.github.io */
const cors = {
  "Access-Control-Allow-Origin": process.env.GUESTBOOK_ALLOWED_ORIGIN ?? "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
const json = (data: unknown, init: ResponseInit = {}) => Response.json(data, { ...init, headers: { ...cors, "Cache-Control": "no-store", ...(init.headers ?? {}) } });

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: cors });
}

export async function GET() {
  try {
    const entries = await listEntries();
    return json({ entries });
  } catch (err) {
    return json({ error: "Could not load messages.", detail: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = (await req.json()) as Record<string, unknown>; } catch { return json({ error: "Invalid JSON." }, { status: 400 }); }

  // honeypot: real users never fill this hidden field
  if (typeof body.website === "string" && body.website.trim()) return json({ ok: true });

  const name = String(body.name ?? "").trim().slice(0, LIMITS.name);
  const message = String(body.message ?? "").trim().slice(0, LIMITS.message);
  const rating = Math.round(Number(body.rating));
  if (name.length < 1) return json({ error: "Please add your name." }, { status: 400 });
  if (message.length < 3) return json({ error: "Please write a message (at least 3 characters)." }, { status: 400 });
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return json({ error: "Pick a rating from 1 to 5." }, { status: 400 });
  if (tooMany(clientIp(req))) return json({ error: "Too many messages. Please try again in a few minutes." }, { status: 429 });

  try {
    const entry = await addEntry({ name, message, rating });
    return json({ entry }, { status: 201 });
  } catch (err) {
    return json({ error: "Could not save your message.", detail: (err as Error).message }, { status: 500 });
  }
}
