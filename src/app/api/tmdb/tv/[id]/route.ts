import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const apiKey = process.env.TMDB_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'API key missing' }, { status: 500 })

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=en-US`,
      { next: { revalidate: 86400 } }
    )
    if (!res.ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const data = await res.json()
    return NextResponse.json({
      id: data.id,
      title: data.name,
      poster_path: data.poster_path,
      vote_average: data.vote_average,
      first_air_date: data.first_air_date,
    })
  } catch {
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 })
  }
}
