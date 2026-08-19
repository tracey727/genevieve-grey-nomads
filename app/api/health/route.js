import { getSql } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const sql = getSql();
  if (!sql) return Response.json({ ok: true, database: 'not-configured' });
  try {
    await sql`SELECT 1 AS ok`;
    return Response.json({ ok: true, database: 'connected' });
  } catch {
    return Response.json({ ok: false, database: 'unavailable' }, { status: 503 });
  }
}
