import type { Metadata } from 'next'
import { tmdb } from '@/lib/tmdb'
import { MovieGridPage } from '@/components/movies/MovieGridPage'

export const metadata: Metadata = {
  title: 'Airing Today',
  description: 'TV shows airing new episodes today.',
}

export const revalidate = 1800

export default async function AiringTodayPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageStr = '1' } = await searchParams
  const page = parseInt(pageStr)

  const data = await tmdb.tv.airingToday(page)

  return (
    <MovieGridPage
      title="Airing Today"
      subtitle="Fresh episodes hitting your screen today"
      items={data.results}
      type="tv"
      currentPage={page}
      totalPages={data.total_pages}
      baseUrl="/tv/airing-today"
    />
  )
}
