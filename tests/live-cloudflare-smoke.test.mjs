import test from 'node:test';
import assert from 'node:assert/strict';

const BASE = 'https://genevieve-grey-nomads.positivity864.workers.dev';

async function get(path, init) {
  const response = await fetch(`${BASE}${path}`, { redirect: 'follow', ...init });
  const text = await response.text();
  console.log(`LIVE ${path} -> ${response.status} ${response.headers.get('content-type') || ''}`);
  return { response, text };
}

function expectContains(text, values) {
  for (const value of values) assert.match(text, new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
}

async function fetchClientBundles(html) {
  const srcs = [...html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)].map((m) => m[1]);
  const chunks = [];
  for (const src of srcs) {
    if (!src.startsWith('/')) continue;
    const response = await fetch(`${BASE}${src}`);
    if (response.ok) chunks.push(await response.text());
  }
  return chunks.join('\n');
}

test('LIVE Home loads premium dashboard and all six actions', async () => {
  const { response, text } = await get('/');
  assert.equal(response.status, 200);
  expectContains(text, ['GENEVIEVE', 'G’day, Traveller', 'Emergency / Safety', '1. Continue Journey', '2. Plan Trip', '3. Around Me', '4. Safety', '5. Budget Planner', '6. My Trip']);
});

test('LIVE Plan Trip and Budget Planner render', async () => {
  const { response, text } = await get('/plan');
  assert.equal(response.status, 200);
  expectContains(text, ['Plan the trip around your money', 'Emergency reserve', 'Check road distance', 'Fuel safety', 'Keep this journey']);
});

test('LIVE Around Me renders location and provider-safe actions', async () => {
  const { response, text } = await get('/around');
  assert.equal(response.status, 200);
  expectContains(text, ['Find what matters, fast', 'Use my location', 'Fuel prices', 'BOM weather', 'Caravan parks', 'Drinking water']);
});

test('LIVE Safety page and shipped client bundle preserve guarded 000 control', async () => {
  const { response, text } = await get('/safety');
  assert.equal(response.status, 200);
  expectContains(text, ['Emergency — Call 000', 'Two deliberate actions prevent accidental calls', 'Nearest hospital', 'Police station']);
  assert.ok(!/<a[^>]+href=["']tel:000["']/i.test(text), 'Safety page must not expose a one-tap tel:000 anchor');
  const bundles = await fetchClientBundles(text);
  expectContains(bundles, ['Press & hold for 3 seconds', 'Slide all the way to call 000', 'tel:000']);
});

test('LIVE My Trip renders its correct empty-device state', async () => {
  const { response, text } = await get('/trip');
  assert.equal(response.status, 200);
  expectContains(text, ['Your journeys', 'Current device plan', 'No journey planned yet', 'Membership']);
});

test('LIVE PWA manifest, metadata and app icon are valid', async () => {
  const home = await get('/');
  expectContains(home.text, ['rel="manifest" href="/manifest.webmanifest"', 'mobile-web-app-capable', 'apple-mobile-web-app-title']);

  const manifestResult = await get('/manifest.webmanifest');
  assert.equal(manifestResult.response.status, 200);
  const manifest = JSON.parse(manifestResult.text);
  assert.equal(manifest.name, 'GENEVIEVE Grey Nomads');
  assert.equal(manifest.short_name, 'Grey Nomads');
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.lang, 'en-AU');
  assert.equal(manifest.icons?.[0]?.src, '/api/app-icon');

  const icon = await fetch(`${BASE}/api/app-icon`);
  console.log(`LIVE /api/app-icon -> ${icon.status} ${icon.headers.get('content-type') || ''}`);
  assert.equal(icon.status, 200);
  assert.match(icon.headers.get('content-type') || '', /image\/png/i);
});

test('LIVE health endpoint reports explicit database state', async () => {
  const { response, text } = await get('/api/health');
  const payload = JSON.parse(text);
  console.log(`LIVE HEALTH database=${payload.database} ok=${payload.ok}`);
  assert.ok([200, 503].includes(response.status));
  assert.ok(['connected', 'not-configured', 'unavailable'].includes(payload.database));
  assert.notEqual(response.status, 500);
});

test('LIVE dynamic APIs fail safely rather than throwing runtime 500s', async () => {
  const fuel = await get('/api/fuel-prices?lat=-27.95&lon=153.40');
  const fuelPayload = JSON.parse(fuel.text);
  console.log(`LIVE FUEL live=${fuelPayload.live} provider=${fuelPayload.provider || ''}`);
  assert.notEqual(fuel.response.status, 500);

  const weather = await get('/api/weather?lat=-27.95&lon=153.40');
  const weatherPayload = JSON.parse(weather.text);
  console.log(`LIVE WEATHER live=${weatherPayload.live} provider=${weatherPayload.provider || ''}`);
  assert.notEqual(weather.response.status, 500);

  const trips = await get('/api/trips?deviceId=11111111-1111-4111-8111-111111111111');
  console.log(`LIVE TRIPS body=${trips.text.slice(0, 180)}`);
  assert.notEqual(trips.response.status, 500);

  const route = await fetch(`${BASE}/api/route-distance`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ origin: 'Gold Coast, QLD', destination: 'Brisbane, QLD' })
  });
  const routeText = await route.text();
  console.log(`LIVE /api/route-distance -> ${route.status} ${route.headers.get('content-type') || ''} body=${routeText.slice(0, 180)}`);
  assert.notEqual(route.status, 500);
});
