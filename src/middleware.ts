import { NextRequest, NextResponse } from 'next/server'

// In-memory rate limiting (resets on server restart, fine for serverless)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

const RATE_LIMITS = {
  api: { requests: 100, window: 60 * 1000 },        // 100 req/min for API
  auth: { requests: 10, window: 60 * 1000 },        // 10 req/min for auth
  general: { requests: 200, window: 60 * 1000 },    // 200 req/min general
}

function getRateLimit(pathname: string) {
  if (pathname.startsWith('/api/cron') || pathname.startsWith('/api/revalidate')) {
    return RATE_LIMITS.auth // Strict for sensitive endpoints
  }
  if (pathname.startsWith('/api/')) {
    return RATE_LIMITS.api
  }
  return RATE_LIMITS.general
}

function checkRateLimit(ip: string, pathname: string): { allowed: boolean; resetIn: number } {
  const limit = getRateLimit(pathname)
  const now = Date.now()
  const key = `${ip}:${pathname.split('/').slice(0, 3).join('/')}`

  const record = rateLimitMap.get(key)

  if (!record || record.resetAt < now) {
    rateLimitMap.set(key, { count: 1, resetAt: now + limit.window })
    return { allowed: true, resetIn: 0 }
  }

  if (record.count >= limit.requests) {
    return { allowed: false, resetIn: Math.ceil((record.resetAt - now) / 1000) }
  }

  record.count++
  return { allowed: true, resetIn: 0 }
}

// Cleanup old entries periodically (memory management)
function cleanupRateLimit() {
  const now = Date.now()
  for (const [key, record] of rateLimitMap.entries()) {
    if (record.resetAt < now) {
      rateLimitMap.delete(key)
    }
  }
}

// Clean up every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimit, 5 * 60 * 1000)
}

// Suspicious paths to block (common attack vectors)
const BLOCKED_PATHS = [
  '/.env',
  '/.git',
  '/wp-admin',
  '/wp-login',
  '/admin/config',
  '/phpinfo',
  '/phpmyadmin',
  '/.htaccess',
  '/.DS_Store',
  '/server-status',
  '/.well-known/security.txt',
]

const SUSPICIOUS_USER_AGENTS = [
  'sqlmap',
  'nikto',
  'nmap',
  'masscan',
  'metasploit',
  'havij',
]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 
             req.headers.get('x-real-ip') || 
             'unknown'

  // ── 1. BLOCK SUSPICIOUS PATHS ──────────────────────
  if (BLOCKED_PATHS.some(blocked => pathname.startsWith(blocked))) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  // ── 2. BLOCK SUSPICIOUS USER AGENTS ────────────────
  const userAgent = req.headers.get('user-agent')?.toLowerCase() || ''
  if (SUSPICIOUS_USER_AGENTS.some(bad => userAgent.includes(bad))) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  // ── 3. RATE LIMITING ───────────────────────────────
  const { allowed, resetIn } = checkRateLimit(ip, pathname)
  if (!allowed) {
    return new NextResponse(
      JSON.stringify({
        error: 'Too many requests',
        retryAfter: resetIn,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': resetIn.toString(),
        },
      }
    )
  }

  // ── 4. ADD SECURITY HEADERS TO RESPONSE ───────────
  const response = NextResponse.next()

  // Generate nonce for CSP (Content Security Policy)
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  )
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  )

  // CSP - allows your trusted sources
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://www.googletagmanager.com https://www.google-analytics.com https://*.vercel.app",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https://image.tmdb.org https://img.youtube.com https://i.ytimg.com https://*.supabase.co https://*.googlesyndication.com https://*.google-analytics.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https://api.themoviedb.org https://image.tmdb.org https://*.supabase.co https://*.googlesyndication.com https://www.google-analytics.com https://pagead2.googlesyndication.com",
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com",
      "media-src 'self' https://*.googlevideo.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join('; ')
  )

  // Add request ID for debugging
  response.headers.set('X-Request-Id', crypto.randomUUID())

  // Hide server info
  response.headers.set('X-Powered-By', 'CineScope')

  return response
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, robots.txt, sitemap.xml, ads.txt
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|ads.txt|manifest.json|videos/).*)',
  ],
}
