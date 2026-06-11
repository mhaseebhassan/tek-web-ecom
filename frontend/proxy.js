import { NextResponse } from 'next/server';

const protectedPaths = ['/admin', '/orders'];

export function proxy(request) {
  const token = request.cookies.get('accessToken') || request.cookies.get('jwt');
  const { pathname } = request.nextUrl;

  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (isProtected && !token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/orders'],
};
