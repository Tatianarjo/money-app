# Money HQ

Personal finance dashboard: income, bills, debt snowball, soft life spending, and monthly snapshots. Data stays in **localStorage** unless you export/import JSON.

## Scripts

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview  # serve production build locally
```

If `npm run build` fails while generating the service worker (Workbox / terser), run it again outside a restricted sandbox or on your machine directly — the PWA step needs to write `dist/sw.js`.

## PWA (install on iPhone)

1. Deploy the app over **HTTPS** (required for install + service worker).
2. Open the site in **Safari** on iPhone.
3. Tap **Share** → **Add to Home Screen**.

Use **Data → Export JSON** on one device and **Import JSON** on another to move your data until you add cloud sync.

## Deploy (Vercel)

```bash
npm i -g vercel
vercel
```

The repo includes [`vercel.json`](vercel.json) with SPA fallback so client-side routing keeps working.

Alternatively: connect the Git repo in the Vercel dashboard (framework: Vite, output: `dist`).

## Month model

- Use **◀ / ▶** in the header to change the month you’re viewing.
- **Income** and **Soft Life** tabs filter by entry dates in that month.
- **Bills**: use **Mark paid** so spending history includes that bill for the month.
- **Close month →** saves debt balances + savings into history for that month, then moves you to the next month.
