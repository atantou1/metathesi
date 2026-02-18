import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { findMatches } from '../src/lib/matching'
import { validateActiveMatches } from '../src/lib/matching'

async function main() {
    console.log('Starting Invalidation Test...')

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
    const zoneA = await prisma.postingZone.create({ data: { name: `Zone A ${uniqueId}`, regionId: region.id, divisionType: 'Secondary' } })
    const zoneB = await prisma.postingZone.create({ data: { name: `Zone B ${uniqueId}`, regionId: region.id, divisionType: 'Secondary' } })
    const zoneC = await prisma.postingZone.create({ data: { name: `Zone C ${uniqueId}`, regionId: region.id, divisionType: 'Secondary' } })

    // Create User A (The Seeker) - In Zone A, Wants Zone B
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
    const reqB = await prisma.transferRequest.create({
        data: {
            profileId: (userB as any).profile.id,
            originZoneId: zoneB.id,
            targetZones: {
                create: [{ zoneId: zoneA.id, priorityOrder: 1 }]
            }
        }
    })

    // 2. Trigger Matching
    console.log('Triggering matching...')
    await findMatches((userA as any).profile.id)

    // Verify Match Exists
    const matchBefore = await prisma.match.findFirst({
        where: {
            status: 'active',
            participants: {
                some: { requestId: reqA.id }
            }
        },
        include: { participants: true }
    })

    if (!matchBefore) {
        console.error('FAILED: No match created initially.')
        return
    }
    console.log('Match created successfully:', matchBefore.id)

    // 3. Scenario 1: Non-Breaking Change
    // User A adds Zone C as 2nd choice. Still wants Zone B (match target).
    console.log('Scenario 1: Updating User A request (Adding Zone C, keeping Zone B)...')

    // We can't easily call existing server actions from script due to auth check.
    // So we invoke the logic directly or simulate it via DB update + validation call.
    // Let's simulate:

    await prisma.$transaction(async (tx) => {
        // Update targets
        await tx.targetZone.deleteMany({ where: { requestId: reqA.id } })
        await tx.targetZone.create({ data: { requestId: reqA.id, zoneId: zoneB.id, priorityOrder: 1 } }) // Keep B
        await tx.targetZone.create({ data: { requestId: reqA.id, zoneId: zoneC.id, priorityOrder: 2 } }) // Add C
    })

    // Run Validation
    await validateActiveMatches(reqA.id, prisma)

    const matchAfterScenario1 = await prisma.match.findUnique({ where: { id: matchBefore.id } })
    if (matchAfterScenario1?.status === 'active') {
        console.log('SUCCESS: Match remained active after non-breaking change.')
    } else {
        console.error('FAILED: Match became inactive after non-breaking change.')
    }

    // 4. Scenario 2: Breaking Change
    // User A removes Zone B. Now wants ONLY Zone C.
    console.log('Scenario 2: Updating User A request (Removing Zone B, keeping Zone C)...')

    await prisma.$transaction(async (tx) => {
        // Update targets
        await tx.targetZone.deleteMany({ where: { requestId: reqA.id } })
        // await tx.targetZone.create({ data: { requestId: reqA.id, zoneId: zoneB.id, priorityOrder: 1 } }) // REMOVE B
        await tx.targetZone.create({ data: { requestId: reqA.id, zoneId: zoneC.id, priorityOrder: 1 } }) // Keep C
    })

    // Run Validation
    await validateActiveMatches(reqA.id, prisma)

    const matchAfterScenario2 = await prisma.match.findUnique({ where: { id: matchBefore.id } })
    if (matchAfterScenario2?.status === 'inactive') {
        console.log('SUCCESS: Match became inactive after breaking change.')
    } else {
        console.error('FAILED: Match remained active after breaking change.')
    }
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect())
