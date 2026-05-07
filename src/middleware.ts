import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple in-memory rate limiting for the middleware instance
// Note: In serverless environments, this is per-instance, but it still provides a basic layer of protection.
const rateLimitMap = new Map<string, { count: number; startTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 100; // 100 requests per minute per IP

export function middleware(request: NextRequest) {
    // Only apply rate limiting to API routes
    if (request.nextUrl.pathname.startsWith('/api/')) {
        const ip = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown';

        if (ip !== 'unknown') {
            const currentTime = Date.now();
            const record = rateLimitMap.get(ip);

            if (!record) {
                rateLimitMap.set(ip, { count: 1, startTime: currentTime });
            } else {
                if (currentTime - record.startTime > RATE_LIMIT_WINDOW_MS) {
                    // Reset window
                    rateLimitMap.set(ip, { count: 1, startTime: currentTime });
                } else {
                    record.count += 1;
                    if (record.count > MAX_REQUESTS_PER_WINDOW) {
                        return new NextResponse(
                            JSON.stringify({ error: 'Too many requests. Please try again later.' }),
                            {
                                status: 429,
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Retry-After': Math.ceil((RATE_LIMIT_WINDOW_MS - (currentTime - record.startTime)) / 1000).toString()
                                }
                            }
                        );
                    }
                }
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/api/:path*',
}
