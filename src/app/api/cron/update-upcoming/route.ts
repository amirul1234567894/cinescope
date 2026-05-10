import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

/**
 * Upcoming releases cron endpoint
 * Called by n8n daily to refresh upcoming movies cache
 */
export async function GET(req: NextRequest) {
  return handleCron(req)
}

export async function POST(req: NextRequest) {
  return handleCron(req)
}

async function handleCron(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const expectedToken = process.env.CRON_SECRET

  if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const tmdbKey = process.env.TMDB_API_KEY
  if (!tmdbKey) {
    return NextResponse.json({ error: 'TMDB_API_KEY missing' }, { status: 500 })
  }

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=${tmdbKey}&language=en-US&page=1`,
      { cache: 'no-store' }
    )
    const data = await res.json()

    revalidatePath('/')
    revalidatePath('/movies/upcoming')

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      stats: {
        upcoming_count: data.results?.length || 0,
        next_release: data.results?.[0]?.title,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
