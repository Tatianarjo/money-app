# Money HQ 🎚️

A personal finance dashboard with vinyl record gamification. Built with React, TypeScript, Vite, and Tailwind CSS.

## Quick Start

```bash
npm install
npm run dev
```

Then open **http://localhost:5173**

## Scripts

| Command            | Description                        |
| ------------------ | ---------------------------------- |
| `npm run dev`      | Start dev server with hot reload   |
| `npm run build`    | Type-check + production build      |
| `npm run preview`  | Preview the production build       |
| `npm run typecheck`| Run tsc without emitting files     |

## Project Structure

```
src/
├── main.tsx                  # Entry point
├── App.tsx                   # Root: theme, layout, navigation, derived calcs
├── index.css                 # Global styles + Tailwind directives
│
├── types/
│   └── index.ts              # All shared TypeScript types & interfaces
│
├── constants/
│   └── index.ts              # Seed data, option arrays, uid()
│
├── utils/
│   ├── format.ts             # fmt() currency formatter
│   ├── store.ts              # localStorage wrapper with try/catch fallback
│   └── gamification.ts      # LEVELS, calcScore, getLevel, getNextLevel
│
├── hooks/
│   └── usePersistedState.ts  # Generic localStorage-backed useState
│
└── components/
    ├── ui/                   # Shared, reusable UI atoms
    │   ├── VinylRecord.tsx   # Animated SVG vinyl with progress ring
    │   ├── Modal.tsx
    │   ├── Field.tsx         # Input / select with label
    │   ├── Card.tsx
    │   ├── Bar.tsx           # Progress bar
    │   ├── Pill.tsx          # Badge chip
    │   ├── Buttons.tsx       # EditBtn, DelBtn, AddBtn, SaveCancel
    │   ├── SectionHead.tsx
    │   └── index.ts          # Barrel export
    │
    └── tabs/                 # One file per tab
        ├── DashboardTab.tsx
        ├── IncomeTab.tsx
        ├── BillsTab.tsx
        ├── DebtTab.tsx
        ├── SoftLifeTab.tsx
        └── index.ts
```

## Features

- **Dashboard** — Monthly snapshot, spinning vinyl savings record, DJ career path levels
- **Income Drops** — Add/edit/delete income with type tagging
- **The Bills Set** — Full CRUD + filter by Fixed / Subscriptions / Debt / Leisure + Cancel or Keep toggle
- **Debt Kill List** — Snowball method auto-sort, credit utilization, Paid Off tracking
- **Soft Life Fund** — Leisure spending by category with breakdown bars
- **Dark / Light mode** — Persisted toggle
- **localStorage persistence** — All data survives page refresh
- **Monthly Reset** — Confirmation modal wipes back to defaults
