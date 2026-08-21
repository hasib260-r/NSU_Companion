// Temporary local data standing in for the PostgreSQL `menu_items` table.
// Shape matches what the FR-2.x backend endpoints will eventually return,
// so swapping menuService.js over to real fetch calls later requires no
// changes to any component.

let items = [
  {
    id: 'itm_001',
    name: 'Chicken Tehari',
    stall: 'Rongin Bhaat',
    category: 'Rice & Curry',
    price: 120,
    prepTimeMinutes: 12,
    available: true,
  },
  {
    id: 'itm_002',
    name: 'Beef Kala Bhuna',
    stall: 'Rongin Bhaat',
    category: 'Rice & Curry',
    price: 160,
    prepTimeMinutes: 15,
    available: true,
  },
  {
    id: 'itm_003',
    name: 'Chicken Shawarma Roll',
    stall: 'Grill Corner',
    category: 'Fast Food',
    price: 140,
    prepTimeMinutes: 8,
    available: false,
  },
  {
    id: 'itm_004',
    name: 'Vegetable Fried Rice',
    stall: 'Wok & Roll',
    category: 'Rice & Curry',
    price: 100,
    prepTimeMinutes: 10,
    available: true,
  },
  {
    id: 'itm_005',
    name: 'Cold Coffee',
    stall: 'Cafe Corner',
    category: 'Beverages',
    price: 90,
    prepTimeMinutes: 4,
    available: true,
  },
  {
    id: 'itm_006',
    name: 'Club Sandwich',
    stall: 'Grill Corner',
    category: 'Fast Food',
    price: 130,
    prepTimeMinutes: 9,
    available: true,
  },
]

// Simulated latency so the UI's loading states are exercised even
// against mock data — this makes the later swap to real HTTP calls
// behaviorally invisible to every component.
const LATENCY_MS = 250

function delay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS))
}

export function _getAll() {
  return delay([...items])
}

export function _create(newItem) {
  const created = {
    id: `itm_${Math.random().toString(36).slice(2, 8)}`,
    available: true,
    ...newItem,
  }
  items = [...items, created]
  return delay(created)
}

export function _update(id, patch) {
  items = items.map((item) => (item.id === id ? { ...item, ...patch } : item))
  const updated = items.find((item) => item.id === id)
  return delay(updated)
}

export function _remove(id) {
  items = items.filter((item) => item.id !== id)
  return delay({ id })
}
