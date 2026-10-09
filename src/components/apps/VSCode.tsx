"use client";

import { useMemo, useState } from "react";
import { PORTFOLIO } from "@/data/portfolio";
import { highlight } from "@/lib/highlight";
import { Glyph } from "@/components/icons";
import type { AppProps } from "./index";

const FILES = Object.keys(PORTFOLIO.codeSamples);
const langLabel = { java: "Java", python: "Python", md: "Markdown" } as const;
const ficoCls = { java: "text-[#f89820]", python: "text-[#4b8bbe]", md: "text-[#519aba]" } as const;
const ficoTxt = { java: "J", python: "Py", md: "M↓" } as const;

export default function VSCode({ win }: AppProps) {
  const initial = (win.props.file as string) && FILES.includes(win.props.file as string) ? (win.props.file as string) : FILES[0]!;
  const [tabs, setTabs] = useState<string[]>([initial]);
  const [active, setActive] = useState<string>(initial);
  const [panel, setPanel] = useState<"files" | "search" | "git" | "debug" | "ext">("files");

  const file = active ? PORTFOLIO.codeSamples[active] : undefined;
  const html = useMemo(() => (file ? highlight(file.code, file.lang) : ""), [file]);
  const lineCount = file ? file.code.split("\n").length : 0;

  const open = (name: string) => { if (!tabs.includes(name)) setTabs((t) => [...t, name]); setActive(name); };
  const close = (name: string) => {
    const next = tabs.filter((t) => t !== name);
    setTabs(next);
    if (active === name) setActive(next[next.length - 1] ?? "");
  };

  const act = (key: typeof panel, Icon: (p: React.SVGProps<SVGSVGElement>) => React.JSX.Element, title: string) => (
    <button type="button" title={title} onClick={() => setPanel(key)} className={`relative grid h-[46px] w-12 place-items-center text-[22px] ${panel === key ? "text-white before:absolute before:top-2 before:bottom-2 before:left-0 before:w-0.5 before:bg-white" : "text-[#858585] hover:text-white"}`}>
      <Icon className="[stroke-width:1.5]" />
    </button>
  );

  const grouped = { java: FILES.filter((f) => f.endsWith(".java")), python: FILES.filter((f) => f.endsWith(".py")), root: FILES.filter((f) => !f.endsWith(".java") && !f.endsWith(".py")) };

  return (
    <div className="flex h-full bg-[#1e1e1e] text-[13px] text-[#d4d4d4]">
      {/* activity bar */}
      <div className="flex w-12 shrink-0 flex-col items-center gap-0.5 border-r border-[#2b2b2b] bg-[#181818] pt-1.5">
        {act("files", Glyph.files, "Explorer")}{act("search", Glyph.search, "Search")}{act("git", Glyph.gitBranch, "Source Control")}{act("debug", Glyph.bug, "Run and Debug")}{act("ext", Glyph.blocks, "Extensions")}
      </div>

      {/* side bar */}
      <div className="hidden w-[210px] shrink-0 flex-col border-r border-[#2b2b2b] bg-[#181818] md:flex">
        <h6 className="m-0 px-4 py-2.5 text-[11px] font-normal tracking-[.08em] text-[#bbb] uppercase">{panel === "files" ? "Explorer" : panel === "search" ? "Search" : panel === "git" ? "Source control" : panel === "debug" ? "Run and debug" : "Extensions"}</h6>
        {panel === "files" ? (
          <div>
            <div className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold text-[#ccc]"><Glyph.chevronDown className="text-xs" /> PORTFOLIO</div>
            {(["java", "python"] as const).map((dir) => (
              <div key={dir}>
                <div className="flex items-center gap-1 py-0.5 pl-4 text-[13px] text-[#ccc]"><Glyph.chevronDown className="text-xs" /> {dir === "java" ? "src/main/java" : "src"}</div>
                {grouped[dir].map((f) => <FileRow key={f} name={f} active={active === f} onClick={() => open(f)} indent />)}
              </div>
            ))}
            {grouped.root.map((f) => <FileRow key={f} name={f} active={active === f} onClick={() => open(f)} />)}
          </div>
        ) : panel === "git" ? (
          <div className="px-4 text-xs text-[#999]"><p>On branch <b className="text-[#ccc]">main</b></p><p className="mt-2">No changes. Working tree clean.</p></div>
        ) : panel === "ext" ? (
          <div className="px-3 text-xs text-[#ccc]">{["Extension Pack for Java", "Python", "Pylance", "Spring Boot Tools", "GitLens", "Docker"].map((e) => <div key={e} className="rounded px-1 py-1.5 hover:bg-[#2a2d2e]">{e} <span className="text-[#6ccb5f]">✓</span></div>)}</div>
        ) : (
          <div className="px-4 text-xs text-[#999]">Nothing to show here — try the Explorer.</div>
        )}
      </div>

      {/* editor */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-[35px] overflow-x-auto bg-[#181818] [scrollbar-width:none]">
          {tabs.map((t) => {
            const lang = PORTFOLIO.codeSamples[t]!.lang;
            return (
              <div key={t} onClick={() => setActive(t)} className={`group flex cursor-pointer items-center gap-2 border-r border-[#2b2b2b] px-3 whitespace-nowrap ${active === t ? "border-t border-t-accent bg-[#1e1e1e] text-white" : "bg-[#181818] text-[#969696]"}`}>
                <span className={`font-mono text-[10px] font-bold ${ficoCls[lang]}`}>{ficoTxt[lang]}</span>{t}
                <button type="button" onClick={(e) => { e.stopPropagation(); close(t); }} className={`grid h-[18px] w-[18px] place-items-center rounded text-xs hover:bg-[#3a3a3a] ${active === t ? "" : "opacity-0 group-hover:opacity-100"}`}>✕</button>
              </div>
            );
          })}
        </div>
        {file ? (
          <>
            <div className="flex h-[22px] items-center gap-1.5 px-3.5 text-xs text-[#999]">portfolio <Glyph.chevronRight className="text-[10px]" /> {file.lang === "java" ? "src/main/java" : file.lang === "python" ? "src" : ""} {file.lang !== "md" && <Glyph.chevronRight className="text-[10px]" />} {active}</div>
            <div className="selectable flex flex-1 overflow-auto font-mono text-[13px] leading-[19px]">
              <div className="min-w-[52px] shrink-0 pt-1.5 pr-4 pb-5 text-right text-[#6e7681] select-none">{Array.from({ length: lineCount }, (_, i) => <div key={i}>{i + 1}</div>)}</div>
              <pre className="m-0 flex-1 pt-1.5 pr-5 pb-5 whitespace-pre [tab-size:4]" dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          </>
        ) : (
          <div className="grid flex-1 place-items-center text-center text-[#888]"><div><h2 className="mb-1 text-[26px] font-light text-[#ccc]">Visual Studio Code</h2><p>Open a file from the Explorer.</p></div></div>
        )}
        <div className="flex h-[22px] items-center gap-3.5 bg-accent-strong px-2.5 text-xs text-white">
          <span className="flex items-center gap-1"><Glyph.gitBranch /> main</span><span>⊗ 0 ⚠ 0</span>
          <span className="ml-auto flex gap-3.5">{file && <><span>Ln {lineCount}, Col 1</span><span>Spaces: 4</span><span>UTF-8</span><span>{langLabel[file.lang]}</span></>}<span>☺</span></span>
        </div>
      </div>
    </div>
  );
}

function FileRow({ name, active, onClick, indent }: { name: string; active: boolean; onClick: () => void; indent?: boolean }) {
  const lang = PORTFOLIO.codeSamples[name]!.lang;
  return (
    <button type="button" onClick={onClick} className={`flex w-full items-center gap-1.5 py-[3px] pr-2 text-left text-[13px] ${indent ? "pl-9" : "pl-6"} ${active ? "bg-[#37373d] text-white" : "text-[#ccc] hover:bg-[#2a2d2e]"}`}>
      <span className={`w-4 text-center font-mono text-[10px] font-bold ${ficoCls[lang]}`}>{ficoTxt[lang]}</span>{name}
    </button>
  );
}
