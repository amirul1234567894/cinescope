// ─── TMDB API TYPES ─────────────────────────────────────────────────────────

export interface TMDbMovie {
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  popularity: number
  adult: boolean
  genre_ids: number[]
  genres?: TMDbGenre[]
  original_language: string
  runtime?: number
  status?: string
  tagline?: string
  budget?: number
  revenue?: number
  homepage?: string
  imdb_id?: string
  production_companies?: TMDbProductionCompany[]
  production_countries?: { iso_3166_1: string; name: string }[]
  spoken_languages?: { english_name: string; iso_639_1: string; name: string }[]
  belongs_to_collection?: { id: number; name: string; poster_path: string; backdrop_path: string }
  videos?: { results: TMDbVideo[] }
  credits?: TMDbCredits
  similar?: { results: TMDbMovie[] }
  recommendations?: { results: TMDbMovie[] }
  images?: TMDbImages
  keywords?: { keywords: TMDbKeyword[] }
  external_ids?: TMDbExternalIds
  'watch/providers'?: TMDbWatchProviders
}

export interface TMDbTVShow {
  id: number
  name: string
  original_name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  last_air_date?: string
  vote_average: number
  vote_count: number
  popularity: number
  genre_ids: number[]
  genres?: TMDbGenre[]
  original_language: string
  number_of_seasons?: number
  number_of_episodes?: number
  status?: string
  type?: string
  tagline?: string
  homepage?: string
  networks?: { id: number; name: string; logo_path: string }[]
  seasons?: TMDbSeason[]
  credits?: TMDbCredits
  videos?: { results: TMDbVideo[] }
  similar?: { results: TMDbTVShow[] }
  recommendations?: { results: TMDbTVShow[] }
  created_by?: { id: number; name: string; profile_path: string }[]
}

export interface TMDbPerson {
  id: number
  name: string
  biography: string
  birthday: string | null
  deathday: string | null
  place_of_birth: string | null
  profile_path: string | null
  known_for_department: string
  popularity: number
  adult: boolean
  gender: number
  also_known_as: string[]
  homepage: string | null
  imdb_id: string | null
  external_ids?: TMDbExternalIds
  movie_credits?: { cast: TMDbCastMember[]; crew: TMDbCrewMember[] }
  tv_credits?: { cast: TMDbCastMember[]; crew: TMDbCrewMember[] }
  images?: { profiles: { file_path: string; width: number; height: number }[] }
  tagged_images?: { results: { file_path: string; media_type: string }[] }
}

export interface TMDbGenre {
  id: number
  name: string
}

export interface TMDbVideo {
  id: string
  key: string
  name: string
  site: string
  type: string
  official: boolean
  published_at: string
  size: number
}

export interface TMDbCredits {
  cast: TMDbCastMember[]
  crew: TMDbCrewMember[]
}

export interface TMDbCastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
  known_for_department: string
  popularity: number
  cast_id: number
  credit_id: string
}

export interface TMDbCrewMember {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
  credit_id: string
  popularity: number
}

export interface TMDbProductionCompany {
  id: number
  name: string
  logo_path: string | null
  origin_country: string
}

export interface TMDbImages {
  backdrops: { file_path: string; width: number; height: number; vote_average: number }[]
  posters: { file_path: string; width: number; height: number; vote_average: number }[]
  logos: { file_path: string; width: number; height: number }[]
}

export interface TMDbKeyword {
  id: number
  name: string
}

export interface TMDbExternalIds {
  imdb_id?: string
  wikidata_id?: string
  facebook_id?: string
  instagram_id?: string
  twitter_id?: string
}

export interface TMDbWatchProviders {
  results: {
    [countryCode: string]: {
      link: string
      flatrate?: TMDbProvider[]
      rent?: TMDbProvider[]
      buy?: TMDbProvider[]
      free?: TMDbProvider[]
    }
  }
}

export interface TMDbProvider {
  provider_id: number
  provider_name: string
  logo_path: string
  display_priority: number
}

export interface TMDbSeason {
  id: number
  season_number: number
  name: string
  overview: string
  poster_path: string | null
  air_date: string | null
  episode_count: number
}

export interface TMDbPaginatedResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

// ─── SUPABASE / APP TYPES ────────────────────────────────────────────────────

export interface User {
  id: string
  email: string
  username: string
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  created_at: string
  updated_at: string
  is_admin: boolean
  subscription_tier: 'free' | 'premium'
  preferences: UserPreferences
}

export interface UserPreferences {
  favorite_genres: number[]
  preferred_languages: string[]
  notifications_enabled: boolean
  theme: 'dark' | 'darker'
  show_adult_content: boolean
}

export interface Review {
  id: string
  user_id: string
  movie_id?: number
  tv_id?: number
  rating: number
  content: string
  spoiler: boolean
  created_at: string
  updated_at: string
  likes_count: number
  user?: User
}

export interface Comment {
  id: string
  user_id: string
  movie_id?: number
  tv_id?: number
  content: string
  parent_id: string | null
  created_at: string
  updated_at: string
  likes_count: number
  user?: User
  replies?: Comment[]
}

export interface WatchlistItem {
  id: string
  user_id: string
  movie_id?: number
  tv_id?: number
  added_at: string
  priority: 'low' | 'medium' | 'high'
  notes: string | null
}

export interface Favorite {
  id: string
  user_id: string
  movie_id?: number
  tv_id?: number
  added_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: 'review_like' | 'comment_reply' | 'new_release' | 'recommendation' | 'system'
  title: string
  body: string
  data: Record<string, unknown>
  read: boolean
  created_at: string
}

export interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image: string | null
  author_id: string
  category: 'news' | 'review' | 'list' | 'explained' | 'interview' | 'trailer'
  tags: string[]
  published: boolean
  featured: boolean
  views: number
  reading_time: number
  seo_title: string | null
  seo_description: string | null
  created_at: string
  updated_at: string
  author?: User
  related_movie_id?: number
  related_tv_id?: number
}

// ─── UI TYPES ────────────────────────────────────────────────────────────────

export interface HeroSlide {
  id: number
  title: string
  tagline?: string
  overview: string
  backdropPath: string
  posterPath: string
  rating: number
  year: string
  runtime?: number
  genres: string[]
  trailerKey?: string
  type: 'movie' | 'tv'
  slug: string
}

export interface MovieCardProps {
  id: number
  title: string
  posterPath: string | null
  rating: number
  year: string
  type: 'movie' | 'tv'
  genres?: string[]
  overview?: string
  runtime?: number
  size?: 'sm' | 'md' | 'lg'
  priority?: boolean
}

export interface SearchResult {
  id: number
  title: string
  poster_path: string | null
  media_type: 'movie' | 'tv' | 'person'
  release_date?: string
  first_air_date?: string
  vote_average?: number
  profile_path?: string
  known_for_department?: string
}

export interface FilterOptions {
  genre?: number
  year?: number
  rating?: number
  language?: string
  sort?: 'popularity' | 'rating' | 'release_date' | 'title'
  page?: number
}

// ─── API RESPONSE TYPES ──────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  status: number
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  page: number
  total_pages: number
  total_results: number
  has_more: boolean
}

// ─── SEO TYPES ───────────────────────────────────────────────────────────────

export interface SeoMetadata {
  title: string
  description: string
  keywords: string[]
  ogImage: string
  canonical: string
  type: 'website' | 'article' | 'video.movie' | 'video.tv_show'
  publishedTime?: string
  modifiedTime?: string
}

export interface JsonLdMovie {
  '@context': 'https://schema.org'
  '@type': 'Movie'
  name: string
  description: string
  image: string
  datePublished: string
  director?: { '@type': 'Person'; name: string }[]
  actor?: { '@type': 'Person'; name: string }[]
  genre: string[]
  duration?: string
  aggregateRating?: {
    '@type': 'AggregateRating'
    ratingValue: number
    ratingCount: number
    bestRating: 10
    worstRating: 0
  }
}

// ─── REGION / CINEMA TYPES ───────────────────────────────────────────────────

export type CinemaRegion =
  | 'hollywood'
  | 'bollywood'
  | 'tollywood'
  | 'bengali'
  | 'korean'
  | 'anime'
  | 'web-series'
  | 'ott-originals'
  | 'international'

export const REGION_CONFIG: Record<CinemaRegion, { label: string; languages: string[]; emoji: string }> = {
  hollywood: { label: 'Hollywood', languages: ['en'], emoji: '🎬' },
  bollywood: { label: 'Bollywood', languages: ['hi'], emoji: '🇮🇳' },
  tollywood: { label: 'Tollywood', languages: ['te', 'kn', 'ta', 'ml'], emoji: '🎭' },
  bengali: { label: 'Bengali Cinema', languages: ['bn'], emoji: '🎞️' },
  korean: { label: 'Korean Drama', languages: ['ko'], emoji: '🇰🇷' },
  anime: { label: 'Anime', languages: ['ja'], emoji: '⛩️' },
  'web-series': { label: 'Web Series', languages: [], emoji: '📺' },
  'ott-originals': { label: 'OTT Originals', languages: [], emoji: '🎯' },
  international: { label: 'International', languages: [], emoji: '🌍' },
}
