'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  life: number
  maxLife: number
  type: 'spark' | 'flame' | 'smoke' | 'glow'
  hue: number
  saturation: number
  lightness: number
  initialSize: number
}

export function FireBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animFrameRef = useRef<number>(0)
  const lastFrameTimeRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let width = 0
    let height = 0
    let dpr = 1

    // Fire emission centers — multiple "fire sources" along the bottom
    let fireSources: { x: number; intensity: number; phase: number }[] = []

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Generate fire sources — 5-7 sources spread across the bottom
      const sourceCount = Math.max(4, Math.floor(width / 350))
      fireSources = Array.from({ length: sourceCount }, (_, i) => ({
        x: (width / (sourceCount + 1)) * (i + 1) + (Math.random() - 0.5) * 80,
        intensity: 0.6 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
      }))
    }

    resize()

    // Spawn particles based on fire physics
    const spawn = (timestamp: number) => {
      fireSources.forEach((source) => {
        // Pulsing fire intensity (sin wave)
        const pulse = 0.7 + 0.3 * Math.sin(timestamp * 0.001 + source.phase)
        const intensity = source.intensity * pulse

        // FLAMES (bright, near base, dense)
        if (Math.random() < intensity * 0.8) {
          const spread = 60 + Math.random() * 40
          particlesRef.current.push({
            x: source.x + (Math.random() - 0.5) * spread,
            y: height - 5,
            vx: (Math.random() - 0.5) * 0.6,
            vy: -(2 + Math.random() * 2.5),
            size: 8 + Math.random() * 16,
            initialSize: 0,
            life: 0,
            maxLife: 50 + Math.random() * 40,
            type: 'flame',
            hue: 5 + Math.random() * 25, // red to orange
            saturation: 95,
            lightness: 55 + Math.random() * 15,
          })
        }

        // SPARKS (bright tiny particles, fast moving up)
        if (Math.random() < intensity * 0.5) {
          particlesRef.current.push({
            x: source.x + (Math.random() - 0.5) * 100,
            y: height - 5,
            vx: (Math.random() - 0.5) * 1.2,
            vy: -(3 + Math.random() * 4),
            size: 1 + Math.random() * 2,
            initialSize: 0,
            life: 0,
            maxLife: 80 + Math.random() * 80,
            type: 'spark',
            hue: 15 + Math.random() * 35, // orange to yellow
            saturation: 100,
            lightness: 70 + Math.random() * 20,
          })
        }

        // SMOKE (dark gray-red, slow rising, large)
        if (Math.random() < intensity * 0.3) {
          const startSize = 30 + Math.random() * 30
          particlesRef.current.push({
            x: source.x + (Math.random() - 0.5) * 80,
            y: height - 20,
            vx: (Math.random() - 0.5) * 0.4,
            vy: -(0.6 + Math.random() * 1.0),
            size: startSize,
            initialSize: startSize,
            life: 0,
            maxLife: 120 + Math.random() * 100,
            type: 'smoke',
            hue: 0,
            saturation: 30,
            lightness: 8,
          })
        }

        // GLOW (large soft circle at base — fire base glow)
        if (Math.random() < intensity * 0.15) {
          particlesRef.current.push({
            x: source.x + (Math.random() - 0.5) * 30,
            y: height - 10,
            vx: 0,
            vy: -0.3,
            size: 80 + Math.random() * 40,
            initialSize: 80,
            life: 0,
            maxLife: 30,
            type: 'glow',
            hue: 10,
            saturation: 100,
            lightness: 50,
          })
        }
      })
    }

    const animate = (timestamp: number) => {
      // Soft trailing fade — creates motion blur effect
      ctx.fillStyle = 'rgba(5, 5, 7, 0.18)'
      ctx.fillRect(0, 0, width, height)

      // Spawn new particles
      spawn(timestamp)

      // Cap total particles for performance
      if (particlesRef.current.length > 600) {
        particlesRef.current = particlesRef.current.slice(-500)
      }

      // Update and draw particles
      ctx.globalCompositeOperation = 'lighter' // Additive blending for fire glow

      particlesRef.current = particlesRef.current.filter((p) => {
        p.life++

        // Physics
        p.x += p.vx
        p.y += p.vy

        // Buoyancy increases over time (heat rises)
        p.vy *= 0.985

        // Drift (turbulence)
        if (p.type === 'spark' || p.type === 'flame') {
          p.vx += (Math.random() - 0.5) * 0.15
          p.vx *= 0.96
        } else if (p.type === 'smoke') {
          p.vx += (Math.random() - 0.5) * 0.1
          p.vx *= 0.99
          // Smoke expands as it rises
          p.size = p.initialSize * (1 + (p.life / p.maxLife) * 1.5)
        }

        const lifeRatio = p.life / p.maxLife
        if (lifeRatio >= 1 || p.y < -100) return false

        // Switch composite mode for smoke (subtractive)
        if (p.type === 'smoke') {
          ctx.globalCompositeOperation = 'source-over'
        } else {
          ctx.globalCompositeOperation = 'lighter'
        }

        let alpha = 0
        let drawSize = p.size
        let hue = p.hue
        let lightness = p.lightness
        let saturation = p.saturation

        if (p.type === 'flame') {
          // Fade in fast, fade out as it rises and cools
          const fadeIn = Math.min(lifeRatio * 5, 1)
          const fadeOut = Math.max(0, 1 - lifeRatio)
          alpha = fadeIn * fadeOut * 0.6
          // Color shifts from yellow → orange → red as it cools
          hue = p.hue + lifeRatio * 5
          lightness = p.lightness * (1 - lifeRatio * 0.4)
          drawSize = p.size * (1 - lifeRatio * 0.3)

          // Render flame as glowing radial gradient
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, drawSize)
          grad.addColorStop(0, `hsla(${hue + 20}, ${saturation}%, ${Math.min(lightness + 25, 85)}%, ${alpha * 0.9})`)
          grad.addColorStop(0.4, `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha * 0.5})`)
          grad.addColorStop(1, `hsla(${hue}, ${saturation}%, ${lightness * 0.5}%, 0)`)
          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.arc(p.x, p.y, drawSize, 0, Math.PI * 2)
          ctx.fill()
        } else if (p.type === 'spark') {
          // Sparks: bright tiny dots that fade slowly
          const fadeOut = Math.max(0, 1 - lifeRatio)
          alpha = fadeOut * 0.95
          hue = p.hue + lifeRatio * 10

          // Outer glow
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4)
          glow.addColorStop(0, `hsla(${hue}, 100%, 75%, ${alpha * 0.5})`)
          glow.addColorStop(1, `hsla(${hue}, 100%, 50%, 0)`)
          ctx.fillStyle = glow
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2)
          ctx.fill()

          // Bright core
          ctx.fillStyle = `hsla(${hue}, 100%, ${Math.min(lightness + 15, 95)}%, ${alpha})`
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        } else if (p.type === 'smoke') {
          // Smoke: dark, expands, fades
          const fadeIn = Math.min(lifeRatio * 4, 1)
          const fadeOut = Math.max(0, 1 - lifeRatio)
          alpha = fadeIn * fadeOut * 0.35

          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, drawSize)
          grad.addColorStop(0, `rgba(40, 25, 25, ${alpha * 0.8})`)
          grad.addColorStop(0.5, `rgba(20, 10, 10, ${alpha * 0.5})`)
          grad.addColorStop(1, `rgba(10, 5, 5, 0)`)
          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.arc(p.x, p.y, drawSize, 0, Math.PI * 2)
          ctx.fill()
        } else if (p.type === 'glow') {
          // Base glow: large soft red circle at fire base
          const fadeOut = Math.max(0, 1 - lifeRatio)
          alpha = fadeOut * 0.4

          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, drawSize)
          grad.addColorStop(0, `hsla(15, 100%, 55%, ${alpha * 0.6})`)
          grad.addColorStop(0.4, `hsla(5, 100%, 40%, ${alpha * 0.3})`)
          grad.addColorStop(1, `hsla(0, 100%, 20%, 0)`)
          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.arc(p.x, p.y, drawSize, 0, Math.PI * 2)
          ctx.fill()
        }

        return true
      })

      ctx.globalCompositeOperation = 'source-over'

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)

    const onResize = () => resize()
    window.addEventListener('resize', onResize)

    // Pause when tab hidden (saves battery)
    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animFrameRef.current)
      } else {
        animFrameRef.current = requestAnimationFrame(animate)
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  return (
    <>
      {/* Main fire canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          opacity: 0.85,
        }}
        aria-hidden="true"
      />

      {/* Bottom red ambient glow — extra atmospheric */}
      <div
        className="fixed bottom-0 left-0 right-0 h-[60vh] pointer-events-none"
        style={{
          zIndex: 0,
          background: 'radial-gradient(ellipse at bottom, rgba(220, 38, 38, 0.15) 0%, rgba(127, 29, 29, 0.08) 40%, transparent 80%)',
        }}
        aria-hidden="true"
      />

      {/* Top fade — keeps content readable */}
      <div
        className="fixed top-0 left-0 right-0 h-[30vh] pointer-events-none"
        style={{
          zIndex: 0,
          background: 'linear-gradient(to bottom, rgba(5,5,7,0.95) 0%, rgba(5,5,7,0.7) 50%, transparent 100%)',
        }}
        aria-hidden="true"
      />
    </>
  )
}
