import { prisma } from '@/lib/prisma'
import { AnalyticsHeader } from '@/components/stats/AnalyticsHeader'
import { StatCardBarChart } from '@/components/stats/StatCardBarChart'
import { GroupedCSSBarChart } from '@/components/stats/GroupedCSSBarChart'
import { MigrationFlows } from '@/components/stats/MigrationFlows'
import { notFound } from 'next/navigation'

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
  const stats = await prisma.transferStatistics.findFirst({
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

  // Comparative data for large charts
  const comparisonBaseAvg = ['2024', '2025', '2026'].map(year => ({
    year,
    val1: baseHistory[year],
    val2: avgAppHistory[year]
  }))

  const comparisonDemandSupply = ['2024', '2025', '2026'].map(year => ({
    year,
    val1: targetingHistory[year],
    val2: successHistory[year]
  }))

  return (
    <div className="p-4 md:p-8 text-slate-900 antialiased min-h-screen bg-[#f8fafc] font-sans pt-24 md:pt-28">
      <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
        
        <AnalyticsHeader 
          zoneName={zoneName}
          specialtyCode={specialty}
          specialtyName={specialtyInfo?.name}
          difficultyCategory={stats.difficultyCategory}
          difficultyTrend={stats.difficultyCategoryTrend}
          division={division}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <StatCardBarChart 
            title="Μεταθεσεις (Πραγμ.)"
            currentValue={stats.successCount}
            history={successHistory}
            color="sky"
            diffLabel={`${stats.successCountDiff > 0 ? '+' : ''}${stats.successCountDiff}%`}
            diffDirection={stats.successCountDiff >= 0 ? 'up' : 'down'}
            diffColor={stats.successCountDiff >= 0 ? 'teal' : 'rose'}
          />

          <StatCardBarChart 
            title="Βαση Μοριων"
            currentValue={stats.baseScore?.toFixed(2) || '-'}
            history={baseHistory}
            color="rose"
            diffLabel={`${stats.baseScoreDiff && stats.baseScoreDiff > 0 ? '+' : ''}${stats.baseScoreDiff?.toFixed(1) || '0'}%`}
            diffDirection={(stats.baseScoreDiff || 0) >= 0 ? 'up' : 'down'}
            diffColor={(stats.baseScoreDiff || 0) >= 0 ? 'teal' : 'rose'}
          />

          <StatCardBarChart 
            title="Ζητηση (1η Προτ.)"
            currentValue={stats.targeting1stCount}
            history={targetingHistory}
            color="indigo"
            diffLabel={`${stats.targeting1stCountDiff > 0 ? '+' : ''}${stats.targeting1stCountDiff}%`}
            diffDirection={stats.targeting1stCountDiff >= 0 ? 'up' : 'down'}
            diffColor={stats.targeting1stCountDiff >= 0 ? 'teal' : 'rose'}
          />

          <StatCardBarChart 
            title="Αιτησεις Αποχωρησης"
            currentValue={stats.leavingCount}
            history={leavingHistory}
            color="orange"
            diffLabel={`${stats.leavingCountDiff > 0 ? '+' : ''}${stats.leavingCountDiff}%`}
            diffDirection={stats.leavingCountDiff >= 0 ? 'up' : 'down'}
            diffColor={stats.leavingCountDiff >= 0 ? 'teal' : 'rose'}
          />

          <StatCardBarChart 
            title="Μ.Ο. Μοριων Επιτυχοντων"
            currentValue={stats.avgScore?.toFixed(2) || '-'}
            history={avgHistory}
            color="slate"
          />

          <StatCardBarChart 
            title="Μ.Ο. Μοριων Αιτουντων"
            currentValue={stats.avgScoreApplicants?.toFixed(2) || '-'}
            history={avgAppHistory}
            color="slate"
            diffLabel={`${stats.avgScoreAppDiff && stats.avgScoreAppDiff > 0 ? '+' : ''}${stats.avgScoreAppDiff?.toFixed(1) || '0'}%`}
            diffDirection={(stats.avgScoreAppDiff || 0) >= 0 ? 'up' : 'down'}
            diffColor={(stats.avgScoreAppDiff || 0) >= 0 ? 'teal' : 'rose'}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <GroupedCSSBarChart 
            title="Σύγκριση Μορίων & Βάσεων"
            subtitle="Πώς κινήθηκε η βάση σε σχέση με τους αιτούντες"
            data={comparisonBaseAvg}
            label1="Βαση"
            label2="Μ.Ο. Αιτουντων"
            color1="rose"
            color2="slate"
          />

          <GroupedCSSBarChart 
            title="Ισοζύγιο Προσφοράς & Ζήτησης"
            subtitle="Σύγκριση αιτήσεων (1η επιλογή) με πραγματικές θέσεις"
            data={comparisonDemandSupply}
            label1="Ζητηση"
            label2="Μεταθεσεις"
            color1="indigo"
            color2="sky"
          />
        </div>

        <MigrationFlows inflow={inflow} outflow={outflow} />

      </div>
    </div>
  )
}
