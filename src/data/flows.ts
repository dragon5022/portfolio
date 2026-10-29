/* =========================================================================
   WORKFLOW DIAGRAMS — shown instead of screenshots for backend systems.
   Each diagram is drawn by components/apps/FlowDiagram.tsx on a 900-wide
   canvas: boxes (`nodes`), containers (`groups`), arrows (`edges`, SVG path
   data) and free labels (`texts`). `notes` become the cards under it.
   ========================================================================= */

export interface FlowNode { x: number; y: number; w: number; h: number; title: string; lines?: string[]; accent?: string }
export interface FlowGroup { x: number; y: number; w: number; h: number; title: string; sub?: string }
export interface FlowEdge { d: string; dashed?: boolean; /** no arrowhead (bus lines) */ plain?: boolean; /** arrowheads on both ends */ both?: boolean }
export interface FlowText { x: number; y: number; text: string; strong?: boolean; anchor?: "start" | "middle" }
export interface FlowSpec {
  label: string;
  heading: string;
  height: number;
  groups?: FlowGroup[];
  nodes: FlowNode[];
  edges: FlowEdge[];
  texts?: FlowText[];
  notes: [string, string][];
}

const BLUE = "#4cc2ff", GREEN = "#6ccb5f", YELLOW = "#ffd43b", PURPLE = "#c084fc", ORANGE = "#ff9a5c";

export const FLOWS = {
  "token-router": {
    label: "AI Token Router request flow",
    heading: "How a request flows",
    height: 420,
    groups: [{ x: 220, y: 40, w: 400, h: 340, title: "AI Token Router gateway", sub: "FastAPI · Redis · pgvector" }],
    nodes: [
      { x: 20, y: 160, w: 150, h: 80, title: "Your app / agent", lines: ["OpenAI-compatible call", "base_url → token-router"] },
      { x: 240, y: 100, w: 360, h: 62, title: "1 · Prompt analyzer", lines: ["normalise, strip boilerplate, detect task type"], accent: BLUE },
      { x: 240, y: 182, w: 360, h: 62, title: "2 · Semantic cache", lines: ["embedding similarity ≥ 0.92 → answer with 0 upstream tokens"], accent: GREEN },
      { x: 240, y: 264, w: 360, h: 62, title: "3 · Context compressor", lines: ["drop stale turns, dedupe RAG chunks, fit token budget"], accent: YELLOW },
      { x: 700, y: 60, w: 180, h: 56, title: "Small model", lines: ["simple tasks · cheapest"], accent: GREEN },
      { x: 700, y: 150, w: 180, h: 56, title: "Frontier model", lines: ["hard tasks · automatic fallback"], accent: PURPLE },
      { x: 700, y: 300, w: 180, h: 80, title: "Response + usage", lines: ["tokens in / out / saved", "40–70% fewer tokens"], accent: ORANGE },
    ],
    edges: [
      { d: "M170 200 H218" },
      { d: "M420 162 V180" }, { d: "M420 244 V262" }, { d: "M420 326 V344" },
      { d: "M600 213 H660 Q690 213 690 240 V300", dashed: true },
      { d: "M620 352 H700 Q720 352 720 332 V110" },
      { d: "M620 352 H700 Q720 352 720 332 V200" },
      { d: "M790 116 V148", dashed: true },
      { d: "M790 206 V298" },
    ],
    texts: [
      { x: 420, y: 364, text: "4 · Cost-aware model router", strong: true, anchor: "middle" },
      { x: 700, y: 262, text: "cache hit" },
    ],
    notes: [
      ["01 · Before", "Every call sends the full chat history and RAG context to a frontier model. Tokens grow with every turn."],
      ["02 · Through the router", "Cache hits return instantly. Everything else is compressed and classified, then routed to the cheapest capable model."],
      ["03 · After", "Same answers, 40–70% fewer billed tokens. Usage and savings per API key are visible on the dashboard."],
    ],
  },

  "buyersbox-writer": {
    label: "BuyersBox Auto Writer workflow: FastAPI backend, separate workers, WordPress publishing",
    heading: "How an article gets written and posted",
    height: 420,
    groups: [
      { x: 215, y: 30, w: 200, h: 360, title: "FastAPI backend", sub: "jobs & status only" },
      { x: 445, y: 30, w: 240, h: 360, title: "Worker service", sub: "separate process · scales out" },
    ],
    nodes: [
      { x: 20, y: 95, w: 170, h: 72, title: "Admin dashboard", lines: ["topics, keywords,", "review & approve"] },
      { x: 20, y: 245, w: 170, h: 56, title: "Scheduler", lines: ["daily article jobs"] },
      { x: 230, y: 80, w: 170, h: 56, title: "REST API", lines: ["create jobs · status"] },
      { x: 230, y: 190, w: 170, h: 56, title: "PostgreSQL", lines: ["jobs · drafts · logs"] },
      { x: 230, y: 300, w: 170, h: 56, title: "Redis queue", lines: ["hands jobs to workers"] },
      { x: 460, y: 80, w: 210, h: 56, title: "1 · Collect data", lines: ["buyback items, prices, stores"], accent: BLUE },
      { x: 460, y: 155, w: 210, h: 56, title: "2 · Generate draft", lines: ["LLM + brand style templates"], accent: PURPLE },
      { x: 460, y: 230, w: 210, h: 56, title: "3 · SEO & quality check", lines: ["title, meta, links, images"], accent: YELLOW },
      { x: 460, y: 305, w: 210, h: 56, title: "4 · Publish", lines: ["WordPress REST API · retries"], accent: GREEN },
      { x: 715, y: 80, w: 170, h: 56, title: "Shop data", lines: ["store & item feeds"] },
      { x: 715, y: 270, w: 170, h: 90, title: "WordPress shop", lines: ["buyersbox.co.jp", "posts · categories", "featured images"], accent: ORANGE },
    ],
    edges: [
      { d: "M190 131 H208 V108 H228" },
      { d: "M190 273 H208 V328 H228" },
      { d: "M315 136 V188" }, { d: "M315 246 V298" },
      { d: "M400 328 H430 V108 H458" },
      { d: "M565 136 V153" }, { d: "M565 211 V228" }, { d: "M565 286 V303" },
      { d: "M715 108 H672" },
      { d: "M670 333 H692 V315 H713" },
    ],
    notes: [
      ["01 · The API stays light", "The FastAPI backend only creates jobs and serves their status, so the shop and dashboard never wait on article generation."],
      ["02 · Workers do the heavy work", "Separate worker processes collect shop data, draft with an LLM, run SEO checks and retry on failure. Add workers to publish more."],
      ["03 · Straight to WordPress", "Finished articles go out through the WordPress REST API with categories and a featured image, as drafts for review or scheduled posts."],
    ],
  },

  routemate: {
    label: "RouteMate delivery dispatch workflow",
    heading: "How a pickup gets planned and tracked",
    height: 420,
    groups: [{ x: 215, y: 30, w: 410, h: 360, title: "RouteMate API", sub: "FastAPI · async workers" }],
    nodes: [
      { x: 20, y: 72, w: 170, h: 72, title: "Pickup requests", lines: ["web form · LINE · phone", "address + time window"] },
      { x: 20, y: 262, w: 170, h: 72, title: "Driver app", lines: ["GPS ping every 15 s", "proof of delivery"] },
      { x: 235, y: 80, w: 370, h: 56, title: "1 · Geocode & validate", lines: ["Google Maps Geocoding · service-area check"], accent: BLUE },
      { x: 235, y: 155, w: 370, h: 56, title: "2 · Plan routes", lines: ["OR-Tools vehicle routing · time windows · van capacity"], accent: PURPLE },
      { x: 235, y: 230, w: 370, h: 56, title: "3 · Dispatch", lines: ["assign drivers · push the day's jobs to the app"], accent: YELLOW },
      { x: 235, y: 305, w: 370, h: 56, title: "4 · Live tracking", lines: ["WebSocket positions · ETA recalculation"], accent: GREEN },
      { x: 655, y: 55, w: 230, h: 56, title: "PostgreSQL + PostGIS", lines: ["orders, zones, routes"] },
      { x: 655, y: 150, w: 230, h: 72, title: "Google Maps Platform", lines: ["Distance Matrix · Directions", "traffic-aware travel times"], accent: BLUE },
      { x: 655, y: 300, w: 230, h: 72, title: "Customer notices", lines: ["SMS / LINE: ETA, arrival,", "delivery photo"], accent: ORANGE },
    ],
    edges: [
      { d: "M190 108 H233" },
      { d: "M190 298 H212 V333 H233", both: true },
      { d: "M420 136 V153" }, { d: "M420 211 V228" }, { d: "M420 286 V303" },
      { d: "M605 100 H630 V83 H653", both: true },
      { d: "M605 186 H653", both: true },
      { d: "M605 336 H653" },
    ],
    notes: [
      ["01 · Requests in", "Pickups from the web form, LINE and phone are geocoded and checked against the service area before they are accepted."],
      ["02 · Optimised routes", "OR-Tools solves each day's vehicle-routing problem with time windows and van capacity, using real travel times from Google Maps."],
      ["03 · Live updates", "Drivers stream GPS over WebSocket, ETAs are recalculated, and customers get SMS or LINE notices on the way and on arrival."],
    ],
  },

  stocksync: {
    label: "StockSync inventory and price sync workflow",
    heading: "How stock stays in sync",
    height: 420,
    groups: [{ x: 235, y: 30, w: 415, h: 360, title: "StockSync", sub: "FastAPI · Celery · Redis" }],
    nodes: [
      { x: 20, y: 50, w: 180, h: 56, title: "Store POS", lines: ["sales & buy-ins"] },
      { x: 20, y: 130, w: 180, h: 56, title: "Warehouse scans", lines: ["receiving · picking"] },
      { x: 20, y: 210, w: 180, h: 56, title: "Supplier feeds", lines: ["CSV / XML price lists"] },
      { x: 20, y: 290, w: 180, h: 72, title: "Marketplace orders", lines: ["webhooks + polling", "3 marketplace APIs"] },
      { x: 255, y: 80, w: 375, h: 56, title: "1 · Ingest", lines: ["FastAPI webhooks + Celery pollers · idempotency keys"], accent: BLUE },
      { x: 255, y: 155, w: 375, h: 56, title: "2 · Normalise & dedupe", lines: ["SKU mapping, JAN codes, unit and price rules"], accent: PURPLE },
      { x: 255, y: 230, w: 375, h: 56, title: "3 · Reconcile stock", lines: ["one stock ledger · reserve on order"], accent: YELLOW },
      { x: 255, y: 305, w: 375, h: 56, title: "4 · Push updates", lines: ["rate-limited channel APIs · retry with backoff"], accent: GREEN },
      { x: 680, y: 80, w: 205, h: 56, title: "PostgreSQL", lines: ["stock ledger · price history"] },
      { x: 680, y: 200, w: 205, h: 72, title: "Sales channels", lines: ["web shop · marketplaces", "stock & price updates"], accent: ORANGE },
      { x: 680, y: 310, w: 205, h: 56, title: "Alerts", lines: ["oversell risk · feed errors"] },
    ],
    edges: [
      { d: "M200 78 H225", plain: true }, { d: "M200 158 H225", plain: true }, { d: "M200 238 H225", plain: true }, { d: "M200 326 H225", plain: true },
      { d: "M225 78 V326", plain: true },
      { d: "M225 108 H253" },
      { d: "M442 136 V153" }, { d: "M442 211 V228" }, { d: "M442 286 V303" },
      { d: "M630 252 H655 V108 H678", both: true },
      { d: "M630 322 H662 V236 H678" },
      { d: "M630 345 H678", dashed: true },
    ],
    notes: [
      ["01 · Every channel in", "POS sales, warehouse scans, supplier price lists and marketplace orders all land in one ingest API with idempotency keys."],
      ["02 · One stock ledger", "Items are mapped to a single SKU, then stock is reconciled and reserved the moment an order arrives, so nothing is sold twice."],
      ["03 · Out to every channel", "Changes are pushed back through each channel's API within its rate limits, with retries and an alert when a feed fails."],
    ],
  },

  doculens: {
    label: "DocuLens OCR pipeline workflow",
    heading: "How a document becomes data",
    height: 420,
    groups: [{ x: 215, y: 30, w: 410, h: 360, title: "DocuLens pipeline", sub: "Python workers · GPU optional" }],
    nodes: [
      { x: 20, y: 70, w: 170, h: 72, title: "Uploads", lines: ["phone photos, scans,", "multi-page PDFs"] },
      { x: 20, y: 200, w: 170, h: 56, title: "Email inbox", lines: ["forwarded invoices"] },
      { x: 20, y: 300, w: 170, h: 56, title: "REST API", lines: ["batch upload · webhooks"] },
      { x: 235, y: 80, w: 370, h: 56, title: "1 · Pre-process", lines: ["OpenCV: deskew, denoise, crop, contrast"], accent: BLUE },
      { x: 235, y: 155, w: 370, h: 56, title: "2 · Recognise text", lines: ["PaddleOCR / Tesseract · Japanese + English"], accent: PURPLE },
      { x: 235, y: 230, w: 370, h: 56, title: "3 · Extract fields", lines: ["layout analysis + rules: dates, totals, tax, IDs"], accent: YELLOW },
      { x: 235, y: 305, w: 370, h: 56, title: "4 · Validate & score", lines: ["checksums, cross-field rules, confidence per field"], accent: GREEN },
      { x: 655, y: 70, w: 230, h: 72, title: "JSON API & CSV export", lines: ["structured fields", "to ERP / accounting"], accent: ORANGE },
      { x: 655, y: 210, w: 230, h: 72, title: "Review queue", lines: ["low-confidence fields shown", "next to the original image"] },
      { x: 655, y: 320, w: 230, h: 56, title: "PostgreSQL + S3", lines: ["results · originals · audit"] },
    ],
    edges: [
      { d: "M190 106 H203", plain: true }, { d: "M190 228 H203", plain: true }, { d: "M190 328 H203", plain: true },
      { d: "M203 106 V328", plain: true },
      { d: "M203 108 H233" },
      { d: "M420 136 V153" }, { d: "M420 211 V228" }, { d: "M420 286 V303" },
      { d: "M605 315 H630 V106 H653" },
      { d: "M605 333 H642 V246 H653", dashed: true },
      { d: "M605 351 H653" },
      { d: "M770 210 V144", dashed: true },
    ],
    notes: [
      ["01 · Clean input", "Photos and scans are deskewed, denoised and cropped with OpenCV, so the OCR engine sees a flat, high-contrast page."],
      ["02 · Text to fields", "OCR output in Japanese and English is mapped to fields such as dates, totals, tax and IDs using layout analysis plus rules."],
      ["03 · People only where needed", "Every field gets a confidence score. Only low-confidence fields go to the review screen; corrected results flow on to export."],
    ],
  },

  commercecore: {
    label: "CommerceCore microservices architecture",
    heading: "How the platform fits together",
    height: 440,
    groups: [{ x: 380, y: 30, w: 505, h: 230, title: "Spring Boot microservices", sub: "Java 21 · one PostgreSQL schema per service" }],
    nodes: [
      { x: 20, y: 60, w: 160, h: 56, title: "Web shop & app", lines: ["customers"] },
      { x: 20, y: 150, w: 160, h: 56, title: "Admin & POS", lines: ["staff and stores"] },
      { x: 20, y: 240, w: 160, h: 56, title: "Partner APIs", lines: ["marketplaces, B2B"] },
      { x: 205, y: 100, w: 150, h: 120, title: "API Gateway", lines: ["Spring Cloud Gateway", "JWT auth", "per-client rate limits", "routing"], accent: BLUE },
      { x: 395, y: 80, w: 150, h: 56, title: "Catalog", lines: ["products, prices"] },
      { x: 560, y: 80, w: 150, h: 56, title: "Order", lines: ["checkout, outbox"] },
      { x: 725, y: 80, w: 150, h: 56, title: "Inventory", lines: ["stock, reservations"] },
      { x: 395, y: 165, w: 150, h: 56, title: "Payment", lines: ["cards, refunds"] },
      { x: 560, y: 165, w: 150, h: 56, title: "Shipping", lines: ["carriers, labels"] },
      { x: 725, y: 165, w: 150, h: 56, title: "Customer", lines: ["accounts, points"] },
      { x: 380, y: 280, w: 505, h: 56, title: "Kafka event bus", lines: ["OrderPlaced · StockReserved · PaymentCaptured · Shipped"], accent: PURPLE },
      { x: 380, y: 370, w: 155, h: 56, title: "Search", lines: ["Elasticsearch index"], accent: YELLOW },
      { x: 555, y: 370, w: 155, h: 56, title: "Notifications", lines: ["email · push · LINE"], accent: GREEN },
      { x: 730, y: 370, w: 155, h: 56, title: "Analytics", lines: ["data warehouse"], accent: ORANGE },
      { x: 20, y: 340, w: 335, h: 56, title: "Observability", lines: ["OpenTelemetry traces · Prometheus · Grafana"] },
    ],
    edges: [
      { d: "M180 88 H192", plain: true }, { d: "M180 178 H192", plain: true }, { d: "M180 268 H192", plain: true },
      { d: "M192 88 V268", plain: true },
      { d: "M192 160 H203" },
      { d: "M355 160 H378" },
      { d: "M470 221 V278", both: true }, { d: "M635 221 V278", both: true }, { d: "M800 221 V278", both: true },
      { d: "M457 336 V368" }, { d: "M632 336 V368" }, { d: "M807 336 V368" },
    ],
    notes: [
      ["01 · One front door", "Every client goes through Spring Cloud Gateway: JWT auth, per-client rate limits and routing to the right service."],
      ["02 · Services own their data", "Catalog, order, inventory, payment, shipping and customer services each have their own PostgreSQL schema and scale independently."],
      ["03 · Events tie it together", "State changes go to Kafka through a transactional outbox, so search, notifications and analytics stay in sync without tight coupling."],
    ],
  },

  ledgercore: {
    label: "LedgerCore payments ledger and settlement workflow",
    heading: "How money moves through the ledger",
    height: 420,
    groups: [{ x: 215, y: 30, w: 420, h: 360, title: "LedgerCore", sub: "Spring Boot 3 · Java 21 · PostgreSQL" }],
    nodes: [
      { x: 20, y: 64, w: 170, h: 72, title: "Payment providers", lines: ["card, Pix, bank transfer", "signed webhooks"] },
      { x: 20, y: 180, w: 170, h: 56, title: "Internal services", lines: ["charge · refund · payout"] },
      { x: 20, y: 292, w: 170, h: 72, title: "Bank statements", lines: ["daily statement files", "via SFTP"] },
      { x: 235, y: 80, w: 380, h: 56, title: "1 · Payment API", lines: ["idempotency keys · validation · webhook signatures"], accent: BLUE },
      { x: 235, y: 155, w: 380, h: 56, title: "2 · Double-entry ledger", lines: ["append-only journal · balances per account"], accent: PURPLE },
      { x: 235, y: 230, w: 380, h: 56, title: "3 · Settlement batch", lines: ["Spring Batch: fees, payouts, merchant statements"], accent: YELLOW },
      { x: 235, y: 305, w: 380, h: 56, title: "4 · Reconciliation", lines: ["match bank lines to ledger entries, flag gaps"], accent: GREEN },
      { x: 665, y: 70, w: 220, h: 56, title: "Kafka", lines: ["ledger events to other services"] },
      { x: 665, y: 170, w: 220, h: 72, title: "Finance reports", lines: ["balances, fees, payouts", "daily close"], accent: ORANGE },
      { x: 665, y: 300, w: 220, h: 56, title: "Exceptions desk", lines: ["unmatched items to review"] },
    ],
    edges: [
      { d: "M190 100 H233" },
      { d: "M190 208 H212 V122 H233" },
      { d: "M190 330 H233" },
      { d: "M425 136 V153" }, { d: "M425 211 V228" }, { d: "M425 286 V303" },
      { d: "M615 175 H640 V98 H663" },
      { d: "M615 258 H648 V206 H663" },
      { d: "M615 330 H663", dashed: true },
    ],
    notes: [
      ["01 · Exactly once", "Every charge, refund and payout carries an idempotency key, so retries from providers or services never post twice."],
      ["02 · Balanced books", "An append-only double-entry journal keeps every account balanced; balances are derived from entries, never edited."],
      ["03 · Close the day", "Spring Batch computes fees and payouts, and reconciliation matches bank statement lines to ledger entries, flagging anything missing."],
    ],
  },
} satisfies Record<string, FlowSpec>;

export type FlowId = keyof typeof FLOWS;
