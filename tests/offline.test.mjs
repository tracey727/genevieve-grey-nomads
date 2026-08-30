import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const sw = fs.readFileSync(new URL('../public/sw.js', import.meta.url), 'utf8');
const layout = fs.readFileSync(new URL('../app/layout.js', import.meta.url), 'utf8');
const register = fs.readFileSync(new URL('../components/ServiceWorkerRegister.js', import.meta.url), 'utf8');
const offline = fs.readFileSync(new URL('../public/offline.html', import.meta.url), 'utf8');

test('the app shell registers a service worker so cached screens keep working with no signal', () => {
  assert.match(layout, /ServiceWorkerRegister/);
  assert.match(register, /navigator\.serviceWorker\.register\('\/sw\.js'\)/);
});

test('the service worker never intercepts API requests, so live data stays fail-closed', () => {
  assert.match(sw, /isApiRequest\(url\)/);
  assert.match(sw, /if \(isApiRequest\(url\)\) return;/);
});

test('the service worker precaches the core screens and falls back to an offline page', () => {
  for (const route of ['/plan', '/around', '/safety', '/trip', '/billing']) {
    assert.ok(sw.includes(`'${route}'`), `expected ${route} to be precached`);
  }
  assert.match(sw, /OFFLINE_URL = '\/offline\.html'/);
  assert.match(offline, /Call 000 in a genuine emergency/);
});
