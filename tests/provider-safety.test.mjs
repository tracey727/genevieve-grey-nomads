import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const fuelRoute = fs.readFileSync(new URL('../app/api/fuel-prices/route.js', import.meta.url), 'utf8');
const weatherRoute = fs.readFileSync(new URL('../app/api/weather/route.js', import.meta.url), 'utf8');
const aroundPage = fs.readFileSync(new URL('../app/around/page.js', import.meta.url), 'utf8');

const providerFiles = [
  '../lib/providers/fuelwatchWa.js',
  '../lib/providers/fuelcheckNswTas.js',
  '../lib/providers/fuelPricesQld.js',
  '../lib/providers/fuelPricesSa.js',
  '../lib/providers/servoSaverVic.js'
].map((path) => fs.readFileSync(new URL(path, import.meta.url), 'utf8'));

test('Around Me only displays provider data when API explicitly says live', () => {
  assert.match(aroundPage, /if \(!payload\.live\)/);
  assert.match(aroundPage, /No unverified price or weather value has been shown/);
});

test('ACT and Northern Territory gates remain fail-closed and no-scrape', () => {
  assert.match(fuelRoute, /provider === 'act'/);
  assert.match(fuelRoute, /developer documentation only documents NSW and Tasmania support/);
  assert.match(fuelRoute, /provider === 'nt'/);
  assert.match(fuelRoute, /No website scraping or historical dataset is presented as live/);
  assert.match(fuelRoute, /scrapingUsed: false/);
});

test('Victoria delayed feed can never be described as live fuel data', () => {
  assert.match(fuelRoute, /24-hour delayed government open-data feed/);
  const vicSource = providerFiles[4];
  assert.doesNotMatch(vicSource, /live:\s*true/);
});

test('BOM weather requires registered commercial mode and explicit licence confirmation', () => {
  assert.match(weatherRoute, /BOM_DATA_SERVICE_MODE === 'registered-commercial'/);
  assert.match(weatherRoute, /BOM_COMMERCIAL_LICENCE_CONFIRMED === 'true'/);
  assert.match(weatherRoute, /blocked-anonymous-non-commercial-endpoint/);
  assert.match(weatherRoute, /live: false/);
});

test('all credential-gated fuel adapters are server-side modules', () => {
  for (const source of providerFiles) {
    assert.doesNotMatch(source, /NEXT_PUBLIC_/);
  }
});
