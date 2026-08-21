import { prisma } from '../lib/prisma.js'
import { generateOrderToken } from './tokenGenerator.js'

const MAX_ATTEMPTS = 10

/**
 * Creates an order with a guaranteed-unique token (FR-5.1). Retries on
 * the rare case of a collision against the DB's unique constraint,
 * rather than trusting an in-memory check — this is what makes the
 * uniqueness guarantee real under concurrent requests.
 */
export async function createOrderWithToken({ stall, studentName, items }) {
  let lastError

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const token = generateOrderToken(stall)
    try {
      const order = await prisma.order.create({
        data: {
          token,
          stall,
          studentName,
          items: {
            create: items.map((it) => ({
              name: it.name,
              qty: it.qty,
              price: it.price,
            })),
          },
        },
        include: { items: true },
      })
      return order
    } catch (err) {
      // Prisma P2002 = unique constraint violation on `token`.
      if (err.code === 'P2002') {
        lastError = err
        continue // try again with a freshly generated token
      }
      throw err
    }
  }

  throw new Error(
    `Could not generate a unique order token after ${MAX_ATTEMPTS} attempts.`,
    { cause: lastError },
  )
}
