import { getSql } from '../../../../lib/db';
import { hashPassword, isValidEmail, isValidPassword, normalizeEmail, createSessionToken } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';
const bad = (message, status = 400) => Response.json({ error: message }, { status });

export async function POST(request) {
  const sql = getSql();
  const secret = process.env.SESSION_SECRET;
  if (!sql || !secret) return bad('Accounts are not enabled yet.', 503);

  let body;
  try {
    const contentLength = Number(request.headers.get('content-length') || 0);
    if (contentLength > 5_000) return bad('Request is too large.', 413);
    body = await request.json();
  } catch {
    return bad('Invalid request body.');
  }

  const email = normalizeEmail(body?.email);
  const password = String(body?.password ?? '');
  if (!isValidEmail(email)) return bad('Enter a valid email address.');
  if (!isValidPassword(password)) return bad('Password must be at least 10 characters.');

  try {
    const existing = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`;
    if (existing.length) return bad('An account with that email already exists.', 409);

    const publicId = crypto.randomUUID();
    const passwordHash = await hashPassword(password);
    const rows = await sql`
      INSERT INTO users (public_id, email, password_hash, last_login_at)
      VALUES (${publicId}::uuid, ${email}, ${passwordHash}, now())
      RETURNING public_id, email, created_at
    `;
    const user = rows[0];
    const token = await createSessionToken({ sub: user.public_id, email: user.email }, secret);
    return Response.json({ token, user: { publicId: user.public_id, email: user.email } }, { status: 201 });
  } catch {
    return bad('Account could not be created.', 503);
  }
}
