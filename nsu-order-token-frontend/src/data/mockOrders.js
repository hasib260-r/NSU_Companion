import { generateUniqueOrderToken } from '../services/tokenGenerator.js'

// Temporary local data standing in for the `orders` table.
// Each order already has a token, as if payment was just confirmed
// (FR-5.1). Shape matches what the backend's order endpoints will
// eventually return.

let orders = [
  {
    id: 'ord_1001',
    token: generateUniqueOrderToken('Rongin Bhaat', []),
    stall: 'Rongin Bhaat',
    studentName: 'Tahmid Rahman',
    items: [
      { name: 'Chicken Tehari', qty: 1, price: 120 },
      { name: 'Cold Coffee', qty: 1, price: 90 },
    ],
    status: 'Preparing', // Received | Preparing | Ready | Completed
    placedAt: '2026-08-16T10:12:00+06:00',
  },
  {
    id: 'ord_1002',
    token: generateUniqueOrderToken('Grill Corner', []),
    stall: 'Grill Corner',
    studentName: 'Nusrat Jahan',
    items: [{ name: 'Club Sandwich', qty: 2, price: 130 }],
    status: 'Ready',
    placedAt: '2026-08-16T10:05:00+06:00',
  },
]

const LATENCY_MS = 250

function delay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS))
}

export function _getAllOrders() {
  return delay([...orders])
}

export function _createOrder({ stall, studentName, items }) {
  const token = generateUniqueOrderToken(
    stall,
    orders.map((o) => o.token),
  )
  const order = {
    id: `ord_${Math.random().toString(36).slice(2, 8)}`,
    token,
    stall,
    studentName,
    items,
    status: 'Received',
    placedAt: new Date().toISOString(),
  }
  orders = [order, ...orders]
  return delay(order)
}

export function _findOrderByToken(token) {
  const normalized = token.trim().toUpperCase()
  const found = orders.find((o) => o.token === normalized)
  return delay(found || null)
}
