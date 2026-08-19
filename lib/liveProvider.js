const TIMEOUT_MS = 8000;

export function readCoordinate(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) return null;
  return number;
}

export async function fetchConfiguredProvider({ url, apiKey, params = {}, providerName }) {
  if (!url) {
    return {
      ok: false,
      configured: false,
      provider: providerName,
      message: `${providerName} is not configured for this deployment.`
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const endpoint = new URL(url);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') endpoint.searchParams.set(key, String(value));
    });
    const response = await fetch(endpoint, {
      headers: {
        Accept: 'application/json',
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
      },
      cache: 'no-store',
      signal: controller.signal
    });
    if (!response.ok) {
      return {
        ok: false,
        configured: true,
        provider: providerName,
        message: `${providerName} is temporarily unavailable.`
      };
    }
    const data = await response.json();
    return { ok: true, configured: true, provider: providerName, data };
  } catch {
    return {
      ok: false,
      configured: true,
      provider: providerName,
      message: `${providerName} could not be reached. No live data has been shown.`
    };
  } finally {
    clearTimeout(timeout);
  }
}
