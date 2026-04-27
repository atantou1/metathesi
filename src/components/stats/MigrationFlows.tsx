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
    <div className="bg-card border border-border shadow-soft p-6 sm:p-8 rounded-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-border pb-6 font-sans">
        <div>
          <h3 className="text-xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-info-soft text-info border border-info/20">
              <Activity className="w-5 h-5" />
            </div>
            Αναλυτικές Ροές Μετακίνησης
          </h3>
          <p className="text-[11px] font-bold text-muted-foreground mt-2 pl-14 uppercase tracking-widest">ΑΘΡΟΙΣΤΙΚΑ ΔΕΔΟΜΕΝΑ (ΙΔΑΝΙΚΟ ΓΙΑ ΑΝΑΖΗΤΗΣΗ ΑΜΟΙΒΑΙΑΣ)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 relative">
        
        {/* Inflow */}
        <div className="font-sans">
          <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-8 pb-2 border-b border-border flex items-center gap-2">
            <TrendingUp className="w-3 h-3 text-success" /> Απο που προηλθαν
          </h4>
          <div className="space-y-6">
            {visibleInflow.length > 0 ? (
              visibleInflow.map((f) => (
                <div key={f.name} className="group cursor-pointer">
                  <div className="flex justify-between items-end mb-2.5">
                    <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors uppercase tracking-tight">{f.name}</span>
                    <span className="text-[10px] font-extrabold text-muted-foreground bg-muted border border-border px-2.5 py-1 rounded-2xl">{f.count} μεταθέσεις</span>
                  </div>
                  <div className="w-full bg-muted/80 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-primary h-full rounded-full transition-all duration-700 ease-out" 
                      style={{ width: `${maxInflow > 0 ? (f.count / maxInflow) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground italic">Δεν υπάρχουν δεδομένα εισροών.</p>
            )}
          </div>
        </div>

        {/* Outflow */}
        <div className="font-sans">
          <h4 className="text-[10px] font-bold text-text-quaternary uppercase tracking-widest mb-8 pb-2 border-b border-border-dim flex items-center gap-2">
            <TrendingDown className="w-3 h-3 text-danger" /> Που θελουν να πανε
          </h4>
          <div className="space-y-6">
            {visibleOutflow.length > 0 ? (
              visibleOutflow.map((f) => (
                <div key={f.name} className="group cursor-pointer">
                  <div className="flex justify-between items-end mb-2.5">
                    <span className="text-sm font-bold text-text-secondary group-hover:text-primary-hover transition-colors uppercase tracking-tight">{f.name}</span>
                    <span className="text-[10px] font-extrabold text-primary bg-primary-soft border border-primary/20 px-2.5 py-1 rounded-2xl">{f.count} αιτήσεις</span>
                  </div>
                  <div className="w-full bg-muted/80 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-primary h-full rounded-full transition-all duration-700 ease-out" 
                      style={{ width: `${maxOutflow > 0 ? (f.count / maxOutflow) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground italic">Δεν υπάρχουν δεδομένα εκροών.</p>
            )}
          </div>
        </div>
      </div>

      {/* Unified Show All Button */}
      {hasMore && (
        <div className="mt-12 flex justify-center border-t border-border-dim pt-10">
          <button 
            onClick={() => setShowAll(!showAll)}
            className="group relative flex items-center gap-3 px-10 py-3.5 bg-card hover:bg-primary-soft border border-border hover:border-primary/20 rounded-2xl shadow-soft hover:shadow-floating transition-all duration-300 cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-100%] group-hover:translate-x-[100%] duration-1000"></div>
            <span className="relative text-[11px] font-extrabold text-foreground group-hover:text-primary uppercase tracking-widest transition-colors">
              {showAll ? 'Σύμπτυξη Λίστας' : `Προβολή Όλων (${Math.max(inflow.length, outflow.length)})`}
            </span>
            <div className={`relative transition-transform duration-500 ${showAll ? 'rotate-180' : ''}`}>
              <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
            </div>
          </button>
        </div>
      )}
    </div>
  )
}
