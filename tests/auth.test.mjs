import test from 'node:test';
import assert from 'node:assert/strict';
import {
  hashPassword,
  verifyPassword,
  createSessionToken,
  verifySessionToken,
  isValidEmail,
  isValidPassword,
  normalizeEmail
} from '../lib/auth.js';

test('password hashes are salted and verify correctly, and reject the wrong password', async () => {
  const hashA = await hashPassword('correct horse battery staple');
  const hashB = await hashPassword('correct horse battery staple');
  assert.notEqual(hashA, hashB, 'identical passwords must hash to different salted values');
  assert.ok(await verifyPassword('correct horse battery staple', hashA));
  assert.ok(!(await verifyPassword('wrong password entirely', hashA)));
});

test('session tokens verify, expire and reject tampering', async () => {
  const secret = 'test-secret';
  const token = await createSessionToken({ sub: 'user-1' }, secret, 60);
  const verified = await verifySessionToken(token, secret);
  assert.equal(verified.sub, 'user-1');

  const expired = await createSessionToken({ sub: 'user-1' }, secret, -10);
  assert.equal(await verifySessionToken(expired, secret), null);

  assert.equal(await verifySessionToken(token, 'wrong-secret'), null);

  const [payloadPart, signaturePart] = token.split('.');
  const tampered = `${payloadPart}x.${signaturePart}`;
  assert.equal(await verifySessionToken(tampered, secret), null);
});

test('email/password validators enforce basic account safety rules', () => {
  assert.ok(isValidEmail('traveller@example.com'));
  assert.ok(!isValidEmail('not-an-email'));
  assert.equal(normalizeEmail('  Traveller@Example.com '), 'traveller@example.com');
  assert.ok(isValidPassword('a-reasonable-length-password'));
  assert.ok(!isValidPassword('short'));
});
