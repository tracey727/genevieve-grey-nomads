import { getSql } from '../../../lib/db';

export const dynamic = 'force-dynamic';

// Safe, product-specific liveness marker for the ON TRACK control plane.
// Never expose connection strings, tenant data, journey details or credentials.
const identity = { service: 'genevieve-grey-nomads', mode: 'standalone-traveller-app' };

export async function GET() {
  const sql = getSql();
  if (!sql) return Response.json({ ...identity, ok: true, database: 'not-configured' });
  try {
    await sql`SELECT 1 AS ok`;
    return Response.json({ ...identity, ok: true, database: 'connected' });
  } catch {
    return Response.json({ ...identity, ok: false, database: 'unavailable' }, { status: 503 });
  }
}
