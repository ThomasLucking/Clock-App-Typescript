export const LoadingState = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Time Tracker</p>
        <h1 className="text-3xl font-bold text-white">Entries</h1>
      </div>
      <ul className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className="rounded-2xl border border-gray-200 bg-white px-6 py-5 h-16 animate-pulse" />
        ))}
      </ul>
    </div>
  )
}