'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Bookmark, Film, Tv, Star, Trash2, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase'
import { tmdbImage, slugify, getYear } from '@/lib/tmdb'
import toast from 'react-hot-toast'
import type { TMDbMovie } from '@/types'

interface WatchlistItem {
  id: string
  movie_id: number | null
  tv_id: number | null
  added_at: string
  // Hydrated from TMDb
  details?: {
    id: number
    title: string
    poster_path: string | null
    vote_average: number
    release_date?: string
    first_air_date?: string
  }
}

export default function WatchlistPage() {
  const { user, loading: authLoading } = useAuth()
  const [items, setItems] = useState<WatchlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'movie' | 'tv'>('all')

  useEffect(() => {
    if (!authLoading && user) {
      fetchWatchlist()
    } else if (!authLoading && !user) {
      setLoading(false)
    }
  }, [authLoading, user])

  const fetchWatchlist = async () => {
    if (!user) return
    setLoading(true)
    const supabase = createClient()

    const { data, error } = await supabase
      .from('watchlists')
      .select('*')
      .eq('user_id', user.id)
      .order('added_at', { ascending: false })

    if (error) {
      toast.error('Failed to load watchlist')
      setLoading(false)
      return
    }

    // Hydrate with TMDb data via API route
    const hydrated = await Promise.all(
      (data || []).map(async (item) => {
        try {
          const id = item.movie_id || item.tv_id
          const type = item.movie_id ? 'movie' : 'tv'
          const res = await fetch(`/api/tmdb/${type}/${id}`)
          const details = await res.json()
          return { ...item, details }
        } catch {
          return item
        }
      })
    )

    setItems(hydrated)
    setLoading(false)
  }

  const handleRemove = async (item: WatchlistItem) => {
    if (!user) return
    const supabase = createClient()
    await supabase.from('watchlists').delete().eq('id', item.id)
    setItems(items.filter((i) => i.id !== item.id))
    toast.success('Removed from watchlist')
  }

  const filtered = items.filter((item) => {
    if (filter === 'all') return true
    if (filter === 'movie') return !!item.movie_id
    return !!item.tv_id
  })

  // Not logged in
  if (!authLoading && !user) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mx-auto mb-6">
            <Bookmark className="w-8 h-8 text-white/20" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-3">Your Watchlist</h1>
          <p className="text-white/40 mb-8 leading-relaxed">
            Sign in to build your watchlist and sync it across all your devices.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/login?redirect=/watchlist" className="btn-primary">Sign In</Link>
            <Link href="/register" className="btn-glass">Create Account</Link>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Bookmark className="w-5 h-5 text-red-500" />
              <h1 className="font-display text-3xl font-bold text-white">My Watchlist</h1>
            </div>
            <p className="text-white/40 text-sm">{items.length} {items.length === 1 ? 'title' : 'titles'} saved</p>
          </div>

          <div className="flex items-center gap-1 glass-card rounded-xl p-1">
            {(['all', 'movie', 'tv'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  filter === f ? 'bg-red-600 text-white' : 'text-white/50 hover:text-white'
                }`}
              >
                {f === 'movie' && <Film className="w-3 h-3" />}
                {f === 'tv' && <Tv className="w-3 h-3" />}
                {f === 'all' ? 'All' : f === 'movie' ? 'Movies' : 'TV Shows'}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Bookmark className="w-12 h-12 text-white/15 mx-auto mb-4" />
            <p className="text-white/40">No titles in this category yet.</p>
            <Link href="/movies/trending" className="btn-primary inline-flex mt-6 text-sm">
              Browse Movies
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map((item) => {
              const type = item.movie_id ? 'movie' : 'tv'
              const id = item.movie_id || item.tv_id || 0
              if (!item.details) {
                return (
                  <div key={item.id} className="aspect-[2/3] skeleton rounded-xl" />
                )
              }
              const title = item.details.title
              const date = item.details.release_date || item.details.first_air_date

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group relative"
                >
                  <Link href={`/${type}/${slugify(title, id)}`}>
                    <div className="aspect-[2/3] rounded-xl overflow-hidden bg-cinema-elevated mb-2 relative">
                      <Image
                        src={tmdbImage.poster(item.details.poster_path, 'w342')}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="200px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      {item.details.vote_average > 0 && (
                        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-md glass text-xs font-bold text-yellow-400">
                          <Star className="w-3 h-3 fill-current" />
                          {item.details.vote_average.toFixed(1)}
                        </div>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-white/80 group-hover:text-white transition-colors line-clamp-2">
                      {title}
                    </p>
                    <p className="text-[11px] text-white/30">{getYear(date)}</p>
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      handleRemove(item)
                    }}
                    className="absolute top-2 right-2 p-2 rounded-lg glass opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:text-white"
                    aria-label="Remove from watchlist"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-white/70" />
                  </button>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
