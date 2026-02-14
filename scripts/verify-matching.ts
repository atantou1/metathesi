
import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { findMatches } from '../src/lib/matching'

async function main() {
    console.log('Starting verification...')

    // 1. Create Test Data
    const uniqueId = Date.now()

    // Create dependencies
    const sector = await prisma.sector.create({ data: { name: `Test Sector ${uniqueId}` } })
    const division = await prisma.division.create({ data: { name: `Test Division ${uniqueId}`, sectorId: sector.id } })
    const specialty = await prisma.specialty.create({
        data: {
            code: `T${uniqueId}`,
            name: 'ΠΕ86 Πληροφορικοί',
            branchCode: 'B1',
            branchName: 'Branch',
            educationalCategory: 'Category',
            isPrimary: true,
            isSecondary: true
        }
    })
    const region = await prisma.region.create({ data: { name: `Test Region ${uniqueId}` } })

    // Create Zones
    const zoneA = await prisma.postingZone.create({
        data: { name: `Zone A ${uniqueId}`, regionId: region.id, divisionType: 'Secondary' }
    })
    const zoneB = await prisma.postingZone.create({
        data: { name: `Zone B ${uniqueId}`, regionId: region.id, divisionType: 'Secondary' }
    })
    const zoneC = await prisma.postingZone.create({
        data: { name: `Zone C ${uniqueId}`, regionId: region.id, divisionType: 'Secondary' }
    })

    // Create User A (The Seeker)
    // Currently at Zone A, Wants Zone B
    console.log('Creating User A...')
    const userA = await prisma.user.create({
        data: {
            email: `userA_${uniqueId}@test.com`,
            passwordHash: 'hash',
            fullName: 'Teacher A',
            profile: {
                create: {
                    specialtyId: specialty.id,
                    divisionId: division.id,
                    currentZoneId: zoneA.id,
                    // @ts-ignore
                    fullName: 'Teacher A Profile'
                }
            }
        },
        include: { profile: true }
    })

    // Request A: Wants Zone B (1st choice)
    await prisma.transferRequest.create({
        data: {
            profileId: (userA as any).profile.id,
            targetZones: {
                create: [
                    { zoneId: zoneB.id, priorityOrder: 1 }
                ]
            }
        }
    })

    // Create User B (The Match)
    // Currently at Zone B, Wants Zone A (3rd choice)
    console.log('Creating User B...')
    const userB = await prisma.user.create({
        data: {
            email: `userB_${uniqueId}@test.com`,
            passwordHash: 'hash',
            fullName: 'Teacher B',
            profile: {
                create: {
                    specialtyId: specialty.id,
                    divisionId: division.id,
                    currentZoneId: zoneB.id,
                    // @ts-ignore
                    fullName: 'Teacher B Profile'
                }
            }
        },
        include: { profile: true }
    })

    // Request B: Wants Zone C (1st), Zone D (2nd), Zone A (3rd - The MATCH!)
    await prisma.transferRequest.create({
        data: {
            profileId: (userB as any).profile.id,
            targetZones: {
                create: [
                    { zoneId: zoneC.id, priorityOrder: 1 },
                    // { zoneId: zoneC.id, priorityOrder: 2 }, // removed due to unique constraint
                    { zoneId: zoneA.id, priorityOrder: 3 }
                ]
            }
        }
    })

    console.log('Test data created.')

    // 2. Run findMatches for User A
    console.log(`Finding matches for User A (Profile ID: ${(userA as any).profile.id})...`)
    const matches = await findMatches((userA as any).profile.id)

    console.log(`Found ${matches.length} matches.`)

    // 3. Verify Match Data
    if (matches.length > 0) {
        const match = matches[0]
        console.log('Match details:', JSON.stringify(match, null, 2))

        // Check attributes
        const isRankCorrect = match.rank === 3

        console.log(`Rank correct (expected 3): ${isRankCorrect}`)
        console.log(`CompletedAt is null: ${match.completedAt === null}`)
        console.log(`Specialty: ${match.user.specialty.name}`)
        console.log(`Organic: ${match.user.currentZone.name}`)

        if (isRankCorrect) {
            console.log('VERIFICATION SUCCESSFUL')
        } else {
            console.log('VERIFICATION FAILED: Rank incorrect')
        }

    } else {
        console.log('No matches found! verification FAILED')
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
