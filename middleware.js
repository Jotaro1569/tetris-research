import { NextResponse } from 'next/server';
import { SESSION_COOKIE, verifySession } from './lib/security';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Check if accessing a protected group route
  if (pathname.match(/^\/group\/(us|in|id|nl|ot)$/i)) {
    const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);
    
    // Redirect to participation page if not verified
    if (!session?.group) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    // Extract requested group from URL
    const requestedGroup = pathname.split('/')[2].toUpperCase();
    
    // Check if trying to access the correct group
    if (session.group !== requestedGroup) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/group/:path*']
};
