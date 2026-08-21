import 'dotenv/config'
import http from 'http'
import { createApp } from './app.js'
import { initMenuSocket } from './sockets/menu.socket.js'

const PORT = process.env.PORT || 4000
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173'

const app = createApp()
const httpServer = http.createServer(app)

initMenuSocket(httpServer, { corsOrigin: CORS_ORIGIN })

httpServer.listen(PORT, () => {
  console.log(`NSU Companion menu backend running on http://localhost:${PORT}`)
})
