import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Calendar, Globe, Tv, Play, Users, Clock } from 'lucide-react'
import { tmdb, tmdbImage, extractIdFromSlug, slugify, getYear, getOfficialTrailer, getRatingColor } from '@/lib/tmdb'
import { CastSection } from '@/components/movies/CastSection'
import { TrailerSection } from '@/components/movies/TrailerSection'
import { SimilarMovies } from '@/components/movies/SimilarMovies'
import { BackdropHero } from '@/components/movies/BackdropHero'
import { MovieActions } from '@/components/movies/MovieActions'
import { WatchProviders } from '@/components/movies/WatchProviders'
import { ReviewsSection } from '@/components/movies/ReviewsSection'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params
    const id = extractIdFromSlug(slug)
    const show = await tmdb.tv.detail(id)
    return {
      title: `${show.name} (${getYear(show.first_air_date)})`,
      description: show.overview?.slice(0, 155),
      openGraph: {
        title: `${show.name} — CineScope`,
        description: show.overview?.slice(0, 155),
        images: [{ url: tmdbImage.backdrop(show.backdrop_path, 'w1280') }],
      },
    }
  } catch {
    return { title: 'TV Show Not Found' }
  }
}

export default async function TVShowPage({ params }: Props) {
  const { slug } = await params
  let id: number
  try { id = extractIdFromSlug(slug) } catch { notFound() }

  let show
  try { show = await tmdb.tv.detail(id!) } catch { notFound() }

  const trailer = getOfficialTrailer(show.videos?.results || [])
  const cast = show.credits?.cast?.slice(0, 15) || []
  const trailers = show.videos?.results?.filter((v: { site: string }) => v.site === 'YouTube') || []
  const similar = show.similar?.results?.slice(0, 12) || []
  const ratingColor = getRatingColor(show.vote_average)

  return (
    <div className="min-h-screen">
      <BackdropHero
        backdropUrl={tmdbImage.backdrop(show.backdrop_path, 'original')}
        title={show.name}
        trailerKey={trailer?.key}
      />

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 -mt-32 sm:-mt-48">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 xl:gap-12">

          {/* Poster */}
          <div className="flex flex-col items-center lg:items-start">
            <div className="relative w-64 sm:w-72 lg:w-full max-w-xs">
              <div className="aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.7)]">
                <Image
                  src={tmdbImage.poster(show.poster_path, 'w500')}
                  alt={show.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="320px"
                />
              </div>
            </div>
            <MovieActions movieId={show.id} type="tv" title={show.name} />
            {show['watch/providers'] && <WatchProviders providers={show['watch/providers']} />}
          </div>

          {/* Details */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="genre-chip">TV Show</span>
                {show.status && (
                  <span className="genre-chip" style={{ color: show.status === 'Ended' ? '#94a3b8' : '#4ade80' }}>
                    {show.status}
                  </span>
                )}
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                {show.name}
              </h1>
              {show.tagline && <p className="text-white/40 italic mb-4">"{show.tagline}"</p>}

              <div className="flex flex-wrap items-center gap-3 mb-5">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-bold"
                  style={{ background: `${ratingColor}15`, borderColor: `${ratingColor}40`, color: ratingColor }}>
                  <Star className="w-4 h-4 fill-current" />
                  {show.vote_average.toFixed(1)}
                </div>
                <span className="flex items-center gap-1 text-sm text-white/50">
                  <Calendar className="w-4 h-4" />{show.first_air_date?.slice(0, 4)}
                </span>
                {show.number_of_seasons && (
                  <span className="flex items-center gap-1 text-sm text-white/50">
                    <Tv className="w-4 h-4" />{show.number_of_seasons} Season{show.number_of_seasons > 1 ? 's' : ''}
                  </span>
                )}
                {show.number_of_episodes && (
                  <span className="flex items-center gap-1 text-sm text-white/50">
                    <Clock className="w-4 h-4" />{show.number_of_episodes} Episodes
                  </span>
                )}
              </div>

              {show.genres && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {show.genres.map((g: { id: number; name: string }) => (
                    <Link key={g.id} href={`/genre/${g.id}`}>
                      <span className="genre-chip">{g.name}</span>
                    </Link>
                  ))}
                </div>
              )}

              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-3">Overview</h2>
                <p className="text-white/80 leading-relaxed">{show.overview}</p>
              </div>
            </div>

            {/* Creators */}
            {show.created_by && show.created_by.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {show.created_by.map((creator: { id: number; name: string }) => (
                  <Link key={creator.id} href={`/person/${creator.id}`}>
                    <div className="glass-card rounded-xl p-4 hover:border-red-500/20 transition-all group">
                      <p className="text-xs text-white/30 uppercase tracking-wide mb-1">Creator</p>
                      <p className="text-sm font-semibold text-white group-hover:text-red-300 transition-colors">
                        {creator.name}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {cast.length > 0 && <CastSection cast={cast} />}
        {trailers.length > 0 && <TrailerSection videos={trailers} />}
        <ReviewsSection movieId={show.id} type="tv" />
        {similar.length > 0 && (
          <SimilarMovies similar={similar} recommendations={[]} type="tv" />
        )}
      </div>
    </div>
  )
}
