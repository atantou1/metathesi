import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { validateActiveMatches, findMatches } from '../src/lib/matching'

async function main() {
    console.log('Starting New Match After Update Test...')

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
                    currentZoneId: zoneA.id, // User A is in Zone A
                    // @ts-ignore
                    fullName: 'User A Profile'
                }
            }
        },
        include: { profile: true }
    })

    // Request A: Wants Zone B
    console.log('Creating Request A (Origin: A, Target: B)...')
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

    // Create User B (The Match Candidate) - In Zone C! (Not B, so no match yet), Wants Zone A
    console.log('Creating User B (Origin: C, Target: A)...')
    const userB = await prisma.user.create({
        data: {
            email: `userB_${uniqueId}@test.com`,
            passwordHash: 'hash',
            fullName: 'User B',
            profile: {
                create: {
                    specialtyId: specialty.id,
                    divisionId: division.id,
                    currentZoneId: zoneC.id, // User B is in Zone C
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
            // @ts-ignore
            originZoneId: zoneC.id, // Origin is C
            targetZones: {
                create: [{ zoneId: zoneA.id, priorityOrder: 1 }]
            }
        }
    })

    // 2. Trigger Matching (Should find NO match because User B is in C, but User A wants B)
    console.log('Initial matching check...')
    await findMatches((userA as any).profile.id)

    const initialMatch = await prisma.match.findFirst({
        where: { status: 'active', participants: { some: { requestId: reqA.id } } }
    })

    if (initialMatch) {
        console.error('FAILED: Match found prematurely! User A wants B, but User B is in C.')
        return
    } else {
        console.log('Correct: No match found initially.')
    }


    // 3. Scenario: User B moves to Zone B (Now creating a match condition!)
    // We simulate what wizard.ts/request.ts does: 
    // 1. Update Profile (User B moved to B)
    // 2. Update Request (Origin -> B, Status -> Active)
    // 3. OR simply update Request Origin if we are just editing request? 
    // Let's assume User B updates their profile/request via Wizard.

    console.log('Simulating User B Update: Moving to Zone B (Now matching User A\'s wish)...')

    await prisma.$transaction(async (tx) => {
        // 1. Update Profile
        await tx.profile.update({
            where: { id: (userB as any).profile.id },
            data: { currentZoneId: zoneB.id }
        })

        // 2. Update Request (Origin -> B)
        await tx.transferRequest.update({
            where: { id: reqB.id },
            data: {
                status: 'active',
                // @ts-ignore
                originZoneId: zoneB.id
            }
        })

        // 3. Validate (Nothing to validate for B really as no match exists)
        await validateActiveMatches(reqB.id, tx)
    })

    // 4. Trigger Find Matches (This is what we added!)
    // We expect this to finding the new match
    console.log('Triggering findMatches after update...')
    await findMatches((userB as any).profile.id)

    // Verify Result
    const newMatch = await prisma.match.findFirst({
        where: { status: 'active', participants: { some: { requestId: reqB.id } } }
    })

    if (newMatch) {
        console.log('SUCCESS: New match created after origin update.')
    } else {
        console.error('FAILED: No match created after origin update.')
    }
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect())
