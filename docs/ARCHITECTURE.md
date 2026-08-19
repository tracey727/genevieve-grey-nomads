# Architecture

Browser / PWA -> Next.js App Router on Vercel -> bounded API routes -> Neon Postgres.

The budget engine is deterministic and client-safe. The home screen reads the latest local calculation first, which keeps the application useful during database outages. Persisted trip history is optional and isolated behind `/api/trips`.

Safety-critical UI is deliberately independent from persistence. Browser geolocation is used only to construct a nearby map search URL and is not sent to the trip API.
