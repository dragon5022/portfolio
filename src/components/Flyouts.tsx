"use client";

import { useState } from "react";
import { useOS } from "@/lib/store";
import { Glyph } from "@/components/icons";
import { PORTFOLIO } from "@/data/portfolio";
import { AppIcons, APP_META } from "@/lib/apps";

const flyout = "absolute right-3 bottom-[60px] z-60 w-[360px] max-w-[calc(100vw-24px)] rounded-lg border border-line-strong bg-acrylic shadow-win glass animate-fly-up";

function Tile({ on, onClick, label, children }: { on: boolean; onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={`flex h-[74px] flex-col items-center justify-center gap-2 rounded border text-xs ${on ? "border-transparent bg-accent text-accent-text" : "border-line bg-surface hover:bg-surface-2"}`}>
      <span className="text-lg">{children}</span><span>{label}</span>
    </button>
  );
}

export function QuickSettings() {
  const { state, dispatch, openApp } = useOS();
  const [tiles, setTiles] = useState({ wifi: true, bt: true, plane: false, focus: false, saver: false });
  const dark = state.theme === "dark";
  const toggleTile = (k: keyof typeof tiles) => setTiles((t) => ({ ...t, [k]: !t[k] }));

  return (
    <div data-popup className={`${flyout} p-5`}>
      <div className="mb-5 grid grid-cols-3 gap-2">
        <Tile on={tiles.wifi} onClick={() => toggleTile("wifi")} label="Wi-Fi"><Glyph.wifi /></Tile>
        <Tile on={tiles.bt} onClick={() => toggleTile("bt")} label="Bluetooth"><Glyph.bluetooth /></Tile>
        <Tile on={tiles.plane} onClick={() => toggleTile("plane")} label="Airplane"><Glyph.plane /></Tile>
        <Tile on={dark} onClick={() => dispatch({ type: "THEME", theme: dark ? "light" : "dark" })} label="Dark mode"><Glyph.moon /></Tile>
        <Tile on={tiles.focus} onClick={() => toggleTile("focus")} label="Focus"><Glyph.focus /></Tile>
        <Tile on={tiles.saver} onClick={() => toggleTile("saver")} label="Saver"><Glyph.battery /></Tile>
      </div>
      <label className="mb-3.5 flex items-center gap-3 text-lg">
        <Glyph.sun />
        <input type="range" min={30} max={100} defaultValue={100} className="flex-1 accent-accent" onChange={(e) => document.documentElement.style.setProperty("--brightness", String(Number(e.target.value) / 100))} />
      </label>
      <label className="mb-3.5 flex items-center gap-3 text-lg">
        <Glyph.volume /><input type="range" min={0} max={100} defaultValue={70} className="flex-1 accent-accent" />
      </label>
      <div className="flex items-center justify-between border-t border-line pt-3 text-xs">
        <span>🔋 100%</span>
        <button type="button" title="Settings" onClick={() => openApp("settings")} className="grid h-10 w-10 place-items-center rounded text-lg hover:bg-hover"><Glyph.gear /></button>
      </div>
    </div>
  );
}

export function CalendarFlyout() {
  const { state, dispatch } = useOS();
  const today = new Date();
  const y = today.getFullYear(), m = today.getMonth();
  const first = new Date(y, m, 1).getDay();
  const days = new Date(y, m + 1, 0).getDate();
  const prevDays = new Date(y, m, 0).getDate();
  const marks = new Set(PORTFOLIO.timeline.filter((t) => t.date.startsWith(`${y}-${String(m + 1).padStart(2, "0")}`)).map((t) => Number(t.date.slice(8))));
  const cells: { d: number; dim?: boolean }[] = [];
  for (let i = first - 1; i >= 0; i--) cells.push({ d: prevDays - i, dim: true });
  for (let d = 1; d <= days; d++) cells.push({ d });
  while (cells.length % 7) cells.push({ d: cells.length - days - first + 1, dim: true });

  return (
    <div data-popup className={`${flyout} overflow-hidden`}>
      <div className="flex items-center justify-between px-4 py-3.5 text-[13px] font-semibold">
        <span>Notifications</span>
        <button type="button" onClick={() => dispatch({ type: "CLEAR_NOTIFS" })} className="rounded border border-line bg-surface px-2.5 py-1 text-xs font-normal hover:bg-surface-2">Clear all</button>
      </div>
      <div className="flex max-h-60 flex-col gap-1.5 overflow-auto px-3 pb-3">
        {state.notifications.length === 0 && <div className="pb-4 text-center text-xs text-fg-3">No new notifications</div>}
        {state.notifications.map((n) => {
          const Icon = n.icon ? AppIcons[APP_META[n.icon].icon] : null;
          return (
            <div key={n.id} className="flex gap-3 rounded-lg border border-line bg-surface px-3 py-2.5 text-xs">
              {Icon && <Icon className="h-6 w-6" />}
              <div><b className="block font-semibold">{n.title}</b><span className="text-fg-2">{n.body}</span><small className="block text-fg-3">{n.time}</small></div>
            </div>
          );
        })}
      </div>
      <div className="border-t border-line px-4 pt-3.5 pb-2 text-[13px] font-semibold">{today.toLocaleDateString([], { month: "long", year: "numeric" })}</div>
      <div className="grid grid-cols-7 gap-0.5 px-3 pb-3.5">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => <span key={d} className="h-8 text-center text-[11px] leading-8 text-fg-3">{d}</span>)}
        {cells.map((c, i) => {
          const isToday = !c.dim && c.d === today.getDate();
          const mark = !c.dim && marks.has(c.d);
          return (
            <span key={i} className={`relative h-[34px] rounded-full text-center text-xs leading-[34px] ${c.dim ? "text-fg-3 opacity-50" : ""} ${isToday ? "bg-accent font-semibold text-accent-text" : ""}`}>
              {c.d}
              {mark && <i className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent" />}
            </span>
          );
        })}
      </div>
    </div>
  );
}
