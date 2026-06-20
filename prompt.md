# 🧠 Prompt Design — Opportunity Radar AI

This document describes the prompt patterns and system instructions used by the app's Gemini integration.

---

## 1. AI match scoring prompt

Used by `lib/gemini.ts` in `generateMatchScores()`.

### Purpose

Generate relevance scores for each opportunity against a user profile.

### Structure

- User profile block
- Opportunity blocks, each numbered and limited to the first 200 characters of description
- Instructions to return valid JSON only

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

- Score each opportunity from `0-100`
- Provide a brief 1-sentence reason
- Return only JSON
- Higher score means a better fit for the user's skills, interests, education, and goals

---

## 2. Chat assistant prompt

Used by `lib/gemini.ts` in `chatWithAssistant()`.

### System instruction highlights

- You are Radar AI, an intelligent assistant for the Opportunity Radar platform.
- Help students, developers, and job seekers discover opportunities.
- Reference specific opportunities from the provided database context when relevant.
- Be concise and use markdown formatting.
- Always mention deadlines for specific opportunities.
- Encourage saving opportunities and setting up a profile.

### Context input

The assistant is given the top 20 opportunities in the database as plain text.
Each entry includes title, organization, category, deadline, and remote/location status.

### Message payload

- The client sends the conversation history as a list of role/content messages.
- User messages remain `user` role.
- Assistant and system are converted to Gemini-friendly `model` or `user` roles.

---

## 3. Extraction prompt

Used by `lib/gemini.ts` in `extractOpportunitiesFromMarkdown()`.

### Purpose

Parse scraped page content into structured opportunity objects.

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

- Read the scraped markdown content
- Extract opportunity metadata only
- Return `[]` when none are found
- Do not include extra text outside JSON

---

## 4. Fallback behavior

### Gemini key missing

- `api/chat` returns a demo message listing sample opportunities
- `api/match` returns seeded opportunities with simulated match scores
- `api/scrape` returns a clear error indicating `ANAKIN_API_KEY` is required

### JSON parsing fallback

- `generateMatchScores()` will fallback to a random score set if the model response cannot be parsed cleanly
- The current implementation uses regex extraction on the first JSON array found in the response

---

## 5. Prompt tuning guidelines

- Keep system instructions brief but descriptive
- Use explicit schema requirements when expecting JSON
- Limit opportunity descriptions to avoid long prompts
- Present deadlines and remote status clearly in chat context
- Prefer markdown-friendly responses for the UI
