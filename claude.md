A CLAUDE.md file is an excellent addition. It acts as an instruction manual for any AI (Claude, GitHub Copilot, Cursor, or myself) that reads your repository, ensuring that future code generated aligns perfectly with your established Staff-level architecture and tech stack.

Save the following content directly into a file named CLAUDE.md in the root of your repository.

---

````markdown
# 🤖 AI Assistant Guide (`CLAUDE.md`)

## 📌 Project Overview

**CleverTap DevSuite** is a lightweight, client-side-only utility platform designed to parse, format, and debug complex CleverTap data payloads.

The primary tool (JSON Formatter) takes raw CleverTap JSON, provides a highly customizable UI preview, and generates a specifically formatted HTML table using inline CSS that can be copied directly to the clipboard for use in email clients (Outlook/Gmail) without breaking layout.

## 🛠️ Tech Stack

- **Framework:** React 19 + Vite
- **Routing:** React Router v7 (`<HashRouter>` for static hosting compatibility)
- **Styling:** Tailwind CSS **v4** (Vite plugin, no `tailwind.config.js` required)
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Deployment:** Vercel (Edge CDN, auto-deploy from `main`)

## 📂 Project Structure

```text
src/
├── components/          # Reusable UI pieces
│   ├── features/        # Feature-specific components (JsonEditor, ColumnSelector)
│   └── layout/          # Global layouts (Header/Navbar)
├── config/              # Centralized configuration files
│   └── tableColumns.ts  # Single Source of Truth for table columns & email styling
├── hooks/               # Custom React hooks (Data layer / Business logic)
│   └── useJsonParser.ts # Parses and sorts raw CleverTap JSON
├── pages/               # Top-level route components
│   ├── JsonFormatter.tsx
│   └── SentfileDebugger.tsx
├── types/               # TypeScript interfaces
│   └── clevertap.ts
├── utils/               # Pure functions and headless UI logic
│   ├── clipboard.ts     # Uses renderToStaticMarkup for email HTML generation
│   └── formatters.ts    # Date/Status parsers
├── App.tsx              # Master Router wrapper
└── main.tsx             # React entry point
```
````

## 🏗️ Commands

- **Install:** `npm install`
- **Run Local Dev:** `npm run dev`
- **Build:** `npm run build`
- **Deploy:** Merging/pushing to the `main` branch automatically triggers Vercel deployments. _(Note: Do not use `base` path in `vite.config.ts` for Vercel)._

## 🧠 Architectural Rules & Guidelines

When writing or modifying code for this repository, strictly adhere to the following principles:

### 1. The "Anti-Hardcoding" Rule (Configuration-Driven UI)

Do not hardcode new columns or data mappings into the React UI components. All column headers, data accessors, and inline email styles **must** be defined in `src/config/tableColumns.ts`. The UI components map over this configuration dynamically.

### 2. Separation of Concerns

- **Data Layer:** Parsing, sorting, and state management should live in custom hooks (e.g., `src/hooks/`).
- **Presentation Layer:** UI components should be "dumb" and accept data via props.
- **Email Generation Layer:** The UI Preview and the copied Email HTML are completely decoupled. Email HTML is generated headlessly using `ReactDOMServer.renderToStaticMarkup` inside `src/utils/clipboard.ts` to ensure strict inline styling rules are followed for email clients.

### 3. Styling & Animations

- Use Tailwind CSS v4 utility classes. Remember that v4 uses `@import "tailwindcss";` in the root CSS and does not rely on PostCSS config files.
- Maintain the glassmorphic dark theme (`zinc` base, `emerald` accents, `backdrop-blur`).
- All state transitions (mounting, unmounting, list reordering) should be wrapped in Framer Motion (`<motion.div>`, `<AnimatePresence>`) for fluidity.

### 4. Client-Side Only

This tool processes sensitive data. Ensure zero backend dependencies. All data parsing, transforming, and formatting must occur locally within the user's browser. Do not introduce API calls that send user-pasted data outward.

```

***

Once you commit this file, any AI tool you use with this repo will automatically understand the Tailwind v4 setup, know where to look to add columns, and understand *why* we use renderToStaticMarkup for the clipboard.

```
