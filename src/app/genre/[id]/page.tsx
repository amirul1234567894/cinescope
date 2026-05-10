import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { tmdb } from '@/lib/tmdb'
import { MovieGridPage } from '@/components/movies/MovieGridPage'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  try {
    const genres = await tmdb.genres.movies()
    const genre = genres.genres.find((g) => g.id === parseInt(id))
    return {
      title: genre ? `${genre.name} Movies` : 'Genre',
      description: `Discover the best ${genre?.name.toLowerCase() || ''} movies.`,
    }
  } catch {
    return { title: 'Genre' }
  }
}

export const revalidate = 3600

export default async function GenreIdPage({ params, searchParams }: Props) {
  const { id } = await params
  const { page: pageStr = '1' } = await searchParams
  const page = parseInt(pageStr)
  const genreId = parseInt(id)

  if (isNaN(genreId)) notFound()

  const [genres, data] = await Promise.all([
    tmdb.genres.movies(),
    tmdb.movies.byGenre(genreId, page),
  ])

  const genre = genres.genres.find((g) => g.id === genreId)
  if (!genre) notFound()

  return (
    <MovieGridPage
      title={`${genre.name} Movies`}
      subtitle={`The best ${genre.name.toLowerCase()} films from around the world`}
      items={data.results}
      type="movie"
      currentPage={page}
      totalPages={data.total_pages}
      baseUrl={`/genre/${id}`}
    />
  )
}
