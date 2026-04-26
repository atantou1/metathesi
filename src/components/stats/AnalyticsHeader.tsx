'use client'

import Link from 'next/link'

interface AnalyticsHeaderProps {
  zoneName: string
  specialtyCode: string
  specialtyName?: string
  difficultyCategory: string
  difficultyTrend: string
  division?: string
  satisfactionRate: number
  satisfactionTrend: number
}

export function AnalyticsHeader({
  zoneName,
  specialtyCode,
  specialtyName,
  difficultyCategory,
  difficultyTrend,
  division,
  satisfactionRate,
  satisfactionTrend
}: AnalyticsHeaderProps) {
  
  // Difficulty Mapping
  const diffMap: Record<string, { label: string; color: string; icon: string }> = {
    Extreme:   { label: 'Υψηλός Ανταγωνισμός', color: 'text-danger bg-danger-soft border-danger/20', icon: '🔴' },
    High:      { label: 'Αυξημένος Ανταγωνισμός',  color: 'text-warning bg-warning-soft border-warning/20', icon: '🟠' },
    Moderate:  { label: 'Υπολογίσιμος Ανταγωνισμός', color: 'text-info bg-info-soft border-info/20', icon: '🔵' },
    Accessible: { label: 'Ήπιος Ανταγωνισμός', color: 'text-success bg-success-soft border-success/20', icon: '🟢' },
    Unknown:   { label: 'Χωρίς Δεδομένα', color: 'text-text-tertiary bg-surface-dim border-border', icon: '⚪' },
  }
  
  const diff = diffMap[difficultyCategory] || diffMap.Unknown

  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between bg-card border border-border shadow-soft p-6 sm:p-8 rounded-xl">
      <div>
        <div className="flex items-center space-x-3 mb-3">
          <Link 
            href={`/stats${division || specialtyCode ? '?' : ''}${division ? `division=${encodeURIComponent(division)}` : ''}${division && specialtyCode ? '&' : ''}${specialtyCode ? `specialty=${encodeURIComponent(specialtyCode)}` : ''}`}
            className="text-muted-foreground hover:text-primary hover:bg-primary-soft transition-colors flex items-center text-xs font-bold px-3 py-1.5 rounded-2xl border border-transparent hover:border-primary/20 cursor-pointer"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Επιστροφή στον Χάρτη
          </Link>
          <span className="px-2.5 py-1 rounded-2xl text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground border border-border">
            {specialtyCode}{specialtyName ? ` - ${specialtyName}` : ''}
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">{zoneName}</h1>
        
        <div className="flex items-center gap-2 mt-4">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Ικανοποιηση Κλαδου:</span>
          <span className="text-base font-black text-primary">{satisfactionRate.toFixed(1)}%</span>
          {satisfactionTrend !== 0 && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-2xl flex items-center border shadow-sm ${satisfactionTrend >= 0 ? 'text-success bg-success-soft border-success/20' : 'text-danger bg-danger-soft border-danger/20'}`}>
              {satisfactionTrend >= 0 ? '+' : ''}{satisfactionTrend.toFixed(1)}% 
              <svg className={`w-3 h-3 ml-0.5 ${satisfactionTrend < 0 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
            </span>
          )}
        </div>
      </div>
      
      <div className="mt-5 md:mt-0 flex flex-col items-start md:items-end">
        <span className={`px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest border shadow-sm flex items-center ${diff.color}`}>
          <span className={`h-2 w-2 rounded-full mr-2.5 animate-pulse shadow-[0_0_5px_rgba(244,63,94,0.5)] bg-current`}></span>
          {diff.label}
        </span>
      </div>
    </div>
  )
}
