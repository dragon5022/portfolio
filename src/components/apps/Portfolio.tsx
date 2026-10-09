"use client";

import { useState } from "react";
import Image from "next/image";
import { PORTFOLIO, LANG_META, type Lang, type Project } from "@/data/portfolio";
import { useOS } from "@/lib/store";
import { AppIcons, Glyph } from "@/components/icons";
import type { AppProps } from "./index";
import { Btn, Chip, LinkBtn } from "./ui";
import TokenRouterFlow from "./TokenRouterFlow";
import { asset } from "@/lib/paths";

const FILTERS: { id: Lang | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "web", label: "Web" },
  { id: "game", label: "Apps & Games" },
  { id: "ai", label: "AI Tools" },
  { id: "java", label: "Java" },
  { id: "python", label: "Python" },
];

function Thumb({ p, className = "" }: { p: Project; className?: string }) {
  const Icon = AppIcons[LANG_META[p.lang].icon];
  if (p.image) {
    return (
      <div className={`relative overflow-hidden bg-surface-3 ${className}`}>
        <Image src={asset(p.image)} alt={`${p.name} screenshot`} width={1440} height={900} sizes="(max-width: 640px) 100vw, 480px" className="h-full w-full object-cover object-top" />
      </div>
    );
  }
  if (p.flow === "token-router") {
    return (
      <div className={`grid place-items-center bg-linear-135 from-[#2a1a4a] to-[#0f1a33] ${className}`}>
        <div className="flex items-center gap-3 text-white"><Icon className="h-12 w-12" /><span className="text-lg font-semibold">40–70% fewer tokens</span></div>
      </div>
    );
  }
  return (
    <div className={`grid place-items-center bg-linear-135 from-surface-2 to-surface-3 ${className}`}>
      <Icon className="h-14 w-14 opacity-90" />
    </div>
  );
}

export default function Portfolio({ win }: AppProps) {
  const { openApp } = useOS();
  const initial = PORTFOLIO.projects.find((p) => p.id === win.props.select) ?? null;
  const [filter, setFilter] = useState<Lang | "all">("all");
  const [selected, setSelected] = useState<Project | null>(initial);

  const list = PORTFOLIO.projects.filter((p) => filter === "all" || p.lang === filter);

  if (selected) return <Detail p={selected} onBack={() => setSelected(null)} onOpenCode={() => openApp("vscode", { file: selected.flow ? "token_router.py" : undefined })} />;

  return (
    <div className="selectable px-4 py-5 sm:px-7">
      <div className="mb-1 flex items-center gap-3">
        <h2 className="text-2xl font-semibold tracking-tight">Portfolio</h2>
        <span className="text-xs text-fg-3">{list.length} projects</span>
      </div>
      <p className="mb-4 text-fg-2">Sites, apps and games I have built or helped build. Click a card for screenshots, my role and the stack.</p>

      <div className="mb-4 flex flex-wrap gap-1">
        {FILTERS.map((f) => (
          <button key={f.id} type="button" onClick={() => setFilter(f.id)} className={`relative rounded px-3 py-1.5 text-[13px] hover:bg-hover ${filter === f.id ? "text-fg after:absolute after:inset-x-2.5 after:bottom-0 after:h-[3px] after:rounded-full after:bg-accent" : "text-fg-2"}`}>{f.label}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((p) => {
          const Icon = AppIcons[LANG_META[p.lang].icon];
          return (
            <button key={p.id} type="button" onClick={() => setSelected(p)} className="group overflow-hidden rounded-lg border border-line bg-surface text-left transition-colors hover:border-line-strong hover:bg-surface-2">
              <Thumb p={p} className="aspect-16/10 border-b border-line transition-transform duration-300 group-hover:[&_img]:scale-[1.03]" />
              <div className="p-3.5">
                <div className="mb-1 flex items-center gap-2"><Icon className="h-5 w-5" /><b className="text-[14px] font-semibold">{p.name}</b><span className="ml-auto text-[11px] text-fg-3">{p.year}</span></div>
                <p className="line-clamp-2 text-xs text-fg-2">{p.summary}</p>
                <div className="mt-2.5 flex flex-wrap gap-1">
                  <Chip lang={p.lang}>{LANG_META[p.lang].label}</Chip>
                  {p.stack.slice(0, 2).map((s) => <Chip key={s}>{s}</Chip>)}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Detail({ p, onBack, onOpenCode }: { p: Project; onBack: () => void; onOpenCode: () => void }) {
  const Icon = AppIcons[LANG_META[p.lang].icon];
  return (
    <div className="selectable">
      <div className="sticky top-0 z-2 flex items-center gap-2 border-b border-line bg-surface px-3 py-2">
        <button type="button" onClick={onBack} className="grid h-8 w-8 place-items-center rounded text-fg-2 hover:bg-hover" title="Back"><Glyph.arrowLeft /></button>
        <Icon className="h-5 w-5" />
        <span className="text-[13px] font-semibold">{p.name}</span>
        <span className="ml-auto flex gap-2">
          {p.github && <LinkBtn href={p.github}><AppIcons.github className="h-4 w-4" /> GitHub</LinkBtn>}
        </span>
      </div>

      <div className="px-4 py-5 sm:px-7">
        <h2 className="text-2xl font-semibold tracking-tight">{p.name}</h2>
        <div className="mt-1 mb-3 flex flex-wrap items-center gap-1.5">
          <Chip lang={p.lang}>{LANG_META[p.lang].label}</Chip><Chip>{p.year}</Chip>
          {p.role && <span className="text-xs text-fg-3">· {p.role}</span>}
        </div>
        <p className="mb-5 max-w-[70ch] leading-relaxed text-fg-2">{p.summary}</p>

        {/* screens */}
        {p.image && (
          <div className="mb-6 grid gap-3 md:grid-cols-[1fr_auto]">
            <figure className="overflow-hidden rounded-lg border border-line-strong bg-surface-3 shadow-pop">
              <Image src={asset(p.image)} alt={`${p.name} desktop screenshot`} width={1440} height={900} sizes="(max-width: 900px) 100vw, 760px" className="h-auto w-full" priority />
              <figcaption className="border-t border-line px-3 py-1.5 text-[11px] text-fg-3">Desktop</figcaption>
            </figure>
            {p.imageMobile && (
              <figure className="mx-auto w-[180px] overflow-hidden rounded-[22px] border-[6px] border-[#1b1b1f] bg-[#1b1b1f] shadow-pop">
                <Image src={asset(p.imageMobile)} alt={`${p.name} mobile screenshot`} width={780} height={1688} sizes="180px" className="h-auto w-full rounded-[16px]" />
              </figure>
            )}
          </div>
        )}

        {p.flow === "token-router" && (
          <section className="mb-6">
            <h3 className="mb-2 text-[15px] font-semibold">How a request flows</h3>
            <div className="rounded-lg border border-line bg-surface p-3"><TokenRouterFlow /></div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {[
                ["01 · Before", "Every call sends the full chat history and RAG context to a frontier model. Tokens grow with every turn."],
                ["02 · Through the router", "Cache hits return instantly. Everything else is compressed and classified, then routed to the cheapest capable model."],
                ["03 · After", "Same answers, 40–70% fewer billed tokens. Usage and savings per API key are visible on the dashboard."],
              ].map(([t, d]) => (
                <div key={t} className="rounded-lg border border-line bg-surface px-3.5 py-3"><b className="mb-1 block text-[13px]">{t}</b><span className="text-xs text-fg-2">{d}</span></div>
              ))}
            </div>
          </section>
        )}

        <div className="grid gap-5 md:grid-cols-[1fr_260px]">
          <section>
            <h3 className="mb-2 text-[15px] font-semibold">What I did</h3>
            <ul className="list-disc pl-5 text-[13px] leading-relaxed text-fg-2">{p.highlights.map((h) => <li key={h} className="mb-1.5">{h}</li>)}</ul>
          </section>
          <aside>
            <h3 className="mb-2 text-[15px] font-semibold">Stack</h3>
            <div className="flex flex-wrap gap-1.5">{p.stack.map((s) => <Chip key={s}>{s}</Chip>)}</div>
            {p.flow && <Btn className="mt-4" onClick={onOpenCode}><AppIcons.vscode className="h-4 w-4" /> Open the router code</Btn>}
          </aside>
        </div>
      </div>
    </div>
  );
}
