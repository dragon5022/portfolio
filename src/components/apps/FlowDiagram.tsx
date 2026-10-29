"use client";

/* Workflow diagram for a backend project (see src/data/flows.ts).
   Pure inline SVG so it follows the theme and prints cleanly. */

import { useId } from "react";
import { FLOWS, type FlowId, type FlowNode, type FlowSpec } from "@/data/flows";

const box = "fill-surface stroke-line-strong";
const label = "fill-fg text-[13px] font-semibold";
const sub = "fill-fg-3 text-[11px]";

function Stage({ x, y, w, h, title, lines = [], accent }: FlowNode) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} className={box} strokeWidth={1} style={accent ? { stroke: accent } : undefined} />
      {accent && <rect x={x} y={y} width={4} height={h} rx={2} fill={accent} />}
      <text x={x + 14} y={y + 22} className={label}>{title}</text>
      {lines.map((l, i) => <text key={l} x={x + 14} y={y + 42 + i * 15} className={sub}>{l}</text>)}
    </g>
  );
}

export default function FlowDiagram({ id, className = "" }: { id: FlowId; className?: string }) {
  const spec: FlowSpec = FLOWS[id];
  const marker = `arrow-${useId().replace(/:/g, "")}`; // unique per diagram: several can share a page
  return (
    <svg viewBox={`0 0 900 ${spec.height}`} className={`h-auto w-full select-none ${className}`} role="img" aria-label={spec.label}>
      <defs>
        <marker id={marker} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10z" className="fill-fg-3" />
        </marker>
      </defs>

      {spec.groups?.map((g) => (
        <g key={g.title}>
          <rect x={g.x} y={g.y} width={g.w} height={g.h} rx={14} className="fill-surface-2 stroke-line-strong" strokeWidth={1} />
          <text x={g.x + 20} y={g.y + 26} className={label}>{g.title}</text>
          {g.sub && <text x={g.x + 20} y={g.y + 42} className={sub}>{g.sub}</text>}
        </g>
      ))}
      {spec.edges.map((e) => (
        <path key={e.d} d={e.d} fill="none" className="stroke-fg-3" strokeWidth={1.5} strokeDasharray={e.dashed ? "4 4" : undefined}
          markerEnd={e.plain ? undefined : `url(#${marker})`} markerStart={e.both ? `url(#${marker})` : undefined} />
      ))}
      {spec.nodes.map((n) => <Stage key={`${n.x},${n.y}`} {...n} />)}
      {spec.texts?.map((t) => <text key={t.text} x={t.x} y={t.y} textAnchor={t.anchor} className={t.strong ? label : sub}>{t.text}</text>)}
    </svg>
  );
}
