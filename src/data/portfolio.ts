/* =========================================================================
   PORTFOLIO DATA — edit this file to make the site yours.
   Every app (About, Portfolio, Projects, Skills, Contact, Terminal,
   VS Code) renders from this object.
   ========================================================================= */

import type { FlowId } from "./flows";

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
  /** workflow diagram from src/data/flows.ts, used when there is no screenshot */
  flow?: FlowId;
  /** code sample (a codeSamples key) opened from the project */
  code?: string;
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
  title: "Full-Stack & AI Engineer · Java & Python",
  tagline: "I build AI systems, automated trading bots and full-stack products, with Java and Python at the core of my backend work.",
  location: "Remote · worldwide",
  email: "masterdev09092@gmail.com",
  github: "https://github.com/dragon5022",
  linkedin: "", // leave empty to hide
  avatar: "/avatar.png",

  bio: [
    "A full-stack and AI engineer who has shipped production work for businesses around the world: a buyback and resale platform in Japan, the website and CRM of a Brazilian hotel group, a real-money domino game, a soccer management game on the App Store, and a solar electrician's site in Australia.",
    "In AI engineering I take LLM features from prototype to production: RAG pipelines with embeddings, pgvector and re-ranking; tool-calling agents with structured outputs; OCR and document extraction; and evals and guardrails that keep answers reliable. I work across the OpenAI, Anthropic and Gemini APIs and serve models behind FastAPI with queues and background workers.",
    "For trading I build automated bots for crypto and stock markets: exchange connectivity over REST and WebSocket (CCXT and native APIs), real-time market data and order books, strategy engines in async Python, backtesting and paper trading on historical data, and risk controls such as position limits, stop-losses and a kill switch. Bots run 24/7 in Docker, store tick data in PostgreSQL / TimescaleDB and send Telegram alerts on fills and errors.",
    "Across the full stack I ship products end to end: Java (Spring Boot, Kafka, JPA) and Python (FastAPI, Celery) backends; Next.js, React, TypeScript and WordPress frontends; React Native and iOS apps; and PostgreSQL, Redis, Docker, Kubernetes and CI/CD on AWS and Vercel to run them.",
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
      id: "buyersbox",
      name: "BuyersBox",
      lang: "web",
      year: 2025,
      role: "Full-stack developer",
      stack: ["WordPress", "PHP", "MySQL", "Google Maps", "LINE", "JavaScript"],
      summary: "Buyback and resale platform for Powerful Trade Center (パワフルトレードセンター), a Sapporo chain that buys a huge range of electric cable, power tools and building materials: three stores, store maps and free pickup anywhere in Hokkaido.",
      highlights: [
        "Catalogue of 20+ buyback categories (VVF and CV cable, new and used power tools, generators, building and electrical materials, appliances) with a live “latest buyback” feed from each store.",
        "Store pages for the three Sapporo shops with Google Maps, directions and opening hours.",
        "Deli-Power on-site pickup (出張買取): customers book a free visit anywhere in Hokkaido.",
        "Instant quotes by phone and LINE, customer voices and news, all run from a custom WordPress theme with SEO built in.",
      ],
      url: "https://www.buyersbox.co.jp/",
      image: "/portfolio/buyersbox.jpg",
      imageMobile: "/portfolio/buyersbox-mobile.jpg",
      featured: true,
    },
    {
      id: "buyersbox-writer",
      name: "BuyersBox Auto Writer",
      lang: "python",
      year: 2025,
      role: "Backend developer · architecture, API, workers",
      stack: ["Python", "FastAPI", "Celery", "Redis", "PostgreSQL", "LLM API", "WordPress REST API", "Docker"],
      summary: "Python system that writes and publishes articles for buyersbox.co.jp automatically: a FastAPI backend creates jobs, and separate workers draft, check and post each article to the WordPress shop through its API.",
      highlights: [
        "Split into a light FastAPI backend (jobs, review, status) and separate worker processes, so heavy generation never slows the API or the shop.",
        "Workers collect store and buyback data, draft the article with an LLM using brand templates, then check the title, meta description, links and images for SEO.",
        "Publishes through the WordPress REST API with categories and a featured image, as a draft for review or as a scheduled post.",
        "Redis queue with retries and a publish log in PostgreSQL; add workers to publish more.",
      ],
      flow: "buyersbox-writer",
      code: "publish_worker.py",
      featured: true,
    },
    {
      id: "grupowish",
      name: "Grupo Wish",
      lang: "web",
      year: 2025,
      role: "Full-stack developer · live site & CRM",
      stack: ["Duda", "JavaScript", "jQuery", "Omnibees booking engine", "Asksuite chat", "CRM"],
      summary: "Live website and CRM for Grupo Wish, a Brazilian group of 11 hotels and resorts: a booking bar on every page, promotions and events, the My Wish loyalty programme, and guest data flowing into the CRM.",
      highlights: [
        "Booking bar (hotel, dates, guests, coupon) connected to the Omnibees reservation engine for all 11 properties.",
        "Hotel, promotion and event pages for resorts in Foz do Iguaçu, Gramado, Natal, Salvador and more.",
        "CRM: reservation leads, chat conversations and My Wish sign-ups land in guest profiles for campaigns and follow-up.",
        "Online check-in (FNRH), ESG and travel-tips sections, cookie consent and analytics.",
      ],
      url: "https://www.grupowish.com/",
      image: "/portfolio/grupowish.jpg",
      imageMobile: "/portfolio/grupowish-mobile.jpg",
      featured: true,
    },
    {
      id: "dominoclub",
      name: "DominoClub",
      lang: "game",
      year: 2026,
      role: "Lead developer · game app, matchmaking, payments",
      stack: ["React Native (Expo)", "TypeScript", "WebSocket", "Node.js", "PostgreSQL", "Pix payments", "WordPress"],
      summary: "Competitive domino arena for Brazil on the web and on mobile: play real people 1v1 or 2v2, free or for prizes, with integrated Pix payments, rankings, leagues and tournaments.",
      highlights: [
        "One Expo / React Native codebase for the browser game and the Android app.",
        "Real-time 1v1 and 2v2 tables over WebSocket, with rankings, weekly tournaments and leagues.",
        "Integrated Pix deposits and prize withdrawals, with identity verification, anti-fraud monitoring and account protection.",
        "WordPress landing site with rules, scoring guide and the launch campaign (official launch on 23 October 2026).",
      ],
      url: "https://dominoclub.com.br/",
      image: "/portfolio/dominoclub.jpg",
      featured: true,
    },
    {
      id: "soccer-manager",
      name: "High School Soccer Manager",
      lang: "game",
      year: 2026,
      role: "Game developer",
      stack: ["iOS & iPadOS", "3D match engine", "Simulation", "6 languages"],
      summary: "Youth-football management game on the Japanese App Store (高校サッカーマネージャー): coach a high-school team or a pro academy in Japan, Korea, England, Spain or Germany, develop players and chase national titles. Paid app, no ads.",
      highlights: [
        "Five countries, each with its own calendar, competitions, school years, player names and stadiums.",
        "Weekly training plans, growth types (early, normal, late bloomer), hidden potential and unique abilities that stay on record after graduation.",
        "11-a-side matches simulated from tactics and line-up, watched from TV, overhead or dynamic cameras, or skipped straight to the result.",
        "Released on 4 August 2026 with regular updates since; available in English, French, German, Japanese, Korean and Spanish.",
      ],
      url: "https://apps.apple.com/jp/app/id6789682404",
      image: "/portfolio/soccer-manager.jpg",
      featured: true,
    },
    {
      id: "sunnydays",
      name: "Sunny Days Electrical",
      lang: "web",
      year: 2025,
      role: "Full-stack developer",
      stack: ["WordPress", "Elementor Pro", "PHP", "Gravity Forms", "Google Reviews", "Cloudflare"],
      summary: "Website for a residential and solar electrician on the NSW South Coast (Shoalhaven Heads, Berry, Gerringong): services, local landing pages, project gallery, quote forms and live Google reviews.",
      highlights: [
        "Elementor Pro build with service and location landing pages for local search.",
        "Solar calculator that helps visitors size a system before they ask for a quote.",
        "Gravity Forms quote and contact forms, with click-to-call on every page.",
        "Live 5-star Google reviews widget and an “Our Work” gallery, served through Cloudflare.",
      ],
      url: "https://sunnydayselectrical.com.au/",
      image: "/portfolio/sunnydays.jpg",
      imageMobile: "/portfolio/sunnydays-mobile.jpg",
      featured: true,
    },
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
      code: "token_router.py",
      featured: true,
    },
    {
      id: "doculens",
      name: "DocuLens OCR",
      lang: "ai",
      year: 2025,
      role: "Backend & ML developer",
      stack: ["Python", "OpenCV", "PaddleOCR", "Tesseract", "FastAPI", "PostgreSQL", "S3"],
      summary: "OCR system that turns photos, scans and PDFs of invoices, receipts and forms into validated, structured data, with a review queue for low-confidence fields.",
      highlights: [
        "Pre-processing with OpenCV (deskew, denoise, crop, contrast) before recognition.",
        "Japanese and English text recognition with PaddleOCR, falling back to Tesseract.",
        "Field extraction for dates, totals, tax and IDs from layout analysis plus rules, with a confidence score per field.",
        "Review screen shows low-confidence fields next to the original image; approved results go out as JSON or CSV.",
      ],
      github: "https://github.com/dragon5022",
      flow: "doculens",
    },
    {
      id: "routemate",
      name: "RouteMate",
      lang: "python",
      year: 2024,
      role: "Backend developer",
      stack: ["Python", "FastAPI", "OR-Tools", "PostgreSQL + PostGIS", "Google Maps Platform", "WebSocket", "Redis"],
      summary: "Delivery and pickup dispatch backend: geocodes requests, plans daily routes with time windows and van capacity, assigns drivers and streams live ETAs to customers.",
      highlights: [
        "Requests from web, LINE and phone are geocoded with Google Maps and checked against the service area.",
        "Daily routes solved with OR-Tools (time windows, capacity) using traffic-aware travel times.",
        "Driver app receives its jobs and streams GPS over WebSocket; ETAs update as the day goes.",
        "Customers get SMS or LINE notices on the way, on arrival and with a delivery photo.",
      ],
      github: "https://github.com/dragon5022",
      flow: "routemate",
    },
    {
      id: "stocksync",
      name: "StockSync",
      lang: "python",
      year: 2024,
      role: "Backend developer",
      stack: ["Python", "FastAPI", "Celery", "Redis", "PostgreSQL", "Pandas"],
      summary: "Inventory and price sync service that keeps store POS, warehouse and online marketplaces on one stock ledger, so items are never sold twice.",
      highlights: [
        "One ingest API for POS sales, warehouse scans, supplier price lists and marketplace orders, with idempotency keys.",
        "SKU and JAN-code mapping, unit and price rules, and deduplication across channels.",
        "Stock is reserved the moment an order arrives, then pushed to every channel within its API rate limits.",
        "Streaming imports keep memory flat on large supplier files; alerts fire on oversell risk or a failing feed.",
      ],
      github: "https://github.com/dragon5022",
      flow: "stocksync",
      code: "pipeline.py",
    },
    {
      id: "commercecore",
      name: "CommerceCore",
      lang: "java",
      year: 2024,
      role: "Backend lead",
      stack: ["Java 21", "Spring Boot 3", "Spring Cloud Gateway", "Kafka", "PostgreSQL", "Redis", "Elasticsearch", "Kubernetes"],
      summary: "Large e-commerce backend: six Spring Boot microservices behind an API gateway, linked by Kafka events, covering catalogue, orders, inventory, payments, shipping and customers.",
      highlights: [
        "Spring Cloud Gateway in front of every client, with JWT auth, per-client rate limits and routing.",
        "Each service owns its PostgreSQL schema and scales on its own in Kubernetes.",
        "Transactional outbox publishes domain events to Kafka; search, notifications and analytics consume them.",
        "Inventory reserved in parallel on virtual threads at checkout; tracing with OpenTelemetry across all services.",
      ],
      github: "https://github.com/dragon5022",
      flow: "commercecore",
      code: "OrderService.java",
    },
    {
      id: "ledgercore",
      name: "LedgerCore",
      lang: "java",
      year: 2023,
      role: "Backend developer",
      stack: ["Java 21", "Spring Boot 3", "Spring Batch", "PostgreSQL", "Kafka", "Testcontainers"],
      summary: "Payments ledger and settlement engine: idempotent payment API, append-only double-entry journal, nightly settlement batches and bank reconciliation.",
      highlights: [
        "Idempotency keys and signed webhooks, so provider retries never post a payment twice.",
        "Append-only double-entry journal; account balances are derived from entries, never edited.",
        "Spring Batch jobs compute fees, payouts and merchant statements every night.",
        "Reconciliation matches bank statement lines to ledger entries and sends gaps to an exceptions desk.",
      ],
      github: "https://github.com/dragon5022",
      flow: "ledgercore",
    },
  ] as Project[],

  timeline: [
    { date: "2026-10-23", text: "DominoClub officially launches in Brazil, on the web and Android" },
    { date: "2026-08-04", text: "High School Soccer Manager released on the Japanese App Store" },
    { date: "2025-09-15", text: "AI Token Router reaches 40–70% token savings in production" },
  ],

  /* Files shown inside the VS Code app */
  codeSamples: {
    "OrderService.java": {
      lang: "java",
      code: `package dev.dragon.commercecore.order;

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
    "publish_worker.py": {
      lang: "python",
      code: `"""BuyersBox Auto Writer - worker (simplified).

The FastAPI backend only records a job and enqueues it. This separate worker
does the heavy work, so the API and the shop stay fast:
  collect shop data -> draft with an LLM -> SEO checks -> publish to WordPress.
"""
from __future__ import annotations

import os

import httpx
from celery import Celery

from writer.data import collect_context
from writer.draft import draft_article
from writer.jobs import Jobs
from writer.seo import check_seo

celery = Celery("writer", broker=os.environ["REDIS_URL"])
WP_API = "https://www.buyersbox.co.jp/wp-json/wp/v2"
WP_AUTH = (os.environ["WP_USER"], os.environ["WP_APP_PASSWORD"])  # WordPress application password


@celery.task(bind=True, max_retries=3, default_retry_delay=60)
def write_and_publish(self, job_id: str) -> str:
    job = Jobs.get(job_id)
    try:
        context = collect_context(job.topic, store=job.store)     # latest buyback items, prices, store info
        article = draft_article(job.topic, context, style="brand")  # LLM + brand templates
        if problems := check_seo(article):                        # title length, meta, links, images
            Jobs.needs_review(job_id, problems)
            return "review"

        res = httpx.post(f"{WP_API}/posts", auth=WP_AUTH, timeout=30, json={
            "title": article.title,
            "content": article.html,
            "excerpt": article.meta_description,
            "categories": article.category_ids,
            "featured_media": upload_image(article.image_path),
            "status": "draft" if job.review_first else "publish",
        })
        res.raise_for_status()
        Jobs.published(job_id, url=res.json()["link"])
        return "published"
    except httpx.HTTPError as exc:
        Jobs.failed(job_id, str(exc))
        raise self.retry(exc=exc)


def upload_image(path: str) -> int:
    with open(path, "rb") as f:
        res = httpx.post(f"{WP_API}/media", auth=WP_AUTH, timeout=60, content=f.read(),
                         headers={"Content-Disposition": f'attachment; filename="{os.path.basename(path)}"'})
    res.raise_for_status()
    return res.json()["id"]`,
    },
    "RateLimiter.java": {
      lang: "java",
      code: `package dev.dragon.commercecore.gateway;

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
      code: `"""Streaming supplier CSV -> Parquet import used in StockSync."""
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
- **Contact** – email, GitHub

GitHub: github.com/dragon5022 · Email: masterdev09092@gmail.com`,
    },
  } as Record<string, CodeSample>,
};

export type Portfolio = typeof PORTFOLIO;

/** button label for a project's public link */
export const linkLabel = (url: string) => (url.includes("apps.apple.com") ? "App Store" : "Live site");
