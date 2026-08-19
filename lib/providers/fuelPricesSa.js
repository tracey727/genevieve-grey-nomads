function configured() {
  return Boolean(process.env.SA_FUEL_API_URL && process.env.SA_FUEL_API_KEY);
}

function buildHeaders() {
  const headerName = String(process.env.SA_FUEL_API_KEY_HEADER || 'Authorization').trim();
  const prefix = String(process.env.SA_FUEL_API_KEY_PREFIX || 'Bearer').trim();
  const key = process.env.SA_FUEL_API_KEY;
  const value = headerName.toLowerCase() === 'authorization' && prefix ? `${prefix} ${key}` : key;
  return { Accept: 'application/json', [headerName]: value };
}

function normalisePrices(payload, fuelType) {
  const candidates = Array.isArray(payload)
    ? payload
    : payload?.prices || payload?.stations || payload?.results || payload?.data || [];
  if (!Array.isArray(candidates)) return [];

  return candidates.map((item) => {
    const rawPrice = item.price ?? item.priceCentsPerLitre ?? item.price_cents_per_litre;
    const price = Number(rawPrice);
    return {
      station: item.station || item.name || item.serviceStation || item.tradingName || '',
      brand: item.brand || '',
      address: item.address || item.addressLine || '',
      suburb: item.suburb || item.location || '',
      latitude: Number(item.latitude ?? item.lat) || null,
      longitude: Number(item.longitude ?? item.lng ?? item.lon) || null,
      fuelType: item.fuelType || item.product || fuelType,
      priceCentsPerLitre: Number.isFinite(price) ? price : null
    };
  }).filter((item) => Number.isFinite(item.priceCentsPerLitre));
}

export async function getSouthAustraliaFuelPrices({ lat, lon, fuelType = 'diesel' }) {
  if (!configured()) {
    return {
      ok: false,
      configured: false,
      live: false,
      provider: 'SA Fuel Pricing Information Scheme',
      message: 'South Australia data-publisher API access is not configured for this deployment.'
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const endpoint = new URL(process.env.SA_FUEL_API_URL);
    endpoint.searchParams.set('lat', String(lat));
    endpoint.searchParams.set('lon', String(lon));
    endpoint.searchParams.set('fuelType', String(fuelType));

    const response = await fetch(endpoint, {
      headers: buildHeaders(),
      cache: 'no-store',
      signal: controller.signal
    });

    if (!response.ok) {
      return {
        ok: false,
        configured: true,
        live: false,
        provider: 'SA Fuel Pricing Information Scheme',
        message: 'South Australia fuel-price service is temporarily unavailable. No fuel price has been shown.'
      };
    }

    const payload = await response.json();
    const prices = normalisePrices(payload, fuelType);
    if (!prices.length) {
      return {
        ok: false,
        configured: true,
        live: false,
        provider: 'SA Fuel Pricing Information Scheme',
        message: 'South Australia fuel-price service responded, but the returned format has not yet passed GENEVIEVE validation.'
      };
    }

    return {
      ok: true,
      configured: true,
      live: true,
      provider: 'SA Fuel Pricing Information Scheme',
      attribution: 'South Australian Government fuel pricing information scheme',
      fetchedAt: new Date().toISOString(),
      prices
    };
  } catch {
    return {
      ok: false,
      configured: true,
      live: false,
      provider: 'SA Fuel Pricing Information Scheme',
      message: 'South Australia fuel-price service could not be reached. No fuel price has been shown.'
    };
  } finally {
    clearTimeout(timeout);
  }
}
