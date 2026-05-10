import type { Metadata } from 'next'
import { tmdb } from '@/lib/tmdb'
import { MovieGridPage } from '@/components/movies/MovieGridPage'

export const metadata: Metadata = {
  title: 'Popular Movies',
  description: 'Most popular movies right now.',
}

export const revalidate = 3600

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageStr = '1' } = await searchParams
  const page = parseInt(pageStr)

  const data = await tmdb.movies.popular(page)

  return (
    <MovieGridPage
      title="Popular Movies"
      subtitle="What the world is watching"
      items={data.results}
      type="movie"
      currentPage={page}
      totalPages={data.total_pages}
      baseUrl="/movies"
    />
  )
}
