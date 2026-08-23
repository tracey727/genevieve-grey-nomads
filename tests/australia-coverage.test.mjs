import test from 'node:test';
import assert from 'node:assert/strict';
import { AUSTRALIAN_POINTS, estimateBetweenPlaces } from '../lib/budget-engine.mjs';
import { AUSTRALIAN_JURISDICTIONS, inferAustralianJurisdiction } from '../lib/australia-coverage.mjs';

test('planning anchors include every Australian state and territory', () => {
  const names = Object.keys(AUSTRALIAN_POINTS);
  for (const code of ['QLD', 'NSW', 'ACT', 'VIC', 'TAS', 'SA', 'WA', 'NT']) {
    assert.ok(names.some((name) => name.endsWith(`, ${code}`)), `missing ${code}`);
  }
});

test('Tasmania is no longer missing from fallback trip planning', () => {
  const km = estimateBetweenPlaces('Hobart, TAS', 'Launceston, TAS');
  assert.ok(km > 100);
  assert.ok(km < 300);
});

test('jurisdiction inference covers representative locations in all eight jurisdictions', () => {
  const samples = [
    [-27.4698, 153.0251, 'QLD'],
    [-33.8688, 151.2093, 'NSW'],
    [-35.2809, 149.13, 'ACT'],
    [-37.8136, 144.9631, 'VIC'],
    [-42.8821, 147.3272, 'TAS'],
    [-34.9285, 138.6007, 'SA'],
    [-31.9523, 115.8613, 'WA'],
    [-12.4634, 130.8456, 'NT']
  ];
  for (const [lat, lon, code] of samples) assert.equal(inferAustralianJurisdiction(lat, lon)?.code, code);
});

test('manual jurisdiction list exposes eight state and territory fuel routes', () => {
  assert.deepEqual(Object.values(AUSTRALIAN_JURISDICTIONS).map((item) => item.code).sort(), ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA']);
});
