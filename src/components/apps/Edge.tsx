"use client";

import { PORTFOLIO, LANG_META } from "@/data/portfolio";
import { useOS } from "@/lib/store";
import { AppIcons, Glyph } from "@/components/icons";

export default function Edge() {
  const { openApp } = useOS();
  const tool = "grid h-8 w-8 place-items-center rounded text-[15px] text-fg-2 hover:bg-hover disabled:opacity-35";

  const quick = [
    { label: "GitHub", href: PORTFOLIO.github, icon: <AppIcons.github className="h-7 w-7" /> },
    { label: "WhatsApp", href: `https://wa.me/${PORTFOLIO.whatsapp.replace(/\D/g, "")}`, icon: <AppIcons.whatsapp className="h-7 w-7" /> },
    { label: "Email", href: `mailto:${PORTFOLIO.email}`, icon: <AppIcons.contact className="h-7 w-7" /> },
    { label: "Portfolio", onClick: () => openApp("portfolio"), icon: <AppIcons.portfolio className="h-7 w-7" /> },
    { label: "Skills", onClick: () => openApp("skills"), icon: <AppIcons.skills className="h-7 w-7" /> },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-10 items-end gap-1 bg-surface-2 px-2 pt-1.5">
        <div className="flex h-8 min-w-[180px] items-center gap-2 rounded-t-lg bg-surface px-3 text-xs"><AppIcons.edge className="h-3.5 w-3.5" /> New tab <span className="ml-auto text-fg-3">✕</span></div>
        <button type="button" className="grid h-8 w-8 place-items-center rounded text-fg-2 hover:bg-hover"><Glyph.plus /></button>
      </div>
      <div className="flex items-center gap-1 border-b border-line bg-surface px-2 py-1.5">
        <button type="button" className={tool} disabled><Glyph.arrowLeft /></button>
        <button type="button" className={tool} disabled><Glyph.arrowRight /></button>
        <button type="button" className={tool}><Glyph.refresh /></button>
        <div className="mx-1.5 flex h-8 flex-1 items-center gap-2 rounded-full border border-line bg-surface-2 px-3 text-xs text-fg-2"><Glyph.lock className="text-[13px]" /> edge://newtab</div>
        <button type="button" className={tool}><Glyph.star /></button>
        <button type="button" className={tool}><Glyph.more /></button>
      </div>

      <div className="flex-1 overflow-auto bg-surface-2">
        <div className="mx-auto max-w-[720px] px-5 py-10 text-center">
          <div className="flex h-11 items-center gap-2.5 rounded-full border border-line-strong bg-surface px-4 text-fg-3 shadow-pop"><Glyph.search /> Search the web</div>
          <div className="mt-7 grid grid-cols-3 gap-2.5 sm:grid-cols-6">
            {quick.map((q) => q.href ? (
              <a key={q.label} href={q.href} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2 rounded-lg border border-line bg-surface px-1.5 py-3.5 text-xs text-fg hover:bg-surface-3">{q.icon}{q.label}</a>
            ) : (
              <button key={q.label} type="button" onClick={q.onClick} className="flex flex-col items-center gap-2 rounded-lg border border-line bg-surface px-1.5 py-3.5 text-xs text-fg hover:bg-surface-3">{q.icon}{q.label}</button>
            ))}
          </div>
          <div className="mt-8 grid gap-2.5 text-left sm:grid-cols-2">
            {PORTFOLIO.projects.slice(0, 4).map((p) => (
              <button key={p.id} type="button" onClick={() => openApp("portfolio", { select: p.id })} className="rounded-lg border border-line bg-surface px-4 py-3.5 text-left hover:bg-surface-3">
                <b className="mb-1 block text-[13px]">{p.name}</b>
                <span className="text-xs text-fg-2">{p.summary}</span>
                <small className="mt-1.5 block text-[11px] text-fg-3">{LANG_META[p.lang].label} · {p.year}</small>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
