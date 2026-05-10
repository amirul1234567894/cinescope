import { NextRequest, NextResponse } from 'next/server'

const TMDB_BASE = 'https://api.themoviedb.org/3'

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q')?.trim()
  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '8')

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] })
  }

  const apiKey = process.env.TMDB_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 500 })
  }

  try {
    const url = `${TMDB_BASE}/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=en-US&page=1&include_adult=false`
    const res = await fetch(url, { next: { revalidate: 60 } })
    const data = await res.json()

    const results = (data.results || [])
      .filter((r: { media_type: string; poster_path?: string | null; profile_path?: string | null }) =>
        r.media_type !== 'person' || r.profile_path
      )
      .slice(0, limit)
      .map((r: {
        id: number
        media_type: string
        title?: string
        name?: string
        release_date?: string
        first_air_date?: string
        poster_path?: string | null
        profile_path?: string | null
        vote_average?: number
        known_for_department?: string
      }) => ({
        id: r.id,
        type: r.media_type,
        title: r.title || r.name || '',
        year: r.release_date?.slice(0, 4) || r.first_air_date?.slice(0, 4) || '',
        poster: r.poster_path || r.profile_path || null,
        rating: r.vote_average || 0,
        department: r.known_for_department || null,
      }))

    return NextResponse.json(
      { results },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    )
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ results: [], error: 'Search failed' }, { status: 500 })
  }
}
