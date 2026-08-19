import test from 'node:test';
import assert from 'node:assert/strict';
import { billingConfig, entitlementActiveForStatus, isValidDeviceId, publicBillingStatus } from '../lib/billing.mjs';

test('billing is disabled unless all charging safeguards are configured', () => {
  assert.equal(billingConfig({}).enabled, false);
  assert.equal(billingConfig({ STRIPE_SECRET_KEY:'sk', STRIPE_PRICE_ID:'price', STRIPE_WEBHOOK_SECRET:'whsec', SUBSCRIPTION_DISPLAY_PRICE:'$9.99 AUD', SUBSCRIPTION_BILLING_PERIOD:'month' }).enabled, true);
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
  const status = publicBillingStatus({ stripe_subscription_id:'sub_123', subscription_status:'active', entitlement_active:true, current_period_end:null, cancel_at_period_end:false, email:'private@example.com', stripe_customer_id:'cus_123' }, { enabled:true });
  assert.equal(status.subscribed, true);
  assert.equal(status.entitlementActive, true);
  assert.equal('email' in status, false);
  assert.equal('stripe_customer_id' in status, false);
});
