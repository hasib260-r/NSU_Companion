import StatusBadge from './StatusBadge.jsx'

function formatTime(iso) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function OrderHistoryList({ orders, status }) {
  if (status === 'loading') {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-xl border border-line bg-white/60"
          />
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line bg-white/60 px-5 py-10 text-center">
        <p className="font-display text-lg text-ink">No orders yet</p>
        <p className="mt-1 text-sm text-ink/50">
          Your past pickup tokens will show up here.
        </p>
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      {orders.map((order) => {
        const total = order.items.reduce(
          (sum, it) => sum + it.qty * it.price,
          0,
        )
        return (
          <li
            key={order.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-line bg-white px-4 py-3"
          >
            <div>
              <p className="stamp text-sm font-semibold text-teal-dark">
                {order.token}
              </p>
              <p className="text-sm text-ink">{order.stall}</p>
              <p className="text-xs text-ink/40">
                {formatTime(order.placedAt)} · ৳{total}
              </p>
            </div>
            <StatusBadge status={order.status} />
          </li>
        )
      })}
    </ul>
  )
}
