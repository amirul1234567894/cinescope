// LatestNews.tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Newspaper, ArrowRight, Clock } from 'lucide-react'

// Placeholder news — in production fetched from NewsAPI/Supabase
const NEWS_ITEMS = [
  {
    id: '1',
    title: 'The Most Anticipated Movies of 2025 You Cannot Miss',
    excerpt: 'From superhero blockbusters to indie darlings, we round up the must-see films of the year.',
    category: 'News',
    date: 'May 10, 2025',
    readTime: '4 min read',
    slug: 'most-anticipated-movies-2025',
    gradient: 'from-red-900/30 to-orange-900/20',
  },
  {
    id: '2',
    title: 'Bollywood\'s Box Office Renaissance: What\'s Driving the Comeback',
    excerpt: 'After a challenging few years, Bollywood is roaring back with record-breaking releases.',
    category: 'Bollywood',
    date: 'May 8, 2025',
    readTime: '6 min read',
    slug: 'bollywood-box-office-renaissance-2025',
    gradient: 'from-amber-900/30 to-yellow-900/20',
  },
  {
    id: '3',
    title: 'Korean Cinema Global Domination Continues with New Wave Directors',
    excerpt: 'South Korea\'s film industry continues to captivate global audiences with groundbreaking storytelling.',
    category: 'Korean',
    date: 'May 6, 2025',
    readTime: '5 min read',
    slug: 'korean-cinema-global-domination-2025',
    gradient: 'from-blue-900/30 to-cyan-900/20',
  },
]

export function LatestNews() {
  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Newspaper className="w-4 h-4 text-red-500" />
              <h2 className="section-title">Entertainment News</h2>
            </div>
            <p className="text-sm text-white/40">Latest from the world of cinema</p>
          </div>
          <Link href="/news" className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 transition-colors">
            All News <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {NEWS_ITEMS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link href={`/news/${item.slug}`}>
                <div className={`glass-card rounded-xl p-5 cursor-pointer group h-full bg-gradient-to-br ${item.gradient}`}>
                  <div className="genre-chip text-[10px] py-0.5 mb-4 inline-flex">{item.category}</div>
                  <h3 className="font-semibold text-white group-hover:text-red-300 transition-colors text-sm leading-snug mb-3 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-white/40 leading-relaxed line-clamp-3 mb-4">{item.excerpt}</p>
                  <div className="flex items-center gap-3 text-white/25">
                    <span className="text-[11px]">{item.date}</span>
                    <span className="w-0.5 h-0.5 rounded-full bg-white/20" />
                    <span className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-2.5 h-2.5" />
                      {item.readTime}
                    </span>
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
