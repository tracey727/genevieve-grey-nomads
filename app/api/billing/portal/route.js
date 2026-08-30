import { getSql } from '../../../../lib/db';
import { billingConfig, isValidDeviceId } from '../../../../lib/billing.mjs';
import { getStripe } from '../../../../lib/stripe';
import { requireSession } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const config = billingConfig();
  const stripe = getStripe();
  const sql = getSql();
  if (!config.enabled || !stripe || !sql) {
    return Response.json({ error: 'Subscription management is not enabled yet.' }, { status: 503 });
  }

  let body;
  try { body = await request.json(); } catch { return Response.json({ error: 'Invalid request body.' }, { status: 400 }); }
  const deviceId = body?.deviceId;
  if (!isValidDeviceId(deviceId)) return Response.json({ error: 'A valid device ID is required.' }, { status: 400 });

  try {
    // A signed-in account can also match on user_id, so membership carries
    // over to Manage/cancel on a fresh device once signed back in there.
    const authSession = await requireSession(request, process.env.SESSION_SECRET);
    const rows = authSession?.sub
      ? await sql`
          SELECT stripe_customer_id
          FROM billing_accounts
          WHERE device_id = ${deviceId}
             OR user_id = (SELECT id FROM users WHERE public_id = ${authSession.sub}::uuid)
          ORDER BY (device_id = ${deviceId}) DESC
          LIMIT 1
        `
      : await sql`
          SELECT stripe_customer_id
          FROM billing_accounts
          WHERE device_id = ${deviceId}
          LIMIT 1
        `;
    const customerId = rows[0]?.stripe_customer_id;
    if (!customerId) return Response.json({ error: 'No subscription account is linked to this device.' }, { status: 404 });
    const baseUrl = (process.env.APP_BASE_URL || new URL(request.url).origin).replace(/\/$/, '');
    const portal = await stripe.billingPortal.sessions.create({ customer: customerId, return_url: `${baseUrl}/billing` });
    return Response.json({ url: portal.url });
  } catch {
    return Response.json({ error: 'Subscription management is temporarily unavailable.' }, { status: 503 });
  }
}
