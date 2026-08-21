import { useEffect, useState } from 'react'

const EMPTY_FORM = {
  name: '',
  stall: '',
  category: '',
  price: '',
  prepTimeMinutes: '',
}

export default function MenuItemForm({ open, initialItem, onCancel, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (initialItem) {
      setForm({
        name: initialItem.name,
        stall: initialItem.stall,
        category: initialItem.category,
        price: initialItem.price,
        prepTimeMinutes: initialItem.prepTimeMinutes,
      })
    } else {
      setForm(EMPTY_FORM)
    }
  }, [initialItem, open])

  if (!open) return null

  const isEdit = Boolean(initialItem)

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onSubmit({
        ...form,
        price: Number(form.price),
        prepTimeMinutes: Number(form.prepTimeMinutes),
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-xl font-semibold text-ink">
            {isEdit ? 'Edit menu item' : 'Add menu item'}
          </h2>
          <button
            onClick={onCancel}
            aria-label="Close"
            className="rounded-full p-1 text-ink/40 hover:bg-paper hover:text-ink"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
          <Field label="Item name">
            <input
              required
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. Chicken Tehari"
              className="input"
            />
          </Field>

          <Field label="Stall">
            <input
              required
              value={form.stall}
              onChange={(e) => handleChange('stall', e.target.value)}
              placeholder="e.g. Rongin Bhaat"
              className="input"
            />
          </Field>

          <Field label="Category">
            <input
              required
              value={form.category}
              onChange={(e) => handleChange('category', e.target.value)}
              placeholder="e.g. Rice & Curry"
              className="input"
            />
          </Field>

          <div className="flex gap-4">
            <Field label="Price (৳)">
              <input
                required
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => handleChange('price', e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Prep time (min)">
              <input
                required
                type="number"
                min="0"
                value={form.prepTimeMinutes}
                onChange={(e) => handleChange('prepTimeMinutes', e.target.value)}
                className="input"
              />
            </Field>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg px-4 py-2 text-sm font-medium text-ink/60 hover:bg-paper"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-teal px-4 py-2 text-sm font-medium text-white hover:bg-teal-dark disabled:opacity-60"
            >
              {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Add item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block flex-1">
      <span className="mb-1 block text-xs font-medium text-ink/60">
        {label}
      </span>
      {children}
    </label>
  )
}
