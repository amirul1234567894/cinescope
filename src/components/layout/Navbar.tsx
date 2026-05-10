'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import {
  Search, Menu, X, Bell, User, Bookmark,
  ChevronDown, Film, Tv, Star, Globe, Flame
} from 'lucide-react'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'

const NAV_LINKS = [
  {
    label: 'Movies',
    href: '/movies',
    icon: Film,
    sub: [
      { label: 'Trending', href: '/movies/trending' },
      { label: 'Top Rated', href: '/movies/top-rated' },
      { label: 'Now Playing', href: '/movies/now-playing' },
      { label: 'Upcoming', href: '/movies/upcoming' },
    ],
  },
  {
    label: 'TV Shows',
    href: '/tv',
    icon: Tv,
    sub: [
      { label: 'Trending', href: '/tv/trending' },
      { label: 'Top Rated', href: '/tv/top-rated' },
      { label: 'Airing Today', href: '/tv/airing-today' },
      { label: 'OTT Originals', href: '/genres/ott-originals' },
    ],
  },
  {
    label: 'Regional',
    href: '/regional',
    icon: Globe,
    sub: [
      { label: 'Hollywood', href: '/genres/hollywood' },
      { label: 'Bollywood', href: '/genres/bollywood' },
      { label: 'Tollywood', href: '/genres/tollywood' },
      { label: 'Bengali Cinema', href: '/genres/bengali' },
      { label: 'Korean Drama', href: '/genres/korean' },
      { label: 'Anime', href: '/genres/anime' },
    ],
  },
  { label: 'Celebrities', href: '/celebrities', icon: Star },
  { label: 'News', href: '/news', icon: Flame },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<{ id: number; title: string; type: string; year: string; poster: string | null }[]>([])
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [searching, setSearching] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const pathname = usePathname()
  const router = useRouter()

  const { scrollY } = useScroll()
  const navOpacity = useTransform(scrollY, [0, 100], [0, 1])

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (v) => setScrolled(v > 20))
    return unsubscribe
  }, [scrollY])

  useEffect(() => {
    setMobileOpen(false)
    setSearchOpen(false)
  }, [pathname])

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const timer = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=6`)
        const data = await res.json()
        setSearchResults(data.results || [])
      } catch { /* noop */ } finally {
        setSearching(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchRef.current?.focus(), 100)
    }
  }, [searchOpen])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <>
      {/* ── MAIN NAV ── */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'glass-nav' : 'bg-gradient-to-b from-black/60 to-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center shadow-glow-red-sm group-hover:shadow-glow-red transition-all duration-300">
                  <Film className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <div className="absolute inset-0 rounded-lg bg-red-600/20 blur-md group-hover:blur-lg transition-all" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight">
                <span className="text-white">Cine</span>
                <span className="gradient-text-red">Scope</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => link.sub && setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      pathname.startsWith(link.href)
                        ? 'text-white bg-white/8'
                        : 'text-white/70 hover:text-white hover:bg-white/6'
                    }`}
                  >
                    {link.label}
                    {link.sub && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          activeDropdown === link.label ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </Link>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {link.sub && activeDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute top-full left-0 mt-1 w-48 glass-modal rounded-xl overflow-hidden py-1"
                      >
                        {link.sub.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/6 transition-colors"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/6 transition-all duration-200 group"
                aria-label="Search"
              >
                <Search className="w-4.5 h-4.5" />
                <span className="hidden sm:block text-sm text-white/40 group-hover:text-white/60 transition-colors font-mono">
                  ⌘K
                </span>
              </button>

              {/* Notifications */}
              <button className="relative p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/6 transition-all hidden sm:flex">
                <Bell className="w-4.5 h-4.5" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
              </button>

              {/* Watchlist */}
              <Link
                href="/watchlist"
                className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/6 transition-all hidden md:flex"
                aria-label="Watchlist"
              >
                <Bookmark className="w-4.5 h-4.5" />
              </Link>

              {/* User / Auth */}
              <UserMenu />

              {/* Mobile menu */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/6 transition-all"
                aria-label="Menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Red bottom line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-600/50 to-transparent"
          style={{ opacity: navOpacity }}
        />
      </motion.header>

      {/* ── SEARCH OVERLAY ── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] backdrop-cinema flex items-start justify-center pt-20 px-4"
            onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-2xl"
            >
              {/* Search input */}
              <form
                onSubmit={handleSearchSubmit}
                className="glass-modal rounded-2xl overflow-hidden"
              >
                <div className="flex items-center gap-3 px-5 py-4 border-b border-white/6">
                  <Search className="w-5 h-5 text-white/40 flex-shrink-0" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search movies, TV shows, celebrities..."
                    className="flex-1 bg-transparent text-white placeholder-white/30 outline-none text-base"
                  />
                  {searching && (
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="p-1.5 rounded-lg bg-white/6 hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4 text-white/50" />
                  </button>
                </div>

                {/* Results */}
                {searchResults.length > 0 && (
                  <div className="py-2">
                    {searchResults.map((result) => {
                      // Build the proper href based on type
                      const titleSlug = result.title
                        .toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-')
                        .trim()
                      const href =
                        result.type === 'person'
                          ? `/person/${result.id}`
                          : `/${result.type}/${titleSlug}-${result.id}`

                      return (
                      <Link
                        key={`${result.type}-${result.id}`}
                        href={href}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors group"
                      >
                        <div className="w-10 h-14 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                          {result.poster ? (
                            <Image
                              src={`https://image.tmdb.org/t/p/w92${result.poster}`}
                              alt={result.title}
                              width={40}
                              height={56}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Film className="w-4 h-4 text-white/20" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white group-hover:text-red-400 transition-colors">
                            {result.title}
                          </p>
                          <p className="text-xs text-white/40 mt-0.5">
                            {result.type === 'movie' ? 'Movie' : result.type === 'tv' ? 'TV Show' : 'Person'}
                            {result.year && ` · ${result.year}`}
                          </p>
                        </div>
                      </Link>
                      )
                    })}

                    <div className="px-5 pt-2 pb-3 border-t border-white/6 mt-1">
                      <button
                        type="submit"
                        className="text-sm text-red-400 hover:text-red-300 transition-colors"
                      >
                        See all results for &quot;{searchQuery}&quot; →
                      </button>
                    </div>
                  </div>
                )}

                {/* Quick links when empty */}
                {!searchQuery && (
                  <div className="p-5">
                    <p className="text-xs font-medium text-white/30 uppercase tracking-wider mb-3">Quick Links</p>
                    <div className="flex flex-wrap gap-2">
                      {['Trending Movies', 'Top Rated', 'Upcoming', 'Bollywood', 'Korean Drama', 'Anime'].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setSearchQuery(tag)}
                          className="genre-chip"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </form>

              <p className="text-center text-xs text-white/20 mt-3">
                Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono">ESC</kbd> to close
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MOBILE MENU ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 right-0 z-50 w-80 glass-modal lg:hidden overflow-y-auto"
          >
            <div className="p-6 pt-20">
              <div className="space-y-1">
                {NAV_LINKS.map((link) => (
                  <div key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/6 transition-all"
                    >
                      <link.icon className="w-4 h-4 text-red-400" />
                      <span className="font-medium">{link.label}</span>
                    </Link>
                    {link.sub && (
                      <div className="ml-11 space-y-0.5">
                        {link.sub.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className="block px-4 py-2 text-sm text-white/50 hover:text-white/80 transition-colors rounded-lg"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/8 space-y-3">
                <Link
                  href="/watchlist"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/6 transition-all"
                >
                  <Bookmark className="w-4 h-4 text-red-400" />
                  <span>My Watchlist</span>
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/6 transition-all"
                >
                  <User className="w-4 h-4 text-red-400" />
                  <span>Profile</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── KEYBOARD SHORTCUT ── */}
      <KeyboardShortcuts onSearchOpen={() => setSearchOpen(true)} />
    </>
  )
}

function KeyboardShortcuts({ onSearchOpen }: { onSearchOpen: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        onSearchOpen()
      }
      if (e.key === 'Escape') {
        // handled inside overlay
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onSearchOpen])

  return null
}

// ─── USER MENU (auth-aware) ─────────────────────────────────────────────────
function UserMenu() {
  const { user, profile, loading, signOut } = useAuth()
  const [open, setOpen] = useState(false)

  if (loading) {
    return (
      <div className="w-9 h-9 rounded-lg bg-white/6 animate-pulse" />
    )
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="hidden sm:inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/6 transition-all"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-all"
        >
          <span className="hidden sm:block">Get Started</span>
          <span className="sm:hidden">Sign Up</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/6 hover:bg-white/10 border border-white/8 hover:border-red-500/30 transition-all duration-200"
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-red-900 flex items-center justify-center text-xs font-bold text-white">
          {profile?.username.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-medium text-white/80 hidden sm:block max-w-[100px] truncate">
          {profile?.username || 'User'}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-full right-0 mt-2 w-56 glass-modal rounded-xl overflow-hidden py-1 z-50"
            >
              <div className="px-4 py-3 border-b border-white/8">
                <p className="text-sm font-semibold text-white truncate">{profile?.full_name || profile?.username}</p>
                <p className="text-xs text-white/40 truncate">{user.email}</p>
              </div>
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/6 transition-colors"
              >
                My Profile
              </Link>
              <Link
                href="/watchlist"
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/6 transition-colors"
              >
                Watchlist
              </Link>
              <button
                onClick={() => { setOpen(false); signOut() }}
                className="block w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-white/6 transition-colors border-t border-white/8 mt-1"
              >
                Sign Out
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
