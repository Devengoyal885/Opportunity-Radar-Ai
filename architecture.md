# 🏗 Architecture — Opportunity Radar AI

A high-level view of the application's structure, data flow, and AI integration.

**Live app:** [opportunity-radar-ai.netlify.app/dashboard](https://opportunity-radar-ai.netlify.app/dashboard)
**Repository:** [github.com/Devengoyal885/Opportunity-Radar-Ai](https://github.com/Devengoyal885/Opportunity-Radar-Ai)

---

## 📖 Table of Contents

- [System Overview](#-system-overview)
- [Directory Responsibility](#-directory-responsibility)
- [Data Flow](#-data-flow)
- [Key Modules](#-key-modules)
- [State Management](#-state-management)
- [External Services](#-external-services)
- [Deployment Topology](#-deployment-topology)
- [Notes & Limitations](#-notes--limitations)

---

## 📦 System Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                         Browser (Client)                         │
│                                                                    │
│   Next.js App Router (React 19 + TypeScript)                      │
│   ├─ Pages: /dashboard  /opportunities  /saved                    │
│   │          /chat      /calendar       /profile                  │
│   ├─ Components: Sidebar, Header, OpportunityCard, ChatInterface  │
│   └─ Zustand store: opportunities, filters, userProfile,          │
│                      theme, chatMessages, notifications           │
└───────────────────────────┬────────────────────────────────────-─┘
                             │ fetch (JSON over HTTPS)
┌───────────────────────────▼────────────────────────────────────-─┐
│                  Server — Next.js API Routes                      │
│                                                                    │
│   /api/opportunities   /api/chat     /api/match                   │
│   /api/scrape          /api/notifications                         │
└───────────┬────────────────────────────────────┬─────────────────┘
            │                                     │
┌───────────▼────────────┐           ┌────────────▼────────────────┐
│   Google Gemini 1.5     │           │        Anakin API           │
│   Flash (AI matching,   │           │   (live opportunity         │
│   chat, extraction)     │           │    scraping)                │
└──────────────────────────┘           └──────────────────────────┘
```

---

## 🧩 Directory Responsibility

| Directory | Responsibility |
|---|---|
| `app/` | Page routes, root layout, global styles, and API route handlers |
| `components/` | Reusable UI components and page-specific widgets |
| `lib/` | AI clients, scraping helpers, matching utilities, and the global store |
| `data/` | Seeded sample opportunity dataset |
| `types/` | Shared TypeScript interfaces |

---

## 🔄 Data Flow

### 1. Dashboard load

```
Client → GET /api/opportunities ─┐
                                  ├─→ Zustand store updated
Client → GET /api/notifications ─┘        │
                                           ▼
                          Dashboard widgets render
```

- Client loads `/dashboard`
- Calls `/api/opportunities` and `/api/notifications` in parallel
- Updates the Zustand store with both responses
- Components render opportunity cards, stats, and deadline widgets

### 2. Profile matching

```
User profile → POST /api/match → generateMatchScores() (lib/gemini.ts)
                                        │
                                        ▼
                     Ranked opportunities with matchScore + matchReason
                                        │
                                        ▼
                          Client re-renders sorted matches
```

### 3. Radar AI chat

```
User message → POST /api/chat → chatWithAssistant() (lib/gemini.ts)
                                        │
                          Conversation + opportunity context → Gemini
                                        │
                                        ▼
                         Markdown-ready reply → ChatInterface
```

### 4. Scraping workflow

```
URL → POST /api/scrape → scrapeUrl() (lib/anakin.ts)
                                │
                                ▼
              extractOpportunitiesFromMarkdown() (lib/gemini.ts)
                                │
                                ▼
              Structured opportunities returned for review/ingestion
```

---

## 🔧 Key Modules

### `lib/gemini.ts` — AI integration layer

| Function | Role |
|---|---|
| `callGemini()` | Core request wrapper around the Gemini API |
| `generateMatchScores()` | Profile-based scoring prompt and response parsing |
| `chatWithAssistant()` | Builds the assistant prompt with opportunity context |
| `extractOpportunitiesFromMarkdown()` | Structured extraction from scraped content |

### `lib/anakin.ts` — Scraping client

| Function | Role |
|---|---|
| `scrapeUrl()` | Fetches markdown content from a URL |
| `crawlSite()` | Optional multi-page site crawling |
| `searchOpportunities()` | Optional search-based discovery |

### `lib/matching.ts` — Deadline & scoring utilities

| Function | Role |
|---|---|
| `computeUrgency()` | Sets `isUrgent` based on the deadline window |
| `getDaysUntilDeadline()` / `getDeadlineStatus()` | Deadline math helpers |
| Sort/filter helpers | Power the opportunities list and dashboard ordering |

### `lib/notifications.ts` — Alerts engine

- Generates deadline alerts and a daily digest notification set

---

## 🏪 State Management

The app uses a single **Zustand** store (`lib/store.ts`) split into persisted and transient slices.

| Persisted (localStorage) | Transient (in-memory) |
|---|---|
| `savedIds` | `opportunities` |
| `userProfile` | `filters` |
| `chatMessages` | `isScrapingActive` |
| `notifications` | |
| `theme` | |

---

## 🌐 External Services

| Service | Used for | Required env var |
|---|---|---|
| **Google Gemini 1.5 Flash** | Match scoring, chat assistant, content extraction | `GEMINI_API_KEY` |
| **Anakin API** | Live opportunity scraping | `ANAKIN_API_KEY` (optional) |

Both integrations degrade gracefully to demo/fallback behavior when their respective keys are missing — see [`prompt.md`](./prompt.md#4-fallback-behavior).

---

## ☁️ Deployment Topology

```
GitHub repo ──push──▶ Netlify build (npm run build) ──▶ opportunity-radar-ai.netlify.app
```

- Hosted on **Netlify**, configured via `netlify.toml`
- Environment variables (`GEMINI_API_KEY`, `ANAKIN_API_KEY`) are set in the Netlify dashboard for production
- Next.js API routes run as serverless functions at the edge of the deployment

---

## 📍 Notes & Limitations

- `app/api/opportunities/route.ts` uses an **in-memory** `opportunitiesDB`
- `data/seed-opportunities.json` is loaded on server start
- State is **not persisted** across server restarts in the current implementation
- Production deployments should replace the in-memory store with a persistent database (e.g. Postgres, MongoDB, or a managed service)
