import type { TMDbMovie } from '@/types'
import { tmdbImage } from '@/lib/tmdb'

export function MovieJsonLd({ movie }: { movie: TMDbMovie }) {
  const director = movie.credits?.crew?.find((c) => c.job === 'Director')
  const cast = movie.credits?.cast?.slice(0, 5) || []

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.title,
    description: movie.overview,
    image: tmdbImage.poster(movie.poster_path, 'w500'),
    datePublished: movie.release_date,
    inLanguage: movie.original_language,
    genre: movie.genres?.map((g) => g.name) || [],
    duration: movie.runtime
      ? `PT${Math.floor(movie.runtime / 60)}H${movie.runtime % 60}M`
      : undefined,
    director: director ? [{ '@type': 'Person', name: director.name }] : undefined,
    actor: cast.map((c) => ({ '@type': 'Person', name: c.name })),
    aggregateRating:
      movie.vote_count > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: movie.vote_average.toFixed(1),
            ratingCount: movie.vote_count,
            bestRating: 10,
            worstRating: 0,
          }
        : undefined,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
