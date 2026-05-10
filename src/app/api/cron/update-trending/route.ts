import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag, revalidatePath } from 'next/cache'

/**
 * Trending update cron endpoint
 * Called externally by n8n on schedule (e.g., every 6 hours)
 *
 * Usage:
 *   POST/GET https://yoursite.vercel.app/api/cron/update-trending
 *   Header: Authorization: Bearer YOUR_CRON_SECRET
 *
 * What it does:
 *   1. Validates the secret token
 *   2. Fetches fresh trending data from TMDb
 *   3. Optionally caches in Supabase
 *   4. Revalidates Next.js cache so users see fresh data
 */
export async function GET(req: NextRequest) {
  return handleCron(req)
}

export async function POST(req: NextRequest) {
  return handleCron(req)
}

async function handleCron(req: NextRequest) {
  // ── 1. AUTHENTICATE ──────────────────────────────────────
  const authHeader = req.headers.get('authorization')
  const expectedToken = process.env.CRON_SECRET

  if (!expectedToken) {
    return NextResponse.json(
      { error: 'CRON_SECRET not configured on server' },
      { status: 500 }
    )
  }

  if (authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // ── 2. FETCH FRESH DATA FROM TMDB ───────────────────────
  const tmdbKey = process.env.TMDB_API_KEY
  if (!tmdbKey) {
    return NextResponse.json(
      { error: 'TMDB_API_KEY not configured' },
      { status: 500 }
    )
  }

  try {
    // Fetch trending movies + TV in parallel
    const [moviesRes, tvRes] = await Promise.all([
      fetch(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${tmdbKey}&language=en-US`,
        { cache: 'no-store' }
      ),
      fetch(
        `https://api.themoviedb.org/3/trending/tv/week?api_key=${tmdbKey}&language=en-US`,
        { cache: 'no-store' }
      ),
    ])

    if (!moviesRes.ok || !tvRes.ok) {
      throw new Error('TMDb fetch failed')
    }

    const moviesData = await moviesRes.json()
    const tvData = await tvRes.json()

    // ── 3. REVALIDATE NEXT.JS CACHE ────────────────────────
    // Force re-render of pages that show trending data
    revalidatePath('/')
    revalidatePath('/movies/trending')
    revalidatePath('/tv/trending')

    // ── 4. RETURN STATS ────────────────────────────────────
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      stats: {
        trending_movies_count: moviesData.results?.length || 0,
        trending_tv_count: tvData.results?.length || 0,
        top_movie: moviesData.results?.[0]?.title,
        top_tv: tvData.results?.[0]?.name,
      },
      revalidated: ['/', '/movies/trending', '/tv/trending'],
    })
  } catch (error) {
    console.error('Cron update-trending failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
