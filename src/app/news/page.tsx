import type { Metadata } from 'next'
import Link from 'next/link'
import { Newspaper, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Entertainment News',
  description: 'Latest movie news, trailer drops, casting announcements and more.',
}

const NEWS_ITEMS = [
  {
    id: '1',
    title: 'The Most Anticipated Movies of 2026 You Cannot Miss',
    excerpt: 'From superhero blockbusters to indie darlings, we round up the must-see films of the year.',
    category: 'News',
    date: 'May 10, 2026',
    readTime: '4 min read',
    slug: 'most-anticipated-movies-2026',
    gradient: 'from-red-900/30 to-orange-900/20',
  },
  {
    id: '2',
    title: "Bollywood's Box Office Renaissance: What's Driving the Comeback",
    excerpt: 'After a challenging few years, Bollywood is roaring back with record-breaking releases.',
    category: 'Bollywood',
    date: 'May 8, 2026',
    readTime: '6 min read',
    slug: 'bollywood-box-office-renaissance',
    gradient: 'from-amber-900/30 to-yellow-900/20',
  },
  {
    id: '3',
    title: 'Korean Cinema Global Domination Continues with New Wave Directors',
    excerpt: "South Korea's film industry continues to captivate global audiences with groundbreaking storytelling.",
    category: 'Korean',
    date: 'May 6, 2026',
    readTime: '5 min read',
    slug: 'korean-cinema-global-domination',
    gradient: 'from-blue-900/30 to-cyan-900/20',
  },
  {
    id: '4',
    title: 'Streaming Wars: The OTT Platforms Reshaping Cinema',
    excerpt: 'How Netflix, Prime Video, and Disney+ are changing how we watch movies.',
    category: 'OTT',
    date: 'May 4, 2026',
    readTime: '7 min read',
    slug: 'streaming-wars-ott-platforms',
    gradient: 'from-purple-900/30 to-pink-900/20',
  },
  {
    id: '5',
    title: 'The Return of Practical Effects: Why Filmmakers Are Going Old-School',
    excerpt: 'A new generation of directors is rejecting CGI in favor of tangible, real-world effects.',
    category: 'Industry',
    date: 'May 2, 2026',
    readTime: '5 min read',
    slug: 'return-of-practical-effects',
    gradient: 'from-emerald-900/30 to-teal-900/20',
  },
  {
    id: '6',
    title: 'Anime Goes Mainstream: How Japanese Animation Conquered the World',
    excerpt: 'Studio Ghibli to MAPPA — the global rise of anime in Western markets.',
    category: 'Anime',
    date: 'April 30, 2026',
    readTime: '6 min read',
    slug: 'anime-mainstream-rise',
    gradient: 'from-pink-900/30 to-rose-900/20',
  },
]

export default function NewsPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-600/20 flex items-center justify-center">
            <Newspaper className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white">
              Entertainment News
            </h1>
            <p className="text-white/40 text-sm sm:text-base mt-1">
              The latest from the world of cinema
            </p>
          </div>
        </div>

        <div className="neon-line mb-10 opacity-30" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {NEWS_ITEMS.map((item) => (
            <Link key={item.id} href={`/news/${item.slug}`}>
              <div className={`glass-card rounded-2xl p-6 cursor-pointer group h-full bg-gradient-to-br ${item.gradient} hover:border-red-500/30 transition-all duration-300`}>
                <div className="genre-chip text-[10px] py-0.5 mb-4 inline-flex">{item.category}</div>
                <h3 className="font-semibold text-white group-hover:text-red-300 transition-colors text-base leading-snug mb-3 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed line-clamp-3 mb-4">
                  {item.excerpt}
                </p>
                <div className="flex items-center gap-3 text-white/30">
                  <span className="text-xs">{item.date}</span>
                  <span className="w-0.5 h-0.5 rounded-full bg-white/20" />
                  <span className="flex items-center gap-1 text-xs">
                    <Clock className="w-3 h-3" />
                    {item.readTime}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <p className="text-xs text-white/20 text-center mt-12">
          News articles are placeholder content. Connect NewsAPI or your CMS for live news.
        </p>
      </div>
    </div>
  )
}
