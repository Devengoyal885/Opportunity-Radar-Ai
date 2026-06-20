# 🧠 Prompt Design — Opportunity Radar AI

This document describes the prompt patterns and system instructions used by the app's Gemini integration.

**Live app:** [opportunity-radar-ai.netlify.app/dashboard](https://opportunity-radar-ai.netlify.app/dashboard)

---

## 📖 Table of Contents

- [1. AI Match Scoring Prompt](#1-ai-match-scoring-prompt)
- [2. Chat Assistant Prompt](#2-chat-assistant-prompt)
- [3. Extraction Prompt](#3-extraction-prompt)
- [4. Fallback Behavior](#4-fallback-behavior)
- [5. Prompt Tuning Guidelines](#5-prompt-tuning-guidelines)

---

## 1. AI Match Scoring Prompt

Used by `lib/gemini.ts` in `generateMatchScores()`.

### Purpose

Generate a relevance score for each opportunity against a specific user profile.

### Structure

| Section | Content |
|---|---|
| User profile block | Skills, interests, education level, career goals, preferred categories |
| Opportunity blocks | Numbered list, each capped at the first 200 characters of description |
| Output instruction | Strict directive to return valid JSON only |

### Expected output

```json
[
  {
    "id": "opp-001",
    "score": 85,
    "reason": "Strong match for your ML skills and open-source experience."
  }
]
```

### Key instructions

- Score each opportunity from `0`–`100`
- Provide a brief, one-sentence reason per score
- Return **only** JSON — no preamble, no markdown fences
- A higher score means a better fit for the user's skills, interests, education, and goals

---

## 2. Chat Assistant Prompt

Used by `lib/gemini.ts` in `chatWithAssistant()`.

### System instruction highlights

- You are **Radar AI**, an intelligent assistant for the Opportunity Radar platform.
- Help students, developers, and job seekers discover opportunities.
- Reference specific opportunities from the provided database context when relevant.
- Be concise and use markdown formatting.
- Always mention deadlines for any opportunity you cite.
- Encourage users to save opportunities and complete their profile.

### Context input

The assistant is given the **top 20 opportunities** in the database as plain text. Each entry includes title, organization, category, deadline, and remote/location status.

### Message payload

| Role mapping | Behavior |
|---|---|
| `user` messages | Sent as Gemini `user` role |
| `assistant` / `system` messages | Converted to Gemini-friendly `model` or `user` roles |

The client sends the full conversation history with each request.

---

## 3. Extraction Prompt

Used by `lib/gemini.ts` in `extractOpportunitiesFromMarkdown()`.

### Purpose

Parse scraped page content (from Anakin) into structured opportunity objects.

### Expected JSON schema

```json
[
  {
    "title": "Opportunity Title",
    "organization": "Organization Name",
    "description": "Brief description (2-3 sentences)",
    "eligibility": "Who can apply",
    "deadline": "YYYY-MM-DDTHH:mm:ss.000Z or null",
    "category": "hackathon|internship|scholarship|fellowship|open-source|startup|competition|grant",
    "tags": ["tag1", "tag2"],
    "applicationLink": "URL",
    "prize": "Prize amount if any",
    "stipend": "Stipend if any",
    "location": "Location",
    "isRemote": true
  }
]
```

### Behavior

- Reads the scraped markdown content
- Extracts opportunity metadata only — no narrative text
- Returns `[]` when no opportunities are found
- Must not include any text outside the JSON array

---

## 4. Fallback Behavior

### When `GEMINI_API_KEY` is missing

| Route | Fallback |
|---|---|
| `/api/chat` | Returns a demo message listing sample opportunities |
| `/api/match` | Returns seeded opportunities with simulated match scores |
| `/api/scrape` | Returns a clear error indicating `ANAKIN_API_KEY` is required |

### When JSON parsing fails

- `generateMatchScores()` falls back to a randomized score set if the model's response can't be parsed cleanly
- The current implementation uses regex extraction to locate the first JSON array in the raw response text

---

## 5. Prompt Tuning Guidelines

1. Keep system instructions **brief but descriptive** — Gemini performs better with focused context
2. Use **explicit schema requirements** whenever expecting structured JSON output
3. **Limit opportunity descriptions** in prompts to avoid bloated token usage
4. Present deadlines and remote status **clearly and consistently** in chat context
5. Prefer **markdown-friendly** responses so the UI can render them directly with `react-markdown`
6. When iterating on prompts, test both the happy path **and** the fallback/parsing-failure path
