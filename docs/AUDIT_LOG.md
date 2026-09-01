# GENEVIEVE — Budget Traveller — Chronological Build Audit

## Stage 0 — Separation baseline
- New standalone repository created. No Dog Park repository files imported or modified.
- Official supplied tree/infinity/roots logo retained in the traveller-facing brand header.
- Vercel/Next.js, GitHub and Neon-compatible structure established.

## Stage 1 — Brand shell and Home
- Deep navy/blue, gold-trimmed shell, official logo, slogan and navigation created.
- Home links to Plan, Around Me, Safety and My Trip.

## Stage 2 — Budget-safe journey engine
- Australian origin/destination planning baseline, manual route confirmation link, fuel estimate, protected emergency reserve, travel days and conservative fuel range implemented.
- Budget engine is deterministic and covered by Node tests.
- Estimated route distance is labelled as a planning estimate, not live routing.

## Stage 3 — Around Me and Safety
- Browser-only geolocation for nearby searches.
- Precise current location is not written to Neon by this build.
- Emergency 000 and map searches remain available even if Neon is down.
- Unconnected live feeds are visibly marked not connected rather than fabricated.

## Stage 4 — Neon persistence
- Trip table and indexed per-device retrieval designed for bounded reads (maximum 30 journeys).
- Budget-entry table includes idempotency support for later spend tracking.
- API body size guard and input length bounds added.
- Database errors return controlled 503 responses while the local plan remains intact.

## Stage 5 — Scale and CI gate
- Stateless Next.js application layer.
- Indexed device trip lookup with deterministic newest-first ordering and bounded result set.
- Prior Neon audit inserted 5,000 temporary journey rows, retrieved a bounded result and deleted every audit row.
- Prior pure budget-engine stress audit completed 100,000 calculations without an exception.
- GitHub CI requires tests, source audit and production build on `main`.

## Production-live exclusions
BOM/weather, fire/flood/road closures, tide/coastal feeds, live fuel prices, campground availability, council rules and real-time route-provider data are not marked live until verified provider integrations, freshness rules and failure-state audits are added.
