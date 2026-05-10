'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import {
  Play, Star, Bookmark, ChevronLeft, ChevronRight,
  Info, Sparkles
} from 'lucide-react'
import type { TMDbMovie } from '@/types'
import { tmdbImage, slugify, getYear } from '@/lib/tmdb'

interface HeroSectionProps {
  items: TMDbMovie[]
}

export function HeroSection({ items }: HeroSectionProps) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const [autoplay, setAutoplay] = useState(true)
  const [, setImageLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({ target: containerRef })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  const navigate = useCallback((dir: number) => {
    setDirection(dir)
    setImageLoaded(false)
    setCurrent(prev => (prev + dir + items.length) % items.length)
  }, [items.length])

  useEffect(() => {
    if (!autoplay) return
    const timer = setInterval(() => navigate(1), 7000)
    return () => clearInterval(timer)
  }, [autoplay, navigate])

  if (!items.length) return null

  const item = items[current]
  const slug = slugify(item.title, item.id)
  const backdropUrl = tmdbImage.backdrop(item.backdrop_path, 'original')

  const slideVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      scale: 1.05,
      x: dir > 0 ? 50 : -50,
    }),
    center: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
    exit: (dir: number) => ({
      opacity: 0,
      scale: 0.98,
      x: dir > 0 ? -50 : 50,
      transition: { duration: 0.5, ease: 'easeIn' },
    }),
  }

  const contentVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  }

  return (
    <section
      ref={containerRef}
      className="relative h-[90vh] min-h-[600px] max-h-[900px] overflow-hidden"
      onMouseEnter={() => setAutoplay(false)}
      onMouseLeave={() => setAutoplay(true)}
    >
      {/* ── BACKDROP ── */}
      <AnimatePresence custom={direction} initial={false}>
        <motion.div
          key={`backdrop-${current}`}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
          style={{ y }}
        >
          <Image
            src={backdropUrl}
            alt={item.title}
            fill
            priority
            quality={90}
            className="object-cover object-center"
            onLoad={() => setImageLoaded(true)}
            sizes="100vw"
          />

          {/* Cinematic overlays */}
          <div className="absolute inset-0 hero-gradient" />
          <div className="absolute inset-0 hero-bottom-fade" />
          <div className="absolute inset-0 bg-cinema-black/20" />

          {/* Vignette */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 30%, rgba(5,5,7,0.6) 100%)',
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* ── CONTENT ── */}
      <motion.div
        className="absolute inset-0 flex items-end pb-16 sm:pb-20 px-4 sm:px-8 lg:px-16"
        style={{ opacity }}
      >
        <div className="max-w-[1600px] w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${current}`}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="max-w-2xl"
            >
              {/* AI Pick badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4 border text-xs font-medium"
                style={{
                  background: 'rgba(220,38,38,0.12)',
                  borderColor: 'rgba(220,38,38,0.3)',
                  color: '#f87171',
                }}
              >
                <Sparkles className="w-3 h-3" />
                Trending #{current + 1} This Week
              </motion.div>

              {/* Title */}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-4">
                {item.title}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                {/* Rating */}
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-bold text-white">
                    {item.vote_average.toFixed(1)}
                  </span>
                  <span className="text-sm text-white/40">
                    ({(item.vote_count / 1000).toFixed(0)}K)
                  </span>
                </div>

                <span className="w-1 h-1 rounded-full bg-white/20" />

                {/* Year */}
                <span className="text-sm text-white/60">{getYear(item.release_date)}</span>

                {/* Language */}
                <span className="px-2 py-0.5 rounded bg-white/10 text-xs text-white/60 uppercase">
                  {item.original_language}
                </span>
              </div>

              {/* Overview */}
              <p className="text-sm sm:text-base text-white/70 leading-relaxed mb-8 line-clamp-3 max-w-xl">
                {item.overview}
              </p>

              {/* Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <Link href={`/movie/${slug}`} className="btn-primary ripple z-10">
                  <Play className="w-4 h-4 fill-white" />
                  Watch Trailer
                </Link>

                <Link href={`/movie/${slug}`} className="btn-glass z-10">
                  <Info className="w-4 h-4" />
                  More Info
                </Link>

                <button
                  className="p-3 rounded-xl bg-white/8 border border-white/10 hover:border-red-500/30 hover:bg-white/12 transition-all duration-200 z-10"
                  aria-label="Add to watchlist"
                >
                  <Bookmark className="w-4.5 h-4.5 text-white/70" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ── SLIDE INDICATORS ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
            className="relative h-1 rounded-full overflow-hidden transition-all duration-300"
            style={{ width: i === current ? '2rem' : '0.375rem', background: 'rgba(255,255,255,0.2)' }}
            aria-label={`Slide ${i + 1}`}
          >
            {i === current && (
              <motion.div
                className="absolute inset-y-0 left-0 bg-red-500"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 7, ease: 'linear' }}
                key={current}
              />
            )}
          </button>
        ))}
      </div>

      {/* ── NAV ARROWS ── */}
      <div className="absolute inset-y-0 left-4 flex items-center z-20">
        <button
          onClick={() => navigate(-1)}
          className="p-3 rounded-xl glass hover:bg-white/10 transition-all duration-200 group"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
        </button>
      </div>
      <div className="absolute inset-y-0 right-4 flex items-center z-20">
        <button
          onClick={() => navigate(1)}
          className="p-3 rounded-xl glass hover:bg-white/10 transition-all duration-200 group"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
        </button>
      </div>

      {/* ── THUMBNAIL STRIP (right side desktop) ── */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-3 z-20">
        {items.slice(0, 5).map((movie, i) => (
          <button
            key={movie.id}
            onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
            className={`relative w-20 h-12 rounded-lg overflow-hidden transition-all duration-300 ${
              i === current
                ? 'ring-2 ring-red-500 ring-offset-1 ring-offset-transparent scale-110'
                : 'opacity-50 hover:opacity-80'
            }`}
          >
            <Image
              src={tmdbImage.backdrop(movie.backdrop_path, 'w300')}
              alt={movie.title}
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>

      {/* ── SCROLL INDICATOR ── */}
      <div className="absolute bottom-8 right-8 hidden sm:flex flex-col items-center gap-2 z-20">
        <span className="text-[10px] text-white/20 uppercase tracking-widest rotate-90 origin-center mb-4">
          Scroll
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
      </div>
    </section>
  )
}
