import { PrismaClient } from '@prisma/client'

// Single shared instance across the app (avoids exhausting DB
// connections in dev with hot-reload).
export const prisma = new PrismaClient()
