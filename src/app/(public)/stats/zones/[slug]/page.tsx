import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ZoneDetailedStatsClient from './ZoneDetailedStatsClient'
import { MigrationFlows } from '@/components/stats/MigrationFlows'

export default async function ZoneDetailedStatsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ division?: string; specialty?: string }>
}) {
  const { slug } = await params
  const { division, specialty } = await searchParams

  if (!division || !specialty) {
    notFound()
  }

  const zoneName = decodeURIComponent(slug)

  // Fetch data
  const stats = await (prisma as any).transferStatistics.findFirst({
    where: {
      region: zoneName,
      division: division,
      specialty: specialty
    }
  })

  if (!stats) {
    notFound()
  }

  // Fetch specialty info for name
  const specialtyInfo = await prisma.specialty.findUnique({
    where: { code: specialty }
  })

  // Helper to parse JSON history
  const parseHistory = (json: any): Record<string, number | null> => {
    if (!json) return {}
    try {
      return typeof json === 'string' ? JSON.parse(json) : json
    } catch {
      return {}
    }
  }

  const successHistory = parseHistory(stats.successCountHistory)
  const baseHistory = parseHistory(stats.baseScoreHistory)
  const targetingHistory = parseHistory(stats.targeting1stCountHistory)
  const leavingHistory = parseHistory(stats.leavingCountHistory)
  const avgHistory = parseHistory(stats.avgScoreHistory)
  const avgAppHistory = parseHistory(stats.avgScoreAppHistory)

  // Helper to parse migration flows
  const parseFlows = (json: any) => {
    if (!json) return []
    try {
      const obj = typeof json === 'string' ? JSON.parse(json) : json
      return Object.entries(obj)
        .map(([name, count]) => ({ name, count: Number(count) }))
        .sort((a, b) => b.count - a.count)
    } catch {
      return []
    }
  }

  const inflow = parseFlows(stats.inflowOriginsJson)
  const outflow = parseFlows(stats.outflowTargetsJson)

  // Calculate Branch Satisfaction across all regions
  const allRegionsStats = await (prisma as any).transferStatistics.findMany({
    where: { specialty, division },
    select: { successCountHistory: true, leavingCountHistory: true }
  })

  // Identify years
  const currentYear = '2026'
  const previousYear = '2025'

  let totalSuccessCurrent = 0
  let totalLeavingCurrent = 0
  let totalSuccessPrev = 0
  let totalLeavingPrev = 0

  allRegionsStats.forEach((item: { successCountHistory: any; leavingCountHistory: any }) => {
    const sHist = parseHistory(item.successCountHistory)
    const lHist = parseHistory(item.leavingCountHistory)
    
    totalSuccessCurrent += (Number(sHist[currentYear]) || 0)
    totalLeavingCurrent += (Number(lHist[currentYear]) || 0)
    totalSuccessPrev += (Number(sHist[previousYear]) || 0)
    totalLeavingPrev += (Number(lHist[previousYear]) || 0)
  })

  const satisfactionRate = totalLeavingCurrent > 0 
    ? (totalSuccessCurrent / totalLeavingCurrent) * 100 
    : 0

  const prevSatisfactionRate = totalLeavingPrev > 0
    ? (totalSuccessPrev / totalLeavingPrev) * 100
    : 0

  const satisfactionTrend = satisfactionRate - prevSatisfactionRate

  return (
    <>
      <ZoneDetailedStatsClient 
        zoneName={zoneName}
        specialtyCode={specialty}
        specialtyName={specialtyInfo?.name}
        division={division}
        stats={stats}
        successHistory={successHistory}
        baseHistory={baseHistory}
        targetingHistory={targetingHistory}
        leavingHistory={leavingHistory}
        avgHistory={avgHistory}
        avgAppHistory={avgAppHistory}
        satisfactionRate={satisfactionRate}
        satisfactionTrend={satisfactionTrend}
        inflow={inflow}
        outflow={outflow}
      />
    </>
  )
}
