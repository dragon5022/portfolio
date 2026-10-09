"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import { APP_META, type AppId } from "@/lib/apps";
import { PORTFOLIO } from "@/data/portfolio";

/* ---------- Types ---------- */
export type Phase = "boot" | "lock" | "desktop" | "shutdown" | "restart" | "bsod";
export type Theme = "dark" | "light";
export type WallpaperId = "bloom" | "java" | "python" | "dark" | "light";
export interface Rect { x: number; y: number; w: number; h: number }

export interface Win {
  id: string;
  app: AppId;
  title: string;
  rect: Rect;
  prevRect?: Rect;
  z: number;
  minimized: boolean;
  maximized: boolean;
  props: Record<string, unknown>;
  /** bumps when the same app is re-opened with new props */
  rev: number;
}
export interface Notification { id: number; title: string; body: string; icon?: AppId; time: string; toast: boolean }
export interface UserInfo { name: string; handle: string; avatar: string | null; bio?: string }

export interface OSState {
  phase: Phase;
  theme: Theme;
  wallpaper: WallpaperId;
  accent: string;
  windows: Win[];
  zTop: number;
  user: UserInfo;
  notifications: Notification[];
  snapPreview: Rect | null;
  startOpen: boolean;
  flyout: null | "quick" | "calendar";
  contextMenu: { x: number; y: number } | null;
  guestbookOpen: boolean;
}

export type Action =
  | { type: "PHASE"; phase: Phase }
  | { type: "THEME"; theme: Theme }
  | { type: "WALLPAPER"; wallpaper: WallpaperId }
  | { type: "ACCENT"; accent: string }
  | { type: "OPEN"; app: AppId; props?: Record<string, unknown>; title?: string }
  | { type: "CLOSE"; id: string }
  | { type: "MINIMIZE"; id: string }
  | { type: "TOGGLE_MAX"; id: string }
  | { type: "FOCUS"; id: string }
  | { type: "RECT"; id: string; rect: Rect; maximized?: boolean }
  | { type: "MINIMIZE_ALL" }
  | { type: "CLOSE_ALL" }
  | { type: "USER"; user: Partial<UserInfo> }
  | { type: "NOTIFY"; title: string; body: string; icon?: AppId }
  | { type: "TOAST_DONE"; id: number }
  | { type: "CLEAR_NOTIFS" }
  | { type: "SNAP_PREVIEW"; rect: Rect | null }
  | { type: "START"; open: boolean }
  | { type: "FLYOUT"; flyout: OSState["flyout"] }
  | { type: "CONTEXT"; menu: OSState["contextMenu"] }
  | { type: "GUESTBOOK"; open: boolean }
  | { type: "CLOSE_POPUPS" };

/* ---------- Helpers ---------- */
let notifSeq = 1;
const isMobile = () => typeof window !== "undefined" && window.innerWidth < 860;

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((s) => s[0]!.toUpperCase()).join("");
}

function placeWindow(app: AppId, count: number): Rect {
  const meta = APP_META[app];
  const vw = window.innerWidth;
  const vh = window.innerHeight - 48;
  const w = Math.min(meta.width, vw - 24);
  const h = Math.min(meta.height, vh - 24);
  const offset = (count % 6) * 32;
  const x = Math.max(12, Math.round((vw - w) / 2 - 80 + offset));
  const y = Math.max(12, Math.round((vh - h) / 2 - 40 + offset));
  return { x: Math.min(x, vw - w - 12), y: Math.min(y, vh - h - 12), w, h };
}

const TASKBAR = 48;

/* ---------- Reducer ---------- */
function reducer(state: OSState, a: Action): OSState {
  switch (a.type) {
    case "PHASE":
      return { ...state, phase: a.phase, startOpen: false, flyout: null, contextMenu: null };
    case "THEME":
      return { ...state, theme: a.theme };
    case "WALLPAPER":
      return { ...state, wallpaper: a.wallpaper };
    case "ACCENT":
      return { ...state, accent: a.accent };
    case "OPEN": {
      const z = state.zTop + 1;
      const existing = state.windows.find((w) => w.app === a.app);
      if (existing) {
        return {
          ...state, zTop: z, startOpen: false, flyout: null, contextMenu: null,
          windows: state.windows.map((w) =>
            w.id === existing.id
              ? { ...w, z, minimized: false, props: a.props ? { ...w.props, ...a.props } : w.props, rev: a.props ? w.rev + 1 : w.rev, title: a.title ?? w.title }
              : w),
        };
      }
      const rect = placeWindow(a.app, state.windows.length);
      const mobile = isMobile();
      const win: Win = {
        id: `${a.app}-${Date.now()}`, app: a.app, title: a.title ?? APP_META[a.app].label,
        rect: mobile ? { x: 0, y: 0, w: window.innerWidth, h: window.innerHeight - TASKBAR } : rect,
        prevRect: mobile ? rect : undefined,
        z, minimized: false, maximized: mobile, props: a.props ?? {}, rev: 0,
      };
      return { ...state, zTop: z, windows: [...state.windows, win], startOpen: false, flyout: null, contextMenu: null };
    }
    case "CLOSE":
      return { ...state, windows: state.windows.filter((w) => w.id !== a.id) };
    case "MINIMIZE":
      return { ...state, windows: state.windows.map((w) => (w.id === a.id ? { ...w, minimized: true } : w)) };
    case "TOGGLE_MAX": {
      const z = state.zTop + 1;
      return {
        ...state, zTop: z,
        windows: state.windows.map((w) => {
          if (w.id !== a.id) return w;
          if (w.maximized) return { ...w, z, maximized: false, rect: w.prevRect ?? w.rect, prevRect: undefined };
          return { ...w, z, maximized: true, prevRect: w.rect, rect: { x: 0, y: 0, w: window.innerWidth, h: window.innerHeight - TASKBAR } };
        }),
      };
    }
    case "FOCUS": {
      const target = state.windows.find((w) => w.id === a.id);
      if (!target) return state;
      if (target.z === state.zTop && !target.minimized) return state;
      const z = state.zTop + 1;
      return { ...state, zTop: z, windows: state.windows.map((w) => (w.id === a.id ? { ...w, z, minimized: false } : w)) };
    }
    case "RECT":
      return {
        ...state,
        windows: state.windows.map((w) => {
          if (w.id !== a.id) return w;
          if (a.maximized === true) return { ...w, maximized: true, prevRect: w.maximized ? w.prevRect : w.rect, rect: a.rect };
          if (a.maximized === false) return { ...w, maximized: false, prevRect: undefined, rect: a.rect };
          return { ...w, rect: a.rect };
        }),
      };
    case "MINIMIZE_ALL":
      return { ...state, windows: state.windows.map((w) => ({ ...w, minimized: true })), startOpen: false, flyout: null, contextMenu: null };
    case "CLOSE_ALL":
      return { ...state, windows: [] };
    case "USER":
      return { ...state, user: { ...state.user, ...a.user } };
    case "NOTIFY": {
      const n: Notification = {
        id: notifSeq++, title: a.title, body: a.body, icon: a.icon, toast: true,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      return { ...state, notifications: [n, ...state.notifications].slice(0, 20) };
    }
    case "TOAST_DONE":
      return { ...state, notifications: state.notifications.map((n) => (n.id === a.id ? { ...n, toast: false } : n)) };
    case "CLEAR_NOTIFS":
      return { ...state, notifications: [] };
    case "SNAP_PREVIEW":
      return { ...state, snapPreview: a.rect };
    case "START":
      return { ...state, startOpen: a.open, flyout: a.open ? null : state.flyout, contextMenu: null };
    case "FLYOUT":
      return { ...state, flyout: a.flyout, startOpen: false, contextMenu: null };
    case "CONTEXT":
      return { ...state, contextMenu: a.menu, startOpen: false, flyout: null };
    case "GUESTBOOK":
      return { ...state, guestbookOpen: a.open, startOpen: false, flyout: null, contextMenu: null };
    case "CLOSE_POPUPS":
      if (!state.startOpen && !state.flyout && !state.contextMenu) return state;
      return { ...state, startOpen: false, flyout: null, contextMenu: null };
    default:
      return state;
  }
}

/* ---------- Persistence ---------- */
interface Persisted { theme: Theme; wallpaper: WallpaperId; accent: string }
const KEY = "portfolio-os-v3"; // identity is never persisted: it always comes from PORTFOLIO
function load(): Partial<Persisted> {
  try { return JSON.parse(localStorage.getItem(KEY) ?? "{}"); } catch { return {}; }
}

function initialState(): OSState {
  const saved = load();
  return {
    phase: "boot",
    theme: saved.theme ?? "dark",
    wallpaper: saved.wallpaper ?? "bloom",
    accent: saved.accent ?? "#4cc2ff",
    windows: [],
    zTop: 10,
    user: { name: PORTFOLIO.name, handle: PORTFOLIO.handle, avatar: PORTFOLIO.avatar || null },
    notifications: [],
    snapPreview: null,
    startOpen: false,
    flyout: null,
    contextMenu: null,
    guestbookOpen: false,
  };
}

/* ---------- Context ---------- */
interface OSContextValue {
  state: OSState;
  dispatch: React.Dispatch<Action>;
  openApp: (app: AppId, props?: Record<string, unknown>, title?: string) => void;
  notify: (title: string, body: string, icon?: AppId) => void;
  initials: string;
}

const OSContext = createContext<OSContextValue | null>(null);

export function OSProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  /* apply theme + accent to the document */
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = state.theme;
    root.style.setProperty("--accent", state.accent);
    root.style.setProperty("--accent-text", readableOn(state.accent));
  }, [state.theme, state.accent]);

  /* persist preferences */
  useEffect(() => {
    const data: Persisted = { theme: state.theme, wallpaper: state.wallpaper, accent: state.accent };
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* private mode */ }
  }, [state.theme, state.wallpaper, state.accent]);

  const value = useMemo<OSContextValue>(() => ({
    state,
    dispatch,
    openApp: (app, props, title) => dispatch({ type: "OPEN", app, props, title }),
    notify: (title, body, icon) => dispatch({ type: "NOTIFY", title, body, icon }),
    initials: initials(state.user.name),
  }), [state]);

  return <OSContext.Provider value={value}>{children}</OSContext.Provider>;
}

export function useOS() {
  const ctx = useContext(OSContext);
  if (!ctx) throw new Error("useOS must be used inside <OSProvider>");
  return ctx;
}

/* pick black or white text for a given accent colour */
function readableOn(hex: string) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return "#ffffff";
  const n = parseInt(m[1]!, 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.6 ? "#0b1a26" : "#ffffff";
}

export const ACCENTS = ["#4cc2ff", "#0078d4", "#7a5cff", "#ff6ec7", "#f89820", "#ffd43b", "#6ccb5f", "#e74856"];
export const WALLPAPERS: { id: WallpaperId; label: string }[] = [
  { id: "bloom", label: "Windows Bloom" },
  { id: "java", label: "Java Ember" },
  { id: "python", label: "Python Tide" },
  { id: "dark", label: "Graphite" },
  { id: "light", label: "Daylight" },
];
