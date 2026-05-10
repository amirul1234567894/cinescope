import Image from 'next/image'
import type { TMDbWatchProviders } from '@/types'
import { tmdbImage } from '@/lib/tmdb'

export function WatchProviders({ providers }: { providers: TMDbWatchProviders }) {
  const india = providers.results?.IN
  const us = providers.results?.US
  const available = india || us
  if (!available) return null

  const flatrate = available.flatrate || []
  if (flatrate.length === 0) return null

  return (
    <div className="mt-6 w-full glass-card rounded-xl p-4">
      <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-3">Stream On</p>
      <div className="flex flex-wrap gap-2">
        {flatrate.map((provider) => (
          <a
            key={provider.provider_id}
            href={available.link}
            target="_blank"
            rel="noopener noreferrer"
            className="ott-badge"
            title={provider.provider_name}
          >
            {provider.logo_path && (
              <Image
                src={tmdbImage.logo(provider.logo_path, 'w45') || ''}
                alt={provider.provider_name}
                width={20}
                height={20}
                className="rounded-sm"
              />
            )}
            <span className="text-white/60">{provider.provider_name}</span>
          </a>
        ))}
      </div>
      <p className="text-[10px] text-white/20 mt-2">
        Data provided by JustWatch. Availability may vary by region.
      </p>
    </div>
  )
}
