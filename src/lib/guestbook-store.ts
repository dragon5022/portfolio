import { promises as fs } from "node:fs";
import path from "node:path";

/* Guestbook storage.
   - If UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are set (e.g. on Vercel), entries go to Redis.
   - Otherwise they are appended to data/guestbook.json next to the project (local / VPS). */

export interface GuestbookEntry {
  id: string;
  name: string;
  rating: number; // 1-5
  message: string;
  createdAt: string; // ISO
}

const MAX = 200;
const FILE = path.join(process.cwd(), "data", "guestbook.json");
const REDIS_KEY = "guestbook";

const redis = () => {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
};

async function redisCmd<T>(cmd: (string | number)[]): Promise<T> {
  const r = redis()!;
  const res = await fetch(r.url, { method: "POST", headers: { Authorization: `Bearer ${r.token}`, "Content-Type": "application/json" }, body: JSON.stringify(cmd), cache: "no-store" });
  if (!res.ok) throw new Error(`Redis error ${res.status}`);
  const data = (await res.json()) as { result: T };
  return data.result;
}

async function readFileStore(): Promise<GuestbookEntry[]> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as GuestbookEntry[]) : [];
  } catch {
    return [];
  }
}

async function writeFileStore(entries: GuestbookEntry[]) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(entries, null, 2), "utf8");
}

/** newest first */
export async function listEntries(): Promise<GuestbookEntry[]> {
  if (redis()) {
    const raw = await redisCmd<string[]>(["LRANGE", REDIS_KEY, 0, MAX - 1]);
    return raw.map((s) => JSON.parse(s) as GuestbookEntry);
  }
  const entries = await readFileStore();
  return entries.slice().reverse().slice(0, MAX);
}

export async function addEntry(input: Omit<GuestbookEntry, "id" | "createdAt">): Promise<GuestbookEntry> {
  const entry: GuestbookEntry = { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  if (redis()) {
    await redisCmd(["LPUSH", REDIS_KEY, JSON.stringify(entry)]);
    await redisCmd(["LTRIM", REDIS_KEY, 0, MAX - 1]);
    return entry;
  }
  const entries = await readFileStore();
  entries.push(entry);
  await writeFileStore(entries.slice(-MAX));
  return entry;
}

export const storageKind = () => (redis() ? "upstash-redis" : "json-file");
