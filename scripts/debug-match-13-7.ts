import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
    console.log('Inspecting Requests 13 and 7...')

    const r13 = await prisma.transferRequest.findUnique({
        where: { id: 13 },
        include: {
            profile: {
                include: {
                    specialty: true,
                    division: true,
                    currentZone: true
                }
            },
            originZone: true,
            targetZones: {
                include: { zone: true }
            }
        }
    })

    const r7 = await prisma.transferRequest.findUnique({
        where: { id: 7 },
        include: {
            profile: {
                include: {
                    specialty: true,
                    division: true,
                    currentZone: true
                }
            },
            originZone: true,
            targetZones: {
                include: { zone: true }
            }
        }
    })

    if (!r13 || !r7) {
        console.error('One or both requests not found!', { r13: !!r13, r7: !!r7 })
        return
    }

    console.log('--- Request 13 ---')
    console.log(`Status: ${r13.status}`)
    console.log(`User: ${r13.profile.fullName} (Profile ID: ${r13.profileId})`)
    console.log(`Specialty: [${r13.profile.specialtyId}] ${r13.profile.specialty.code} - ${r13.profile.specialty.name}`)
    console.log(`Division: [${r13.profile.divisionId}] ${r13.profile.division.name}`)
    console.log(`Origin Zone (Profile): [${r13.profile.currentZoneId}] ${r13.profile.currentZone.name}`)
    console.log(`Origin Zone (Request): [${r13.originZoneId}] ${r13.originZone?.name}`)
    console.log('Target Zones:')
    r13.targetZones.forEach(t => console.log(`  - [${t.zoneId}] ${t.zone.name} (Priority: ${t.priorityOrder})`))

    console.log('\n--- Request 7 ---')
    console.log(`Status: ${r7.status}`)
    console.log(`User: ${r7.profile.fullName} (Profile ID: ${r7.profileId})`)
    console.log(`Specialty: [${r7.profile.specialtyId}] ${r7.profile.specialty.code} - ${r7.profile.specialty.name}`)
    console.log(`Division: [${r7.profile.divisionId}] ${r7.profile.division.name}`)
    console.log(`Origin Zone (Profile): [${r7.profile.currentZoneId}] ${r7.profile.currentZone.name}`)
    console.log(`Origin Zone (Request): [${r7.originZoneId}] ${r7.originZone?.name}`)
    console.log('Target Zones:')
    r7.targetZones.forEach(t => console.log(`  - [${t.zoneId}] ${t.zone.name} (Priority: ${t.priorityOrder})`))

    console.log('\n--- Matching Analysis ---')

    const sameSpecialty = r13.profile.specialtyId === r7.profile.specialtyId
    console.log(`Same Specialty? ${sameSpecialty}`)

    const sameDivision = r13.profile.divisionId === r7.profile.divisionId
    console.log(`Same Division? ${sameDivision}`)

    const r13TargetIncludesR7Origin = r13.targetZones.some(t => t.zoneId === r7.originZoneId)
    console.log(`Request 13 wants Request 7 Origin (${r7.originZoneId})? ${r13TargetIncludesR7Origin}`)

    const r7TargetIncludesR13Origin = r7.targetZones.some(t => t.zoneId === r13.originZoneId)
    console.log(`Request 7 wants Request 13 Origin (${r13.originZoneId})? ${r7TargetIncludesR13Origin}`)

    if (sameSpecialty && sameDivision && r13TargetIncludesR7Origin && r7TargetIncludesR13Origin) {
        console.log('CRITERIA MET. Match should exist.')
    } else {
        console.log('CRITERIA NOT MET.')
    }
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect())
