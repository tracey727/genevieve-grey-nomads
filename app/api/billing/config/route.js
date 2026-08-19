import { billingConfig } from '../../../../lib/billing.mjs';

export const dynamic = 'force-dynamic';

export async function GET() {
  const config = billingConfig();
  return Response.json({
    enabled: config.enabled,
    displayPrice: config.enabled ? config.displayPrice : '',
    billingPeriod: config.enabled ? config.billingPeriod : '',
    currency: 'AUD'
  });
}
