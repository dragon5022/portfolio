import { AppIcons, type AppIconName } from "@/components/icons";

export type AppId =
  | "portfolio" | "about" | "projects" | "skills" | "terminal" | "vscode"
  | "contact" | "explorer" | "notepad" | "edge" | "settings";

export interface AppMeta {
  label: string;
  icon: AppIconName;
  width: number;
  height: number;
}

export const APP_META: Record<AppId, AppMeta> = {
  portfolio: { label: "Portfolio",      icon: "portfolio", width: 1040, height: 680 },
  about:    { label: "dragon5022",     icon: "about",    width: 760, height: 620 },
  projects: { label: "Projects",       icon: "projects", width: 980, height: 620 },
  skills:   { label: "Skills",         icon: "skills",   width: 720, height: 600 },
  terminal: { label: "Terminal",       icon: "terminal", width: 780, height: 500 },
  vscode:   { label: "Visual Studio Code", icon: "vscode", width: 980, height: 640 },
  contact:  { label: "Contact",        icon: "contact",  width: 780, height: 600 },
  explorer: { label: "File Explorer",  icon: "explorer", width: 980, height: 620 },
  notepad:  { label: "Notepad",        icon: "notepad",  width: 640, height: 480 },
  edge:     { label: "Microsoft Edge", icon: "edge",     width: 960, height: 640 },
  settings: { label: "Settings",       icon: "settings", width: 900, height: 600 },
};

/* Shortcut ids that open an app with props (used on desktop + start menu) */
export interface Shortcut { id: string; label: string; icon: AppIconName; app: AppId; props?: Record<string, unknown>; title?: string; /** opens a system dialog instead of an app window */ action?: "guestbook" }

export const DESKTOP_SHORTCUTS: Shortcut[] = [
  { id: "portfolio", label: "Portfolio", icon: "portfolio", app: "portfolio" },
  { id: "about", label: "dragon5022", icon: "about", app: "about" },
  { id: "projects", label: "Projects", icon: "projects", app: "projects" },
  { id: "web", label: "Web Projects", icon: "web", app: "projects", props: { folder: "web" }, title: "Web" },
  { id: "games", label: "Apps & Games", icon: "game", app: "projects", props: { folder: "game" }, title: "Apps & Games" },
  { id: "ai", label: "AI Token Router", icon: "ai", app: "portfolio", props: { select: "token-router" } },
  { id: "java", label: "Java Projects", icon: "java", app: "projects", props: { folder: "java" }, title: "Java" },
  { id: "python", label: "Python Projects", icon: "python", app: "projects", props: { folder: "python" }, title: "Python" },
  { id: "skills", label: "Skills", icon: "skills", app: "skills" },
  { id: "terminal", label: "Terminal", icon: "terminal", app: "terminal" },
  { id: "vscode", label: "VS Code", icon: "vscode", app: "vscode" },
  { id: "contact", label: "Contact", icon: "contact", app: "contact" },
  { id: "guestbook", label: "Leave a message", icon: "guestbook", app: "contact", action: "guestbook" },
  { id: "readme", label: "README.md", icon: "notepad", app: "notepad" },
];

export const START_PINNED: Shortcut[] = [
  { id: "portfolio", label: "Portfolio", icon: "portfolio", app: "portfolio" },
  { id: "about", label: "dragon5022", icon: "about", app: "about" },
  { id: "projects", label: "Projects", icon: "projects", app: "projects" },
  { id: "skills", label: "Skills", icon: "skills", app: "skills" },
  { id: "terminal", label: "Terminal", icon: "terminal", app: "terminal" },
  { id: "vscode", label: "VS Code", icon: "vscode", app: "vscode" },
  { id: "contact", label: "Contact", icon: "contact", app: "contact" },
  { id: "guestbook", label: "Guestbook", icon: "guestbook", app: "contact", action: "guestbook" },
  { id: "explorer", label: "File Explorer", icon: "explorer", app: "explorer" },
  { id: "edge", label: "Edge", icon: "edge", app: "edge" },
  { id: "ai", label: "Token Router", icon: "ai", app: "portfolio", props: { select: "token-router" } },
  { id: "games", label: "Games", icon: "game", app: "projects", props: { folder: "game" }, title: "Apps & Games" },
];

export const TASKBAR_PINNED: AppId[] = ["explorer", "edge", "terminal", "vscode", "portfolio", "about", "projects", "contact"];

export { AppIcons };
