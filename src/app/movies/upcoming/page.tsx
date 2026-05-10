import type { Metadata } from 'next'
import { tmdb } from '@/lib/tmdb'
import { MovieGridPage } from '@/components/movies/MovieGridPage'

export const metadata: Metadata = {
  title: 'Upcoming Movies',
  description: 'Most anticipated movies coming soon.',
}

export const revalidate = 7200

export default async function UpcomingPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageStr = '1' } = await searchParams
  const page = parseInt(pageStr)

  const data = await tmdb.movies.upcoming(page)

  return (
    <MovieGridPage
      title="Upcoming Movies"
      subtitle="Most anticipated releases on the horizon"
      items={data.results}
      type="movie"
      currentPage={page}
      totalPages={data.total_pages}
      baseUrl="/movies/upcoming"
    />
  )
}
