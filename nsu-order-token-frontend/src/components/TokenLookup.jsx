import StatusBadge from './StatusBadge.jsx'

export default function TokenLookup({ query, setQuery, lookup, result, status }) {
  return (
    <div className="mx-auto max-w-md">
      <form onSubmit={lookup} className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter token e.g. RB-4821"
          className="input stamp flex-1 text-center text-lg uppercase tracking-wider"
          autoFocus
        />
        <button
          type="submit"
          className="rounded-lg bg-teal px-5 py-2 text-sm font-medium text-white hover:bg-teal-dark"
        >
          Look up
        </button>
      </form>

      <div className="mt-5">
        {status === 'loading' && (
          <p className="text-center text-sm text-ink/50">Searching…</p>
        )}

        {status === 'not-found' && (
          <div className="rounded-xl border border-clay/30 bg-clay-light px-5 py-6 text-center">
            <p className="font-medium text-clay">No order found for that token.</p>
            <p className="mt-1 text-sm text-clay/80">
              Double-check the code with the student and try again.
            </p>
          </div>
        )}

        {status === 'error' && (
          <p className="text-center text-sm text-clay">
            Something went wrong. Try again.
          </p>
        )}

        {status === 'found' && result && (
          <div className="overflow-hidden rounded-xl border border-line bg-white">
            <div className="flex items-center justify-between bg-teal-light px-4 py-3">
              <p className="stamp text-lg font-semibold text-teal-dark">
                {result.token}
              </p>
              <StatusBadge status={result.status} />
            </div>
            <div className="px-4 py-3">
              <p className="text-sm text-ink">{result.studentName}</p>
              <p className="text-xs text-ink/40">{result.stall}</p>
            </div>
            <div className="ticket-perforation mx-4" />
            <ul className="space-y-1 px-4 py-3">
              {result.items.map((item, i) => (
                <li key={i} className="flex justify-between text-sm">
                  <span className="text-ink/70">
                    {item.qty}× {item.name}
                  </span>
                  <span className="stamp text-ink/70">
                    ৳{item.qty * item.price}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
