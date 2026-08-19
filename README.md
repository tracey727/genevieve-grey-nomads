# GENEVIEVE Grey Nomads

Standalone Australian journey, budget and safety application built for Vercel + GitHub + Neon Postgres.

## Principles

- Traveller-facing UI stays calm and simple.
- Emergency access is not blocked by database, budget or journey functions.
- Budget planning cannot claim a route, fuel price, weather, tide or road condition is live unless a verified provider is connected.
- Precise current location used by Around Me is kept in browser state and is not persisted by this build.
- Database failures degrade to local planning rather than crashing the home screen.

## Local setup

1. Copy `.env.example` to `.env.local` and set the Neon `DATABASE_URL`.
2. Run migration `migrations/V001_init.sql` against the new Neon project.
3. `npm install`
4. `npm test && npm run audit && npm run build`
5. `npm run dev`

## Deployment

Import the repository into Vercel, add `DATABASE_URL` as a server-only environment variable, and deploy the `main` branch.

## Current provider status

The app intentionally does not claim live BOM/weather, road closures, tides, fuel prices or campground availability until approved provider integrations are added and audited.
