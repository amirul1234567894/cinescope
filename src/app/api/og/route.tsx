import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const title = searchParams.get('title') || 'CineScope'
  const subtitle = searchParams.get('subtitle') || 'Your Premium Movie Universe'
  const rating = searchParams.get('rating')
  const year = searchParams.get('year')
  const type = searchParams.get('type') || 'website'

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '60px',
          background: 'linear-gradient(135deg, #050507 0%, #0f0a14 50%, #050507 100%)',
          fontFamily: 'serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background mesh */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 30% 20%, rgba(185,28,28,0.15) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(127,29,29,0.1) 0%, transparent 50%)',
        }} />

        {/* Red accent line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, transparent, #dc2626, transparent)',
        }} />

        {/* Logo */}
        <div style={{
          position: 'absolute', top: '40px', left: '60px',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #dc2626, #7f1d1d)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: 'white', fontSize: '24px' }}>🎬</span>
          </div>
          <span style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}>
            Cine<span style={{ color: '#dc2626' }}>Scope</span>
          </span>
        </div>

        {/* Type badge */}
        {type !== 'website' && (
          <div style={{
            position: 'absolute', top: '40px', right: '60px',
            padding: '6px 16px', borderRadius: '99px',
            background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)',
            color: '#f87171', fontSize: '14px', fontWeight: '600',
            textTransform: 'uppercase', letterSpacing: '0.1em',
          }}>
            {type}
          </div>
        )}

        {/* Meta */}
        {(rating || year) && (
          <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
            {rating && (
              <span style={{
                color: '#fbbf24', fontSize: '20px', fontWeight: 'bold',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                ★ {rating}
              </span>
            )}
            {year && (
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '18px' }}>
                {year}
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <h1 style={{
          fontSize: title.length > 30 ? '52px' : '68px',
          fontWeight: '900',
          color: 'white',
          margin: '0 0 12px 0',
          lineHeight: 1.1,
          maxWidth: '900px',
        }}>
          {title}
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: '24px', color: 'rgba(255,255,255,0.5)',
          margin: 0, maxWidth: '700px', lineHeight: 1.4,
        }}>
          {subtitle}
        </p>

        {/* Bottom bar */}
        <div style={{
          position: 'absolute', bottom: '40px', right: '60px',
          color: 'rgba(255,255,255,0.2)', fontSize: '13px',
        }}>
          cinescope.vercel.app
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
