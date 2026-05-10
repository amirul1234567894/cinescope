// UpcomingReleases.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Calendar, Star, ArrowRight, Clock } from 'lucide-react'
import type { TMDbMovie } from '@/types'
import { tmdbImage, slugify, getYear, formatRuntime } from '@/lib/tmdb'

export function UpcomingReleases({ items }: { items: TMDbMovie[] }) {
  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-red-500" />
              <h2 className="section-title">Upcoming Releases</h2>
            </div>
            <p className="text-sm text-white/40">Most anticipated movies coming soon</p>
          </div>
          <Link href="/movies/upcoming" className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 transition-colors">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.slice(0, 4).map((movie, i) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <Link href={`/movie/${slugify(movie.title, movie.id)}`}>
                <div className="glass-card rounded-xl overflow-hidden group cursor-pointer">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={tmdbImage.backdrop(movie.backdrop_path, 'w780')}
                      alt={movie.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    {/* Release date badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10">
                      <Calendar className="w-3 h-3 text-red-400" />
                      <span className="text-xs font-medium text-white">{movie.release_date}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white group-hover:text-red-300 transition-colors text-sm line-clamp-1 mb-1">
                      {movie.title}
                    </h3>
                    <p className="text-xs text-white/40 line-clamp-2 leading-relaxed">{movie.overview}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="genre-chip text-[10px] py-0.5">Upcoming</div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
