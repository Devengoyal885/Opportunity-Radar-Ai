# 🎯 Opportunity Radar AI

> **AI-powered discovery engine for students and developers** — find hackathons, internships, scholarships, fellowships, grants, and open-source programs, all ranked and matched to *you*.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Gemini AI](https://img.shields.io/badge/Gemini-1.5_Flash-orange?logo=google)](https://aistudio.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**🔗 Live App:** [opportunity-radar-ai.netlify.app/dashboard](https://opportunity-radar-ai.netlify.app/dashboard)
**📦 Source:** [github.com/Devengoyal885/Opportunity-Radar-Ai](https://github.com/Devengoyal885/Opportunity-Radar-Ai)

---

## 📖 Table of Contents

- [✨ What it does](#-what-it-does)
- [🖼 Preview](#-preview)
- [🚀 Quick Start](#-quick-start)
- [📦 App Pages](#-app-pages)
- [🔌 API Endpoints](#-api-endpoints)
- [🛠 Tech Stack](#-tech-stack)
- [📁 Project Structure](#-project-structure)
- [📚 Documentation](#-documentation)
- [💡 Notes](#-notes)
- [🧪 Scripts](#-scripts)
- [🗺 Roadmap](#-roadmap)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ What it does

| | |
|---|---|
| 🧠 | Uses **Google Gemini 1.5 Flash** to score opportunities against a user's skills, interests, and goals |
| 💬 | Ships a conversational **Radar AI** chat assistant with live opportunity context |
| 🕸 | Scrapes live listings via **Anakin** and extracts structured opportunity data with Gemini |
| ⏱ | Tracks deadlines with **urgency badges** and countdown timers |
| 🔖 | Lets users **save and revisit** opportunities across sessions |
| 🌗 | Supports **dark / light theme** with a glassmorphism visual language |

---

## 🖼 Preview

| Dashboard | Chat Assistant |
|---|---|
| Top matches, stats, and urgent deadlines at a glance | Ask Radar AI for personalized opportunity recommendations |

> 🔗 Try it live: **[opportunity-radar-ai.netlify.app/dashboard](https://opportunity-radar-ai.netlify.app/dashboard)**

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and **npm**
- A `GEMINI_API_KEY` for AI matching and chat
- *(Optional)* An `ANAKIN_API_KEY` for live scraping

### Install

```bash
git clone https://github.com/Devengoyal885/Opportunity-Radar-Ai.git
cd Opportunity-Radar-Ai
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

Open **<http://localhost:3000>** — you'll be redirected to `/dashboard`.

---

## 📦 App Pages

| Route | Purpose |
|---|---|
| `/dashboard` | Main discovery dashboard with top matches, stats, and urgent deadlines |
| `/opportunities` | Browse filtered opportunity listings |
| `/saved` | View saved / bookmarked opportunities |
| `/chat` | Chat with the Radar AI assistant |
| `/calendar` | Deadline calendar overview |
| `/profile` | Enter skills, interests, education level, and career goals |

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

| Layer | Technology |
|---|---|
| Framework | **Next.js 16** (App Router) |
| UI | **React 19** + **TypeScript 5** |
| Styling | **Tailwind CSS 4** + custom glassmorphism design tokens |
| State | **Zustand** (with persistence) |
| Animation | **Framer Motion** |
| Icons | **Lucide React** |
| Dates | **date-fns** |
| Notifications | **react-hot-toast** |
| AI rendering | **react-markdown** |
| AI provider | **Google Gemini 1.5 Flash** |
| Scraping | **Anakin API** |
| Hosting | **Netlify** |

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
│   ├── dashboard/              # StatsBar, OpportunityCard, DeadlineWidget
│   ├── chat/                  # ChatInterface
│   ├── opportunities/         # Filter panel, opportunity list
│   └── ui/                    # MatchScore, CountdownTimer
├── lib/
│   ├── gemini.ts               # Gemini API client (matching + chat + extraction)
│   ├── anakin.ts               # Anakin scraper client
│   ├── store.ts                # Zustand global state
│   ├── matching.ts             # Deadline and score utilities
│   └── notifications.ts        # Notification generation
├── types/
│   └── index.ts                 # TypeScript interfaces
└── data/
    └── seed-opportunities.json  # Seeded opportunity dataset
```

---

## 📚 Documentation

| Doc | Description |
|---|---|
| [`architecture.md`](./architecture.md) | System overview, data flow, and key modules |
| [`design.md`](./design.md) | Color palette, typography, and component patterns |
| [`implementation.md`](./implementation.md) | Developer reference for dependencies, types, and routes |
| [`prompt.md`](./prompt.md) | Gemini prompt patterns and AI behavior |

---

## 💡 Notes

- The app currently uses seeded opportunity data stored in `data/seed-opportunities.json`.
- AI chat and match scoring fall back to demo responses when `GEMINI_API_KEY` is not configured.
- Live scraping requires `ANAKIN_API_KEY` and uses Anakin to scrape content, then Gemini to extract structured opportunity fields.
- Data is stored in-memory on the server; it resets on restart. Production deployments should use a persistent database.

---

## 🧪 Scripts

```bash
npm run dev      # Start the dev server
npm run build    # Production build
npm run start    # Start the production server
npm run lint     # Run ESLint
```

---

## 🗺 Roadmap

- [ ] Persistent database (replace in-memory `opportunitiesDB`)
- [ ] User authentication & multi-profile support
- [ ] Email/push deadline reminders
- [ ] Expanded scraper source coverage
- [ ] Public opportunity submission flow

---

## 🤝 Contributing

Issues and pull requests are welcome. Please open an issue first to discuss significant changes.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Open a pull request

---

## 📄 License

MIT © 2026 Opportunity Radar AI
