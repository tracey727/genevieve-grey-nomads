import { fetchConfiguredProvider, readCoordinate } from '../../../lib/liveProvider';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = readCoordinate(searchParams.get('lat'), -55, -8);
  const lon = readCoordinate(searchParams.get('lon'), 95, 169);

  if (lat === null || lon === null) {
    return Response.json({ ok: false, message: 'A valid Australian location is required.' }, { status: 400 });
  }

  const result = await fetchConfiguredProvider({
    url: process.env.BOM_WEATHER_API_URL,
    apiKey: process.env.BOM_WEATHER_API_KEY,
    providerName: 'Bureau of Meteorology national weather provider',
    params: { lat, lon }
  });

  if (!result.ok) {
    return Response.json({
      ...result,
      live: false,
      coverage: 'Australia-wide provider required',
      reason: 'The older Dog Park feed only covered selected Queensland stations and is intentionally not reused as national weather.',
      fallback: 'Open the Bureau of Meteorology for the latest official forecast and warnings.'
    }, { status: result.configured ? 503 : 200 });
  }

  return Response.json({
    ok: true,
    live: true,
    provider: result.provider,
    locationStored: false,
    fetchedAt: new Date().toISOString(),
    data: result.data
  });
}
