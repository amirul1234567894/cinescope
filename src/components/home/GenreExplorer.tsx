'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Swords, Heart, Laugh, Ghost, Rocket, Globe, Microscope,
  Music, Baby, Drama, Badge, Film, TrendingUp, Sparkles
} from 'lucide-react'
import type { TMDbGenre } from '@/types'

interface GenreExplorerProps {
  genres: TMDbGenre[]
}

const GENRE_META: Record<number, { icon: React.ElementType; gradient: string; accent: string }> = {
  28: { icon: Swords, gradient: 'from-red-900/40 to-orange-900/30', accent: '#ef4444' },
  12: { icon: Globe, gradient: 'from-emerald-900/40 to-teal-900/30', accent: '#10b981' },
  16: { icon: Sparkles, gradient: 'from-purple-900/40 to-pink-900/30', accent: '#a855f7' },
  35: { icon: Laugh, gradient: 'from-yellow-900/40 to-amber-900/30', accent: '#f59e0b' },
  80: { icon: Badge, gradient: 'from-slate-900/60 to-gray-900/40', accent: '#64748b' },
  99: { icon: Film, gradient: 'from-blue-900/40 to-cyan-900/30', accent: '#3b82f6' },
  18: { icon: Drama, gradient: 'from-rose-900/40 to-red-900/30', accent: '#f43f5e' },
  10751: { icon: Baby, gradient: 'from-green-900/40 to-lime-900/30', accent: '#22c55e' },
  14: { icon: Rocket, gradient: 'from-violet-900/40 to-indigo-900/30', accent: '#8b5cf6' },
  36: { icon: Globe, gradient: 'from-amber-900/40 to-yellow-900/30', accent: '#d97706' },
  27: { icon: Ghost, gradient: 'from-gray-900/60 to-slate-900/40', accent: '#6b7280' },
  10402: { icon: Music, gradient: 'from-pink-900/40 to-rose-900/30', accent: '#ec4899' },
  9648: { icon: Microscope, gradient: 'from-indigo-900/40 to-blue-900/30', accent: '#6366f1' },
  10749: { icon: Heart, gradient: 'from-rose-900/50 to-pink-900/30', accent: '#fb7185' },
  878: { icon: Rocket, gradient: 'from-cyan-900/40 to-blue-900/30', accent: '#06b6d4' },
  53: { icon: TrendingUp, gradient: 'from-orange-900/40 to-red-900/30', accent: '#f97316' },
}

const DEFAULT_META = {
  icon: Film,
  gradient: 'from-gray-900/40 to-slate-900/30',
  accent: '#6b7280',
}

export function GenreExplorer({ genres }: GenreExplorerProps) {
  const displayGenres = genres.slice(0, 14)

  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <h2 className="section-title mb-1">Explore by Genre</h2>
          <p className="text-sm text-white/40">Find your next favorite by mood or genre</p>
        </motion.div>

        {/* Genre grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {displayGenres.map((genre, index) => {
            const meta = GENRE_META[genre.id] || DEFAULT_META
            const Icon = meta.icon

            return (
              <motion.div
                key={genre.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.04,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Link href={`/genre/${genre.id}`}>
                  <div
                    className={`
                      relative overflow-hidden rounded-xl p-4 cursor-pointer group
                      bg-gradient-to-br ${meta.gradient}
                      border border-white/6 hover:border-opacity-50
                      transition-all duration-300
                      hover:scale-105 hover:-translate-y-1
                    `}
                    style={
                      {
                        '--accent': meta.accent,
                        '--hover-border': `${meta.accent}50`,
                      } as React.CSSProperties
                    }
                    onMouseEnter={(e) => {
                      const el = e.currentTarget
                      el.style.borderColor = `${meta.accent}40`
                      el.style.boxShadow = `0 8px 30px ${meta.accent}25, 0 0 0 1px ${meta.accent}20`
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget
                      el.style.borderColor = ''
                      el.style.boxShadow = ''
                    }}
                  >
                    {/* Background glow */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `radial-gradient(circle at center, ${meta.accent}15 0%, transparent 70%)`,
                      }}
                    />

                    {/* Icon */}
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110"
                      style={{ background: `${meta.accent}20` }}
                    >
                      <Icon className="w-4.5 h-4.5" style={{ color: meta.accent }} />
                    </div>

                    {/* Name */}
                    <p className="text-xs sm:text-sm font-semibold text-white/80 group-hover:text-white transition-colors leading-tight">
                      {genre.name}
                    </p>

                    {/* Arrow on hover */}
                    <div
                      className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0"
                      style={{ color: meta.accent }}
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8.293 3.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L10.586 9H3a1 1 0 110-2h7.586L8.293 4.707a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
