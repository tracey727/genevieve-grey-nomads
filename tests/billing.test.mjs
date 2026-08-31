import test from 'node:test';
import assert from 'node:assert/strict';
import { billingConfig, entitlementActiveForStatus, isValidDeviceId, isValidPlan, priceIdForPlan, planForPriceId, publicBillingStatus, PLANS } from '../lib/billing.mjs';

test('billing is disabled unless Stripe core secrets and at least one plan price are configured', () => {
  assert.equal(billingConfig({}).enabled, false);
  assert.equal(billingConfig({ STRIPE_SECRET_KEY: 'sk', STRIPE_WEBHOOK_SECRET: 'whsec' }).enabled, false, 'no plan price configured yet');
  const config = billingConfig({ STRIPE_SECRET_KEY: 'sk', STRIPE_WEBHOOK_SECRET: 'whsec', STRIPE_PRICE_PREMIUM_MONTHLY: 'price_123' });
  assert.equal(config.enabled, true);
  assert.equal(config.plans.premium_monthly.available, true);
  assert.equal(config.plans.premium_annual.available, false, 'unconfigured plans stay unavailable individually');
});

test('the launch catalog has all four plans', () => {
  assert.deepEqual(Object.keys(PLANS).sort(), ['founding_annual', 'pensioner_annual', 'premium_annual', 'premium_monthly']);
});

test('only an available, catalog-listed plan id resolves to a price', () => {
  const config = billingConfig({ STRIPE_SECRET_KEY: 'sk', STRIPE_WEBHOOK_SECRET: 'whsec', STRIPE_PRICE_PREMIUM_MONTHLY: 'price_123' });
  assert.equal(isValidPlan('premium_monthly'), true);
  assert.equal(isValidPlan('made_up_plan'), false);
  assert.equal(priceIdForPlan(config, 'premium_monthly'), 'price_123');
  assert.equal(priceIdForPlan(config, 'premium_annual'), null, 'not configured for this environment');
  assert.equal(priceIdForPlan(config, 'made_up_plan'), null);
});

test('a stored Stripe price id maps back to its plan for display', () => {
  const config = billingConfig({ STRIPE_SECRET_KEY: 'sk', STRIPE_WEBHOOK_SECRET: 'whsec', STRIPE_PRICE_PENSIONER_ANNUAL: 'price_pensioner' });
  assert.equal(planForPriceId(config, 'price_pensioner'), 'pensioner_annual');
  assert.equal(planForPriceId(config, 'price_unknown'), null);
});

test('device IDs must be UUIDs', () => {
  assert.equal(isValidDeviceId('11111111-1111-4111-8111-111111111111'), true);
  assert.equal(isValidDeviceId('guessable-device'), false);
});

test('past due keeps entitlement during recovery but cancelled does not', () => {
  assert.equal(entitlementActiveForStatus('active'), true);
  assert.equal(entitlementActiveForStatus('past_due'), true);
  assert.equal(entitlementActiveForStatus('canceled'), false);
  assert.equal(entitlementActiveForStatus('unpaid'), false);
});

test('public status does not expose Stripe identifiers or email', () => {
  const config = billingConfig({ STRIPE_SECRET_KEY: 'sk', STRIPE_WEBHOOK_SECRET: 'whsec', STRIPE_PRICE_PREMIUM_MONTHLY: 'price_123' });
  const status = publicBillingStatus({ stripe_subscription_id: 'sub_123', stripe_price_id: 'price_123', subscription_status: 'active', entitlement_active: true, current_period_end: null, cancel_at_period_end: false, email: 'private@example.com', stripe_customer_id: 'cus_123' }, config);
  assert.equal(status.subscribed, true);
  assert.equal(status.entitlementActive, true);
  assert.equal(status.plan, 'premium_monthly');
  assert.equal('email' in status, false);
  assert.equal('stripe_customer_id' in status, false);
});
