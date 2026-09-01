# GENEVIEVE — Budget Traveller

Standalone Australia-wide journey, budget and safety application built for GitHub + Neon Postgres + Cloudflare Workers.

## Principles
- Traveller-facing UI stays calm and simple.
- Emergency access is not blocked by database, budget or journey functions.
- Budget planning cannot claim a route, fuel price, weather, tide or road condition is live unless a verified provider is connected.
- Precise current location used by Around Me is kept in browser state and is not persisted by this build.
- Database failures degrade to local planning rather than crashing the Home screen.
- The approved Home screen and its styling are treated as a protected presentation layer; national coverage work belongs in travel/data functions rather than redesigning Home.

## Australia-wide coverage
- Trip planning accepts any Australian town, suburb or address when the configured road-routing provider is available.
- Local fallback planning anchors cover Queensland, New South Wales, the ACT, Victoria, Tasmania, South Australia, Western Australia and the Northern Territory.
- Around Me uses browser geolocation for Australia-wide map searches and can route fuel checks by state/territory, with a manual jurisdiction override for border areas.
- State fuel integrations remain fail-closed: data is only presented as live/current when the relevant approved provider is configured and the returned data passes validation.
- WA FuelWatch requires a town/suburb for its official feed; the Around Me screen provides that input.
- ACT and Northern Territory fuel checks keep safe official-service fallbacks until an approved third-party/developer API path is verified for automated commercial use.
- BOM/weather remains disabled as live data unless a registered/licensed commercial BOM service is configured.

## Local setup
1. Copy `.env.example` to `.env.local` and set the Neon `DATABASE_URL`.
2. The standalone Neon project already has the V001 schema; `migrations/V001_init.sql` is retained for rebuild/audit.
3. `npm install`
4. `npm test && npm run audit && npm run build`
5. `npm run dev`

## Deployment
`main` is the single deployable source of truth. GitHub Actions (`.github/workflows/ci.yml`) runs tests, the source/legal audit and a production build on every push and pull request. Cloudflare Workers Builds is connected directly to this GitHub repository and builds/deploys `main` with the repo's own `open-next.config.ts` + `wrangler.jsonc` (OpenNext for Cloudflare) whenever CI's checks are green — no separate deploy step lives in this repo.

Every server-only variable in `.env.example` (`DATABASE_URL`, Stripe keys, provider keys) must be set as a Cloudflare Worker secret/variable in the Cloudflare dashboard (or via `wrangler secret put <NAME>`) — they are never read from `.env.local` in production and must never be prefixed `NEXT_PUBLIC_`.

A manual deploy from a workstation with Cloudflare credentials configured: `npm run deploy` (runs `opennextjs-cloudflare build && opennextjs-cloudflare deploy`).

## Current provider status
The app does not invent or scrape live safety/travel data. Routing, fuel and weather features degrade safely when approved provider access is missing. Road closures, tides, campground availability and council rules remain unlabelled as live until approved integrations are added and audited.
