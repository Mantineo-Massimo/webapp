import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('Seeding Database...')

    // CREATE LEAGUES
    const leagues = ['Generale']

    // Delete any other leagues that might have been created previously
    await prisma.league.deleteMany({
        where: { name: { notIn: leagues } }
    })

    for (const leagueName of leagues) {
        await prisma.league.upsert({
            where: { name: leagueName },
            update: {},
            create: { name: leagueName }
        })
        console.log(`Upserted League: ${leagueName}`)
    }

    // CREATE ARTISTS (Dummy Initial Data)
    const artistsData = [
        { name: 'Gaudenzi', cost: 30 },
        { name: 'Manna', cost: 25 },
        { name: 'Trovato', cost: 20 },
        { name: 'De Luca', cost: 15 },
        { name: 'Vitti', cost: 10 },
        { name: 'Bianchi', cost: 30 },
        { name: 'Rossi', cost: 25 },
    ]

    for (const artist of artistsData) {
        // Only insert, maybe we don't have a unique constraint on name, 
        // so let's find first or create
        const existingArtist = await prisma.artist.findFirst({
            where: { name: artist.name }
        })

        if (!existingArtist) {
            await prisma.artist.create({
                data: {
                    name: artist.name,
                    cost: artist.cost,
                }
            })
            console.log(`Created Artist: ${artist.name}`)
        }
    }

    console.log('Seeding finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
