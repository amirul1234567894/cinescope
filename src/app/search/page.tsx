import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Film, Tv, User, Star } from 'lucide-react'
import { tmdb, tmdbImage, slugify, getYear, getRatingColor } from '@/lib/tmdb'

interface Props { searchParams: Promise<{ q?: string; type?: string; page?: string }> }

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams
  return {
    title: q ? `Search: "${q}"` : 'Search',
    description: q ? `Search results for "${q}" on CineScope` : 'Search movies, TV shows and celebrities',
  }
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = '', type = 'all', page: pageStr = '1' } = await searchParams
  const page = parseInt(pageStr)

  let results: { id: number; title: string; poster_path: string | null; media_type: string; release_date?: string; first_air_date?: string; vote_average?: number; overview?: string; known_for_department?: string; profile_path?: string | null }[] = []
  let totalResults = 0
  let totalPages = 0

  if (q.trim()) {
    try {
      const data = await tmdb.search.multi(q, page)
      results = data.results as typeof results
      totalResults = data.total_results
      totalPages = data.total_pages
    } catch {/* noop */}
  }

  const TABS = [
    { id: 'all', label: 'All', icon: Search },
    { id: 'movie', label: 'Movies', icon: Film },
    { id: 'tv', label: 'TV Shows', icon: Tv },
    { id: 'person', label: 'People', icon: User },
  ]

  const filtered = type === 'all' ? results : results.filter(r => r.media_type === type)

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">
            {q ? `Results for "${q}"` : 'Search'}
          </h1>
          {q && (
            <p className="text-white/40 text-sm">
              Found {totalResults.toLocaleString()} results
            </p>
          )}
        </div>

        {/* Tabs */}
        {q && (
          <div className="flex items-center gap-1 mb-8 glass-card rounded-2xl p-2 max-w-fit">
            {TABS.map(tab => (
              <Link
                key={tab.id}
                href={`/search?q=${encodeURIComponent(q)}&type=${tab.id}`}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  type === tab.id
                    ? 'bg-red-600 text-white shadow-glow-red-sm'
                    : 'text-white/50 hover:text-white hover:bg-white/6'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </Link>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!q && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full glass flex items-center justify-center mb-6">
              <Search className="w-8 h-8 text-white/20" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Search CineScope</h2>
            <p className="text-white/40 max-w-sm">
              Find movies, TV shows, actors, directors and more from the world of cinema.
            </p>
          </div>
        )}

        {/* No results */}
        {q && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-white/50 text-lg">No results found for &quot;{q}&quot;</p>
            <p className="text-white/25 text-sm mt-2">Try different keywords or check your spelling.</p>
          </div>
        )}

        {/* Results Grid */}
        {filtered.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map((item) => {
              const isMovie = item.media_type === 'movie'
              const isTv = item.media_type === 'tv'
              const isPerson = item.media_type === 'person'

              const title = item.title || ''
              const date = item.release_date || item.first_air_date || ''
              const rating = item.vote_average || 0
              const ratingColor = getRatingColor(rating)
              const href = isPerson
                ? `/person/${item.id}`
                : `/${item.media_type}/${slugify(title, item.id)}`

              const imageUrl = isPerson
                ? tmdbImage.profile(item.profile_path as string | null, 'w185')
                : tmdbImage.poster(item.poster_path, 'w342')

              return (
                <Link key={`${item.media_type}-${item.id}`} href={href} className="group">
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-cinema-elevated mb-2">
                    <Image
                      src={imageUrl}
                      alt={title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Type badge */}
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wide ${
                        isMovie ? 'bg-red-600/80' :
                        isTv ? 'bg-blue-600/80' :
                        'bg-purple-600/80'
                      } text-white backdrop-blur-sm`}>
                        {isMovie ? 'Movie' : isTv ? 'TV' : 'Person'}
                      </span>
                    </div>

                    {/* Rating */}
                    {rating > 0 && (
                      <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-1 glass rounded-md px-1.5 py-0.5">
                          <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-white font-medium">{rating.toFixed(1)}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="text-xs font-semibold text-white/80 group-hover:text-white transition-colors line-clamp-2 leading-tight">
                    {title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {date && <span className="text-[10px] text-white/30">{getYear(date)}</span>}
                    {isPerson && item.known_for_department && (
                      <span className="text-[10px] text-white/30">{item.known_for_department}</span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-3 mt-12">
            {page > 1 && (
              <Link
                href={`/search?q=${encodeURIComponent(q)}&type=${type}&page=${page - 1}`}
                className="btn-glass px-5 py-2.5"
              >
                ← Previous
              </Link>
            )}
            <span className="flex items-center px-4 text-sm text-white/40">
              Page {page} of {Math.min(totalPages, 500)}
            </span>
            {page < Math.min(totalPages, 500) && (
              <Link
                href={`/search?q=${encodeURIComponent(q)}&type=${type}&page=${page + 1}`}
                className="btn-glass px-5 py-2.5"
              >
                Next →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
