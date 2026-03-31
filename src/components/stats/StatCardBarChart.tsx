'use client'

interface StatCardBarChartProps {
  title: string
  currentValue: string | number
  history: Record<string, number | null | undefined>
  color: 'sky' | 'rose' | 'indigo' | 'orange' | 'slate'
  diffLabel?: string
  diffDirection?: 'up' | 'down'
  diffColor?: 'teal' | 'rose' | 'slate'
}

export function StatCardBarChart({
  title,
  currentValue,
  history,
  color,
  diffLabel,
  diffDirection,
  diffColor = 'slate'
}: StatCardBarChartProps) {
  
  // Extract values for 5 years
  const years = ['2022', '2023', '2024', '2025', '2026']
  const values = years.map(y => history[y] ?? null)
  const nonNullValues = values.filter(v => v !== null) as number[]
  const maxValue = nonNullValues.length > 0 ? Math.max(...nonNullValues) : 0
  
  // If no data at all
  if (nonNullValues.length === 0) {
    return (
      <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:border-slate-200 transition-all group flex flex-col justify-between h-48">
        <div>
          <div className="flex justify-between items-start mb-1">
            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest group-hover:text-slate-500 transition-colors">{title}</div>
          </div>
          <div className="text-3xl font-black text-slate-300 tracking-tight">-</div>
        </div>
        <div className="flex items-center justify-center h-16 w-full mt-2 border-2 border-dashed border-slate-100 rounded-lg bg-slate-50/50">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Μη Διαθέσιμο</span>
        </div>
      </div>
    )
  }

  // Color mapping for Tailwind classes
  const colorMap: Record<string, { text: string; bg: string; borderHover: string; bar: string }> = {
    sky:    { text: 'text-sky-600',    bg: 'bg-sky-50',    borderHover: 'hover:border-sky-200',    bar: 'bg-sky-500' },
    rose:   { text: 'text-rose-500',   bg: 'bg-rose-50',   borderHover: 'hover:border-rose-200',   bar: 'bg-rose-500' },
    indigo: { text: 'text-indigo-600', bg: 'bg-indigo-50', borderHover: 'hover:border-indigo-200', bar: 'bg-indigo-500' },
    orange: { text: 'text-orange-500', bg: 'bg-orange-50', borderHover: 'hover:border-orange-200', bar: 'bg-orange-500' },
    slate:  { text: 'text-slate-600',  bg: 'bg-slate-50',  borderHover: 'hover:border-slate-300',  bar: 'bg-slate-500' },
  }
  
  const c = colorMap[color] || colorMap.slate
  const diffClasses = diffColor === 'teal' ? 'text-teal-600 bg-teal-50' : diffColor === 'rose' ? 'text-rose-500 bg-rose-50' : 'text-slate-500 bg-slate-50'

  return (
    <div className={`bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm ${c.borderHover} hover:shadow-md transition-all group flex flex-col justify-between h-48`}>
      <div>
        <div className="flex justify-between items-start mb-1">
          <div className={`text-slate-400 text-[10px] font-bold uppercase tracking-widest transition-colors group-hover:${c.text}`}>{title}</div>
          {diffLabel && (
            <div className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center ${diffClasses}`}>
              {diffLabel}
              <svg className={`w-3 h-3 ml-0.5 ${diffDirection === 'down' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
              </svg>
            </div>
          )}
        </div>
        <div className={`text-3xl font-black tracking-tight ${color === 'slate' ? 'text-slate-800' : c.text}`}>{currentValue}</div>
      </div>
      
      <div className="flex items-end justify-between h-16 w-full gap-2 mt-2">
        {years.map((year, idx) => {
          const val = values[idx]
          const isLast = idx === years.length - 1
          const shortYear = `'${year.slice(2)}`
          
          if (val === null || val === undefined) {
            return (
              <div key={year} className="flex flex-col items-center flex-1 h-full justify-end relative group/bar">
                <div className="bg-slate-200 h-1 w-full rounded-sm"></div>
                <span className="absolute -top-5 text-[9px] font-bold text-slate-400 opacity-0 group-hover/bar:opacity-100 w-max bg-slate-100 px-1 rounded">No Data</span>
                <span className="text-[9px] font-semibold text-slate-300 mt-1">{shortYear}</span>
              </div>
            )
          }

          const heightPercent = maxValue > 0 ? (val / maxValue) * 100 : 0
          // Adjusted colors for bar variety within the group
          const barColors = [
            'opacity-40',
            'opacity-60',
            'opacity-80',
            'opacity-90',
            '' // 100%
          ]

          return (
            <div key={year} className="flex flex-col items-center flex-1 h-full justify-end relative group/bar">
              <div 
                className={`w-full ${c.bar} rounded-sm transition-all duration-300 hover:opacity-100 ${barColors[idx]}`} 
                style={{ height: `${Math.max(4, heightPercent)}%` }}
              ></div>
              <span className="absolute -top-5 text-[9px] font-bold text-slate-500 opacity-0 group-hover/bar:opacity-100">{val}</span>
              <span className={`text-[9px] font-semibold mt-1 ${isLast ? 'text-slate-700 font-bold' : 'text-slate-400'}`}>{shortYear}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
