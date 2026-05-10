import type { Metadata } from 'next'
import { tmdb } from '@/lib/tmdb'
import { MovieGridPage } from '@/components/movies/MovieGridPage'

export const metadata: Metadata = {
  title: 'Now Playing',
  description: 'Movies currently in theaters.',
}

export const revalidate = 3600

export default async function NowPlayingPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageStr = '1' } = await searchParams
  const page = parseInt(pageStr)

  let data
  try {
    data = await tmdb.movies.nowPlaying(page)
  } catch (error) {
    console.error('Failed to fetch now playing:', error)
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h1 className="font-display text-3xl font-bold text-white mb-3">
            Couldn&apos;t load movies
          </h1>
          <p className="text-white/40 text-sm mb-6">
            We had trouble reaching the movie database. Please try again in a moment.
          </p>
          <a href="/movies/now-playing" className="btn-primary inline-flex">
            Try Again
          </a>
        </div>
      </div>
    )
  }

  return (
    <MovieGridPage
      title="Now Playing"
      subtitle="Movies currently showing in theaters"
      items={data.results}
      type="movie"
      currentPage={page}
      totalPages={data.total_pages}
      baseUrl="/movies/now-playing"
    />
  )
}
