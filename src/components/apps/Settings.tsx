"use client";

import { useEffect, useState } from "react";
import { useOS, ACCENTS, WALLPAPERS } from "@/lib/store";
import { Glyph } from "@/components/icons";
import Avatar from "@/components/Avatar";
import { fetchRepos, fmtMonth, type GitHubRepo } from "@/lib/github";
import type { AppProps } from "./index";
import { Btn, LinkBtn } from "./ui";

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

/* the visitor's GitHub account (from the lock screen sign-in) */
function Accounts() {
  const { state, dispatch } = useOS();
  const v = state.visitor;
  const [repos, setRepos] = useState<GitHubRepo[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!v) return;
    let live = true;
    fetchRepos(v.login).then((r) => { if (live) setRepos(r ?? []); }, (e: Error) => { if (live) setError(e.message); });
    return () => { live = false; };
  }, [v]);

  const signOut = <Row title="Sign out" sub="Return to the lock screen"><Btn onClick={() => dispatch({ type: "PHASE", phase: "lock" })}>Lock</Btn></Row>;
  if (!v) return <><h2 className="mb-4 text-[22px] font-semibold">Accounts</h2><Row title="Not signed in" sub="Sign in on the lock screen with your GitHub username" />{signOut}</>;

  const stats: [string, string | number | undefined][] = [["Followers", v.followers], ["Following", v.following], ["Public repos", v.publicRepos], ["Joined", v.joined && fmtMonth(v.joined)]];

  return (
    <>
      <h2 className="mb-4 text-[22px] font-semibold">Your info</h2>
      <div className="mb-3 flex flex-wrap items-center gap-4 rounded border border-line bg-surface px-4 py-4">
        <Avatar size={72} person={v} />
        <div className="min-w-0 flex-1">
          <b className="block text-base">{v.name}</b>
          <span className="text-xs text-fg-3">@{v.login} · GitHub account</span>
          {v.bio && <p className="selectable mt-1.5 text-[13px] text-fg-2">{v.bio}</p>}
        </div>
        <LinkBtn href={v.url}><Glyph.external /> View on GitHub</LinkBtn>
      </div>
      {v.verified ? (
        <div className="mb-3 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          {stats.map(([label, value]) => (
            <div key={label} className="rounded border border-line bg-surface px-3.5 py-2.5"><div className="text-lg font-semibold">{value ?? "–"}</div><div className="text-[11px] text-fg-3">{label}</div></div>
          ))}
        </div>
      ) : <Row title="Profile details unavailable" sub="GitHub could not be reached when you signed in, so only your username is known." />}
      {v.company && <Row title="Company" sub={v.company} />}
      {v.location && <Row title="Location" sub={v.location} />}
      {v.blog && <Row title="Website" sub={v.blog} />}

      <h3 className="mt-5 mb-2 text-[13px] font-semibold text-fg-2">Recent repositories</h3>
      {error ? <Row title="Could not load repositories" sub={error} />
        : !repos ? <div className="py-3 text-[13px] text-fg-3">Loading…</div>
        : !repos.length ? <Row title="No public repositories yet" />
        : (
          <div className="grid gap-1.5 sm:grid-cols-2">
            {repos.map((r) => (
              <a key={r.name} href={r.url} target="_blank" rel="noreferrer" className="block min-w-0 rounded border border-line bg-surface px-3.5 py-3 text-[13px] text-fg no-underline hover:bg-surface-2">
                <b className="block truncate font-semibold">{r.name}</b>
                <span className="mt-0.5 line-clamp-2 text-xs text-fg-2">{r.description ?? "No description"}</span>
                <span className="mt-1.5 flex flex-wrap gap-x-3 text-[11px] text-fg-3">{r.language && <span>{r.language}</span>}<span>★ {r.stars}</span><span>Updated {fmtMonth(r.updated)}</span></span>
              </a>
            ))}
          </div>
        )}

      <h3 className="mt-5 mb-2 text-[13px] font-semibold text-fg-2">Sign-in options</h3>
      {signOut}
    </>
  );
}

export default function Settings({ win }: AppProps) {
  const { state, dispatch } = useOS();
  const [page, setPage] = useState<PageId>((win.props.page as PageId) ?? "personalization");

  return (
    <div className="flex h-full flex-col md:flex-row">
      <nav className="flex shrink-0 gap-1 overflow-x-auto border-b border-line p-2 md:w-[220px] md:flex-col md:border-r md:border-b-0 md:px-2.5 md:py-4">
        <div className="hidden items-center gap-3 px-2.5 pt-1.5 pb-4 text-[13px] md:flex">
          <Avatar size={40} person={state.visitor} />
          <div className="min-w-0"><span className="block truncate">{state.visitor?.name ?? "Guest"}</span><small className="block truncate text-[11px] text-fg-3">{state.visitor ? `@${state.visitor.login} · GitHub` : "Not signed in"}</small></div>
        </div>
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

        {page === "accounts" && <Accounts />}

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
