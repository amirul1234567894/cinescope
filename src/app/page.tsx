import { Suspense } from 'react'
import type { Metadata } from 'next'
import { tmdb } from '@/lib/tmdb'
import { HeroSection } from '@/components/home/HeroSection'
import { TrendingSection } from '@/components/home/TrendingSection'
import { FeaturedTrailers } from '@/components/home/FeaturedTrailers'
import { RegionalCinema } from '@/components/home/RegionalCinema'
import { CelebritySpotlight } from '@/components/home/CelebritySpotlight'
import { UpcomingReleases } from '@/components/home/UpcomingReleases'
import { GenreExplorer } from '@/components/home/GenreExplorer'
import { LatestNews } from '@/components/home/LatestNews'
import { SectionSkeleton } from '@/components/ui/SectionSkeleton'
import { AdUnit } from '@/components/ads/AdUnit'

export const metadata: Metadata = {
  title: 'CineScope — Your Premium Movie & Entertainment Universe',
  description:
    'Explore trending movies, top-rated TV shows, celebrity profiles, trailers, and entertainment news. Your cinematic universe, reimagined.',
  alternates: { canonical: '/' },
}

export const revalidate = 1800

export default async function HomePage() {
  // Parallel data fetch
  const [
    trendingMovies,
    trendingTV,
    upcomingMovies,
    topRatedMovies,
    popularPeople,
    movieGenres,
  ] = await Promise.allSettled([
    tmdb.trending.movies('week'),
    tmdb.trending.tv('week'),
    tmdb.movies.upcoming(),
    tmdb.movies.topRated(),
    tmdb.people.popular(),
    tmdb.genres.movies(),
  ])

  const movies = trendingMovies.status === 'fulfilled' ? trendingMovies.value.results : []
  const tvShows = trendingTV.status === 'fulfilled' ? trendingTV.value.results : []
  const upcoming = upcomingMovies.status === 'fulfilled' ? upcomingMovies.value.results : []
  const topRated = topRatedMovies.status === 'fulfilled' ? topRatedMovies.value.results : []
  const people = popularPeople.status === 'fulfilled' ? popularPeople.value.results : []
  const genres = movieGenres.status === 'fulfilled' ? movieGenres.value.genres : []

  // Hero: pick top 5 trending for the slider
  const heroItems = movies.slice(0, 5)

  return (
    <div className="relative min-h-screen">
      {/* ── HERO ── */}
      <HeroSection items={heroItems} />

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 space-y-16 pb-20">

        {/* Trending Movies */}
        <Suspense fallback={<SectionSkeleton title="Trending Movies" />}>
          <TrendingSection
            title="Trending Movies"
            subtitle="This week's most-watched films"
            items={movies}
            type="movie"
            viewAllHref="/movies/trending"
          />
        </Suspense>

        {/* Trending TV */}
        <Suspense fallback={<SectionSkeleton title="Trending TV Shows" />}>
          <TrendingSection
            title="Trending TV Shows"
            subtitle="Series everyone's talking about"
            items={tvShows}
            type="tv"
            viewAllHref="/tv/trending"
          />
        </Suspense>

        {/* Featured Trailers */}
        <Suspense fallback={<SectionSkeleton title="Featured Trailers" />}>
          <FeaturedTrailers movies={movies.slice(0, 8)} />
        </Suspense>

        {/* Ad Slot — mid-page horizontal */}
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1200px] mx-auto">
            <AdUnit format="auto" responsive />
          </div>
        </div>

        {/* Upcoming Releases */}
        <Suspense fallback={<SectionSkeleton title="Upcoming Releases" />}>
          <UpcomingReleases items={upcoming} />
        </Suspense>

        {/* Celebrity Spotlight */}
        <Suspense fallback={<SectionSkeleton title="Celebrity Spotlight" />}>
          <CelebritySpotlight people={people.slice(0, 12)} />
        </Suspense>

        {/* Regional Cinema */}
        <RegionalCinema />

        {/* Genre Explorer */}
        <Suspense fallback={<SectionSkeleton title="Explore Genres" />}>
          <GenreExplorer genres={genres} />
        </Suspense>

        {/* Top Rated All Time */}
        <Suspense fallback={<SectionSkeleton title="All-Time Classics" />}>
          <TrendingSection
            title="All-Time Classics"
            subtitle="The highest-rated films of all time"
            items={topRated}
            type="movie"
            viewAllHref="/movies/top-rated"
          />
        </Suspense>

        {/* Ad Slot — bottom horizontal */}
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1200px] mx-auto">
            <AdUnit format="auto" responsive />
          </div>
        </div>

        {/* Latest News */}
        <Suspense fallback={<SectionSkeleton title="Entertainment News" />}>
          <LatestNews />
        </Suspense>

      </div>
    </div>
  )
}
