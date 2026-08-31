const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidDeviceId(value) {
  return typeof value === 'string' && UUID_RE.test(value);
}

// The paid plan catalog. Free/Safety access needs none of this — it is the
// default, unconditional state of the app. Each plan's actual charged
// amount always comes from its Stripe Price object (the client only ever
// sends a plan id, never an amount); displayPrice here is presentation
// text and must be kept in sync by hand with the real Stripe Price.
export const PLANS = Object.freeze({
  premium_monthly: { envVar: 'STRIPE_PRICE_PREMIUM_MONTHLY', label: 'Premium Monthly', displayPrice: '$12.99 AUD', billingPeriod: 'month' },
  premium_annual: { envVar: 'STRIPE_PRICE_PREMIUM_ANNUAL', label: 'Premium Annual', displayPrice: '$119.00 AUD', billingPeriod: 'year' },
  pensioner_annual: { envVar: 'STRIPE_PRICE_PENSIONER_ANNUAL', label: 'Pensioner Annual', displayPrice: '$83.00 AUD', billingPeriod: 'year' },
  founding_annual: { envVar: 'STRIPE_PRICE_FOUNDING_ANNUAL', label: 'Founding Member Annual', displayPrice: '$79.00 AUD', billingPeriod: 'year' }
});

export function isValidPlan(planId) {
  return typeof planId === 'string' && Object.prototype.hasOwnProperty.call(PLANS, planId);
}

export function billingConfig(env = process.env) {
  const coreReady = [env.STRIPE_SECRET_KEY, env.STRIPE_WEBHOOK_SECRET]
    .every((value) => typeof value === 'string' && value.trim().length > 0);

  const plans = {};
  for (const [planId, plan] of Object.entries(PLANS)) {
    const priceId = String(env[plan.envVar] || '').trim();
    plans[planId] = { ...plan, priceId, available: coreReady && priceId.length > 0 };
  }

  return {
    enabled: coreReady && Object.values(plans).some((plan) => plan.available),
    plans
  };
}

export function priceIdForPlan(config, planId) {
  const plan = config.plans?.[planId];
  return plan?.available ? plan.priceId : null;
}

export function planForPriceId(config, priceId) {
  if (!priceId) return null;
  const entry = Object.entries(config.plans || {}).find(([, plan]) => plan.priceId && plan.priceId === priceId);
  return entry ? entry[0] : null;
}

export function entitlementActiveForStatus(status) {
  return ['active', 'trialing', 'past_due'].includes(String(status || '').toLowerCase());
}

export function publicBillingStatus(row, config) {
  if (!row) {
    return {
      enabled: config.enabled,
      subscribed: false,
      entitlementActive: false,
      status: 'none',
      plan: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false
    };
  }
  return {
    enabled: config.enabled,
    subscribed: Boolean(row.stripe_subscription_id),
    entitlementActive: Boolean(row.entitlement_active),
    status: row.subscription_status || 'none',
    plan: planForPriceId(config, row.stripe_price_id),
    currentPeriodEnd: row.current_period_end || null,
    cancelAtPeriodEnd: Boolean(row.cancel_at_period_end)
  };
}
