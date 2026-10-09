"use client";

import { useOS } from "@/lib/store";
import { APP_META, TASKBAR_PINNED, AppIcons, type AppId } from "@/lib/apps";
import { Glyph, WindowsLogo } from "@/components/icons";
import { useClock, fmtTime, fmtShortDate } from "@/lib/useClock";

const tb = "relative flex h-10 min-w-10 items-center justify-center gap-2 rounded-md px-2 text-xl text-fg transition-colors hover:bg-hover active:bg-active [&>svg]:transition-transform hover:[&>svg]:scale-110 active:[&>svg]:scale-90";

export default function Taskbar() {
  const { state, dispatch, openApp } = useOS();
  const now = useClock();

  const running = state.windows.map((w) => w.app);
  const apps: AppId[] = [...TASKBAR_PINNED, ...running.filter((a) => !TASKBAR_PINNED.includes(a))];
  const unread = state.notifications.length > 0;

  const onAppClick = (app: AppId) => {
    const win = state.windows.find((w) => w.app === app);
    if (!win) return openApp(app);
    const isTop = win.z === state.zTop && !win.minimized;
    if (isTop) dispatch({ type: "MINIMIZE", id: win.id });
    else dispatch({ type: "FOCUS", id: win.id });
  };

  const toggle = (key: "start" | "quick" | "calendar") => {
    if (key === "start") dispatch({ type: "START", open: !state.startOpen });
    else dispatch({ type: "FLYOUT", flyout: state.flyout === key ? null : key });
  };

  return (
    <div data-taskbar className="absolute inset-x-0 bottom-0 z-50 flex h-12 items-center border-t border-line bg-acrylic glass">
      {/* centre cluster */}
      <div className="absolute left-1/2 flex h-full -translate-x-1/2 items-center gap-1">
        <button type="button" data-popup-trigger title="Start" onClick={() => toggle("start")} className={`${tb} ${state.startOpen ? "bg-active" : ""}`}>
          <WindowsLogo className="h-5 w-5 fill-accent" />
        </button>
        <button type="button" data-popup-trigger title="Search" onClick={() => toggle("start")} className={`${tb} text-base`}>
          <Glyph.search /><span className="hidden text-[13px] text-fg-2 sm:inline">Search</span>
        </button>
        <button type="button" title="Task view" onClick={() => dispatch({ type: "MINIMIZE_ALL" })} className={`${tb} hidden sm:flex`}>
          <Glyph.taskview />
        </button>

        {apps.map((app) => {
          const Icon = AppIcons[APP_META[app].icon];
          const win = state.windows.find((w) => w.app === app);
          const active = !!win && !win.minimized && win.z === state.zTop;
          return (
            <button
              key={app} type="button" onClick={() => onAppClick(app)}
              className={`group relative h-10 w-10 place-items-center rounded-md transition-colors hover:bg-hover ${active ? "bg-active" : ""} ${win ? "grid" : "hidden sm:grid"}`}
            >
              <Icon className="h-6 w-6 transition-transform group-active:scale-90" />
              <i className={`absolute bottom-0.5 left-1/2 h-[3px] -translate-x-1/2 rounded-full transition-all ${active ? "w-4 bg-accent" : win ? "w-1.5 bg-fg-3" : "w-0"}`} />
              <span className="pointer-events-none absolute bottom-[52px] left-1/2 -translate-x-1/2 translate-y-1 rounded border border-line-strong bg-surface px-2.5 py-1 text-xs whitespace-nowrap opacity-0 shadow-pop transition-all group-hover:translate-y-0 group-hover:opacity-100">
                {APP_META[app].label}
              </span>
            </button>
          );
        })}
      </div>

      {/* system tray */}
      <div className="ml-auto flex h-full items-center gap-0.5 pr-0.5">
        <button type="button" title="Show hidden icons" className={`${tb} hidden h-10 min-w-8 px-1.5 text-sm sm:flex`}><Glyph.chevronUp /></button>
        <button type="button" title="Language" className={`${tb} hidden h-10 min-w-8 px-1.5 text-[11px] font-semibold sm:flex`}>ENG</button>
        <button type="button" data-popup-trigger title="Network, sound, battery" onClick={() => toggle("quick")} className={`${tb} h-10 gap-1.5 px-2 text-base ${state.flyout === "quick" ? "bg-active" : ""} max-sm:[&>svg:not(:last-child)]:hidden`}>
          <Glyph.wifi /><Glyph.volume /><Glyph.battery />
        </button>
        <button type="button" data-popup-trigger title="Date and time" onClick={() => toggle("calendar")} className={`${tb} h-10 flex-col items-end gap-0 px-2 text-xs leading-tight ${state.flyout === "calendar" ? "bg-active" : ""}`}>
          <span>{fmtTime(now)}</span><span>{fmtShortDate(now)}</span>
        </button>
        <button type="button" data-popup-trigger title="Notifications" onClick={() => toggle("calendar")} className={`${tb} h-10 min-w-8 px-2 text-base`}>
          <Glyph.bell />
          {unread && <i className="absolute top-2 right-1.5 h-2 w-2 rounded-full bg-accent" />}
        </button>
        <button type="button" title="Show desktop" onClick={() => dispatch({ type: "MINIMIZE_ALL" })} className="ml-1 h-full w-1.5 border-l border-transparent hover:border-line-strong" />
      </div>
    </div>
  );
}
