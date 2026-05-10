import Image from 'next/image'

interface BackdropHeroProps {
  backdropUrl: string
  title: string
  trailerKey?: string
}

export function BackdropHero({ backdropUrl, title }: BackdropHeroProps) {
  return (
    <div className="relative h-[50vh] sm:h-[60vh] min-h-[400px]">
      <Image
        src={backdropUrl}
        alt={`${title} backdrop`}
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
        quality={85}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-cinema-black via-cinema-black/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/30 to-transparent" />
    </div>
  )
}
