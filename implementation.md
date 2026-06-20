# 🔧 Implementation Guide — Opportunity Radar AI

A developer reference for the app's dependencies, type system, API routes, AI integration, and state management.

**Live app:** [opportunity-radar-ai.netlify.app/dashboard](https://opportunity-radar-ai.netlify.app/dashboard)

---

## 📖 Table of Contents

- [Main Dependencies](#-main-dependencies)
- [Type System](#-type-system)
- [API Routes](#-api-routes)
- [AI Integration](#-ai-integration)
- [Data Handling](#️-data-handling)
- [Client State](#-client-state)
- [UI Components](#-ui-components)
- [Data Flow Summary](#-data-flow-summary)
- [Deployment Notes](#️-deployment-notes)

---

## 📦 Main Dependencies

| Package | Version | Purpose |
|---|---|---|
| `next` | 16.x | App Router, server routes, build/runtime |
| `react` / `react-dom` | 19.x | UI rendering |
| `typescript` | 5.x | Type safety |
| `zustand` | 5.x | Client state with persistence |
| `framer-motion` | 12.x | Animations |
| `lucide-react` | 1.x | Icons |
| `date-fns` | 4.x | Deadline and date logic |
| `react-hot-toast` | 2.x | Toast notifications |
| `react-markdown` | 10.x | Renders Gemini assistant output |
| `tailwindcss` | 4.x | Utility-first styling |

---

## 🗂 Type System

Shared interfaces live in `types/index.ts`.

### `Opportunity`

| Field | Type | Notes |
|---|---|---|
| `id`, `title`, `organization`, `description` | `string` | Core listing data |
| `eligibility` | `string` | Who can apply |
| `deadline` | `string` (ISO) | Used for urgency calculations |
| `category` | `string` | One of the defined category enums |
| `tags` | `string[]` | Free-form keyword tags |
| `applicationLink` | `string` | External application URL |
| `prize` / `stipend` / `location` / `logoUrl` | `string?` | Optional metadata |
| `isRemote` | `boolean?` | Remote eligibility flag |
| `matchScore` / `matchReason` | `number? / string?` | Populated by AI matching |
| `isUrgent` | `boolean?` | Computed via `computeUrgency()` |

### `UserProfile`

`skills`, `interests`, `educationLevel`, `careerGoals`, `preferredCategories`, `location`

### `ChatMessage`

`id`, `role`, `content`, `timestamp`

### `Notification`

Deadline alerts, daily digest, and match notifications

### `FilterState`

`categories`, deadline window, remote filter, `minMatchScore`, `search`, `sortBy`

---

## 🌐 API Routes

All server routes live under `app/api/`.

### `GET / POST / PATCH /api/opportunities`

| Method | Behavior |
|---|---|
| `GET` | Returns seeded opportunities, with optional filters applied |
| `POST` | Adds a newly scraped opportunity to the in-memory store |
| `PATCH` | Updates `matchScore` / `matchReason` on existing opportunities |

### `POST /api/chat`

- Accepts `messages` (conversation history)
- Returns a Gemini-generated response
- Falls back to a demo message if `GEMINI_API_KEY` is missing

### `POST /api/match`

- Accepts a `profile` object
- Calls `generateMatchScores()` in `lib/gemini.ts`
- Returns ranked opportunities with `matchScore` and `matchReason`
- Falls back to simulated scores when the Gemini key is missing

### `POST /api/scrape`

- Accepts `url` and an optional `category`
- Uses `lib/anakin.ts` to scrape markdown content
- Uses Gemini extraction to parse structured opportunity objects

### `GET /api/notifications`

- Returns a daily digest plus active deadline notifications

---

## 🤖 AI Integration

All Gemini logic is centralized in `lib/gemini.ts`.

### `callGemini()`

- Core request wrapper, targets `gemini-1.5-flash`
- Generation config: `temperature: 0.7`, `topK: 40`, `topP: 0.95`, `maxOutputTokens: 4096`
- Handles API errors and unwraps model text from the response

### `generateMatchScores()`

- Formats the user profile + opportunity list into a structured prompt
- Expects strict JSON output: `{ id, score, reason }[]`
- Falls back to simulated scores if parsing fails

### `chatWithAssistant()`

- Builds a system instruction containing live opportunity context
- Sends the full conversation to Gemini
- Returns markdown-ready text for `react-markdown` rendering

### `extractOpportunitiesFromMarkdown()`

- Parses scraped markdown into structured `Opportunity` objects
- Returns `[]` when no valid JSON array is found in the response

> See [`prompt.md`](./prompt.md) for the full prompt structures and fallback behavior.

---

## 🗃️ Data Handling

The app ships with seeded data in `data/seed-opportunities.json`.

- `app/api/opportunities/route.ts` manages an **in-memory** `opportunitiesDB`
- `computeUrgency()` sets `isUrgent` flags based on each opportunity's deadline
- Data resets on server restart or hot reload

> ⚠️ For production, replace the in-memory dataset with a persistent database.

---

## 🏪 Client State

`lib/store.ts` defines the global Zustand store.

| Persisted (localStorage) | Transient (session-only) |
|---|---|
| `savedIds` | `opportunities` |
| `userProfile` | `filters` |
| `chatMessages` | `isScrapingActive` |
| `notifications` | |
| `theme` | |

---

## 📌 UI Components

### `OpportunityCard`

- Displays category badge, match score, deadline, and a save action
- Composes `MatchScore` and `CountdownTimer`
- Applies urgency styling when the deadline is within 7 days

### `ChatInterface`

- Sends chat history to `/api/chat`
- Renders the reply with `react-markdown`
- Shows a loading state and suggested starter prompts

### `DeadlineWidget`

- Displays upcoming deadlines with progress bars
- Highlights urgent opportunities using red/orange indicators

---

## 🔁 Data Flow Summary

1. **Dashboard** fetches `/api/opportunities` and `/api/notifications` on load
2. **Profile** submission triggers `/api/match` to compute AI scores
3. **Chat** sends messages to `/api/chat` for assistant replies
4. **Scrape** posts a URL to `/api/scrape` and receives structured opportunities back

---

## ⚙️ Deployment Notes

- Add `GEMINI_API_KEY` and optionally `ANAKIN_API_KEY` as environment variables (`.env.local` locally, or your host's dashboard in production)
- Build with `npm run build`
- Start with `npm run start`
- Currently deployed on **Netlify**, configured via `netlify.toml`
- Replace the in-memory data store with a real database before scaling to production traffic
