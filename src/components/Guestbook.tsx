"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { useOS } from "@/lib/store";
import { PORTFOLIO } from "@/data/portfolio";
import { Glyph } from "@/components/icons";
import Avatar from "@/components/Avatar";
import { GUESTBOOK_API } from "@/lib/paths";

export interface Entry { id: string; name: string; rating: number; message: string; createdAt: string }

/* ---------- shared data store (one fetch, shared by panel + dialog) ----------
   Talks to the guestbook API. If no API is reachable (static hosting such as GitHub Pages
   without NEXT_PUBLIC_GUESTBOOK_API), it falls back to this browser's localStorage. */
let cache: Entry[] | null = null;
let loading: Promise<void> | null = null;
let localMode = false;
const LOCAL_KEY = "guestbook-local";
const listeners = new Set<() => void>();
const publish = (e: Entry[]) => { cache = e; listeners.forEach((l) => l()); };
const subscribe = (cb: () => void) => { listeners.add(cb); return () => { listeners.delete(cb); }; };
const getSnapshot = () => cache;
const getServerSnapshot = () => null;

const readLocal = (): Entry[] => { try { return JSON.parse(localStorage.getItem(LOCAL_KEY) ?? "[]") as Entry[]; } catch { return []; } };
const writeLocal = (e: Entry[]) => { try { localStorage.setItem(LOCAL_KEY, JSON.stringify(e.slice(0, 200))); } catch { /* storage blocked */ } };

async function apiError(res: Response) {
  return ((await res.json().catch(() => ({}))) as { error?: string }).error ?? `HTTP ${res.status}`;
}

function useEntries() {
  const entries = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(() => {
    loading ??= (async () => {
      try {
        const res = await fetch(GUESTBOOK_API, { cache: "no-store" });
        if (res.status === 404 || res.status === 405) throw Object.assign(new Error("no api"), { noApi: true });
        if (!res.ok) throw new Error(await apiError(res));
        localMode = false;
        publish(((await res.json()) as { entries: Entry[] }).entries);
        setError(null);
      } catch (err) {
        const noApi = (err as { noApi?: boolean }).noApi || err instanceof TypeError; // 404 or network failure
        if (noApi) { localMode = true; publish(readLocal()); setError(null); }
        else { setError((err as Error).message); if (!cache) publish([]); }
      } finally {
        loading = null;
      }
    })();
    return loading;
  }, []);
  useEffect(() => { if (!cache) void load(); }, [load]);
  return { entries, error, reload: load, isLocal: localMode };
}

/** post a new entry; returns the saved entry */
async function postEntry(form: { name: string; rating: number; message: string; website: string }): Promise<Entry> {
  if (localMode) {
    const name = form.name.trim().slice(0, 40), message = form.message.trim().slice(0, 500);
    if (!name) throw new Error("Please add your name.");
    if (message.length < 3) throw new Error("Please write a message (at least 3 characters).");
    const entry: Entry = { id: crypto.randomUUID(), name, rating: form.rating, message, createdAt: new Date().toISOString() };
    const next = [entry, ...readLocal()];
    writeLocal(next);
    publish(next);
    return entry;
  }
  const res = await fetch(GUESTBOOK_API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
  const data = (await res.json().catch(() => ({}))) as { entry?: Entry; error?: string };
  if (!res.ok || !data.entry) throw new Error(data.error ?? `HTTP ${res.status}`);
  return data.entry;
}

const Stars = ({ n, size = "text-[13px]" }: { n: number; size?: string }) => (
  <span className={`inline-flex gap-px ${size}`} aria-label={`${n} out of 5`}>
    {[1, 2, 3, 4, 5].map((i) => <Glyph.star key={i} className={i <= n ? "fill-[#ffd43b] text-[#ffd43b]" : "text-fg-3"} />)}
  </span>
);

const when = (iso: string) => {
  const d = new Date(iso), diff = Date.now() - d.getTime();
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} min ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} h ago`;
  return d.toLocaleDateString([], { month: "short", day: "numeric", year: d.getFullYear() === new Date().getFullYear() ? undefined : "numeric" });
};

function EntryCard({ e, compact }: { e: Entry; compact?: boolean }) {
  return (
    <div className={`rounded-lg border border-line bg-surface ${compact ? "px-3 py-2" : "px-3.5 py-3"}`}>
      <div className="flex items-center gap-2">
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent/20 text-[11px] font-bold text-accent">{e.name.trim()[0]?.toUpperCase() ?? "?"}</span>
        <b className="truncate text-[13px]">{e.name}</b>
        <Stars n={e.rating} size="text-[11px]" />
        <span className="ml-auto shrink-0 text-[11px] text-fg-3">{when(e.createdAt)}</span>
      </div>
      <p className={`mt-1.5 text-xs leading-relaxed text-fg-2 selectable ${compact ? "line-clamp-2" : ""}`}>{e.message}</p>
    </div>
  );
}

/* ---------- desktop panel (the box under the clock widget) ---------- */
export function GuestbookPanel() {
  const { dispatch } = useOS();
  const { entries, error } = useEntries();
  const avg = entries && entries.length ? entries.reduce((s, e) => s + e.rating, 0) / entries.length : 0;

  return (
    <div className="absolute top-[284px] right-6 bottom-16 hidden w-60 flex-col text-white md:flex">
      <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-white/12 bg-[rgba(20,22,30,.45)] shadow-[0_8px_24px_rgba(0,0,0,.25)] glass-sm">
        <div className="px-4 pt-3.5 pb-2.5">
          <div className="text-[11px] tracking-[.08em] uppercase opacity-80">Guestbook</div>
          <div className="mt-0.5 text-[15px] font-semibold">Leave a message to {PORTFOLIO.name}</div>
          {entries && entries.length > 0 && (
            <div className="mt-1 flex items-center gap-1.5 text-xs opacity-90"><Stars n={Math.round(avg)} size="text-[11px]" /> {avg.toFixed(1)} · {entries.length} {entries.length === 1 ? "review" : "reviews"}</div>
          )}
        </div>
        <div className="min-h-0 flex-1 space-y-1.5 overflow-auto px-3 pb-2 text-fg [&_.bg-surface]:bg-[rgba(255,255,255,.08)] [&_.border-line]:border-white/10 [&_.text-fg-2]:text-white/80 [&_.text-fg-3]:text-white/55 [&_b]:text-white">
          {entries === null && <div className="py-6 text-center text-xs text-white/60">Loading…</div>}
          {entries && entries.length === 0 && <div className="py-6 text-center text-xs text-white/60">{error ? "Messages are unavailable right now." : "No messages yet. Be the first!"}</div>}
          {entries?.slice(0, 20).map((e) => <EntryCard key={e.id} e={e} compact />)}
        </div>
        <div className="border-t border-white/10 p-3">
          <button type="button" onClick={() => dispatch({ type: "GUESTBOOK", open: true })} className="flex h-9 w-full items-center justify-center gap-2 rounded bg-accent text-[13px] font-medium text-accent-text hover:brightness-110">
            <Glyph.send /> Write a message
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- modal dialog ---------- */
export function GuestbookDialog() {
  const { state, dispatch, notify } = useOS();
  const { entries, reload, isLocal } = useEntries();
  const [form, setForm] = useState({ name: "", rating: 5, message: "", website: "" });
  const [hover, setHover] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const open = state.guestbookOpen;

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => nameRef.current?.focus(), 120);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") dispatch({ type: "GUESTBOOK", open: false }); };
    window.addEventListener("keydown", onKey);
    return () => { clearTimeout(t); window.removeEventListener("keydown", onKey); };
  }, [open, dispatch]);

  if (!open) return null;
  const close = () => dispatch({ type: "GUESTBOOK", open: false });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true); setError(null);
    try {
      await postEntry(form);
      if (!isLocal) await reload();
      setDone(true);
      setForm({ name: "", rating: 5, message: "", website: "" });
      notify("Thank you!", isLocal ? "Your message was saved in this browser." : `Your message to ${PORTFOLIO.name} was saved.`, "contact");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const field = "w-full rounded border border-line-strong border-b-fg-3 bg-surface px-2.5 py-2 text-[13px] text-fg outline-none placeholder:text-fg-3 focus:border-b-2 focus:border-b-accent";

  return (
    <div data-popup className="absolute inset-0 z-70 flex items-center justify-center bg-black/45 p-3 pb-16 animate-fade sm:p-4 sm:pb-16" onPointerDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="gb-title" className="flex max-h-full w-full max-w-[720px] flex-col overflow-hidden rounded-lg border border-line-strong bg-mica text-fg shadow-win glass animate-win-open">
        <div className="flex items-center gap-3 border-b border-line px-5 py-3.5">
          <Avatar size={36} />
          <div className="min-w-0">
            <h2 id="gb-title" className="text-[15px] font-semibold">Leave a message to {PORTFOLIO.name}</h2>
            <p className="text-xs text-fg-3">{isLocal ? "Saved in this browser only (static hosting)." : "Reviews are public and saved with your name and the time."}</p>
          </div>
          <button type="button" onClick={close} title="Close" className="ml-auto grid h-8 w-8 place-items-center rounded hover:bg-hover"><Glyph.x /></button>
        </div>

        <div className="grid min-h-0 flex-1 overflow-auto md:grid-cols-[1fr_280px]">
          <form onSubmit={submit} className="px-5 py-4">
            {done ? (
              <div className="rounded-lg border border-[rgba(108,203,95,.35)] bg-[rgba(108,203,95,.12)] px-4 py-5 text-center">
                <div className="text-2xl">🎉</div>
                <b className="mt-1 block text-[14px]">Thanks for your message!</b>
                <p className="mt-1 text-xs text-fg-2">It is now in the guestbook. {PORTFOLIO.name} will read it.</p>
                <div className="mt-4 flex justify-center gap-2">
                  <button type="button" onClick={() => setDone(false)} className="h-8 rounded border border-line-strong bg-surface-2 px-3.5 text-[13px] hover:bg-surface-3">Write another</button>
                  <button type="button" onClick={close} className="h-8 rounded bg-accent px-3.5 text-[13px] font-medium text-accent-text hover:brightness-110">Close</button>
                </div>
              </div>
            ) : (
              <>
                <label className="block text-xs text-fg-2">Your name
                  <input ref={nameRef} required maxLength={40} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane from Acme" className={`${field} mt-1.5`} />
                </label>
                <div className="mt-3 text-xs text-fg-2">Your rating</div>
                <div className="mt-1.5 flex items-center gap-1" onMouseLeave={() => setHover(0)}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button key={i} type="button" aria-label={`${i} star${i > 1 ? "s" : ""}`} onMouseEnter={() => setHover(i)} onClick={() => setForm({ ...form, rating: i })}
                      className={`text-[22px] transition-transform hover:scale-110 ${i <= (hover || form.rating) ? "text-[#ffd43b]" : "text-fg-3"}`}>
                      <Glyph.star className={i <= (hover || form.rating) ? "fill-[#ffd43b]" : ""} />
                    </button>
                  ))}
                  <span className="ml-2 text-xs text-fg-3">{["", "Poor", "Fair", "Good", "Great", "Excellent"][hover || form.rating]}</span>
                </div>
                <label className="mt-3 block text-xs text-fg-2">Message
                  <textarea required minLength={3} maxLength={500} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="What was it like working with me? Or just say hi." className={`${field} mt-1.5 min-h-[120px] resize-y`} />
                </label>
                <div className="mt-1 text-right text-[11px] text-fg-3">{form.message.length}/500</div>
                {/* honeypot */}
                <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="absolute -left-[9999px] h-0 w-0 opacity-0" aria-hidden="true" />
                {error && <div className="mt-2 rounded border border-[#e74856]/40 bg-[#e74856]/12 px-3 py-2 text-xs">{error}</div>}
                <div className="mt-4 flex items-center gap-2">
                  <button type="submit" disabled={busy} className="inline-flex h-9 items-center gap-2 rounded bg-accent px-4 text-[13px] font-medium text-accent-text hover:brightness-110 disabled:opacity-60"><Glyph.send /> {busy ? "Saving…" : "Post message"}</button>
                  <button type="button" onClick={close} className="h-9 rounded border border-line-strong bg-surface-2 px-3.5 text-[13px] hover:bg-surface-3">Cancel</button>
                </div>
              </>
            )}
          </form>

          <aside className="border-t border-line bg-black/10 px-4 py-4 md:border-t-0 md:border-l [html[data-theme=light]_&]:bg-black/3">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold"><span>Recent messages</span><span className="font-normal text-fg-3">{entries?.length ?? 0}</span></div>
            <div className="space-y-1.5">
              {entries === null && <div className="py-4 text-center text-xs text-fg-3">Loading…</div>}
              {entries && entries.length === 0 && <div className="py-4 text-center text-xs text-fg-3">No messages yet.</div>}
              {entries?.slice(0, 30).map((e) => <EntryCard key={e.id} e={e} />)}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
