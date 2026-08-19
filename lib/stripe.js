import Stripe from 'stripe';

let client;

export function getStripe() {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return null;
  if (!client) {
    client = new Stripe(secret, {
      maxNetworkRetries: 2,
      timeout: 20_000
    });
  }
  return client;
}
