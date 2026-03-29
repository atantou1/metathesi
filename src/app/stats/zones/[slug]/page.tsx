import Link from 'next/link'
import { BaseScoreChart } from '@/components/stats/BaseScoreChart'
import { SupplyDemandChart } from '@/components/stats/SupplyDemandChart'

export default function ZoneDetailedStatsPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { division?: string; specialty?: string }
}) {
  // Simple slug un-formatting for display purposes
  const rawDecodedZone = decodeURIComponent(params.slug)
  const zoneName = rawDecodedZone.includes('-') 
    ? rawDecodedZone.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : rawDecodedZone

  const specialty = searchParams.specialty || 'Άγνωστη Ειδικότητα'

  return (
    <div className="p-4 pt-24 md:p-8 md:pt-28 text-slate-900 antialiased min-h-screen bg-slate-50 font-sans">
      <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between bg-white border border-slate-100 shadow-[0_8px_30px_-4px_rgba(3,105,161,0.05)] p-6 sm:p-8 rounded-[2rem]">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <Link 
                href={`/stats`}
                className="text-slate-500 hover:text-[#0369a1] hover:bg-sky-50 transition-colors flex items-center text-xs font-bold px-3 py-1.5 rounded-xl border border-transparent hover:border-sky-100 cursor-pointer"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Επιστροφή στον Χάρτη
              </Link>
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-50 text-slate-500 border border-slate-200">
                {specialty}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">{zoneName}</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Αναλυτική αναφορά ιστορικών δεδομένων 2022-2026</p>
          </div>
          
          <div className="mt-5 md:mt-0 flex flex-col items-start md:items-end">
            <span className="px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest bg-rose-50 text-rose-600 border border-rose-100 shadow-sm flex items-center">
              <span className="h-2 w-2 rounded-full bg-rose-500 mr-2.5 animate-pulse shadow-[0_0_5px_rgba(244,63,94,0.5)]"></span>
              Ακραία Δυσκολία
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 px-1">Δείκτης: Ζήτηση / Προσφορά</span>
          </div>
        </div>

        {/* 4 Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6">
          <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:border-slate-200 hover:shadow-md transition-all group">
            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-3 group-hover:text-slate-600 transition-colors">Αιτησεις Φυγης (Φετος)</div>
            <div className="text-3xl font-black text-slate-800 tracking-tight">124</div>
            <div className="text-xs font-medium text-slate-500 mt-2">Εκπαιδευτικοί θέλουν να φύγουν</div>
          </div>
          
          <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:border-sky-200 hover:bg-sky-50/30 hover:shadow-md transition-all group">
            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-3 group-hover:text-sky-600 transition-colors">1η Προτιμηση (Φετος)</div>
            <div className="text-3xl font-black text-[#0369a1] tracking-tight">145</div>
            <div className="text-[11px] font-bold text-sky-600 mt-2 flex items-center bg-sky-50 w-fit px-2 py-0.5 rounded-md border border-sky-100">
              Από 133 πέρυσι <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:border-sky-200 hover:bg-sky-50/30 hover:shadow-md transition-all group">
            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-3 group-hover:text-sky-600 transition-colors">Μεταθεσεις (Περυσι)</div>
            <div className="text-3xl font-black text-sky-500 tracking-tight">8</div>
            <div className="text-xs font-medium text-slate-500 mt-2">Θέσεις που δόθηκαν</div>
          </div>
          
          <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:border-rose-100 hover:bg-rose-50/30 hover:shadow-md transition-all group">
            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-3 group-hover:text-rose-500 transition-colors">Βαση Μοριων (Περυσι)</div>
            <div className="text-3xl font-black text-slate-800 tracking-tight">72.45</div>
            <div className="text-xs font-medium text-slate-500 mt-2">Υψηλότερη 5ετίας</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          <div className="bg-white border border-slate-100 shadow-[0_8px_30px_-4px_rgba(3,105,161,0.05)] p-6 sm:p-8 rounded-[2rem]">
            <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-1">Ιστορικό Μορίων</h3>
            <p className="text-[11px] font-medium text-slate-500 mb-8 uppercase tracking-wider">Πώς κινήθηκε η βάση και ο μέσος όρος την τελευταία 5ετία</p>
            <div className="relative h-[300px] w-full">
               <BaseScoreChart />
            </div>
          </div>

          <div className="bg-white border border-slate-100 shadow-[0_8px_30px_-4px_rgba(3,105,161,0.05)] p-6 sm:p-8 rounded-[2rem]">
            <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-1">Ισοζύγιο Προσφοράς & Ζήτησης</h3>
            <p className="text-[11px] font-medium text-slate-500 mb-8 uppercase tracking-wider">Σύγκριση αιτήσεων (1η επιλογή) με πραγματικές μεταθέσεις</p>
            <div className="relative h-[300px] w-full">
               <SupplyDemandChart />
            </div>
          </div>

        </div>

        {/* Inflow / Outflow Detailed Flows */}
        <div className="bg-white border border-slate-100 shadow-[0_8px_30px_-4px_rgba(3,105,161,0.05)] p-6 sm:p-8 rounded-[2rem]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-slate-100 pb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
                <div className="p-2 rounded-xl bg-sky-50 text-[#0369A1]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
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
            
            {/* Inflow Origins */}
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 pb-2">Απο που προηλθαν (Οσοι ηρθαν εδω)</h4>
              <div className="space-y-5">
                <div className="group cursor-pointer">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-teal-600 transition-colors">Β' Πειραιά</span>
                    <span className="text-[11px] font-bold text-slate-600 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md shadow-sm">12 μεταθέσεις</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
                    <div className="bg-gradient-to-r from-teal-400 to-teal-600 h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
                <div className="group cursor-pointer">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-teal-600 transition-colors">Κυκλάδες</span>
                    <span className="text-[11px] font-bold text-slate-600 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md shadow-sm">8 μεταθέσεις</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
                    <div className="bg-gradient-to-r from-teal-400 to-teal-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
                <div className="group cursor-pointer">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-teal-600 transition-colors">Βοιωτία</span>
                    <span className="text-[11px] font-bold text-slate-600 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md shadow-sm">5 μεταθέσεις</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
                    <div className="bg-gradient-to-r from-teal-300 to-teal-400 h-2 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
                <button className="text-xs font-bold text-[#0369a1] hover:text-sky-700 hover:bg-sky-50 px-3 py-2 rounded-xl transition-colors mt-2 inline-flex items-center gap-1 cursor-pointer">
                  Δείτε όλες τις περιοχές 
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                </button>
              </div>
            </div>

            {/* Outflow Targets */}
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 pb-2">Που θελουν να πανε (Οσοι φευγουν)</h4>
              <div className="space-y-5">
                <div className="group cursor-pointer">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-[#0369a1] transition-colors">Β' Αθήνας</span>
                    <span className="text-[11px] font-bold text-[#0369a1] bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-md shadow-sm">45 αιτήσεις</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
                    <div className="bg-gradient-to-r from-sky-400 to-[#0369a1] h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                <div className="group cursor-pointer">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-[#0369a1] transition-colors">Ανατολική Αττική</span>
                    <span className="text-[11px] font-bold text-[#0369a1] bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-md shadow-sm">32 αιτήσεις</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
                    <div className="bg-gradient-to-r from-sky-400 to-[#075985] h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div className="group cursor-pointer">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-[#0369a1] transition-colors">Κόρινθος</span>
                    <span className="text-[11px] font-bold text-[#0369a1] bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-md shadow-sm">15 αιτήσεις</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
                    <div className="bg-gradient-to-r from-sky-300 to-sky-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
                <button className="text-xs font-bold text-[#0369a1] hover:text-sky-700 hover:bg-sky-50 px-3 py-2 rounded-xl transition-colors mt-2 inline-flex items-center gap-1 cursor-pointer">
                  Δείτε όλες τις περιοχές 
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
