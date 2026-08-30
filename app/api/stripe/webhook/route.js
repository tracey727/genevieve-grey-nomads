import { getSql } from '../../../../lib/db';
import { entitlementActiveForStatus, isValidDeviceId } from '../../../../lib/billing.mjs';
import { getStripe } from '../../../../lib/stripe';

export const dynamic = 'force-dynamic';

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Resolves an optional signed-in account's public (UUID) ID to the internal
// billing_accounts.user_id foreign key. Never throws: an unresolvable or
// absent account ID just leaves the subscription on its existing device-only
// association rather than failing the whole webhook.
async function resolveUserId(sql, userPublicId) {
  if (typeof userPublicId !== 'string' || !uuidPattern.test(userPublicId)) return null;
  try {
    const rows = await sql`SELECT id FROM users WHERE public_id = ${userPublicId}::uuid LIMIT 1`;
    return rows[0]?.id || null;
  } catch {
    return null;
  }
}

async function upsertSubscription(sql, deviceId, subscription, fallbackCustomerId = null, email = null, userId = null) {
  if (!isValidDeviceId(deviceId) || !subscription) return;
  const customerId = typeof subscription.customer === 'string' ? subscription.customer : fallbackCustomerId;
  const status = String(subscription.status || 'active');
  const periodEnd = subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : null;
  const priceId = subscription.items?.data?.[0]?.price?.id || null;
  await sql`
    INSERT INTO billing_accounts (
      device_id, email, stripe_customer_id, stripe_subscription_id, stripe_price_id,
      subscription_status, entitlement_active, current_period_end, cancel_at_period_end, user_id, updated_at
    ) VALUES (
      ${deviceId}, ${email}, ${customerId}, ${subscription.id}, ${priceId},
      ${status}, ${entitlementActiveForStatus(status)}, ${periodEnd}, ${Boolean(subscription.cancel_at_period_end)}, ${userId}, now()
    )
    ON CONFLICT (device_id) DO UPDATE SET
      email = COALESCE(EXCLUDED.email, billing_accounts.email),
      stripe_customer_id = COALESCE(EXCLUDED.stripe_customer_id, billing_accounts.stripe_customer_id),
      stripe_subscription_id = EXCLUDED.stripe_subscription_id,
      stripe_price_id = COALESCE(EXCLUDED.stripe_price_id, billing_accounts.stripe_price_id),
      subscription_status = EXCLUDED.subscription_status,
      entitlement_active = EXCLUDED.entitlement_active,
      current_period_end = COALESCE(EXCLUDED.current_period_end, billing_accounts.current_period_end),
      cancel_at_period_end = EXCLUDED.cancel_at_period_end,
      user_id = COALESCE(EXCLUDED.user_id, billing_accounts.user_id),
      updated_at = now()
  `;
}

async function deviceForSubscription(sql, subscription) {
  const metadataId = subscription?.metadata?.device_id;
  if (isValidDeviceId(metadataId)) return metadataId;
  const customerId = typeof subscription?.customer === 'string' ? subscription.customer : null;
  const rows = subscription?.id
    ? await sql`SELECT device_id FROM billing_accounts WHERE stripe_subscription_id = ${subscription.id} LIMIT 1`
    : customerId
      ? await sql`SELECT device_id FROM billing_accounts WHERE stripe_customer_id = ${customerId} LIMIT 1`
      : [];
  return rows[0]?.device_id || null;
}

export async function POST(request) {
  const stripe = getStripe();
  const sql = getSql();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !sql || !secret) return Response.json({ error: 'Webhook is not configured.' }, { status: 503 });

  const rawBody = await request.text();
  const signature = request.headers.get('stripe-signature');
  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch {
    return Response.json({ error: 'Invalid webhook signature.' }, { status: 400 });
  }

  try {
    const prior = await sql`SELECT processed_at FROM stripe_webhook_events WHERE stripe_event_id = ${event.id} LIMIT 1`;
    if (prior[0]?.processed_at) return Response.json({ received: true, duplicate: true });
    await sql`
      INSERT INTO stripe_webhook_events (stripe_event_id, event_type)
      VALUES (${event.id}, ${event.type})
      ON CONFLICT (stripe_event_id) DO NOTHING
    `;

    const object = event.data.object;
    if (event.type === 'checkout.session.completed' && object.mode === 'subscription') {
      const deviceId = object.client_reference_id || object.metadata?.device_id;
      const subscriptionId = typeof object.subscription === 'string' ? object.subscription : object.subscription?.id;
      if (isValidDeviceId(deviceId) && subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const customerId = typeof object.customer === 'string' ? object.customer : object.customer?.id;
        const userId = await resolveUserId(sql, object.metadata?.user_id);
        await upsertSubscription(sql, deviceId, subscription, customerId, object.customer_details?.email || null, userId);
      }
    }

    if (['customer.subscription.created', 'customer.subscription.updated', 'customer.subscription.deleted'].includes(event.type)) {
      const deviceId = await deviceForSubscription(sql, object);
      if (deviceId) {
        const userId = await resolveUserId(sql, object.metadata?.user_id);
        await upsertSubscription(sql, deviceId, object, null, null, userId);
      }
    }

    if (event.type === 'invoice.payment_failed') {
      const customerId = typeof object.customer === 'string' ? object.customer : object.customer?.id;
      if (customerId) {
        await sql`
          UPDATE billing_accounts
          SET subscription_status = 'past_due', updated_at = now()
          WHERE stripe_customer_id = ${customerId}
        `;
      }
    }

    if (event.type === 'invoice.paid') {
      const customerId = typeof object.customer === 'string' ? object.customer : object.customer?.id;
      if (customerId) {
        await sql`
          UPDATE billing_accounts
          SET entitlement_active = true, updated_at = now()
          WHERE stripe_customer_id = ${customerId}
            AND subscription_status IN ('active', 'trialing', 'past_due')
        `;
      }
    }

    await sql`
      UPDATE stripe_webhook_events
      SET processed_at = now(), processing_error = NULL
      WHERE stripe_event_id = ${event.id}
    `;
    return Response.json({ received: true });
  } catch (error) {
    try {
      await sql`
        UPDATE stripe_webhook_events
        SET processing_error = ${String(error?.message || 'processing failed').slice(0, 500)}
        WHERE stripe_event_id = ${event.id}
      `;
    } catch {}
    return Response.json({ error: 'Webhook processing failed.' }, { status: 500 });
  }
}
