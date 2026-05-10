'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, X, Youtube } from 'lucide-react'
import type { TMDbVideo } from '@/types'

export function TrailerSection({ videos }: { videos: TMDbVideo[] }) {
  const [active, setActive] = useState<TMDbVideo | null>(null)

  const trailers = videos
    .filter((v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'))
    .slice(0, 6)

  if (!trailers.length) return null

  return (
    <section className="mt-12">
      <div className="flex items-center gap-2 mb-5">
        <Youtube className="w-4 h-4 text-red-500" />
        <h2 className="text-xl font-bold text-white font-display">Videos & Trailers</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {trailers.map((v) => (
          <button
            key={v.id}
            onClick={() => setActive(v)}
            className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer"
          >
            <Image
              src={`https://img.youtube.com/vi/${v.key}/hqdefault.jpg`}
              alt={v.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-11 h-11 rounded-full bg-red-600/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 text-white fill-white ml-0.5" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-xs text-white font-medium line-clamp-1 text-left">{v.name}</p>
              <p className="text-[10px] text-white/40 text-left">{v.type}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 backdrop-cinema flex items-center justify-center p-4"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-3">
                <p className="text-white font-semibold">{active.name}</p>
                <button
                  onClick={() => setActive(null)}
                  className="p-2 glass rounded-lg text-white/60 hover:text-white"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="aspect-video rounded-2xl overflow-hidden glass-card">
                <iframe
                  src={`https://www.youtube.com/embed/${active.key}?autoplay=1&rel=0&modestbranding=1`}
                  title={active.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <p className="text-xs text-white/20 mt-2 text-center">
                Trailer provided by YouTube. © Respective studios.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
