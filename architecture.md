# 🏗 Architecture — Opportunity Radar AI

A high-level view of the application structure, data flow, and AI integration.

---

## 📦 System overview

```
Browser (client)
├─ Next.js App Router
│  ├─ Pages: /dashboard, /opportunities, /saved, /chat, /calendar, /profile
│  ├─ Components: Sidebar, Header, OpportunityCard, ChatInterface
│  └─ Zustand store: opportunities, filters, userProfile, theme, chatMessages, notifications

Server (Next.js API routes)
├─ /api/opportunities
├─ /api/chat
├─ /api/match
├─ /api/scrape
└─ /api/notifications

External services
├─ Google Gemini 1.5 Flash
└─ Anakin API
```

---

## 🧩 Directory responsibility

- `app/` — page routes, root layout, and global styles
- `components/` — reusable UI components and page-specific widgets
- `lib/` — AI clients, scraping helpers, matching utilities, and store
- `data/` — seeded sample opportunities
- `types/` — TypeScript interfaces

---

## 🔄 Data flow

### 1. Dashboard start

- Client loads `/dashboard`
- Calls `/api/opportunities` and `/api/notifications`
- Updates Zustand store with responses
- Components render opportunities and widgets

### 2. Profile matching

- User posts profile to `/api/match`
- Server calls `generateMatchScores()` in `lib/gemini.ts`
- Returns ranked opportunities with AI scores
- Client re-renders sorted matches

### 3. Radar AI chat

- User posts message to `/api/chat`
- Server uses `chatWithAssistant()` and sends history to Gemini
- Gemini responds with markdown-ready text
- Client displays the chat reply

### 4. Scraping workflow

- Client posts URL to `/api/scrape`
- Server scrapes content via Anakin
- Server extracts opportunities via Gemini
- Extracted items are returned for review or ingestion

---

## 🔧 Key modules

### `lib/gemini.ts`

- `callGemini()` — core Gemini request wrapper
- `generateMatchScores()` — profile-based scoring prompt
- `chatWithAssistant()` — assistant prompt builder
- `extractOpportunitiesFromMarkdown()` — structured extraction

### `lib/anakin.ts`

- `scrapeUrl()` — fetch markdown from a URL
- `crawlSite()` — optional site crawling helper
- `searchOpportunities()` — optional search helper

### `lib/matching.ts`

- `computeUrgency()` — sets `isUrgent` based on deadline
- `getDaysUntilDeadline()` / `getDeadlineStatus()` — deadline helpers
- Sort and filter helpers for opportunity lists

### `lib/notifications.ts`

- Generates deadline alerts and daily digest notifications

---

## 📍 Notes

- `app/api/opportunities/route.ts` uses an in-memory `opportunitiesDB`
- `data/seed-opportunities.json` is loaded on server start
- State is not persisted across server restart in the current implementation
- Production should use a persistent database or storage layer
