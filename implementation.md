# 🔧 Implementation Guide — Opportunity Radar AI

A developer reference for the app's architecture, AI integration, and implementation patterns.

---

## 📦 Main dependencies

| Package | Purpose |
|---|---|
| `next` | App Router, server routes |
| `react` / `react-dom` | UI rendering |
| `typescript` | type safety |
| `zustand` | client state with persistence |
| `framer-motion` | animations |
| `lucide-react` | icons |
| `date-fns` | deadline and date logic |
| `react-hot-toast` | toast notifications |
| `react-markdown` | render Gemini assistant output |
| `tailwindcss` | utility styling |

---

## 🗂 Type system

Shared interfaces are defined in `types/index.ts`.

### Core models

- `Opportunity`
  - id, title, organization, description, eligibility, deadline
  - category, tags, applicationLink
  - optional prize/stipend/location/logoUrl
  - `isRemote`, `matchScore`, `matchReason`, `isUrgent`

- `UserProfile`
  - skills, interests, educationLevel, careerGoals, preferredCategories, location

- `ChatMessage`
  - id, role, content, timestamp

- `Notification`
  - deadline alerts, daily digest, match notifications

- `FilterState`
  - categories, deadline window, remote filter, minMatchScore, search, sortBy

---

## 🌐 API routes

All server routes live under `app/api/`.

### `/api/opportunities`

- `GET` returns seeded opportunities with filters
- `POST` adds a scraped opportunity
- `PATCH` updates `matchScore` and `matchReason`

### `/api/chat`

- `POST` accepts `messages` and returns a Gemini response
- If `GEMINI_API_KEY` is missing, returns a demo fallback message

### `/api/match`

- `POST` accepts `profile`
- Calls `generateMatchScores()` in `lib/gemini.ts`
- Returns ranked opportunities with `matchScore` and `matchReason`
- Falls back to simulated scores when the Gemini key is missing

### `/api/scrape`

- `POST` accepts `url` and optional `category`
- Uses `lib/anakin.ts` to scrape markdown
- Uses Gemini extraction to parse structured opportunities

### `/api/notifications`

- `GET` returns a daily digest and deadline notifications

---

## 🤖 AI integration

Gemini logic lives in `lib/gemini.ts`.

### `callGemini()`

- Sends requests to `gemini-1.5-flash`
- Uses `temperature: 0.7`, `topK: 40`, `topP: 0.95`, `maxOutputTokens: 4096`
- Handles API errors and returns model text

### `generateMatchScores()`

- Formats profile and opportunity data into a structured prompt
- Expects JSON output with `id`, `score`, and `reason`
- Falls back to simulated scores when parsing fails

### `chatWithAssistant()`

- Builds a system instruction containing opportunity context
- Sends the conversation to Gemini
- Returns markdown-ready text

### `extractOpportunitiesFromMarkdown()`

- Parses scraped markdown into structured opportunity objects
- Returns `[]` if no valid JSON is found

---

## 🗃️ Data handling

The app uses seeded data from `data/seed-opportunities.json`.

- `app/api/opportunities/route.ts` manages an in-memory `opportunitiesDB`
- `computeUrgency()` sets `isUrgent` flags based on deadlines
- Data resets on server restart or hot reload

> For production, replace the in-memory dataset with a persistent database.

---

## 🏪 Client state

`lib/store.ts` defines the Zustand store.

Persisted slices:

- `savedIds`
- `userProfile`
- `chatMessages`
- `notifications`
- `theme`

Transient state:

- `opportunities`
- `filters`
- `isScrapingActive`

---

## 📌 UI components

### `OpportunityCard`

- Displays category badge, match score, deadline, and save action
- Uses `MatchScore` and `CountdownTimer`
- Applies urgency styling for deadlines within 7 days

### `ChatInterface`

- Sends chat history to `/api/chat`
- Renders reply text with `react-markdown`
- Shows loading state and suggested prompts

### `DeadlineWidget`

- Displays upcoming deadlines and progress bars
- Highlights urgent opportunities with red/orange indicators

---

## 🔁 Data flow

1. `Dashboard` fetches `/api/opportunities` and `/api/notifications`
2. `Profile` submission triggers `/api/match`
3. `Chat` sends messages to `/api/chat`
4. `Scrape` requests `/api/scrape` and receives structured opportunities

---

## ⚙️ Deployment notes

- Add `GEMINI_API_KEY` and optionally `ANAKIN_API_KEY` in `.env.local`
- Build with `npm run build`
- Start with `npm run start`
- Use a real database in production
