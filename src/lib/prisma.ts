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
        max: 2, // Low pool size for serverless
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    })
}

const adapter = new PrismaPg(globalForPrisma.pool)

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
