import type { Metadata } from 'next'
import { tmdb } from '@/lib/tmdb'
import { MovieGridPage } from '@/components/movies/MovieGridPage'

export const metadata: Metadata = {
  title: 'Popular TV Shows',
  description: 'Most popular TV shows and series right now.',
}

export const revalidate = 3600

export default async function TVPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageStr = '1' } = await searchParams
  const page = parseInt(pageStr)

  const data = await tmdb.tv.popular(page)

  return (
    <MovieGridPage
      title="Popular TV Shows"
      subtitle="The shows everyone is binging"
      items={data.results}
      type="tv"
      currentPage={page}
      totalPages={data.total_pages}
      baseUrl="/tv"
    />
  )
}
