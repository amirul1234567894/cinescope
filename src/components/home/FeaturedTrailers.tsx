'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Play, Star, Youtube } from 'lucide-react'
import type { TMDbMovie } from '@/types'
import { tmdbImage, slugify, getYear } from '@/lib/tmdb'

interface FeaturedTrailersProps {
  movies: TMDbMovie[]
}

export function FeaturedTrailers({ movies }: FeaturedTrailersProps) {
  const trailerMovies = movies.slice(0, 6)

  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-red-600/20 flex items-center justify-center">
            <Youtube className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <h2 className="section-title">Featured Movies</h2>
            <p className="text-sm text-white/40">Click to view details and watch official trailers</p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trailerMovies.map((movie, index) => (
            <TrailerCard key={movie.id} movie={movie} index={index} />
          ))}
        </div>

        <p className="text-xs text-white/20 mt-4 text-center">
          All trailers are official content from YouTube. CineScope does not host any video content.
        </p>
      </div>
    </section>
  )
}

function TrailerCard({ movie, index }: { movie: TMDbMovie; index: number }) {
  const backdropUrl = tmdbImage.backdrop(movie.backdrop_path, 'w780')
  const slug = slugify(movie.title, movie.id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
    >
      <Link href={`/movie/${slug}`} className="block group">
        <div className="relative aspect-video rounded-xl overflow-hidden cursor-pointer">
          <Image
            src={backdropUrl}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center border-2 border-white/50 bg-black/40 backdrop-blur-sm group-hover:bg-red-600/80 group-hover:border-red-400 group-hover:scale-110 transition-all duration-300">
              <Play className="w-6 h-6 text-white fill-white ml-1" />
            </div>
          </div>

          {/* YouTube badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md bg-red-600/80 backdrop-blur-sm">
            <Youtube className="w-3 h-3 text-white" />
            <span className="text-[10px] text-white font-semibold">Official</span>
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <p className="text-sm font-semibold text-white line-clamp-1 group-hover:text-red-300 transition-colors">
              {movie.title}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs text-white/60">{movie.vote_average.toFixed(1)}</span>
              <span className="text-xs text-white/30">·</span>
              <span className="text-xs text-white/40">{getYear(movie.release_date)}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
