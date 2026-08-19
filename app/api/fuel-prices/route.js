import { fetchConfiguredProvider, readCoordinate } from '../../../lib/liveProvider';
import { getWaFuelWatchPrices } from '../../../lib/providers/fuelwatchWa';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = readCoordinate(searchParams.get('lat'), -55, -8);
  const lon = readCoordinate(searchParams.get('lon'), 95, 169);
  const fuelType = String(searchParams.get('fuelType') || 'diesel').slice(0, 24);
  const provider = String(searchParams.get('provider') || '').toLowerCase();
  const suburb = String(searchParams.get('suburb') || '').trim().slice(0, 80);

  if (provider === 'wa' || provider === 'fuelwatch') {
    const result = await getWaFuelWatchPrices({ suburb, fuelType });
    return Response.json({
      ...result,
      locationStored: false,
      coverage: 'Western Australia',
      fallback: result.live ? undefined : 'Open FuelWatch or search nearby fuel stations in Maps and confirm the pump price.'
    }, { status: result.configured ? 200 : 503 });
  }

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
      providerStatus: {
        wa: 'official-adapter-ready',
        nswTas: process.env.NSW_FUELCHECK_CLIENT_ID && process.env.NSW_FUELCHECK_CLIENT_SECRET ? 'credentials-present' : 'official-account-required',
        qld: process.env.QLD_FUEL_API_URL && process.env.QLD_FUEL_API_KEY ? 'credentials-present' : 'developer-signup-required',
        vic: process.env.VIC_SERVO_SAVER_API_URL && process.env.VIC_SERVO_SAVER_API_KEY ? 'credentials-present' : 'authorised-api-access-required'
      },
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
