import { PrismaClient } from '@prisma/client'
import { createOrderWithToken } from '../src/services/orderCreation.js'

const prisma = new PrismaClient()

async function main() {
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()

  await createOrderWithToken({
    stall: 'Rongin Bhaat',
    studentName: 'Tahmid Rahman',
    items: [
      { name: 'Chicken Tehari', qty: 1, price: 120 },
      { name: 'Cold Coffee', qty: 1, price: 90 },
    ],
  })

  await createOrderWithToken({
    stall: 'Grill Corner',
    studentName: 'Nusrat Jahan',
    items: [{ name: 'Club Sandwich', qty: 2, price: 130 }],
  })

  console.log('Seeded 2 sample orders with generated tokens.')
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
