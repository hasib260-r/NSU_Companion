import express from 'express'
import cors from 'cors'
import { menuRouter } from './routes/menu.routes.js'
import { errorHandler } from './middleware/errorHandler.js'

export function createApp() {
  const app = express()

  app.use(cors())
  app.use(express.json())

  app.get('/health', (req, res) => res.json({ status: 'ok' }))
  app.use('/api/menu', menuRouter)

  app.use(errorHandler)

  return app
}
