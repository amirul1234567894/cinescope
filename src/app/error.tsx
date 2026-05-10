'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('App error:', error)
  }, [error])

  return (
    <div className="min-h-screen pt-24 pb-20 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="w-16 h-16 rounded-2xl bg-red-600/20 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
          Something went wrong
        </h1>
        <p className="text-white/40 text-sm sm:text-base mb-8 leading-relaxed">
          We hit a snag loading this page. This usually happens when the movie database is slow
          to respond. Try refreshing — it almost always works.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button onClick={() => reset()} className="btn-primary">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <Link href="/" className="btn-glass">
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>
        {error.digest && (
          <p className="text-xs text-white/20 mt-8 font-mono">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
