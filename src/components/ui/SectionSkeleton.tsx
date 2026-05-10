export function SectionSkeleton({ title }: { title: string }) {
  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="skeleton h-6 w-48 rounded mb-2" />
            <div className="skeleton h-3.5 w-32 rounded" />
          </div>
          <div className="skeleton h-8 w-20 rounded-lg" />
        </div>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-40 sm:w-48">
              <div className="aspect-[2/3] skeleton rounded-xl" />
              <div className="pt-2.5 space-y-1.5">
                <div className="skeleton h-3.5 rounded w-4/5" />
                <div className="skeleton h-3 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
