import { prisma } from '../lib/prisma.js'
import { validateOrderPayload } from '../validation/order.js'
import { createOrderWithToken } from '../services/orderCreation.js'

// GET /api/orders
export async function listOrders(req, res) {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { placedAt: 'desc' },
  })
  res.json(orders)
}

// POST /api/orders (FR-5.1)
// Called right after the payment gateway's success callback (FR-4.3).
export async function confirmOrder(req, res) {
  const { valid, errors } = validateOrderPayload(req.body)
  if (!valid) return res.status(400).json({ errors })

  const { stall, studentName, items } = req.body
  const order = await createOrderWithToken({ stall, studentName, items })

  res.status(201).json(order)
}

// GET /api/orders/lookup?token=RB-4821 (FR-5.3)
export async function lookupOrderByToken(req, res) {
  const { token } = req.query
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: '"token" query param is required.' })
  }

  const order = await prisma.order.findUnique({
    where: { token: token.trim().toUpperCase() },
    include: { items: true },
  })

  if (!order) {
    return res.status(404).json({ error: 'No order found for that token.' })
  }

  res.json(order)
}

// PATCH /api/orders/:id/status
// Not in FR-5.x directly, but the vendor dashboard (FR-8.2) needs a
// way to move an order through Received -> Preparing -> Ready ->
// Completed after finding it by token. Included so the lookup screen
// is actually useful end-to-end.
export async function updateOrderStatus(req, res) {
  const { id } = req.params
  const { status } = req.body

  const VALID_STATUSES = ['Received', 'Preparing', 'Ready', 'Completed']
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      error: `"status" must be one of: ${VALID_STATUSES.join(', ')}`,
    })
  }

  const existing = await prisma.order.findUnique({ where: { id } })
  if (!existing) return res.status(404).json({ error: 'Order not found.' })

  const order = await prisma.order.update({
    where: { id },
    data: { status },
    include: { items: true },
  })

  res.json(order)
}
