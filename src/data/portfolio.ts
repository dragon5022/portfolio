/* =========================================================================
   PORTFOLIO DATA — edit this file to make the site yours.
   Every app (About, Portfolio, Projects, Skills, Contact, Terminal,
   VS Code) renders from this object.
   ========================================================================= */

export type Lang = "web" | "game" | "ai" | "java" | "python";

export interface Project {
  id: string;
  name: string;
  lang: Lang;
  year: number;
  role?: string;
  stack: string[];
  summary: string;
  highlights: string[];
  github?: string;
  url?: string;
  /** screenshots under /public (desktop + optional mobile) */
  image?: string;
  imageMobile?: string;
  /** render a built-in flow diagram in the detail view */
  flow?: "token-router";
  featured?: boolean;
}

export interface Skill { name: string; level: number }
export interface CodeSample { lang: "java" | "python" | "md"; code: string }

/** Folder / chip metadata for each project category */
export const LANG_META: Record<Lang, { label: string; folder: string; icon: "web" | "game" | "ai" | "java" | "python" }> = {
  web: { label: "Web", folder: "Web", icon: "web" },
  game: { label: "Apps & Games", folder: "Apps & Games", icon: "game" },
  ai: { label: "AI Tools", folder: "AI Tools", icon: "ai" },
  java: { label: "Java", folder: "Java", icon: "java" },
  python: { label: "Python", folder: "Python", icon: "python" },
};

export const PORTFOLIO = {
  name: "dragon5022",
  handle: "dragon5022", // terminal user + GitHub id
  title: "Full-Stack Developer · Java & Python",
  tagline: "I build web platforms, mobile games and AI tooling, with Java and Python at the core of my backend work.",
  location: "Remote · worldwide",
  email: "masterdev09092@gmail.com",
  whatsapp: "+15738600814",
  whatsappDisplay: "+1 573 860 0814",
  github: "https://github.com/dragon5022",
  linkedin: "", // leave empty to hide
  avatar: "/avatar.png",

  bio: [
    "A full-stack developer who has shipped production work for studios and startups around the world: luxury fitness platforms, design-studio showcases, a rental marketplace, a national broadcaster, and an AI observability company.",
    "On the backend I live in Java (Spring Boot, Kafka, JPA) and Python (FastAPI, Django, data pipelines). On the frontend I ship Next.js, React and WebGL experiences. I have also built and operated mobile apps and real-money casino games, including the DominoClub platform.",
    "My own product is an AI Token Router: a gateway that sits in front of LLM APIs and cuts token usage by 40–70% through semantic caching, context compression and smart model routing, without changing the apps that call it.",
  ],

  highlights: [
    { label: "Years coding", value: "6+" },
    { label: "Sites & apps shipped", value: "30+" },
    { label: "Mobile games live", value: "12" },
    { label: "Token cost saved", value: "40–70%" },
  ],

  skills: {
    Languages: [
      { name: "Java 21", level: 92 },
      { name: "Python 3.12", level: 90 },
      { name: "TypeScript / JavaScript", level: 88 },
      { name: "SQL", level: 82 },
      { name: "Kotlin / Swift", level: 62 },
    ],
    "Java ecosystem": [
      { name: "Spring Boot / Spring Cloud", level: 90 },
      { name: "Hibernate / JPA", level: 85 },
      { name: "Maven & Gradle", level: 85 },
      { name: "JUnit 5 / Mockito / Testcontainers", level: 88 },
      { name: "Apache Kafka", level: 75 },
    ],
    "Python ecosystem": [
      { name: "FastAPI / Django", level: 88 },
      { name: "Pandas / NumPy", level: 85 },
      { name: "SQLAlchemy / Alembic", level: 80 },
      { name: "pytest / Hypothesis", level: 86 },
      { name: "asyncio / Celery", level: 74 },
    ],
    "Web & mobile": [
      { name: "Next.js / React", level: 90 },
      { name: "Tailwind CSS / GSAP / Three.js", level: 82 },
      { name: "React Native / Flutter", level: 78 },
      { name: "Unity / Cocos (mobile games)", level: 72 },
      { name: "WordPress / headless CMS", level: 70 },
    ],
    "AI & infrastructure": [
      { name: "LLM APIs (OpenAI, Anthropic, Gemini)", level: 88 },
      { name: "Vector search / semantic caching", level: 80 },
      { name: "Docker & Kubernetes", level: 80 },
      { name: "PostgreSQL / Redis", level: 84 },
      { name: "AWS / Vercel / GitHub Actions", level: 80 },
    ],
  } as Record<string, Skill[]>,

  projects: [
    {
      id: "token-router",
      name: "AI Token Router",
      lang: "ai",
      year: 2025,
      role: "Creator · architecture, backend, SDKs",
      stack: ["Python", "FastAPI", "Redis", "pgvector", "OpenAI / Anthropic APIs", "Docker"],
      summary: "A drop-in gateway for LLM APIs that reduces token usage by 40–70% with semantic caching, context compression and cost-aware model routing.",
      highlights: [
        "Semantic cache answers repeated or near-duplicate prompts instantly (embedding similarity + TTL), with zero upstream tokens.",
        "Context compressor trims history, deduplicates RAG chunks and strips boilerplate before the request leaves the gateway.",
        "Router classifies each request and sends simple tasks to small, cheap models and hard tasks to frontier models; falls back automatically.",
        "OpenAI-compatible endpoint: change one base URL and existing apps keep working. Per-key usage and savings dashboards.",
      ],
      github: "https://github.com/dragon5022",
      flow: "token-router",
      featured: true,
    },
    {
      id: "dominoclub",
      name: "DominoClub",
      lang: "game",
      year: 2024,
      role: "Lead developer · game client, matchmaking, payments",
      stack: ["Unity", "C#", "Node.js", "WebSocket", "PostgreSQL", "Pix payments"],
      summary: "Real-money competitive domino platform for Brazil (dominoclub.com.br): mobile game client, real-time tables, tournaments and instant Pix deposits.",
      highlights: [
        "Authoritative game server with real-time WebSocket tables, reconnection and anti-fraud controls.",
        "Matchmaking, ranked ladders and tournaments; bots fill tables during low traffic.",
        "Pix integration for deposits and withdrawals with KYC and 18+ verification.",
        "One of 12 mobile casino / card games I have shipped to the stores.",
      ],
      url: "https://dominoclub.com.br/",
      image: "/portfolio/dominoclub.jpg",
      imageMobile: "/portfolio/dominoclub-mobile.jpg",
      featured: true,
    },
    {
      id: "formapilates",
      name: "Forma Pilates",
      lang: "web",
      year: 2025,
      role: "Full-stack developer",
      stack: ["Next.js", "React", "TypeScript", "Video streaming", "Subscriptions"],
      summary: "Luxury in-studio and online Pilates platform: 1,000+ on-demand workouts, guided programs, memberships and studio booking.",
      highlights: [
        "Subscription paywall and free-trial funnel with Stripe-style billing.",
        "On-demand video library with programs, filters and progress tracking.",
        "Editorial landing pages with press features (Vogue, NYT, Forbes).",
      ],
      url: "https://formapilates.co/",
      image: "/portfolio/formapilates.jpg",
      imageMobile: "/portfolio/formapilates-mobile.jpg",
      featured: true,
    },
    {
      id: "lue-studio",
      name: "Lué Studio",
      lang: "web",
      year: 2025,
      role: "Creative front-end developer",
      stack: ["Next.js", "Tailwind CSS", "PixiJS", "GSAP", "Shaders"],
      summary: "Award-style showcase site for a design & development studio: animated sky, clouds and typography built with WebGL and scroll-driven motion.",
      highlights: [
        "PixiJS / shader-driven cloud and moon scene that stays smooth on mobile.",
        "Scroll-linked storytelling with GSAP timelines and custom easing.",
        "Fully responsive art direction down to small phones.",
      ],
      url: "https://lue.studio/",
      image: "/portfolio/lue-studio.jpg",
      imageMobile: "/portfolio/lue-studio-mobile.jpg",
      featured: true,
    },
    {
      id: "nabo",
      name: "Nabo",
      lang: "web",
      year: 2024,
      role: "Full-stack & mobile developer",
      stack: ["Next.js", "React Native", "Node.js", "PostgreSQL", "Maps / geolocation"],
      summary: "Social network meets rental marketplace: rent what you need, lend what you don't, inside your neighbourhood. Web landing plus iOS & Android apps.",
      highlights: [
        "Marketplace listings with daily pricing, availability calendar and secure checkout.",
        "Neighbourhood feed, messaging and trust/rating system.",
        "Shared TypeScript domain models between web, API and mobile apps.",
      ],
      url: "https://www.nabo.ing/",
      image: "/portfolio/nabo.jpg",
      imageMobile: "/portfolio/nabo-mobile.jpg",
      featured: true,
    },
    {
      id: "france-tv",
      name: "france.tv",
      lang: "web",
      year: 2024,
      role: "Front-end developer (contract)",
      stack: ["Next.js", "Vue", "TypeScript", "Video players", "Accessibility"],
      summary: "Replay and live streaming portal of France Télévisions: catalogue, live channels, editorial rails and personalised recommendations.",
      highlights: [
        "High-traffic, SEO-critical pages with server rendering and edge caching.",
        "Accessible (RGAA) components for rails, carousels and players.",
        "Performance budgets enforced in CI for Core Web Vitals.",
      ],
      url: "https://www.france.tv/",
      image: "/portfolio/france-tv.jpg",
      imageMobile: "/portfolio/france-tv-mobile.jpg",
      featured: true,
    },
    {
      id: "adaline",
      name: "Adaline",
      lang: "web",
      year: 2025,
      role: "Front-end developer",
      stack: ["Next.js", "Three.js", "TypeScript", "Motion"],
      summary: "Marketing site for Adaline, an observability and evals platform for self-improving AI agents, with a 3D hero and documentation-driven content.",
      highlights: [
        "Three.js hero scene with graceful fallback when WebGL is unavailable.",
        "Design-system components shared with the product UI.",
        "Lighthouse 95+ on mobile despite 3D and motion.",
      ],
      url: "https://www.adaline.ai/",
      image: "/portfolio/adaline.jpg",
      imageMobile: "/portfolio/adaline-mobile.jpg",
      featured: true,
    },
    {
      id: "ledgerflow",
      name: "LedgerFlow",
      lang: "java",
      year: 2025,
      stack: ["Java 21", "Spring Boot 3", "Kafka", "PostgreSQL", "Docker"],
      summary: "Event-sourced double-entry ledger service processing 4k transactions/sec with exactly-once semantics.",
      highlights: [
        "Designed an append-only event store on PostgreSQL with snapshotting every 500 events.",
        "Idempotent Kafka consumers with outbox pattern; zero duplicate postings across 3 regions.",
        "p99 latency dropped from 210 ms to 38 ms after moving hot paths to virtual threads.",
      ],
      github: "https://github.com/dragon5022",
    },
    {
      id: "pyquery-lab",
      name: "PyQuery Lab",
      lang: "python",
      year: 2025,
      stack: ["Python 3.12", "FastAPI", "Pandas", "DuckDB", "React"],
      summary: "Self-hosted analytics workbench that turns CSV/Parquet drops into shareable dashboards.",
      highlights: [
        "Streaming ingestion with async generators keeps memory flat on 20 GB files.",
        "DuckDB query planner integration gave 12x faster aggregations vs. Pandas-only baseline.",
        "Plugin system lets teams register custom transforms as plain Python functions.",
      ],
      github: "https://github.com/dragon5022",
    },
    {
      id: "shieldgate",
      name: "ShieldGate",
      lang: "java",
      year: 2024,
      stack: ["Java 17", "Spring Cloud Gateway", "Redis", "OAuth2", "Grafana"],
      summary: "API gateway with adaptive rate limiting, JWT validation, and per-tenant quota dashboards.",
      highlights: [
        "Token-bucket limiter backed by Redis Lua scripts; sub-millisecond decisions.",
        "Circuit breakers via Resilience4j cut cascading failures during upstream incidents.",
        "Built OpenTelemetry tracing across 11 downstream services.",
      ],
      github: "https://github.com/dragon5022",
    },
    {
      id: "scrapewise",
      name: "ScrapeWise",
      lang: "python",
      year: 2024,
      stack: ["Python", "Scrapy", "Playwright", "Celery", "PostgreSQL"],
      summary: "Distributed web-scraping platform with polite crawling, proxy rotation, and schema validation.",
      highlights: [
        "Pydantic schemas validate 2M records/day; invalid rows quarantined with diffs.",
        "Playwright workers render JS-heavy pages only when static fetch fails (saves 70% compute).",
        "Celery beat schedules per-domain crawl budgets to respect robots.txt crawl delays.",
      ],
      github: "https://github.com/dragon5022",
    },
    {
      id: "jvm-insight",
      name: "JVM Insight",
      lang: "java",
      year: 2023,
      stack: ["Java", "JFR", "JavaFX", "Gradle"],
      summary: "Desktop tool that visualizes Java Flight Recorder files: GC pauses, allocation hot spots, lock contention.",
      highlights: [
        "Parses 1 GB JFR dumps in under 6 seconds using memory-mapped streams.",
        "Flame graphs rendered on a JavaFX canvas with smooth zoom/pan.",
        "Shipped as a native image with jpackage for Windows, macOS, and Linux.",
      ],
      github: "https://github.com/dragon5022",
    },
    {
      id: "mlops-kit",
      name: "MLOps Kit",
      lang: "python",
      year: 2023,
      stack: ["Python", "scikit-learn", "MLflow", "Docker", "GitHub Actions"],
      summary: "Opinionated template for training, versioning, and serving ML models with reproducible pipelines.",
      highlights: [
        "One command trains, evaluates, and registers a model in MLflow.",
        "Serving image built with multi-stage Docker; cold start under 900 ms.",
        "Drift monitoring job alerts to Slack when feature distributions shift.",
      ],
      github: "https://github.com/dragon5022",
    },
  ] as Project[],

  timeline: [
    { date: "2025-09-15", text: "AI Token Router reaches 40–70% token savings in production" },
    { date: "2025-06-02", text: "Launched Forma Pilates online platform" },
    { date: "2025-03-10", text: "Lué Studio and Adaline sites go live" },
    { date: "2024-10-01", text: "DominoClub launches in Brazil" },
    { date: "2024-04-12", text: "Shipped Nabo web + mobile apps; france.tv contract" },
  ],

  /* Files shown inside the VS Code app */
  codeSamples: {
    "OrderService.java": {
      lang: "java",
      code: `package dev.dragon.ledgerflow.order;

import java.util.List;
import java.util.concurrent.Executors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Coordinates order placement: validates stock, reserves inventory
 * and publishes a domain event through the transactional outbox.
 */
@Service
public class OrderService {

    private final OrderRepository orders;
    private final InventoryClient inventory;
    private final OutboxPublisher outbox;

    public OrderService(OrderRepository orders,
                        InventoryClient inventory,
                        OutboxPublisher outbox) {
        this.orders = orders;
        this.inventory = inventory;
        this.outbox = outbox;
    }

    @Transactional
    public OrderId place(PlaceOrderCommand cmd) {
        var lines = cmd.lines().stream()
                .map(l -> new OrderLine(l.sku(), l.qty(), inventory.priceOf(l.sku())))
                .toList();

        var order = Order.create(cmd.customerId(), lines);
        reserveInParallel(lines);

        orders.save(order);
        outbox.publish(new OrderPlaced(order.id(), order.total()));
        return order.id();
    }

    private void reserveInParallel(List<OrderLine> lines) {
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            for (OrderLine line : lines) {
                executor.submit(() -> inventory.reserve(line.sku(), line.qty()));
            }
        } // executor waits for all reservations before closing
    }
}`,
    },
    "token_router.py": {
      lang: "python",
      code: `"""AI Token Router - request pipeline (simplified).

Sits in front of LLM APIs and cuts token usage 40-70% by:
  1. answering near-duplicate prompts from a semantic cache,
  2. compressing context before it leaves the gateway,
  3. routing each request to the cheapest model that can handle it.
"""
from __future__ import annotations

from dataclasses import dataclass
from fastapi import FastAPI

from router.cache import SemanticCache
from router.compress import compress_messages
from router.classify import Complexity, classify
from router.providers import call_model

app = FastAPI(title="token-router")
cache = SemanticCache(similarity=0.92, ttl_seconds=6 * 3600)

MODEL_FOR = {
    Complexity.TRIVIAL: "gpt-4o-mini",
    Complexity.NORMAL: "claude-sonnet-5",
    Complexity.HARD: "claude-opus-5-5",
}


@dataclass(slots=True)
class Usage:
    prompt_tokens: int
    completion_tokens: int
    saved_tokens: int
    served_from_cache: bool = False


@app.post("/v1/chat/completions")
async def chat(payload: dict) -> dict:
    messages = payload["messages"]

    # 1) semantic cache: identical intent -> zero upstream tokens
    if (hit := await cache.lookup(messages)) is not None:
        return hit.as_openai_response(usage=Usage(0, 0, hit.original_tokens, True))

    # 2) compress: drop stale turns, dedupe RAG chunks, strip boilerplate
    compact, saved = compress_messages(messages, budget=payload.get("max_context", 6_000))

    # 3) route: cheapest model that is good enough, with automatic fallback
    level = await classify(compact)
    model = payload.get("model_override") or MODEL_FOR[level]
    result = await call_model(model, compact, fallback=MODEL_FOR[Complexity.HARD])

    await cache.store(messages, result)
    return result.as_openai_response(
        usage=Usage(result.prompt_tokens, result.completion_tokens, saved)
    )`,
    },
    "RateLimiter.java": {
      lang: "java",
      code: `package dev.dragon.shieldgate.limit;

import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicReference;

/** Lock-free token bucket per client key. */
public final class RateLimiter {

    private record Bucket(double tokens, Instant updatedAt) {}

    private final double capacity;
    private final double refillPerSecond;
    private final ConcurrentHashMap<String, AtomicReference<Bucket>> buckets = new ConcurrentHashMap<>();

    public RateLimiter(int capacity, Duration refillWindow) {
        this.capacity = capacity;
        this.refillPerSecond = capacity / (double) refillWindow.toSeconds();
    }

    public boolean tryAcquire(String key) {
        var ref = buckets.computeIfAbsent(key,
                k -> new AtomicReference<>(new Bucket(capacity, Instant.now())));

        while (true) {
            Bucket current = ref.get();
            Instant now = Instant.now();
            double elapsed = Duration.between(current.updatedAt(), now).toNanos() / 1e9;
            double refilled = Math.min(capacity, current.tokens() + elapsed * refillPerSecond);

            if (refilled < 1.0) {
                return false;
            }
            Bucket next = new Bucket(refilled - 1.0, now);
            if (ref.compareAndSet(current, next)) {
                return true;
            }
        }
    }
}`,
    },
    "pipeline.py": {
      lang: "python",
      code: `"""Streaming CSV -> Parquet pipeline used in PyQuery Lab."""
from __future__ import annotations

import asyncio
from dataclasses import dataclass, field
from pathlib import Path
from typing import AsyncIterator

import pandas as pd
import pyarrow as pa
import pyarrow.parquet as pq


@dataclass(slots=True)
class PipelineStats:
    rows: int = 0
    chunks: int = 0
    rejected: int = 0
    errors: list[str] = field(default_factory=list)


async def read_chunks(path: Path, chunk_size: int = 50_000) -> AsyncIterator[pd.DataFrame]:
    """Yield DataFrame chunks without loading the whole file in memory."""
    loop = asyncio.get_running_loop()
    reader = pd.read_csv(path, chunksize=chunk_size)
    while True:
        chunk = await loop.run_in_executor(None, next, reader, None)
        if chunk is None:
            return
        yield chunk


def clean(chunk: pd.DataFrame) -> tuple[pd.DataFrame, int]:
    before = len(chunk)
    chunk = chunk.dropna(subset=["id", "amount"])
    chunk["amount"] = pd.to_numeric(chunk["amount"], errors="coerce")
    chunk = chunk[chunk["amount"] >= 0]
    return chunk, before - len(chunk)


async def run(src: Path, dst: Path) -> PipelineStats:
    stats = PipelineStats()
    writer: pq.ParquetWriter | None = None
    try:
        async for chunk in read_chunks(src):
            chunk, rejected = clean(chunk)
            table = pa.Table.from_pandas(chunk, preserve_index=False)
            if writer is None:
                writer = pq.ParquetWriter(dst, table.schema, compression="zstd")
            writer.write_table(table)
            stats.rows += len(chunk)
            stats.chunks += 1
            stats.rejected += rejected
    except Exception as exc:  # noqa: BLE001 - surfaced to the UI
        stats.errors.append(str(exc))
    finally:
        if writer:
            writer.close()
    return stats


if __name__ == "__main__":
    result = asyncio.run(run(Path("input.csv"), Path("output.parquet")))
    print(f"{result.rows:,} rows in {result.chunks} chunks ({result.rejected} rejected)")`,
    },
    "README.md": {
      lang: "md",
      code: `# dragon5022 — Portfolio OS

Welcome to my desktop. Double-click the icons or open the Start menu.

## Quick tour
- **Portfolio** – screenshots of sites, apps and games I have built
- **dragon5022** – who I am and what I care about
- **Projects** – File Explorer with Web, Apps & Games, AI, Java and Python folders
- **Skills** – the stack I use every day
- **Terminal** – type \`help\` (try \`portfolio\`, \`java -version\`, \`neofetch\`)
- **VS Code** – real snippets, including the AI Token Router pipeline
- **Contact** – email, WhatsApp, GitHub

GitHub: github.com/dragon5022 · Email: masterdev09092@gmail.com · WhatsApp: +1 573 860 0814`,
    },
  } as Record<string, CodeSample>,
};

export type Portfolio = typeof PORTFOLIO;
