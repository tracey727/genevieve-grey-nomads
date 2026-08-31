import { getSql } from '../../../../lib/db';
import { billingConfig, isValidDeviceId, publicBillingStatus } from '../../../../lib/billing.mjs';
import { requireSession } from '../../../../lib/auth';

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
    // A signed-in account can also match on user_id, so membership shows up
    // on a fresh device once the traveller signs back in there.
    const authSession = await requireSession(request, process.env.SESSION_SECRET);
    const rows = authSession?.sub
      ? await sql`
          SELECT stripe_subscription_id, subscription_status, entitlement_active,
                 current_period_end, cancel_at_period_end
          FROM billing_accounts
          WHERE device_id = ${deviceId}
             OR user_id = (SELECT id FROM users WHERE public_id = ${authSession.sub}::uuid)
          ORDER BY (device_id = ${deviceId}) DESC
          LIMIT 1
        `
      : await sql`
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
