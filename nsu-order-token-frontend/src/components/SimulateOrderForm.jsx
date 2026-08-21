import { useEffect, useMemo, useState } from 'react'
import { getMenuItems } from '../services/menuService.js'

export default function SimulateOrderForm({ onConfirm }) {
  const [menuItems, setMenuItems] = useState([])
  const [stall, setStall] = useState('')
  const [selectedItemId, setSelectedItemId] = useState('')
  const [studentName, setStudentName] = useState('')
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadMenu() {
      try {
        const items = await getMenuItems()

        const availableItems = items.filter((item) => item.available)

        setMenuItems(availableItems)

        if (availableItems.length > 0) {
          setStall(availableItems[0].stall)
          setSelectedItemId(availableItems[0].id)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadMenu()
  }, [])

  const stalls = useMemo(
    () => [...new Set(menuItems.map((item) => item.stall))],
    [menuItems],
  )

  const stallItems = useMemo(
    () => menuItems.filter((item) => item.stall === stall),
    [menuItems, stall],
  )

  const selectedItem = stallItems.find(
    (item) => item.id === selectedItemId,
  )

  function handleStallChange(e) {
    const nextStall = e.target.value
    setStall(nextStall)

    const firstItem = menuItems.find((item) => item.stall === nextStall)
    setSelectedItemId(firstItem?.id || '')
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!selectedItem) return

    setSubmitting(true)
    setError('')

    try {
      await onConfirm({
        stall: selectedItem.stall,
        studentName,
        items: [
          {
            name: selectedItem.name,
            price: selectedItem.price,
            qty: Number(qty),
          },
        ],
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-sm rounded-xl border border-line bg-white/60 p-4 text-sm">
        Loading menu...
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex max-w-sm flex-col gap-3 rounded-xl border border-line bg-white/60 p-4"
    >
      <h2 className="font-medium text-ink">
        Create Order
      </h2>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-ink/60">
          Stall
        </span>

        <select
          value={stall}
          onChange={handleStallChange}
          className="input"
          required
        >
          {stalls.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-ink/60">
          Food item
        </span>

        <select
          value={selectedItemId}
          onChange={(e) => setSelectedItemId(e.target.value)}
          className="input"
          required
        >
          {stallItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} — ৳{item.price}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-ink/60">
          Quantity
        </span>

        <input
          type="number"
          min="1"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          className="input"
          required
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-ink/60">
          Student name
        </span>

        <input
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          className="input"
          placeholder="Enter your name"
          required
        />
      </label>

      {selectedItem && (
        <div className="rounded-lg bg-teal/5 p-3 text-sm">
          <div className="flex justify-between">
            <span>{selectedItem.name}</span>
            <span>
              ৳{selectedItem.price * Number(qty)}
            </span>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || !selectedItem}
        className="rounded-lg bg-teal px-4 py-2 text-sm font-medium text-white hover:bg-teal-dark disabled:opacity-60"
      >
        {submitting ? 'Confirming...' : 'Confirm order'}
      </button>
    </form>
  )
}