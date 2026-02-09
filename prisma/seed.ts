import { PrismaClient, DivisionType } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import fs from 'fs'
import path from 'path'
import 'dotenv/config'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('Seeding database...')

    // 1. Create Sector
    const sector = await prisma.sector.upsert({
        where: { id: 1 },
        update: {},
        create: {
            name: 'Εκπαίδευση',
        },
    })
    console.log('Created Sector:', sector.name)

    // 2. Create Divisions
    const divisionsData = [
        { name: 'Πρωτοβάθμια Γενικής' },
        { name: 'Πρωτοβάθμια Ειδικής' },
        { name: 'Δευτεροβάθμια Γενικής' },
        { name: 'Δευτεροβάθμια Ειδικής' },
    ]

    for (const div of divisionsData) {
        await prisma.division.create({
            data: {
                name: div.name,
                sectorId: sector.id,
            },
        })
    }
    console.log('Created Divisions')

    // 3. Import Specialties
    const specialtiesPath = path.join(__dirname, '../docs/specialties.csv')
    const specialtiesContent = fs.readFileSync(specialtiesPath, 'utf-8')
    const specialtiesLines = specialtiesContent.split('\n').filter(line => line.trim() !== '')

    // Skip header
    const specialtiesHeader = specialtiesLines.shift()

    for (const line of specialtiesLines) {
        const [code, name, branchCode, branchName, educationalCategory, isPrimaryStr, isSecondaryStr] = line.split(';')

        if (!code) continue

        await prisma.specialty.create({
            data: {
                code: code.trim(),
                name: name.trim(),
                branchCode: branchCode.trim(),
                branchName: branchName.trim(),
                educationalCategory: educationalCategory.trim(),
                isPrimary: isPrimaryStr.trim() === 'TRUE',
                isSecondary: isSecondaryStr.trim() === 'TRUE',
            },
        })
    }
    console.log('Imported Specialties')

    // 4. Import Regions & Posting Zones
    const zonesPath = path.join(__dirname, '../docs/posting_zones.csv')
    const zonesContent = fs.readFileSync(zonesPath, 'utf-8')
    const zonesLines = zonesContent.split('\n').filter(line => line.trim() !== '')

    // Skip header
    const zonesHeader = zonesLines.shift()

    // Use a map to track regions to avoid duplicates
    const regionMap = new Map<string, number>()

    for (const line of zonesLines) {
        const [name, regionName, divisionTypeStr] = line.split(';')

        if (!name) continue
        const cleanRegionName = regionName.trim()

        let regionId = regionMap.get(cleanRegionName)

        if (regionId === undefined) {
            // Check if region exists in DB (in case of re-run, though we clean or upsert usually)
            // Here we assume clean run or distinct names
            const region = await prisma.region.upsert({
                where: { name: cleanRegionName },
                update: {},
                create: { name: cleanRegionName },
            })
            regionId = region.id
            regionMap.set(cleanRegionName, regionId!)
        }

        const divisionType = divisionTypeStr.trim() === 'Primary' ? DivisionType.Primary : DivisionType.Secondary

        await prisma.postingZone.create({
            data: {
                name: name.trim(),
                regionId: regionId!,
                divisionType: divisionType,
            },
        })
    }
    console.log('Imported Regions & Posting Zones')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
