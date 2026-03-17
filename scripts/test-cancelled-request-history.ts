import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { findMatches } from '../src/lib/matching'

async function main() {
    console.log('Starting Cancelled Request History Test...')

    // 1. Create Test Data (User A & User B matched)
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

    const zoneA = await prisma.postingZone.create({ data: { name: `Zone A ${uniqueId}`, regionId: region.id } })
    const zoneB = await prisma.postingZone.create({ data: { name: `Zone B ${uniqueId}`, regionId: region.id } })

    // User A
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

    // Request A
    const reqA = await prisma.transferRequest.create({
        data: {
            profileId: (userA as any).profile.id,
            // @ts-ignore
            originZoneId: zoneA.id,
            targetZones: {
                create: [{ zoneId: zoneB.id, priorityOrder: 1 }]
            }
        }
    })

    // User B
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

    // Request B
    const reqB = await prisma.transferRequest.create({
        data: {
            profileId: (userB as any).profile.id,
            // @ts-ignore
            originZoneId: zoneB.id,
            targetZones: {
                create: [{ zoneId: zoneA.id, priorityOrder: 1 }]
            }
        }
    })

    // Create Match
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

    // 2. Scenario: User A Cancels Request
    console.log('User A cancels request...')
    await prisma.transferRequest.update({
        where: { id: reqA.id },
        // @ts-ignore
        data: { status: 'inactive' } // "cancelled"
    })

    // Also invalidate match
    await prisma.match.update({
        where: { id: match.id },
        data: { status: 'inactive' }
    })

    // 3. User A checks matches (History)
    console.log('User A checking matches (with inactive request)...')
    const matchesA = await findMatches((userA as any).profile.id)

    if (matchesA.length > 0) {
        console.log(`SUCCESS: User A sees ${matchesA.length} match(es) in history.`)
        console.log('Match Status:', matchesA[0].status)
    } else {
        console.error('FAILED: User A sees NO matches.')
    }
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect())
