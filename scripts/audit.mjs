import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const required = [
  'app/page.js','app/plan/page.js','app/around/page.js','app/safety/page.js','app/trip/page.js','app/layout.js',
  'app/billing/page.js','app/legal/page.js','app/terms/page.js','app/subscriptions/page.js','app/privacy/page.js',
  'app/api/health/route.js','app/api/trips/route.js','app/api/billing/config/route.js',
  'app/api/billing/status/route.js','app/api/billing/checkout/route.js','app/api/billing/portal/route.js',
  'app/api/stripe/webhook/route.js','app/api/app-icon/route.js',
  'lib/budget-engine.mjs','lib/billing.mjs','lib/db.js','lib/stripe.js',
  'components/BrandHeader.js','components/LegalFooter.js','components/EmergencyCallControl.js',
  'components/EmergencyCallControl.module.css','migrations/V001_init.sql','migrations/V002_billing.sql',
  'public/manifest.webmanifest','docs/LEGAL_RELEASE_GATE.md','docs/DATA_BREACH_RESPONSE.md','docs/STRIPE_SETUP.md','.env.example','.gitignore'
];

let failed = false;
const fail = (message) => { console.error(`FAIL ${message}`); failed = true; };
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

for (const rel of required) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full) || fs.statSync(full).size === 0) fail(`missing/empty: ${rel}`);
  else console.log(`PASS ${rel}`);
}

const envExample = read('.env.example');
const gitignore = read('.gitignore');
const tripApi = read('app/api/trips/route.js');
const brand = read('components/BrandHeader.js');
const checkout = read('app/api/billing/checkout/route.js');
const webhook = read('app/api/stripe/webhook/route.js');
const billing = read('lib/billing.mjs');
const terms = read('app/terms/page.js');
const subscriptions = read('app/subscriptions/page.js');
const privacy = read('app/privacy/page.js');
const safety = read('app/safety/page.js');
const emergency = read('components/EmergencyCallControl.js');
const iconRoute = read('app/api/app-icon/route.js');
const manifest = read('public/manifest.webmanifest');
const layout = read('app/layout.js');
const releaseGate = read('docs/LEGAL_RELEASE_GATE.md');

if (!envExample.includes('DATABASE_URL=')) fail('DATABASE_URL example missing');
for (const name of ['STRIPE_SECRET_KEY','STRIPE_PRICE_ID','STRIPE_WEBHOOK_SECRET','SUBSCRIPTION_DISPLAY_PRICE','SUBSCRIPTION_BILLING_PERIOD','APP_BASE_URL']) {
  if (!envExample.includes(`${name}=`)) fail(`${name} example missing`);
}
if (!gitignore.includes('.env.local')) fail('.env.local not ignored');
if (!tripApi.includes('LIMIT 30')) fail('trip query must be bounded');
if (!tripApi.includes('100_000')) fail('trip request size guard missing');
if (!brand.includes('data:image/webp;base64,') || !brand.includes('Safety from roots to every journey.')) fail('official brand asset/tagline not embedded');

if (!checkout.includes("price: process.env.STRIPE_PRICE_ID")) fail('Checkout price must be server-controlled');
if (!checkout.includes("mode: 'subscription'")) fail('Checkout must use subscription mode');
if (!checkout.includes("terms_of_service: 'required'")) fail('Checkout must require terms acceptance');
if (!checkout.includes('client_reference_id: deviceId')) fail('Checkout must correlate to a validated device ID');
if (!billing.includes('STRIPE_WEBHOOK_SECRET') || !billing.includes('SUBSCRIPTION_DISPLAY_PRICE')) fail('billing release gate configuration is incomplete');

if (!webhook.includes('request.text()')) fail('Stripe webhook must use raw request body');
if (!webhook.includes('constructEvent')) fail('Stripe webhook signature verification missing');
if (!webhook.includes('stripe_webhook_events')) fail('Stripe webhook idempotency ledger missing');
if (!webhook.includes("'invoice.payment_failed'")) fail('failed payment webhook handling missing');
if (!webhook.includes("'customer.subscription.deleted'")) fail('subscription deletion webhook handling missing');

for (const source of [terms, subscriptions]) {
  if (!source.includes('Australian Consumer Law')) fail('Australian Consumer Law preservation wording missing');
}
if (!subscriptions.includes('no refunds') && !subscriptions.includes('no blanket')) fail('refund policy must reject blanket no-refund wording');
if (!privacy.includes('Stripe') || !privacy.includes('Vercel') || !privacy.includes('Neon')) fail('Privacy Policy provider disclosure incomplete');
if (!privacy.includes('Access and correction') || !privacy.includes('Privacy complaints')) fail('Privacy access/correction/complaint process missing');

if (!safety.includes('EmergencyCallControl')) fail('Safety must render guarded emergency control');
if (safety.includes('href="tel:000"')) fail('Safety must not contain an unguarded direct 000 call link');
if (!emergency.includes('const HOLD_MS = 3000')) fail('Emergency hold must be exactly three seconds');
if (!emergency.includes("window.location.href = 'tel:000'")) fail('Guarded emergency control must be the only 000 call trigger');
if (!emergency.includes('type="range"') || !emergency.includes('max="100"') || !emergency.includes('value >= 98')) fail('Emergency call must require a deliberate full slide after hold');
if (!emergency.includes('onPointerCancel={resetHold}') || !emergency.includes('onPointerLeave={resetHold}')) fail('Releasing/cancelling hold must reset before unlock');
if (safety.includes('/billing')) fail('Safety must not depend on billing navigation');

if (!iconRoute.includes("'content-type': 'image/png'")) fail('phone icon endpoint must return PNG');
if (!iconRoute.includes("Buffer.from(ICON_BASE64, 'base64')")) fail('phone icon asset is missing');
if (!manifest.includes('"src": "/api/app-icon"') || !manifest.includes('"display": "standalone"')) fail('PWA manifest must use branded home-screen icon and standalone mode');
if (!layout.includes("apple: '/api/app-icon'") || !layout.includes("title: 'Grey Nomads'")) fail('iPhone install metadata missing branded icon/title');

if (!releaseGate.includes('account recovery') || !releaseGate.includes('Live charging is not approved')) fail('paid-launch account recovery/release blocker missing');

const combined = required.filter((r) => r.endsWith('.js') || r.endsWith('.mjs')).map(read).join('\n');
if (/NEXT_PUBLIC_(STRIPE_SECRET_KEY|STRIPE_WEBHOOK_SECRET|DATABASE_URL)/.test(combined)) fail('server secret exposed through NEXT_PUBLIC_ variable');
if (/sk_live_[A-Za-z0-9]/.test(combined) || /whsec_[A-Za-z0-9]{8,}/.test(combined)) fail('live Stripe secret appears in source');

if (failed) process.exit(1);
console.log('AUDIT PASS');
