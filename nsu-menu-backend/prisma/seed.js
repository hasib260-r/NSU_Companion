import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const items = [
  { name: 'Chicken Tehari', stall: 'Rongin Bhaat', category: 'Rice & Curry', price: 120, prepTimeMinutes: 12, available: true },
  { name: 'Beef Kala Bhuna', stall: 'Rongin Bhaat', category: 'Rice & Curry', price: 160, prepTimeMinutes: 15, available: true },
  { name: 'Chicken Shawarma Roll', stall: 'Grill Corner', category: 'Fast Food', price: 140, prepTimeMinutes: 8, available: false },
  { name: 'Vegetable Fried Rice', stall: 'Wok & Roll', category: 'Rice & Curry', price: 100, prepTimeMinutes: 10, available: true },
  { name: 'Cold Coffee', stall: 'Cafe Corner', category: 'Beverages', price: 90, prepTimeMinutes: 4, available: true },
  { name: 'Club Sandwich', stall: 'Grill Corner', category: 'Fast Food', price: 130, prepTimeMinutes: 9, available: true },
]

async function main() {
  await prisma.menuItem.deleteMany()
  await prisma.menuItem.createMany({ data: items })
  console.log(`Seeded ${items.length} menu items.`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
