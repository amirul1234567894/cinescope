import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { tmdb, tmdbImage } from '@/lib/tmdb'

export const metadata: Metadata = {
  title: 'Popular Celebrities',
  description: 'The most popular actors, directors, and personalities in cinema.',
}

export const revalidate = 7200

export default async function CelebritiesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageStr = '1' } = await searchParams
  const page = parseInt(pageStr)

  const data = await tmdb.people.popular(page)

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-2">
            Popular Celebrities
          </h1>
          <p className="text-white/40">The most popular stars in cinema right now</p>
          <div className="neon-line mt-6 opacity-30" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {data.results.map((person) => (
            <Link key={person.id} href={`/person/${person.id}`} className="group text-center">
              <div className="relative aspect-square rounded-full overflow-hidden mb-3 mx-auto max-w-[160px] ring-1 ring-white/10 group-hover:ring-red-500/40 transition-all">
                <Image
                  src={tmdbImage.profile(person.profile_path, 'w185')}
                  alt={person.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="160px"
                />
              </div>
              <p className="text-sm font-semibold text-white/85 group-hover:text-white transition-colors line-clamp-1">
                {person.name}
              </p>
              <p className="text-xs text-white/30 mt-0.5">{person.known_for_department}</p>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {data.total_pages > 1 && (
          <div className="flex justify-center gap-3 mt-12">
            {page > 1 && (
              <Link href={`/celebrities?page=${page - 1}`} className="btn-glass px-5 py-2.5">
                ← Previous
              </Link>
            )}
            <span className="flex items-center px-4 text-sm text-white/40">
              Page {page} of {Math.min(data.total_pages, 500)}
            </span>
            {page < Math.min(data.total_pages, 500) && (
              <Link href={`/celebrities?page=${page + 1}`} className="btn-glass px-5 py-2.5">
                Next →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
