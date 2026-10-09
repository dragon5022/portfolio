"use client";

/* Flow diagram for the AI Token Router: request → gateway stages → model → response.
   Pure inline SVG so it follows the theme and prints cleanly. */

const box = "fill-surface stroke-line-strong";
const label = "fill-fg text-[13px] font-semibold";
const sub = "fill-fg-3 text-[11px]";

function Stage({ x, y, w, h, title, lines, accent }: { x: number; y: number; w: number; h: number; title: string; lines: string[]; accent?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} className={box} strokeWidth={1} style={accent ? { stroke: accent } : undefined} />
      {accent && <rect x={x} y={y} width={4} height={h} rx={2} fill={accent} />}
      <text x={x + 14} y={y + 22} className={label}>{title}</text>
      {lines.map((l, i) => <text key={l} x={x + 14} y={y + 42 + i * 15} className={sub}>{l}</text>)}
    </g>
  );
}

function Arrow({ d, dashed }: { d: string; dashed?: boolean }) {
  return <path d={d} fill="none" className="stroke-fg-3" strokeWidth={1.5} strokeDasharray={dashed ? "4 4" : undefined} markerEnd="url(#arrow)" />;
}

export default function TokenRouterFlow() {
  return (
    <svg viewBox="0 0 900 420" className="h-auto w-full select-none" role="img" aria-label="AI Token Router request flow">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10z" className="fill-fg-3" />
        </marker>
      </defs>

      {/* client */}
      <Stage x={20} y={160} w={150} h={80} title="Your app / agent" lines={["OpenAI-compatible call", "base_url → token-router"]} />
      <Arrow d="M170 200 H218" />

      {/* gateway */}
      <rect x={220} y={40} width={400} height={340} rx={14} className="fill-surface-2 stroke-line-strong" strokeWidth={1} />
      <text x={240} y={66} className={label}>AI Token Router gateway</text>
      <text x={240} y={82} className={sub}>FastAPI · Redis · pgvector</text>

      <Stage x={240} y={100} w={360} h={62} title="1 · Prompt analyzer" lines={["normalise, strip boilerplate, detect task type"]} accent="#4cc2ff" />
      <Arrow d="M420 162 V180" />
      <Stage x={240} y={182} w={360} h={62} title="2 · Semantic cache" lines={["embedding similarity ≥ 0.92 → answer with 0 upstream tokens"]} accent="#6ccb5f" />
      <Arrow d="M420 244 V262" />
      <Stage x={240} y={264} w={360} h={62} title="3 · Context compressor" lines={["drop stale turns, dedupe RAG chunks, fit token budget"]} accent="#ffd43b" />
      <Arrow d="M420 326 V344" />
      <text x={420} y={364} textAnchor="middle" className={label}>4 · Cost-aware model router</text>

      {/* cache hit shortcut */}
      <Arrow d="M600 213 H660 Q690 213 690 240 V300" dashed />
      <text x={700} y={262} className={sub}>cache hit</text>

      {/* models */}
      <Arrow d="M620 352 H700 Q720 352 720 332 V110" />
      <Arrow d="M620 352 H700 Q720 352 720 332 V200" />
      <Stage x={700} y={60} w={180} h={56} title="Small model" lines={["simple tasks · cheapest"]} accent="#6ccb5f" />
      <Stage x={700} y={150} w={180} h={56} title="Frontier model" lines={["hard tasks · automatic fallback"]} accent="#c084fc" />

      {/* response */}
      <Stage x={700} y={300} w={180} h={80} title="Response + usage" lines={["tokens in / out / saved", "40–70% fewer tokens"]} accent="#ff9a5c" />
      <Arrow d="M790 116 V148" dashed />
      <Arrow d="M790 206 V298" />
    </svg>
  );
}
