'use client'

import Script from 'next/script'

const ADSENSE_CLIENT = 'ca-pub-6510553016832156'

/**
 * Google AdSense Auto Ads — automatically places ads across the site.
 * Loads once globally in root layout.
 *
 * Usage in layout.tsx:
 *   <AdSenseScript />
 */
export function AdSenseScript() {
  return (
    <Script
      id="adsense-auto-ads"
      async
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
    />
  )
}
