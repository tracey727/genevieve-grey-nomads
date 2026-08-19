function configured() {
  return Boolean(
    process.env.NSW_FUELCHECK_CLIENT_ID &&
    process.env.NSW_FUELCHECK_CLIENT_SECRET &&
    process.env.NSW_FUELCHECK_TOKEN_URL &&
    process.env.NSW_FUELCHECK_NEARBY_URL
  );
}

async function fetchWithTimeout(url, init = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, cache: 'no-store', signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function getAccessToken() {
  if (!configured()) return null;

  const body = new URLSearchParams({ grant_type: 'client_credentials' });
  const basic = Buffer.from(`${process.env.NSW_FUELCHECK_CLIENT_ID}:${process.env.NSW_FUELCHECK_CLIENT_SECRET}`).toString('base64');

  const response = await fetchWithTimeout(process.env.NSW_FUELCHECK_TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json'
    },
    body
  });

  if (!response.ok) return null;
  const payload = await response.json();
  return payload.access_token || payload.token || null;
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

export async function getNswTasFuelCheckPrices({ lat, lon, fuelType = 'diesel' }) {
  if (!configured()) {
    return {
      ok: false,
      configured: false,
      live: false,
      provider: 'FuelCheck NSW/Tasmania',
      message: 'Official FuelCheck credentials and endpoint URLs are not configured for this deployment.'
    };
  }

  try {
    const token = await getAccessToken();
    if (!token) {
      return {
        ok: false,
        configured: true,
        live: false,
        provider: 'FuelCheck NSW/Tasmania',
        message: 'FuelCheck authentication failed. No fuel price has been shown.'
      };
    }

    const endpoint = new URL(process.env.NSW_FUELCHECK_NEARBY_URL);
    endpoint.searchParams.set('lat', String(lat));
    endpoint.searchParams.set('lon', String(lon));
    endpoint.searchParams.set('fuelType', String(fuelType));

    const response = await fetchWithTimeout(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      return {
        ok: false,
        configured: true,
        live: false,
        provider: 'FuelCheck NSW/Tasmania',
        message: 'FuelCheck is temporarily unavailable. No fuel price has been shown.'
      };
    }

    const payload = await response.json();
    const prices = normalisePrices(payload, fuelType);
    if (!prices.length) {
      return {
        ok: false,
        configured: true,
        live: false,
        provider: 'FuelCheck NSW/Tasmania',
        message: 'FuelCheck responded, but its returned price format has not yet passed GENEVIEVE validation.'
      };
    }

    return {
      ok: true,
      configured: true,
      live: true,
      provider: 'FuelCheck NSW/Tasmania',
      attribution: 'FuelCheck, NSW Government',
      fetchedAt: new Date().toISOString(),
      prices
    };
  } catch {
    return {
      ok: false,
      configured: true,
      live: false,
      provider: 'FuelCheck NSW/Tasmania',
      message: 'FuelCheck could not be reached. No fuel price has been shown.'
    };
  }
}
