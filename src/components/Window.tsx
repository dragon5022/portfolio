"use client";

import { useRef, useState, type PointerEvent as RPointerEvent } from "react";
import { useOS, type Win, type Rect } from "@/lib/store";
import { APP_META, AppIcons } from "@/lib/apps";
import { Caption } from "@/components/icons";
import { APP_COMPONENTS } from "@/components/apps";

const MIN_W = 320, MIN_H = 200, TASKBAR = 48;
type Snap = "max" | "left" | "right" | null;
type Dir = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

const snapRect = (s: Snap): Rect => {
  const vw = window.innerWidth, vh = window.innerHeight - TASKBAR;
  if (s === "left") return { x: 0, y: 0, w: Math.round(vw / 2), h: vh };
  if (s === "right") return { x: Math.round(vw / 2), y: 0, w: vw - Math.round(vw / 2), h: vh };
  return { x: 0, y: 0, w: vw, h: vh };
};

export default function Window({ win }: { win: Win }) {
  const { state, dispatch } = useOS();
  const ref = useRef<HTMLDivElement>(null);
  const [anim, setAnim] = useState<"" | "minimizing" | "closing">("");
  const drag = useRef<{ sx: number; sy: number; rect: Rect; snap: Snap; live: boolean } | null>(null);
  const rz = useRef<{ dir: Dir; sx: number; sy: number; rect: Rect } | null>(null);

  const focused = state.zTop === win.z;
  const meta = APP_META[win.app];
  const Icon = AppIcons[meta.icon];
  const App = APP_COMPONENTS[win.app];

  const focus = () => dispatch({ type: "FOCUS", id: win.id });
  const close = () => { setAnim("closing"); setTimeout(() => dispatch({ type: "CLOSE", id: win.id }), 160); };
  const minimize = () => { setAnim("minimizing"); setTimeout(() => { dispatch({ type: "MINIMIZE", id: win.id }); setAnim(""); }, 210); };
  const toggleMax = () => dispatch({ type: "TOGGLE_MAX", id: win.id });

  const apply = (r: Rect) => {
    const el = ref.current; if (!el) return;
    el.style.left = `${r.x}px`; el.style.top = `${r.y}px`; el.style.width = `${r.w}px`; el.style.height = `${r.h}px`;
  };

  /* ---------- dragging ---------- */
  const onTitleDown = (e: RPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || (e.target as Element).closest("button")) return;
    focus();
    let rect = win.rect;
    if (win.maximized) {
      // restore under the cursor, keeping the relative grab position
      const prev = win.prevRect ?? { x: 0, y: 0, w: Math.round(window.innerWidth * 0.7), h: Math.round(window.innerHeight * 0.7) };
      const ratio = e.clientX / window.innerWidth;
      rect = { ...prev, x: Math.round(e.clientX - prev.w * ratio), y: Math.max(0, e.clientY - 18) };
      dispatch({ type: "RECT", id: win.id, rect, maximized: false });
    }
    drag.current = { sx: e.clientX, sy: e.clientY, rect, snap: null, live: false };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onTitleMove = (e: RPointerEvent<HTMLDivElement>) => {
    const d = drag.current; if (!d) return;
    const dx = e.clientX - d.sx, dy = e.clientY - d.sy;
    if (!d.live && Math.hypot(dx, dy) < 3) return;
    d.live = true;
    ref.current?.classList.add("!transition-none");
    const vw = window.innerWidth;
    const x = Math.min(Math.max(d.rect.x + dx, -d.rect.w + 60), vw - 60);
    const y = Math.max(0, Math.min(d.rect.y + dy, window.innerHeight - TASKBAR - 36));
    apply({ ...d.rect, x, y });
    const snap: Snap = e.clientY <= 2 ? "max" : e.clientX <= 2 ? "left" : e.clientX >= vw - 3 ? "right" : null;
    if (snap !== d.snap) { d.snap = snap; dispatch({ type: "SNAP_PREVIEW", rect: snap ? snapRect(snap) : null }); }
  };

  const onTitleUp = (e: RPointerEvent<HTMLDivElement>) => {
    const d = drag.current; drag.current = null; if (!d) return;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    ref.current?.classList.remove("!transition-none");
    if (!d.live) return;
    dispatch({ type: "SNAP_PREVIEW", rect: null });
    if (d.snap) {
      dispatch({ type: "RECT", id: win.id, rect: snapRect(d.snap), maximized: d.snap === "max" });
      return;
    }
    const el = ref.current!;
    dispatch({ type: "RECT", id: win.id, rect: { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight } });
  };

  /* ---------- resizing ---------- */
  const onRzDown = (dir: Dir) => (e: RPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    focus();
    rz.current = { dir, sx: e.clientX, sy: e.clientY, rect: win.rect };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onRzMove = (e: RPointerEvent<HTMLDivElement>) => {
    const r = rz.current; if (!r) return;
    const dx = e.clientX - r.sx, dy = e.clientY - r.sy;
    let { x, y, w, h } = r.rect;
    if (r.dir.includes("e")) w = Math.max(MIN_W, r.rect.w + dx);
    if (r.dir.includes("s")) h = Math.max(MIN_H, r.rect.h + dy);
    if (r.dir.includes("w")) { w = Math.max(MIN_W, r.rect.w - dx); x = r.rect.x + (r.rect.w - w); }
    if (r.dir.includes("n")) { h = Math.max(MIN_H, r.rect.h - dy); y = Math.max(0, r.rect.y + (r.rect.h - h)); }
    apply({ x, y, w, h });
  };
  const onRzUp = (e: RPointerEvent<HTMLDivElement>) => {
    if (!rz.current) return;
    rz.current = null;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    const el = ref.current!;
    dispatch({ type: "RECT", id: win.id, rect: { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight } });
  };

  const handles: { dir: Dir; cls: string }[] = [
    { dir: "n", cls: "-top-[3px] left-2 right-2 h-1.5 cursor-n-resize" },
    { dir: "s", cls: "-bottom-[3px] left-2 right-2 h-1.5 cursor-s-resize" },
    { dir: "e", cls: "-right-[3px] top-2 bottom-2 w-1.5 cursor-e-resize" },
    { dir: "w", cls: "-left-[3px] top-2 bottom-2 w-1.5 cursor-w-resize" },
    { dir: "ne", cls: "-top-[3px] -right-[3px] h-3 w-3 cursor-ne-resize" },
    { dir: "nw", cls: "-top-[3px] -left-[3px] h-3 w-3 cursor-nw-resize" },
    { dir: "se", cls: "-bottom-[3px] -right-[3px] h-3 w-3 cursor-se-resize" },
    { dir: "sw", cls: "-bottom-[3px] -left-[3px] h-3 w-3 cursor-sw-resize" },
  ];

  const animCls = anim === "minimizing" ? "animate-win-min" : anim === "closing" ? "animate-win-close" : "animate-win-open";

  return (
    <div
      ref={ref}
      data-window
      onPointerDown={focus}
      className={`pointer-events-auto absolute flex flex-col overflow-hidden bg-mica text-fg glass shadow-win ${animCls}
        ${win.maximized ? "rounded-none border-0 shadow-none" : "rounded-lg border"}
        ${focused ? "border-[rgba(128,128,128,.4)]" : "border-line-strong"}
        ${win.minimized && anim !== "minimizing" ? "hidden" : ""}`}
      style={{ left: win.rect.x, top: win.rect.y, width: win.rect.w, height: win.rect.h, zIndex: win.z, minWidth: MIN_W, minHeight: MIN_H }}
    >
      {/* title bar */}
      <div
        className="flex h-9 shrink-0 items-center gap-2 pl-3 select-none"
        onPointerDown={onTitleDown} onPointerMove={onTitleMove} onPointerUp={onTitleUp} onPointerCancel={onTitleUp}
        onDoubleClick={(e) => { if (!(e.target as Element).closest("button")) toggleMax(); }}
      >
        <Icon className="h-4 w-4" />
        <span className={`flex-1 truncate text-xs ${focused ? "" : "opacity-60"}`}>{win.title}</span>
        <div className="flex h-full">
          <button type="button" onClick={minimize} title="Minimize" className="grid h-full w-[46px] place-items-center hover:bg-hover"><Caption.minimize className="h-2.5 w-2.5 [stroke-width:1.3]" /></button>
          <button type="button" onClick={toggleMax} title={win.maximized ? "Restore" : "Maximize"} className="grid h-full w-[46px] place-items-center hover:bg-hover">
            {win.maximized ? <Caption.restore className="h-2.5 w-2.5 [stroke-width:1.3]" /> : <Caption.maximize className="h-2.5 w-2.5 [stroke-width:1.3]" />}
          </button>
          <button type="button" onClick={close} title="Close" className="grid h-full w-[46px] place-items-center hover:bg-[#c42b1c] hover:text-white"><Caption.close className="h-2.5 w-2.5 [stroke-width:1.3]" /></button>
        </div>
      </div>

      {/* body */}
      <div className="relative flex min-h-0 flex-1 flex-col overflow-auto">
        <App win={win} key={win.rev} />
      </div>

      {!win.maximized && handles.map((h) => (
        <div key={h.dir} className={`absolute z-5 ${h.cls}`} onPointerDown={onRzDown(h.dir)} onPointerMove={onRzMove} onPointerUp={onRzUp} onPointerCancel={onRzUp} />
      ))}
    </div>
  );
}
