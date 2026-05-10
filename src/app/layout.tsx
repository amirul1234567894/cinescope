import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans, JetBrains_Mono } from 'next/font/google'
import '@/styles/globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Providers } from '@/components/layout/Providers'
import { VideoBackground } from '@/components/effects/VideoBackground'
import { AdSenseScript } from '@/components/ads/AdSenseScript'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Toaster } from 'react-hot-toast'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://cinescope.autoflowa.in'),
  title: {
    default: 'CineScope — Your Premium Movie & Entertainment Universe',
    template: '%s | CineScope',
  },
  description:
    'Discover movies, TV shows, celebrities, reviews, trailers and more. Your cinematic universe, reimagined.',
  keywords: [
    'movies', 'tv shows', 'trailers', 'reviews', 'celebrities',
    'bollywood', 'hollywood', 'korean drama', 'anime', 'OTT',
    'watchlist', 'entertainment', 'cinema',
  ],
  authors: [{ name: 'CineScope' }],
  creator: 'CineScope',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'CineScope',
    title: 'CineScope — Your Premium Movie & Entertainment Universe',
    description: 'Discover movies, TV shows, celebrities, reviews, trailers and more.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'CineScope' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CineScope — Premium Entertainment Platform',
    description: 'Discover movies, TV shows, celebrities, reviews and trailers.',
    images: ['/og-image.jpg'],
    creator: '@cinescope',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large' },
  },
  alternates: { canonical: '/' },
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://image.tmdb.org" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://api.themoviedb.org" />
        {/* Google AdSense verification meta */}
        <meta name="google-adsense-account" content="ca-pub-6510553016832156" />
      </head>
      <body className="bg-cinema-black antialiased min-h-screen flex flex-col">
        {/* Google AdSense Auto Ads — loads once, places ads automatically */}
        <AdSenseScript />
        <Providers>
          <VideoBackground
            src="/videos/fire-background.mp4"
            poster="/videos/fire-poster.jpg"
            opacity={0.5}
            position="full"
            blendMode="screen"
            disableOnMobile={false}
          />
          <Navbar />
          <main className="flex-1 relative z-10">
            {children}
          </main>
          <Footer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#1a1a24',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                backdropFilter: 'blur(20px)',
              },
            }}
          />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
