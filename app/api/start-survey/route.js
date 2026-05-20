import { NextResponse } from 'next/server';
import { SESSION_COOKIE, verifySession } from '../../../lib/security';

function getSurveyUrl(group) {
  return {
    US: process.env.SURVEY_URL_US,
    NL: process.env.SURVEY_URL_NL
  }[group];
}

export async function GET(request) {
  const url = new URL(request.url);
  const requestedGroup = String(url.searchParams.get('group') || '').toUpperCase();
  const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);

  if (!session?.group || session.group !== requestedGroup) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const surveyUrl = getSurveyUrl(requestedGroup);
  if (!surveyUrl) {
    return NextResponse.json({ error: 'Survey is not configured for this group' }, { status: 404 });
  }

  const response = NextResponse.redirect(surveyUrl);
  response.headers.set('Cache-Control', 'no-store');
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
