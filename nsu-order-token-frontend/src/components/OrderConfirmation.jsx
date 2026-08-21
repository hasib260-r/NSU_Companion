import StatusBadge from './StatusBadge.jsx'

export default function OrderConfirmation({ order }) {
  if (!order) return null

  const total = order.items.reduce((sum, it) => sum + it.qty * it.price, 0)

  return (
    <div className="mx-auto max-w-sm overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
      <div className="bg-teal px-6 py-5 text-center text-white">
        <p className="stamp text-xs uppercase tracking-widest text-white/70">
          Order confirmed
        </p>
        <p className="mt-1 text-sm text-white/90">{order.stall}</p>
      </div>

      <div className="px-6 py-6 text-center">
        <p className="stamp text-xs uppercase tracking-wider text-ink/40">
          Your pickup token
        </p>
        <p className="stamp mt-2 text-5xl font-semibold tracking-wide text-teal-dark">
          {order.token}
        </p>
        <p className="mt-2 text-xs text-ink/50">
          Show this at {order.stall} when it's ready
        </p>
      </div>

      <div className="ticket-perforation mx-6" />

      <div className="space-y-2 px-6 py-5">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-ink/70">
              {item.qty}× {item.name}
            </span>
            <span className="stamp text-ink/70">
              ৳{item.qty * item.price}
            </span>
          </div>
        ))}
        <div className="mt-2 flex justify-between border-t border-line pt-2 text-sm font-semibold text-ink">
          <span>Total</span>
          <span className="stamp">৳{total}</span>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-line bg-paper px-6 py-3">
        <span className="text-xs text-ink/50">Status</span>
        <StatusBadge status={order.status} />
      </div>
    </div>
  )
}
