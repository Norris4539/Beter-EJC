# JobFlow — Jobcard Management System

## What It Is

A single-file PWA for tracking work orders (jobcards) with a Japanese Wabi-Sabi aesthetic. No backend — fully offline-capable via localStorage and a service worker.

## Tech Stack

| Layer | Technology |
|---|---|
| UI | React 18.2.0 (CDN UMD build) |
| JSX | Babel Standalone 7.23.2 (in-browser compile) |
| Persistence | `localStorage` (keys: `jc-jobs`, `jc-dark`, `jc-uid`) |
| Offline | Service Worker (registered via blob URL) |
| Fonts | Noto Serif JP / Noto Sans JP (Google Fonts CDN) |
| Build | None — open `Index.html` directly in a browser |

## Project Structure

```
JobFlow/
├── Index.html          # Entire application (HTML + CSS + JSX, ~614 lines)
├── Project Notes.txt   # Scratch notes
└── .claude/
    ├── settings.local.json
    └── docs/
        └── architectural_patterns.md
```

Everything lives in `Index.html`. There are no separate JS modules, CSS files, or assets.

## Key Sections of Index.html

| Lines | Content |
|---|---|
| 1–60 | HTML head: CDN scripts, PWA manifest (inline data URI), Apple meta tags |
| 34–59 | Service Worker (registered as a blob URL) |
| 61–134 | `WS()` — CSS-in-JS function that injects all styles as a `<style>` tag |
| 135–185 | Design tokens: color palette, typography scale, component classes |
| 172–177 | `SEED` — sample jobcard data (default state on first load) |
| 186–235 | Shared UI helpers: `FL`, `SL`, `StatTile`, `JobRow`, `FG`, `Mon` |
| 237–609 | `App` component — all state, views, and event handlers |
| 452–606 | View rendering: HOME / DETAIL / FORM + modals |

## Data Model

```
Jobcard: { id, title, category, priority, status, assignee,
           location, created, due, description, completionReport? }

completionReport: { templateType, arrivedAt, metWith,
                    workCompleted: string[], workRemaining: string[] }
```

Status values: `Outstanding` | `In Progress` | `On Hold` | `Completed`  
Priority values: `Low` | `Medium` | `High` | `Critical`

## Running the App

```
# Open directly — no install or build needed
start Index.html

# Or serve locally (avoids some PWA limitations)
npx serve .
python -m http.server 8080
```

PWA install prompt appears automatically in supported browsers.

## Modifying the App

1. Edit the `<script type="text/babel">` block in `Index.html`
2. Babel recompiles JSX on page reload — no build step
3. CSS changes go inside the `WS()` function (Index.html:61–134)

## Adding New Features or Fixing Bugs

**IMPORTANT**: When you work on new features or bugs, create a git branch first. Then work on changes in that branch for the remainder of the session.

## Additional Documentation

- [Architectural Patterns](.claude/docs/architectural_patterns.md) — state management, view routing, persistence, component composition, PWA setup
