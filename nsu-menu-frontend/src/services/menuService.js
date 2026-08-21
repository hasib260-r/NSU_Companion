// ---------------------------------------------------------------------
// menuService.js
//
// Every component talks to menu data ONLY through this file. Right now
// it's backed by the in-memory mock in data/mockMenuItems.js. Once the
// Express + PostgreSQL API exists, delete the "MOCK MODE" block below,
// uncomment the "REAL API MODE" block, and nothing else in the app
// needs to change.
// ---------------------------------------------------------------------

import { _getAll, _create, _update, _remove } from '../data/mockMenuItems.js'

const USE_MOCK = false
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

export async function getMenuItems() {
  if (USE_MOCK) return _getAll()

  const res = await fetch(`${API_BASE}/menu`)
  if (!res.ok) throw new Error('Failed to load menu items')
  return res.json()
}

export async function createMenuItem(item) {
  if (USE_MOCK) return _create(item)

  const res = await fetch(`${API_BASE}/menu`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  })
  if (!res.ok) throw new Error('Failed to create menu item')
  return res.json()
}

export async function updateMenuItem(id, patch) {
  if (USE_MOCK) return _update(id, patch)

  const res = await fetch(`${API_BASE}/menu/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  })
  if (!res.ok) throw new Error('Failed to update menu item')
  return res.json()
}

export async function deleteMenuItem(id) {
  if (USE_MOCK) return _remove(id)

  const res = await fetch(`${API_BASE}/menu/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete menu item')
  return res.json()
}

export async function toggleAvailability(id, available) {
  // FR-2.2: dedicated small patch, matches a likely PATCH endpoint
  // e.g. PATCH /api/menu/:id/availability
  return updateMenuItem(id, { available })
}

// ---------------------------------------------------------------------
// SOCKET.IO (real-time menu updates, FR-2.3)
// Uncomment once the backend emits a `menu:updated` event. Import and
// call subscribeToMenuUpdates(callback) from useMenuItems.js.
// ---------------------------------------------------------------------
//
// import { io } from 'socket.io-client'
// const socket = io(API_BASE.replace('/api', ''))
//
// export function subscribeToMenuUpdates(onUpdate) {
//   socket.on('menu:updated', onUpdate)
//   return () => socket.off('menu:updated', onUpdate)
// }
