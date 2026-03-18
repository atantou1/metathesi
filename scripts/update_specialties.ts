import { PrismaClient } from '@prisma/client'
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
    console.log('Updating specialties...')
    const specialtiesPath = path.join(process.cwd(), 'docs', 'specialties.csv')
    const specialtiesContent = fs.readFileSync(specialtiesPath, 'utf-8')
    const specialtiesLines = specialtiesContent.split('\n').filter(line => line.trim() !== '')

    specialtiesLines.shift()

    for (const line of specialtiesLines) {
        const [code, name, branchCode, branchName, educationalCategory, isPrimaryStr, isSecondaryStr] = line.split(';')

        if (!code) continue

        await prisma.specialty.upsert({
            where: { code: code.trim() },
            update: {
                name: name.trim(),
                branchCode: branchCode.trim(),
                branchName: branchName.trim(),
                educationalCategory: educationalCategory.trim(),
                isPrimary: isPrimaryStr.trim().toUpperCase() === 'TRUE',
                isSecondary: isSecondaryStr.trim().toUpperCase() === 'TRUE',
            },
            create: {
                code: code.trim(),
                name: name.trim(),
                branchCode: branchCode.trim(),
                branchName: branchName.trim(),
                educationalCategory: educationalCategory.trim(),
                isPrimary: isPrimaryStr.trim().toUpperCase() === 'TRUE',
                isSecondary: isSecondaryStr.trim().toUpperCase() === 'TRUE',
            },
        })
    }
    
    // Delete any specialties that are not in the CSV
    const validCodes = specialtiesLines
        .map(line => line.split(';')[0]?.trim())
        .filter(Boolean)
        
    const deleteResult = await prisma.specialty.deleteMany({
        where: {
            code: {
                notIn: validCodes
            }
        }
    })
    
    console.log(`Deleted ${deleteResult.count} obsolete specialties.`)
    console.log('Specialties updated successfully.')
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
