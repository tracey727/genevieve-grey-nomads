import { getSql } from '../../../../lib/db';
import { billingConfig, isValidDeviceId } from '../../../../lib/billing.mjs';
import { getStripe } from '../../../../lib/stripe';

export const dynamic = 'force-dynamic';

const bad = (message, status = 400) => Response.json({ error: message }, { status });

export async function POST(request) {
  const config = billingConfig();
  const stripe = getStripe();
  const sql = getSql();
  if (!config.enabled || !stripe || !sql) return bad('Subscriptions are not enabled yet.', 503);

  let body;
  try {
    const contentLength = Number(request.headers.get('content-length') || 0);
    if (contentLength > 20_000) return bad('Request is too large.', 413);
    body = await request.json();
  } catch {
    return bad('Invalid request body.');
  }

  const deviceId = body?.deviceId;
  if (!isValidDeviceId(deviceId)) return bad('A valid device ID is required.');

  try {
    const existing = await sql`
      SELECT stripe_customer_id
      FROM billing_accounts
      WHERE device_id = ${deviceId}
      LIMIT 1
    `;
    const customerId = existing[0]?.stripe_customer_id || undefined;
    const baseUrl = (process.env.APP_BASE_URL || new URL(request.url).origin).replace(/\/$/, '');

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      customer: customerId,
      client_reference_id: deviceId,
      metadata: { device_id: deviceId },
      subscription_data: { metadata: { device_id: deviceId } },
      consent_collection: { terms_of_service: 'required' },
      custom_text: {
        submit: {
          message: `This subscription renews every ${config.billingPeriod} until cancelled. You can manage or cancel it from Membership.`
        }
      },
      success_url: `${baseUrl}/billing?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/billing?cancelled=1`
    });

    if (!session.url) return bad('Checkout could not be opened.', 503);
    return Response.json({ url: session.url });
  } catch {
    return bad('Checkout is temporarily unavailable.', 503);
  }
}
