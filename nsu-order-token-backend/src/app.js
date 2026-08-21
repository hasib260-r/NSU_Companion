import express from 'express'
import cors from 'cors'
import { ordersRouter } from './routes/orders.routes.js'
import { errorHandler } from './middleware/errorHandler.js'

export function createApp() {
  const app = express()

  app.use(cors())
  app.use(express.json())

  app.get('/health', (req, res) => res.json({ status: 'ok' }))
  app.use('/api/orders', ordersRouter)

  app.use(errorHandler)

  return app
}
