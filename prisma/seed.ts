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
        const [name, regionName] = line.split(';')

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

        await prisma.postingZone.create({
            data: {
                name: name.trim(),
                regionId: regionId!,
            },
        })
    }
    console.log('Imported Regions & Posting Zones')

    // 5. Import Specialty Analytics
    const analyticsPath = path.join(__dirname, '../docs/specialty_analytics.csv')
    if (fs.existsSync(analyticsPath)) {
        const analyticsContent = fs.readFileSync(analyticsPath, 'utf-8')
        const analyticsLines = analyticsContent.split('\n').filter(line => line.trim() !== '')
        const analyticsHeader = analyticsLines.shift()

        function parseCSVLine(line: string): string[] {
            const result = [];
            let current = '';
            let inQuotes = false;
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                if (char === '"') {
                    if (inQuotes && line[i + 1] === '"') {
                        current += '"';
                        i++;
                    } else {
                        inQuotes = !inQuotes;
                    }
                } else if (char === ',' && !inQuotes) {
                    result.push(current);
                    current = '';
                } else {
                    current += char;
                }
            }
            result.push(current);
            return result;
        }

        for (const line of analyticsLines) {
            const row = parseCSVLine(line)
            if (row.length < 40) continue

            const [
                specialty,
                division,
                successCount,
                successCountHistory,
                successCountDiff,
                baseScore,
                baseScoreHistory,
                baseScoreDiff,
                avgScore,
                avgScoreHistory,
                avgScoreDiff,
                top5DestinationRegions,
                top5CompetitiveRegions,
                nationalPointsRange,
                nationalPointsRangeHistory,
                nationalPointsRangeDiff,
                specialCategoryRate,
                specialCategoryRateHistory,
                specialCategoryRateDiff,
                activeRegionsRate,
                activeRegionsRateHistory,
                activeRegionsRateDiff,
                leavingCount,
                leavingCountHistory,
                leavingCountDiff,
                top5Targeting1st,
                avgScoreApplicants,
                avgScoreApplicantsHistory,
                avgScoreApplicantsDiff,
                averagePreferenceCount,
                averagePreferenceCountHistory,
                averagePreferenceCountDiff,
                pointsEntranceGap,
                pointsEntranceGapHistory,
                pointsEntranceGapDiff,
                oddsOfTransfer,
                oddsOfTransferHistory,
                oddsOfTransferDiff,
                waitingListAbsolute,
                waitingListAbsoluteHistory,
                waitingListAbsoluteDiff
            ] = row

            await prisma.specialtyAnalytics.upsert({
                where: {
                    specialty_division: {
                        specialty: specialty.trim(),
                        division: division.trim(),
                    }
                },
                update: {
                    successCount: parseInt(successCount) || 0,
                    successCountHistory: JSON.parse(successCountHistory || '{}'),
                    successCountDiff: parseInt(successCountDiff) || 0,
                    baseScore: parseFloat(baseScore) || 0,
                    baseScoreHistory: JSON.parse(baseScoreHistory || '{}'),
                    baseScoreDiff: parseFloat(baseScoreDiff) || 0,
                    avgScore: parseFloat(avgScore) || 0,
                    avgScoreHistory: JSON.parse(avgScoreHistory || '{}'),
                    avgScoreDiff: parseFloat(avgScoreDiff) || 0,
                    top5DestinationRegions: JSON.parse(top5DestinationRegions || '{}'),
                    top5CompetitiveRegions: JSON.parse(top5CompetitiveRegions || '{}'),
                    nationalPointsRange: parseFloat(nationalPointsRange) || 0,
                    nationalPointsRangeHistory: JSON.parse(nationalPointsRangeHistory || '{}'),
                    nationalPointsRangeDiff: parseFloat(nationalPointsRangeDiff) || 0,
                    specialCategoryRate: parseFloat(specialCategoryRate) || 0,
                    specialCategoryRateHistory: JSON.parse(specialCategoryRateHistory || '{}'),
                    specialCategoryRateDiff: parseFloat(specialCategoryRateDiff) || 0,
                    activeRegionsRate: parseFloat(activeRegionsRate) || 0,
                    activeRegionsRateHistory: JSON.parse(activeRegionsRateHistory || '{}'),
                    activeRegionsRateDiff: parseFloat(activeRegionsRateDiff) || 0,
                    leavingCount: parseInt(leavingCount) || 0,
                    leavingCountHistory: JSON.parse(leavingCountHistory || '{}'),
                    leavingCountDiff: parseInt(leavingCountDiff) || 0,
                    top5Targeting1st: JSON.parse(top5Targeting1st || '{}'),
                    avgScoreApplicants: parseFloat(avgScoreApplicants) || 0,
                    avgScoreApplicantsHistory: JSON.parse(avgScoreApplicantsHistory || '{}'),
                    avgScoreApplicantsDiff: parseFloat(avgScoreApplicantsDiff) || 0,
                    averagePreferenceCount: parseFloat(averagePreferenceCount) || 0,
                    averagePreferenceCountHistory: JSON.parse(averagePreferenceCountHistory || '{}'),
                    averagePreferenceCountDiff: parseFloat(averagePreferenceCountDiff) || 0,
                    pointsEntranceGap: parseFloat(pointsEntranceGap) || 0,
                    pointsEntranceGapHistory: JSON.parse(pointsEntranceGapHistory || '{}'),
                    pointsEntranceGapDiff: parseFloat(pointsEntranceGapDiff) || 0,
                    oddsOfTransfer: parseFloat(oddsOfTransfer) || 0,
                    oddsOfTransferHistory: JSON.parse(oddsOfTransferHistory || '{}'),
                    oddsOfTransferDiff: parseFloat(oddsOfTransferDiff) || 0,
                    waitingListAbsolute: parseInt(waitingListAbsolute) || 0,
                    waitingListAbsoluteHistory: JSON.parse(waitingListAbsoluteHistory || '{}'),
                    waitingListAbsoluteDiff: parseInt(waitingListAbsoluteDiff) || 0,
                },
                create: {
                    specialty: specialty.trim(),
                    division: division.trim(),
                    successCount: parseInt(successCount) || 0,
                    successCountHistory: JSON.parse(successCountHistory || '{}'),
                    successCountDiff: parseInt(successCountDiff) || 0,
                    baseScore: parseFloat(baseScore) || 0,
                    baseScoreHistory: JSON.parse(baseScoreHistory || '{}'),
                    baseScoreDiff: parseFloat(baseScoreDiff) || 0,
                    avgScore: parseFloat(avgScore) || 0,
                    avgScoreHistory: JSON.parse(avgScoreHistory || '{}'),
                    avgScoreDiff: parseFloat(avgScoreDiff) || 0,
                    top5DestinationRegions: JSON.parse(top5DestinationRegions || '{}'),
                    top5CompetitiveRegions: JSON.parse(top5CompetitiveRegions || '{}'),
                    nationalPointsRange: parseFloat(nationalPointsRange) || 0,
                    nationalPointsRangeHistory: JSON.parse(nationalPointsRangeHistory || '{}'),
                    nationalPointsRangeDiff: parseFloat(nationalPointsRangeDiff) || 0,
                    specialCategoryRate: parseFloat(specialCategoryRate) || 0,
                    specialCategoryRateHistory: JSON.parse(specialCategoryRateHistory || '{}'),
                    specialCategoryRateDiff: parseFloat(specialCategoryRateDiff) || 0,
                    activeRegionsRate: parseFloat(activeRegionsRate) || 0,
                    activeRegionsRateHistory: JSON.parse(activeRegionsRateHistory || '{}'),
                    activeRegionsRateDiff: parseFloat(activeRegionsRateDiff) || 0,
                    leavingCount: parseInt(leavingCount) || 0,
                    leavingCountHistory: JSON.parse(leavingCountHistory || '{}'),
                    leavingCountDiff: parseInt(leavingCountDiff) || 0,
                    top5Targeting1st: JSON.parse(top5Targeting1st || '{}'),
                    avgScoreApplicants: parseFloat(avgScoreApplicants) || 0,
                    avgScoreApplicantsHistory: JSON.parse(avgScoreApplicantsHistory || '{}'),
                    avgScoreApplicantsDiff: parseFloat(avgScoreApplicantsDiff) || 0,
                    averagePreferenceCount: parseFloat(averagePreferenceCount) || 0,
                    averagePreferenceCountHistory: JSON.parse(averagePreferenceCountHistory || '{}'),
                    averagePreferenceCountDiff: parseFloat(averagePreferenceCountDiff) || 0,
                    pointsEntranceGap: parseFloat(pointsEntranceGap) || 0,
                    pointsEntranceGapHistory: JSON.parse(pointsEntranceGapHistory || '{}'),
                    pointsEntranceGapDiff: parseFloat(pointsEntranceGapDiff) || 0,
                    oddsOfTransfer: parseFloat(oddsOfTransfer) || 0,
                    oddsOfTransferHistory: JSON.parse(oddsOfTransferHistory || '{}'),
                    oddsOfTransferDiff: parseFloat(oddsOfTransferDiff) || 0,
                    waitingListAbsolute: parseInt(waitingListAbsolute) || 0,
                    waitingListAbsoluteHistory: JSON.parse(waitingListAbsoluteHistory || '{}'),
                    waitingListAbsoluteDiff: parseInt(waitingListAbsoluteDiff) || 0,
                },
            })
        }
    console.log('Imported Specialty Analytics')
    }
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
