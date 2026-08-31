# Stripe Subscription Setup — GENEVIEVE — The Budget Travels

Architecture: Stripe-hosted Checkout -> signed webhook -> Neon entitlement record -> Stripe Customer Portal.

## Safety rule
No billing state may block `/safety` or the emergency entry point.

## Required Cloudflare variables
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `APP_BASE_URL`
- At least one of the plan Price IDs below (billing stays disabled until every core variable above and at least one plan Price ID are set)

## Launch plan catalog (`lib/billing.mjs` `PLANS`)
| Plan | Price ID variable | Price | Billing period |
|---|---|---|---|
| Premium Monthly | `STRIPE_PRICE_PREMIUM_MONTHLY` | $12.99 AUD | month |
| Premium Annual | `STRIPE_PRICE_PREMIUM_ANNUAL` | $119.00 AUD | year |
| Pensioner Annual | `STRIPE_PRICE_PENSIONER_ANNUAL` | $83.00 AUD | year |
| Founding Member Annual | `STRIPE_PRICE_FOUNDING_ANNUAL` | $79.00 AUD | year |

Free/Safety access is not a Stripe plan — it requires no configuration and works even when billing is entirely disabled.

Each row above must be created as its own recurring **Price** in the Stripe Dashboard (Product catalog → Add product, or one Product with multiple Prices), in AUD, matching the amount and interval in this table exactly — the displayed price in the app is text maintained by hand in `lib/billing.mjs` and must always match the real Stripe Price. Paste each Price's ID (`price_...`) into the matching Cloudflare variable above. A plan with no Price ID configured simply does not appear at checkout.

To retire the Founding Member offer after launch, archive its Stripe Price and remove `STRIPE_PRICE_FOUNDING_ANNUAL` — existing subscribers on it are unaffected, it just stops being offered to new members.

`DATABASE_URL` remains server-only. Never expose Stripe secret keys or webhook secrets through a `NEXT_PUBLIC_` variable.

## Stripe Dashboard public details
Before Checkout is enabled, configure, using the live Cloudflare Workers URL set as `APP_BASE_URL`:
- Terms URL: `<APP_BASE_URL>/terms`
- Privacy URL: `<APP_BASE_URL>/privacy`

Checkout requires terms acceptance. If these public URLs are not configured, billing must remain disabled.

## Webhook endpoint
Production endpoint: `<APP_BASE_URL>/api/stripe/webhook`

Events:
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`

Webhook processing is idempotent by Stripe event ID and verifies Stripe signatures against the raw request body.
