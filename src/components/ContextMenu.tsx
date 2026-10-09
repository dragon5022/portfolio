"use client";

import { useOS } from "@/lib/store";
import { Glyph } from "@/components/icons";

export default function ContextMenu() {
  const { state, dispatch, openApp } = useOS();
  const menu = state.contextMenu!;
  const x = Math.min(menu.x, window.innerWidth - 240);
  const y = Math.min(menu.y, window.innerHeight - 48 - 300);

  const items: { label: string; icon: React.ReactNode; run: () => void }[] = [
    { label: "Refresh", icon: <Glyph.refresh />, run: () => dispatch({ type: "CONTEXT", menu: null }) },
    { label: "Open in Terminal", icon: <Glyph.chevronRight />, run: () => openApp("terminal") },
    { label: "New text document", icon: <Glyph.file />, run: () => openApp("notepad", { fresh: true }, "Untitled - Notepad") },
    { label: "Display settings", icon: <Glyph.monitor />, run: () => openApp("settings", { page: "system" }) },
    { label: "Personalize", icon: <Glyph.palette />, run: () => openApp("settings", { page: "personalization" }) },
  ];

  return (
    <div data-popup className="absolute z-60 min-w-[220px] rounded-lg border border-line-strong bg-acrylic p-1 shadow-win glass animate-fade" style={{ left: x, top: y }}>
      {items.map((it, i) => (
        <div key={it.label}>
          {i === 3 && <hr className="mx-1.5 my-1 border-line" />}
          <button type="button" onClick={it.run} className="flex w-full items-center gap-2.5 rounded px-2.5 py-1.5 text-left text-[13px] hover:bg-hover [&>svg]:text-[15px] [&>svg]:text-fg-2">
            {it.icon}{it.label}
          </button>
        </div>
      ))}
    </div>
  );
}
