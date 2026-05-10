import Link from 'next/link'
import { FileQuestion, Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen pt-24 pb-20 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="w-20 h-20 rounded-2xl glass flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="w-10 h-10 text-white/30" />
        </div>
        <p className="text-7xl font-display font-black gradient-text-red mb-4">404</p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
          Page Not Found
        </h1>
        <p className="text-white/40 text-sm sm:text-base mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back to the action.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/" className="btn-primary">
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link href="/search" className="btn-glass">
            <Search className="w-4 h-4" />
            Search Movies
          </Link>
        </div>
      </div>
    </div>
  )
}
