import type { Metadata } from 'next'
import { tmdb } from '@/lib/tmdb'
import { MovieGridPage } from '@/components/movies/MovieGridPage'

export const metadata: Metadata = {
  title: 'Trending Movies',
  description: 'Most trending and popular movies this week.',
}

export const revalidate = 1800

export default async function TrendingMoviesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageStr = '1' } = await searchParams
  const page = parseInt(pageStr)

  const data = await tmdb.trending.movies('week')

  return (
    <MovieGridPage
      title="Trending Movies"
      subtitle="Most-watched movies this week"
      items={data.results}
      type="movie"
      currentPage={page}
      totalPages={data.total_pages}
      baseUrl="/movies/trending"
    />
  )
}
