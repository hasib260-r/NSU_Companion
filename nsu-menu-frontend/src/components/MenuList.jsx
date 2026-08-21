import MenuItemCard from './MenuItemCard.jsx'

export default function MenuList({ items, status, onEdit, onDelete, onToggle }) {
  if (status === 'loading') {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-xl border border-line bg-white/60"
          />
        ))}
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="rounded-xl border border-clay/30 bg-clay-light px-5 py-8 text-center">
        <p className="font-medium text-clay">Couldn't load the menu.</p>
        <p className="mt-1 text-sm text-clay/80">
          Check that the backend is running and try again.
        </p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line bg-white/60 px-5 py-12 text-center">
        <p className="font-display text-lg text-ink">No items match yet</p>
        <p className="mt-1 text-sm text-ink/50">
          Try a different search, or add a new item to this stall's menu.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <MenuItemCard
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
    </div>
  )
}
