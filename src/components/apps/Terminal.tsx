"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { PORTFOLIO, LANG_META, type Lang } from "@/data/portfolio";
import { useOS } from "@/lib/store";
import { APP_META, type AppId } from "@/lib/apps";
import { AppIcons } from "@/components/icons";

type Line = ReactNode;
const C = {
  accent: "text-[#61d6d6]", warn: "text-[#f9f1a5]", err: "text-[#e74856]", dim: "text-[#767676]",
  java: "text-[#f89820]", py: "text-[#ffd43b]", ok: "text-[#16c60c]", path: "text-[#3b78ff]",
};

const LOGO = String.raw`
  ____
 |  _ \ _ __ __ _  __ _  ___  _ __
 | | | | '__/ _\` |/ _\` |/ _ \| '_ \
 | |_| | | | (_| | (_| | (_) | | | |
 |____/|_|  \__,_|\__, |\___/|_| |_|
                  |___/             `;

export default function Terminal() {
  const { state, dispatch, openApp } = useOS();
  const user = state.user.handle || "dev";
  const [cwd, setCwd] = useState("~");
  const [lines, setLines] = useState<Line[]>(() => [
    <div key="w1">Portfolio Terminal [Version 11.0.{new Date().getFullYear()}]</div>,
    <div key="w2" className={C.dim}>(c) {state.user.name}. All rights reserved.</div>,
    <div key="w3">&nbsp;</div>,
    <div key="w4">Type <span className={C.accent}>help</span> to see available commands.</div>,
    <div key="w5">&nbsp;</div>,
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const seq = useRef(0);

  const prompt = (
    <span><span className={C.ok}>{user}@portfolio</span><span className={C.dim}>:</span><span className={C.path}>{cwd}</span><span className={C.dim}>$ </span></span>
  );

  useEffect(() => { bottomRef.current?.scrollIntoView({ block: "end" }); }, [lines]);

  const push = (...ls: Line[]) => setLines((prev) => [...prev, ...ls.map((l, i) => <div key={`${seq.current++}-${i}`} className="whitespace-pre-wrap break-words">{l}</div>)]);

  const run = (raw: string) => {
    const cmdline = raw.trim();
    push(<span>{prompt}{cmdline}</span>);
    if (!cmdline) return;
    setHistory((h) => [cmdline, ...h].slice(0, 50));
    const [cmd, ...args] = cmdline.split(/\s+/);
    const arg = args.join(" ");

    switch (cmd!.toLowerCase()) {
      case "help":
        push(
          <span className={C.accent}>Available commands</span>,
          "  about            Who I am",
          "  skills           Tech stack overview",
          "  portfolio        Open the Portfolio app (screenshots + flows)",
          "  projects         List projects        (projects web | game | ai | java | python)",
          "  project <id>     Project details",
          "  contact          How to reach me (email, WhatsApp, GitHub)",
          "  guestbook        Leave a public message / review",
          "  open <app>       Open an app: " + (Object.keys(APP_META) as AppId[]).join(", "),
          "  ls / cd / cat    Browse the fake filesystem",
          "  java -version    python --version    mvn / pip / git ...",
          "  neofetch         System info",
          "  theme dark|light Switch theme",
          "  clear            Clear the screen",
          "  crash            Do not run this.",
        );
        break;
      case "about":
        push(<span className={C.accent}>{PORTFOLIO.name} — {PORTFOLIO.title}</span>, ...PORTFOLIO.bio.map((b) => `  ${b}`));
        break;
      case "skills":
        Object.entries(PORTFOLIO.skills).forEach(([g, list]) => {
          push(<span className={C.warn}>{g}</span>);
          list.forEach((s) => push(`  ${s.name.padEnd(36)} ${"█".repeat(Math.round(s.level / 10)).padEnd(10, "░")} ${s.level}%`));
        });
        break;
      case "projects": {
        const filter = arg.toLowerCase();
        const list = PORTFOLIO.projects.filter((p) => !filter || p.lang === filter);
        if (!list.length) { push(<span className={C.err}>No projects for &quot;{arg}&quot;. Try: projects web | game | ai | java | python</span>); break; }
        const langCls: Record<Lang, string> = { java: C.java, python: C.py, web: C.accent, game: C.ok, ai: "text-[#c084fc]" };
        list.forEach((p) => push(<span><span className={langCls[p.lang]}>[{p.lang}]</span> <span className={C.accent}>{p.id.padEnd(14)}</span> {p.name} — {p.summary}</span>));
        push(<span className={C.dim}>Use: project &lt;id&gt;</span>);
        break;
      }
      case "project": {
        const p = PORTFOLIO.projects.find((x) => x.id === arg.toLowerCase());
        if (!p) { push(<span className={C.err}>Unknown project &quot;{arg}&quot;. Run `projects` to list ids.</span>); break; }
        push(<span className={C.accent}>{p.name} ({p.year})</span>, `  ${p.summary}`, ...(p.role ? [`  Role:  ${p.role}`] : []), <span>  Stack: <span className={C.warn}>{p.stack.join(", ")}</span></span>, ...p.highlights.map((h) => `  • ${h}`), ...(p.github ? [`  ${p.github}`] : []), <span className={C.dim}>Tip: `portfolio` opens screenshots and flows.</span>);
        break;
      }
      case "guestbook": case "review":
        dispatch({ type: "GUESTBOOK", open: true });
        push(<span className={C.dim}>Opening the guestbook…</span>);
        break;
      case "portfolio":
        openApp("portfolio", arg ? { select: arg } : undefined);
        push(<span className={C.dim}>Opening Portfolio…</span>);
        break;
      case "contact":
        push(`  Email:    ${PORTFOLIO.email}`, `  WhatsApp: ${PORTFOLIO.whatsappDisplay}  (https://wa.me/${PORTFOLIO.whatsapp.replace(/\D/g, "")})`, `  GitHub:   ${PORTFOLIO.github}`, ...(PORTFOLIO.linkedin ? [`  LinkedIn: ${PORTFOLIO.linkedin}`] : []));
        break;
      case "open": {
        const id = arg.toLowerCase() as AppId;
        if (APP_META[id]) { openApp(id); push(<span className={C.dim}>Opening {APP_META[id].label}…</span>); }
        else push(<span className={C.err}>Unknown app &quot;{arg}&quot;.</span>);
        break;
      }
      case "ls":
      case "dir":
        if (cwd === "~") push(<span><span className={C.path}>projects/  documents/  code/</span>  README.md  .bashrc</span>);
        else if (cwd === "~/projects") push(<span className={C.path}>{Object.keys(LANG_META).map((l) => l + "/").join("  ")}</span>);
        else if (cwd.startsWith("~/projects/") && LANG_META[cwd.slice(11) as Lang]) push(PORTFOLIO.projects.filter((p) => p.lang === cwd.slice(11)).map((p) => p.id + "/").join("  ") || "(empty)");
        else if (cwd === "~/code") push(Object.keys(PORTFOLIO.codeSamples).join("  "));
        else if (cwd === "~/documents") push("README.md");
        else push("");
        break;
      case "cd": {
        const target = arg || "~";
        const map: Record<string, string> = { "~": "~", "..": cwd.split("/").slice(0, -1).join("/") || "~", projects: "~/projects", code: "~/code", documents: "~/documents", ...Object.fromEntries(Object.keys(LANG_META).map((l) => [l, `~/projects/${l}`])) };
        const next = map[target] ?? (target.startsWith("~/") ? target : null);
        if (next) setCwd(next); else push(<span className={C.err}>cd: no such directory: {target}</span>);
        break;
      }
      case "pwd": push(cwd.replace("~", `/home/${user}`)); break;
      case "cat": {
        const f = PORTFOLIO.codeSamples[arg];
        if (f) push(<pre className="m-0 font-mono">{f.code}</pre>);
        else if (arg === "README.md") push(<pre className="m-0 font-mono">{PORTFOLIO.codeSamples["README.md"]?.code}</pre>);
        else push(<span className={C.err}>cat: {arg || "file"}: No such file</span>);
        break;
      }
      case "whoami": push(user); break;
      case "date": push(new Date().toString()); break;
      case "echo": push(arg); break;
      case "history": push(...history.slice().reverse().map((h, i) => `  ${i + 1}  ${h}`)); break;
      case "clear": case "cls": setLines([]); break;
      case "java":
        if (args[0] === "-version" || args[0] === "--version") push(<span className={C.java}>openjdk version &quot;21.0.4&quot; 2024-07-16 LTS</span>, "OpenJDK Runtime Environment Temurin-21.0.4+7 (build 21.0.4+7-LTS)", "OpenJDK 64-Bit Server VM Temurin-21.0.4+7 (build 21.0.4+7-LTS, mixed mode, sharing)");
        else push(<span className={C.err}>Error: Could not find or load main class {args[0] ?? ""}</span>, <span className={C.dim}>Tip: java -version</span>);
        break;
      case "javac": push(<span className={C.java}>javac 21.0.4</span>); break;
      case "mvn": push(<span className={C.java}>[INFO] Scanning for projects...</span>, "[INFO] BUILD SUCCESS", "[INFO] Total time:  4.213 s"); break;
      case "gradle": push(<span className={C.java}>BUILD SUCCESSFUL in 3s</span>, "5 actionable tasks: 5 executed"); break;
      case "python": case "python3":
        if (args[0] === "--version" || args[0] === "-V") push(<span className={C.py}>Python 3.12.6</span>);
        else push(<span className={C.py}>Python 3.12.6 (main) [GCC 13.2.0] on linux</span>, <span className={C.dim}>&gt;&gt;&gt; import this  # (REPL not implemented — but the Zen still applies)</span>);
        break;
      case "pip": push(<span className={C.py}>fastapi 0.115  pandas 2.2  sqlalchemy 2.0  pytest 8.3  hypothesis 6.112</span>); break;
      case "pytest": push(<span className={C.ok}>============ 128 passed, 3 skipped in 4.21s ============</span>); break;
      case "git":
        if (args[0] === "status") push("On branch main", "Your branch is up to date with 'origin/main'.", <span className={C.ok}>nothing to commit, working tree clean</span>);
        else if (args[0] === "log") push(<span className={C.warn}>a1b2c3d</span>, "  feat: ship portfolio OS in Next.js + Tailwind", <span className={C.warn}>9f8e7d6</span>, "  perf: virtual threads in LedgerFlow hot path");
        else push("usage: git [status|log]");
        break;
      case "docker": push("CONTAINER ID   IMAGE                 STATUS", "3f1a2b9c0d4e   ledgerflow:latest     Up 3 days", "7c6d5e4f3a2b   pyquery-lab:latest    Up 3 days"); break;
      case "theme":
        if (arg === "dark" || arg === "light") { dispatch({ type: "THEME", theme: arg }); push(<span className={C.dim}>Theme set to {arg}.</span>); }
        else push("usage: theme dark|light");
        break;
      case "neofetch":
        push(
          <div className="flex gap-5">
            <pre className="m-0 text-[11px] leading-tight text-[#4cc2ff]">{LOGO}</pre>
            <div className="text-[13px]">
              <div><span className="font-semibold text-[#4cc2ff]">{user}</span>@portfolio-os</div>
              <div className={C.dim}>---------------------</div>
              <div><b className="text-[#4cc2ff]">OS:</b> Portfolio OS 11 (Next.js + Tailwind)</div>
              <div><b className="text-[#4cc2ff]">Host:</b> {PORTFOLIO.location}</div>
              <div><b className="text-[#4cc2ff]">Kernel:</b> React 19 · App Router</div>
              <div><b className="text-[#4cc2ff]">Shell:</b> portfolio-sh 1.0</div>
              <div><b className="text-[#4cc2ff]">Languages:</b> <span className={C.java}>Java 21</span>, <span className={C.py}>Python 3.12</span>, TypeScript</div>
              <div><b className="text-[#4cc2ff]">Frameworks:</b> Spring Boot, FastAPI, Next.js, Unity</div>
              <div><b className="text-[#4cc2ff]">Product:</b> AI Token Router (40–70% fewer tokens)</div>
              <div><b className="text-[#4cc2ff]">Projects:</b> {PORTFOLIO.projects.length} featured</div>
              <div><b className="text-[#4cc2ff]">Uptime:</b> {Math.round(performance.now() / 1000)}s</div>
              <div className="mt-2 flex">{["#0c0c0c", "#c50f1f", "#13a10e", "#c19c00", "#0037da", "#881798", "#3a96dd", "#cccccc"].map((c) => <i key={c} className="h-3 w-5" style={{ background: c }} />)}</div>
            </div>
          </div>,
        );
        break;
      case "sudo": push(<span className={C.err}>{user} is not in the sudoers file. This incident will be reported.</span>); break;
      case "coffee": push("☕ Brewing… done. Productivity +20%."); break;
      case "exit": {
        const w = state.windows.find((x) => x.app === "terminal");
        if (w) dispatch({ type: "CLOSE", id: w.id });
        break;
      }
      case "crash": case "bsod": case "rm":
        push(<span className={C.err}>Fatal: CoffeeOverflow.sys has stopped responding…</span>);
        setTimeout(() => dispatch({ type: "PHASE", phase: "bsod" }), 700);
        break;
      default:
        push(<span className={C.err}>&apos;{cmd}&apos; is not recognized as an internal or external command. Type `help`.</span>);
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { run(input); setInput(""); setHIdx(-1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); const i = Math.min(history.length - 1, hIdx + 1); setHIdx(i); setInput(history[i] ?? ""); }
    else if (e.key === "ArrowDown") { e.preventDefault(); const i = Math.max(-1, hIdx - 1); setHIdx(i); setInput(i === -1 ? "" : history[i] ?? ""); }
    else if (e.key === "l" && e.ctrlKey) { e.preventDefault(); setLines([]); }
    else if (e.key === "Tab") {
      e.preventDefault();
      const cmds = ["help", "about", "skills", "portfolio", "projects", "project", "contact", "open", "neofetch", "clear", "theme", "java -version", "python --version"];
      const m = cmds.find((c) => c.startsWith(input));
      if (m) setInput(m);
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#0c0c0c] text-[#ccc]">
      <div className="flex h-9 items-center border-b border-[#333] bg-[#1f1f1f] pl-1.5 text-xs">
        <div className="flex h-[30px] items-center gap-2 rounded-t-md bg-[#0c0c0c] px-3"><AppIcons.terminal className="h-3.5 w-3.5" /> {user}@portfolio: {cwd}</div>
        <div className="grid h-[30px] w-[30px] place-items-center text-base text-[#aaa]">+</div>
      </div>
      <div className="selectable flex-1 cursor-text overflow-auto px-3.5 py-2.5 font-mono text-[13px] leading-[1.45]" onClick={() => inputRef.current?.focus()}>
        {lines}
        <div className="flex">
          {prompt}
          <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKey} autoFocus spellCheck={false} autoComplete="off"
            className="flex-1 bg-transparent p-0 font-mono text-inherit caret-[#ccc] outline-none" aria-label="Terminal input" />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
