import { NextResponse } from 'next/server'
import { tmdb, slugify } from '@/lib/tmdb'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cinescope.vercel.app'

export async function GET() {
  try {
    const [trendingMovies, trendingTV, topRated, popularTV] = await Promise.allSettled([
      tmdb.trending.movies('week'),
      tmdb.trending.tv('week'),
      tmdb.movies.topRated(),
      tmdb.tv.topRated(),
    ])

    const movies = trendingMovies.status === 'fulfilled' ? trendingMovies.value.results : []
    const tvShows = trendingTV.status === 'fulfilled' ? trendingTV.value.results : []
    const topMovies = topRated.status === 'fulfilled' ? topRated.value.results : []
    const topTV = popularTV.status === 'fulfilled' ? popularTV.value.results : []

    const allMovies = [...movies, ...topMovies].reduce((acc, m) => {
      if (!acc.find(x => x.id === m.id)) acc.push(m)
      return acc
    }, [] as typeof movies)

    const allTV = [...tvShows, ...topTV].reduce((acc, t) => {
      if (!acc.find(x => x.id === t.id)) acc.push(t)
      return acc
    }, [] as typeof tvShows)

    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/movies', priority: '0.9', changefreq: 'daily' },
      { url: '/movies/trending', priority: '0.9', changefreq: 'daily' },
      { url: '/movies/top-rated', priority: '0.8', changefreq: 'weekly' },
      { url: '/movies/upcoming', priority: '0.8', changefreq: 'daily' },
      { url: '/movies/now-playing', priority: '0.8', changefreq: 'daily' },
      { url: '/tv', priority: '0.9', changefreq: 'daily' },
      { url: '/tv/trending', priority: '0.8', changefreq: 'daily' },
      { url: '/celebrities', priority: '0.7', changefreq: 'weekly' },
      { url: '/news', priority: '0.8', changefreq: 'daily' },
      { url: '/search', priority: '0.6', changefreq: 'monthly' },
      { url: '/about', priority: '0.5', changefreq: 'monthly' },
      { url: '/contact', priority: '0.5', changefreq: 'monthly' },
      { url: '/privacy', priority: '0.3', changefreq: 'yearly' },
      { url: '/terms', priority: '0.3', changefreq: 'yearly' },
      { url: '/dmca', priority: '0.3', changefreq: 'yearly' },
    ]

    const movieUrls = allMovies.map(m => ({
      url: `/movie/${slugify(m.title, m.id)}`,
      priority: '0.8',
      changefreq: 'weekly',
      lastmod: m.release_date || new Date().toISOString().split('T')[0],
    }))

    const tvUrls = allTV.map(t => ({
      url: `/tv/${slugify(t.name, t.id)}`,
      priority: '0.7',
      changefreq: 'weekly',
      lastmod: t.first_air_date || new Date().toISOString().split('T')[0],
    }))

    const allUrls = [...staticPages, ...movieUrls, ...tvUrls]

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allUrls.map(u => `  <url>
    <loc>${SITE_URL}${u.url}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>${(u as typeof staticPages[0] & { lastmod?: string }).lastmod ? `\n    <lastmod>${(u as typeof staticPages[0] & { lastmod?: string }).lastmod}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    })
  } catch (error) {
    return new NextResponse('Error generating sitemap', { status: 500 })
  }
}
