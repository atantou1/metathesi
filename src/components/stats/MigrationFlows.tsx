'use client'

import { useState } from 'react'
import { Activity, TrendingUp, TrendingDown, ChevronDown } from 'lucide-react'

interface MigrationFlow {
  name: string
  count: number
}

interface MigrationFlowsProps {
  inflow: MigrationFlow[]
  outflow: MigrationFlow[]
}

export function MigrationFlows({ inflow, outflow }: MigrationFlowsProps) {
  const [showAll, setShowAll] = useState(false)

  const visibleInflow = showAll ? inflow : inflow.slice(0, 5)
  const visibleOutflow = showAll ? outflow : outflow.slice(0, 5)

  const maxInflow = inflow.length > 0 ? Math.max(...inflow.map(f => f.count)) : 0
  const maxOutflow = outflow.length > 0 ? Math.max(...outflow.map(f => f.count)) : 0

  const hasMore = inflow.length > 5 || outflow.length > 5

  return (
    <div className="bg-white border border-slate-200/60 shadow-sm p-6 sm:p-8 rounded-[2rem]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-slate-100 pb-6 font-sans">
        <div>
          <h3 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-sky-50 text-sky-700 border border-sky-100">
              <Activity className="w-5 h-5" />
            </div>
            Αναλυτικές Ροές Μετακίνησης
          </h3>
          <p className="text-[11px] font-bold text-slate-400 mt-2 pl-14 uppercase tracking-widest">ΑΘΡΟΙΣΤΙΚΑ ΔΕΔΟΜΕΝΑ (ΙΔΑΝΙΚΟ ΓΙΑ ΑΝΑΖΗΤΗΣΗ ΑΜΟΙΒΑΙΑΣ)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 relative">
        
        {/* Inflow */}
        <div className="font-sans">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8 pb-2 border-b border-slate-100 flex items-center gap-2">
            <TrendingUp className="w-3 h-3 text-emerald-500" /> Απο που προηλθαν
          </h4>
          <div className="space-y-6">
            {visibleInflow.length > 0 ? (
              visibleInflow.map((f) => (
                <div key={f.name} className="group cursor-pointer">
                  <div className="flex justify-between items-end mb-2.5">
                    <span className="text-sm font-bold text-slate-700 group-hover:text-sky-700 transition-colors uppercase tracking-tight">{f.name}</span>
                    <span className="text-[10px] font-extrabold text-slate-500 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">{f.count} μεταθέσεις</span>
                  </div>
                  <div className="w-full bg-slate-100/80 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-[#0284C7] h-full rounded-full transition-all duration-700 ease-out" 
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
        <div className="font-sans">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8 pb-2 border-b border-slate-100 flex items-center gap-2">
            <TrendingDown className="w-3 h-3 text-rose-500" /> Που θελουν να πανε
          </h4>
          <div className="space-y-6">
            {visibleOutflow.length > 0 ? (
              visibleOutflow.map((f) => (
                <div key={f.name} className="group cursor-pointer">
                  <div className="flex justify-between items-end mb-2.5">
                    <span className="text-sm font-bold text-slate-700 group-hover:text-sky-700 transition-colors uppercase tracking-tight">{f.name}</span>
                    <span className="text-[10px] font-extrabold text-sky-700 bg-sky-50 border border-sky-100 px-2.5 py-1 rounded-lg">{f.count} αιτήσεις</span>
                  </div>
                  <div className="w-full bg-slate-100/80 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-[#0284C7] h-full rounded-full transition-all duration-700 ease-out" 
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

      {/* Unified Show All Button */}
      {hasMore && (
        <div className="mt-12 flex justify-center border-t border-slate-50 pt-10">
          <button 
            onClick={() => setShowAll(!showAll)}
            className="group relative flex items-center gap-3 px-10 py-3.5 bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-sky-50/0 via-sky-50/50 to-sky-50/0 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-100%] group-hover:translate-x-[100%] duration-1000"></div>
            <span className="relative text-[11px] font-extrabold text-slate-600 group-hover:text-sky-800 uppercase tracking-widest transition-colors">
              {showAll ? 'Σύμπτυξη Λίστας' : `Προβολή Όλων (${Math.max(inflow.length, outflow.length)})`}
            </span>
            <div className={`relative transition-transform duration-500 ${showAll ? 'rotate-180' : ''}`}>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-sky-700" />
            </div>
          </button>
        </div>
      )}
    </div>
  )
}
