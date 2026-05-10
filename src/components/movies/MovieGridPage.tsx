import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { tmdbImage, slugify, getYear, getRatingColor } from '@/lib/tmdb'
import type { TMDbMovie, TMDbTVShow } from '@/types'

interface MovieGridPageProps {
  title: string
  subtitle?: string
  items: (TMDbMovie | TMDbTVShow)[]
  type: 'movie' | 'tv'
  currentPage: number
  totalPages: number
  baseUrl: string
}

export function MovieGridPage({
  title,
  subtitle,
  items,
  type,
  currentPage,
  totalPages,
  baseUrl,
}: MovieGridPageProps) {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-2">
            {title}
          </h1>
          {subtitle && <p className="text-white/40 text-sm sm:text-base">{subtitle}</p>}
          <div className="neon-line mt-6 opacity-30" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.map((item) => {
            const movie = item as TMDbMovie
            const tv = item as TMDbTVShow
            const itemTitle = type === 'movie' ? movie.title : tv.name
            const date = type === 'movie' ? movie.release_date : tv.first_air_date
            const ratingColor = getRatingColor(item.vote_average)

            return (
              <Link
                key={item.id}
                href={`/${type}/${slugify(itemTitle, item.id)}`}
                className="group"
              >
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-cinema-elevated mb-2">
                  <Image
                    src={tmdbImage.poster(item.poster_path, 'w342')}
                    alt={itemTitle}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Rating */}
                  {item.vote_average > 0 && (
                    <div
                      className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-md glass text-xs font-bold"
                      style={{ color: ratingColor }}
                    >
                      <Star className="w-3 h-3 fill-current" />
                      {item.vote_average.toFixed(1)}
                    </div>
                  )}
                </div>

                <p className="text-xs sm:text-sm font-semibold text-white/80 group-hover:text-white transition-colors line-clamp-2">
                  {itemTitle}
                </p>
                <p className="text-[11px] text-white/30 mt-0.5">{getYear(date)}</p>
              </Link>
            )
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-3 mt-12">
            {currentPage > 1 && (
              <Link
                href={`${baseUrl}?page=${currentPage - 1}`}
                className="btn-glass px-5 py-2.5"
              >
                ← Previous
              </Link>
            )}
            <span className="flex items-center px-4 text-sm text-white/40">
              Page {currentPage} of {Math.min(totalPages, 500)}
            </span>
            {currentPage < Math.min(totalPages, 500) && (
              <Link
                href={`${baseUrl}?page=${currentPage + 1}`}
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
