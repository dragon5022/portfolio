"use client";

import { useState } from "react";
import { PORTFOLIO } from "@/data/portfolio";
import type { AppProps } from "./index";

export default function Notepad({ win }: AppProps) {
  const initial = win.props.fresh ? "" : (win.props.text as string) ?? PORTFOLIO.codeSamples["README.md"]?.code ?? "";
  const [text, setText] = useState(initial);
  const [pos, setPos] = useState({ ln: 1, col: 1 });

  const updatePos = (el: HTMLTextAreaElement) => {
    const before = el.value.slice(0, el.selectionStart);
    const lines = before.split("\n");
    setPos({ ln: lines.length, col: (lines[lines.length - 1]?.length ?? 0) + 1 });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex gap-0.5 border-b border-line px-2 py-1 text-xs">
        {["File", "Edit", "View"].map((m) => <span key={m} className="rounded px-2 py-1 hover:bg-hover">{m}</span>)}
      </div>
      <textarea
        value={text} onChange={(e) => { setText(e.target.value); updatePos(e.target); }} onKeyUp={(e) => updatePos(e.currentTarget)} onClick={(e) => updatePos(e.currentTarget)}
        spellCheck={false}
        className="selectable flex-1 resize-none bg-transparent px-4 py-3 font-sans text-sm leading-relaxed text-fg outline-none"
      />
      <div className="flex gap-5 border-t border-line px-3 py-1 text-[11px] text-fg-3">
        <span>Ln {pos.ln}, Col {pos.col}</span><span>{text.length} characters</span><span className="ml-auto">100%</span><span>Windows (CRLF)</span><span>UTF-8</span>
      </div>
    </div>
  );
}
