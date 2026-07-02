# SkillForge — Increment 1: Static Dashboard

Personal learning operating system for career development. This increment
implements a **static, read-only dashboard** with mock data — no auth, no
database, no AI yet, per the build-incrementally plan.

## What's implemented

- **Daily timetable** (`components/TimetableList.tsx` + `TimeBlockCard.tsx`)
  — time-blocked tasks with priority, KPI goal, and required evidence.
- **Active block detection** (`lib/time.ts`) — a client-side clock ticks every
  15s and flags whichever block the current wall-clock time falls inside,
  independent of its manual `status`. Initial render is SSR-safe (`now`
  starts `null`, hydrates after mount, so server/client markup always match).
- **Task status** — `todo | active | done | partial | missed`, rendered via
  `StatusBadge`.
- **Skill tree with mastery 0–100%** (`components/SkillTree.tsx`) — nodes
  grouped by category (Foundations, Low-level Systems, Security, Programming
  Core, Career & Portfolio), each with a segmented XP-bar style mastery
  indicator.
- **Daily KPI summary** (`components/KPISummaryBar.tsx`) — must-task
  completion, done/partial/missed counts, streak.

All data currently comes from `lib/mock-data.ts`. Swap that module for a
Supabase query later without touching any component — every component takes
typed props (`types/index.ts`) and knows nothing about the data source.

## Not implemented yet (by design)

- Auth
- Supabase Postgres / Realtime wiring (components are already shaped so a
  realtime subscription can just call `setState` with fresh rows)
- Weekly review & difficulty adjustment
- AI daily planner (OpenAI)

## Run locally

```bash
npm install
npm run dev
```

Note: this sandbox has no network access to Google Fonts, so `app/layout.tsx`
uses a system font stack instead of `next/font/google`. If you deploy
somewhere with normal internet access, feel free to swap in `Inter` /
`JetBrains Mono` via `next/font/google` for pixel-perfect fonts — the CSS
variable names (`--font-sans`, `--font-mono`) already match what
`app/globals.css` expects.

## Suggested next increment

1. Wire `lib/mock-data.ts` reads to Supabase Postgres (keep the same shapes
   in `types/index.ts` — make your DB columns match, not the other way
   round).
2. Add a Supabase Realtime subscription inside `TimetableList` so task status
   updates push live instead of requiring a refresh.
3. Only after that: auth, then the weekly review screen, then the AI planner.
