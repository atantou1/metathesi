'use client'

interface MigrationFlow {
  name: string
  count: number
}

interface MigrationFlowsProps {
  inflow: MigrationFlow[]
  outflow: MigrationFlow[]
}

export function MigrationFlows({ inflow, outflow }: MigrationFlowsProps) {
  const maxInflow = inflow.length > 0 ? Math.max(...inflow.map(f => f.count)) : 0
  const maxOutflow = outflow.length > 0 ? Math.max(...outflow.map(f => f.count)) : 0

  return (
    <div className="glass-card p-6 sm:p-8 rounded-[2rem] bg-white border border-slate-100 shadow-[0_8px_30px_-4px_rgba(3,105,161,0.05)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-slate-100 pb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-50 text-[#0369A1]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
              </svg>
            </div>
            Αναλυτικές Ροές Μετακίνησης
          </h3>
          <p className="text-xs font-medium text-slate-500 mt-2 pl-12">Αθροιστικά δεδομένα όλων των ετών (Ιδανικό για αναζήτηση αμοιβαίας)</p>
        </div>
        <span className="bg-sky-50 text-[#0369a1] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border border-sky-100 shadow-sm">
          Δυναμική Ανάλυση
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        
        {/* Inflow */}
        <div>
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 pb-2 border-b border-slate-100">Απο που προηλθαν (Οσοι ηρθαν εδω)</h4>
          <div className="space-y-5">
            {inflow.length > 0 ? (
              inflow.map((f, i) => (
                <div key={f.name} className="group cursor-pointer">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-teal-600 transition-colors">{f.name}</span>
                    <span className="text-[11px] font-bold text-slate-600 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md shadow-sm">{f.count} μεταθέσεις</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner font-sans">
                    <div 
                      className="bg-gradient-to-r from-teal-400 to-teal-600 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${maxInflow > 0 ? (f.count / maxInflow) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">Δεν υπάρχουν δεδομένα εισροών.</p>
            )}
          </div>
        </div>

        {/* Outflow */}
        <div>
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 pb-2 border-b border-slate-100">Που θελουν να πανε (Οσοι φευγουν)</h4>
          <div className="space-y-5">
            {outflow.length > 0 ? (
              outflow.map((f, i) => (
                <div key={f.name} className="group cursor-pointer">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-[#0369a1] transition-colors">{f.name}</span>
                    <span className="text-[11px] font-bold text-[#0369a1] bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-md shadow-sm">{f.count} αιτήσεις</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner font-sans">
                    <div 
                      className="bg-gradient-to-r from-sky-400 to-[#0369a1] h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${maxOutflow > 0 ? (f.count / maxOutflow) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">Δεν υπάρχουν δεδομένα εκροών.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
