import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function text(path) { return readFile(path, 'utf8'); }

test('premium Home keeps all six chronological actions and guarded emergency wording', async () => {
  const home = await text('app/page.js');
  for (const expected of ['1. Continue Journey','2. Plan Trip','3. Around Me','4. Safety','5. Budget Planner','6. My Trip']) assert.match(home, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(home, /Tap to open guarded emergency controls/);
  assert.doesNotMatch(home, /Tap for immediate assistance/);
  assert.match(home, /premium-home/);
  assert.match(home, /genevieve:traveller-profile/);
});

test('all main Home links resolve to existing app routes or anchors', async () => {
  const requiredFiles = ['app/trip/page.js','app/plan/page.js','app/around/page.js','app/safety/page.js'];
  for (const path of requiredFiles) assert.ok((await text(path)).length > 100, `${path} must exist and contain a real screen`);
  const plan = await text('app/plan/page.js');
  assert.match(plan, /id="budget"/);
});

test('agreed travel information is present without false live claims', async () => {
  const around = await text('app/around/page.js');
  for (const item of ['Fuel prices','BOM weather','Road closures','Tides','Campground availability','Council rules','Caravan parks','Free / rest areas','Hospitals','Emergency vets','Drinking water']) assert.match(around, new RegExp(item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  assert.match(around, /only label them live after a verified provider integration is approved/i);
  assert.match(around, /does not store it here/i);
});

test('free safety boundary and agreed Plus information are visible', async () => {
  const billing = await text('app/billing/page.js');
  assert.match(billing, /Free — \$0/);
  assert.match(billing, /GENEVIEVE safety is never paywalled/);
  assert.match(billing, /A\$9\.99\/month or A\$99\/year/);
  assert.match(billing, /guarded 000 emergency control/);
  assert.match(billing, /enhanced trip and budget planning/);
  assert.match(billing, /multiple saved trips/);
});

test('basic traveller settings are free, local-only and linked back to Home greeting', async () => {
  const trip = await text('app/trip/page.js');
  const home = await text('app/page.js');
  assert.match(trip, /Free traveller settings/);
  assert.match(trip, /genevieve:traveller-profile/);
  assert.match(trip, /Stored on this device only/);
  assert.match(home, /genevieve:traveller-profile/);
});

test('guarded emergency code remains hold then slide with no direct Safety anchor', async () => {
  const control = await text('components/EmergencyCallControl.js');
  const safety = await text('app/safety/page.js');
  assert.match(control, /3000/);
  assert.match(control, /tel:000/);
  assert.match(control, /slide/i);
  assert.doesNotMatch(safety, /href=["']tel:000["']/i);
});

test('budget engine protection, PWA and Cloudflare deployment files remain present', async () => {
  const plan = await text('app/plan/page.js');
  const manifest = JSON.parse(await text('public/manifest.webmanifest'));
  const wrangler = await text('wrangler.jsonc');
  const openNext = await text('open-next.config.ts');
  assert.match(plan, /Emergency reserve — protected/);
  assert.match(plan, /does not recommend stretching fuel range simply to save money/);
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.lang, 'en-AU');
  assert.match(wrangler, /nodejs_compat/);
  assert.match(openNext, /defineCloudflareConfig/);
});
