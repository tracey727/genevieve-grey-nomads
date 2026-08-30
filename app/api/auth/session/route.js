import { requireSession } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return Response.json({ user: null }, { status: 503 });
  const session = await requireSession(request, secret);
  if (!session) return Response.json({ user: null }, { status: 401 });
  return Response.json({ user: { publicId: session.sub, email: session.email } });
}
