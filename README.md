# Margyn — Product Arbitrage Intelligence Platform

> Find the margin before the market does.

Margyn is a full-stack web application that tracks high-volume products across consumer marketplaces (Amazon, eBay, Walmart, Facebook Marketplace, Etsy), cross-references supplier prices (Alibaba, AliExpress, DHgate, Faire, Made-in-China), calculates gross margins, and surfaces arbitrage opportunities in real time. It also includes a dedicated **B2B Commercial** module for tracking industrial goods, electronics components, raw materials, medical supplies, and other bulk/wholesale product categories.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Prerequisites](#prerequisites)
5. [Installation](#installation)
6. [Configuration (.env)](#configuration-env)
7. [Running the App](#running-the-app)
8. [Demo Credentials](#demo-credentials)
9. [Pages & Modules](#pages--modules)
10. [Data Sources & Engines](#data-sources--engines)
11. [Scraper Engine](#scraper-engine)
12. [API Connector Engine](#api-connector-engine)
13. [Job Scheduler](#job-scheduler)
14. [Adding a New Source](#adding-a-new-source)
15. [Light / Dark Mode](#light--dark-mode)
16. [Roadmap](#roadmap)

---

## Features

- **Dashboard** — KPI cards, 7-day revenue/units trend chart, margin distribution donut, top products by volume and margin
- **Products** — Full comparison table with market prices, supplier prices, profit-per-unit, margin badges, tag filtering, and per-product detail views
- **B2B Commercial** — Industrial product catalogue with tiered volume pricing, certifications, supplier details, lead times, MOQ tracking, and margin analysis
- **Data Sources** — Full CRUD for market and supplier sources; supports Website Scraping, REST, GraphQL, SOAP/WSDL, and OAuth 2.0; real-time job progress via Server-Sent Events (SSE)
- **Job Engine** — Per-source cron scheduling, configurable concurrency, rate limiting, rotating user-agents, simulated fallback data
- **Authentication** — Passport.js local strategy, bcrypt hashing, session cookies
- **Light / Dark Mode** — Persisted via `localStorage`, no flash on reload, available on all pages including public/auth pages

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18+ |
| Framework | Express 4 |
| Templating | Handlebars (express-handlebars) |
| Auth | Passport.js (local), bcryptjs, express-session |
| Scraping | axios, cheerio |
| API calls | axios (REST / GraphQL / SOAP) |
| XML parsing | xml2js (SOAP responses) |
| Scheduling | node-cron |
| Concurrency | p-limit v3 |
| Frontend | Bootstrap 5.3, Bootstrap Icons, Chart.js 4 |
| Fonts | Space Grotesk, JetBrains Mono |
| Data storage | In-memory JSON (no database required) |

---

## Project Structure

```
margyn/
├── app.js                    # Express app, Handlebars config, routes, server
├── package.json
├── .env                      # Environment variables (never commit)
├── .gitignore
│
├── config/
│   └── passport.js           # Passport local strategy
│
├── middleware/
│   └── auth.js               # ensureAuthenticated, forwardAuthenticated
│
├── data/
│   ├── db.js                 # Seeded consumer products, users, market/supplier sources
│   ├── b2bStore.js           # B2B industrial products, sectors, stats
│   └── sourceStore.js        # Source configs, job logs, active run state
│
├── engines/
│   ├── scraper.js            # CSS-selector web scraper (cheerio/axios)
│   ├── apiConnector.js       # REST / GraphQL / SOAP / OAuth connector
│   └── jobRunner.js          # Job orchestrator, cron scheduler, SSE events
│
├── routes/
│   ├── index.js              # Landing page (public)
│   ├── auth.js               # Login, register, logout
│   ├── dashboard.js          # Main dashboard
│   ├── products.js           # Consumer products list + detail
│   ├── b2b.js                # B2B commercial list + detail
│   └── sources.js            # Source CRUD + run/test/SSE endpoints
│
├── views/
│   ├── layouts/
│   │   ├── main.hbs          # Authenticated app shell (sidebar + topbar)
│   │   └── landing.hbs       # Public page shell (floating theme toggle)
│   ├── partials/
│   │   ├── sidebar.hbs
│   │   └── topbar.hbs
│   ├── index.hbs             # Landing / marketing page
│   ├── auth/
│   │   ├── login.hbs
│   │   └── register.hbs
│   ├── dashboard/
│   │   └── index.hbs
│   ├── products/
│   │   ├── index.hbs
│   │   └── detail.hbs
│   ├── b2b/
│   │   ├── index.hbs         # B2B catalogue with sector grid + filter table
│   │   └── detail.hbs        # Tiered pricing, margin breakdown, suppliers
│   └── sources/
│       └── index.hbs         # Source cards, Add Source modal, live job log
│
└── public/
    ├── css/
    │   └── style.css
    └── js/
        ├── main.js           # Theme toggle, sidebar, keyboard shortcuts
        ├── charts.js         # Chart.js revenue/margin charts
        └── sources.js        # Source page interactivity, SSE client
```

---

## Prerequisites

- **Node.js** v18 or newer — [nodejs.org](https://nodejs.org)
- **npm** v9+ (bundled with Node)
- A modern browser

No database setup required — all data is seeded in-memory on startup.

---

## Installation

```bash
# 1. Clone or unzip the project
unzip margyn-v2.zip
cd margyn

# 2. Install dependencies
npm install

# 3. Copy the example env file
cp .env .env.local   # or just edit .env directly

# 4. Start the server
npm start
```

The app will be available at **http://localhost:3000**

---

## Configuration (.env)

Copy `.env` to your project root and fill in values as needed. At minimum, set a strong `SESSION_SECRET`.

```env
NODE_ENV=development
PORT=3000

# Required — generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
SESSION_SECRET=your-long-random-secret-here

# Job engine
JOB_CONCURRENCY=3
SCRAPER_DEFAULT_DELAY_MS=3000

# API credentials (fill in as you connect real sources)
EBAY_CLIENT_ID=
EBAY_CLIENT_SECRET=
ETSY_API_KEY=
ALIBABA_APP_KEY=
ALIBABA_APP_SECRET=
ALIEXPRESS_TOKEN=
FAIRE_TOKEN=
```

To load `.env` automatically, add this as the **first line** of `app.js`:

```js
require('dotenv').config();
```

Then install the package:

```bash
npm install dotenv
```

---

## Running the App

| Command | Description |
|---|---|
| `npm start` | Start production server |
| `node app.js` | Start directly |
| `NODE_ENV=development node app.js` | Dev mode with verbose output |

For auto-restart during development, install `nodemon`:

```bash
npm install -D nodemon
npx nodemon app.js
```

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@margyn.io` | `password123` |
| Analyst | `jordan@margyn.io` | `password123` |

---

## Pages & Modules

### `/` — Landing Page
Public marketing page. Showcases the platform value proposition, a blurred dashboard preview, data source logos, features, and how-it-works steps.

### `/auth/login` · `/auth/register`
Split-panel auth pages. Left panel (always dark navy) shows a testimonial and feature highlights. Right panel is the form. Floating theme toggle available top-right.

### `/dashboard`
Post-login home. KPI summary cards, 7-day revenue/units line chart (switchable), margin distribution donut chart, top-5 products by volume, top-5 products by margin, source status panels.

### `/products`
Full product comparison table. Filter by category, sort by sales/margin/price/name, filter by tags (trending, best-margin, high-volume). Each row shows market prices across sources, best supplier price, profit/unit, and margin badge.

### `/b2b`
B2B Commercial catalogue. Sector grid filter (Electronics Components, Manufacturing, Raw Materials, Industrial Supplies, Medical & Lab, Automotive, Construction). Table shows tiered pricing, best bulk unit price, MOQ, lead time, certifications, and trend. Detail page shows full volume pricing tiers, margin breakdown, supplier cards, and annual demand stats.

### `/sources`
Data source management. Two panels — Market Sources (sell-side) and Supplier Sources (buy-side). Each card shows source type (scraper / REST / GraphQL / SOAP), last run status, success rate, avg response time, and run count. Includes an **Add Source** modal with dynamic form sections per type, full auth support, response field mapping, and schedule config. Live progress bars update via SSE when jobs run.

---

## Data Sources & Engines

Margyn supports four integration types for external data:

| Type | Description | Auth Options |
|---|---|---|
| **Website Scraper** | CSS selector extraction from any public URL | User-Agent rotation |
| **REST API** | JSON HTTP endpoints (GET or POST) | API Key, Bearer, OAuth 2.0, Basic |
| **GraphQL** | Query + variables against a GraphQL endpoint | Bearer, API Key, OAuth 2.0 |
| **SOAP / WSDL** | XML envelope templating, `xml2js` response parsing | Basic, Bearer |

---

## Scraper Engine

`engines/scraper.js`

- Uses `axios` for HTTP and `cheerio` for DOM parsing
- Rotates 4 realistic browser User-Agent strings
- Respects configurable `delayMs` between page requests
- Detects HTTP 429 (rate limited) and backs off automatically
- Supports paginated scraping via URL pattern (`?pg={page}`) or path-based pagination
- Extracts `data-src`, `src`, and `data-lazy-src` for images

**Example selector config:**
```js
selectors: {
  productList: '.product-item',
  name: 'h2.product-title',
  price: 'span.price',
  rank: '.rank-number',
  image: 'img.product-image'
}
```

---

## API Connector Engine

`engines/apiConnector.js`

### OAuth 2.0
Fetches and caches access tokens using the `client_credentials` grant. Tokens are refreshed automatically 60 seconds before expiry.

### GraphQL
Sends `{ query, variables }` as a POST body. Use `{searchQuery}` as a placeholder in variable values to enable dynamic product lookups.

### SOAP
Wraps requests in the XML envelope from your `requestTemplate`. Use `{{query}}` as a placeholder. Responses are parsed with `xml2js` (namespace prefixes stripped).

### Response Mapping
All connector types use dot-notation path mapping to extract product fields from nested API responses:

```js
responseMapping: {
  productList: 'data.searchResults.items',
  name:        'product.title',
  price:       'pricing.salePrice.amount',
  moq:         'trade.minimumOrderQty'
}
```

---

## Job Scheduler

`engines/jobRunner.js`

- **Global daily scan** — Runs all active sources at 06:00 every day (configurable via `DEFAULT_SCHEDULE` in `.env`)
- **Per-source schedules** — Each source can define its own cron expression (e.g. `0 */4 * * *` for every 4 hours)
- **Concurrency** — `p-limit` caps parallel jobs (default: 3, configurable via `JOB_CONCURRENCY`)
- **Fallback simulation** — When real scrapes return no data (bot protection, missing credentials), realistic seeded data is used so the UI always has content to show; rows are flagged with a `simulated` badge in the job log
- **SSE streaming** — Real-time `start → progress → complete/error` events broadcast to the Sources page via `/sources/events`

---

## Adding a New Source

1. Navigate to **Data Sources** → click **Add Source**
2. Pick a type: **Website Scraper**, **REST**, **GraphQL**, or **SOAP**
3. Set the role: **Market Source** (tracks sell prices) or **Supplier Source** (tracks buy prices)
4. Fill in connection details, authentication, and field mapping
5. Set a cron schedule (default `0 6 * * *` = 6am daily)
6. Save — the source appears immediately and can be triggered manually with the **▶ Run Now** button

**To connect a real API:** Add your credentials to `.env`, then reference them in `data/sourceStore.js` using `process.env.YOUR_KEY`.

---

## Light / Dark Mode

The theme is toggled via the **moon/sun icon** in the topbar (authenticated pages) or the **floating circle button** top-right (public/auth pages).

- Preference is persisted in `localStorage` under the key `margyn-theme`
- A synchronous inline `<script>` in both layouts applies the saved theme before CSS renders, eliminating any flash-of-wrong-theme on load
- The auth left panel is intentionally always dark (brand accent), regardless of theme

---

## Roadmap

The following features are designed into the architecture but not yet implemented:

- [ ] **Real API integrations** — Plug credentials into `sourceStore.js` to activate live data for eBay, Etsy, Alibaba, AliExpress, Faire
- [ ] **Database persistence** — Swap in-memory stores for MongoDB or PostgreSQL; schemas are already implied by the data shape
- [ ] **Product matching algorithm** — Fuzzy match scraped product names to known SKUs; image similarity via embeddings
- [ ] **Price history & charts** — Store time-series prices per product/source, render trend sparklines
- [ ] **Alerts** — Email/SMS notifications when margin on a tracked product drops below threshold
- [ ] **CSV / Google Sheets export** — One-click data export from Products and B2B pages
- [ ] **Multi-user roles & teams** — Admin, analyst, read-only
- [ ] **Redis caching** — Cache API responses to reduce quota consumption
- [ ] **Docker deployment** — `Dockerfile` + `docker-compose.yml` for production
- [ ] **B2B RFQ flow** — Request-for-quote form submission to verified suppliers directly from the detail page

---

## License

MIT — free to use, modify, and distribute.

---

*Built with Margyn v2 — Real-time product arbitrage intelligence.*
