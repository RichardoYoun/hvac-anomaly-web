# PowerSense

**HVAC & Electrical Anomaly Detection Dashboard**

PowerSense detects when building equipment starts consuming more electricity than it should — before it fails. The core output is simple: *this AC unit is drawing 34% more electricity than its baseline right now, and the trend is getting worse.*

---

## The Idea

Most energy monitoring tools show you history. PowerSense gives you the first warning — before failure, in plain numbers.

We pull real electricity consumption data from the [EIA Open Data API](https://www.eia.gov/opendata/), build a rolling 7-day baseline per unit, and score every new hourly reading against it. When something drifts, the operator sees it immediately — no configuration, no dashboards to set up.

---

## Features

- **Anomaly table** — 24 AC units across 12 suites, color-coded by severity (Normal / Warning / Critical)
- **Filters** — by suite, AC unit number, or status
- **Detail panel** — click any unit to see hourly energy draw vs baseline chart + deviation trend over 24h
- **Live scoring** — auto-refreshes every 60 seconds
- **Real data backbone** — CISO regional grid demand from EIA API, mapped to per-unit simulated readings via a load factor model

---

## Anomaly Thresholds

| Status | Condition |
|--------|-----------|
| Normal | Within 15% of rolling baseline |
| Warning | >15% above rolling baseline |
| Critical | >30% above rolling baseline |

---

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4** + **shadcn/ui**
- **Recharts** for time-series charts
- **EIA Open Data API** for real grid demand data

---

## Getting Started

### 1. Get a free EIA API key

Register at [eia.gov/opendata/register.php](https://www.eia.gov/opendata/register.php) — instant, no approval needed.

### 2. Add your key

```bash
# .env.local
EIA_API_KEY=your_key_here
```

> The app works without a key — it falls back to a synthetic diurnal load pattern.

### 3. Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll land on the dashboard.

---

## Project Structure

```
src/
├── app/
│   ├── dashboard/page.tsx          # Main dashboard page
│   └── api/
│       ├── eia/route.ts            # EIA API proxy
│       ├── units/route.ts          # Scored unit list (filterable)
│       └── units/[id]/route.ts     # Per-unit 24h detail
├── lib/
│   ├── types.ts                    # TypeScript interfaces
│   ├── constants.ts                # Thresholds & building config
│   ├── seed.ts                     # Unit definitions & reading simulation
│   ├── anomaly.ts                  # Scoring engine
│   └── eia-client.ts               # EIA fetch wrapper
└── components/
    ├── dashboard/                  # Table, filters, summary cards
    └── detail/                     # Slide-in panel with charts
```

---

## Demo Units (seeded anomalies)

Three units are seeded with anomalies so the dashboard shows something interesting immediately:

| Unit | Status |
|------|--------|
| Suite 3A — AC #1 | Critical (~+34%) |
| Suite 4B — AC #2 | Warning (~+18%) |
| Suite 6A — AC #1 | Warning (~+16%) |

The architecture is designed to scale: swap the simulated readings for real sensor data and the scoring engine stays the same.
