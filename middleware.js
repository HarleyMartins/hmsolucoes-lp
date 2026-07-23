import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, isValidSessionToken } from './lib/auth';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login';

  if (isAdminRoute) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!token || !(await isValidSessionToken(token))) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
