'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Star, Bookmark, BookmarkCheck, Play, Clock, Calendar } from 'lucide-react'
import type { MovieCardProps } from '@/types'
import { tmdbImage, slugify, getYear, formatRuntime, getRatingColor } from '@/lib/tmdb'

export function MovieCard({
  id,
  title,
  posterPath,
  rating,
  year,
  type,
  genres,
  overview,
  runtime,
  size = 'md',
  priority = false,
}: MovieCardProps) {
  const [bookmarked, setBookmarked] = useState(false)
  const [hovered, setHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const slug = slugify(title, id)
  const href = `/${type}/${slug}`
  const posterUrl = tmdbImage.poster(posterPath, size === 'lg' ? 'w500' : 'w342')

  const sizeClasses = {
    sm: 'w-32 sm:w-36',
    md: 'w-40 sm:w-44 md:w-48',
    lg: 'w-44 sm:w-52 md:w-56',
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12
    setTilt({ x, y })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    setHovered(false)
  }

  return (
    <motion.div
      ref={cardRef}
      className={`movie-card ${sizeClasses[size]} flex-shrink-0 scroll-item`}
      style={{
        transform: `perspective(800px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        transition: hovered
          ? 'transform 0.1s ease'
          : 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-cinema-elevated">
        <Image
          src={posterUrl}
          alt={title}
          fill
          priority={priority}
          className="card-image object-cover"
          sizes={size === 'sm' ? '150px' : size === 'md' ? '200px' : '240px'}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />

        {/* Hover overlay content */}
        <div className="card-overlay absolute inset-0 flex flex-col justify-between p-3">
          {/* Top: Rating */}
          <div className="flex justify-between items-start">
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold glass"
              style={{ color: getRatingColor(rating) }}
            >
              <Star className="w-3 h-3 fill-current" />
              {rating.toFixed(1)}
            </div>

            {/* Bookmark */}
            <button
              onClick={(e) => {
                e.preventDefault()
                setBookmarked(!bookmarked)
              }}
              className="p-1.5 rounded-lg glass transition-all hover:scale-110 active:scale-95"
              aria-label={bookmarked ? 'Remove from watchlist' : 'Add to watchlist'}
            >
              {bookmarked ? (
                <BookmarkCheck className="w-3.5 h-3.5 text-red-400" />
              ) : (
                <Bookmark className="w-3.5 h-3.5 text-white/70" />
              )}
            </button>
          </div>

          {/* Bottom: Play + Info */}
          <div className="space-y-2">
            {/* Play button */}
            <div className="flex justify-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm border border-white/20 hover:bg-red-600/80 hover:border-red-400 transition-all duration-200">
                <Play className="w-4 h-4 text-white fill-white ml-0.5" />
              </div>
            </div>

            {/* Meta */}
            <div className="space-y-1">
              <p className="text-white text-xs font-semibold line-clamp-2 leading-tight">{title}</p>
              <div className="flex items-center gap-2 text-white/50">
                {year && (
                  <span className="flex items-center gap-1 text-[10px]">
                    <Calendar className="w-2.5 h-2.5" />
                    {year}
                  </span>
                )}
                {runtime && (
                  <span className="flex items-center gap-1 text-[10px]">
                    <Clock className="w-2.5 h-2.5" />
                    {formatRuntime(runtime)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Animated border glow on hover */}
        {hovered && (
          <div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              boxShadow: 'inset 0 0 0 1.5px rgba(220,38,38,0.5), 0 0 20px rgba(220,38,38,0.2)',
            }}
          />
        )}
      </div>

      {/* Card info below poster */}
      <Link href={href} className="block pt-2.5 px-0.5 group">
        <h3 className="text-xs sm:text-sm font-semibold text-white/90 group-hover:text-white transition-colors line-clamp-1">
          {title}
        </h3>
        <div className="flex items-center gap-1.5 mt-1">
          <Star className="w-3 h-3 text-yellow-400/70 fill-yellow-400/70" />
          <span className="text-[11px] text-white/40">{rating.toFixed(1)}</span>
          <span className="text-[11px] text-white/25">·</span>
          <span className="text-[11px] text-white/40">{year}</span>
        </div>
      </Link>

      {/* Invisible link covering the poster */}
      <Link href={href} className="absolute inset-0 z-0" aria-label={title} />
    </motion.div>
  )
}

// ─── SKELETON ────────────────────────────────────────────────────────────────

export function MovieCardSkeleton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-32 sm:w-36',
    md: 'w-40 sm:w-44 md:w-48',
    lg: 'w-44 sm:w-52 md:w-56',
  }

  return (
    <div className={`${sizeClasses[size]} flex-shrink-0`}>
      <div className="aspect-[2/3] skeleton rounded-xl" />
      <div className="pt-2.5 space-y-1.5">
        <div className="skeleton h-3.5 rounded w-4/5" />
        <div className="skeleton h-3 rounded w-1/2" />
      </div>
    </div>
  )
}
