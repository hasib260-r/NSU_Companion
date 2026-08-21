export default function SearchFilterBar({
  search,
  setSearch,
  stallFilter,
  setStallFilter,
  categoryFilter,
  setCategoryFilter,
  stalls,
  categories,
  resultCount,
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-line bg-white p-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search menu items…"
          className="w-full rounded-lg border border-line bg-paper py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink/40 focus:border-teal focus:outline-none"
        />
      </div>

      <select
        value={stallFilter}
        onChange={(e) => setStallFilter(e.target.value)}
        className="rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none"
      >
        {stalls.map((stall) => (
          <option key={stall} value={stall}>
            {stall === 'All' ? 'All stalls' : stall}
          </option>
        ))}
      </select>

      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        className="rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none"
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category === 'All' ? 'All categories' : category}
          </option>
        ))}
      </select>

      <span className="stamp whitespace-nowrap text-xs text-ink/40">
        {resultCount} item{resultCount === 1 ? '' : 's'}
      </span>
    </div>
  )
}
