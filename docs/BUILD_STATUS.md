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

### Stage 12 — Budget Traveller phone home-screen identity
- A dedicated GENEVIEVE — Budget Traveller home-screen icon was created from the supplied tree/infinity/roots brand artwork without redrawing the mark.
- The icon uses the app's deep navy and restrained gold-trimmed visual system.
- The PWA manifest now includes Budget Traveller app identity and standalone launch mode.
- Apple web-app metadata points to the same branded icon and labels the installed app `Budget Traveller`.
- CI requires the icon endpoint, manifest wiring and Apple install metadata to remain present.
- GitHub install, tests, source audit and full production build passed before merge.

### Stage 13 — Product rename and Cloudflare hosting alignment
- The traveller-facing product is now presented as Budget Traveller (manifest, iOS install metadata, brand header, legal pages); GENEVIEVE remains the parent/trading brand on the logo.
- Terms of Use and Privacy Policy processor disclosures corrected from Vercel to Cloudflare; setup docs updated to reference Cloudflare Worker secrets instead of Vercel environment variables.
- README deployment instructions now describe Cloudflare Workers Builds' native GitHub Git integration as the single deployment path, with GitHub Actions CI as the pre-deploy gate.
- Tests, source/legal audit and production build passed after the rename.

### Stage 14 — Offline/remote-area resilience
- A service worker (`public/sw.js`) now precaches the core screens (Home, Plan, Around Me, Safety, My Trip, Billing) so they keep working with no signal, which matters on remote outback routes.
- API routes are explicitly excluded from service-worker caching so fuel/weather/route data can never be served stale while still claiming to be current; the fail-closed `live` contract is unchanged.
- A branded `public/offline.html` fallback is served for any screen that has not been cached yet, with a plain (non-JS-gated) `tel:000` link as a last resort when the app itself cannot load at all.
- CI now fails if the service worker is not registered from the root layout, if it starts intercepting `/api/` routes, or if the offline fallback is removed.

### Stage 15 — Account authentication
- Real email/password accounts (`migrations/V003_accounts.sql`) with salted PBKDF2 password hashing and signed, stateless bearer session tokens (`lib/auth.js`, `app/api/auth/*`).
- Sessions are stateless (no server-side session store), so verifying a signed-in request is a single HMAC check with no shared state to contend — this is what lets sign-in/sign-out scale to many thousands of concurrent users across Cloudflare's distributed edge without a session-store bottleneck.
- Sign-up/sign-in is additive: Safety, Plan Trip and Around Me remain fully usable without an account, and the existing anonymous device-ID trip/billing flow is unchanged. `billing_accounts` and `trips` gained a nullable `user_id` column for future cross-device portability.
- A minimal Account panel was added to Membership only (not the protected Home screen) for sign-up, sign-in and sign-out.
- Login always returns the same "Incorrect email or password" message for a missing account or a wrong password, so it cannot be used to enumerate registered emails.
- CI requires salted password hashing, signed/verified session tokens and a server-only session secret to remain present.

### Stage 16 — Cross-device membership portability
- Checkout, Billing status and Manage/cancel (`app/api/billing/checkout`, `/status`, `/portal`) now recognise an optional signed-in session and additionally match `billing_accounts` on `user_id`, not just `device_id` — so a traveller's membership shows up on a fresh device once they sign back in, without changing the existing anonymous device-only flow when no session is presented.
- The Stripe webhook resolves a `metadata.user_id` (a signed, server-verified account ID, not a raw client value) to the internal `users.id` and attaches it with `COALESCE`, so an existing device-only link is never overwritten or discarded — this is the most audited/fragile part of the codebase, so the change was scoped narrowly and re-verified against the full test/audit/build suite rather than combined with Stage 15.
- CI now requires the session check and the non-destructive `COALESCE` update to remain present in checkout, status, portal and the webhook.

## Still open from Stage 15 / 16
- `SESSION_SECRET` must be generated and set as a Cloudflare Worker secret before account sign-up/sign-in (and therefore membership portability) activates in production (accounts stay disabled, matching the fail-closed pattern used for billing/live-data, until it is set).
- No password-reset flow yet.

## Pricing recommendation — not activated
- Keep Emergency/core Safety free for everyone.
- Recommended concession/pensioner launch price: $3.99 AUD per month or $39.99 AUD per year.
- Recommended standard launch price: $6.99 AUD per month or $59.99 AUD per year.
- Pricing is a recommendation only; Stripe remains disabled until the owner approves final price/cadence and the remaining paid-launch gates are complete.

## Still required before live charging
- Owner approval of actual recurring price and billing cadence.
- Confirm GST registration/tax display requirements.
- Account authentication and cross-device membership portability now exist (Stages 15–16); still need password reset/recovery before broad paid launch.
- Configure Stripe Product/Price, Customer Portal, public Terms/Privacy URLs and production webhook.
- Configure Stripe/Cloudflare production secrets.
- Complete test-mode subscription, cancellation, failed-payment and webhook replay tests.
- Obtain Australian legal review of the final commercial terms before broad paid launch.

## Not claimed live
BOM/weather, road closures, tides/coastal data, live fuel prices, campground availability, council rules and route-provider data are not labelled live until verified provider integrations and freshness/failure audits are added.
