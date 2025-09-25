import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Check if accessing a protected group route
  if (pathname.match(/^\/group\/(us|in|id|nl)$/i)) {
    // Get verification cookies
    const verified = request.cookies.get('group-verified');
    const allowedGroup = request.cookies.get('allowed-group');
    
    // Redirect to participation page if not verified
    if (!verified || verified.value !== 'true' || !allowedGroup) {
      console.log('Access denied: No verification cookies found');
      return NextResponse.redirect(new URL('/participation', request.url));
    }
    
    // Extract requested group from URL
    const requestedGroup = pathname.split('/')[2].toUpperCase();
    
    // Check if trying to access the correct group
    if (allowedGroup.value !== requestedGroup) {
      console.log(`Access denied: Trying to access ${requestedGroup} but allowed ${allowedGroup.value}`);
      return NextResponse.redirect(new URL('/participation', request.url));
    }
    
    console.log(`Access granted: ${allowedGroup.value} user accessing ${requestedGroup}`);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/group/:path*']
};