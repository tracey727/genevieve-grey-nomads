function configured() {
  return Boolean(process.env.VIC_SERVO_SAVER_API_URL && process.env.VIC_SERVO_SAVER_API_KEY);
}

function headers() {
  const headerName = String(process.env.VIC_SERVO_SAVER_API_KEY_HEADER || 'x-api-key').trim();
  return { Accept: 'application/json', [headerName]: process.env.VIC_SERVO_SAVER_API_KEY };
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

export async function getVictoriaServoSaverPrices({ lat, lon, fuelType = 'diesel' }) {
  if (!configured()) {
    return {
      ok: false,
      configured: false,
      available: false,
      live: false,
      delayed: true,
      dataDelayHours: 24,
      provider: 'Service Victoria Servo Saver Public API',
      message: 'Authorised Servo Saver Public API access is not configured for this deployment.'
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const endpoint = new URL(process.env.VIC_SERVO_SAVER_API_URL);
    endpoint.searchParams.set('lat', String(lat));
    endpoint.searchParams.set('lon', String(lon));
    endpoint.searchParams.set('fuelType', String(fuelType));

    const response = await fetch(endpoint, { headers: headers(), cache: 'no-store', signal: controller.signal });
    if (!response.ok) {
      return {
        ok: false,
        configured: true,
        available: false,
        live: false,
        delayed: true,
        dataDelayHours: 24,
        provider: 'Service Victoria Servo Saver Public API',
        message: 'Servo Saver Public API is temporarily unavailable. No fuel price has been shown.'
      };
    }

    const payload = await response.json();
    const prices = normalisePrices(payload, fuelType);
    if (!prices.length) {
      return {
        ok: false,
        configured: true,
        available: false,
        live: false,
        delayed: true,
        dataDelayHours: 24,
        provider: 'Service Victoria Servo Saver Public API',
        message: 'Servo Saver responded, but the returned price format has not yet passed GENEVIEVE validation.'
      };
    }

    return {
      ok: true,
      configured: true,
      available: true,
      live: false,
      delayed: true,
      dataDelayHours: 24,
      provider: 'Service Victoria Servo Saver Public API',
      attribution: 'Fuel price data: Service Victoria Servo Saver Public API',
      fetchedAt: new Date().toISOString(),
      prices
    };
  } catch {
    return {
      ok: false,
      configured: true,
      available: false,
      live: false,
      delayed: true,
      dataDelayHours: 24,
      provider: 'Service Victoria Servo Saver Public API',
      message: 'Servo Saver could not be reached. No fuel price has been shown.'
    };
  } finally {
    clearTimeout(timeout);
  }
}
