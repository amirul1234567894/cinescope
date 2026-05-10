import type {
  TMDbMovie,
  TMDbTVShow,
  TMDbPerson,
  TMDbPaginatedResponse,
  TMDbGenre,
} from '@/types'

const TMDB_BASE = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p'

// ─── IMAGE URL HELPERS ───────────────────────────────────────────────────────

export const tmdbImage = {
  poster: (path: string | null, size: 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500') =>
    path ? `${TMDB_IMAGE_BASE}/${size}${path}` : '/placeholder-poster.svg',

  backdrop: (path: string | null, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280') =>
    path ? `${TMDB_IMAGE_BASE}/${size}${path}` : '/placeholder-backdrop.svg',

  profile: (path: string | null, size: 'w45' | 'w185' | 'h632' | 'original' = 'w185') =>
    path ? `${TMDB_IMAGE_BASE}/${size}${path}` : '/placeholder-avatar.svg',

  logo: (path: string | null, size: 'w45' | 'w92' | 'w154' | 'w185' | 'w300' | 'w500' | 'original' = 'w185') =>
    path ? `${TMDB_IMAGE_BASE}/${size}${path}` : null,
}

// ─── FETCH HELPER ────────────────────────────────────────────────────────────

async function tmdbFetch<T>(
  endpoint: string,
  params: Record<string, string | number | boolean> = {},
  revalidate = 3600
): Promise<T> {
  const apiKey = process.env.TMDB_API_KEY
  if (!apiKey) throw new Error('TMDB_API_KEY is not set')

  const url = new URL(`${TMDB_BASE}${endpoint}`)
  url.searchParams.set('api_key', apiKey)
  url.searchParams.set('language', 'en-US')

  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v))
  })

  // Retry once on failure (handles transient TMDb network issues)
  const fetchWithTimeout = async (timeoutMs = 10000) => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const res = await fetch(url.toString(), {
        next: { revalidate },
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      })
      clearTimeout(timer)
      return res
    } catch (err) {
      clearTimeout(timer)
      throw err
    }
  }

  let res: Response
  try {
    res = await fetchWithTimeout()
  } catch (err) {
    // Retry once after 500ms
    await new Promise((r) => setTimeout(r, 500))
    res = await fetchWithTimeout()
  }

  if (!res.ok) {
    throw new Error(`TMDb API error: ${res.status} ${res.statusText} for ${endpoint}`)
  }

  return res.json() as Promise<T>
}

// ─── MOVIES ─────────────────────────────────────────────────────────────────

export const tmdb = {
  // Trending
  trending: {
    movies: (timeWindow: 'day' | 'week' = 'week') =>
      tmdbFetch<TMDbPaginatedResponse<TMDbMovie>>(`/trending/movie/${timeWindow}`, {}, 1800),

    tv: (timeWindow: 'day' | 'week' = 'week') =>
      tmdbFetch<TMDbPaginatedResponse<TMDbTVShow>>(`/trending/tv/${timeWindow}`, {}, 1800),

    all: (timeWindow: 'day' | 'week' = 'day') =>
      tmdbFetch<TMDbPaginatedResponse<TMDbMovie | TMDbTVShow>>(`/trending/all/${timeWindow}`, {}, 900),
  },

  // Movies
  movies: {
    popular: (page = 1) =>
      tmdbFetch<TMDbPaginatedResponse<TMDbMovie>>('/movie/popular', { page }, 3600),

    topRated: (page = 1) =>
      tmdbFetch<TMDbPaginatedResponse<TMDbMovie>>('/movie/top_rated', { page }, 3600),

    upcoming: (page = 1) =>
      tmdbFetch<TMDbPaginatedResponse<TMDbMovie>>('/movie/upcoming', { page }, 7200),

    nowPlaying: (page = 1) =>
      tmdbFetch<TMDbPaginatedResponse<TMDbMovie>>('/movie/now_playing', { page }, 3600),

    detail: (id: number) =>
      tmdbFetch<TMDbMovie>(`/movie/${id}`, {
        append_to_response: 'credits,videos,similar,recommendations,images,keywords,external_ids,watch/providers',
      }, 86400),

    byGenre: (genreId: number, page = 1, language?: string) =>
      tmdbFetch<TMDbPaginatedResponse<TMDbMovie>>('/discover/movie', {
        with_genres: genreId,
        page,
        sort_by: 'popularity.desc',
        ...(language && { with_original_language: language }),
      }, 3600),

    discover: (params: Record<string, string | number | boolean>) =>
      tmdbFetch<TMDbPaginatedResponse<TMDbMovie>>('/discover/movie', params, 3600),

    byLanguage: (language: string, page = 1) =>
      tmdbFetch<TMDbPaginatedResponse<TMDbMovie>>('/discover/movie', {
        with_original_language: language,
        sort_by: 'popularity.desc',
        page,
      }, 3600),
  },

  // TV Shows
  tv: {
    popular: (page = 1) =>
      tmdbFetch<TMDbPaginatedResponse<TMDbTVShow>>('/tv/popular', { page }, 3600),

    topRated: (page = 1) =>
      tmdbFetch<TMDbPaginatedResponse<TMDbTVShow>>('/tv/top_rated', { page }, 3600),

    onTheAir: (page = 1) =>
      tmdbFetch<TMDbPaginatedResponse<TMDbTVShow>>('/tv/on_the_air', { page }, 3600),

    airingToday: (page = 1) =>
      tmdbFetch<TMDbPaginatedResponse<TMDbTVShow>>('/tv/airing_today', { page }, 1800),

    detail: (id: number) =>
      tmdbFetch<TMDbTVShow>(`/tv/${id}`, {
        append_to_response: 'credits,videos,similar,recommendations,images,keywords,external_ids,watch/providers',
      }, 86400),

    byGenre: (genreId: number, page = 1) =>
      tmdbFetch<TMDbPaginatedResponse<TMDbTVShow>>('/discover/tv', {
        with_genres: genreId,
        page,
        sort_by: 'popularity.desc',
      }, 3600),
  },

  // People
  people: {
    popular: (page = 1) =>
      tmdbFetch<TMDbPaginatedResponse<TMDbPerson>>('/person/popular', { page }, 7200),

    detail: (id: number) =>
      tmdbFetch<TMDbPerson>(`/person/${id}`, {
        append_to_response: 'movie_credits,tv_credits,images,tagged_images,external_ids',
      }, 86400),
  },

  // Search
  search: {
    multi: (query: string, page = 1) =>
      tmdbFetch<TMDbPaginatedResponse<TMDbMovie & TMDbTVShow & TMDbPerson>>(
        '/search/multi',
        { query, page, include_adult: false },
        300
      ),

    movies: (query: string, page = 1) =>
      tmdbFetch<TMDbPaginatedResponse<TMDbMovie>>(
        '/search/movie',
        { query, page, include_adult: false },
        300
      ),

    tv: (query: string, page = 1) =>
      tmdbFetch<TMDbPaginatedResponse<TMDbTVShow>>(
        '/search/tv',
        { query, page, include_adult: false },
        300
      ),

    people: (query: string, page = 1) =>
      tmdbFetch<TMDbPaginatedResponse<TMDbPerson>>(
        '/search/person',
        { query, page, include_adult: false },
        300
      ),
  },

  // Genres
  genres: {
    movies: () =>
      tmdbFetch<{ genres: TMDbGenre[] }>('/genre/movie/list', {}, 86400 * 7),
    tv: () =>
      tmdbFetch<{ genres: TMDbGenre[] }>('/genre/tv/list', {}, 86400 * 7),
  },

  // Certifications / Config
  configuration: () =>
    tmdbFetch<{ images: { secure_base_url: string; poster_sizes: string[] } }>('/configuration', {}, 86400),
}

// ─── SLUG HELPERS ────────────────────────────────────────────────────────────

export function slugify(title: string, id: number): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
  return `${slug}-${id}`
}

export function extractIdFromSlug(slug: string): number {
  const parts = slug.split('-')
  const id = parseInt(parts[parts.length - 1], 10)
  if (isNaN(id)) throw new Error(`Invalid slug: ${slug}`)
  return id
}

// ─── RUNTIME FORMAT ──────────────────────────────────────────────────────────

export function formatRuntime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

// ─── RATING COLOR ────────────────────────────────────────────────────────────

export function getRatingColor(rating: number): string {
  if (rating >= 8) return '#22c55e'
  if (rating >= 7) return '#84cc16'
  if (rating >= 6) return '#eab308'
  if (rating >= 5) return '#f97316'
  return '#ef4444'
}

// ─── YEAR FROM DATE ──────────────────────────────────────────────────────────

export function getYear(date: string | null | undefined): string {
  if (!date) return 'TBA'
  return new Date(date).getFullYear().toString()
}

// ─── OFFICIAL TRAILER ────────────────────────────────────────────────────────

export function getOfficialTrailer(videos: { key: string; site: string; type: string; official: boolean }[]) {
  if (!videos?.length) return null

  // Priority: official trailer > official teaser > any trailer > any video
  const officialTrailer = videos.find(v => v.site === 'YouTube' && v.official && v.type === 'Trailer')
  if (officialTrailer) return officialTrailer

  const officialTeaser = videos.find(v => v.site === 'YouTube' && v.official && v.type === 'Teaser')
  if (officialTeaser) return officialTeaser

  const anyTrailer = videos.find(v => v.site === 'YouTube' && v.type === 'Trailer')
  if (anyTrailer) return anyTrailer

  return videos.find(v => v.site === 'YouTube') ?? null
}
