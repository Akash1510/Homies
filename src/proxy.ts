import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: ['/admin/:path*'],
};

interface DecodedTokenPayload {
  sub?: string;
  role?: string;
  exp?: number;
}

function parseJwt(token: string): DecodedTokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonStr = Buffer.from(base64, 'base64').toString('utf-8');
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const token =
    request.cookies.get('homies_token')?.value ||
    request.cookies.get('token')?.value;

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Allow admin mock token for local offline development
  if (token === 'mock_jwt_admin_session') {
    return NextResponse.next();
  }

  const payload = parseJwt(token);
  if (!payload) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Reject expired tokens
  if (payload.exp && payload.exp * 1000 < Date.now()) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    loginUrl.searchParams.set('error', 'session_expired');
    return NextResponse.redirect(loginUrl);
  }

  const email = (payload.sub || '').trim().toLowerCase();
  const isAdmin = payload.role === 'admin' || email === 'akashgj777@gmail.com';

  if (!isAdmin) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'unauthorized_admin');
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
