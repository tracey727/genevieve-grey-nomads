# GENEVIEVE Grey Nomads

Standalone Australian journey, budget and safety application built for Cloudflare Workers/OpenNext + GitHub + Neon Postgres.

## Principles
- Traveller-facing UI stays calm and simple.
- Emergency access is not blocked by database, budget or journey functions.
- Budget planning cannot claim a route, fuel price, weather, tide or road condition is live unless a verified provider is connected.
- Precise current location used by Around Me is kept in browser state and is not persisted by this build.
- Database failures degrade to local planning rather than crashing the Home screen.

## Local setup
1. Copy `.env.example` to `.env.local` and set the Neon `DATABASE_URL`.
2. The standalone Neon project already has the V001/V002 schema; migrations are retained for rebuild/audit.
3. `npm install`
4. `npm test && npm run audit && npm run build`
5. `npx opennextjs-cloudflare build` for Cloudflare deployment verification.
6. `npm run dev` for local development.

## Deployment
The active production path is Cloudflare Workers using OpenNext/Wrangler. `wrangler.jsonc` and `open-next.config.ts` are part of the audited source tree. Add required server-only secrets to Cloudflare, especially `DATABASE_URL`, before expecting cloud trip storage to operate.

## Current provider status
The app intentionally does not claim live BOM/weather, road closures, tides, fuel prices, campground availability or council rules until approved provider integrations are added and audited.
