const SESSION_COOKIE = 'survey-session';

function base64UrlEncode(value) {
  return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlDecode(value) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  return atob(padded);
}

function getSessionSecret() {
  return process.env.SESSION_SIGNING_SECRET || '';
}

async function hmac(payload, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)));
}

export async function signSession(claims) {
  const secret = getSessionSecret();
  if (!secret) throw new Error('SESSION_SIGNING_SECRET is required');

  const payload = base64UrlEncode(JSON.stringify(claims));
  const signature = await hmac(payload, secret);
  return `${payload}.${signature}`;
}

export async function verifySession(token) {
  const secret = getSessionSecret();
  if (!secret || !token || !token.includes('.')) return null;

  const [payload, signature] = token.split('.');
  const expected = await hmac(payload, secret);
  if (signature !== expected) return null;

  try {
    const claims = JSON.parse(base64UrlDecode(payload));
    if (!claims.exp || Date.now() > claims.exp) return null;
    return claims;
  } catch {
    return null;
  }
}

export { SESSION_COOKIE };
