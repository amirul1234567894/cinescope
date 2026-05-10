import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, MapPin, Film, Tv, ExternalLink, Star, Users } from 'lucide-react'
import { tmdb, tmdbImage, getYear } from '@/lib/tmdb'

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params
    const person = await tmdb.people.detail(parseInt(id))
    return {
      title: `${person.name} — Actor, Director & More`,
      description: person.biography?.slice(0, 155) || `${person.name} filmography, biography and more.`,
      openGraph: {
        title: `${person.name} — CineScope`,
        images: [{ url: tmdbImage.profile(person.profile_path, 'h632') }],
      },
    }
  } catch {
    return { title: 'Celebrity Not Found' }
  }
}

export default async function PersonPage({ params }: Props) {
  const { id: rawId } = await params
  const personId = parseInt(rawId)
  if (isNaN(personId)) notFound()

  let person
  try { person = await tmdb.people.detail(personId) } catch { notFound() }

  const movieCredits = person.movie_credits?.cast?.slice(0, 20) || []
  const tvCredits = person.tv_credits?.cast?.slice(0, 12) || []
  const age = person.birthday
    ? Math.floor((Date.now() - new Date(person.birthday).getTime()) / (365.25 * 24 * 3600 * 1000))
    : null

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── HEADER ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10 mb-14">

          {/* Profile Photo */}
          <div className="flex flex-col items-center lg:items-start">
            <div className="relative w-56 sm:w-64 lg:w-full max-w-[280px]">
              <div className="aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
                <Image
                  src={tmdbImage.profile(person.profile_path, 'h632')}
                  alt={person.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="280px"
                />
              </div>
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-b from-transparent via-red-950/10 to-transparent rounded-3xl pointer-events-none" />
            </div>

            {/* Quick Info */}
            <div className="mt-6 w-full max-w-[280px] space-y-3">
              {person.birthday && (
                <div className="glass-card rounded-xl p-3 flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-wide">Born</p>
                    <p className="text-xs font-medium text-white">{person.birthday}{age && ` (age ${age})`}</p>
                  </div>
                </div>
              )}
              {person.place_of_birth && (
                <div className="glass-card rounded-xl p-3 flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-wide">Birthplace</p>
                    <p className="text-xs font-medium text-white line-clamp-2">{person.place_of_birth}</p>
                  </div>
                </div>
              )}
              {person.known_for_department && (
                <div className="glass-card rounded-xl p-3 flex items-center gap-3">
                  <Film className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-wide">Known For</p>
                    <p className="text-xs font-medium text-white">{person.known_for_department}</p>
                  </div>
                </div>
              )}

              {/* Social links */}
              {person.external_ids && (
                <div className="flex gap-2 flex-wrap">
                  {person.external_ids.imdb_id && (
                    <a
                      href={`https://www.imdb.com/name/${person.external_ids.imdb_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-glass text-xs py-2 px-3"
                    >
                      <ExternalLink className="w-3 h-3" />
                      IMDb
                    </a>
                  )}
                  {person.external_ids.instagram_id && (
                    <a
                      href={`https://instagram.com/${person.external_ids.instagram_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-glass text-xs py-2 px-3"
                    >
                      Instagram
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="genre-chip text-[10px]">{person.known_for_department}</span>
                <span className="text-white/20 text-xs">
                  Popularity {person.popularity?.toFixed(0)}
                </span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6">
                {person.name}
              </h1>
            </div>

            {person.biography ? (
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-3">Biography</h2>
                <p className="text-white/70 leading-relaxed text-sm whitespace-pre-line line-clamp-[12]">
                  {person.biography}
                </p>
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-6">
                <p className="text-white/30 text-sm">No biography available.</p>
              </div>
            )}

            {/* Also known as */}
            {person.also_known_as && person.also_known_as.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-2">Also Known As</p>
                <div className="flex flex-wrap gap-2">
                  {person.also_known_as.slice(0, 6).map((name, i) => (
                    <span key={i} className="px-3 py-1 rounded-full text-xs glass border border-white/8 text-white/50">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── FILMOGRAPHY ── */}
        {movieCredits.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Film className="w-4 h-4 text-red-500" />
              <h2 className="section-title">Movie Appearances</h2>
            </div>
            <div className="scroll-container gap-4 pb-4">
              {movieCredits.map((movie: { id: number; title: string; poster_path: string | null; vote_average: number; release_date: string; character: string }) => (
                <Link key={`${movie.id}-${movie.character}`} href={`/movie/${movie.id}`} className="scroll-item flex-shrink-0 w-36 group">
                  <div className="aspect-[2/3] rounded-xl overflow-hidden bg-cinema-elevated relative mb-2">
                    <Image
                      src={tmdbImage.poster(movie.poster_path, 'w342')}
                      alt={movie.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="144px"
                    />
                    {movie.vote_average > 0 && (
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-md glass">
                        <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-[10px] text-white font-medium">{movie.vote_average.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-white/80 group-hover:text-white transition-colors line-clamp-2">{movie.title}</p>
                  {movie.character && <p className="text-[10px] text-white/30 mt-0.5 line-clamp-1">as {movie.character}</p>}
                  <p className="text-[10px] text-white/20">{getYear(movie.release_date)}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── TV APPEARANCES ── */}
        {tvCredits.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Tv className="w-4 h-4 text-red-500" />
              <h2 className="section-title">TV Appearances</h2>
            </div>
            <div className="scroll-container gap-4 pb-4">
              {tvCredits.map((show: { id: number; name: string; poster_path: string | null; vote_average: number; first_air_date: string; character: string }) => (
                <Link key={`${show.id}-${show.character}`} href={`/tv/${show.id}`} className="scroll-item flex-shrink-0 w-36 group">
                  <div className="aspect-[2/3] rounded-xl overflow-hidden bg-cinema-elevated relative mb-2">
                    <Image
                      src={tmdbImage.poster(show.poster_path, 'w342')}
                      alt={show.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="144px"
                    />
                  </div>
                  <p className="text-xs font-semibold text-white/80 group-hover:text-white transition-colors line-clamp-2">{show.name}</p>
                  {show.character && <p className="text-[10px] text-white/30 mt-0.5 line-clamp-1">as {show.character}</p>}
                  <p className="text-[10px] text-white/20">{getYear(show.first_air_date)}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
