import { getSql } from '../../../lib/db';

export const dynamic = 'force-dynamic';
const bad = (message, status = 400) => Response.json({ error: message }, { status });
const safeText = (value, max = 120) => String(value ?? '').trim().slice(0, max);
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(request) {
  const sql = getSql();
  if (!sql) return bad('Trip storage is not configured.', 503);
  const { searchParams } = new URL(request.url);
  const deviceId = safeText(searchParams.get('deviceId'), 80);
  if (deviceId.length < 16) return bad('A valid device ID is required.');
  try {
    const trips = await sql`
      SELECT public_id, name, origin, destination, total_budget, route_distance_km, status, updated_at
      FROM trips
      WHERE device_id = ${deviceId}
      ORDER BY updated_at DESC, id DESC
      LIMIT 30
    `;
    return Response.json({ trips });
  } catch {
    return bad('Trip storage is temporarily unavailable.', 503);
  }
}

export async function POST(request) {
  const sql = getSql();
  if (!sql) return bad('Trip storage is not configured.', 503);
  let body;
  try {
    const contentLength = Number(request.headers.get('content-length') || 0);
    if (contentLength > 100_000) return bad('Request is too large.', 413);
    body = await request.json();
  } catch {
    return bad('Invalid JSON body.');
  }
  const deviceId = safeText(body.deviceId, 80);
  const name = safeText(body.name, 120);
  const plan = body.plan && typeof body.plan === 'object' ? body.plan : null;
  if (deviceId.length < 16 || !name || !plan) return bad('Device ID, name and plan are required.');
  const origin = safeText(plan.origin, 120);
  const destination = safeText(plan.destination, 120);
  const totalBudget = Number(plan.result?.totalBudget || plan.totalBudget || 0);
  const routeDistanceKm = Number(plan.result?.totalDistanceKm || plan.routeDistanceKm || 0);
  const planStatus = safeText(plan.result?.status || 'planned', 24);
  const publicId = crypto.randomUUID();
  try {
    const rows = await sql`
      INSERT INTO trips (public_id, device_id, name, origin, destination, total_budget, route_distance_km, status, plan)
      VALUES (${publicId}::uuid, ${deviceId}, ${name}, ${origin}, ${destination}, ${totalBudget}, ${routeDistanceKm}, ${planStatus}, ${JSON.stringify(plan)}::jsonb)
      RETURNING public_id, name, updated_at
    `;
    return Response.json({ trip: rows[0] }, { status: 201 });
  } catch {
    return bad('Trip could not be saved.', 503);
  }
}

export async function DELETE(request) {
  const sql = getSql();
  if (!sql) return bad('Trip storage is not configured.', 503);
  const { searchParams } = new URL(request.url);
  const deviceId = safeText(searchParams.get('deviceId'), 80);
  const tripId = safeText(searchParams.get('tripId'), 64);
  if (deviceId.length < 16) return bad('A valid device ID is required.');
  if (!uuidPattern.test(tripId)) return bad('A valid trip ID is required.');
  try {
    const rows = await sql`
      DELETE FROM trips
      WHERE device_id = ${deviceId} AND public_id = ${tripId}::uuid
      RETURNING public_id
    `;
    if (!rows.length) return bad('Journey not found.', 404);
    return Response.json({ ok: true, deletedTripId: rows[0].public_id });
  } catch {
    return bad('Journey could not be deleted.', 503);
  }
}
