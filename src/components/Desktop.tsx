"use client";

import { useEffect } from "react";
import { useOS } from "@/lib/store";
import DesktopIcons from "@/components/DesktopIcons";
import Widget from "@/components/Widget";
import Window from "@/components/Window";
import Taskbar from "@/components/Taskbar";
import StartMenu from "@/components/StartMenu";
import { QuickSettings, CalendarFlyout } from "@/components/Flyouts";
import ContextMenu from "@/components/ContextMenu";
import Toasts from "@/components/Toasts";
import { GuestbookPanel, GuestbookDialog } from "@/components/Guestbook";

export default function Desktop() {
  const { state, dispatch } = useOS();

  /* close popups on outside click / Escape */
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const el = e.target as Element | null;
      if (el?.closest("[data-popup],[data-popup-trigger]")) return;
      dispatch({ type: "CLOSE_POPUPS" });
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") dispatch({ type: "CLOSE_POPUPS" }); };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", onDown); document.removeEventListener("keydown", onKey); };
  }, [dispatch]);

  /* keep maximized windows filling the viewport */
  useEffect(() => {
    const onResize = () => {
      const rect = { x: 0, y: 0, w: window.innerWidth, h: window.innerHeight - 48 };
      state.windows.filter((w) => w.maximized).forEach((w) => dispatch({ type: "RECT", id: w.id, rect }));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [state.windows, dispatch]);

  const onContextMenu = (e: React.MouseEvent) => {
    const el = e.target as Element;
    if (el.closest("[data-window],[data-taskbar],[data-popup]")) return;
    e.preventDefault();
    dispatch({ type: "CONTEXT", menu: { x: e.clientX, y: e.clientY } });
  };

  const snap = state.snapPreview;

  return (
    <div className="fixed inset-0 overflow-hidden animate-fade" onContextMenu={onContextMenu}>
      <div className={`wp-${state.wallpaper} absolute inset-0 -z-10 [filter:brightness(var(--brightness,1))] transition-[filter] duration-300 after:absolute after:inset-0 after:bg-[radial-gradient(ellipse_at_50%_120%,rgba(0,0,0,.35),transparent_60%)]`} />

      <DesktopIcons />
      <Widget />
      <GuestbookPanel />

      {/* window layer */}
      <div className="pointer-events-none absolute inset-x-0 top-0 bottom-12">
        {snap && (
          <div
            className="absolute z-1 rounded-lg border border-[rgba(160,190,255,.55)] bg-[rgba(128,160,255,.18)] backdrop-blur-sm transition-all duration-150"
            style={{ left: snap.x, top: snap.y, width: snap.w, height: snap.h }}
          />
        )}
        {state.windows.map((w) => <Window key={w.id} win={w} />)}
      </div>

      {state.startOpen && <StartMenu />}
      {state.flyout === "quick" && <QuickSettings />}
      {state.flyout === "calendar" && <CalendarFlyout />}
      {state.contextMenu && <ContextMenu />}

      <Taskbar />
      <GuestbookDialog />
      <Toasts />
    </div>
  );
}
