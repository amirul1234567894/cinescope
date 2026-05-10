import type { Metadata } from 'next'
import { tmdb } from '@/lib/tmdb'
import { MovieGridPage } from '@/components/movies/MovieGridPage'

export const metadata: Metadata = {
  title: 'Trending TV Shows',
  description: 'Most trending TV shows this week.',
}

export const revalidate = 1800

export default async function TrendingTVPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageStr = '1' } = await searchParams
  const page = parseInt(pageStr)

  const data = await tmdb.trending.tv('week')

  return (
    <MovieGridPage
      title="Trending TV Shows"
      subtitle="Series everyone's talking about"
      items={data.results}
      type="tv"
      currentPage={page}
      totalPages={data.total_pages}
      baseUrl="/tv/trending"
    />
  )
}
