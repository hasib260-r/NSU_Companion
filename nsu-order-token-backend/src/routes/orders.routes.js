import { Router } from 'express'
import {
  listOrders,
  confirmOrder,
  lookupOrderByToken,
  updateOrderStatus,
} from '../controllers/orders.controller.js'

export const ordersRouter = Router()

// IMPORTANT: /lookup must be registered before /:id-style routes
// would be, to avoid "lookup" being parsed as an :id param. There's
// no /:id route here yet, but keep this order if one is added later.
ordersRouter.get('/lookup', lookupOrderByToken)
ordersRouter.get('/', listOrders)
ordersRouter.post('/', confirmOrder)
ordersRouter.patch('/:id/status', updateOrderStatus)
