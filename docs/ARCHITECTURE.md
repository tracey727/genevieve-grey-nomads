# Architecture

Browser / PWA -> Next.js App Router on Cloudflare Workers (via OpenNext) -> bounded API routes -> Neon Postgres.

The budget engine is deterministic and client-safe. The home screen reads the latest local calculation first, which keeps the application useful during database outages. Persisted trip history is optional and isolated behind `/api/trips`.

Safety-critical UI is deliberately independent from persistence. Browser geolocation is used only to construct a nearby map search URL and is not sent to the trip API.

Accounts (`/api/auth/*`) are optional and additive on top of the existing anonymous device-ID flow. Sessions are signed, stateless bearer tokens verified with a single HMAC check (`lib/auth.js`) rather than server-side session storage, so authentication has no shared state to contend on and scales horizontally with Cloudflare Workers. A service worker (`public/sw.js`) precaches the core screens for offline/remote-area use and deliberately never caches `/api/*`, so live data always stays fail-closed.
