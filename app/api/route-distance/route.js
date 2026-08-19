import { NextResponse } from 'next/server';

const ORS_BASE = 'https://api.openrouteservice.org';
const TIMEOUT_MS = 15000;

function clean(value, max = 180) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, max);
}

async function providerJson(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal, cache: 'no-store' });
    const payload = await response.json().catch(() => null);
    if (!response.ok) throw new Error(payload?.error?.message || payload?.message || `Provider HTTP ${response.status}`);
    return payload;
  } finally {
    clearTimeout(timer);
  }
}

async function geocode(place, apiKey) {
  const url = new URL(`${ORS_BASE}/geocode/search`);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('text', place);
  url.searchParams.set('boundary.country', 'AU');
  url.searchParams.set('size', '1');
  const payload = await providerJson(url);
  const feature = payload?.features?.[0];
  const coordinates = feature?.geometry?.coordinates;
  if (!Array.isArray(coordinates) || coordinates.length < 2) throw new Error(`Could not verify ${place} as an Australian road location.`);
  return coordinates.map(Number);
}

export async function POST(request) {
  try {
    const apiKey = clean(process.env.OPENROUTESERVICE_API_KEY, 300);
    if (!apiKey) return NextResponse.json({ ok: false, configured: false, message: 'Live road distance is not configured.' }, { status: 503 });

    const body = await request.json();
    const origin = clean(body?.origin);
    const destination = clean(body?.destination);
    if (!origin || !destination) return NextResponse.json({ ok: false, message: 'Enter both a start and destination.' }, { status: 422 });

    const [from, to] = await Promise.all([geocode(origin, apiKey), geocode(destination, apiKey)]);
    const payload = await providerJson(`${ORS_BASE}/v2/directions/driving-car/geojson`, {
      method: 'POST',
      headers: { Authorization: apiKey, 'Content-Type': 'application/json', Accept: 'application/geo+json, application/json' },
      body: JSON.stringify({ coordinates: [from, to], preference: 'recommended', instructions: false, elevation: false })
    });
    const summary = payload?.features?.[0]?.properties?.summary;
    const distanceM = Number(summary?.distance);
    const durationS = Number(summary?.duration);
    if (!Number.isFinite(distanceM) || !Number.isFinite(durationS)) throw new Error('The routing provider returned an incomplete route.');

    return NextResponse.json({
      ok: true,
      configured: true,
      roadDistanceKm: Math.round(distanceM / 1000),
      driveHours: Math.round((durationS / 3600) * 10) / 10,
      source: 'openrouteservice',
      attribution: 'Routing by openrouteservice.org · Map data © OpenStreetMap contributors'
    });
  } catch (error) {
    const message = error?.name === 'AbortError' ? 'Live road distance timed out.' : clean(error?.message || 'Live road distance is temporarily unavailable.', 220);
    return NextResponse.json({ ok: false, configured: true, message }, { status: 502 });
  }
}
