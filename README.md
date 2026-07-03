# Skill Tree

Skill Tree is a personal learning operating system for planning daily study sessions, tracking task execution, and visualizing skill progress over time.

The app is currently built as a local-first MVP using **Next.js App Router**, **TypeScript**, **Tailwind CSS**, and **localStorage**. It does not use Supabase, authentication, or the OpenAI API yet.
# Some future Increments/Features
12. Task Detail Modal
14. Export / Import Backup
13. Weekly Adjustment
15. Settings Page
16. Skill History Snapshot
17. Career Roadmap
18. Portfolio Evidence Dashboard
19. Supabase
20. AI Planner
21. AI KPI Checker

## Purpose

Skill Tree helps you answer three simple questions every day:

1. What should I study today?
2. Did I actually complete the tasks?
3. Which skills are improving over time?

The long-term vision is to turn Skill Tree into a personal learning and career tracking system with AI planning, KPI checking, cloud sync, and portfolio evidence tracking.

## Current Features

### Daily Timetable

- Create a timetable for each day.
- Add, edit, and delete tasks directly in the UI.
- Navigate between different days.
- Each day has its own saved timetable.
- Data is persisted with `localStorage`.

### Task Status Tracking

Each task can be marked as:

- `Đạt` — completed
- `Một phần` — partially completed
- `Không đạt` — not completed
- `Chưa làm` — not started

Task status updates immediately affect daily progress, 7-day progress, and skill mastery.

### KPI and Evidence Fields

Each task can include:

- KPI goal
- Required evidence
- Priority
- Category
- Skill

This allows tasks to be evaluated based on output, not just time spent.

### Daily Review

- Submit a daily review for the selected day.
- Track mood and daily reflection.
- Edit an existing review.
- Daily reviews are saved in `localStorage`.

### Streak Tracking

The app tracks real streaks based on completed Daily Reviews.

A streak means:

> The number of consecutive days where a Daily Review was completed.

This is used to measure consistency rather than perfect task completion.

### 7-Day Progress

The 7-Day Progress card summarizes the selected day plus the previous six days.

It includes:

- Total tasks
- Completed tasks
- Partially completed tasks
- Failed tasks
- Completion rate
- Active days
- Review days
- Top improved skill
- Focus skill for improvement

The completion rate is calculated as:

```txt
(doneTasks + partialTasks * 0.5) / totalTasks * 100
```

### Skill Tree Mastery

Skill Tree includes a skill tree system where task completion contributes to skill mastery.

Features:

- Skill mastery from 0–100%
- Progress bars for each skill
- Category-level average mastery
- Automatic recalculation from saved task data
- No manual point mutation
- Status-based scoring:
  - `Đạt` = full points
  - `Một phần` = half points
  - `Không đạt` = zero points

Skill mastery updates when:

- Task status changes
- A task is added
- A task is edited
- A task is deleted
- A different day is selected
- Daily review data changes

### Custom Skill Tree Builder

Users can customize the skill tree directly in the app.

Current supported actions:

- Add custom skill categories
- Add custom skills inside categories
- Select custom skills when creating or editing tasks
- Random color assignment for new custom categories
- Delete custom skills
- Delete custom categories safely

Default categories and skills are protected from deletion to avoid breaking the base learning structure.

### UI Preferences

- Hide or show progress panels such as Daily Review and 7-Day Progress.
- Preference is saved in `localStorage`.

### Local-First Data Storage

The app currently stores data in the browser using `localStorage`.

This includes:

- Timetables
- Daily reviews
- Skill categories
- Skill nodes
- UI preferences

Important note:

> Data saved on `localhost` is separate from data saved on a deployed Vercel domain because each domain has its own `localStorage`.

## Tech Stack

- **Framework:** Next.js App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Storage:** localStorage
- **Deployment target:** Vercel

## Getting Started

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

### Run lint

```bash
npm run lint
```

### Build for production

```bash
npm run build
```

## Recommended Development Workflow

Before committing changes, run:

```bash
npm run lint
npm run build
git status
git add .
git commit -m "your commit message"
git push
```

If connected to Vercel, pushing to GitHub can automatically trigger a new deployment.

## Project Status

Skill Tree is currently a local-first MVP.

Completed increments:

1. Static dashboard and live clock
2. Task status: `Đạt`, `Một phần`, `Không đạt`
3. localStorage persistence
4. Add / Edit / Delete task
5. Multi-day timetable
6. Daily Review and real streak
7. Skill Mastery auto update
8. 7-Day Progress summary
9. Custom Skill Tree Builder
10. Random category colors, custom delete actions, and UI preferences

## Roadmap

Planned next features:

- Task evidence notes
- Task detail modal
- Skill history snapshots
- Simple skill history view
- Weekly adjustment system
- Export / import backup
- App settings page
- Vercel deployment
- Supabase migration
- Authentication
- AI Planner
- AI KPI Checker
- Career roadmap mode
- Portfolio evidence dashboard

## Long-Term Vision

Skill Tree is designed to support a long-term career path:

```txt
Study in Finland / Aalto Digital Systems and Design
→ Work in Finland for 4–6 years
→ Become a senior engineer
→ Move to a remote-first international company
→ Live in Vietnam while working remotely
```

The app is intended to track the skills, discipline, evidence, and portfolio progress needed for that path.

## License

This project is currently a personal learning project and doesn't have a license.
\o/
