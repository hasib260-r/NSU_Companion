const STATUS_STYLES = {
  Received: 'bg-marigold-light text-marigold-dark',
  Preparing: 'bg-marigold-light text-marigold-dark',
  Ready: 'bg-teal-light text-teal-dark',
  Completed: 'bg-ink/10 text-ink/60',
}

export default function StatusBadge({ status }) {
  return (
    <span
      className={`stamp inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
        STATUS_STYLES[status] || 'bg-ink/10 text-ink/60'
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}
