# 21k Coach

A macOS desktop running training assistant for a 21k race, built with Electron + React + Vite.

## Features

- **Dashboard** — Countdown to race day, training stats, projected finish time, 8-week color-coded training plan
- **Session Log** — Log your runs with distance, pace, feel rating, and notes. All data persisted locally via `electron-store`
- **AI Coach** — Chat with an AI running coach powered by the Devin API. Speaks in español rioplatense with practical, concise advice

## Stack

- Electron (main process) + React + Vite (renderer)
- `electron-store` for local persistence (no backend, no database)
- Devin API for AI Coach (calls made securely from main process via IPC)

## Setup

```bash
# 1. Clone the repo
git clone https://github.com/amarazzi/road-to-21k.git
cd road-to-21k

# 2. Install dependencies
npm install

# 3. Configure your Devin API key
cp .env.example .env
# Edit .env and add your DEVIN_API_KEY

# 4. Run in development mode
npm run dev
```

## Build

```bash
# Package a macOS .dmg
npm run build
```

The output will be in the `release/` folder.

## Training Plan

The app includes a hardcoded 8-week training plan with these phases:

| Week | Phase          | Color   |
|------|----------------|---------|
| 1–2  | Base           | #c8b89a |
| 3    | Velocidad      | #e07b5a |
| 4    | Recuperación   | #8aad8a |
| 5    | Velocidad      | #e07b5a |
| 6    | Especificidad  | #7a9ec0 |
| 7–8  | Taper          | #a889c0 |

## Design

- Font: DM Serif Display (headings) + DM Mono (UI/body)
- Background: `#f7f4ef`, Text: `#1a1612`, Accent: `#1a1612`
- Max content width: 480px, centered
- Frameless window with custom draggable titlebar

## Environment Variables

| Variable       | Description              |
|----------------|--------------------------|
| `DEVIN_API_KEY`| Your Devin API key       |
