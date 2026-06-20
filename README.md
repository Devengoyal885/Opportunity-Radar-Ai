# 🎯 Opportunity Radar AI

> AI-powered discovery engine for students and developers — find hackathons, internships, scholarships, fellowships, grants, and open-source programs in one place.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Gemini AI](https://img.shields.io/badge/Gemini-1.5_Flash-orange?logo=google)](https://aistudio.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## ✨ What it does

- Uses Google Gemini 1.5 Flash to score opportunities against user profiles
- Provides a conversational Radar AI chat assistant with opportunity context
- Scrapes live listings via Anakin and extracts structured opportunity data
- Tracks deadlines with urgency badges and countdown timers
- Lets users save and revisit opportunities across sessions
- Supports dark/light theme with glassmorphism visuals

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and **npm**
- A `GEMINI_API_KEY` for AI matching and chat
- *(Optional)* An `ANAKIN_API_KEY` for live scraping

### Install

```bash
git clone https://github.com/your-org/opportunity-radar-ai.git
cd opportunity-radar-ai
npm install
```

### Configure

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
ANAKIN_API_KEY=your_anakin_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 📦 App Pages

| Route | Purpose |
|---|---|
| `/dashboard` | Main discovery dashboard with top matches, stats, and urgent deadlines |
| `/opportunities` | Browse filtered opportunity listings |
| `/saved` | See saved/bookmarked opportunities |
| `/chat` | Chat with Radar AI assistant |
| `/calendar` | Deadline calendar overview |
| `/profile` | Enter skills, interests, education level, and goals |

---

## 🔌 API Endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/opportunities` | Fetch opportunities with optional filters |
| `POST` | `/api/opportunities` | Create a new scraped opportunity entry |
| `PATCH` | `/api/opportunities` | Update AI match scores for existing opportunities |
| `POST` | `/api/chat` | Send a chat request to Radar AI |
| `POST` | `/api/match` | Generate match scores for a user profile |
| `POST` | `/api/scrape` | Scrape a URL and extract opportunity data |
| `GET` | `/api/notifications` | Fetch deadline and digest notifications |

---

## 🛠 Tech Stack

- **Next.js 16** App Router
- **React 19** / **TypeScript 5**
- **Zustand** for client state and persistence
- **Framer Motion** for animation
- **Lucide React** icons
- **date-fns** for deadline math
- **react-hot-toast** for notifications
- **react-markdown** for AI chat responses
- **Tailwind CSS 4** for base styling

---

## 📁 Project Structure

```
opportunity-radar-ai/
├── app/
│   ├── api/                   # Next.js API routes
│   ├── dashboard/             # Dashboard page
│   ├── opportunities/         # Browse page
│   ├── chat/                  # AI chat page
│   ├── calendar/              # Calendar page
│   ├── saved/                 # Saved items page
│   ├── profile/               # User profile page
│   ├── layout.tsx             # Root layout + metadata
│   ├── page.tsx               # Redirect landing page
│   └── globals.css            # Design tokens & utility classes
├── components/
│   ├── layout/                # Sidebar, Header, ThemeProvider
│   ├── dashboard/             # StatsBar, OpportunityCard, DeadlineWidget
│   ├── chat/                  # ChatInterface
│   ├── opportunities/         # Filter panel, opportunity list
│   └── ui/                    # MatchScore, CountdownTimer
├── lib/
│   ├── gemini.ts              # Gemini API client (matching + chat + extraction)
│   ├── anakin.ts              # Anakin scraper client
│   ├── store.ts               # Zustand global state
│   ├── matching.ts            # Deadline and score utilities
│   └── notifications.ts       # Notification generation
├── types/
│   └── index.ts               # TypeScript interfaces
└── data/
    └── seed-opportunities.json  # Seeded opportunity dataset
```

---

## 💡 Notes

- The app currently uses seeded opportunity data stored in `data/seed-opportunities.json`.
- AI chat and match scoring fall back to demo responses when `GEMINI_API_KEY` is not configured.
- Live scraping requires `ANAKIN_API_KEY` and uses Anakin to scrape content then Gemini to extract structured opportunity fields.

---

## 🧪 Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

---

## 📄 License

MIT © 2026 Opportunity Radar AI
