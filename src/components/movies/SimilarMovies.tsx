'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star } from 'lucide-react'
import type { TMDbMovie, TMDbTVShow } from '@/types'
import { tmdbImage, slugify, getYear } from '@/lib/tmdb'

interface SimilarMoviesProps {
  similar: (TMDbMovie | TMDbTVShow)[]
  recommendations: (TMDbMovie | TMDbTVShow)[]
  type: 'movie' | 'tv'
}

export function SimilarMovies({ similar, recommendations, type }: SimilarMoviesProps) {
  const hasRecommendations = recommendations.length > 0
  const [tab, setTab] = useState<'similar' | 'recommendations'>(
    hasRecommendations ? 'recommendations' : 'similar'
  )
  const items = tab === 'similar' ? similar : recommendations

  const tabs: { id: 'recommendations' | 'similar'; show: boolean }[] = [
    { id: 'recommendations', show: hasRecommendations },
    { id: 'similar', show: similar.length > 0 },
  ]

  return (
    <section className="mt-12">
      <div className="flex items-center gap-6 mb-5 border-b border-white/8 pb-3">
        {tabs
          .filter((t) => t.show)
          .map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`text-sm font-semibold capitalize transition-colors pb-3 -mb-3 border-b-2 ${
                tab === t.id
                  ? 'text-white border-red-500'
                  : 'text-white/40 border-transparent hover:text-white/70'
              }`}
            >
              {t.id === 'recommendations' ? 'Recommendations' : 'Similar'}
            </button>
          ))}
      </div>

      {items.length === 0 ? (
        <p className="text-white/30 text-sm text-center py-8">No {tab} found.</p>
      ) : (
        <div className="scroll-container gap-4 pb-2">
          {items.map((item) => {
            const movie = item as TMDbMovie
            const tv = item as TMDbTVShow
            const title = type === 'movie' ? movie.title : tv.name
            const date = type === 'movie' ? movie.release_date : tv.first_air_date
            const href = `/${type}/${slugify(title, item.id)}`

            return (
              <Link key={item.id} href={href} className="scroll-item flex-shrink-0 w-36 sm:w-40 group">
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-cinema-elevated mb-2">
                  <Image
                    src={tmdbImage.poster(item.poster_path, 'w342')}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="160px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {item.vote_average > 0 && (
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs text-white font-medium">
                        {item.vote_average.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-xs font-semibold text-white/80 group-hover:text-white transition-colors line-clamp-2">
                  {title}
                </p>
                <p className="text-[10px] text-white/30 mt-0.5">{getYear(date)}</p>
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}
