// Stateless account authentication for Budget Traveller.
//
// Sessions are signed bearer tokens (not server-side session storage), so
// verifying a request is a single HMAC check with no shared state to
// contend on — this is what lets the app scale to many thousands of
// concurrent sign-ins/sign-outs across Cloudflare's distributed edge
// without a session-store bottleneck. The client stores the token itself
// (mirroring how deviceId is already handled in this codebase) and sends
// it back as `Authorization: Bearer <token>`.

const PBKDF2_ITERATIONS = 120_000;
const HASH_ALGORITHM = 'SHA-256';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const encoder = new TextEncoder();

function toBase64Url(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a[i] ^ b[i];
  return diff === 0;
}

export function isValidEmail(value) {
  return typeof value === 'string' && value.length <= 254 && EMAIL_RE.test(value.trim());
}

export function isValidPassword(value) {
  return typeof value === 'string' && value.length >= 10 && value.length <= 200;
}

export function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase().slice(0, 254);
}

export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: HASH_ALGORITHM },
    key,
    256
  );
  return `pbkdf2$${PBKDF2_ITERATIONS}$${toBase64Url(salt)}$${toBase64Url(new Uint8Array(bits))}`;
}

export async function verifyPassword(password, stored) {
  if (typeof stored !== 'string') return false;
  const parts = stored.split('$');
  if (parts.length !== 4 || parts[0] !== 'pbkdf2') return false;
  const iterations = Number(parts[1]);
  if (!Number.isFinite(iterations) || iterations <= 0) return false;
  const salt = fromBase64Url(parts[2]);
  const expected = fromBase64Url(parts[3]);
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations, hash: HASH_ALGORITHM },
    key,
    expected.length * 8
  );
  return timingSafeEqual(new Uint8Array(bits), expected);
}

async function hmac(secret, data) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: HASH_ALGORITHM }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return new Uint8Array(signature);
}

export async function createSessionToken(claims, secret, ttlSeconds = SESSION_TTL_SECONDS) {
  const payload = { ...claims, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + ttlSeconds };
  const payloadPart = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const signature = await hmac(secret, payloadPart);
  return `${payloadPart}.${toBase64Url(signature)}`;
}

export async function verifySessionToken(token, secret) {
  if (typeof token !== 'string' || !token.includes('.')) return null;
  const [payloadPart, signaturePart] = token.split('.');
  if (!payloadPart || !signaturePart) return null;
  const expectedSignature = await hmac(secret, payloadPart);
  let providedSignature;
  try {
    providedSignature = fromBase64Url(signaturePart);
  } catch {
    return null;
  }
  if (!timingSafeEqual(expectedSignature, providedSignature)) return null;
  let payload;
  try {
    payload = JSON.parse(new TextDecoder().decode(fromBase64Url(payloadPart)));
  } catch {
    return null;
  }
  if (!payload || typeof payload.exp !== 'number' || payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}

export function bearerTokenFrom(request) {
  const header = request.headers.get('authorization') || '';
  const match = /^Bearer\s+(.+)$/i.exec(header.trim());
  return match ? match[1].trim() : null;
}

export async function requireSession(request, secret) {
  if (!secret) return null;
  const token = bearerTokenFrom(request);
  if (!token) return null;
  return verifySessionToken(token, secret);
}
