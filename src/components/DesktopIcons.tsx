"use client";

import { useState } from "react";
import { useOS } from "@/lib/store";
import { DESKTOP_SHORTCUTS, AppIcons } from "@/lib/apps";

export default function DesktopIcons() {
  const { openApp, dispatch } = useOS();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div
      className="absolute top-3 bottom-12 left-3 grid grid-flow-col grid-rows-[repeat(auto-fill,96px)] content-start gap-1"
      onPointerDown={(e) => { if (e.target === e.currentTarget) setSelected(null); }}
    >
      {DESKTOP_SHORTCUTS.map((s) => {
        const Icon = AppIcons[s.icon];
        const open = () => (s.action === "guestbook" ? dispatch({ type: "GUESTBOOK", open: true }) : openApp(s.app, s.props, s.title));
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => setSelected(s.id)}
            onDoubleClick={open}
            onPointerUp={(e) => { if (e.pointerType === "touch") open(); }}
            onKeyDown={(e) => { if (e.key === "Enter") open(); }}
            className={`flex h-[92px] w-[84px] flex-col items-center gap-1.5 rounded border px-1 pt-2 pb-1 text-center text-white
              ${selected === s.id ? "border-white/30 bg-white/20" : "border-transparent hover:border-white/15 hover:bg-white/10"}`}
          >
            <Icon className="h-11 w-11 icon-shadow" />
            <span className="line-clamp-2 text-xs leading-tight text-shadow-desktop">{s.label}</span>
          </button>
        );
      })}
    </div>
  );
}
