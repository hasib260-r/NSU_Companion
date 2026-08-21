import { prisma } from '../lib/prisma.js'
import { validateMenuItemPayload } from '../validation/menuItem.js'
import { emitMenuUpdated } from '../sockets/menu.socket.js'

// GET /api/menu
// Supports FR-2.4 via optional query params: ?stall=&category=&search=
export async function listMenuItems(req, res) {
  const { stall, category, search } = req.query

  const where = {}
  if (stall && stall !== 'All') where.stall = stall
  if (category && category !== 'All') where.category = category
  if (search) where.name = { contains: search, mode: 'insensitive' }

  const items = await prisma.menuItem.findMany({
    where,
    orderBy: { name: 'asc' },
  })
  res.json(items)
}

// POST /api/menu (FR-2.1)
export async function createMenuItem(req, res) {
  const { valid, errors } = validateMenuItemPayload(req.body)
  if (!valid) return res.status(400).json({ errors })

  const { name, stall, category, price, prepTimeMinutes, available } = req.body

  const item = await prisma.menuItem.create({
    data: {
      name,
      stall,
      category,
      price: Number(price),
      prepTimeMinutes: Number(prepTimeMinutes),
      available: available ?? true,
    },
  })

  emitMenuUpdated({ type: 'created', item })
  res.status(201).json(item)
}

// PUT /api/menu/:id (FR-2.1, and FR-2.2 when only `available` is sent)
export async function updateMenuItem(req, res) {
  const { id } = req.params
  const { valid, errors } = validateMenuItemPayload(req.body, { partial: true })
  if (!valid) return res.status(400).json({ errors })

  const existing = await prisma.menuItem.findUnique({ where: { id } })
  if (!existing) return res.status(404).json({ error: 'Menu item not found.' })

  const data = {}
  for (const field of ['name', 'stall', 'category', 'available']) {
    if (req.body[field] !== undefined) data[field] = req.body[field]
  }
  if (req.body.price !== undefined) data.price = Number(req.body.price)
  if (req.body.prepTimeMinutes !== undefined) {
    data.prepTimeMinutes = Number(req.body.prepTimeMinutes)
  }

  const item = await prisma.menuItem.update({ where: { id }, data })

  emitMenuUpdated({ type: 'updated', item })
  res.json(item)
}

// DELETE /api/menu/:id (FR-2.1)
export async function deleteMenuItem(req, res) {
  const { id } = req.params

  const existing = await prisma.menuItem.findUnique({ where: { id } })
  if (!existing) return res.status(404).json({ error: 'Menu item not found.' })

  await prisma.menuItem.delete({ where: { id } })

  emitMenuUpdated({ type: 'deleted', id })
  res.json({ id })
}
