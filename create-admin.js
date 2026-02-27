const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('admin123', 10);
    const user = await prisma.user.upsert({
        where: { email: 'diagnostic-admin@fantapiazza.it' },
        update: { role: 'ADMIN', password },
        create: {
            email: 'diagnostic-admin@fantapiazza.it',
            name: 'Diagnostic Admin',
            password,
            role: 'ADMIN'
        }
    });
    console.log('Admin created:', user.email);
}

main().catch(console.error).finally(() => prisma.$disconnect());
