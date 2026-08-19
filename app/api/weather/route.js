import { fetchConfiguredProvider, readCoordinate } from '../../../lib/liveProvider';

function commercialBomConfigured() {
  return Boolean(
    process.env.BOM_WEATHER_API_URL &&
    process.env.BOM_WEATHER_API_KEY &&
    process.env.BOM_DATA_SERVICE_MODE === 'registered-commercial' &&
    process.env.BOM_COMMERCIAL_LICENCE_CONFIRMED === 'true'
  );
}

function looksLikeAnonymousBomFeed(url = '') {
  const value = String(url).toLowerCase();
  return value.includes('ftp.bom.gov.au/anon') ||
    value.includes('/anon/gen/') ||
    value.includes('reg.bom.gov.au/fwo/') ||
    value.includes('www.bom.gov.au/fwo/');
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = readCoordinate(searchParams.get('lat'), -55, -8);
  const lon = readCoordinate(searchParams.get('lon'), 95, 169);

  if (lat === null || lon === null) {
    return Response.json({ ok: false, message: 'A valid Australian location is required.' }, { status: 400 });
  }

  if (!commercialBomConfigured()) {
    return Response.json({
      ok: false,
      configured: false,
      live: false,
      provider: 'Bureau of Meteorology registered data service',
      coverage: 'Australia-wide',
      locationStored: false,
      commercialLicenceRequired: true,
      providerStatus: 'registered-commercial-service-required',
      reason: 'BOM anonymous automated forecast, warning and observation feeds are not licensed for commercial use. GENEVIEVE will only enable weather after a registered/licensed commercial data service is configured.',
      fallback: 'Open the Bureau of Meteorology for the latest official forecast and warnings.'
    }, { status: 200 });
  }

  if (looksLikeAnonymousBomFeed(process.env.BOM_WEATHER_API_URL)) {
    return Response.json({
      ok: false,
      configured: false,
      live: false,
      provider: 'Bureau of Meteorology registered data service',
      coverage: 'Australia-wide',
      locationStored: false,
      commercialLicenceRequired: true,
      providerStatus: 'blocked-anonymous-non-commercial-endpoint',
      reason: 'The configured BOM URL appears to be an anonymous/non-commercial feed and has been blocked from commercial live use.',
      fallback: 'Open the Bureau of Meteorology for the latest official forecast and warnings.'
    }, { status: 200 });
  }

  const result = await fetchConfiguredProvider({
    url: process.env.BOM_WEATHER_API_URL,
    apiKey: process.env.BOM_WEATHER_API_KEY,
    providerName: 'Bureau of Meteorology registered commercial weather service',
    params: { lat, lon }
  });

  if (!result.ok) {
    return Response.json({
      ...result,
      live: false,
      coverage: 'Australia-wide',
      locationStored: false,
      commercialLicenceRequired: true,
      providerStatus: 'licensed-provider-unavailable-or-unvalidated',
      fallback: 'Open the Bureau of Meteorology for the latest official forecast and warnings.'
    }, { status: result.configured ? 503 : 200 });
  }

  return Response.json({
    ok: true,
    live: true,
    provider: result.provider,
    coverage: 'Australia-wide',
    locationStored: false,
    commercialLicenceRequired: true,
    providerStatus: 'registered-commercial-service-active',
    fetchedAt: new Date().toISOString(),
    data: result.data
  });
}
