const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidDeviceId(value) {
  return typeof value === 'string' && UUID_RE.test(value);
}

export function billingConfig(env = process.env) {
  const displayPrice = String(env.SUBSCRIPTION_DISPLAY_PRICE || '').trim();
  const billingPeriod = String(env.SUBSCRIPTION_BILLING_PERIOD || '').trim();
  const required = [
    env.STRIPE_SECRET_KEY,
    env.STRIPE_PRICE_ID,
    env.STRIPE_WEBHOOK_SECRET,
    displayPrice,
    billingPeriod
  ];
  return {
    enabled: required.every((value) => typeof value === 'string' && value.trim().length > 0),
    displayPrice,
    billingPeriod
  };
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
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false
    };
  }
  return {
    enabled: config.enabled,
    subscribed: Boolean(row.stripe_subscription_id),
    entitlementActive: Boolean(row.entitlement_active),
    status: row.subscription_status || 'none',
    currentPeriodEnd: row.current_period_end || null,
    cancelAtPeriodEnd: Boolean(row.cancel_at_period_end)
  };
}
