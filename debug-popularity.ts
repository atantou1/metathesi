import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function debug() {
    console.log("--- Starting Popularity Debug ---")
    
    // 1. Check a few rows of TransferStatistics to see what terms look like
    const rows = await prisma.transferStatistics.findMany({
        take: 5
    })
    console.log("Existing Statistics Rows (first 5):", JSON.stringify(rows, null, 2))

    // 2. Search for the specific case: ΣΕΡΡΩΝ, Πρωτοβάθμια Γενικής, ΠΕ86
    const exactMatch = await prisma.transferStatistics.findFirst({
        where: {
            region: 'ΣΕΡΡΩΝ',
            division: 'Πρωτοβάθμια Γενικής',
            specialty: 'ΠΕ86'
        }
    })
    console.log("Exact Match Query Result:", JSON.stringify(exactMatch, null, 2))

    // 3. If exact match fails, try partial matches
    if (!exactMatch) {
        console.log("Exact match failed. Trying case-insensitive or partial searches...")
        
        const partialRegion = await prisma.transferStatistics.findMany({
            where: { region: { contains: 'ΣΕΡΡΩΝ', mode: 'insensitive' } },
            take: 3
        })
        console.log("Partial Region Results (ΣΕΡΡΩΝ):", JSON.stringify(partialRegion, null, 2))

        const partialSpecialty = await prisma.transferStatistics.findMany({
            where: { specialty: { contains: 'ΠΕ86', mode: 'insensitive' } },
            take: 3
        })
        console.log("Partial Specialty Results (ΠΕ86):", JSON.stringify(partialSpecialty, null, 2))
    }

    // 4. Check what a typical Specialty in Profile looks like
    const profile = await prisma.profile.findFirst({
        include: { specialty: true, division: true }
    })
    console.log("Example Profile (Specialty/Division):", JSON.stringify({
        specialty: profile?.specialty.code,
        division: profile?.division.name
    }, null, 2))
}

debug()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
