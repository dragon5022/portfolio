"use client";

import { useState } from "react";
import { useOS, ACCENTS, WALLPAPERS } from "@/lib/store";
import { PORTFOLIO } from "@/data/portfolio";
import { Glyph } from "@/components/icons";
import Avatar from "@/components/Avatar";
import type { AppProps } from "./index";
import { Btn } from "./ui";

type PageId = "system" | "personalization" | "accounts" | "about";
const NAV: { id: PageId; label: string; icon: React.ReactNode }[] = [
  { id: "system", label: "System", icon: <Glyph.monitor /> },
  { id: "personalization", label: "Personalization", icon: <Glyph.palette /> },
  { id: "accounts", label: "Accounts", icon: <Glyph.user /> },
  { id: "about", label: "About", icon: <Glyph.info /> },
];

const Row = ({ title, sub, children }: { title: string; sub?: string; children?: React.ReactNode }) => (
  <div className="mb-1 flex items-center justify-between gap-4 rounded border border-line bg-surface px-4 py-3.5 text-[13px]">
    <div>{title}{sub && <small className="block text-xs text-fg-3">{sub}</small>}</div>{children}
  </div>
);
const Toggle = ({ on, onClick }: { on: boolean; onClick: () => void }) => (
  <button type="button" role="switch" aria-checked={on} onClick={onClick} className={`relative h-5 w-10 shrink-0 rounded-full border transition-colors ${on ? "border-accent bg-accent" : "border-fg-3"}`}>
    <i className={`absolute top-[3px] h-3 w-3 rounded-full transition-all ${on ? "left-[22px] bg-accent-text" : "left-[3px] bg-fg-2"}`} />
  </button>
);

export default function Settings({ win }: AppProps) {
  const { state, dispatch } = useOS();
  const [page, setPage] = useState<PageId>((win.props.page as PageId) ?? "personalization");

  return (
    <div className="flex h-full flex-col md:flex-row">
      <nav className="flex shrink-0 gap-1 overflow-x-auto border-b border-line p-2 md:w-[220px] md:flex-col md:border-r md:border-b-0 md:px-2.5 md:py-4">
        <div className="hidden items-center gap-3 px-2.5 pt-1.5 pb-4 text-[13px] md:flex"><Avatar size={40} /><div>{state.user.name}<small className="block text-[11px] text-fg-3">{PORTFOLIO.email}</small></div></div>
        {NAV.map((n) => (
          <button key={n.id} type="button" onClick={() => setPage(n.id)} className={`relative flex items-center gap-3 rounded px-3 py-2 text-left text-[13px] whitespace-nowrap hover:bg-hover md:w-full ${page === n.id ? "bg-active before:absolute before:top-2.5 before:bottom-2.5 before:left-0 before:w-[3px] before:rounded-full before:bg-accent" : ""} [&>svg]:text-[17px] [&>svg]:text-accent`}>
            {n.icon}{n.label}
          </button>
        ))}
      </nav>

      <div className="flex-1 overflow-auto px-5 py-5 sm:px-7">
        {page === "personalization" && (
          <>
            <h2 className="mb-4 text-[22px] font-semibold">Personalization</h2>
            <h3 className="mb-2 text-[13px] font-semibold text-fg-2">Background</h3>
            <div className="mb-5 grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2.5">
              {WALLPAPERS.map((w) => (
                <button key={w.id} type="button" onClick={() => dispatch({ type: "WALLPAPER", wallpaper: w.id })} className={`wp-${w.id} relative aspect-16/10 overflow-hidden rounded-md border-2 ${state.wallpaper === w.id ? "border-accent" : "border-transparent"}`}>
                  <span className="absolute bottom-1.5 left-2 text-[11px] text-white [text-shadow:0_1px_3px_#000]">{w.label}</span>
                </button>
              ))}
            </div>
            <h3 className="mb-2 text-[13px] font-semibold text-fg-2">Colors</h3>
            <Row title="Choose your mode" sub="Switch between dark and light for windows and the taskbar">
              <select value={state.theme} onChange={(e) => dispatch({ type: "THEME", theme: e.target.value as "dark" | "light" })} className="rounded border border-line-strong bg-surface-2 px-2.5 py-1.5 text-fg outline-none">
                <option value="dark">Dark</option><option value="light">Light</option>
              </select>
            </Row>
            <Row title="Accent color" sub="Used for the Start button, highlights and toggles">
              <div className="flex flex-wrap gap-2">
                {ACCENTS.map((c) => <button key={c} type="button" aria-label={c} onClick={() => dispatch({ type: "ACCENT", accent: c })} className={`h-7 w-7 rounded border-2 ${state.accent === c ? "border-fg" : "border-transparent"}`} style={{ background: c }} />)}
              </div>
            </Row>
            <Row title="Transparency effects" sub="Windows and surfaces appear translucent"><Toggle on onClick={() => undefined} /></Row>
          </>
        )}

        {page === "system" && (
          <>
            <h2 className="mb-4 text-[22px] font-semibold">System</h2>
            <Row title="Display" sub={`${window.innerWidth} × ${window.innerHeight} · ${Math.round(window.devicePixelRatio * 100)}% scale`} />
            <Row title="Night light" sub="Warmer colors to help you sleep"><Toggle on={false} onClick={() => undefined} /></Row>
            <Row title="Open windows" sub={`${state.windows.length} running`}><Btn onClick={() => dispatch({ type: "CLOSE_ALL" })}>Close all</Btn></Row>
            <Row title="Notifications" sub={`${state.notifications.length} in the notification center`}><Btn onClick={() => dispatch({ type: "CLEAR_NOTIFS" })}>Clear</Btn></Row>
            <Row title="Storage" sub="Portfolio OS uses ~0 MB. Everything is in memory." />
          </>
        )}

        {page === "accounts" && (
          <>
            <h2 className="mb-4 text-[22px] font-semibold">Accounts</h2>
            <div className="mb-4 flex items-center gap-4"><Avatar size={64} /><div><b className="block text-base">{state.user.name}</b><span className="text-xs text-fg-3">github.com/{PORTFOLIO.handle} · {PORTFOLIO.email}</span></div></div>
            <Row title="Sign out" sub="Return to the lock screen"><Btn onClick={() => dispatch({ type: "PHASE", phase: "lock" })}>Lock</Btn></Row>
          </>
        )}

        {page === "about" && (
          <>
            <h2 className="mb-4 text-[22px] font-semibold">About</h2>
            <Row title="Device name" sub="PORTFOLIO-OS" />
            <Row title="Edition" sub="Portfolio OS 11 · Developer Edition" />
            <Row title="Built with" sub="Next.js 16 · React 19 · Tailwind CSS 4 · TypeScript" />
            <Row title="Primary languages" sub="Java 21 · Python 3.12" />
            <Row title="Inspired by" sub="The Windows 11 design language and portfolio-v1-shinobi-coder.vercel.app" />
            <Row title="Source" sub="Everything is data-driven from src/data/portfolio.ts" />
          </>
        )}
      </div>
    </div>
  );
}
