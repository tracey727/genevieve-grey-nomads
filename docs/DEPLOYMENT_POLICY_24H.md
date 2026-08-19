# Temporary deployment policy — 19–20 August 2026

Effective from approximately 9:02 PM AEST on 19 August 2026 until approximately 9:02 PM AEST on 20 August 2026:

- Do not use Vercel for Grey Nomads deployments, previews, smoke tests or deployment watches.
- Use Cloudflare Workers/OpenNext as the only deployment path during this period.
- Do not move production away from the currently working Cloudflare Worker unless the replacement commit passes CI, repository audit, production build and Cloudflare deployment checks.
- Preserve the guarded emergency flow, local-first trip planning and provider fail-closed behavior during every deployment.

This temporary hold exists because the Vercel project hit its build/deployment limit. It does not change the application architecture or future hosting options after the hold expires.
