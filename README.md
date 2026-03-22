# Where to Eat in OB 🌊

Happy hours, daily deals, and good vibes in Ocean Beach, San Diego.

## What It Is

A mobile-friendly website that tracks happy hour times and daily specials for bars and restaurants in Ocean Beach, CA. Features a live "Happening Now" filter that shows what's active at the current moment, plus a map view.

## Data

All restaurant data lives in [`data/restaurants.json`](data/restaurants.json). Each entry has:

```json
{
  "id": "unique-slug",
  "name": "Restaurant Name",
  "address": "Street address",
  "coords": [latitude, longitude],
  "phone": "(619) 555-1234",
  "website": "https://...",
  "twitter": "twitterhandle",
  "hours": {
    "mon": { "open": "11:00", "close": "22:00" },
    "tue": null
  },
  "happyHour": {
    "days": ["mon", "tue", "wed", "thu", "fri"],
    "start": "15:00",
    "end": "18:00",
    "deals": ["$5 drafts", "$8 wine"]
  },
  "dailySpecials": [
    { "day": "wed", "deals": ["$3.50 Sapporo all day"] },
    { "day": "all", "deals": ["$5 tacos"] }
  ],
  "notes": "Optional notes"
}
```

Times use 24-hour format. Days use: `sun mon tue wed thu fri sat`. A `null` hours entry means closed that day or hours unknown.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Leaflet + OpenStreetMap (no API key needed)

## Dev

```bash
npm install
npm run dev
```

## Deploy

Auto-deploys to Vercel on push to `main`.

---

*Updated weekly by a local 🤙*
