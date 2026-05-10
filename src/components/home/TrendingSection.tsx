'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, TrendingUp, ArrowRight } from 'lucide-react'
import { MovieCard, MovieCardSkeleton } from '@/components/movies/MovieCard'
import type { TMDbMovie, TMDbTVShow } from '@/types'
import { getYear } from '@/lib/tmdb'

interface TrendingSectionProps {
  title: string
  subtitle?: string
  items: (TMDbMovie | TMDbTVShow)[]
  type: 'movie' | 'tv'
  viewAllHref: string
  isLoading?: boolean
}

export function TrendingSection({
  title,
  subtitle,
  items,
  type,
  viewAllHref,
  isLoading = false,
}: TrendingSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.clientWidth * 0.8
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  const onScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  return (
    <section className="relative px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-red-500" />
              <h2 className="section-title">{title}</h2>
            </div>
            {subtitle && (
              <p className="text-sm text-white/40">{subtitle}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            {/* Scroll controls */}
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-2 rounded-lg border transition-all duration-200 ${
                canScrollLeft
                  ? 'glass border-white/10 hover:border-red-500/30 text-white/70 hover:text-white'
                  : 'border-transparent text-white/20 cursor-not-allowed'
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`p-2 rounded-lg border transition-all duration-200 ${
                canScrollRight
                  ? 'glass border-white/10 hover:border-red-500/30 text-white/70 hover:text-white'
                  : 'border-transparent text-white/20 cursor-not-allowed'
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <Link
              href={viewAllHref}
              className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 transition-colors ml-2"
            >
              View All
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>

        {/* Red accent line */}
        <div className="neon-line mb-6 opacity-30" />

        {/* Scroll container */}
        <div className="relative">
          {/* Left fade */}
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-8 w-16 bg-gradient-to-r from-cinema-black to-transparent z-10 pointer-events-none" />
          )}

          {/* Right fade */}
          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-8 w-16 bg-gradient-to-l from-cinema-black to-transparent z-10 pointer-events-none" />
          )}

          <div
            ref={scrollRef}
            onScroll={onScroll}
            className="scroll-container gap-4 pb-4"
          >
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <MovieCardSkeleton key={i} size="md" />
                ))
              : items.map((item, index) => {
                  const isMovie = type === 'movie'
                  const movie = item as TMDbMovie
                  const tv = item as TMDbTVShow

                  return (
                    <MovieCard
                      key={item.id}
                      id={item.id}
                      title={isMovie ? movie.title : tv.name}
                      posterPath={item.poster_path}
                      rating={item.vote_average}
                      year={getYear(isMovie ? movie.release_date : tv.first_air_date)}
                      type={type}
                      priority={index < 4}
                      size="md"
                    />
                  )
                })}
          </div>
        </div>
      </div>
    </section>
  )
}
