# Build status — 19 August 2026

## Live V1 already verified
- Standalone repository: `tracey727/genevieve-grey-nomads`.
- Official GENEVIEVE tree/infinity/roots logo and blue/gold traveller UI.
- Home, Plan Trip, Around Me, Safety and My Trip linked.
- Budget-safe journey engine with protected emergency reserve.
- Browser-only current-location search behaviour.
- Neon V001 trip schema applied and audited.
- 5,000-row database scale audit completed and cleaned up.
- 100,000 budget calculations completed without an exception in the engine stress audit.
- Vercel project `genevieve-grey-nomads` connected to Neon and live health endpoint verified.
- Real traveller-side journey save to My Trip previously confirmed during V1 verification.

## Subscription/legal foundation — deployed, charging still disabled

### Stage 7 — Stripe foundation
- Stripe-hosted subscription Checkout architecture.
- Server-controlled recurring Price ID; client cannot submit an amount.
- Required Terms acceptance in Checkout.
- Signed raw-body webhook verification and event idempotency ledger.
- Customer Portal management/cancellation path.
- Payment failure recovery state does not block Emergency/core Safety.
- Billing remains disabled until every required release variable is present.

### Stage 8 — Australian legal/customer disclosure layer
- Terms of Use.
- Subscription & Refund Policy.
- Privacy Policy.
- Legal/Membership footer links.
- Data Breach Response Plan.
- Legal and Billing Release Gate.

### Stage 9 — Audit gate
- CI source audit expanded to require Stripe signature verification, server-only price control, legal pages, ACL preservation, privacy disclosures, secret scanning and Safety independence.
- Paid-launch gate explicitly requires account authentication/recovery before broad public paid launch.
- GitHub install, tests, source/legal audit and Next.js production build all passed before merge.

### Stage 10 — Neon V002 production migration
- V002 billing migration was first applied and verified on temporary Neon branch `br-curly-resonance-aud2v2w5`.
- Migration approval was obtained before applying to the live parent branch `br-flat-mouse-auo0cs78`.
- V002 was applied successfully to production and the temporary branch was deleted by Neon.
- Production verification confirmed existing `trips` and `budget_entries` tables remain present.
- Production verification confirmed `billing_accounts` and `stripe_webhook_events` are present with their required release indexes.
- Post-migration audit found no test billing accounts or webhook events left in production.
- Live `/api/health` returned database `connected` after migration.
- Live `/api/billing/config` remains `enabled: false`, so the database migration did not activate charging.

### Stage 11 — Guarded emergency calling
- Direct one-tap `000` calling was removed from the Safety screen.
- Calling 000 now requires a continuous 3-second hold followed by a deliberate full slide.
- Releasing, cancelling or leaving the hold control before 3 seconds resets it.
- Safety remains available without subscription or billing state.
- CI now fails if an unguarded direct 000 link is reintroduced, if the hold period changes, or if the full-slide gate is removed.

### Stage 12 — The Budget Travels phone home-screen identity
- A dedicated GENEVIEVE — The Budget Travels home-screen icon was created from the supplied tree/infinity/roots brand artwork without redrawing the mark.
- The icon uses the app's deep navy and restrained gold-trimmed visual system.
- The PWA manifest now includes The Budget Travels app identity and standalone launch mode.
- Apple web-app metadata points to the same branded icon and labels the installed app `The Budget Travels`.
- CI requires the icon endpoint, manifest wiring and Apple install metadata to remain present.
- GitHub install, tests, source audit and full production build passed before merge.

### Stage 13 — Product rename and Cloudflare hosting alignment
- The traveller-facing product is now presented as The Budget Travels (manifest, iOS install metadata, brand header, legal pages); GENEVIEVE remains the parent/trading brand on the logo.
- Terms of Use and Privacy Policy processor disclosures corrected from Vercel to Cloudflare; setup docs updated to reference Cloudflare Worker secrets instead of Vercel environment variables.
- README deployment instructions now describe Cloudflare Workers Builds' native GitHub Git integration as the single deployment path, with GitHub Actions CI as the pre-deploy gate.
- Tests, source/legal audit and production build passed after the rename.

### Stage 14 — Offline/remote-area resilience
- A service worker (`public/sw.js`) now precaches the core screens (Home, Plan, Around Me, Safety, My Trip, Billing) so they keep working with no signal, which matters on remote outback routes.
- API routes are explicitly excluded from service-worker caching so fuel/weather/route data can never be served stale while still claiming to be current; the fail-closed `live` contract is unchanged.
- A branded `public/offline.html` fallback is served for any screen that has not been cached yet, with a plain (non-JS-gated) `tel:000` link as a last resort when the app itself cannot load at all.
- CI now fails if the service worker is not registered from the root layout, if it starts intercepting `/api/` routes, or if the offline fallback is removed.

## Pricing recommendation — not activated
- Keep Emergency/core Safety free for everyone.
- Recommended concession/pensioner launch price: $3.99 AUD per month or $39.99 AUD per year.
- Recommended standard launch price: $6.99 AUD per month or $59.99 AUD per year.
- Pricing is a recommendation only; Stripe remains disabled until the owner approves final price/cadence and the remaining paid-launch gates are complete.

## Still required before live charging
- Owner approval of actual recurring price and billing cadence.
- Confirm GST registration/tax display requirements.
- Add account authentication/recovery for paid membership portability.
- Configure Stripe Product/Price, Customer Portal, public Terms/Privacy URLs and production webhook.
- Configure Stripe/Cloudflare production secrets.
- Complete test-mode subscription, cancellation, failed-payment and webhook replay tests.
- Obtain Australian legal review of the final commercial terms before broad paid launch.

## Not claimed live
BOM/weather, road closures, tides/coastal data, live fuel prices, campground availability, council rules and route-provider data are not labelled live until verified provider integrations and freshness/failure audits are added.
