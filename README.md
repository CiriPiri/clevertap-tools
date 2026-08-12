# CleverTap Toolbox

A lightweight, **client-side-only** utility platform for parsing, formatting, and debugging CleverTap data payloads. Paste raw CleverTap JSON, preview it in a customizable UI, and copy a perfectly-formatted, inline-styled HTML table to your clipboard — ready to drop into Outlook or Gmail without breaking.

> Zero backend. Zero data leaves your browser.

## Tools

- **JSON Formatter** — Parse CleverTap campaign JSON into a clean table. Pick and reorder columns, preview the result, and copy it in the format that suits where you're pasting: rich HTML for email, monospace for Slack, markdown for docs, TSV for spreadsheets, or a CSV download.
- **SentLog Decoder** — Decode notification-sent log JSON into a structured, copy-ready plain-text summary. Handles multiple keys, multiple entries, and malformed input.
- **Epoch Converter** — Bidirectional epoch ↔ human date conversion with auto unit detection (s/ms/µs/ns), ISO/RFC/relative formats, multi-timezone display, and one-click copy.

## Tech Stack

- React 19 + Vite 7
- TypeScript
- Tailwind CSS v4 (Vite plugin)
- React Router v7 (`HashRouter`)
- Framer Motion · Lucide React

## Getting Started

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

## Scripts

| Command           | What it does                                      |
| ----------------- | ------------------------------------------------- |
| `npm run dev`     | Start the Vite dev server with HMR                |
| `npm run build`   | Type-check and build for production               |
| `npm run preview` | Preview the production build locally              |
| `npm run lint`    | Run ESLint                                        |
| `npm run deploy`  | Publish `dist/` to GitHub Pages via `gh-pages`    |

## Project Layout

```
src/
├── components/
│   ├── ui/       # Design system: Button, Panel, Label, Badge, PageHeader…
│   ├── features/ # Feature-specific components
│   └── layout/   # Header, Footer, ThemeToggle
├── config/       # tableColumns.ts — single source of truth for columns + email styles
├── hooks/        # useJsonParser.ts and friends
├── pages/        # Home, JsonFormatter, SentLogDecoder, EpochConverter
├── types/        # TypeScript interfaces
└── utils/        # clipboard.ts, tableSerializers.ts, epoch.ts, sentLogParser.ts
```

## Architectural Rules

1. **No hardcoded columns.** All headers, accessors, and inline email styles live in `src/config/tableColumns.ts`. Components map over the config.
2. **Separation of concerns.** Parsing in hooks, presentation in dumb components, email HTML generated headlessly via `ReactDOMServer.renderToStaticMarkup` in `src/utils/clipboard.ts`.
3. **Client-side only.** No outbound API calls with user data. Fonts are self-hosted via Fontsource so no request reaches a CDN at runtime.
4. **Compose from `src/components/ui`.** Buttons, panels, and labels come from the design system rather than per-page classes.
5. **Static content animates in CSS, not JS.** Entrance animations use the `.enter` classes in `index.css`, whose resting state is *visible*. Framer Motion is reserved for genuine mount/unmount (menus, results, errors) where `opacity: 0` is the correct resting state — a JS fade on static content fails toward a blank page.

See [CLAUDE.md](./CLAUDE.md) for the full AI-assistant contract.

## Assets

- `public/loading.lottie.json` — looping loader animation (Lottie / Bodymovin v5).

## Deployment

Pushing to `main` triggers an auto-deploy. Do **not** set a `base` path in `vite.config.ts` for Vercel.
