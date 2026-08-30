# Legal and Billing Release Gate — GENEVIEVE — The Budget Travels

Do not enable paid Checkout until every required item below is complete and evidenced.

## Business identity
- [x] Operator: Tracey Ann Kennedy trading as GENEVIEVE App™
- [x] ABN: 36 530 564 761
- [x] Postal address: PO Box 475, Labrador QLD 4215
- [x] Support email: tracey@genevieveapp.com.au
- [ ] Confirm whether the business is GST-registered at launch and ensure the displayed consumer price includes all mandatory taxes/charges.

## Account and entitlement integrity
- [x] Billing APIs validate unguessable UUID-style device identifiers.
- [x] Stripe identifiers and billing email are not returned through the public billing-status API.
- [x] Emergency and core Safety access are independent of entitlement state.
- [ ] Add a user authentication/account recovery path before broad public paid launch so a subscriber can securely recover membership after a lost, replaced or reset device.
- [ ] Test entitlement recovery on a second/new device before enabling broad public charging.

## Subscription disclosure
- [ ] Choose the actual recurring price.
- [ ] Choose the billing period (for example monthly or annual).
- [ ] If any minimum commitment is introduced, display the total minimum cost prominently as well as any periodic amount.
- [ ] Confirm there are no unavoidable fees missing from the displayed total price.
- [ ] Confirm checkout states that the subscription automatically renews until cancelled.
- [ ] Confirm cancellation is available through the Customer Portal without requiring a phone call.

## Stripe
- [ ] Create the production Stripe Product and recurring Price after pricing is approved.
- [ ] Set STRIPE_SECRET_KEY in Cloudflare as a sensitive server-only variable.
- [ ] Set STRIPE_PRICE_ID in Cloudflare.
- [ ] Set STRIPE_WEBHOOK_SECRET in Cloudflare.
- [ ] Set SUBSCRIPTION_DISPLAY_PRICE and SUBSCRIPTION_BILLING_PERIOD in Cloudflare.
- [ ] Set APP_BASE_URL to the production domain.
- [ ] Configure Stripe Public details with the live Terms URL and Privacy URL before requiring terms acceptance.
- [ ] Configure Customer Portal to allow payment-method updates and cancellation.
- [ ] Enable appropriate Stripe failed-payment recovery settings and subscriber emails.
- [ ] Register the production webhook endpoint `/api/stripe/webhook`.
- [ ] Subscribe the webhook to checkout.session.completed, customer.subscription.created, customer.subscription.updated, customer.subscription.deleted, invoice.paid and invoice.payment_failed.
- [ ] Run a full test-mode subscription, renewal/failure simulation, portal cancellation and webhook replay test before accepting live payments.

## Consumer law
- [x] Terms preserve non-excludable Australian Consumer Law rights.
- [x] Subscription policy does not use a blanket “no refunds” term.
- [x] Subscription renewal and cancellation wording is designed to be visible before purchase.
- [x] Price-change wording is prospective, with notice and an opportunity to cancel.
- [x] Payment failure cannot block Emergency or core Safety access.
- [ ] Obtain Australian legal review before public paid launch, especially if plans, trials, promotions or minimum terms change.

## Privacy and communications
- [x] Public Privacy Policy explains current app data flows.
- [x] Card data is handled by Stripe-hosted Checkout rather than stored in the app database.
- [x] Current precise geolocation is not intentionally persisted by Around Me.
- [x] Privacy contact and complaint route are published.
- [x] Data-breach response plan exists.
- [ ] If marketing email/SMS is introduced, implement consent, sender identification and functional unsubscribe handling before sending campaigns.
- [ ] Re-audit overseas data processing and provider list whenever Stripe, Cloudflare, Neon, mapping or analytics providers change.

## Operational release test
- [x] Production build/CI passes after billing code is merged.
- [x] V002 billing migration was tested on a Neon temporary branch, separately approved, applied to production, and post-migration audited.
- [x] Production Terms, Privacy, Subscription/Refund and Membership pages return 200.
- [x] Billing remains disabled when release configuration is incomplete.
- [ ] Invalid Stripe webhook signatures return 400 in a configured test environment.
- [x] Temporary-branch audit confirmed replaying the same Stripe event ID does not create a duplicate event record.
- [ ] Cancellation and failed-payment end-to-end scenarios are verified not to block `/safety` or `tel:000`.

## Launch status
Billing code and V002 storage are deployed while charging remains disabled. **Live charging is not approved** until all unchecked items that apply to launch are completed.
