import { getSql } from '../../../../lib/db';
import { verifyPassword, isValidEmail, normalizeEmail, createSessionToken } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';
const bad = (message, status = 400) => Response.json({ error: message }, { status });
// Deliberately identical wording for "no such account" and "wrong password"
// so a login attempt cannot be used to enumerate registered email addresses.
const INVALID_CREDENTIALS = 'Incorrect email or password.';

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
  if (!isValidEmail(email) || !password) return bad(INVALID_CREDENTIALS, 401);

  try {
    const rows = await sql`SELECT public_id, email, password_hash FROM users WHERE email = ${email} LIMIT 1`;
    const user = rows[0];
    if (!user || !(await verifyPassword(password, user.password_hash))) return bad(INVALID_CREDENTIALS, 401);

    await sql`UPDATE users SET last_login_at = now() WHERE public_id = ${user.public_id}::uuid`;
    const token = await createSessionToken({ sub: user.public_id, email: user.email }, secret);
    return Response.json({ token, user: { publicId: user.public_id, email: user.email } });
  } catch {
    return bad('Sign-in is temporarily unavailable.', 503);
  }
}
