"use client";

import { useEffect, useState } from "react";
import { PORTFOLIO } from "@/data/portfolio";
import { AppIcons } from "@/components/icons";
import type { AppProps } from "./index";
import { Card, H2, P, Page } from "./ui";

export default function Skills({ win }: AppProps) {
  const groups = Object.keys(PORTFOLIO.skills);
  const [group, setGroup] = useState<string>((win.props.group as string) && groups.includes(win.props.group as string) ? (win.props.group as string) : "All");
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 60); return () => clearTimeout(t); }, []);

  const shown = group === "All" ? groups : [group];

  return (
    <Page>
      <H2>Skills</H2>
      <P>Levels are honest self-assessments of day-to-day fluency, not certifications.</P>

      <div className="mb-4 grid gap-2.5 sm:grid-cols-2">
        <Card className="flex items-center gap-3.5"><AppIcons.java className="h-9 w-9" /><div><b className="block text-sm">Java first</b><small className="text-fg-2">JVM backends, Spring, Kafka, performance tuning.</small></div></Card>
        <Card className="flex items-center gap-3.5"><AppIcons.python className="h-9 w-9" /><div><b className="block text-sm">Python daily</b><small className="text-fg-2">APIs, data pipelines, automation, MLOps.</small></div></Card>
      </div>

      <div className="mb-4 flex flex-wrap gap-1">
        {["All", ...groups].map((g) => (
          <button key={g} type="button" onClick={() => setGroup(g)} className={`relative rounded px-3 py-1.5 text-[13px] hover:bg-hover ${group === g ? "text-fg after:absolute after:inset-x-2.5 after:bottom-0 after:h-[3px] after:rounded-full after:bg-accent" : "text-fg-2"}`}>{g}</button>
        ))}
      </div>

      {shown.map((g) => (
        <section key={g} className="mb-5">
          <h3 className="mb-1 text-[15px] font-semibold">{g}</h3>
          {PORTFOLIO.skills[g]!.map((s) => (
            <div key={s.name} className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 border-b border-line py-2 text-[13px] last:border-0">
              <span>{s.name}</span>
              <span className="text-fg-3 tabular-nums">{s.level}%</span>
              <div className="col-span-2 h-1 overflow-hidden rounded bg-surface-3">
                <i className="block h-full rounded bg-linear-90 from-accent to-[#7a5cff] transition-[width] duration-900 ease-[cubic-bezier(.2,.8,.2,1)]" style={{ width: ready ? `${s.level}%` : 0 }} />
              </div>
            </div>
          ))}
        </section>
      ))}
    </Page>
  );
}
