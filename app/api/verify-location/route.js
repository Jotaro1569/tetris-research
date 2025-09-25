import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { selectedGroup, captchaToken } = await request.json();

    // Verify reCAPTCHA first
    if (!captchaToken) {
      return NextResponse.json({ error: 'CAPTCHA token is required' }, { status: 400 });
    }

    const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`
    });

    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success) {
      return NextResponse.json({
        error: 'CAPTCHA verification failed. Please try again.'
      }, { status: 400 });
    }

    // Get country from Vercel headers
    const country = request.headers.get('x-vercel-ip-country') || 'unknown';
    const city = request.headers.get('x-vercel-ip-city') || 'unknown';

    // Map selected group to allowed countries
    const allowedCountries = {
      'US': ['US'],
      'IN': ['IN'],
      'ID': ['ID'],
      'NL': ['NL']
    };

    const allowed = allowedCountries[selectedGroup]?.includes(country) || false;

    // Create response
    const response = NextResponse.json({
      allowed,
      userCountry: country,
      userCity: city,
      selectedGroup,
      message: allowed
        ? 'Access granted'
        : `You can only participate in the study group for your country. Your location: ${city}, ${country}`
    });

    // Set secure cookies if access is allowed
    if (allowed) {
      // Set verification cookie (expires in 24 hours)
      response.cookies.set('group-verified', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60, // 24 hours in seconds
        path: '/'
      });

      // Set allowed group cookie
      response.cookies.set('allowed-group', selectedGroup, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60, // 24 hours in seconds
        path: '/'
      });

      // Optional: Set user country for additional validation
      response.cookies.set('user-country', country, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60,
        path: '/'
      });
    }

    return response;

  } catch (error) {
    console.error('Location verification error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}