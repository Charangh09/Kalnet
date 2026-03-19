# Explain My Plan — AI Clarity & Structuring Tool

A full-stack web app that converts vague ideas into structured, practical plans using an LLM (Gemini), highlights missing elements, and scores plan clarity from 0–100.

## Project Overview

This project is built to help users turn unstructured natural-language ideas into actionable outputs:
- Structured plan: goal, method, steps, timeline
- Missing element detection
- Simplified version of the input
- Practical action steps
- Transparent clarity score with reasoning
- Re-analysis flow for iteration (before vs after score)

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express (REST API)
- **AI:** Gemini API (`@google/generative-ai`)
- **Database (optional):** MongoDB via Mongoose

## Folder Structure

```txt
kalnet_assignment/
  client/
    src/
      components/
      services/
  server/
    src/
      config/
      controllers/
      models/
      routes/
      services/
```

## Setup Instructions

### 1) Clone and install

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 2) Environment variables

Create `server/.env` from `server/.env.example`:

```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash
MONGODB_URI=
```

Create `client/.env` from `client/.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

### 3) Run locally

```bash
# terminal 1
cd server
npm run dev

# terminal 2
cd client
npm run dev
```

Open `http://localhost:5173`.

## API

### POST `/analyze`

**Input**

```json
{
  "idea": "I want to start a YouTube channel and earn money quickly"
}
```

**Response shape**

```json
{
  "input_idea": "...",
  "structured_plan": {
    "goal": "",
    "method": "",
    "steps": [],
    "timeline": ""
  },
  "missing_elements": {
    "goal_clarity": true,
    "steps_missing": true,
    "resources_missing": true,
    "timeline_missing": true
  },
  "simplified_version": "",
  "action_steps": [],
  "clarity_score": {
    "score": 0,
    "breakdown": {
      "goal": 0,
      "steps": 0,
      "timeline": 0,
      "completeness": 0
    },
    "reason": ""
  },
  "generated_at": "2026-03-19T00:00:00.000Z"
}
```

## Prompt Design Explanation

The backend uses a structured prompt in `server/src/services/promptService.js` with:
- Role definition: expert planning assistant
- Strict JSON schema constraints
- Explicit rules:
  - JSON-only response (no markdown)
  - practical and concise outputs
  - 5–8 action steps
  - boolean missing-element flags

This design reduces output drift and improves parse reliability.

## Clarity Score Logic

Scoring is transparent and deterministic in `server/src/services/planFormatter.js`:

- Goal defined and clear: **+25**
- Steps present and not missing: **+25**
- Timeline present and not missing: **+25**
- Overall completeness: **+25**

Total score = sum of all four components (0–100).

## Deployment Notes

- **Frontend:** deploy `client` on Vercel (set `VITE_API_BASE_URL`)
- **Backend:** deploy `server` on Render/Railway (set `.env` values)
- Enable CORS with deployed frontend URL in `CLIENT_ORIGIN`.

## Optional MongoDB Persistence

If `MONGODB_URI` is provided, each analysis stores:
- user input
- AI output
- timestamps

If not provided, app runs normally without persistence.
