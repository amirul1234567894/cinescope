import Link from 'next/link'
import { Film, Github, Twitter, Instagram } from 'lucide-react'

const FOOTER_LINKS = {
  Explore: [
    { label: 'Movies', href: '/movies' },
    { label: 'TV Shows', href: '/tv' },
    { label: 'Celebrities', href: '/celebrities' },
    { label: 'News', href: '/news' },
    { label: 'Trailers', href: '/trailers' },
  ],
  Genres: [
    { label: 'Hollywood', href: '/genres/hollywood' },
    { label: 'Bollywood', href: '/genres/bollywood' },
    { label: 'Korean Drama', href: '/genres/korean' },
    { label: 'Anime', href: '/genres/anime' },
    { label: 'Web Series', href: '/genres/web-series' },
  ],
  Legal: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'DMCA Policy', href: '/dmca' },
  ],
}

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 mt-20">
      {/* Glow top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-red-600/30 to-transparent" />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center">
                <Film className="w-4 h-4 text-white" />
              </div>
              <span className="font-display text-xl font-bold">
                <span className="text-white">Cine</span>
                <span className="gradient-text-red">Scope</span>
              </span>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              Your premium cinematic universe. Discover movies, TV shows, 
              celebrities and the latest entertainment news — all in one place.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[
                { icon: Twitter, href: 'https://twitter.com/cinescope', label: 'Twitter' },
                { icon: Instagram, href: 'https://instagram.com/cinescope', label: 'Instagram' },
                { icon: Github, href: 'https://github.com/cinescope', label: 'GitHub' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 border border-white/8 text-white/50 hover:text-white hover:border-red-500/30 hover:bg-white/8 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/25">
            © {new Date().getFullYear()} CineScope. All rights reserved.
          </p>
          <p className="text-xs text-white/20 text-center">
            This product uses the TMDb API but is not endorsed or certified by TMDb.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/25">Made with ❤️ for cinema lovers</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
