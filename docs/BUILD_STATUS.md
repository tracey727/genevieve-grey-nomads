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
- Real traveller-side journey save to My Trip confirmed.

## Subscription/legal candidate — NOT production charging yet
Branch: `agent/stripe-legal-subscriptions`

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

## Still required before live charging
- Select actual recurring price and billing cadence.
- Confirm GST registration/tax display requirements.
- Add account authentication/recovery for paid membership portability.
- Test and approve Neon V002 billing migration.
- Configure Stripe Product/Price, Customer Portal, public Terms/Privacy URLs and production webhook.
- Configure Stripe/Vercel production secrets.
- Complete test-mode subscription, cancellation, failed-payment and webhook replay tests.
- Obtain Australian legal review of the final commercial terms before broad paid launch.

## Not claimed live
BOM/weather, road closures, tides/coastal data, live fuel prices, campground availability, council rules and route-provider data are not labelled live until verified provider integrations and freshness/failure audits are added.
