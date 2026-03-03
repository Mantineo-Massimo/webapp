import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const connectionString = process.env.DATABASE_URL

const globalForPrisma = global as unknown as {
    prisma: PrismaClient | undefined,
    pool: Pool | undefined
}

// Reuse the pool in development to avoid exhausting connections
if (!globalForPrisma.pool) {
    globalForPrisma.pool = new Pool({
        connectionString,
        max: 10, // Increased for production peak (2000 users)
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
    })
}

const adapter = new PrismaPg(globalForPrisma.pool)

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
