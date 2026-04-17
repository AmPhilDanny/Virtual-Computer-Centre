import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory storage for rate limiting (Note: This will reset on serverless function cold starts)
// For production-grade rate limiting, a Redis-based approach (e.g., Upstash) is recommended.
const rateLimitMap = new Map<string, { count: number, lastRequest: number }>();

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect sensitive endpoints (Job Creation, Login, Wallet Top-up)
  if (
    pathname.startsWith('/api/jobs/create') || 
    pathname.startsWith('/api/auth/signin') ||
    pathname.startsWith('/api/wallet')
  ) {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const windowMs = 60000; // 1 minute window
    const maxRequests = 10; // 10 requests per minute

    const rateData = rateLimitMap.get(ip) || { count: 0, lastRequest: now };

    // Reset window if needed
    if (now - rateData.lastRequest > windowMs) {
      rateData.count = 0;
      rateData.lastRequest = now;
    }

    rateData.count++;
    rateLimitMap.set(ip, rateData);

    if (rateData.count > maxRequests) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests. Please slow down and try again later.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/jobs/create/:path*',
    '/api/auth/signin/:path*',
    '/api/wallet/:path*',
  ],
};
