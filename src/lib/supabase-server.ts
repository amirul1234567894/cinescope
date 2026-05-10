// Server-only Supabase utilities
// ⚠️ Only import from Server Components, Server Actions, or Route Handlers
// (Don't import from "use client" components — they'll get a build error)

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { CookieOptions } from '@supabase/ssr'

// Server-side Supabase client
// ⚠️ Only import from Server Components, Server Actions, or Route Handlers
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch {}
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch {}
        },
      },
    }
  )
}

// ─── AUTH HELPERS (server-only) ──────────────────────────────────────────────

export async function getSession() {
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function getUser() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getUserProfile(userId: string) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) return null
  return data
}

export async function updateUserProfile(userId: string, updates: Record<string, unknown>) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()

  return { data, error }
}

// ─── WATCHLIST (server) ──────────────────────────────────────────────────────

export async function addToWatchlist(
  userId: string,
  itemId: number,
  type: 'movie' | 'tv'
) {
  const supabase = await createServerSupabaseClient()
  const payload = type === 'movie'
    ? { user_id: userId, movie_id: itemId }
    : { user_id: userId, tv_id: itemId }

  const { data, error } = await supabase
    .from('watchlists')
    .upsert(payload, { onConflict: type === 'movie' ? 'user_id,movie_id' : 'user_id,tv_id' })
    .select()

  return { data, error }
}

export async function removeFromWatchlist(
  userId: string,
  itemId: number,
  type: 'movie' | 'tv'
) {
  const supabase = await createServerSupabaseClient()
  const query = supabase.from('watchlists').delete().eq('user_id', userId)
  if (type === 'movie') query.eq('movie_id', itemId)
  else query.eq('tv_id', itemId)
  return query
}

export async function isInWatchlist(
  userId: string,
  itemId: number,
  type: 'movie' | 'tv'
) {
  const supabase = await createServerSupabaseClient()
  const col = type === 'movie' ? 'movie_id' : 'tv_id'
  const { data } = await supabase
    .from('watchlists')
    .select('id')
    .eq('user_id', userId)
    .eq(col, itemId)
    .maybeSingle()
  return !!data
}

// ─── REVIEWS (server) ────────────────────────────────────────────────────────

export async function getReviews(itemId: number, type: 'movie' | 'tv', page = 1, limit = 10) {
  const supabase = await createServerSupabaseClient()
  const col = type === 'movie' ? 'movie_id' : 'tv_id'

  const { data, count, error } = await supabase
    .from('reviews')
    .select('*, profiles(id,username,avatar_url)', { count: 'exact' })
    .eq(col, itemId)
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  return { data, count, error }
}

export async function submitReview(
  userId: string,
  itemId: number,
  type: 'movie' | 'tv',
  rating: number,
  content: string,
  spoiler = false
) {
  const supabase = await createServerSupabaseClient()
  const col = type === 'movie' ? 'movie_id' : 'tv_id'

  const { data, error } = await supabase
    .from('reviews')
    .upsert(
      {
        user_id: userId,
        [col]: itemId,
        rating,
        content,
        spoiler,
        updated_at: new Date().toISOString(),
      },
      { onConflict: `user_id,${col}` }
    )
    .select()

  return { data, error }
}

// ─── FAVORITES (server) ──────────────────────────────────────────────────────

export async function toggleFavorite(userId: string, itemId: number, type: 'movie' | 'tv') {
  const supabase = await createServerSupabaseClient()
  const col = type === 'movie' ? 'movie_id' : 'tv_id'

  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq(col, itemId)
    .maybeSingle()

  if (existing) {
    await supabase.from('favorites').delete().eq('id', existing.id)
    return { favorited: false }
  } else {
    await supabase.from('favorites').insert({ user_id: userId, [col]: itemId })
    return { favorited: true }
  }
}
