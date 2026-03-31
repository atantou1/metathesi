'use client'

import Link from 'next/link'

interface AnalyticsHeaderProps {
  zoneName: string
  specialtyCode: string
  specialtyName?: string
  difficultyCategory: string
  difficultyTrend: string
  division?: string
}

export function AnalyticsHeader({
  zoneName,
  specialtyCode,
  specialtyName,
  difficultyCategory,
  difficultyTrend,
  division
}: AnalyticsHeaderProps) {
  
  // Difficulty Mapping
  const diffMap: Record<string, { label: string; color: string; icon: string }> = {
    Extreme:   { label: 'Ακραία Δυσκολία', color: 'text-rose-600 bg-rose-50 border-rose-100', icon: '🔴' },
    High:      { label: 'Υψηλή Δυσκολία',  color: 'text-orange-600 bg-orange-50 border-orange-100', icon: '🟠' },
    Moderate:  { label: 'Μεσαία Δυσκολία', color: 'text-amber-600 bg-amber-50 border-amber-100', icon: '🟡' },
    Accessible: { label: 'Εύκολη Πρόσβαση', color: 'text-emerald-600 bg-emerald-50 border-emerald-100', icon: '🟢' },
    Unknown:   { label: 'Άγνωστη Δυσκολία', color: 'text-slate-500 bg-slate-50 border-slate-100', icon: '⚪' },
  }
  
  const diff = diffMap[difficultyCategory] || diffMap.Unknown

  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between bg-white border border-slate-100 shadow-[0_8px_30px_-4px_rgba(3,105,161,0.05)] p-6 sm:p-8 rounded-[2rem]">
      <div>
        <div className="flex items-center space-x-3 mb-3">
          <Link 
            href={`/stats${division || specialtyCode ? '?' : ''}${division ? `division=${encodeURIComponent(division)}` : ''}${division && specialtyCode ? '&' : ''}${specialtyCode ? `specialty=${encodeURIComponent(specialtyCode)}` : ''}`}
            className="text-slate-500 hover:text-[#0369a1] hover:bg-sky-50 transition-colors flex items-center text-xs font-bold px-3 py-1.5 rounded-xl border border-transparent hover:border-sky-100 cursor-pointer"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Επιστροφή στον Χάρτη
          </Link>
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-50 text-slate-500 border border-slate-200">
            {specialtyCode}{specialtyName ? ` - ${specialtyName}` : ''}
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">{zoneName}</h1>
        
        <div className="flex items-center gap-2 mt-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Ικανοποιηση Κλαδου:</span>
          <span className="text-base font-black text-[#0369a1]">12.5%</span> {/* TODO: Change based on data if available */}
          <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded-md flex items-center border border-teal-100 shadow-sm">
            +1.2% <svg className="w-3 h-3 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
          </span>
        </div>
      </div>
      
      <div className="mt-5 md:mt-0 flex flex-col items-start md:items-end">
        <span className={`px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest border shadow-sm flex items-center ${diff.color}`}>
          <span className={`h-2 w-2 rounded-full mr-2.5 animate-pulse shadow-[0_0_5px_rgba(244,63,94,0.5)] bg-current`}></span>
          {diff.label}
        </span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 px-1">Δείκτης: Ζήτηση / Προσφορά</span>
      </div>
    </div>
  )
}
