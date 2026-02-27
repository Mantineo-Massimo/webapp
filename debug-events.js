require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    try {
        console.log("Fetching events...");
        const events = await prisma.bonusMalusEvent.findMany({
            include: {
                artist: true,
                createdBy: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        console.log(`Found ${events.length} events.`);
        if (events.length > 0) {
            console.log("First event sample:", JSON.stringify(events[0], null, 2));
        } else {
            console.log("No events found in BonusMalusEvent table.");
        }
    } catch (error) {
        console.error("DEBUG_ERROR:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
