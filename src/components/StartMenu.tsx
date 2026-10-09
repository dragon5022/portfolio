"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useOS } from "@/lib/store";
import { START_PINNED, APP_META, AppIcons, type AppId, type Shortcut } from "@/lib/apps";
import { Glyph } from "@/components/icons";
import { PORTFOLIO, LANG_META } from "@/data/portfolio";
import Avatar from "@/components/Avatar";

interface Result { key: string; label: string; sub: string; icon: keyof typeof AppIcons; app: AppId; props?: Record<string, unknown>; title?: string }

export default function StartMenu() {
  const { state, dispatch, openApp } = useOS();
  const [q, setQ] = useState("");
  const [power, setPower] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { input.current?.focus(); }, []);

  const results = useMemo<Result[]>(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    const out: Result[] = [];
    (Object.keys(APP_META) as AppId[]).forEach((id) => {
      if (APP_META[id].label.toLowerCase().includes(s)) out.push({ key: `app-${id}`, label: APP_META[id].label, sub: "App", icon: APP_META[id].icon, app: id });
    });
    PORTFOLIO.projects.forEach((p) => {
      if ([p.name, p.summary, ...p.stack].join(" ").toLowerCase().includes(s))
        out.push({ key: `p-${p.id}`, label: p.name, sub: `${LANG_META[p.lang].label} project · ${p.stack.slice(0, 3).join(", ")}`, icon: LANG_META[p.lang].icon, app: "portfolio", props: { select: p.id } });
    });
    Object.entries(PORTFOLIO.skills).forEach(([group, list]) => list.forEach((sk) => {
      if (sk.name.toLowerCase().includes(s)) out.push({ key: `s-${sk.name}`, label: sk.name, sub: `Skill · ${group}`, icon: "skills", app: "skills", props: { group } });
    }));
    return out.slice(0, 8);
  }, [q]);

  const run = (s: Shortcut | Result) => {
    if ("action" in s && s.action === "guestbook") { dispatch({ type: "GUESTBOOK", open: true }); return; }
    openApp(s.app, s.props, "title" in s ? s.title : undefined);
  };

  const recommended: Result[] = [
    ...PORTFOLIO.projects.slice(0, 4).map((p) => ({ key: p.id, label: p.name, sub: `${p.year} · ${p.stack[0]}`, icon: LANG_META[p.lang].icon as keyof typeof AppIcons, app: "portfolio" as AppId, props: { select: p.id } })),
    { key: "readme", label: "README.md", sub: "Recently opened", icon: "notepad", app: "notepad" },
  ];

  return (
    <div
      data-popup
      className="absolute bottom-[60px] left-1/2 z-60 flex max-h-[calc(100vh-72px)] w-[640px] max-w-[calc(100vw-24px)] -translate-x-1/2 flex-col rounded-lg border border-line-strong bg-acrylic pt-6 shadow-win glass animate-fly-up"
    >
      <div className="mx-4 mb-5 flex h-9 items-center gap-2.5 rounded-full border border-line-strong border-b-accent bg-surface px-3 sm:mx-11">
        <Glyph.search className="text-[15px] text-fg-2" />
        <input
          ref={input} value={q} onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && results[0]) run(results[0]); }}
          placeholder="Search for apps, projects, and skills" className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-fg-3"
        />
      </div>

      {q.trim() ? (
        <div className="flex flex-col gap-1 overflow-auto px-4 pb-6 sm:px-11">
          {results.length === 0 && <div className="py-6 text-center text-fg-3">No results for “{q}”</div>}
          {results.map((r) => {
            const Icon = AppIcons[r.icon];
            return (
              <button key={r.key} type="button" onClick={() => run(r)} className="flex items-center gap-3 rounded px-2.5 py-2 text-left hover:bg-hover">
                <Icon className="h-7 w-7" />
                <span><span className="block text-[13px]">{r.label}</span><small className="text-[11px] text-fg-3">{r.sub}</small></span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="overflow-auto">
          <section className="px-4 sm:px-11">
            <header className="mb-3.5 flex items-center justify-between text-[13px] font-semibold">
              <span>Pinned</span>
              <button type="button" onClick={() => openApp("explorer")} className="inline-flex items-center gap-1 rounded border border-line bg-surface px-2.5 py-1 text-xs font-normal hover:bg-surface-2">All apps <Glyph.chevronRight className="text-[10px]" /></button>
            </header>
            <div className="mb-6 grid grid-cols-4 gap-1 sm:grid-cols-6">
              {START_PINNED.map((s) => {
                const Icon = AppIcons[s.icon];
                return (
                  <button key={s.id} type="button" onClick={() => run(s)} className="flex flex-col items-center gap-2 rounded px-1 py-2.5 text-center text-xs hover:bg-hover active:scale-95">
                    <Icon className="h-8 w-8" /><span>{s.label}</span>
                  </button>
                );
              })}
            </div>
          </section>
          <section className="px-4 sm:px-11">
            <header className="mb-3.5 flex items-center justify-between text-[13px] font-semibold">
              <span>Recommended</span>
              <button type="button" onClick={() => openApp("projects")} className="inline-flex items-center gap-1 rounded border border-line bg-surface px-2.5 py-1 text-xs font-normal hover:bg-surface-2">More <Glyph.chevronRight className="text-[10px]" /></button>
            </header>
            <div className="mb-6 grid grid-cols-1 gap-1 sm:grid-cols-2">
              {recommended.map((r) => {
                const Icon = AppIcons[r.icon];
                return (
                  <button key={r.key} type="button" onClick={() => run(r)} className="flex items-center gap-3 rounded px-2.5 py-2 text-left hover:bg-hover">
                    <Icon className="h-7 w-7" />
                    <span><b className="block text-xs font-medium">{r.label}</b><small className="text-[11px] text-fg-3">{r.sub}</small></span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      )}

      <footer className="mt-auto flex h-16 items-center justify-between rounded-b-lg border-t border-line bg-black/15 px-5 sm:px-12 [html[data-theme=light]_&]:bg-black/4">
        <button type="button" onClick={() => openApp("about")} className="flex items-center gap-3 rounded px-2.5 py-1.5 text-[13px] font-medium hover:bg-hover">
          <Avatar size={32} /> <span>{state.user.name}</span>
        </button>
        <div className="relative">
          <button type="button" title="Power" onClick={() => setPower((p) => !p)} className="grid h-10 w-10 place-items-center rounded text-lg hover:bg-hover"><Glyph.power /></button>
          {power && (
            <div className="absolute right-0 bottom-12 w-40 rounded-lg border border-line-strong bg-surface p-1 shadow-pop">
              {([["Lock", "lock"], ["Restart", "restart"], ["Shut down", "shutdown"]] as const).map(([label, phase]) => (
                <button key={phase} type="button" onClick={() => { if (phase !== "lock") dispatch({ type: "CLOSE_ALL" }); dispatch({ type: "PHASE", phase }); }} className="block w-full rounded px-3 py-2 text-left text-[13px] hover:bg-hover">{label}</button>
              ))}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
