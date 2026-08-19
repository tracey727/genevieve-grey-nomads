import { getSql } from '../../../../lib/db';
import { billingConfig, isValidDeviceId, publicBillingStatus } from '../../../../lib/billing.mjs';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const config = billingConfig();
  const deviceId = new URL(request.url).searchParams.get('deviceId') || '';
  if (!isValidDeviceId(deviceId)) {
    return Response.json({ error: 'A valid device ID is required.' }, { status: 400 });
  }
  if (!config.enabled) return Response.json(publicBillingStatus(null, config));
  const sql = getSql();
  if (!sql) return Response.json({ error: 'Billing storage is unavailable.' }, { status: 503 });
  try {
    const rows = await sql`
      SELECT stripe_subscription_id, subscription_status, entitlement_active,
             current_period_end, cancel_at_period_end
      FROM billing_accounts
      WHERE device_id = ${deviceId}
      LIMIT 1
    `;
    return Response.json(publicBillingStatus(rows[0] || null, config));
  } catch {
    return Response.json({ error: 'Billing status is temporarily unavailable.' }, { status: 503 });
  }
}
