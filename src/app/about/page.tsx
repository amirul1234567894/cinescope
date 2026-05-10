import type { Metadata } from 'next'
import { Film, Globe, Users, Shield, Star, Code2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About CineScope',
  description: 'Learn about CineScope — the premium movie and entertainment discovery platform.',
}

export default function AboutPage() {
  const stats = [
    { label: 'Movies & Shows', value: '1M+', icon: Film },
    { label: 'Languages', value: '50+', icon: Globe },
    { label: 'Regions', value: '9', icon: Users },
    { label: 'Legal & Safe', value: '100%', icon: Shield },
  ]

  const features = [
    { icon: Star, title: 'Premium Discovery', desc: 'Find the best movies, TV shows, and celebrities with our curated, data-driven platform.' },
    { icon: Film, title: 'TMDb Powered', desc: 'All movie data sourced from The Movie Database (TMDb) API — accurate, up-to-date, and comprehensive.' },
    { icon: Globe, title: 'Global Cinema', desc: 'From Hollywood blockbusters to Bengali indie films — we cover cinema from every corner of the world.' },
    { icon: Shield, title: 'Copyright Safe', desc: 'We never host pirated content. Only official trailers from YouTube and legal metadata from TMDb.' },
    { icon: Users, title: 'Community', desc: 'Write reviews, build watchlists, rate your favorites, and discover what others are watching.' },
    { icon: Code2, title: 'Open & Fast', desc: 'Built with Next.js 15, Supabase, and modern web technology for blazing-fast performance.' },
  ]

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-red-500/20 text-red-400 text-sm mb-6">
            <Film className="w-4 h-4" />
            Premium Entertainment Platform
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
            About <span className="gradient-text-red">CineScope</span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">
            A premium movie and entertainment discovery platform designed for cinema lovers worldwide.
            Explore, discover, rate, and discuss the films and shows that matter to you.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          {stats.map(stat => (
            <div key={stat.label} className="glass-card rounded-2xl p-6 text-center">
              <stat.icon className="w-6 h-6 text-red-400 mx-auto mb-3" />
              <p className="font-display text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-xs text-white/40">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {features.map(f => (
            <div key={f.title} className="glass-card rounded-2xl p-6 hover:border-red-500/20 transition-all">
              <div className="w-10 h-10 rounded-xl bg-red-600/15 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* TMDb Attribution */}
        <div className="glass-card rounded-2xl p-6 text-center border-red-500/10">
          <p className="text-sm text-white/40">
            This product uses the TMDb API but is not endorsed or certified by TMDb.
          </p>
          <p className="text-xs text-white/20 mt-1">
            Movie data © The Movie Database (TMDb) · Trailers © Respective studios via YouTube
          </p>
        </div>
      </div>
    </div>
  )
}
