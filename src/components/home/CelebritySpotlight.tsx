'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Users, ArrowRight } from 'lucide-react'
import type { TMDbPerson } from '@/types'
import { tmdbImage } from '@/lib/tmdb'

interface CelebritySpotlightProps {
  people: TMDbPerson[]
}

export function CelebritySpotlight({ people }: CelebritySpotlightProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === 'left' ? -500 : 500, behavior: 'smooth' })
  }

  const onScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanLeft(scrollLeft > 10)
    setCanRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-red-500" />
              <h2 className="section-title">Celebrity Spotlight</h2>
            </div>
            <p className="text-sm text-white/40">The most popular stars right now</p>
          </motion.div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canLeft}
              className={`p-2 rounded-lg border transition-all ${
                canLeft ? 'glass border-white/10 hover:border-red-500/30 text-white/70 hover:text-white' : 'border-transparent text-white/15 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canRight}
              className={`p-2 rounded-lg border transition-all ${
                canRight ? 'glass border-white/10 hover:border-red-500/30 text-white/70 hover:text-white' : 'border-transparent text-white/15 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <Link
              href="/celebrities"
              className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 transition-colors ml-2"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="neon-line mb-6 opacity-30" />

        {/* Scroll */}
        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="scroll-container gap-5 pb-4"
        >
          {people.map((person, index) => (
            <CelebrityCard key={person.id} person={person} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CelebrityCard({ person, index }: { person: TMDbPerson; index: number }) {
  const [hovered, setHovered] = useState(false)
  const profileUrl = tmdbImage.profile(person.profile_path, 'w185')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="scroll-item flex-shrink-0 w-28 sm:w-32"
    >
      <Link href={`/person/${person.id}`} className="group block text-center">
        {/* Avatar */}
        <div
          className="relative mx-auto mb-3"
          style={{ width: '80px', height: '80px' }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div
            className={`absolute inset-0 rounded-full transition-all duration-300 ${
              hovered ? 'shadow-[0_0_0_2px_rgba(220,38,38,0.7),0_0_20px_rgba(220,38,38,0.3)]' : 'shadow-[0_0_0_2px_rgba(255,255,255,0.1)]'
            }`}
          />
          <Image
            src={profileUrl}
            alt={person.name}
            width={80}
            height={80}
            className="rounded-full object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          {/* Popularity ring */}
          <div
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-[9px] font-bold text-white border-2 border-cinema-black"
          >
            {index + 1}
          </div>
        </div>

        <p className="text-xs font-semibold text-white/80 group-hover:text-white transition-colors line-clamp-2 leading-tight">
          {person.name}
        </p>
        <p className="text-[10px] text-white/30 mt-0.5">{person.known_for_department}</p>
      </Link>
    </motion.div>
  )
}
