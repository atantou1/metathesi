import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { validateActiveMatches } from '../src/lib/matching'

async function main() {
    console.log('Starting Origin Change Test...')

    // 1. Create Test Data
    const uniqueId = Date.now()
    const sector = await prisma.sector.create({ data: { name: `Test Sector ${uniqueId}` } })
    const division = await prisma.division.create({ data: { name: `Test Division ${uniqueId}`, sectorId: sector.id } })
    const specialty = await prisma.specialty.create({
        data: {
            code: `T${uniqueId}`,
            name: 'Specialty',
            branchCode: 'B1',
            branchName: 'Branch',
            educationalCategory: 'Category',
            isPrimary: true,
            isSecondary: true
        }
    })
    const region = await prisma.region.create({ data: { name: `Test Region ${uniqueId}` } })

    // Create Zones
    const zoneA = await prisma.postingZone.create({ data: { name: `Zone A ${uniqueId}`, regionId: region.id } })
    const zoneB = await prisma.postingZone.create({ data: { name: `Zone B ${uniqueId}`, regionId: region.id } })
    const zoneC = await prisma.postingZone.create({ data: { name: `Zone C ${uniqueId}`, regionId: region.id } })

    // Create User A (The Seeker) - In Zone A, Wants Zone B
    console.log('Creating User A...')
    const userA = await prisma.user.create({
        data: {
            email: `userA_${uniqueId}@test.com`,
            passwordHash: 'hash',
            fullName: 'User A',
            profile: {
                create: {
                    specialtyId: specialty.id,
                    divisionId: division.id,
                    currentZoneId: zoneA.id,
                    // @ts-ignore
                    fullName: 'User A Profile'
                }
            }
        },
        include: { profile: true }
    })

    // Request A: Wants Zone B
    console.log('Creating Request A...')
    const reqA = await prisma.transferRequest.create({
        data: {
            profileId: (userA as any).profile.id,
            originZoneId: zoneA.id,
            targetZones: {
                create: [{ zoneId: zoneB.id, priorityOrder: 1 }]
            }
        }
    })

    // Create User B (The Match) - In Zone B, Wants Zone A
    console.log('Creating User B...')
    const userB = await prisma.user.create({
        data: {
            email: `userB_${uniqueId}@test.com`,
            passwordHash: 'hash',
            fullName: 'User B',
            profile: {
                create: {
                    specialtyId: specialty.id,
                    divisionId: division.id,
                    currentZoneId: zoneB.id,
                    // @ts-ignore
                    fullName: 'User B Profile'
                }
            }
        },
        include: { profile: true }
    })

    // Request B: Wants Zone A
    console.log('Creating Request A match...')
    const reqB = await prisma.transferRequest.create({
        data: {
            profileId: (userB as any).profile.id,
            originZoneId: zoneB.id,
            targetZones: {
                create: [{ zoneId: zoneA.id, priorityOrder: 1 }]
            }
        }
    })

    // Create MATCH
    console.log('Creating Match...')
    const match = await prisma.match.create({
        data: {
            type: "direct",
            status: "active",
        }
    })
    await prisma.matchParticipant.createMany({
        data: [
            { matchId: match.id, requestId: reqA.id },
            { matchId: match.id, requestId: reqB.id }
        ]
    })

    console.log(`Match created: ${match.id}`)

    // Scenario: User A changes Origin to Zone C (breaking the match)
    // We simulate what wizard.ts does: 
    // 1. Update Profile (User moved to C)
    // 2. Update Request (Origin -> C, Status -> Active)
    // 3. Validate

    console.log('Simulating Wizard Update: User A moves to Zone C...')

    await prisma.$transaction(async (tx) => {
        // 1. Update Profile
        await tx.profile.update({
            where: { id: (userA as any).profile.id },
            data: { currentZoneId: zoneC.id }
        })

        // 2. Update Request (Including Origin Update!)
        await tx.transferRequest.update({
            where: { id: reqA.id },
            data: {
                status: 'active',
                originZoneId: zoneC.id // This is the key fix we applied
            }
        })

        // 3. Validate
        await validateActiveMatches(reqA.id, tx)
    })

    // Verify Result
    const updatedMatch = await prisma.match.findUnique({ where: { id: match.id } })

    if (updatedMatch?.status === 'inactive') {
        console.log('SUCCESS: Match became inactive after origin change.')
    } else {
        console.error('FAILED: Match remained active after origin change.')
    }
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect())
