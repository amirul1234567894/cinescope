'use client'

import { useEffect, useRef, useState } from 'react'

interface VideoBackgroundProps {
  /**
   * Path to video file in /public folder
   * Example: '/videos/fire-background.mp4'
   * Multiple sources for fallback
   */
  src?: string
  srcWebm?: string
  /**
   * Poster image shown while video loads (and on mobile if disabled)
   */
  poster?: string
  /**
   * Opacity of the video (0 = invisible, 1 = full)
   * Recommended: 0.3-0.6 so text stays readable
   */
  opacity?: number
  /**
   * Disable on mobile devices to save data/battery
   */
  disableOnMobile?: boolean
  /**
   * Where the video sits — full screen, bottom only, or top only
   */
  position?: 'full' | 'bottom' | 'top'
  /**
   * Video blend mode — how it composites with content
   */
  blendMode?: 'screen' | 'lighten' | 'overlay' | 'normal'
}

export function VideoBackground({
  src = '/videos/fire-background.mp4',
  srcWebm,
  poster = '/videos/fire-poster.jpg',
  opacity = 0.5,
  disableOnMobile = false,
  position = 'full',
  blendMode = 'screen',
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [shouldRender, setShouldRender] = useState(true)

  useEffect(() => {
    // Mobile detection
    if (disableOnMobile) {
      const isMobile = window.innerWidth < 768
      const isLowPower =
        // @ts-expect-error - deviceMemory not in standard types
        navigator.deviceMemory && navigator.deviceMemory < 4
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (isMobile || isLowPower || prefersReducedMotion) {
        setShouldRender(false)
        return
      }
    }

    // Pause when tab is hidden (saves CPU/battery)
    const onVisibilityChange = () => {
      if (!videoRef.current) return
      if (document.hidden) {
        videoRef.current.pause()
      } else {
        videoRef.current.play().catch(() => { /* autoplay blocked, ignore */ })
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [disableOnMobile])

  // Position-based styling
  const positionStyles: Record<typeof position, React.CSSProperties> = {
    full: {
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },
    bottom: {
      bottom: 0,
      left: 0,
      width: '100%',
      height: '60vh',
    },
    top: {
      top: 0,
      left: 0,
      width: '100%',
      height: '50vh',
    },
  }

  if (!shouldRender) {
    // Mobile fallback: just a static gradient (no video)
    return (
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background: 'radial-gradient(ellipse at bottom, rgba(220, 38, 38, 0.18) 0%, rgba(127, 29, 29, 0.05) 40%, transparent 80%)',
        }}
        aria-hidden="true"
      />
    )
  }

  return (
    <>
      {/* Main video */}
      <div
        className="fixed pointer-events-none"
        style={{
          ...positionStyles[position],
          zIndex: 0,
          overflow: 'hidden',
        }}
        aria-hidden="true"
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={poster}
          onLoadedData={() => setLoaded(true)}
          className="w-full h-full object-cover"
          style={{
            opacity: loaded ? opacity : 0,
            mixBlendMode: blendMode,
            transition: 'opacity 1s ease-in-out',
          }}
        >
          {srcWebm && <source src={srcWebm} type="video/webm" />}
          <source src={src} type="video/mp4" />
        </video>
      </div>

      {/* Bottom red ambient glow — always visible for atmosphere */}
      <div
        className="fixed bottom-0 left-0 right-0 h-[40vh] pointer-events-none"
        style={{
          zIndex: 0,
          background: 'radial-gradient(ellipse at bottom, rgba(220, 38, 38, 0.10) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Top fade — keeps navbar/content readable */}
      <div
        className="fixed top-0 left-0 right-0 h-[20vh] pointer-events-none"
        style={{
          zIndex: 0,
          background: 'linear-gradient(to bottom, rgba(5,5,7,0.7) 0%, transparent 100%)',
        }}
        aria-hidden="true"
      />
    </>
  )
}
