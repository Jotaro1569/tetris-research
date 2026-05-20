import { NextResponse } from 'next/server';
import { SESSION_COOKIE, signSession } from '../../../lib/security';

const allowedCountries = {
  US: ['US'],
  IN: ['IN'],
  ID: ['ID'],
  NL: ['NL']
};

const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 10;

function getClientIp(request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
}

function isRateLimited(key) {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

function getAllowedOrigins(request) {
  const origins = new Set([new URL(request.url).origin]);

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    origins.add(process.env.NEXT_PUBLIC_SITE_URL);
  }

  if (process.env.VERCEL_URL) {
    origins.add(`https://${process.env.VERCEL_URL}`);
  }

  return origins;
}

function hasValidOrigin(request) {
  const origin = request.headers.get('origin');
  if (!origin) return process.env.NODE_ENV !== 'production';
  return getAllowedOrigins(request).has(origin);
}

function isFreshChallenge(challengeTs) {
  if (!challengeTs) return false;
  return Date.now() - new Date(challengeTs).getTime() <= 2 * 60 * 1000;
}

export async function POST(request) {
  try {
    if (!hasValidOrigin(request)) {
      return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 });
    }

    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const { selectedGroup, captchaToken } = await request.json();
    const normalizedGroup = String(selectedGroup || '').toUpperCase();

    if (!allowedCountries[normalizedGroup]) {
      return NextResponse.json({ error: 'Invalid participant group' }, { status: 400 });
    }

    // Verify reCAPTCHA first
    if (!captchaToken) {
      return NextResponse.json({ error: 'CAPTCHA token is required' }, { status: 400 });
    }

    if (!process.env.RECAPTCHA_SECRET_KEY || !process.env.SESSION_SIGNING_SECRET) {
      return NextResponse.json({ error: 'Server verification is not configured' }, { status: 500 });
    }

    const recaptchaBody = new URLSearchParams({
      secret: process.env.RECAPTCHA_SECRET_KEY,
      response: captchaToken,
      remoteip: ip
    });

    const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: recaptchaBody
    });

    const recaptchaData = await recaptchaResponse.json();
    const allowedHosts = (process.env.RECAPTCHA_ALLOWED_HOSTNAMES || new URL(request.url).hostname)
      .split(',')
      .map((host) => host.trim())
      .filter(Boolean);

    if (!recaptchaData.success || !allowedHosts.includes(recaptchaData.hostname) || !isFreshChallenge(recaptchaData.challenge_ts)) {
      return NextResponse.json({
        error: 'CAPTCHA verification failed. Please try again.'
      }, { status: 400 });
    }

    // Get country from Vercel headers
    const country = request.headers.get('x-vercel-ip-country') || 'unknown';

    const allowed = allowedCountries[normalizedGroup].includes(country);

    // Create response
    const response = NextResponse.json({
      allowed,
      selectedGroup: normalizedGroup,
      message: allowed
        ? 'Access granted'
        : 'You can only participate in the study group for your country.'
    });
    response.headers.set('Cache-Control', 'no-store');

    // Set secure cookies if access is allowed
    if (allowed) {
      const maxAge = 10 * 60;
      const sessionToken = await signSession({
        v: 1,
        group: normalizedGroup,
        country,
        iat: Date.now(),
        exp: Date.now() + maxAge * 1000
      });

      response.cookies.set(SESSION_COOKIE, sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge,
        path: '/'
      });
    }

    return response;

  } catch (error) {
    console.error('Location verification error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
