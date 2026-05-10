import type { Metadata } from 'next'
import { tmdb } from '@/lib/tmdb'
import { MovieGridPage } from '@/components/movies/MovieGridPage'

export const metadata: Metadata = {
  title: 'Top Rated Movies',
  description: 'The highest-rated movies of all time.',
}

export const revalidate = 86400

export default async function TopRatedPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageStr = '1' } = await searchParams
  const page = parseInt(pageStr)

  const data = await tmdb.movies.topRated(page)

  return (
    <MovieGridPage
      title="Top Rated Movies"
      subtitle="The highest-rated films of all time"
      items={data.results}
      type="movie"
      currentPage={page}
      totalPages={data.total_pages}
      baseUrl="/movies/top-rated"
    />
  )
}
