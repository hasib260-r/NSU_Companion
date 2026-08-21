// ---------------------------------------------------------------------
// orderService.js
//
// Every component talks to order/token data ONLY through this file.
// Right now it's backed by the in-memory mock in data/mockOrders.js.
// Once the real payment-confirmation + order endpoints exist on the
// backend, set USE_MOCK to false and nothing else in the app changes.
// ---------------------------------------------------------------------

import {
  _getAllOrders,
  _createOrder,
  _findOrderByToken,
} from '../data/mockOrders.js'

const USE_MOCK = false
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

export async function getOrders() {
  if (USE_MOCK) return _getAllOrders()

  const res = await fetch(`${API_BASE}/orders`)
  if (!res.ok) throw new Error('Failed to load orders')
  return res.json()
}

// Called right after a successful sandbox payment callback (FR-4.3),
// which is where FR-5.1 says the token must be generated.
export async function confirmOrderAndGenerateToken(orderDraft) {
  if (USE_MOCK) return _createOrder(orderDraft)

  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderDraft),
  })
  if (!res.ok) throw new Error('Failed to confirm order')
  return res.json()
}

// FR-5.3: vendor looks up an order by token at pickup.
export async function findOrderByToken(token) {
  if (USE_MOCK) return _findOrderByToken(token)

  const res = await fetch(
    `${API_BASE}/orders/lookup?token=${encodeURIComponent(token)}`,
  )
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Lookup failed')
  return res.json()
}
