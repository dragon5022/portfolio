import type { ComponentType } from "react";
import type { AppId } from "@/lib/apps";
import type { Win } from "@/lib/store";
import About from "./About";
import FileExplorer from "./FileExplorer";
import Skills from "./Skills";
import Terminal from "./Terminal";
import VSCode from "./VSCode";
import Contact from "./Contact";
import Notepad from "./Notepad";
import Edge from "./Edge";
import Settings from "./Settings";
import Portfolio from "./Portfolio";

export interface AppProps { win: Win }

export const APP_COMPONENTS: Record<AppId, ComponentType<AppProps>> = {
  portfolio: Portfolio,
  about: About,
  projects: FileExplorer,
  explorer: FileExplorer,
  skills: Skills,
  terminal: Terminal,
  vscode: VSCode,
  contact: Contact,
  notepad: Notepad,
  edge: Edge,
  settings: Settings,
};
