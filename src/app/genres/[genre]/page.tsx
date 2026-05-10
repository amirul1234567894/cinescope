import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { tmdb } from '@/lib/tmdb'
import { MovieGridPage } from '@/components/movies/MovieGridPage'
import { REGION_CONFIG, type CinemaRegion } from '@/types'

interface Props {
  params: Promise<{ genre: string }>
  searchParams: Promise<{ page?: string }>
}

// Regional language → TMDb language code mapping
const REGION_QUERIES: Record<string, { language?: string; genre?: number; type: 'movie' | 'tv' }> = {
  hollywood: { language: 'en', type: 'movie' },
  bollywood: { language: 'hi', type: 'movie' },
  tollywood: { language: 'te', type: 'movie' },
  bengali: { language: 'bn', type: 'movie' },
  korean: { language: 'ko', type: 'tv' },
  anime: { language: 'ja', genre: 16, type: 'tv' }, // Animation genre
  'web-series': { type: 'tv' },
  'ott-originals': { type: 'tv' },
  international: { type: 'movie' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { genre } = await params
  const config = REGION_CONFIG[genre as CinemaRegion]
  if (!config) return { title: 'Genre Not Found' }

  return {
    title: config.label,
    description: `Discover the best of ${config.label} — movies and shows from this category.`,
  }
}

export const revalidate = 3600

export default async function RegionalGenrePage({ params, searchParams }: Props) {
  const { genre } = await params
  const { page: pageStr = '1' } = await searchParams
  const page = parseInt(pageStr)

  const config = REGION_CONFIG[genre as CinemaRegion]
  if (!config) notFound()

  const query = REGION_QUERIES[genre]
  if (!query) notFound()

  // Fetch from TMDb based on type
  let data
  try {
    if (query.type === 'movie') {
      data = await tmdb.movies.discover({
        page,
        sort_by: 'popularity.desc',
        ...(query.language && { with_original_language: query.language }),
        ...(query.genre && { with_genres: query.genre }),
      })
    } else {
      // TV shows — use discover/tv via direct call
      const apiKey = process.env.TMDB_API_KEY
      const params = new URLSearchParams({
        api_key: apiKey || '',
        language: 'en-US',
        sort_by: 'popularity.desc',
        page: page.toString(),
        ...(query.language && { with_original_language: query.language }),
        ...(query.genre && { with_genres: query.genre.toString() }),
      })
      const res = await fetch(
        `https://api.themoviedb.org/3/discover/tv?${params}`,
        { next: { revalidate: 3600 } }
      )
      data = await res.json()
    }
  } catch (error) {
    notFound()
  }

  return (
    <MovieGridPage
      title={`${config.emoji} ${config.label}`}
      subtitle={`Discover the best of ${config.label}`}
      items={data.results || []}
      type={query.type}
      currentPage={page}
      totalPages={data.total_pages || 1}
      baseUrl={`/genres/${genre}`}
    />
  )
}
