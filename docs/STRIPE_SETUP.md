# Stripe Subscription Setup — GENEVIEVE Grey Nomads

Architecture: Stripe-hosted Checkout -> signed webhook -> Neon entitlement record -> Stripe Customer Portal.

## Safety rule
No billing state may block `/safety` or the emergency entry point.

## Required Vercel variables
- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_ID`
- `STRIPE_WEBHOOK_SECRET`
- `SUBSCRIPTION_DISPLAY_PRICE`
- `SUBSCRIPTION_BILLING_PERIOD`
- `APP_BASE_URL`

`DATABASE_URL` remains server-only. Never expose Stripe secret keys or webhook secrets through a `NEXT_PUBLIC_` variable.

## Stripe Dashboard public details
Before Checkout is enabled, configure:
- Terms URL: `https://genevieve-grey-nomads.vercel.app/terms`
- Privacy URL: `https://genevieve-grey-nomads.vercel.app/privacy`

Checkout requires terms acceptance. If these public URLs are not configured, billing must remain disabled.

## Webhook endpoint
Production endpoint: `https://genevieve-grey-nomads.vercel.app/api/stripe/webhook`

Events:
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`

Webhook processing is idempotent by Stripe event ID and verifies Stripe signatures against the raw request body.
