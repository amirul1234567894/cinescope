'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Bookmark, BookmarkCheck, Heart, Share2, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase'

interface MovieActionsProps {
  movieId: number
  type: 'movie' | 'tv'
  title: string
}

export function MovieActions({ movieId, type, title }: MovieActionsProps) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [watchlisted, setWatchlisted] = useState(false)
  const [favorited, setFavorited] = useState(false)
  const [busy, setBusy] = useState(false)

  const col = type === 'movie' ? 'movie_id' : 'tv_id'

  // Check current state
  useEffect(() => {
    if (!user) return
    const supabase = createClient()
    Promise.all([
      supabase.from('watchlists').select('id').eq('user_id', user.id).eq(col, movieId).maybeSingle(),
      supabase.from('favorites').select('id').eq('user_id', user.id).eq(col, movieId).maybeSingle(),
    ]).then(([w, f]) => {
      setWatchlisted(!!w.data)
      setFavorited(!!f.data)
    })
  }, [user, movieId, col])

  const handleWatchlist = async () => {
    if (!user) {
      toast.error('Please sign in to save to watchlist')
      router.push(`/login?redirect=${window.location.pathname}`)
      return
    }
    setBusy(true)
    const supabase = createClient()

    if (watchlisted) {
      await supabase.from('watchlists').delete().eq('user_id', user.id).eq(col, movieId)
      setWatchlisted(false)
      toast.success('Removed from watchlist')
    } else {
      const { error } = await supabase.from('watchlists').insert({
        user_id: user.id,
        [col]: movieId,
      })
      if (error) {
        toast.error('Failed to save')
      } else {
        setWatchlisted(true)
        toast.success('Added to watchlist 🎬')
      }
    }
    setBusy(false)
  }

  const handleFavorite = async () => {
    if (!user) {
      toast.error('Please sign in to favorite')
      router.push(`/login?redirect=${window.location.pathname}`)
      return
    }
    setBusy(true)
    const supabase = createClient()

    if (favorited) {
      await supabase.from('favorites').delete().eq('user_id', user.id).eq(col, movieId)
      setFavorited(false)
      toast.success('Removed from favorites')
    } else {
      const { error } = await supabase.from('favorites').insert({
        user_id: user.id,
        [col]: movieId,
      })
      if (error) {
        toast.error('Failed to save')
      } else {
        setFavorited(true)
        toast.success('Added to favorites ❤️')
      }
    }
    setBusy(false)
  }

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: `${title} — CineScope`, url })
        return
      } catch {
        // fall through
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Link copied!')
    } catch {
      toast.error('Could not copy link')
    }
  }

  return (
    <div className="mt-6 w-full space-y-3">
      <button
        onClick={handleWatchlist}
        disabled={busy || authLoading}
        className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-50 ${
          watchlisted ? 'bg-red-600 text-white shadow-glow-red-sm' : 'btn-primary'
        }`}
      >
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> :
          watchlisted ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
        {watchlisted ? 'In Watchlist' : 'Add to Watchlist'}
      </button>

      <div className="flex gap-3">
        <button
          onClick={handleFavorite}
          disabled={busy || authLoading}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-sm border transition-all duration-200 disabled:opacity-50 ${
            favorited
              ? 'bg-red-600/20 border-red-500/50 text-red-400'
              : 'glass border-white/10 text-white/60 hover:text-white hover:border-red-500/30'
          }`}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
          {favorited ? 'Favorited' : 'Favorite'}
        </button>

        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-sm glass border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>
    </div>
  )
}
