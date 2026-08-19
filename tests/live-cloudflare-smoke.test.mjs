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

test('LIVE Safety renders guarded emergency flow', async () => {
  const { response, text } = await get('/safety');
  assert.equal(response.status, 200);
  expectContains(text, ['Emergency — Call 000', 'Press & hold for 3 seconds', 'Two deliberate actions prevent accidental calls', 'Nearest hospital', 'Police station']);
  assert.ok(!/<a[^>]+href=["']tel:000["']/i.test(text), 'Safety page must not expose a one-tap tel:000 anchor');
});

test('LIVE My Trip renders local-first journey storage screen', async () => {
  const { response, text } = await get('/trip');
  assert.equal(response.status, 200);
  expectContains(text, ['Your journeys', 'Current device plan', 'Save to my trip store', 'Membership']);
});

test('LIVE PWA manifest and app icon are valid', async () => {
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

test('LIVE dynamic APIs fail safely rather than throwing 500s', async () => {
  const fuel = await get('/api/fuel-prices?lat=-27.95&lon=153.40');
  assert.notEqual(fuel.response.status, 500);
  const weather = await get('/api/weather?lat=-27.95&lon=153.40');
  assert.notEqual(weather.response.status, 500);
  const trips = await get('/api/trips?deviceId=11111111-1111-4111-8111-111111111111');
  assert.notEqual(trips.response.status, 500);

  const route = await fetch(`${BASE}/api/route-distance`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ origin: 'Gold Coast, QLD', destination: 'Brisbane, QLD' })
  });
  console.log(`LIVE /api/route-distance -> ${route.status} ${route.headers.get('content-type') || ''}`);
  assert.notEqual(route.status, 500);
});
