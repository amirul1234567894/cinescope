import type { Metadata } from 'next'
import { tmdb } from '@/lib/tmdb'
import { MovieGridPage } from '@/components/movies/MovieGridPage'

export const metadata: Metadata = {
  title: 'Top Rated TV Shows',
  description: 'The highest-rated TV series of all time.',
}

export const revalidate = 86400

export default async function TopRatedTVPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageStr = '1' } = await searchParams
  const page = parseInt(pageStr)

  const data = await tmdb.tv.topRated(page)

  return (
    <MovieGridPage
      title="Top Rated TV Shows"
      subtitle="The greatest series ever made"
      items={data.results}
      type="tv"
      currentPage={page}
      totalPages={data.total_pages}
      baseUrl="/tv/top-rated"
    />
  )
}
