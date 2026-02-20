export default function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="glass rounded-3xl overflow-hidden animate-pulse"
        >
          <div className="h-64 bg-white/10" />
          <div className="p-6 space-y-3">
            <div className="h-3 w-20 bg-white/20 rounded-full" />
            <div className="h-4 w-3/4 bg-white/30 rounded-full" />
            <div className="h-4 w-1/2 bg-white/20 rounded-full" />
            <div className="flex items-center justify-between mt-4">
              <div className="h-6 w-16 bg-white/20 rounded-full" />
              <div className="h-10 w-10 bg-white/20 rounded-2xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
