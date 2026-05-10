// RegionalCinema.tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Globe } from 'lucide-react'
import { REGION_CONFIG, type CinemaRegion } from '@/types'

const REGIONS: CinemaRegion[] = ['hollywood', 'bollywood', 'tollywood', 'bengali', 'korean', 'anime', 'web-series', 'ott-originals', 'international']

export function RegionalCinema() {
  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Globe className="w-4 h-4 text-red-500" />
          <h2 className="section-title">World Cinema</h2>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
          {REGIONS.map((region, i) => {
            const config = REGION_CONFIG[region]
            return (
              <motion.div
                key={region}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
              >
                <Link href={`/genres/${region}`}>
                  <div className="glass-card rounded-xl p-4 text-center cursor-pointer group hover:border-red-500/30 transition-all duration-300 hover:-translate-y-1">
                    <div className="text-2xl mb-2">{config.emoji}</div>
                    <p className="text-[10px] sm:text-xs font-medium text-white/60 group-hover:text-white transition-colors leading-tight">
                      {config.label}
                    </p>
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
