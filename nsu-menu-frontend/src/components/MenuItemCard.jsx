import AvailabilityToggle from './AvailabilityToggle.jsx'

export default function MenuItemCard({ item, onEdit, onDelete, onToggle }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3 px-4 pt-4">
        <div>
          <p className="stamp text-[11px] uppercase tracking-wider text-ink/50">
            {item.stall}
          </p>
          <h3 className="font-display text-lg font-semibold leading-snug text-ink">
            {item.name}
          </h3>
        </div>
        <AvailabilityToggle
          available={item.available}
          onChange={(next) => onToggle(item.id, next)}
        />
      </div>

      <div className="ticket-perforation mx-4 mt-4" />

      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <div>
            <p className="stamp text-[10px] uppercase tracking-wider text-ink/40">
              Price
            </p>
            <p className="stamp text-base font-semibold text-teal-dark">
              ৳{item.price}
            </p>
          </div>
          <div>
            <p className="stamp text-[10px] uppercase tracking-wider text-ink/40">
              Prep time
            </p>
            <p className="stamp text-base font-semibold text-ink">
              {item.prepTimeMinutes} min
            </p>
          </div>
          <span className="rounded-full bg-marigold-light px-2.5 py-1 text-[11px] font-medium text-marigold-dark">
            {item.category}
          </span>
        </div>
      </div>

      <div className="flex border-t border-line">
        <button
          onClick={() => onEdit(item)}
          className="flex-1 py-2 text-sm font-medium text-ink/70 transition-colors hover:bg-paper hover:text-ink"
        >
          Edit
        </button>
        <div className="w-px bg-line" />
        <button
          onClick={() => onDelete(item.id)}
          className="flex-1 py-2 text-sm font-medium text-clay transition-colors hover:bg-clay-light"
        >
          Remove
        </button>
      </div>
    </div>
  )
}
