import { billingConfig } from '../../../../lib/billing.mjs';

export const dynamic = 'force-dynamic';

export async function GET() {
  const config = billingConfig();
  const plans = Object.fromEntries(
    Object.entries(config.plans)
      .filter(([, plan]) => plan.available)
      .map(([planId, plan]) => [planId, { label: plan.label, displayPrice: plan.displayPrice, billingPeriod: plan.billingPeriod }])
  );
  return Response.json({ enabled: config.enabled, plans, currency: 'AUD' });
}
