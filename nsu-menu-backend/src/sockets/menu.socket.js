import { Server } from 'socket.io'

let io = null

/**
 * Attaches Socket.IO to the given HTTP server. Call once from server.js.
 */
export function initMenuSocket(httpServer, { corsOrigin } = {}) {
  io = new Server(httpServer, {
    cors: { origin: corsOrigin || '*' },
  })

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`)
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`)
    })
  })

  return io
}

/**
 * Broadcasts a menu change to every connected client (FR-2.3: menu
 * must reflect vendor changes within 5 seconds). Called from the
 * controller after any create/update/delete/toggle.
 */
export function emitMenuUpdated(payload) {
  if (!io) return // socket not initialized (e.g. in unit tests) — no-op
  io.emit('menu:updated', payload)
}
