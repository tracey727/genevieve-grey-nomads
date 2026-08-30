import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const webhook = fs.readFileSync(new URL('../app/api/stripe/webhook/route.js', import.meta.url), 'utf8');
const checkout = fs.readFileSync(new URL('../app/api/billing/checkout/route.js', import.meta.url), 'utf8');
const status = fs.readFileSync(new URL('../app/api/billing/status/route.js', import.meta.url), 'utf8');
const portal = fs.readFileSync(new URL('../app/api/billing/portal/route.js', import.meta.url), 'utf8');

test('checkout keeps the anonymous device-only flow working when no session is presented', () => {
  assert.match(checkout, /const authSession = await requireSession\(request, process\.env\.SESSION_SECRET\);/);
  assert.match(checkout, /const userPublicId = authSession\?\.sub \|\| null;/);
  assert.match(checkout, /const metadata = userPublicId \? \{ device_id: deviceId, user_id: userPublicId \} : \{ device_id: deviceId \};/);
});

test('the webhook resolves an account id without ever discarding an existing link', () => {
  assert.match(webhook, /async function resolveUserId\(sql, userPublicId\)/);
  assert.match(webhook, /user_id = COALESCE\(EXCLUDED\.user_id, billing_accounts\.user_id\)/);
  // Guards against a malformed/attacker-controlled metadata.user_id reaching the database as a raw value.
  assert.match(webhook, /if \(typeof userPublicId !== 'string' \|\| !uuidPattern\.test\(userPublicId\)\) return null;/);
});

test('status and portal both fall back to device-only lookup when signed out', () => {
  for (const source of [status, portal]) {
    assert.match(source, /const authSession = await requireSession\(request, process\.env\.SESSION_SECRET\);/);
    assert.match(source, /authSession\?\.sub\s*\n?\s*\?/);
  }
});
