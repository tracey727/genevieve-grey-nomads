import { fetchConfiguredProvider, readCoordinate } from '../../../lib/liveProvider';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = readCoordinate(searchParams.get('lat'), -55, -8);
  const lon = readCoordinate(searchParams.get('lon'), 95, 169);
  const fuelType = String(searchParams.get('fuelType') || 'diesel').slice(0, 24);

  if (lat === null || lon === null) {
    return Response.json({ ok: false, message: 'A valid Australian location is required.' }, { status: 400 });
  }

  const result = await fetchConfiguredProvider({
    url: process.env.FUEL_PRICE_API_URL,
    apiKey: process.env.FUEL_PRICE_API_KEY,
    providerName: 'Verified fuel-price provider',
    params: { lat, lon, fuelType }
  });

  if (!result.ok) {
    return Response.json({
      ...result,
      live: false,
      coverage: 'Provider-dependent',
      fallback: 'Search nearby fuel stations in Maps and confirm the displayed pump price before relying on it.'
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
