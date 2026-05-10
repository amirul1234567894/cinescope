'use client'
// ─── CastSection ────────────────────────────────────────────────────────────
import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Users, ChevronLeft, ChevronRight } from 'lucide-react'
import type { TMDbCastMember } from '@/types'
import { tmdbImage } from '@/lib/tmdb'

export function CastSection({ cast }: { cast: TMDbCastMember[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const scroll = (dir: 'left' | 'right') =>
    ref.current?.scrollBy({ left: dir === 'left' ? -400 : 400, behavior: 'smooth' })

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-red-500" />
          <h2 className="text-xl font-bold text-white font-display">Cast</h2>
        </div>
        <div className="flex gap-2">
          {[ChevronLeft, ChevronRight].map((Icon, i) => (
            <button
              key={i}
              onClick={() => scroll(i === 0 ? 'left' : 'right')}
              className="p-2 glass rounded-lg border border-white/8 hover:border-red-500/30 text-white/60 hover:text-white transition-all"
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      <div ref={ref} className="scroll-container gap-4 pb-2">
        {cast.map((member, i) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="scroll-item flex-shrink-0 w-28"
          >
            <Link href={`/person/${member.id}`} className="group block text-center">
              <div className="relative w-20 h-20 mx-auto mb-2 rounded-full overflow-hidden">
                <Image
                  src={tmdbImage.profile(member.profile_path)}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="80px"
                />
                <div className="absolute inset-0 rounded-full ring-1 ring-white/10 group-hover:ring-red-500/40 transition-all" />
              </div>
              <p className="text-xs font-semibold text-white/80 group-hover:text-white transition-colors line-clamp-1">
                {member.name}
              </p>
              <p className="text-[10px] text-white/30 line-clamp-1 mt-0.5">{member.character}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
