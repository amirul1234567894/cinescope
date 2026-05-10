'use client'

import { useEffect, useRef } from 'react'

const ADSENSE_CLIENT = 'ca-pub-6510553016832156'

interface AdUnitProps {
  /**
   * Your specific ad slot ID from AdSense dashboard
   * Get it after creating ad units at https://www.google.com/adsense/
   * Example: '1234567890'
   */
  slot?: string
  /**
   * Ad format
   * 'auto' = responsive (recommended)
   * 'fluid' = native
   * 'rectangle', 'horizontal', 'vertical' = fixed sizes
   */
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical'
  /**
   * Full width responsive
   */
  responsive?: boolean
  /**
   * Custom CSS class for styling
   */
  className?: string
  /**
   * Layout key for fluid ads
   */
  layoutKey?: string
}

declare global {
  interface Window {
    adsbygoogle: { push: (params: object) => void }[]
  }
}

/**
 * Single AdSense ad unit — place anywhere on page
 *
 * Example:
 *   <AdUnit slot="1234567890" format="auto" responsive />
 *
 * For testing without slot, leave empty — placeholder will show
 */
export function AdUnit({
  slot,
  format = 'auto',
  responsive = true,
  className = '',
  layoutKey,
}: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null)
  const pushed = useRef(false)

  useEffect(() => {
    // Don't push without a slot ID (saves errors during development)
    if (!slot) return
    if (pushed.current) return

    try {
      // @ts-expect-error - adsbygoogle is added by external script
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      pushed.current = true
    } catch (err) {
      console.error('AdSense push error:', err)
    }
  }, [slot])

  // Show placeholder if no slot configured (helpful during development)
  if (!slot) {
    return (
      <div
        className={`flex items-center justify-center min-h-[100px] glass-card rounded-xl text-xs text-white/30 ${className}`}
        aria-label="Advertisement placeholder"
      >
        <div className="text-center px-4 py-6">
          <p className="font-medium mb-1">Ad Slot</p>
          <p className="text-[10px] text-white/20">
            Configure your ad slot ID in AdSense dashboard
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`adsense-container my-6 ${className}`} aria-label="Advertisement">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
        {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
      />
    </div>
  )
}
