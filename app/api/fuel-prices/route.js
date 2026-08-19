import { fetchConfiguredProvider, readCoordinate } from '../../../lib/liveProvider';
import { getWaFuelWatchPrices } from '../../../lib/providers/fuelwatchWa';
import { getNswTasFuelCheckPrices } from '../../../lib/providers/fuelcheckNswTas';
import { getQueenslandFuelPrices } from '../../../lib/providers/fuelPricesQld';
import { getSouthAustraliaFuelPrices } from '../../../lib/providers/fuelPricesSa';

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

  if (provider === 'nsw' || provider === 'tas' || provider === 'fuelcheck') {
    const result = await getNswTasFuelCheckPrices({ lat, lon, fuelType });
    return Response.json({
      ...result,
      locationStored: false,
      coverage: 'New South Wales and Tasmania',
      fallback: result.live ? undefined : 'Search nearby fuel stations in Maps and confirm the pump price.'
    }, { status: result.configured ? 200 : 503 });
  }

  if (provider === 'qld' || provider === 'queensland') {
    const result = await getQueenslandFuelPrices({ lat, lon, fuelType });
    return Response.json({
      ...result,
      locationStored: false,
      coverage: 'Queensland',
      fallback: result.live ? undefined : 'Search nearby fuel stations in Maps and confirm the pump price.'
    }, { status: result.configured ? 200 : 503 });
  }

  if (provider === 'sa' || provider === 'south-australia') {
    const result = await getSouthAustraliaFuelPrices({ lat, lon, fuelType });
    return Response.json({
      ...result,
      locationStored: false,
      coverage: 'South Australia',
      fallback: result.live ? undefined : 'Search nearby fuel stations in Maps and confirm the pump price.'
    }, { status: result.configured ? 200 : 503 });
  }

  if (provider === 'nt' || provider === 'northern-territory' || provider === 'myfuel-nt') {
    return Response.json({
      ok: false,
      configured: false,
      live: false,
      provider: 'MyFuel NT',
      coverage: 'Northern Territory',
      locationStored: false,
      scrapingUsed: false,
      message: 'MyFuel NT publishes real-time consumer prices, but GENEVIEVE has not verified an approved third-party real-time API contract. No website scraping or historical dataset is presented as live.',
      fallback: 'Use the official MyFuel NT service or search nearby fuel stations in Maps and confirm the pump price.'
    }, { status: 200 });
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
        wa: 'official-adapter-verified',
        nswTas: process.env.NSW_FUELCHECK_CLIENT_ID && process.env.NSW_FUELCHECK_CLIENT_SECRET && process.env.NSW_FUELCHECK_TOKEN_URL && process.env.NSW_FUELCHECK_NEARBY_URL ? 'credentials-and-endpoints-present' : 'official-account-or-endpoints-required',
        qld: process.env.QLD_FUEL_API_URL && process.env.QLD_FUEL_API_KEY ? 'credentials-and-endpoint-present' : 'developer-signup-required',
        sa: process.env.SA_FUEL_API_URL && process.env.SA_FUEL_API_KEY ? 'publisher-access-present' : 'data-publisher-registration-required',
        nt: 'consumer-live-service-verified-third-party-api-not-verified',
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
