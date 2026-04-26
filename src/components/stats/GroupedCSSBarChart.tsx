'use client'

interface ChartDataPoint {
  year: string
  val1: number | null | undefined
  val2: number | null | undefined
}

interface GroupedCSSBarChartProps {
  title: string
  subtitle: string
  data: ChartDataPoint[]
  label1: string
  label2: string
  color1: 'rose' | 'sky' | 'indigo' | 'slate'
  color2: 'rose' | 'sky' | 'indigo' | 'slate'
}

export function GroupedCSSBarChart({
  title,
  subtitle,
  data,
  label1,
  label2,
  color1,
  color2,
}: GroupedCSSBarChartProps) {
  
  // Find overall max for both series
  const allValues = data.flatMap(d => [d.val1, d.val2]).filter(v => v !== null && v !== undefined) as number[]
  const maxValue = allValues.length > 0 ? Math.max(...allValues) : 100
  
  const colorMap: Record<string, string> = {
    rose:   'bg-rose-500',
    sky:    'bg-sky-500',
    indigo: 'bg-indigo-500',
    slate:  'bg-slate-400',
    rose_light: 'bg-rose-400',
    sky_light:  'bg-sky-400',
    indigo_light: 'bg-indigo-400',
    slate_light:  'bg-slate-300'
  }

  return (
    <div className="glass-card p-6 sm:p-8 rounded-4xl flex flex-col h-full bg-white border border-slate-100 shadow-[0_8px_30px_-4px_rgba(3,105,161,0.05)]">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-1">{title}</h3>
          <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">{subtitle}</p>
        </div>
        <div className="flex items-center gap-4 mt-3 sm:mt-0 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          <div className="flex items-center gap-1.5"><div className={`w-3 h-3 rounded-sm ${colorMap[`${color1}_light`] || colorMap[color1]}`}></div> {label1}</div>
          <div className="flex items-center gap-1.5"><div className={`w-3 h-3 rounded-sm ${colorMap[`${color2}_light`] || colorMap[color2]}`}></div> {label2}</div>
        </div>
      </div>

      <div className="relative flex-1 min-h-[220px] w-full mt-4 flex items-end justify-between px-2 sm:px-8">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pb-8 pointer-events-none z-0">
          <div className="w-full border-b border-dashed border-slate-200 h-0"></div>
          <div className="w-full border-b border-dashed border-slate-200 h-0"></div>
          <div className="w-full border-b border-dashed border-slate-200 h-0"></div>
          <div className="w-full border-b border-solid border-slate-200 h-0"></div> 
        </div>

        {data.map((d, index) => {
          const h1 = d.val1 !== null && d.val1 !== undefined ? (d.val1 / maxValue) * 100 : 0
          const h2 = d.val2 !== null && d.val2 !== undefined ? (d.val2 / maxValue) * 100 : 0
          const isLatest = index === data.length - 1

          return (
            <div key={d.year} className="relative z-10 flex flex-col items-center h-full justify-end flex-1">
              <div className="flex items-end gap-1 sm:gap-2 h-full pb-8">
                {/* Bar 1 */}
                <div className="w-8 sm:w-12 flex items-end h-full">
                  {d.val1 === null || d.val1 === undefined ? (
                    <div className="bg-slate-200 h-1 w-full rounded-sm mb-0.5"></div>
                  ) : (
                    <div 
                      className={`${colorMap[color1]} rounded-t-md hover:opacity-80 transition-all relative group w-full`} 
                      style={{ height: `${Math.max(4, h1)}%` }}
                    >
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 px-1 rounded shadow-sm border border-slate-100 z-20">{d.val1}</span>
                    </div>
                  )}
                </div>
                {/* Bar 2 */}
                <div className="w-8 sm:w-12 flex items-end h-full">
                  {d.val2 === null || d.val2 === undefined ? (
                    <div className="bg-slate-200 h-1 w-full rounded-sm mb-0.5"></div>
                  ) : (
                    <div 
                      className={`${colorMap[`${color2}_light`] || colorMap[color2]} rounded-t-md hover:opacity-80 transition-all relative group w-full`} 
                      style={{ height: `${Math.max(4, h2)}%` }}
                    >
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 px-1 rounded shadow-sm border border-slate-100 z-20">{d.val2}</span>
                    </div>
                  )}
                </div>
              </div>
              <span className={`absolute bottom-0 text-xs font-bold ${isLatest ? 'text-slate-800 scale-110' : 'text-slate-500'}`}>{d.year}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
