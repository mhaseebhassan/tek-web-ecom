import { NextResponse } from 'next/server';

export async function middleware(request) {
  const token = request.cookies.get('accessToken');
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

  if (isAdminRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    // We cannot securely decode JWT in Edge Runtime without jsonwebtoken library 
    // or native Web Crypto API. We will let the backend handle real authorization,
    // but we protect the route at a surface level here.
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
}; 