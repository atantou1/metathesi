'use client'

import PostingZonesMapClient from './PostingZonesMapClient'
import { Suspense, useState } from 'react'

export default function StatsPage() {
  const [selectedZone, setSelectedZone] = useState<string | undefined>(undefined)

  const handleZoneClick = (zoneName: string) => {
    // Toggle selection
    setSelectedZone(prev => prev === zoneName ? undefined : zoneName)
  }

  return (
    <div className="bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased h-[calc(100vh-65px)] flex flex-col font-display">
      
      {/* Top Filter Bar */}
      <div className="z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md px-6 py-2 flex items-center gap-3">
        <button className="flex items-center gap-2 px-4 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
          Βαθμίδα
          <span className="material-symbols-outlined text-base">expand_more</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
          Ειδικότητα
          <span className="material-symbols-outlined text-base">expand_more</span>
        </button>
      </div>

      {/* Main Content Area */}
      <main className="relative flex-1 w-full overflow-hidden">
        
        {/* Background Map Component */}
        <div className="absolute inset-0 z-0 bg-slate-100 dark:bg-slate-950 flex items-center justify-center overflow-hidden">
             <Suspense fallback={<div className="h-full w-full flex items-center justify-center bg-slate-100 dark:bg-slate-950 rounded animate-pulse">Φόρτωση χάρτη...</div>}>
                  <PostingZonesMapClient 
                    selectedZone={selectedZone}
                    onZoneClick={handleZoneClick}
                  />
              </Suspense>

            {/* Simulated Heatmap Shapes (Optional Visual enhancement) */}
            <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-sky-500/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* Floating UI Elements */}
        <div className="relative z-10 w-full h-full p-8 pointer-events-none">
          
          {/* Legend (Bottom Left) */}
          <div className="absolute bottom-8 left-8 p-5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-xl pointer-events-auto">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Ζήτηση Περιοχής</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-full h-2.5 bg-gradient-to-r from-sky-100 via-sky-400 to-sky-800 rounded-full"></div>
              </div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 w-48">
                <span>ΧΑΜΗΛΗ</span>
                <span>ΜΕΤΡΙΑ</span>
                <span>ΥΨΗΛΗ</span>
              </div>
            </div>
          </div>

          {/* Regional Stats Card (Right Side) - ONLY visible if a zone is selected */}
          {selectedZone && (
            <div className="absolute top-8 right-8 w-80 pointer-events-auto animate-in slide-in-from-right-8 fade-in duration-300">
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-500/10 text-sky-500">
                        Επιλεγμένη Περιοχή
                    </span>
                    <button 
                      onClick={() => setSelectedZone(undefined)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{selectedZone}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Περιοχή Μετάθεσης</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">Ζήτηση</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">-</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-1">Αναμονή δεδομένων</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">Προσφορά</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">-</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-1">Αναμονή δεδομένων</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Εκτίμηση Βάσης Μορίων</span>
                      <span className="font-bold text-sky-500">-</span>
                    </div>
                  </div>
                </div>
                
                <button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 transition-all flex items-center justify-center gap-2 group">
                  Αναλυτικά Στατιστικά
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
