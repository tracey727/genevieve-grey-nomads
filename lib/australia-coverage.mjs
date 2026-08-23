export const AUSTRALIAN_JURISDICTIONS = Object.freeze({
  qld: Object.freeze({ code: 'QLD', name: 'Queensland', fuelProvider: 'qld' }),
  nsw: Object.freeze({ code: 'NSW', name: 'New South Wales', fuelProvider: 'nsw' }),
  act: Object.freeze({ code: 'ACT', name: 'Australian Capital Territory', fuelProvider: 'act' }),
  vic: Object.freeze({ code: 'VIC', name: 'Victoria', fuelProvider: 'vic' }),
  tas: Object.freeze({ code: 'TAS', name: 'Tasmania', fuelProvider: 'tas' }),
  sa: Object.freeze({ code: 'SA', name: 'South Australia', fuelProvider: 'sa' }),
  wa: Object.freeze({ code: 'WA', name: 'Western Australia', fuelProvider: 'wa' }),
  nt: Object.freeze({ code: 'NT', name: 'Northern Territory', fuelProvider: 'nt' })
});

export const AUSTRALIAN_JURISDICTION_OPTIONS = Object.freeze(
  Object.entries(AUSTRALIAN_JURISDICTIONS).map(([key, value]) => Object.freeze({ key, ...value }))
);

function finiteCoordinate(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function nswVicBorderLatitude(lon) {
  if (lon <= 141) return -34.0;
  if (lon <= 148) return -34.0 - ((lon - 141) / 7) * 2.0;
  if (lon <= 150.1) return -36.0 - ((lon - 148) / 2.1) * 1.5;
  return -37.5;
}

function qldNswBorderLatitude(lon) {
  if (lon <= 141) return -29.0;
  if (lon >= 153.55) return -28.16;
  return -29.0 + ((lon - 141) / 12.55) * 0.84;
}

export function inferAustralianJurisdiction(latValue, lonValue) {
  const lat = finiteCoordinate(latValue);
  const lon = finiteCoordinate(lonValue);
  if (lat === null || lon === null || lat < -55 || lat > -8 || lon < 95 || lon > 169) return null;

  // Tasmania is geographically distinct and can be detected with high confidence.
  if (lat <= -39.0 && lon >= 143.5 && lon <= 149.0) return AUSTRALIAN_JURISDICTIONS.tas;

  // ACT is intentionally checked before NSW because it sits inside NSW.
  if (lat >= -35.95 && lat <= -35.1 && lon >= 148.7 && lon <= 149.45) return AUSTRALIAN_JURISDICTIONS.act;

  // Straight western and central state/territory borders provide reliable first cuts.
  if (lon < 129.0) return AUSTRALIAN_JURISDICTIONS.wa;
  if (lon < 138.0 && lat > -26.0) return AUSTRALIAN_JURISDICTIONS.nt;
  if (lon < 141.0 && lat <= -26.0) return AUSTRALIAN_JURISDICTIONS.sa;

  // Queensland/NSW and NSW/Victoria borders are simplified only for provider selection.
  // The UI always permits a manual state/territory override for border communities.
  if (lon >= 138.0 && lat > qldNswBorderLatitude(lon)) return AUSTRALIAN_JURISDICTIONS.qld;
  if (lon >= 141.0 && lat < nswVicBorderLatitude(lon)) return AUSTRALIAN_JURISDICTIONS.vic;
  if (lon >= 141.0) return AUSTRALIAN_JURISDICTIONS.nsw;

  return null;
}

export function jurisdictionByKey(key) {
  return AUSTRALIAN_JURISDICTIONS[String(key || '').toLowerCase()] || null;
}
