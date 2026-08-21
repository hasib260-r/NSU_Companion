export default function AvailabilityToggle({ available, onChange, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={available}
      disabled={disabled}
      onClick={() => onChange(!available)}
      className={`flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors
        ${
          available
            ? 'border-teal/30 bg-teal-light text-teal-dark'
            : 'border-clay/30 bg-clay-light text-clay'
        }
        ${disabled ? 'opacity-50' : 'hover:brightness-95'}
      `}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          available ? 'bg-teal' : 'bg-clay'
        }`}
      />
      {available ? 'In stock' : 'Sold out'}
    </button>
  )
}
