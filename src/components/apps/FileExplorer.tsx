"use client";

import { useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import { PORTFOLIO, LANG_META, type Lang, type Project } from "@/data/portfolio";
import { useOS } from "@/lib/store";
import { AppIcons, Glyph } from "@/components/icons";
import type { AppId } from "@/lib/apps";
import type { AppProps } from "./index";
import { Btn, Chip, LinkBtn } from "./ui";
import { asset } from "@/lib/paths";

/* ---------- Virtual file system ---------- */
type Node =
  | { kind: "folder"; name: string; icon: keyof typeof AppIcons; children: Node[]; modified: string }
  | { kind: "project"; name: string; project: Project; modified: string }
  | { kind: "file"; name: string; icon: keyof typeof AppIcons; type: string; size: string; modified: string; open: { app: AppId; props?: Record<string, unknown>; title?: string } };

const projNode = (p: Project): Node => ({ kind: "project", name: p.name, project: p, modified: `${p.year}` });

const FS: Node = {
  kind: "folder", name: "This PC", icon: "explorer", modified: "", children: [
    {
      kind: "folder", name: "Projects", icon: "projects", modified: "2025",
      children: (Object.keys(LANG_META) as Lang[]).map((lang) => ({
        kind: "folder" as const, name: LANG_META[lang].folder, icon: LANG_META[lang].icon, modified: "2025",
        children: PORTFOLIO.projects.filter((p) => p.lang === lang).map(projNode),
      })),
    },
    {
      kind: "folder", name: "Documents", icon: "projects", modified: "2025", children: [
        { kind: "file", name: "README.md", icon: "notepad", type: "Markdown", size: "2 KB", modified: "2025", open: { app: "notepad" } },
        { kind: "file", name: "dragon5022", icon: "about", type: "Shortcut", size: "1 KB", modified: "2025", open: { app: "about" } },
      ],
    },
    {
      kind: "folder", name: "Code", icon: "vscode", modified: "2025",
      children: Object.entries(PORTFOLIO.codeSamples).map(([name, s]) => ({
        kind: "file" as const, name, icon: (s.lang === "java" ? "java" : s.lang === "python" ? "python" : "notepad") as keyof typeof AppIcons,
        type: s.lang === "java" ? "Java Source" : s.lang === "python" ? "Python Source" : "Markdown", size: `${Math.round(s.code.length / 100) / 10} KB`, modified: "2025",
        open: { app: "vscode", props: { file: name } },
      })),
    },
    { kind: "file", name: "Skills", icon: "skills", type: "Application", size: "—", modified: "2025", open: { app: "skills" } },
    { kind: "file", name: "Contact", icon: "contact", type: "Application", size: "—", modified: "2025", open: { app: "contact" } },
  ],
};

function resolve(path: string[]): Node | null {
  let node: Node = FS;
  for (const seg of path) {
    if (node.kind !== "folder") return null;
    const next = node.children.find((c) => c.name === seg);
    if (!next) return null;
    node = next;
  }
  return node;
}

const nodeIcon = (n: Node): keyof typeof AppIcons => n.kind === "project" ? LANG_META[n.project.lang].icon : n.icon;
const nodeType = (n: Node) => n.kind === "folder" ? "File folder" : n.kind === "project" ? `${LANG_META[n.project.lang].label} project` : n.type;

/* ---------- Component ---------- */
export default function FileExplorer({ win }: AppProps) {
  const { openApp } = useOS();
  const folder = win.props.folder as Lang | undefined;
  const initial = win.app === "projects" ? (folder && LANG_META[folder] ? ["Projects", LANG_META[folder].folder] : ["Projects"]) : [];

  const [hist, setHist] = useState<{ stack: string[][]; i: number }>({ stack: [initial], i: 0 });
  const path = hist.stack[hist.i]!;
  const [selected, setSelected] = useState<string | null>((win.props.select as string) ? PORTFOLIO.projects.find((p) => p.id === win.props.select)?.name ?? null : null);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [q, setQ] = useState("");

  const node = resolve(path) ?? FS;
  const children = useMemo(() => (node.kind === "folder" ? node.children : []).filter((c) => c.name.toLowerCase().includes(q.toLowerCase())), [node, q]);
  const sel = children.find((c) => c.name === selected) ?? null;

  const navigate = (p: string[]) => { setHist((h) => ({ stack: [...h.stack.slice(0, h.i + 1), p], i: h.i + 1 })); setSelected(null); setQ(""); };
  const back = () => setHist((h) => ({ ...h, i: Math.max(0, h.i - 1) }));
  const fwd = () => setHist((h) => ({ ...h, i: Math.min(h.stack.length - 1, h.i + 1) }));
  const up = () => path.length && navigate(path.slice(0, -1));

  const open = (n: Node) => {
    if (n.kind === "folder") navigate([...path, n.name]);
    else if (n.kind === "file") openApp(n.open.app, n.open.props, n.open.title);
    else setSelected(n.name);
  };

  const side: { label: string; icon: ReactNode; path: string[]; stroke?: boolean }[] = [
    { label: "Home", icon: <Glyph.home />, path: [], stroke: true },
    { label: "Projects", icon: <AppIcons.projects />, path: ["Projects"] },
    ...(Object.keys(LANG_META) as Lang[]).map((lang) => {
      const Icon = AppIcons[LANG_META[lang].icon];
      return { label: LANG_META[lang].folder, icon: <Icon />, path: ["Projects", LANG_META[lang].folder] };
    }),
    { label: "Documents", icon: <AppIcons.projects />, path: ["Documents"] },
    { label: "Code", icon: <AppIcons.vscode />, path: ["Code"] },
  ];

  const tool = "grid h-8 w-8 place-items-center rounded text-[15px] text-fg-2 hover:bg-hover disabled:cursor-default disabled:opacity-35";

  return (
    <div className="flex h-full flex-col select-none">
      {/* nav bar */}
      <div className="flex items-center gap-1 border-b border-line px-2.5 py-2">
        <button type="button" className={tool} onClick={back} disabled={hist.i === 0} title="Back"><Glyph.arrowLeft /></button>
        <button type="button" className={tool} onClick={fwd} disabled={hist.i >= hist.stack.length - 1} title="Forward"><Glyph.arrowRight /></button>
        <button type="button" className={tool} onClick={up} disabled={path.length === 0} title="Up"><Glyph.arrowUp /></button>
        <button type="button" className={tool} onClick={() => setQ("")} title="Refresh"><Glyph.refresh /></button>
        <div className="mx-1.5 flex h-8 flex-1 items-center gap-1 overflow-hidden rounded border border-line bg-surface px-2.5 text-xs whitespace-nowrap">
          <AppIcons.explorer className="h-4 w-4" />
          <button type="button" onClick={() => navigate([])} className="rounded px-1 hover:bg-hover">This PC</button>
          {path.map((seg, i) => (
            <span key={seg} className="flex items-center gap-1">
              <Glyph.chevronRight className="text-[10px] text-fg-3" />
              <button type="button" onClick={() => navigate(path.slice(0, i + 1))} className="rounded px-1 hover:bg-hover">{seg}</button>
            </span>
          ))}
        </div>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${node.name}`} className="hidden h-8 w-44 rounded border border-line bg-surface px-2.5 text-xs outline-none placeholder:text-fg-3 sm:block" />
      </div>

      {/* command bar */}
      <div className="flex gap-0.5 border-b border-line px-2.5 py-1.5 text-xs">
        <button type="button" className="flex items-center gap-1.5 rounded px-2.5 py-1.5 text-fg-2 hover:bg-hover"><Glyph.plus /> New</button>
        <span className="mx-1 w-px bg-line" />
        <button type="button" onClick={() => setView("grid")} className={`flex items-center gap-1.5 rounded px-2.5 py-1.5 hover:bg-hover ${view === "grid" ? "bg-active text-fg" : "text-fg-2"}`}><Glyph.grid /> Icons</button>
        <button type="button" onClick={() => setView("list")} className={`flex items-center gap-1.5 rounded px-2.5 py-1.5 hover:bg-hover ${view === "list" ? "bg-active text-fg" : "text-fg-2"}`}><Glyph.list /> Details</button>
        <span className="mx-1 w-px bg-line" />
        <button type="button" className="flex items-center gap-1.5 rounded px-2.5 py-1.5 text-fg-2 hover:bg-hover"><Glyph.more /></button>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* sidebar */}
        <aside className="hidden w-[190px] shrink-0 overflow-auto border-r border-line p-2 md:block">
          {side.map((s) => {
            const active = s.path.join("/") === path.join("/");
            return (
              <button key={s.label} type="button" onClick={() => navigate(s.path)} className={`flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-xs hover:bg-hover ${active ? "bg-active" : ""} [&>svg]:h-4 [&>svg]:w-4 ${s.stroke ? "[&>svg]:text-accent" : ""}`}>
                {s.icon}{s.label}
              </button>
            );
          })}
          <div className="px-2.5 pt-3 pb-1 text-[11px] font-semibold text-fg-3">Quick access</div>
          <button type="button" onClick={() => openApp("terminal")} className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-xs hover:bg-hover [&>svg]:h-4 [&>svg]:w-4"><AppIcons.terminal /> Terminal</button>
        </aside>

        {/* content */}
        <div className="flex-1 overflow-auto p-2" onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}>
          {children.length === 0 && <div className="py-16 text-center text-fg-3">This folder is empty.</div>}
          {view === "grid" ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(112px,1fr))] gap-1">
              {children.map((c) => {
                const Icon = AppIcons[nodeIcon(c)];
                return (
                  <button key={c.name} type="button" onClick={() => setSelected(c.name)} onDoubleClick={() => open(c)}
                    onPointerUp={(e) => { if (e.pointerType === "touch") open(c); }}
                    className={`flex flex-col items-center gap-1.5 rounded border px-1.5 py-3 text-center text-xs ${selected === c.name ? "border-line-strong bg-active" : "border-transparent hover:bg-hover"}`}>
                    <Icon className="h-12 w-12" /><span className="line-clamp-2 leading-snug">{c.name}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <table className="w-full border-collapse text-xs">
              <thead><tr className="text-left text-fg-3">{["Name", "Date modified", "Type", "Size"].map((h) => <th key={h} className="border-b border-line px-2.5 py-1.5 font-normal">{h}</th>)}</tr></thead>
              <tbody>
                {children.map((c) => {
                  const Icon = AppIcons[nodeIcon(c)];
                  return (
                    <tr key={c.name} onClick={() => setSelected(c.name)} onDoubleClick={() => open(c)} className={`cursor-default ${selected === c.name ? "bg-active" : "hover:bg-hover"}`}>
                      <td className="flex items-center gap-2 px-2.5 py-1.5"><Icon className="h-5 w-5" />{c.name}</td>
                      <td className="px-2.5 py-1.5 text-fg-2">{c.modified}</td>
                      <td className="px-2.5 py-1.5 text-fg-2">{nodeType(c)}</td>
                      <td className="px-2.5 py-1.5 text-fg-2">{c.kind === "file" ? c.size : ""}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* preview pane */}
        {sel && sel.kind === "project" && <ProjectPreview p={sel.project} />}
      </div>

      <div className="flex gap-4 border-t border-line px-3 py-1 text-[11px] text-fg-3">
        <span>{children.length} items</span>{sel && <span>1 item selected</span>}
      </div>
    </div>
  );
}

function ProjectPreview({ p }: { p: Project }) {
  const { openApp } = useOS();
  const Icon = AppIcons[LANG_META[p.lang].icon];
  const sample = p.flow ? "token_router.py" : Object.entries(PORTFOLIO.codeSamples).find(([, s]) => s.lang === p.lang)?.[0];
  return (
    <aside className="selectable hidden w-[300px] shrink-0 overflow-auto border-l border-line p-4 text-xs lg:block">
      {p.image ? (
        <div className="mb-2 overflow-hidden rounded-md border border-line-strong bg-surface-3">
          <Image src={asset(p.image)} alt={`${p.name} screenshot`} width={1440} height={900} sizes="268px" className="h-auto w-full" />
        </div>
      ) : (
        <Icon className="h-16 w-16" />
      )}
      <h4 className="mt-2 mb-1 text-sm font-semibold">{p.name}</h4>
      <div className="mb-2 flex flex-wrap gap-1"><Chip lang={p.lang}>{LANG_META[p.lang].label}</Chip><Chip>{p.year}</Chip></div>
      {p.role && <p className="mb-1 text-fg-3">{p.role}</p>}
      <p className="text-fg-2">{p.summary}</p>
      <h5 className="mt-3 mb-1 font-semibold">Highlights</h5>
      <ul className="list-disc pl-4 text-fg-2">{p.highlights.map((h) => <li key={h} className="mb-1">{h}</li>)}</ul>
      <h5 className="mt-3 mb-1 font-semibold">Stack</h5>
      <div className="flex flex-wrap gap-1">{p.stack.map((s) => <Chip key={s}>{s}</Chip>)}</div>
      <div className="mt-4 flex flex-col gap-1.5">
        <Btn variant="primary" onClick={() => openApp("portfolio", { select: p.id })}><AppIcons.portfolio className="h-4 w-4" /> Open in Portfolio</Btn>
        {p.github && <LinkBtn href={p.github}><AppIcons.github className="h-4 w-4" /> View on GitHub</LinkBtn>}
        {sample && <Btn onClick={() => openApp("vscode", { file: sample })}><AppIcons.vscode className="h-4 w-4" /> Open a code sample</Btn>}
      </div>
    </aside>
  );
}
