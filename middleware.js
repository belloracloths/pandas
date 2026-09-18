import { NextResponse } from 'next/server';

export function middleware(request) {
  const path = request.nextUrl.pathname;

  const isPublicAdminPath = path === '/aallaa/login';
  const isAdminPath = path.startsWith('/aallaa') && !isPublicAdminPath;

  const token = request.cookies.get('adminToken')?.value || '';

  if (isAdminPath && !token) {
    return NextResponse.redirect(new URL('/aallaa/login', request.nextUrl));
  }

  if (isPublicAdminPath && token) {
    return NextResponse.redirect(new URL('/aallaa', request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/aallaa/:path*',
  ],
};
