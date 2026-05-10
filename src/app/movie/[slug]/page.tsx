import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import {
  Star, Clock, Calendar, Globe, DollarSign, Award,
  Play, Bookmark, Heart, Share2, ExternalLink, ChevronRight
} from 'lucide-react'
import { tmdb, tmdbImage, extractIdFromSlug, slugify, getYear, formatRuntime, getOfficialTrailer, getRatingColor } from '@/lib/tmdb'
import { CastSection } from '@/components/movies/CastSection'
import { TrailerSection } from '@/components/movies/TrailerSection'
import { SimilarMovies } from '@/components/movies/SimilarMovies'
import { ReviewsSection } from '@/components/movies/ReviewsSection'
import { MovieActions } from '@/components/movies/MovieActions'
import { WatchProviders } from '@/components/movies/WatchProviders'
import { MovieJsonLd } from '@/components/movies/MovieJsonLd'
import { BackdropHero } from '@/components/movies/BackdropHero'
import { AdUnit } from '@/components/ads/AdUnit'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params
    const id = extractIdFromSlug(slug)
    const movie = await tmdb.movies.detail(id)

    const description = movie.overview?.slice(0, 155) + '...' || ''
    const poster = tmdbImage.poster(movie.poster_path, 'w500')
    const backdrop = tmdbImage.backdrop(movie.backdrop_path, 'w1280')

    return {
      title: `${movie.title} (${getYear(movie.release_date)})`,
      description,
      openGraph: {
        title: `${movie.title} — CineScope`,
        description,
        type: 'video.movie',
        images: [{ url: backdrop || poster, width: 1280, height: 720, alt: movie.title }],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${movie.title} — CineScope`,
        description,
        images: [backdrop || poster],
      },
      alternates: {
        canonical: `/movie/${slug}`,
      },
    }
  } catch {
    return { title: 'Movie Not Found' }
  }
}

export default async function MoviePage({ params }: Props) {
  const { slug } = await params
  let id: number

  try {
    id = extractIdFromSlug(slug)
  } catch {
    notFound()
  }

  let movie
  try {
    movie = await tmdb.movies.detail(id!)
  } catch {
    notFound()
  }

  const trailer = getOfficialTrailer(movie.videos?.results || [])
  const director = movie.credits?.crew?.find(c => c.job === 'Director')
  const writers = movie.credits?.crew?.filter(c => c.department === 'Writing').slice(0, 3) || []
  const cast = movie.credits?.cast?.slice(0, 15) || []
  const similar = movie.similar?.results?.slice(0, 12) || []
  const recommendations = movie.recommendations?.results?.slice(0, 12) || []
  const trailers = movie.videos?.results?.filter(v => v.site === 'YouTube') || []

  const ratingColor = getRatingColor(movie.vote_average)
  const posterUrl = tmdbImage.poster(movie.poster_path, 'w500')
  const backdropUrl = tmdbImage.backdrop(movie.backdrop_path, 'original')

  return (
    <>
      {/* JSON-LD Structured Data */}
      <MovieJsonLd movie={movie} />

      <div className="min-h-screen">
        {/* ── CINEMATIC BACKDROP HERO ── */}
        <BackdropHero
          backdropUrl={backdropUrl}
          title={movie.title}
          trailerKey={trailer?.key}
        />

        {/* ── MAIN CONTENT ── */}
        <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 -mt-32 sm:-mt-48">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 xl:gap-12">

            {/* ── LEFT COLUMN: Poster + Actions ── */}
            <div className="flex flex-col items-center lg:items-start">
              {/* Poster */}
              <div className="relative w-64 sm:w-72 lg:w-full max-w-xs group">
                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.7)]">
                  <Image
                    src={posterUrl}
                    alt={`${movie.title} poster`}
                    fill
                    priority
                    className="object-cover"
                    sizes="320px"
                  />
                  {/* Glow border */}
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)' }}
                  />
                </div>

                {/* Play trailer overlay */}
                {trailer && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl bg-black/40 backdrop-blur-sm cursor-pointer">
                    <div className="w-16 h-16 rounded-full bg-red-600/90 flex items-center justify-center shadow-glow-red">
                      <Play className="w-7 h-7 text-white fill-white ml-1" />
                    </div>
                  </div>
                )}
              </div>

              {/* User Actions */}
              <MovieActions movieId={movie.id} type="movie" title={movie.title} />

              {/* OTT Providers */}
              {movie['watch/providers'] && (
                <WatchProviders providers={movie['watch/providers']} />
              )}

              {/* External Links */}
              <div className="mt-6 w-full space-y-2">
                {movie.imdb_id && (
                  <a
                    href={`https://www.imdb.com/title/${movie.imdb_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full px-4 py-2.5 glass-card rounded-xl text-sm text-white/60 hover:text-white transition-all group"
                  >
                    <span>View on IMDb</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
                  </a>
                )}
                {movie.homepage && (
                  <a
                    href={movie.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full px-4 py-2.5 glass-card rounded-xl text-sm text-white/60 hover:text-white transition-all group"
                  >
                    <span>Official Website</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
                  </a>
                )}
              </div>
            </div>

            {/* ── RIGHT COLUMN: Details ── */}
            <div className="space-y-8">
              {/* Title & Meta */}
              <div>
                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-2">
                  {movie.title}
                </h1>
                {movie.tagline && (
                  <p className="text-base text-white/40 italic mb-4">"{movie.tagline}"</p>
                )}

                {/* Quick stats */}
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  {/* Rating */}
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-bold"
                    style={{
                      background: `${ratingColor}15`,
                      borderColor: `${ratingColor}40`,
                      color: ratingColor,
                    }}
                  >
                    <Star className="w-4 h-4 fill-current" />
                    {movie.vote_average.toFixed(1)}
                    <span className="text-xs font-normal opacity-60">
                      / 10 · {(movie.vote_count / 1000).toFixed(0)}K votes
                    </span>
                  </div>

                  {/* Year */}
                  <div className="flex items-center gap-1.5 text-sm text-white/50">
                    <Calendar className="w-4 h-4" />
                    {movie.release_date}
                  </div>

                  {/* Runtime */}
                  {movie.runtime && (
                    <div className="flex items-center gap-1.5 text-sm text-white/50">
                      <Clock className="w-4 h-4" />
                      {formatRuntime(movie.runtime)}
                    </div>
                  )}

                  {/* Language */}
                  <div className="flex items-center gap-1.5 text-sm text-white/50">
                    <Globe className="w-4 h-4" />
                    {movie.original_language.toUpperCase()}
                  </div>

                  {/* Status */}
                  {movie.status && (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-green-500/10 border border-green-500/20 text-green-400">
                      {movie.status}
                    </span>
                  )}
                </div>

                {/* Genres */}
                {movie.genres && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {movie.genres.map(genre => (
                      <Link key={genre.id} href={`/genre/${genre.id}`}>
                        <span className="genre-chip">{genre.name}</span>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Overview */}
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-3">Storyline</h2>
                  <p className="text-white/80 leading-relaxed text-sm sm:text-base">
                    {movie.overview}
                  </p>
                </div>
              </div>

              {/* Crew */}
              {(director || writers.length > 0) && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {director && (
                    <Link href={`/person/${director.id}`}>
                      <div className="glass-card rounded-xl p-4 hover:border-red-500/20 transition-all group">
                        <p className="text-xs text-white/30 uppercase tracking-wide mb-1">Director</p>
                        <p className="text-sm font-semibold text-white group-hover:text-red-300 transition-colors">
                          {director.name}
                        </p>
                      </div>
                    </Link>
                  )}
                  {writers.slice(0, 2).map(writer => (
                    <Link key={writer.id} href={`/person/${writer.id}`}>
                      <div className="glass-card rounded-xl p-4 hover:border-red-500/20 transition-all group">
                        <p className="text-xs text-white/30 uppercase tracking-wide mb-1">{writer.job}</p>
                        <p className="text-sm font-semibold text-white group-hover:text-red-300 transition-colors">
                          {writer.name}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Box Office */}
              {(movie.budget || movie.revenue) && (
                <div className="grid grid-cols-2 gap-4">
                  {movie.budget ? (
                    <div className="glass-card rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-3.5 h-3.5 text-red-400" />
                        <p className="text-xs text-white/30 uppercase tracking-wide">Budget</p>
                      </div>
                      <p className="text-sm font-bold text-white">
                        ${(movie.budget / 1_000_000).toFixed(0)}M
                      </p>
                    </div>
                  ) : null}
                  {movie.revenue ? (
                    <div className="glass-card rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-3.5 h-3.5 text-green-400" />
                        <p className="text-xs text-white/30 uppercase tracking-wide">Box Office</p>
                      </div>
                      <p className="text-sm font-bold text-white">
                        ${(movie.revenue / 1_000_000).toFixed(0)}M
                      </p>
                    </div>
                  ) : null}
                </div>
              )}

              {/* Keywords */}
              {movie.keywords?.keywords && movie.keywords.keywords.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-3">Keywords</p>
                  <div className="flex flex-wrap gap-2">
                    {movie.keywords.keywords.slice(0, 12).map(kw => (
                      <Link key={kw.id} href={`/keyword/${kw.id}`}>
                        <span className="px-2.5 py-1 rounded-lg text-xs bg-white/5 border border-white/8 text-white/40 hover:text-white/70 hover:border-white/20 transition-all">
                          {kw.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Production Companies */}
              {movie.production_companies && movie.production_companies.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-3">Production</p>
                  <div className="flex flex-wrap gap-3">
                    {movie.production_companies.slice(0, 4).map(co => (
                      <div key={co.id} className="flex items-center gap-2 px-3 py-2 glass-card rounded-xl">
                        {co.logo_path ? (
                          <Image
                            src={tmdbImage.logo(co.logo_path, 'w92') || ''}
                            alt={co.name}
                            width={32}
                            height={20}
                            className="object-contain filter invert opacity-70"
                          />
                        ) : null}
                        <span className="text-xs text-white/50">{co.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── CAST ── */}
          {cast.length > 0 && <CastSection cast={cast} />}

          {/* ── TRAILERS ── */}
          {trailers.length > 0 && <TrailerSection videos={trailers} />}

          {/* Ad Slot — between content sections */}
          <div className="my-12 max-w-[1200px] mx-auto">
            <AdUnit format="auto" responsive />
          </div>

          {/* ── REVIEWS ── */}
          <ReviewsSection movieId={movie.id} type="movie" />

          {/* ── SIMILAR ── */}
          {(similar.length > 0 || recommendations.length > 0) && (
            <SimilarMovies
              similar={similar}
              recommendations={recommendations}
              type="movie"
            />
          )}
        </div>
      </div>
    </>
  )
}
