import crypto from 'crypto';

const COOKIE_NAME = 'app_session';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function base64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
}

function sign(data, secret) {
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
}

export function createSessionValue(payload) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET missing');

  const json = JSON.stringify(payload);
  const data = base64url(json);
  const sig = sign(data, secret);
  return `${data}.${sig}`;
}

// Parse and validate a session token produced by `createSessionValue`
export function parseSessionValue(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [data, sig] = parts;
  const secret = process.env.SESSION_SECRET;
  if (!secret) return null;
  const expected = sign(data, secret);

  try {
    const a = Buffer.from(sig, 'hex');
    const b = Buffer.from(expected, 'hex');
    if (a.length !== b.length) return null;
    // timing safe comparison
    if (!crypto.timingSafeEqual(a, b)) return null;
  } catch (e) {
    return null;
  }

  try {
    const json = Buffer.from(
      data.replaceAll('-', '+').replaceAll('_', '/'),
      'base64'
    ).toString();
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

export function cookieOptions() {
  return {
    name: COOKIE_NAME,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  };
}
